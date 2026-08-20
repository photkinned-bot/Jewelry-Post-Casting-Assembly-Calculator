export type MetalType = 'silver_925' | 'gold_585' | 'gold_750' | 'platinum_950';

export type ProductType = 'ring' | 'earrings' | 'pendant' | 'chain' | 'brooch' | 'other';

export type SettingType =
  | 'krapan'
  | 'bezel'
  | 'korner'
  | 'pave'
  | 'microscope'
  | 'channel'
  | 'fantasy';

export type StoneCategory =
  | 'cz'
  | 'diamond'
  | 'precious'
  | 'semiprecious'
  | 'pearl';

export type PolishingType = 'manual' | 'tumbling' | 'fluff';
export type MattingType = 'sandblast' | 'brush' | 'diamond';
export type LaserType = 'inside' | 'outside' | '3d';
export type EnamelType = 'cold' | 'hot';
export type RhodiumType = 'white' | 'black' | 'selective';

export interface StoneRow {
  id: string;
  settingType: SettingType;
  stoneType: StoneCategory;
  qty: number;
  settingPrice: number;
  stoneCostPerUnit: number;
  comment?: string;
}

export interface GeneralState {
  productType: ProductType;
  productName: string;
  orderNumber?: string;
  metal: MetalType;
  weight: number; // in grams
  lossPercent: number; // % loss
}

export interface MetalPricingState {
  isManualOverride: boolean;
  manualPricePerGram: number | null;
  nbuRates: {
    gold_999: number;
    silver_999: number;
    platinum_999: number;
    lastUpdated: string | null;
    isLoading: boolean;
    error: string | null;
  };
}

export interface WorksState {
  grinding: {
    enabled: boolean;
    type: 'fixed' | 'per_gram';
    qty: number;
    price: number;
  };
  soldering: {
    enabled: boolean;
    qty: number;
    price: number;
  };
  assembly: {
    enabled: boolean;
    qty: number;
    price: number;
  };
  customElements: {
    enabled: boolean;
    qty: number;
    price: number;
  };
}

export interface FinishingState {
  polishing: {
    enabled: boolean;
    type: PolishingType;
    qty: number;
    price: number;
  };
  matting: {
    enabled: boolean;
    type: MattingType;
    qty: number;
    price: number;
  };
  engraving: {
    enabled: boolean;
    qty: number;
    price: number;
  };
  laserEngraving: {
    enabled: boolean;
    type: LaserType;
    qty: number;
    price: number;
  };
  enameling: {
    enabled: boolean;
    type: EnamelType;
    qty: number;
    price: number;
  };
}

export interface GalvanicsState {
  rhodiumPlating: {
    enabled: boolean;
    type: RhodiumType;
    qty: number;
    price: number;
  };
  goldPlating: {
    enabled: boolean;
    qty: number;
    price: number;
  };
  oxidation: {
    enabled: boolean;
    qty: number;
    price: number;
  };
}

export interface AdditionalState {
  consumables: {
    enabled: boolean;
    type: 'percent' | 'fixed';
    value: number; // % or fixed UAH
  };
  assayOffice: {
    enabled: boolean;
    qty: number;
    price: number;
  };
}

export interface ProductionPrepState {
  design3d: {
    enabled: boolean;
    price: number; // 3D-моделювання / CAD дизайн (грн)
  };
  casting: {
    enabled: boolean;
    type: 'fixed' | 'per_gram'; // Фіксована ціна або за 1г металу відливки
    price: number; // Вартість послуг лиття (грн або грн/г)
  };
}

export interface DefaultPrices {
  general: {
    defaultLosses: Record<MetalType, number>;
  };
  productionPrep: {
    design3d_base: number;
    casting_fixed: number;
    casting_per_gram: number;
  };
  works: {
    grinding_fixed: number;
    grinding_per_gram: number;
    soldering_per_point: number;
    assembly_base: number;
    custom_elements_base: number;
  };
  stoneSetting: Record<SettingType, Record<StoneCategory, number>>;
  finishing: {
    polishing_manual: number;
    polishing_tumbling: number;
    polishing_fluff: number;
    matting_sandblast: number;
    matting_brush: number;
    matting_diamond: number;
    engraving_manual_per_char: number;
    laser_inside: number;
    laser_outside: number;
    laser_3d: number;
    enamel_cold: number;
    enamel_hot: number;
  };
  galvanics: {
    rhodium_white: number;
    rhodium_black: number;
    rhodium_selective: number;
    gold_plating: number;
    oxidation_silver: number;
  };
  additional: {
    consumables_percent: number;
    consumables_fixed: number;
    assay_office_per_item: number;
  };
}

export interface AppState {
  general: GeneralState;
  metalPricing: MetalPricingState;
  productionPrep: ProductionPrepState;
  works: WorksState;
  stones: StoneRow[];
  finishing: FinishingState;
  galvanics: GalvanicsState;
  additional: AdditionalState;
  customMarkupPercent: number;
}

export interface CalculationResult {
  // Metal
  metalFinenessCoeff: number;
  metalPricePerGramPure: number;
  metalPricePerGramAlloy: number;
  metalLossWeight: number;
  metalTotalWeightWithLoss: number;
  metalTotalCost: number;

  // Production Prep & Casting (3D Design, Casting Services)
  design3dCost: number;
  castingCost: number;
  productionPrepSubtotal: number;

  // Works
  grindingCost: number;
  solderingCost: number;
  assemblyCost: number;
  customElementsCost: number;
  assemblyWorksSubtotal: number;

  // Stones
  stoneSettingSubtotal: number;
  stoneMaterialSubtotal: number;
  stonesTotalCount: number;
  stonesCombinedCost: number;

  // Finishing
  polishingCost: number;
  mattingCost: number;
  engravingCost: number;
  laserCost: number;
  enamelCost: number;
  finishingSubtotal: number;

  // Galvanics
  rhodiumCost: number;
  goldPlatingCost: number;
  oxidationCost: number;
  galvanicsSubtotal: number;

  // Labor Subtotal (for % consumables calculation)
  directLaborTotal: number;

  // Additional
  consumablesCost: number;
  assayOfficeCost: number;
  additionalSubtotal: number;

  // Grand Totals
  totalLaborAndServicesCost: number;
  totalManufacturingCost: number; // metal + labor + stones + consumables + prep/casting

  // Retail & Segments
  massMarketPrice: number; // +30%
  massMarketMargin: number;
  localBrandPrice: number; // +70%
  localBrandMargin: number;
  luxuryPrice: number; // +150%
  luxuryMargin: number;
  customPrice: number;
  customMarginVal: number;

  // Analysis metrics
  laborToMetalRatio: number;
  complexityScore: 'Низька' | 'Середня' | 'Висока' | 'Ексклюзив / Haute Joaillerie';
}

export interface PresetItem {
  id: string;
  name: string;
  description: string;
  category: string;
  settings: {
    general: GeneralState;
    productionPrep?: ProductionPrepState;
    works: WorksState;
    stones: StoneRow[];
    finishing: FinishingState;
    galvanics: GalvanicsState;
    additional: AdditionalState;
  };
}

export interface ProjectSaveSchema {
  schema_version: string;
  saved_at: string;
  project_name: string;
  state: AppState;
}

export interface PriceDiffItem {
  key: string;
  label: string;
  category: string;
  currentValue: number;
  newValue: number;
  diff: number;
}
