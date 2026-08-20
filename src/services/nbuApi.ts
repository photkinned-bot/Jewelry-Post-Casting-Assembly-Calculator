export interface NBURateResult {
  gold_999: number;
  silver_999: number;
  platinum_999: number;
  date: string;
  source: 'live_nbu' | 'cached' | 'fallback';
}

export type MetalRatesResult = {
  rates: {
    gold_999: number;
    silver_999: number;
    platinum_999: number;
  };
  date: string;
  source: 'live_nbu' | 'cached' | 'fallback';
};

const TROY_OUNCE_IN_GRAMS = 31.1034768;
const CACHE_KEY = 'jewelry_calc_nbu_cache_v1';
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

// Fallback rates if API cannot be reached
export const FALLBACK_NBU_RATES = {
  gold_999: 3380.5,
  silver_999: 42.8,
  platinum_999: 1390.0,
};

export async function fetchNBUMetalRates(forceRefresh = false): Promise<NBURateResult> {
  // 1. Check local cache first if not forced
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
          return {
            gold_999: parsed.rates.gold_999,
            silver_999: parsed.rates.silver_999,
            platinum_999: parsed.rates.platinum_999,
            date: parsed.date,
            source: 'cached',
          };
        }
      }
    } catch {
      // ignore cache read error
    }
  }

  // 2. Try fetching from server proxy or direct NBU API
  try {
    let rawData: Array<{ cc: string; rate: number; exchangedate?: string }> | null = null;

    // Try server proxy first if available
    try {
      const proxyRes = await fetch('/api/nbu-rates', { signal: AbortSignal.timeout(4000) });
      if (proxyRes.ok) {
        rawData = await proxyRes.json();
      }
    } catch {
      // proxy fallback
    }

    // Direct NBU API if proxy didn't respond
    if (!rawData || !Array.isArray(rawData)) {
      const nbuRes = await fetch(
        'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
        { signal: AbortSignal.timeout(6000) }
      );
      if (!nbuRes.ok) {
        throw new Error(`Помилка запиту до НБУ: HTTP ${nbuRes.status}`);
      }
      rawData = await nbuRes.json();
    }

    let goldRateOunce = 0;
    let silverRateOunce = 0;
    let platinumRateOunce = 0;
    let exchangeDate = new Date().toLocaleDateString('uk-UA');

    if (Array.isArray(rawData)) {
      for (const item of rawData) {
        if (item.cc === 'XAU') {
          goldRateOunce = Number(item.rate);
          if (item.exchangedate) exchangeDate = item.exchangedate;
        } else if (item.cc === 'XAG') {
          silverRateOunce = Number(item.rate);
        } else if (item.cc === 'XPT') {
          platinumRateOunce = Number(item.rate);
        }
      }
    }

    const gold_999 = goldRateOunce > 0 ? Number((goldRateOunce / TROY_OUNCE_IN_GRAMS).toFixed(2)) : FALLBACK_NBU_RATES.gold_999;
    const silver_999 = silverRateOunce > 0 ? Number((silverRateOunce / TROY_OUNCE_IN_GRAMS).toFixed(2)) : FALLBACK_NBU_RATES.silver_999;
    const platinum_999 = platinumRateOunce > 0 ? Number((platinumRateOunce / TROY_OUNCE_IN_GRAMS).toFixed(2)) : FALLBACK_NBU_RATES.platinum_999;

    const rates = { gold_999, silver_999, platinum_999 };

    // Save to cache
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          date: exchangeDate,
          rates,
        })
      );
    } catch {
      // ignore cache write error
    }

    return {
      ...rates,
      date: exchangeDate,
      source: 'live_nbu',
    };
  } catch (err: unknown) {
    console.warn('Could not fetch live NBU rates, falling back to local defaults:', err);

    return {
      ...FALLBACK_NBU_RATES,
      date: new Date().toLocaleDateString('uk-UA'),
      source: 'fallback',
    };
  }
}

export const fetchNbuMetalRates = fetchNBUMetalRates;
