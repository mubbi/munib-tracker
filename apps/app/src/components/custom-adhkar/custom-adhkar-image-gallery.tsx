import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { apiAuthHeaders } from "@/api/auth-options";
import { AttachmentMediaLoader, AttachmentThumb } from "@/components/attachments/attachment-thumb";
import { PdfPreview } from "@/components/attachments/pdf-preview";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isPdfMime } from "@/lib/attachments/attachment-mime";
import { openAttachmentExternally } from "@/lib/attachments/open-attachment-externally";
import { useChevronBack, useChevronForward } from "@/lib/rtl";
import { userMediaContentUrl } from "@/lib/user-media-api";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import type { CustomAdhkarImage } from "@/stores/custom-adhkar-store";

const MIN_SCALE = 1;
const MAX_SCALE = 5;

type ViewerItem = {
  key: string;
  uri: string;
  mimeType: string;
  filename: string;
  headers?: Record<string, string>;
};

function resolveViewerItems(
  images: CustomAdhkarImage[],
  accessToken: string | undefined,
): ViewerItem[] {
  const items: ViewerItem[] = [];
  images.forEach((image, index) => {
    const mimeType = image.mimeType || "image/jpeg";
    const filename = image.filename ?? `attachment-${index + 1}`;
    if (image.mediaId && accessToken) {
      items.push({
        key: `${image.mediaId}-${index}`,
        uri: userMediaContentUrl(image.mediaId),
        mimeType,
        filename,
        headers: apiAuthHeaders(accessToken),
      });
      return;
    }
    if (image.localUri) {
      items.push({
        key: `${image.localUri}-${index}`,
        uri: image.localUri,
        mimeType,
        filename,
      });
    }
  });
  return items;
}

function ZoomableImage({
  uri,
  headers,
  width,
  height,
}: {
  uri: string;
  headers?: Record<string, string>;
  width: number;
  height: number;
}) {
  const [ready, setReady] = useState(false);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  useEffect(() => {
    setReady(false);
  }, []);

  const clampTranslation = (nextScale: number, x: number, y: number) => {
    "worklet";
    const maxX = ((nextScale - 1) * width) / 2;
    const maxY = ((nextScale - 1) * height) / 2;
    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  };

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      const next = Math.min(Math.max(savedScale.value * event.scale, MIN_SCALE), MAX_SCALE);
      scale.value = next;
      const clamped = clampTranslation(next, translateX.value, translateY.value);
      translateX.value = clamped.x;
      translateY.value = clamped.y;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= 1.01) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((event) => {
      if (savedScale.value <= 1.01) return;
      const clamped = clampTranslation(
        savedScale.value,
        savedTranslateX.value + event.translationX,
        savedTranslateY.value + event.translationY,
      );
      translateX.value = clamped.x;
      translateY.value = clamped.y;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (savedScale.value > 1.01) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        return;
      }
      scale.value = withTiming(2.5);
      savedScale.value = 2.5;
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={{ width, height }}>
      {!ready ? <AttachmentMediaLoader onDark style={StyleSheet.absoluteFill} /> : null}
      <GestureDetector gesture={composed}>
        <Animated.View style={[{ width, height, opacity: ready ? 1 : 0 }, animatedStyle]}>
          <Image
            source={{ uri, headers }}
            style={{ width, height }}
            contentFit="contain"
            transition={180}
            onLoad={() => setReady(true)}
            onError={() => setReady(true)}
            accessibilityIgnoresInvertColors
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export function CustomAdhkarImageGallery({
  images,
  compact = false,
}: {
  images: CustomAdhkarImage[];
  compact?: boolean;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const { session } = useAuth();
  const toast = useToast();
  const chevronBack = useChevronBack();
  const chevronForward = useChevronForward();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const resolved = useMemo(
    () => resolveViewerItems(images, session?.accessToken),
    [images, session?.accessToken],
  );

  useEffect(() => {
    if (viewerIndex !== null && viewerIndex >= resolved.length) {
      setViewerIndex(null);
    }
  }, [resolved.length, viewerIndex]);

  const closeViewer = useCallback(() => setViewerIndex(null), []);
  const showPrev = useCallback(() => {
    setViewerIndex((current) => (current === null || current <= 0 ? current : current - 1));
  }, []);
  const showNext = useCallback(() => {
    setViewerIndex((current) =>
      current === null || current >= resolved.length - 1 ? current : current + 1,
    );
  }, [resolved.length]);

  const openPdfExternally = useCallback(
    async (item: ViewerItem) => {
      try {
        await openAttachmentExternally({
          uri: item.uri,
          mimeType: item.mimeType,
          fileName: item.filename,
          dialogTitle: t("customAdhkar.attachments.openPdf"),
          headers: item.headers,
        });
      } catch {
        toast.error(t("customAdhkar.attachments.openFailed"));
      }
    },
    [t, toast],
  );

  if (resolved.length === 0) return null;

  const active = viewerIndex !== null ? resolved[viewerIndex] : null;
  const thumbSize = compact ? 72 : 96;
  const activeIsPdf = active ? isPdfMime(active.mimeType) : false;
  const stageHeight = Math.max(240, windowHeight - (activeIsPdf ? 180 : 140));

  return (
    <>
      <View style={styles.grid}>
        {resolved.map((item, index) => (
          <PressableScale
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={t("customAdhkar.attachments.open", { index: index + 1 })}
            haptic="light"
            onPress={() => setViewerIndex(index)}
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderColor: colors.border,
                backgroundColor: colors.muted,
              },
            ]}
          >
            <AttachmentThumb
              uri={item.uri}
              mimeType={item.mimeType}
              headers={item.headers}
              iconSize={compact ? 22 : 26}
            />
          </PressableScale>
        ))}
      </View>

      <Modal
        visible={active !== null}
        transparent
        animationType="fade"
        onRequestClose={closeViewer}
        statusBarTranslucent
      >
        <View style={styles.viewerBackdrop}>
          <View style={styles.viewerTop}>
            <ThemedText type="caption" style={styles.viewerCounter}>
              {viewerIndex !== null
                ? t("customAdhkar.attachments.counter", {
                    current: viewerIndex + 1,
                    total: resolved.length,
                  })
                : ""}
            </ThemedText>
            <IconButton
              name={{ ios: "xmark", android: "close", web: "close" }}
              size={20}
              tintColor="#FFFFFF"
              accessibilityLabel={t("common.close")}
              onPress={closeViewer}
            />
          </View>

          {active ? (
            <View style={[styles.viewerStage, { height: stageHeight }]}>
              {activeIsPdf ? (
                <PdfPreview
                  key={active.key}
                  uri={active.uri}
                  fileName={active.filename}
                  headers={active.headers}
                  style={{ width: windowWidth - Spacing.four * 2, height: stageHeight }}
                  onOpenExternally={() => void openPdfExternally(active)}
                />
              ) : (
                <ZoomableImage
                  key={active.key}
                  uri={active.uri}
                  headers={active.headers}
                  width={windowWidth}
                  height={stageHeight}
                />
              )}
            </View>
          ) : null}

          <ThemedText type="caption" style={styles.viewerHint}>
            {activeIsPdf
              ? t("customAdhkar.attachments.pdfHint")
              : t("customAdhkar.attachments.zoomHint")}
          </ThemedText>

          {resolved.length > 1 ? (
            <View style={styles.viewerNav}>
              <IconButton
                name={chevronBack}
                size={22}
                tintColor="#FFFFFF"
                accessibilityLabel={t("customAdhkar.attachments.previous")}
                onPress={showPrev}
                disabled={viewerIndex === 0}
              />
              <IconButton
                name={chevronForward}
                size={22}
                tintColor="#FFFFFF"
                accessibilityLabel={t("customAdhkar.attachments.next")}
                onPress={showNext}
                disabled={viewerIndex === resolved.length - 1}
              />
            </View>
          ) : null}

          {active && activeIsPdf ? (
            <View style={styles.pdfActions}>
              <Button
                label={t("customAdhkar.attachments.openPdf")}
                onPress={() => void openPdfExternally(active)}
              />
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  thumb: {
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  viewerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "space-between",
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
  },
  viewerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
  },
  viewerCounter: { color: "#FFFFFF" },
  viewerStage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
  viewerHint: {
    color: "rgba(255,255,255,0.72)",
    textAlign: "center",
    paddingHorizontal: Spacing.four,
  },
  viewerNav: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.five,
    paddingTop: Spacing.two,
  },
  pdfActions: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
});
