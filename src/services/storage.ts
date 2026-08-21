import { AppState, DefaultPrices, PriceDiffItem, ProjectSaveSchema } from '../types';
import { INITIAL_DEFAULT_PRICES } from '../data/defaultPrices';

export const STORAGE_KEY_STATE = 'jewelry_calc_state_v2';
export const STORAGE_KEY_CUSTOM_PRICES = 'jewelry_calc_custom_prices_v2';
export const SCHEMA_VERSION = '2.0';

export function getDefaultInitialState(): AppState {
  return {
    general: {
      productType: 'ring',
      productName: 'Каблучка з діамантом',
      orderNumber: '001',
      metal: 'gold_585',
      weight: 3.5,
      lossPercent: 6.0,
    },
    metalPricing: {
      isManualOverride: false,
      manualPricePerGram: null,
      nbuRates: {
        gold_999: 3380.5,
        silver_999: 42.8,
        platinum_999: 1390.0,
        lastUpdated: null,
        isLoading: false,
        error: null,
      },
    },
    productionPrep: {
      design3d: {
        enabled: false,
        price: 500,
      },
      casting: {
        enabled: false,
        type: 'fixed',
        price: 200,
      },
    },
    works: {
      grinding: {
        enabled: true,
        type: 'fixed',
        qty: 1,
        price: 200,
      },
      soldering: {
        enabled: true,
        qty: 1,
        price: 120,
      },
      assembly: {
        enabled: true,
        qty: 1,
        price: 250,
      },
      customElements: {
        enabled: false,
        qty: 1,
        price: 300,
      },
    },
    stones: [
      {
        id: 'stone_init_1',
        settingType: 'krapan',
        stoneType: 'cz',
        qty: 1,
        settingPrice: 40,
        stoneCostPerUnit: 0,
        comment: 'Центральний камінь',
      },
    ],
    finishing: {
      polishing: {
        enabled: true,
        type: 'manual',
        qty: 1,
        price: 150,
      },
      matting: {
        enabled: false,
        type: 'sandblast',
        qty: 1,
        price: 120,
      },
      engraving: {
        enabled: false,
        qty: 10,
        price: 45,
      },
      laserEngraving: {
        enabled: false,
        type: 'inside',
        qty: 1,
        price: 250,
      },
      enameling: {
        enabled: false,
        type: 'cold',
        qty: 1,
        price: 200,
      },
    },
    galvanics: {
      rhodiumPlating: {
        enabled: false,
        type: 'white',
        qty: 1,
        price: 350,
      },
      goldPlating: {
        enabled: false,
        qty: 1,
        price: 400,
      },
      oxidation: {
        enabled: false,
        qty: 1,
        price: 150,
      },
    },
    additional: {
      consumables: {
        enabled: true,
        type: 'percent',
        value: 5.0,
      },
      assayOffice: {
        enabled: true,
        qty: 1,
        price: 120,
      },
    },
    customMarkupPercent: 70,
  };
}

export function saveStateToLocalStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export const saveCurrentState = saveStateToLocalStorage;

export function loadStateFromLocalStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed.general && parsed.works && parsed.metalPricing) {
        // Ensure backwards compatibility for productionPrep
        if (!parsed.productionPrep) {
          parsed.productionPrep = {
            design3d: { enabled: false, price: 500 },
            casting: { enabled: false, type: 'fixed', price: 200 },
          };
        } else if (!parsed.productionPrep.casting) {
          parsed.productionPrep.casting = { enabled: false, type: 'fixed', price: 200 };
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }
  return null;
}

export function loadSavedState(): AppState {
  return loadStateFromLocalStorage() || getDefaultInitialState();
}

export async function fetchLatestDefaultPrices(): Promise<DefaultPrices> {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    const url = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}data/default-prices.json`;
    const res = await fetch(url, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      return data as DefaultPrices;
    }
  } catch {
    // fallback
    try {
      const resFallback = await fetch('/data/default-prices.json', { cache: 'no-cache' });
      if (resFallback.ok) {
        const data = await resFallback.json();
        return data as DefaultPrices;
      }
    } catch {
      // ignore
    }
  }
  return INITIAL_DEFAULT_PRICES;
}

export function comparePricesWithDefaults(currentState: AppState, defaults: DefaultPrices): PriceDiffItem[] {
  const diffs: PriceDiffItem[] = [];

  // Works
  const currentGrinding = currentState.works.grinding.price;
  const defGrinding = currentState.works.grinding.type === 'per_gram' ? defaults.works.grinding_per_gram : defaults.works.grinding_fixed;
  diffs.push({
    key: 'works.grinding.price',
    label: `Шліфування (${currentState.works.grinding.type === 'per_gram' ? 'за грам' : 'фіксоване'})`,
    category: 'Монтувальні роботи',
    currentValue: currentGrinding,
    newValue: defGrinding,
    diff: defGrinding - currentGrinding,
  });

  const currentSoldering = currentState.works.soldering.price;
  diffs.push({
    key: 'works.soldering.price',
    label: 'Пайка (за 1 точку)',
    category: 'Монтувальні роботи',
    currentValue: currentSoldering,
    newValue: defaults.works.soldering_per_point,
    diff: defaults.works.soldering_per_point - currentSoldering,
  });

  const currentAssembly = currentState.works.assembly.price;
  diffs.push({
    key: 'works.assembly.price',
    label: 'Складання / Збирання',
    category: 'Монтувальні роботи',
    currentValue: currentAssembly,
    newValue: defaults.works.assembly_base,
    diff: defaults.works.assembly_base - currentAssembly,
  });

  // Finishing
  diffs.push({
    key: 'finishing.polishing.price',
    label: 'Полірування (ручне)',
    category: 'Фінішна обробка',
    currentValue: currentState.finishing.polishing.price,
    newValue: defaults.finishing.polishing_manual,
    diff: defaults.finishing.polishing_manual - currentState.finishing.polishing.price,
  });

  diffs.push({
    key: 'finishing.laserEngraving.price',
    label: 'Лазерне гравіювання',
    category: 'Фінішна обробка',
    currentValue: currentState.finishing.laserEngraving.price,
    newValue: defaults.finishing.laser_inside,
    diff: defaults.finishing.laser_inside - currentState.finishing.laserEngraving.price,
  });

  // Galvanics
  diffs.push({
    key: 'galvanics.rhodiumPlating.price',
    label: 'Родіювання (біле)',
    category: 'Гальваніка',
    currentValue: currentState.galvanics.rhodiumPlating.price,
    newValue: defaults.galvanics.rhodium_white,
    diff: defaults.galvanics.rhodium_white - currentState.galvanics.rhodiumPlating.price,
  });

  diffs.push({
    key: 'galvanics.goldPlating.price',
    label: 'Золочення / Позолота',
    category: 'Гальваніка',
    currentValue: currentState.galvanics.goldPlating.price,
    newValue: defaults.galvanics.gold_plating,
    diff: defaults.galvanics.gold_plating - currentState.galvanics.goldPlating.price,
  });

  // Additional
  diffs.push({
    key: 'additional.assayOffice.price',
    label: 'Апробація та клеймування',
    category: 'Додаткові послуги',
    currentValue: currentState.additional.assayOffice.price,
    newValue: defaults.additional.assay_office_per_item,
    diff: defaults.additional.assay_office_per_item - currentState.additional.assayOffice.price,
  });

  return diffs;
}

export function exportProjectToJson(state: AppState): void {
  const projectData: ProjectSaveSchema = {
    schema_version: SCHEMA_VERSION,
    saved_at: new Date().toISOString(),
    project_name: state.general.productName || 'Ювелірний виріб',
    state,
  };

  const jsonStr = JSON.stringify(projectData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  const safeTitle = (state.general.productName || 'jewelry_project')
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїє]/gi, '_')
    .substring(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);

  a.href = url;
  a.download = `jewelry_project_${safeTitle}_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const exportProjectJson = exportProjectToJson;

export function parseProjectJson(jsonContent: string): { success: boolean; state?: AppState; error?: string } {
  try {
    const data = JSON.parse(jsonContent);
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Файл не містить коректного JSON-об’єкта' };
    }

    const stateCandidate = data.state || data;
    if (!stateCandidate.general || !stateCandidate.works) {
      return { success: false, error: 'Структура файлу не відповідає схемі ювелірного проєкту' };
    }

    return {
      success: true,
      state: stateCandidate as AppState,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Не вдалося прочитати JSON файл',
    };
  }
}
