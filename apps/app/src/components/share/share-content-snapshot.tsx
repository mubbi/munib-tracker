import { forwardRef, useMemo } from "react";
import { View, type ViewProps } from "react-native";

import { ShareProofFooter } from "@/components/share/share-proof-footer";
import { ShareProofHeader } from "@/components/share/share-proof-header";
import { ShareProofSectionTitle } from "@/components/share/share-proof-section-title";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  computeShareProofQrSize,
  SHARE_PROOF_HORIZONTAL_PADDING,
} from "@/lib/share/shareProofLayout";

type Props = Omit<ViewProps, "children"> & {
  frameWidth: number;
  sectionTitle: string;
  contentLabel?: string;
  exportedAtLabel: string;
  onQrReady: () => void;
  children: React.ReactNode;
};

export const ShareContentSnapshot = forwardRef<View, Props>(function ShareContentSnapshot(
  { frameWidth, sectionTitle, contentLabel, exportedAtLabel, onQrReady, children, style, ...rest },
  ref,
) {
  const { colors } = useThemeTokens();
  const qrSize = useMemo(() => computeShareProofQrSize(frameWidth), [frameWidth]);

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        {
          width: frameWidth,
          backgroundColor: colors.background,
          paddingHorizontal: SHARE_PROOF_HORIZONTAL_PADDING,
          paddingVertical: Spacing.three,
          gap: Spacing.three,
        },
        style,
      ]}
      {...rest}
    >
      <ShareProofHeader />
      <ShareProofSectionTitle title={sectionTitle} />
      {children}
      <ShareProofFooter
        contentLabel={contentLabel}
        exportedAtLabel={exportedAtLabel}
        qrSize={qrSize}
        onQrReady={onQrReady}
      />
    </View>
  );
});
