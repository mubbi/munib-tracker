import { useQuery } from "@tanstack/react-query";

import { fetchFxRates, usdQuoteRate } from "@/api/fx-rates";
import {
  fetchMetalSpotPrices,
  formatPriceInput,
  type MetalSpotPrices,
  metalPriceInCurrency,
} from "@/api/metal-prices";
import { DEFAULT_NUMBER_FORMAT, type NumberFormatStyle } from "@/lib/format-currency";

export type ZakatMarketPrices = {
  goldPerGram: number;
  silverPerGram: number;
  goldInput: string;
  silverInput: string;
  metals: MetalSpotPrices;
  fxDate: string;
  currencyCode: string;
  hasFxRate: boolean;
};

async function loadZakatMarketPrices(
  currencyCode: string,
  numberFormat: NumberFormatStyle,
): Promise<ZakatMarketPrices | null> {
  const [metals, fx] = await Promise.all([fetchMetalSpotPrices(), fetchFxRates("USD")]);
  if (!metals || !fx) return null;

  const code = currencyCode.trim().toUpperCase() || "USD";
  const rate = usdQuoteRate(fx, code);
  const goldPerGram = metalPriceInCurrency(metals.goldUsdPerGram, code, fx.rates);
  const silverPerGram = metalPriceInCurrency(metals.silverUsdPerGram, code, fx.rates);

  if (goldPerGram == null || silverPerGram == null) {
    // Currency not in Frankfurter — still return USD spots so UI can fall back.
    return {
      goldPerGram: metals.goldUsdPerGram,
      silverPerGram: metals.silverUsdPerGram,
      goldInput: formatPriceInput(metals.goldUsdPerGram, numberFormat),
      silverInput: formatPriceInput(metals.silverUsdPerGram, numberFormat),
      metals,
      fxDate: fx.date,
      currencyCode: "USD",
      hasFxRate: code === "USD",
    };
  }

  return {
    goldPerGram,
    silverPerGram,
    goldInput: formatPriceInput(goldPerGram, numberFormat),
    silverInput: formatPriceInput(silverPerGram, numberFormat),
    metals,
    fxDate: fx.date,
    currencyCode: code,
    hasFxRate: rate != null,
  };
}

/**
 * Live FX + gold/silver spot for the zakat calculator. Prefills nisab and metal
 * weight prices in the selected currency and number format.
 */
export function useZakatMarketData(
  currencyCode: string,
  numberFormat: NumberFormatStyle = DEFAULT_NUMBER_FORMAT,
) {
  return useQuery({
    queryKey: ["zakat-market", currencyCode, numberFormat],
    queryFn: () => loadZakatMarketPrices(currencyCode, numberFormat),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
