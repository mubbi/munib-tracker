import Foundation
import TVServices

/// Apple TV Top Shelf for Munib Tracker (TV prebuild only — `plugins/withTvTopShelf.cjs`).
///
/// The app writes a JSON payload to the shared App Group (`MunibTvHome` module,
/// built from the widget snapshot in `src/lib/tv-home/tv-home-payload.ts`). Items
/// carry validity windows, so this provider shows only what is current — e.g. the
/// right "Next Salah" — and sets `expirationDate` so tvOS asks again at the next
/// boundary, even while the app stays closed. With no payload (first launch, no App
/// Group) it returns nil and tvOS shows the static Top Shelf image.
final class ContentProvider: TVTopShelfContentProvider {
  override func loadTopShelfContent(completionHandler: @escaping (TVTopShelfContent?) -> Void) {
    completionHandler(TopShelfPayload.load()?.content(now: Date()))
  }
}

private let payloadKey = "munib.tvHome.payload"

struct TopShelfPayload: Decodable {
  struct Item: Decodable {
    let id: String
    let shortTitle: String
    let deepLink: String
    let art: String
    let validFromMs: Double?
    let validUntilMs: Double?
  }

  struct Section: Decodable {
    let id: String
    let title: String
    let items: [Item]
  }

  let version: Int
  let sections: [Section]

  static func load() -> TopShelfPayload? {
    guard
      let group = Bundle.main.object(forInfoDictionaryKey: "MunibAppGroup") as? String,
      let defaults = UserDefaults(suiteName: group),
      let json = defaults.string(forKey: payloadKey),
      let data = json.data(using: .utf8),
      let payload = try? JSONDecoder().decode(TopShelfPayload.self, from: data),
      payload.version == 1
    else {
      return nil
    }
    return payload
  }

  func content(now: Date) -> TVTopShelfContent? {
    let nowMs = now.timeIntervalSince1970 * 1000
    var collections: [TVTopShelfItemCollection<TVTopShelfSectionedItem>] = []

    for section in sections {
      var seen = Set<String>()
      var items: [TVTopShelfSectionedItem] = []
      for entry in section.items {
        // First currently-valid variant per id (next-Salah variants share one id).
        if seen.contains(entry.id) { continue }
        if let from = entry.validFromMs, nowMs < from { continue }
        if let until = entry.validUntilMs, nowMs >= until { continue }
        guard let url = URL(string: entry.deepLink) else { continue }
        seen.insert(entry.id)

        let item = TVTopShelfSectionedItem(identifier: entry.id)
        item.title = entry.shortTitle
        item.imageShape = .hdtv
        if let art = Bundle.main.url(forResource: "tv_home_\(entry.art)", withExtension: "png") {
          item.setImageURL(art, for: .screenScale1x)
          item.setImageURL(art, for: .screenScale2x)
        }
        item.displayAction = TVTopShelfAction(url: url)
        if let until = entry.validUntilMs {
          item.expirationDate = Date(timeIntervalSince1970: until / 1000)
        }
        items.append(item)
      }
      guard !items.isEmpty else { continue }
      let collection = TVTopShelfItemCollection(items: items)
      collection.title = section.title
      collections.append(collection)
    }

    return collections.isEmpty ? nil : TVTopShelfSectionedContent(sections: collections)
  }
}
