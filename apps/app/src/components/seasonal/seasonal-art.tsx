import type { ReactElement } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { withAlpha } from "@/constants/theme";
import { useIsRTL } from "@/lib/rtl";
import type { SeasonalThemeId, SeasonalVisualPalette } from "@/lib/seasonal-themes";
import { ArafahArt } from "./arafah-art";
import { AshuraArt } from "./ashura-art";
import { EidAdhaArt } from "./eid-adha-art";
import { EidFitrArt } from "./eid-fitr-art";
import { HajjArt } from "./hajj-art";
import { LastTenArt } from "./last-ten-art";
import { LaylatQadrArt } from "./laylat-qadr-art";
import { NewYearArt } from "./new-year-art";
import { RamadanArt } from "./ramadan-art";

type SeasonalArtProps = {
  id: SeasonalThemeId;
  visual: SeasonalVisualPalette;
};

/**
 * Seasonal banner artwork, drawn on the end side of the banner. Native mirrors
 * the art's physical `left`/`right` offsets with the RTL layout; web keeps
 * them physical, so the art is flipped there to stay clear of the copy.
 */
export function SeasonalArt(props: SeasonalArtProps) {
  const mirrorOnWeb = useIsRTL() && Platform.OS === "web";
  const art = <SeasonalArtBody {...props} />;
  if (!mirrorOnWeb) return art;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.mirror]}>
      {art}
    </View>
  );
}

function SeasonalArtBody({ id, visual }: SeasonalArtProps): ReactElement {
  const glow = withAlpha(visual.glow, 0.5);
  const softGlow = withAlpha(visual.glow, 0.45);
  const band = withAlpha(visual.glow, 0.75);

  switch (id) {
    case "newYear":
      return (
        <NewYearArt color={visual.artColor} starColor={visual.starColor} glowColor={softGlow} />
      );
    case "ashura":
      return <AshuraArt color={visual.artColor} glowColor={softGlow} />;
    case "ramadan":
      return <RamadanArt color={visual.artColor} starColor={visual.starColor} glowColor={glow} />;
    case "lastTen":
      return <LastTenArt color={visual.artColor} starColor={visual.starColor} glowColor={glow} />;
    case "laylatQadr":
      return (
        <LaylatQadrArt
          color={visual.artColor}
          starColor={visual.starColor}
          glowColor={withAlpha(visual.glow, 0.55)}
        />
      );
    case "eidFitr":
      return <EidFitrArt color={visual.artColor} starColor={visual.starColor} glowColor={glow} />;
    case "hajj":
      return <HajjArt color={visual.artColor} glowColor={softGlow} bandColor={band} />;
    case "arafah":
      return <ArafahArt color={visual.artColor} glowColor={glow} />;
    case "eidAdha":
      return (
        <EidAdhaArt
          color={visual.artColor}
          glowColor={softGlow}
          bandColor={band}
          starColor={visual.starColor}
        />
      );
  }
}

const styles = StyleSheet.create({
  mirror: { transform: [{ scaleX: -1 }] },
});
