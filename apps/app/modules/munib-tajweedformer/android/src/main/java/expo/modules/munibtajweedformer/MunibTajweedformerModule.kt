package expo.modules.munibtajweedformer

import ai.quranlab.tajweedformer.TajweedClient
import ai.quranlab.tajweedformer.TajweedClientOptions
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
 * Quran Lab TajweedFormer bridge (Phase 6). Four calls: Client, model, listen, read.
 *
 * Privacy: this module never offers recitation sharing. It does not call
 * `sharing.ask()` and hosts no `SharingSheetHost` / `SharingSettingsView`, so the
 * SDK has nowhere to show its consent sheet from this app. It only exposes the
 * learner's off switch, "Delete what I shared" and the recovery code. Analytics are
 * off (`Analytics.OFF`).
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

    AsyncFunction("configure") Coroutine { key: String ->
      guarded {
        if (client == null) {
          val context = appContext.reactContext?.applicationContext
            ?: throw CodedException("engine_failed", "No React context", null)
          client = TajweedClient(
            context,
            key,
            TajweedClientOptions(analytics = TajweedClientOptions.Analytics.OFF),
          )
        }
      }
    }

    AsyncFunction("prefetch") Coroutine { ->
      guarded {
        requireClient().prefetch(unmeteredOnly = false) { done, total ->
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
      throw CodedException(errorCode(e), e.message ?: e.javaClass.simpleName, e)
    }
  }

  /**
   * The SDK's `TajweedError.code`, read reflectively so this file does not depend
   * on whether the property is a String or an enum. Unknown errors → "engine_failed".
   */
  private fun errorCode(error: Throwable): String {
    if (error.javaClass.simpleName != "TajweedError") return "engine_failed"
    val raw = try {
      error.javaClass.getMethod("getCode").invoke(error)
    } catch (_: Throwable) {
      null
    } ?: return "engine_failed"
    val text = raw.toString()
    return if (raw is Enum<*>) text.lowercase() else text
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
