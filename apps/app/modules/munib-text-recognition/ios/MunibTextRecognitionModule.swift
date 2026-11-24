import ExpoModulesCore
import UIKit
import Vision

/// NF-3.12 timetable OCR on iOS: Apple Vision `VNRecognizeTextRequest`
/// (`.accurate`, `usesLanguageCorrection = false`), languages `en-US` + `ar-SA`
/// when the OS supports them (checked at runtime). Runs entirely on the device;
/// the image is never uploaded. Vision returns lines, so each line is split on
/// whitespace and every word is boxed with `boundingBox(for:)`, in upright image
/// pixels with a top-left origin.
public class MunibTextRecognitionModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MunibTextRecognition")

    Function("isSupported") { () -> Bool in
      return true
    }

    AsyncFunction("recognize") { (uri: String, promise: Promise) in
      DispatchQueue.global(qos: .userInitiated).async {
        do {
          promise.resolve(try MunibTextRecognitionModule.recognize(uri: uri))
        } catch {
          promise.reject("ERR_OCR", error.localizedDescription)
        }
      }
    }
  }

  private struct OcrError: LocalizedError {
    let errorDescription: String?
  }

  private static func orientation(_ o: UIImage.Orientation) -> CGImagePropertyOrientation {
    switch o {
    case .up: return .up
    case .upMirrored: return .upMirrored
    case .down: return .down
    case .downMirrored: return .downMirrored
    case .left: return .left
    case .leftMirrored: return .leftMirrored
    case .right: return .right
    case .rightMirrored: return .rightMirrored
    @unknown default: return .up
    }
  }

  static func recognize(uri: String) throws -> [String: Any] {
    let url = URL(string: uri) ?? URL(fileURLWithPath: uri)
    guard let data = try? Data(contentsOf: url), let image = UIImage(data: data),
      let cgImage = image.cgImage
    else {
      throw OcrError(errorDescription: "Could not open the image")
    }
    let imageOrientation = orientation(image.imageOrientation)
    let sideways: [CGImagePropertyOrientation] = [.left, .leftMirrored, .right, .rightMirrored]
    let rotated = sideways.contains(imageOrientation)
    let width = Double(rotated ? cgImage.height : cgImage.width)
    let height = Double(rotated ? cgImage.width : cgImage.height)

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = false
    let wanted = ["en-US", "ar-SA"]
    if let supported = try? request.supportedRecognitionLanguages() {
      let languages = wanted.filter { supported.contains($0) }
      if !languages.isEmpty { request.recognitionLanguages = languages }
    }

    let handler = VNImageRequestHandler(cgImage: cgImage, orientation: imageOrientation, options: [:])
    try handler.perform([request])

    var tokens: [[String: Any]] = []
    for observation in request.results ?? [] {
      guard let candidate = observation.topCandidates(1).first else { continue }
      let text = candidate.string
      var cursor = text.startIndex
      while cursor < text.endIndex {
        guard let start = text[cursor...].firstIndex(where: { !$0.isWhitespace }) else { break }
        let end = text[start...].firstIndex(where: { $0.isWhitespace }) ?? text.endIndex
        let range = start..<end
        cursor = end
        let rect = (try? candidate.boundingBox(for: range))?.boundingBox ?? observation.boundingBox
        // Vision boxes are normalised with a bottom-left origin.
        tokens.append([
          "text": String(text[range]),
          "conf": Double(candidate.confidence),
          "box": [
            "x": Double(rect.minX) * width,
            "y": (1 - Double(rect.maxY)) * height,
            "w": Double(rect.width) * width,
            "h": Double(rect.height) * height,
          ],
        ])
      }
    }
    return ["tokens": tokens, "width": width, "height": height]
  }
}
