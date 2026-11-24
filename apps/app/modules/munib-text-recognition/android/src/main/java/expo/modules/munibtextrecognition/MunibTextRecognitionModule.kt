package expo.modules.munibtextrecognition

import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * NF-3.12 timetable OCR on Android: ML Kit Text Recognition v2 with the bundled
 * Latin model. Runs entirely on the device: the image is never uploaded and no
 * model is downloaded at runtime. Output contract (`src/lib/timetable-ocr`):
 * `{ tokens: [{ text, conf, box: { x, y, w, h } }], width, height }`, one token
 * per recognised word, in upright image pixels (EXIF rotation applied).
 */
class MunibTextRecognitionModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MunibTextRecognition")

    Function("isSupported") { true }

    AsyncFunction("recognize") { uri: String, promise: Promise ->
      val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
      val image = try {
        InputImage.fromFilePath(context, Uri.parse(uri))
      } catch (e: Exception) {
        promise.reject(CodedException("ERR_OCR_IMAGE", e.message ?: "Could not open the image", e))
        return@AsyncFunction
      }
      val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
      recognizer.process(image)
        .addOnSuccessListener { text ->
          val tokens = ArrayList<Map<String, Any>>()
          for (block in text.textBlocks) {
            for (line in block.lines) {
              for (element in line.elements) {
                val box = element.boundingBox ?: continue
                tokens.add(
                  mapOf(
                    "text" to element.text,
                    "conf" to element.confidence.toDouble(),
                    "box" to mapOf(
                      "x" to box.left.toDouble(),
                      "y" to box.top.toDouble(),
                      "w" to box.width().toDouble(),
                      "h" to box.height().toDouble(),
                    ),
                  ),
                )
              }
            }
          }
          recognizer.close()
          promise.resolve(
            mapOf(
              "tokens" to tokens,
              "width" to image.width.toDouble(),
              "height" to image.height.toDouble(),
            ),
          )
        }
        .addOnFailureListener { e ->
          recognizer.close()
          promise.reject(CodedException("ERR_OCR", e.message ?: "Text recognition failed", e))
        }
    }
  }
}
