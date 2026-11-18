const { withDangerousMod, withSettingsGradle } = require("@expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

function withWearOs(config) {
  config = withSettingsGradle(config, (config) => {
    const contents = config.modResults.contents;
    if (!contents.includes(":wear")) {
      config.modResults.contents = `${contents.trim()}\ninclude ':wear'\n`;
    }
    return config;
  });

  config = withDangerousMod(config, [
    "android",
    async (config) => {
      const root = config.modRequest.platformProjectRoot;
      const wearDir = path.join(root, "wear");
      fs.mkdirSync(path.join(wearDir, "src/main/java/expo/modules/munibwear"), {
        recursive: true,
      });

      fs.writeFileSync(
        path.join(wearDir, "build.gradle"),
        `plugins {
    id 'com.android.application'
}

// AGP 9 compiles Kotlin itself ("built-in Kotlin"). The Expo SDK 58 template opts out with
// android.builtInKotlin=false until AGP 10; only then is the Kotlin Gradle plugin applied here.
if ((findProperty('android.builtInKotlin') ?: 'true').toString() == 'false') {
    apply plugin: 'org.jetbrains.kotlin.android'
    kotlin {
        compilerOptions {
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17)
        }
    }
}

def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

def safeExtGet = { String prop, fallback ->
    rootProject.ext.has(prop) ? rootProject.ext.get(prop) : fallback
}

android {
    // Unique namespace: modules/munib-wear (the phone-side listener) owns expo.modules.munibwear.
    namespace 'app.munibtracker.wear'
    compileSdk safeExtGet('compileSdkVersion', 37)

    defaultConfig {
        // The Wearable Data Layer only connects apps that share the phone app's application ID
        // and signing key. Play ships this as the Wear OS form factor of app.munibtracker.
        applicationId "app.munibtracker"
        minSdk 30
        targetSdk safeExtGet('targetSdkVersion', 36)
        // apps/app/.env is the single source of truth (release scripts export it).
        versionCode Integer.parseInt(System.getenv("EXPO_WEAR_VERSION_CODE") ?: "1")
        versionName System.getenv("EXPO_ANDROID_APP_VERSION") ?: "1.0.0"
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    signingConfigs {
        debug {
            // Same debug keystore as :app so debug builds can talk over the Data Layer.
            storeFile rootProject.file('app/debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile rootProject.file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            minifyEnabled false
            if (keystorePropertiesFile.exists()) {
                signingConfig signingConfigs.release
            } else if (gradle.startParameter.taskNames.any { it.toLowerCase().contains("release") }) {
                throw new GradleException("[withWearOs] android/keystore.properties missing — refusing to sign a Wear release with the debug key.")
            }
        }
    }
}

dependencies {
    implementation 'androidx.wear.tiles:tiles:1.6.2'
    implementation 'androidx.wear.protolayout:protolayout:1.4.2'
    implementation 'androidx.wear.protolayout:protolayout-material:1.4.2'
    implementation 'com.google.android.gms:play-services-wearable:20.0.1'
    implementation 'com.google.guava:guava:33.8.0-android'
}
`,
      );

      fs.writeFileSync(
        path.join(wearDir, "src/main/AndroidManifest.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  <uses-feature android:name="android.hardware.type.watch" />
  <application android:label="Munib Tracker">
    <service
      android:name="expo.modules.munibwear.MunibWearTileService"
      android:exported="true"
      android:label="Munib Tracker"
      android:permission="com.google.android.wearable.permission.BIND_TILE_PROVIDER">
      <intent-filter>
        <action android:name="androidx.wear.tiles.action.BIND_TILE_PROVIDER" />
      </intent-filter>
      <meta-data
        android:name="androidx.wear.tiles.PREVIEW"
        android:resource="@drawable/tile_preview" />
    </service>
    <service
      android:name="expo.modules.munibwear.MunibWearTasbeehTileService"
      android:exported="true"
      android:label="Tasbeeh"
      android:permission="com.google.android.wearable.permission.BIND_TILE_PROVIDER">
      <intent-filter>
        <action android:name="androidx.wear.tiles.action.BIND_TILE_PROVIDER" />
      </intent-filter>
      <meta-data
        android:name="androidx.wear.tiles.PREVIEW"
        android:resource="@drawable/tile_preview_tasbeeh" />
    </service>
  </application>
</manifest>
`,
      );

      const drawable = path.join(wearDir, "src/main/res/drawable");
      fs.mkdirSync(drawable, { recursive: true });
      fs.writeFileSync(
        path.join(drawable, "tile_preview.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
  <solid android:color="#059669"/>
</shape>
`,
      );

      fs.writeFileSync(
        path.join(drawable, "tile_preview_tasbeeh.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
  <solid android:color="#D97706"/>
</shape>
`,
      );

      fs.writeFileSync(
        path.join(wearDir, "src/main/java/expo/modules/munibwear/MunibWearTileService.kt"),
        `package expo.modules.munibwear

import android.content.Context
import androidx.wear.protolayout.ActionBuilders
import androidx.wear.protolayout.LayoutElementBuilders
import androidx.wear.protolayout.ModifiersBuilders
import androidx.wear.protolayout.TimelineBuilders
import androidx.wear.protolayout.material.Text
import androidx.wear.tiles.RequestBuilders
import androidx.wear.tiles.TileBuilders
import androidx.wear.tiles.TileService
import com.google.android.gms.tasks.Tasks
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.Wearable
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import org.json.JSONObject

private const val SNAPSHOT_PATH = "/munib/widget_snapshot"
private const val CLICK_MARK_CURRENT = "mark_current"

class MunibWearTileService : TileService() {
  override fun onTileRequest(requestParams: RequestBuilders.TileRequest): ListenableFuture<TileBuilders.Tile> {
    if (requestParams.currentState.lastClickableId == CLICK_MARK_CURRENT) {
      sendMarkCurrent(applicationContext)
    }

    val snapshot = readSnapshot(applicationContext)
    val strings = snapshot?.optJSONObject("strings")
    val line1 = snapshot?.optJSONObject("nextPrayer")?.optString("prayerName") ?: "Munib Tracker"
    val line2 = snapshot?.optJSONObject("nextPrayer")?.optString("prayerTime")
      ?: strings?.optString("markSalah")
      ?: "Mark Salah"

    val clickable = ModifiersBuilders.Clickable.Builder()
      .setId(CLICK_MARK_CURRENT)
      .setOnClick(ActionBuilders.LoadAction.Builder().build())
      .build()

    val column = LayoutElementBuilders.Column.Builder()
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setClickable(clickable)
          .build()
      )
      .addContent(Text.Builder(applicationContext, line1).build())
      .addContent(Text.Builder(applicationContext, line2).build())
      .build()

    val layout = LayoutElementBuilders.Layout.Builder()
      .setRoot(column)
      .build()

    val tile = TileBuilders.Tile.Builder()
      .setResourcesVersion("1")
      .setTileTimeline(
        TimelineBuilders.Timeline.Builder()
          .addTimelineEntry(
            TimelineBuilders.TimelineEntry.Builder()
              .setLayout(layout)
              .build()
          )
          .build()
      )
      .build()

    return Futures.immediateFuture(tile)
  }

  private fun readSnapshot(context: Context): JSONObject? {
    return try {
      val client = Wearable.getDataClient(context)
      val items = Tasks.await(client.getDataItems(android.net.Uri.parse("wear://*$SNAPSHOT_PATH")))
      val buffer = DataMapItem.fromDataItem(items.first()).dataMap.getString("snapshot") ?: return null
      JSONObject(buffer)
    } catch (_: Exception) {
      null
    }
  }

  private fun sendMarkCurrent(context: Context) {
    try {
      val nodes = Tasks.await(Wearable.getNodeClient(context).connectedNodes)
      val nodeId = nodes.firstOrNull()?.id ?: return
      Tasks.await(
        Wearable.getMessageClient(context).sendMessage(
          nodeId,
          "/munib/mark_current",
          ByteArray(0),
        )
      )
    } catch (_: Exception) {
      /* phone unreachable */
    }
  }
}
`,
      );

      fs.writeFileSync(
        path.join(wearDir, "src/main/java/expo/modules/munibwear/MunibWearTasbeehTileService.kt"),
        `package expo.modules.munibwear

import android.content.Context
import android.content.SharedPreferences
import androidx.wear.protolayout.ActionBuilders
import androidx.wear.protolayout.LayoutElementBuilders
import androidx.wear.protolayout.ModifiersBuilders
import androidx.wear.protolayout.TimelineBuilders
import androidx.wear.protolayout.material.Text
import androidx.wear.tiles.RequestBuilders
import androidx.wear.tiles.TileBuilders
import androidx.wear.tiles.TileService
import com.google.android.gms.tasks.Tasks
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.Wearable
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import org.json.JSONObject

/**
 * Second Wear tile: a local-only tasbeeh (dhikr) counter. Unlike the next-Salah
 * tile, this never talks to the phone — the count and target live entirely on
 * the watch (SharedPreferences), mirroring the watchOS Digital Crown counter.
 */
private const val TASBEEH_PREFS = "munib_wear_tasbeeh"
private const val TASBEEH_SNAPSHOT_PATH = "/munib/widget_snapshot"
private const val KEY_COUNT = "count"
private const val KEY_TARGET = "target"
private const val CLICK_INCREMENT = "tasbeeh_increment"
private const val CLICK_RESET = "tasbeeh_reset"
private val TARGET_CLICK_IDS = mapOf(
  "tasbeeh_target_33" to 33,
  "tasbeeh_target_99" to 99,
  "tasbeeh_target_100" to 100,
  "tasbeeh_target_0" to 0,
)

class MunibWearTasbeehTileService : TileService() {
  override fun onTileRequest(requestParams: RequestBuilders.TileRequest): ListenableFuture<TileBuilders.Tile> {
    val prefs = tasbeehPrefs(applicationContext)
    val clickId = requestParams.currentState.lastClickableId

    when {
      clickId == CLICK_RESET -> prefs.edit().putInt(KEY_COUNT, 0).apply()
      clickId == CLICK_INCREMENT -> {
        val target = prefs.getInt(KEY_TARGET, 33)
        val current = prefs.getInt(KEY_COUNT, 0)
        val next = if (target > 0) minOf(current + 1, target) else current + 1
        prefs.edit().putInt(KEY_COUNT, next).apply()
      }
      TARGET_CLICK_IDS.containsKey(clickId) -> {
        prefs.edit()
          .putInt(KEY_TARGET, TARGET_CLICK_IDS[clickId] ?: 33)
          .putInt(KEY_COUNT, 0)
          .apply()
      }
    }

    val count = prefs.getInt(KEY_COUNT, 0)
    val target = prefs.getInt(KEY_TARGET, 33)
    val countLabel = if (target > 0) "$count / $target" else "$count"
    val strings = readSnapshot(applicationContext)?.optJSONObject("strings")
    val tasbeehLabel = strings?.optString("tasbeeh")?.takeIf { it.isNotBlank() } ?: "Tasbeeh"
    val resetLabel = strings?.optString("reset")?.takeIf { it.isNotBlank() } ?: "Reset"

    val incrementClickable = ModifiersBuilders.Clickable.Builder()
      .setId(CLICK_INCREMENT)
      .setOnClick(ActionBuilders.LoadAction.Builder().build())
      .build()

    val resetClickable = ModifiersBuilders.Clickable.Builder()
      .setId(CLICK_RESET)
      .setOnClick(ActionBuilders.LoadAction.Builder().build())
      .build()

    val incrementArea = LayoutElementBuilders.Column.Builder()
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setClickable(incrementClickable)
          .build()
      )
      .addContent(Text.Builder(applicationContext, tasbeehLabel).build())
      .addContent(Text.Builder(applicationContext, countLabel).build())
      .build()

    val resetArea = LayoutElementBuilders.Column.Builder()
      .setModifiers(
        ModifiersBuilders.Modifiers.Builder()
          .setClickable(resetClickable)
          .build()
      )
      .addContent(Text.Builder(applicationContext, resetLabel).build())
      .build()

    val column = LayoutElementBuilders.Column.Builder()
      .addContent(incrementArea)
      .addContent(resetArea)
      .build()

    val layout = LayoutElementBuilders.Layout.Builder()
      .setRoot(column)
      .build()

    val tile = TileBuilders.Tile.Builder()
      .setResourcesVersion("1")
      .setTileTimeline(
        TimelineBuilders.Timeline.Builder()
          .addTimelineEntry(
            TimelineBuilders.TimelineEntry.Builder()
              .setLayout(layout)
              .build()
          )
          .build()
      )
      .build()

    return Futures.immediateFuture(tile)
  }
}

private fun tasbeehPrefs(context: Context): SharedPreferences =
  context.getSharedPreferences(TASBEEH_PREFS, Context.MODE_PRIVATE)

private fun readSnapshot(context: Context): JSONObject? {
  return try {
    val client = Wearable.getDataClient(context)
    val items = Tasks.await(client.getDataItems(android.net.Uri.parse("wear://*$TASBEEH_SNAPSHOT_PATH")))
    val buffer = DataMapItem.fromDataItem(items.first()).dataMap.getString("snapshot") ?: return null
    JSONObject(buffer)
  } catch (_: Exception) {
    null
  }
}
`,
      );

      return config;
    },
  ]);

  return config;
}

module.exports = withWearOs;
