import { withAlpha } from "@/constants/theme";
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

export function SeasonalArt({ id, visual }: SeasonalArtProps) {
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
