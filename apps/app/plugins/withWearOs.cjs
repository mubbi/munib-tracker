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
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'expo.modules.munibwear'
    compileSdk 36

    defaultConfig {
        applicationId "app.munibtracker.wear"
        minSdk 30
        targetSdk 36
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
        }
    }
}

dependencies {
    implementation 'androidx.wear.tiles:tiles:1.4.0'
    implementation 'androidx.wear.protolayout:protolayout:1.2.1'
    implementation 'androidx.wear.protolayout:protolayout-material:1.2.1'
    implementation 'com.google.android.gms:play-services-wearable:18.2.0'
    implementation 'com.google.guava:guava:33.3.1-android'
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
      android:name=".MunibWearTileService"
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
        path.join(wearDir, "src/main/java/expo/modules/munibwear/MunibWearTileService.kt"),
        `package expo.modules.munibwear

import android.content.Context
import androidx.wear.protolayout.LayoutElementBuilders
import androidx.wear.protolayout.TimelineBuilders
import androidx.wear.protolayout.material.Text
import androidx.wear.tiles.EventBuilders
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

class MunibWearTileService : TileService() {
  override fun onTileRequest(requestParams: RequestBuilders.TileRequest): ListenableFuture<TileBuilders.Tile> {
    val snapshot = readSnapshot(applicationContext)
    val line1 = snapshot?.optJSONObject("nextPrayer")?.optString("prayerName") ?: "Munib Tracker"
    val line2 = snapshot?.optJSONObject("nextPrayer")?.optString("prayerTime") ?: "Open phone app"

    val column = LayoutElementBuilders.Column.Builder()
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

  override fun onTileAddEvent(requestParams: EventBuilders.TileAddEvent) {
    sendMarkCurrent(applicationContext)
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

      return config;
    },
  ]);

  return config;
}

module.exports = withWearOs;
