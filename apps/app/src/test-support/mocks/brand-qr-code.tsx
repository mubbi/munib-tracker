/**
 * Shared `@/components/share/brand-qr-code` mock — no QR rendering or data-URI
 * generation. Renders a text node `qr:<size>:<data>` (labelled with the QR's
 * accessibility label) and fires `onReady` once on mount.
 *
 *   jest.mock("@/components/share/brand-qr-code", () =>
 *     require("@/test-support/mocks/brand-qr-code").brandQrCodeMock);
 */
import { useEffect } from "react";
import { Text } from "react-native";

type Props = { data: string; size?: number; accessibilityLabel?: string; onReady?: () => void };

function BrandQrCode({ data, size, accessibilityLabel, onReady }: Props) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return <Text accessibilityLabel={accessibilityLabel}>{`qr:${size}:${data}`}</Text>;
}

export const brandQrCodeMock = { __esModule: true, BrandQrCode };
