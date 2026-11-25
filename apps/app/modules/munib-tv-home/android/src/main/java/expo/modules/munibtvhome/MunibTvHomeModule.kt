package expo.modules.munibtvhome

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.speech.RecognizerIntent
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

private const val VOICE_REQUEST_CODE = 0x7A51

/**
 * Android TV: launcher channel row + system voice prompt. tvOS-only functions
 * (Top Shelf) report unsupported here.
 */
class MunibTvHomeModule : Module() {
  private var pendingVoice: Promise? = null

  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("MunibTvHome")

    Function("isChannelSupported") { TvHomeChannelPublisher.isSupported(context) }

    AsyncFunction("publishChannel") { payloadJson: String ->
      TvHomeChannelPublisher.savePayload(context, payloadJson)
      TvHomeChannelPublisher.publish(context, payloadJson)
    }

    AsyncFunction("clearChannel") { TvHomeChannelPublisher.clear(context) }

    Function("isTopShelfSupported") { false }

    AsyncFunction("publishTopShelf") { _: String, _: String -> false }

    // The recognizer activity (Google app / Assistant on Android TV) records audio,
    // so this app needs no RECORD_AUDIO — which the TV build blocks anyway.
    Function("isVoiceSearchAvailable") {
      val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
      context.packageManager.queryIntentActivities(intent, 0).isNotEmpty()
    }

    AsyncFunction("startVoiceSearch") { prompt: String?, language: String?, promise: Promise ->
      val activity = appContext.currentActivity
      if (activity == null) {
        promise.resolve(null)
        return@AsyncFunction
      }
      // A newer request replaces one that never returned.
      pendingVoice?.resolve(null)
      pendingVoice = promise
      val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
        putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        if (!prompt.isNullOrBlank()) putExtra(RecognizerIntent.EXTRA_PROMPT, prompt)
        if (!language.isNullOrBlank()) putExtra(RecognizerIntent.EXTRA_LANGUAGE, language)
      }
      try {
        activity.startActivityForResult(intent, VOICE_REQUEST_CODE)
      } catch (e: ActivityNotFoundException) {
        pendingVoice = null
        promise.reject("ERR_VOICE_UNAVAILABLE", "No speech recognizer on this device", e)
      }
    }.runOnQueue(Queues.MAIN)

    OnActivityResult { _, payload ->
      if (payload.requestCode != VOICE_REQUEST_CODE) return@OnActivityResult
      val promise = pendingVoice ?: return@OnActivityResult
      pendingVoice = null
      val text =
        if (payload.resultCode == Activity.RESULT_OK) {
          payload.data
            ?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
            ?.firstOrNull { it.isNotBlank() }
        } else {
          null
        }
      promise.resolve(text)
    }
  }
}
