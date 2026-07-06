import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, View, type ViewStyle } from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";

import {
  BRAND_QR_DEFAULT_ACCENT,
  BRAND_QR_DEFAULT_SIZE,
  BRAND_QR_DOTS,
  BRAND_QR_ERROR_LEVEL,
  BRAND_QR_PADDING,
  brandQrContainerStyle,
  brandQrIncludesLogo,
  brandQrInnerEyesOptions,
  brandQrLogoOptions,
  brandQrOuterEyesOptions,
} from "@/lib/share/brandQrConfig";
import { brandQrDataUri } from "@/lib/share/brandQrDataUri";

export type BrandQrCodeProps = {
  data: string;
  size?: number;
  accentColor?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
  includeLogo?: boolean;
  padding?: number;
  onReady?: () => void;
};

type WebQrProps = Pick<
  BrandQrCodeProps,
  "data" | "size" | "accessibilityLabel" | "style" | "padding" | "onReady"
>;

function BrandQrCodeWeb({ data, size, accessibilityLabel, style, padding, onReady }: WebQrProps) {
  const qrSize = size ?? BRAND_QR_DEFAULT_SIZE;
  const marginModules = Math.max(1, Math.round((padding ?? BRAND_QR_PADDING) / 2));
  const [dataUri, setDataUri] = useState<string | null>(null);
  const readySentRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    readySentRef.current = false;
    setDataUri(null);
    void brandQrDataUri(data, qrSize, marginModules).then((uri) => {
      if (!cancelled) setDataUri(uri);
    });
    return () => {
      cancelled = true;
    };
  }, [data, qrSize, marginModules]);

  const notifyReady = () => {
    if (readySentRef.current) return;
    readySentRef.current = true;
    onReady?.();
  };

  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[brandQrContainerStyle(qrSize), style]}
    >
      {dataUri ? (
        <Image
          source={{ uri: dataUri }}
          style={{ width: qrSize, height: qrSize }}
          accessibilityIgnoresInvertColors
          onLoad={() => requestAnimationFrame(() => notifyReady())}
        />
      ) : (
        <View
          style={{ width: qrSize, height: qrSize, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="small" color={BRAND_QR_DOTS} />
        </View>
      )}
    </View>
  );
}

function BrandQrCodeNative({
  data,
  size = BRAND_QR_DEFAULT_SIZE,
  accentColor = BRAND_QR_DEFAULT_ACCENT,
  accessibilityLabel,
  style,
  includeLogo,
  padding = BRAND_QR_PADDING,
  onReady,
}: BrandQrCodeProps) {
  const readySentRef = useRef(false);
  const showLogo = includeLogo ?? brandQrIncludesLogo(size);

  useEffect(() => {
    readySentRef.current = false;
  }, []);

  const notifyReady = () => {
    if (readySentRef.current) return;
    readySentRef.current = true;
    onReady?.();
  };

  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={style}
      onLayout={notifyReady}
    >
      <QRCodeStyled
        data={data}
        size={size}
        padding={padding}
        color={BRAND_QR_DOTS}
        errorCorrectionLevel={BRAND_QR_ERROR_LEVEL}
        pieceBorderRadius="50%"
        innerEyesOptions={brandQrInnerEyesOptions}
        outerEyesOptions={brandQrOuterEyesOptions(accentColor)}
        logo={showLogo ? brandQrLogoOptions : undefined}
        style={brandQrContainerStyle(size)}
      />
    </View>
  );
}

/** Branded QR with rounded dot modules, styled finder eyes, and optional centered app icon. */
export function BrandQrCode(props: BrandQrCodeProps) {
  if (Platform.OS === "web") {
    return <BrandQrCodeWeb {...props} />;
  }
  return <BrandQrCodeNative {...props} />;
}
