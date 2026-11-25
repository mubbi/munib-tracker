package expo.modules.munibtajweedformer

import ai.quranlab.tajweedformer.SharingTheme
import ai.quranlab.tajweedformer.TajweedClient
import ai.quranlab.tajweedformer.TajweedError
import ai.quranlab.tajweedformer.TajweedEvent
import ai.quranlab.tajweedformer.TajweedModel
import ai.quranlab.tajweedformer.TajweedSession
import ai.quranlab.tajweedformer.TajweedSessionOptions
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

/**
 * Quran Lab TajweedFormer bridge (SDK 4.x). Four calls: Client, model, listen, read.
 *
 * SDK 4 (D66): anonymous analytics and error reports are always on (the analytics
 * option no longer exists), and the SDK itself asks every learner — at most three
 * times, never right after the install — whether to share recordings, on its own
 * sheet over the activity in front. This module never calls `sharing.ask()`; it
 * themes that sheet to match the app (`SharingTheme.current`) and exposes the
 * learner's switch, "Delete what I shared" and the recovery code. The app's
 * version and build are read by the SDK from the package (`versionName`/code).
 */
class MunibTajweedformerModule : Module() {
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
  private var client: TajweedClient? = null
  private var model: TajweedModel? = null
  private var session: TajweedSession? = null
  private var takeJobs: List<Job> = emptyList()

  override fun definition() = ModuleDefinition {
    Name("MunibTajweedformer")

    Events("onProgress", "onChunk", "onEnded")

    OnActivityEntersForeground {
      client?.foreground()
    }

    OnActivityEntersBackground {
      client?.background()
    }

    OnDestroy {
      cancelTakeQuietly()
      scope.cancel()
    }

    AsyncFunction("configure") Coroutine { key: String, theme: Map<String, String>? ->
      guarded {
        if (client == null) {
          val context = appContext.reactContext?.applicationContext
            ?: throw CodedException("engine_failed", "No React context", null)
          theme?.let { sharingTheme(it) }?.let { SharingTheme.current = it }
          client = TajweedClient(context, key)
        }
      }
    }

    AsyncFunction("prefetch") Coroutine { ->
      guarded {
        requireClient().prefetch { done, total ->
          sendEvent("onProgress", mapOf("done" to done.toDouble(), "total" to total.toDouble()))
        }
      }
    }

    AsyncFunction("openModel") Coroutine { ->
      guarded {
        val opened = model ?: requireClient().model().also { model = it }
        mapOf(
          "version" to opened.version,
          "build" to opened.build,
          "defaultContext" to opened.defaultContext,
          "calibrationJson" to opened.calibration?.json,
        )
      }
    }

    // Opens the model ahead of the first take. Android 4.0 runs the Core's CPU engine
    // only (no NPU program is served yet), so there is nothing more to warm.
    AsyncFunction("prepareTake") Coroutine { _: List<String> ->
      guarded {
        model ?: requireClient().model().also { model = it }
        "cpu"
      }
    }

    // `client.diagnose().toJson()`: the SDK's own support report (no audio, text or identifiers).
    AsyncFunction("diagnose") Coroutine { ->
      client?.let { current ->
        try {
          current.diagnose().toJson()
        } catch (_: Throwable) {
          null
        }
      }
    }

    AsyncFunction("startTake") Coroutine { heads: List<String>, endOnSilenceMs: Int ->
      guarded {
        cancelTakeQuietly()
        val opened = model ?: requireClient().model().also { model = it }
        val options = TajweedSessionOptions(
          heads = heads,
          endOnSilenceMs = if (endOnSilenceMs > 0) endOnSilenceMs else null,
        )
        val take = opened.listen(options)
        session = take
        takeJobs = listOf(
          scope.launch {
            take.chunks.collect { chunk ->
              sendEvent(
                "onChunk",
                mapOf(
                  "speech" to chunk.speech,
                  "text" to chunk.decoded.text,
                  "index" to chunk.index,
                ),
              )
            }
          },
          scope.launch {
            take.events.collect { event ->
              if (event is TajweedEvent.Ended) {
                sendEvent(
                  "onEnded",
                  mapOf(
                    "reason" to event.reason.name.lowercase().replace("_", ""),
                    "errorCode" to event.error?.let { errorCode(it) },
                  ),
                )
              }
            }
          },
        )
      }
    }

    AsyncFunction("finishTake") Coroutine { ->
      guarded {
        val take = session ?: throw CodedException("session_closed", "No take is open", null)
        try {
          val heads = take.finish()
          mapOf(
            "heads" to heads.names.mapNotNull { name ->
              val head = heads[name] ?: return@mapNotNull null
              mapOf(
                "name" to head.name,
                "frameMs" to head.frameMs,
                "frames" to head.frames,
                "classes" to head.classes,
                "values" to head.values.map { it.toDouble() },
              )
            },
          )
        } finally {
          session = null
          takeJobs.forEach { it.cancel() }
          takeJobs = emptyList()
        }
      }
    }

    AsyncFunction("cancelTake") Coroutine { ->
      cancelTakeQuietly()
    }

    AsyncFunction("removeModels") Coroutine { ->
      guarded {
        cancelTakeQuietly()
        model = null
        requireClient().removeModels()
      }
    }

    AsyncFunction("storageBytes") Coroutine { ->
      guarded { modelBytes(client?.storage) }
    }

    AsyncFunction("sharingState") Coroutine { ->
      guarded {
        val sharing = requireClient().sharing
        mapOf(
          "isAvailable" to sharing.isAvailable,
          "isOn" to sharing.isOn,
          "recoveryCode" to sharing.recoveryCode,
        )
      }
    }

    AsyncFunction("setSharingOn") Coroutine { on: Boolean ->
      guarded { requireClient().sharing.setOn(on) }
    }

    AsyncFunction("deleteShared") Coroutine { ->
      guarded { requireClient().sharing.delete() }
    }

    AsyncFunction("close") Coroutine { ->
      cancelTakeQuietly()
      model = null
      // The Kotlin client has no close(); dropping it lets a new one be made later.
      client = null
    }
  }

  private fun requireClient(): TajweedClient =
    client ?: throw CodedException("invalid_argument", "configure(key) was not called", null)

  private fun cancelTakeQuietly() {
    try {
      session?.cancel()
    } catch (_: Throwable) {
      // already ended
    }
    session = null
    takeJobs.forEach { it.cancel() }
    takeJobs = emptyList()
  }

  /** Re-throw any failure as a CodedException carrying the SDK's stable error code. */
  private suspend fun <T> guarded(block: suspend () -> T): T {
    try {
      return block()
    } catch (e: CodedException) {
      throw e
    } catch (e: Throwable) {
      throw CodedException(errorCode(e), errorMessage(e), e)
    }
  }

  /** The SDK's stable `TajweedError.code`; anything else is "engine_failed". */
  private fun errorCode(error: Throwable): String =
    (error as? TajweedError)?.code ?: "engine_failed"

  /**
   * SDK 4.0.2's `errorCause` as a `[needs=model|lease stage=… reason=… http=…] `
   * prefix on the message (tokens only — never a URL or an identifier). The JS
   * client parses `needs` to tell "connect to download" from "connect to continue".
   */
  private fun errorMessage(error: Throwable): String {
    val base = error.message ?: error.javaClass.simpleName
    val cause = (error as? TajweedError)?.errorCause ?: return base
    val parts = mutableListOf("stage=${cause.stage}", "reason=${cause.reason}")
    cause.needs?.let { parts.add(0, "needs=$it") }
    cause.httpStatus?.let { parts.add("http=$it") }
    return "[${parts.joinToString(" ")}] $base"
  }

  /** The SDK's sharing sheet in the app's colours (`#RRGGBB` from JS). Words never change. */
  private fun sharingTheme(theme: Map<String, String>): SharingTheme? {
    val accent = argb(theme["accent"]) ?: return null
    return SharingTheme(
      background = argb(theme["background"]),
      text = argb(theme["text"]),
      secondaryText = argb(theme["secondaryText"]),
      accent = accent,
      dark = theme["dark"]?.let { it == "true" },
    )
  }

  private fun argb(hex: String?): Int? {
    val raw = hex?.trim()?.removePrefix("#") ?: return null
    if (raw.length != 6) return null
    val rgb = raw.toLongOrNull(16) ?: return null
    return (0xFF000000L or rgb).toInt()
  }

  /** Sum of model bytes from `client.storage` (`{ models: [{ bytes }] }`); 0 when unknown. */
  private fun modelBytes(storage: Map<String, Any>?): Double {
    val models = storage?.get("models") as? List<*> ?: return 0.0
    var total = 0.0
    for (entry in models) {
      val bytes = (entry as? Map<*, *>)?.get("bytes")
      if (bytes is Number) total += bytes.toDouble()
    }
    return total
  }
}
