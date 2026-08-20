import { AppState, CalculationResult, DefaultPrices, MetalType, PriceDiffItem } from '../types';

export const METAL_COEFFICIENTS: Record<MetalType, { coeff: number; name: string; purityLabel: string }> = {
  silver_925: { coeff: 0.925, name: 'Срібло', purityLabel: '925°' },
  gold_585: { coeff: 0.585, name: 'Золото', purityLabel: '585°' },
  gold_750: { coeff: 0.750, name: 'Золото', purityLabel: '750°' },
  platinum_950: { coeff: 0.950, name: 'Платина', purityLabel: '950°' },
};

export function calculateCost(state: AppState): CalculationResult {
  const { general, metalPricing, productionPrep, works, stones, finishing, galvanics, additional, customMarkupPercent } = state;

  // 1. Metal Calculation
  const metalMeta = METAL_COEFFICIENTS[general.metal] || METAL_COEFFICIENTS.gold_585;
  const metalFinenessCoeff = metalMeta.coeff;

  let metalPricePerGramPure = 0;
  if (general.metal === 'silver_925') {
    metalPricePerGramPure = metalPricing.nbuRates.silver_999 || 0;
  } else if (general.metal === 'platinum_950') {
    metalPricePerGramPure = metalPricing.nbuRates.platinum_999 || 0;
  } else {
    // gold 585 / 750
    metalPricePerGramPure = metalPricing.nbuRates.gold_999 || 0;
  }

  let metalPricePerGramAlloy = 0;
  if (metalPricing.isManualOverride && metalPricing.manualPricePerGram && metalPricing.manualPricePerGram > 0) {
    metalPricePerGramAlloy = Number(metalPricing.manualPricePerGram);
  } else {
    metalPricePerGramAlloy = Number((metalPricePerGramPure * metalFinenessCoeff).toFixed(2));
  }

  const rawWeight = Math.max(0, Number(general.weight) || 0);
  const lossPercent = Math.max(0, Number(general.lossPercent) || 0);
  const metalLossWeight = Number((rawWeight * (lossPercent / 100)).toFixed(3));
  const metalTotalWeightWithLoss = Number((rawWeight + metalLossWeight).toFixed(3));
  const metalTotalCost = Number((metalTotalWeightWithLoss * metalPricePerGramAlloy).toFixed(2));

  // 2. Production Prep & Casting (3D Design, Molding/Burnout, Casting)
  const prep = productionPrep || {
    design3d: { enabled: false, price: 0 },
    moldingBurnout: { enabled: false, price: 0 },
    casting: { enabled: false, type: 'fixed', price: 0 },
  };

  const design3dCost = prep.design3d?.enabled
    ? Number(Math.max(0, Number(prep.design3d.price) || 0).toFixed(2))
    : 0;

  const moldingBurnoutCost = prep.moldingBurnout?.enabled
    ? Number(Math.max(0, Number(prep.moldingBurnout.price) || 0).toFixed(2))
    : 0;

  let castingCost = 0;
  if (prep.casting?.enabled) {
    const cPrice = Math.max(0, Number(prep.casting.price) || 0);
    if (prep.casting.type === 'per_gram') {
      castingCost = Number((metalTotalWeightWithLoss * cPrice).toFixed(2));
    } else {
      castingCost = Number(cPrice.toFixed(2));
    }
  }

  const productionPrepSubtotal = Number(
    (design3dCost + moldingBurnoutCost + castingCost).toFixed(2)
  );

  // 3. Assembly Works
  let grindingCost = 0;
  if (works.grinding.enabled) {
    const grindingQty = works.grinding.type === 'per_gram' ? rawWeight : Math.max(0, Number(works.grinding.qty) || 0);
    grindingCost = Number((grindingQty * (Number(works.grinding.price) || 0)).toFixed(2));
  }

  let solderingCost = 0;
  if (works.soldering.enabled) {
    solderingCost = Number(((Number(works.soldering.qty) || 0) * (Number(works.soldering.price) || 0)).toFixed(2));
  }

  let assemblyCost = 0;
  if (works.assembly.enabled) {
    assemblyCost = Number(((Number(works.assembly.qty) || 0) * (Number(works.assembly.price) || 0)).toFixed(2));
  }

  let customElementsCost = 0;
  if (works.customElements.enabled) {
    customElementsCost = Number(((Number(works.customElements.qty) || 0) * (Number(works.customElements.price) || 0)).toFixed(2));
  }

  const assemblyWorksSubtotal = Number((grindingCost + solderingCost + assemblyCost + customElementsCost).toFixed(2));

  // 3. Stones Setting & Materials
  let stoneSettingSubtotal = 0;
  let stoneMaterialSubtotal = 0;
  let stonesTotalCount = 0;

  for (const s of stones) {
    const qty = Math.max(0, Number(s.qty) || 0);
    const setPrice = Math.max(0, Number(s.settingPrice) || 0);
    const stoneCost = Math.max(0, Number(s.stoneCostPerUnit) || 0);

    stonesTotalCount += qty;
    stoneSettingSubtotal += qty * setPrice;
    stoneMaterialSubtotal += qty * stoneCost;
  }

  stoneSettingSubtotal = Number(stoneSettingSubtotal.toFixed(2));
  stoneMaterialSubtotal = Number(stoneMaterialSubtotal.toFixed(2));
  const stonesCombinedCost = Number((stoneSettingSubtotal + stoneMaterialSubtotal).toFixed(2));

  // 4. Finishing
  const polishingCost = finishing.polishing.enabled
    ? Number(((Number(finishing.polishing.qty) || 0) * (Number(finishing.polishing.price) || 0)).toFixed(2))
    : 0;

  const mattingCost = finishing.matting.enabled
    ? Number(((Number(finishing.matting.qty) || 0) * (Number(finishing.matting.price) || 0)).toFixed(2))
    : 0;

  const engravingCost = finishing.engraving.enabled
    ? Number(((Number(finishing.engraving.qty) || 0) * (Number(finishing.engraving.price) || 0)).toFixed(2))
    : 0;

  const laserCost = finishing.laserEngraving.enabled
    ? Number(((Number(finishing.laserEngraving.qty) || 0) * (Number(finishing.laserEngraving.price) || 0)).toFixed(2))
    : 0;

  const enamelCost = finishing.enameling.enabled
    ? Number(((Number(finishing.enameling.qty) || 0) * (Number(finishing.enameling.price) || 0)).toFixed(2))
    : 0;

  const finishingSubtotal = Number(
    (polishingCost + mattingCost + engravingCost + laserCost + enamelCost).toFixed(2)
  );

  // 5. Galvanics
  const rhodiumCost = galvanics.rhodiumPlating.enabled
    ? Number(((Number(galvanics.rhodiumPlating.qty) || 0) * (Number(galvanics.rhodiumPlating.price) || 0)).toFixed(2))
    : 0;

  const goldPlatingCost = galvanics.goldPlating.enabled
    ? Number(((Number(galvanics.goldPlating.qty) || 0) * (Number(galvanics.goldPlating.price) || 0)).toFixed(2))
    : 0;

  const oxidationCost = galvanics.oxidation.enabled
    ? Number(((Number(galvanics.oxidation.qty) || 0) * (Number(galvanics.oxidation.price) || 0)).toFixed(2))
    : 0;

  const galvanicsSubtotal = Number((rhodiumCost + goldPlatingCost + oxidationCost).toFixed(2));

  // 6. Direct Labor & Prep Total (3D Design, Molding, Casting + Benchwork + Stone Setting Labor + Finishing + Galvanics)
  const directLaborTotal = Number(
    (productionPrepSubtotal + assemblyWorksSubtotal + stoneSettingSubtotal + finishingSubtotal + galvanicsSubtotal).toFixed(2)
  );

  // 7. Additional Expenses
  let consumablesCost = 0;
  if (additional.consumables.enabled) {
    if (additional.consumables.type === 'percent') {
      consumablesCost = Number(
        (directLaborTotal * ((Number(additional.consumables.value) || 0) / 100)).toFixed(2)
      );
    } else {
      consumablesCost = Number((Number(additional.consumables.value) || 0).toFixed(2));
    }
  }

  const assayOfficeCost = additional.assayOffice.enabled
    ? Number(((Number(additional.assayOffice.qty) || 0) * (Number(additional.assayOffice.price) || 0)).toFixed(2))
    : 0;

  const additionalSubtotal = Number((consumablesCost + assayOfficeCost).toFixed(2));

  // 8. Grand Totals
  const totalLaborAndServicesCost = Number((directLaborTotal + additionalSubtotal).toFixed(2));
  const totalManufacturingCost = Number(
    (metalTotalCost + stoneMaterialSubtotal + totalLaborAndServicesCost).toFixed(2)
  );

  // 9. Commercial Pricing Segments
  const massMarketPrice = Number((totalManufacturingCost * 1.30).toFixed(2));
  const massMarketMargin = Number((massMarketPrice - totalManufacturingCost).toFixed(2));

  const localBrandPrice = Number((totalManufacturingCost * 1.70).toFixed(2));
  const localBrandMargin = Number((localBrandPrice - totalManufacturingCost).toFixed(2));

  const luxuryPrice = Number((totalManufacturingCost * 2.50).toFixed(2));
  const luxuryMargin = Number((luxuryPrice - totalManufacturingCost).toFixed(2));

  const customMultiplier = 1 + (Number(customMarkupPercent) || 0) / 100;
  const customPrice = Number((totalManufacturingCost * customMultiplier).toFixed(2));
  const customMarginVal = Number((customPrice - totalManufacturingCost).toFixed(2));

  // 10. Complexity Analysis
  const laborToMetalRatio = metalTotalCost > 0 ? Number((directLaborTotal / metalTotalCost).toFixed(2)) : 1;

  let complexityScore: 'Низька' | 'Середня' | 'Висока' | 'Ексклюзив / Haute Joaillerie' = 'Низька';
  const hasMultipleStones = stonesTotalCount >= 10;
  const hasEnamelOrLaser = finishing.enameling.enabled || finishing.laserEngraving.enabled;
  const hasComplexGalvanics = galvanics.rhodiumPlating.enabled || galvanics.goldPlating.enabled;

  if (stonesTotalCount >= 25 || (hasEnamelOrLaser && hasMultipleStones && works.soldering.qty > 5)) {
    complexityScore = 'Ексклюзив / Haute Joaillerie';
  } else if (stonesTotalCount >= 8 || works.soldering.qty > 3 || (hasEnamelOrLaser && hasComplexGalvanics)) {
    complexityScore = 'Висока';
  } else if (stonesTotalCount > 0 || works.soldering.enabled || hasComplexGalvanics || finishing.matting.enabled) {
    complexityScore = 'Середня';
  } else {
    complexityScore = 'Низька';
  }

  return {
    metalFinenessCoeff,
    metalPricePerGramPure,
    metalPricePerGramAlloy,
    metalLossWeight,
    metalTotalWeightWithLoss,
    metalTotalCost,

    design3dCost,
    moldingBurnoutCost,
    castingCost,
    productionPrepSubtotal,

    grindingCost,
    solderingCost,
    assemblyCost,
    customElementsCost,
    assemblyWorksSubtotal,

    stoneSettingSubtotal,
    stoneMaterialSubtotal,
    stonesTotalCount,
    stonesCombinedCost,

    polishingCost,
    mattingCost,
    engravingCost,
    laserCost,
    enamelCost,
    finishingSubtotal,

    rhodiumCost,
    goldPlatingCost,
    oxidationCost,
    galvanicsSubtotal,

    directLaborTotal,
    consumablesCost,
    assayOfficeCost,
    additionalSubtotal,

    totalLaborAndServicesCost,
    totalManufacturingCost,

    massMarketPrice,
    massMarketMargin,
    localBrandPrice,
    localBrandMargin,
    luxuryPrice,
    luxuryMargin,
    customPrice,
    customMarginVal,

    laborToMetalRatio,
    complexityScore,
  };
}

export function formatCurrencyUAH(amount: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(val: number, decimals = 2): string {
  return new Intl.NumberFormat('uk-UA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function computePriceDiffs(currentState: AppState, defaults: DefaultPrices): PriceDiffItem[] {
  const diffs: PriceDiffItem[] = [];

  // 1. Works
  const curGrinding = currentState.works.grinding.price;
  const defGrinding =
    currentState.works.grinding.type === 'per_gram'
      ? defaults.works.grinding_per_gram
      : defaults.works.grinding_fixed;
  diffs.push({
    key: 'works.grinding.price',
    label: `Шліфування (${currentState.works.grinding.type === 'per_gram' ? 'за грам' : 'фіксоване'})`,
    category: 'Слюсарні роботи',
    currentValue: curGrinding,
    newValue: defGrinding,
    diff: defGrinding - curGrinding,
  });

  const curSoldering = currentState.works.soldering.price;
  diffs.push({
    key: 'works.soldering.price',
    label: 'Пайка (за 1 точку/шов)',
    category: 'Слюсарні роботи',
    currentValue: curSoldering,
    newValue: defaults.works.soldering_per_point,
    diff: defaults.works.soldering_per_point - curSoldering,
  });

  const curAssembly = currentState.works.assembly.price;
  diffs.push({
    key: 'works.assembly.price',
    label: 'Складання та монтаж',
    category: 'Слюсарні роботи',
    currentValue: curAssembly,
    newValue: defaults.works.assembly_base,
    diff: defaults.works.assembly_base - curAssembly,
  });

  const curCustom = currentState.works.customElements.price;
  diffs.push({
    key: 'works.customElements.price',
    label: 'Виготовлення замків/штифтів',
    category: 'Слюсарні роботи',
    currentValue: curCustom,
    newValue: defaults.works.custom_elements_base,
    diff: defaults.works.custom_elements_base - curCustom,
  });

  // 2. Finishing
  const curPolishing = currentState.finishing.polishing.price;
  diffs.push({
    key: 'finishing.polishing.price',
    label: 'Полірування (ручне)',
    category: 'Фінішна обробка',
    currentValue: curPolishing,
    newValue: defaults.finishing.polishing_manual,
    diff: defaults.finishing.polishing_manual - curPolishing,
  });

  const curMatting = currentState.finishing.matting.price;
  diffs.push({
    key: 'finishing.matting.price',
    label: 'Матування / Сатинування',
    category: 'Фінішна обробка',
    currentValue: curMatting,
    newValue: defaults.finishing.matting_sandblast,
    diff: defaults.finishing.matting_sandblast - curMatting,
  });

  const curLaser = currentState.finishing.laserEngraving.price;
  diffs.push({
    key: 'finishing.laserEngraving.price',
    label: 'Лазерне гравіювання',
    category: 'Фінішна обробка',
    currentValue: curLaser,
    newValue: defaults.finishing.laser_inside,
    diff: defaults.finishing.laser_inside - curLaser,
  });

  // 3. Galvanics
  const curRhodium = currentState.galvanics.rhodiumPlating.price;
  diffs.push({
    key: 'galvanics.rhodiumPlating.price',
    label: 'Родіювання (біле)',
    category: 'Гальванічні покриття',
    currentValue: curRhodium,
    newValue: defaults.galvanics.rhodium_white,
    diff: defaults.galvanics.rhodium_white - curRhodium,
  });

  const curGold = currentState.galvanics.goldPlating.price;
  diffs.push({
    key: 'galvanics.goldPlating.price',
    label: 'Золочення / Позолота',
    category: 'Гальванічні покриття',
    currentValue: curGold,
    newValue: defaults.galvanics.gold_plating,
    diff: defaults.galvanics.gold_plating - curGold,
  });

  const curOxidation = currentState.galvanics.oxidation.price;
  diffs.push({
    key: 'galvanics.oxidation.price',
    label: 'Оксидування срібла',
    category: 'Гальванічні покриття',
    currentValue: curOxidation,
    newValue: defaults.galvanics.oxidation_silver,
    diff: defaults.galvanics.oxidation_silver - curOxidation,
  });

  // 4. Additional
  const curAssay = currentState.additional.assayOffice.price;
  diffs.push({
    key: 'additional.assayOffice.price',
    label: 'Апробація та клеймування',
    category: 'Додаткові послуги',
    currentValue: curAssay,
    newValue: defaults.additional.assay_office_per_item,
    diff: defaults.additional.assay_office_per_item - curAssay,
  });

  return diffs;
}
