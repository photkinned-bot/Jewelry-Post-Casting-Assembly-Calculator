import { AppState, CalculationResult } from '../types';
import { formatCurrencyUAH, formatNumber, METAL_COEFFICIENTS } from './calculator';

export function generateTxtReport(state: AppState, calc: CalculationResult): string {
  const dateStr = new Date().toLocaleDateString('uk-UA');
  const metalInfo = METAL_COEFFICIENTS[state.general.metal] || METAL_COEFFICIENTS.gold_585;

  const lines: string[] = [];
  lines.push('==================================================');
  lines.push('        КОШТОРИС ЮВЕЛІРНОГО МОНТУВАННЯ ТА ОБРОБКИ');
  lines.push('==================================================');
  lines.push(`Дата: ${dateStr}`);
  lines.push(`Виріб: ${state.general.productName || 'Ювелірний виріб'}`);
  lines.push(`Метал / Проба: ${metalInfo.name} ${metalInfo.purityLabel}`);
  lines.push('');

  // 1. Material
  lines.push('--- 1. МАТЕРІАЛ ТА ВТРАТИ ---');
  lines.push(`• Початкова вага напівфабрикату: ${formatNumber(state.general.weight, 2)} г`);
  lines.push(`• Розрахунковий угар (${formatNumber(state.general.lossPercent, 1)}%): ${formatNumber(calc.metalLossWeight, 2)} г`);
  lines.push(`• Підсумкова вага металу з угаром: ${formatNumber(calc.metalTotalWeightWithLoss, 2)} г`);
  if (state.metalPricing.isManualOverride) {
    lines.push(`• Ручний курс металу: ${formatCurrencyUAH(calc.metalPricePerGramAlloy)}/г`);
  } else {
    lines.push(`• Актуальний курс НБУ (${metalInfo.purityLabel}): ${formatCurrencyUAH(calc.metalPricePerGramAlloy)}/г (999.9: ${formatCurrencyUAH(calc.metalPricePerGramPure)}/г)`);
  }
  lines.push(`• Вартість металу з урахуванням угару: ${formatCurrencyUAH(calc.metalTotalCost)}`);
  lines.push('');

  // 2. Preparatory & Casting Works
  if (calc.productionPrepSubtotal > 0 || state.productionPrep?.design3d?.enabled || state.productionPrep?.moldingBurnout?.enabled || state.productionPrep?.casting?.enabled) {
    lines.push('--- 2. 3D-ДИЗАЙН, ФОРМУВАННЯ ТА ЛИТТЯ ---');
    if (state.productionPrep?.design3d?.enabled) {
      lines.push(`• Дизайн та 3D-моделювання (CAD): ${formatCurrencyUAH(calc.design3dCost)}`);
    }
    if (state.productionPrep?.moldingBurnout?.enabled) {
      lines.push(`• Формування та випалювання опоки: ${formatCurrencyUAH(calc.moldingBurnoutCost)}`);
    }
    if (state.productionPrep?.casting?.enabled) {
      const cType = state.productionPrep.casting.type === 'per_gram' ? `за ${formatNumber(calc.metalTotalWeightWithLoss, 2)}г` : 'фіксоване';
      lines.push(`• Лиття виробу (${cType}): ${formatCurrencyUAH(calc.castingCost)}`);
    }
    lines.push(`  Разом за підготовку та литво: ${formatCurrencyUAH(calc.productionPrepSubtotal)}`);
    lines.push('');
  }

  // 3. Works & Services
  lines.push('--- 3. ЮВЕЛІРНІ МОНТУВАЛЬНІ РОБОТИ ---');
  if (state.works.grinding.enabled) {
    const typeLabel = state.works.grinding.type === 'per_gram' ? `за ${formatNumber(state.general.weight, 2)}г` : 'фіксоване';
    lines.push(`• Шліфування та опилювання (${typeLabel}): ${formatCurrencyUAH(calc.grindingCost)}`);
  }
  if (state.works.soldering.enabled && state.works.soldering.qty > 0) {
    lines.push(`• Пайка (${state.works.soldering.qty} точок х ${formatCurrencyUAH(state.works.soldering.price)}): ${formatCurrencyUAH(calc.solderingCost)}`);
  }
  if (state.works.assembly.enabled) {
    lines.push(`• Складання та монтування виробу: ${formatCurrencyUAH(calc.assemblyCost)}`);
  }
  if (state.works.customElements.enabled && state.works.customElements.qty > 0) {
    lines.push(`• Виготовлення додаткових елементів / замків (${state.works.customElements.qty} шт): ${formatCurrencyUAH(calc.customElementsCost)}`);
  }

  // Stones Setting
  if (state.stones.length > 0) {
    lines.push('');
    lines.push('--- Вставки та закріпка каміння ---');
    state.stones.forEach((s, idx) => {
      const settingNames: Record<string, string> = {
        krapan: 'Крапанова',
        bezel: 'Глуха',
        korner: 'Корнерова',
        pave: 'Паве',
        microscope: 'Мікроскоп',
        channel: 'Канальна',
        fantasy: 'Фантазійна',
      };
      const stoneNames: Record<string, string> = {
        cz: 'Фіаніти',
        diamond: 'Діаманти',
        precious: 'Коштовне',
        semiprecious: 'Напівкоштовне',
        pearl: 'Перли',
      };
      const rowLabor = s.qty * s.settingPrice;
      const rowStoneCost = s.qty * (s.stoneCostPerUnit || 0);
      lines.push(
        `• Позиція #${idx + 1}: ${settingNames[s.settingType] || s.settingType}, ${stoneNames[s.stoneType] || s.stoneType} (${s.qty} шт х ${formatCurrencyUAH(s.settingPrice)} закріпка = ${formatCurrencyUAH(rowLabor)}${rowStoneCost > 0 ? ` + каміння ${formatCurrencyUAH(rowStoneCost)}` : ''})`
      );
    });
    lines.push(`  Разом за закріпку: ${formatCurrencyUAH(calc.stoneSettingSubtotal)}`);
    if (calc.stoneMaterialSubtotal > 0) {
      lines.push(`  Разом за вартість каміння: ${formatCurrencyUAH(calc.stoneMaterialSubtotal)}`);
    }
  }

  // Finishing
  const hasFinishing =
    state.finishing.polishing.enabled ||
    state.finishing.matting.enabled ||
    state.finishing.engraving.enabled ||
    state.finishing.laserEngraving.enabled ||
    state.finishing.enameling.enabled;

  if (hasFinishing) {
    lines.push('');
    lines.push('--- Фінішна обробка та декорування ---');
    if (state.finishing.polishing.enabled) {
      lines.push(`• Полірування (${state.finishing.polishing.type}): ${formatCurrencyUAH(calc.polishingCost)}`);
    }
    if (state.finishing.matting.enabled) {
      lines.push(`• Матування / Сатинування (${state.finishing.matting.type}): ${formatCurrencyUAH(calc.mattingCost)}`);
    }
    if (state.finishing.engraving.enabled) {
      lines.push(`• Ручне штихельне гравіювання (${state.finishing.engraving.qty} знаків): ${formatCurrencyUAH(calc.engravingCost)}`);
    }
    if (state.finishing.laserEngraving.enabled) {
      lines.push(`• Лазерне гравіювання (${state.finishing.laserEngraving.type}): ${formatCurrencyUAH(calc.laserCost)}`);
    }
    if (state.finishing.enameling.enabled) {
      lines.push(`• Ювелірне емалювання (${state.finishing.enameling.type}): ${formatCurrencyUAH(calc.enamelCost)}`);
    }
  }

  // Galvanics
  const hasGalvanics =
    state.galvanics.rhodiumPlating.enabled ||
    state.galvanics.goldPlating.enabled ||
    state.galvanics.oxidation.enabled;

  if (hasGalvanics) {
    lines.push('');
    lines.push('--- Гальваніка та покриття ---');
    if (state.galvanics.rhodiumPlating.enabled) {
      lines.push(`• Родіювання (${state.galvanics.rhodiumPlating.type}): ${formatCurrencyUAH(calc.rhodiumCost)}`);
    }
    if (state.galvanics.goldPlating.enabled) {
      lines.push(`• Золочення / Позолота: ${formatCurrencyUAH(calc.goldPlatingCost)}`);
    }
    if (state.galvanics.oxidation.enabled) {
      lines.push(`• Оксидування / Чорніння срібла: ${formatCurrencyUAH(calc.oxidationCost)}`);
    }
  }

  // Additional
  lines.push('');
  lines.push('--- Додаткові витрати ---');
  if (state.additional.consumables.enabled) {
    const consType = state.additional.consumables.type === 'percent' ? `${state.additional.consumables.value}% від робіт` : 'фіксована';
    lines.push(`• Витратні матеріали (${consType}): ${formatCurrencyUAH(calc.consumablesCost)}`);
  }
  if (state.additional.assayOffice.enabled) {
    lines.push(`• Апробація та клеймування у Пробірній палаті: ${formatCurrencyUAH(calc.assayOfficeCost)}`);
  }

  lines.push('');
  lines.push('--------------------------------------------------');
  lines.push(`Собівартість металу: ${formatCurrencyUAH(calc.metalTotalCost)}`);
  if (calc.stoneMaterialSubtotal > 0) {
    lines.push(`Собівартість каменів (матеріал): ${formatCurrencyUAH(calc.stoneMaterialSubtotal)}`);
  }
  lines.push(`Собівартість робіт та послуг: ${formatCurrencyUAH(calc.totalLaborAndServicesCost)}`);
  lines.push(`ЗАГАЛЬНА СОБІВАРТІСТЬ ВИРОБУ (Prime Cost): ${formatCurrencyUAH(calc.totalManufacturingCost)}`);
  lines.push('--------------------------------------------------');
  lines.push('');
  lines.push('--- ОЦІНОЧНА НАЦІНКА ТА РОЗДРІБНІ ЦІНИ ---');
  lines.push(`• Масмаркет (+30%): ${formatCurrencyUAH(calc.massMarketPrice)} (маржа: ${formatCurrencyUAH(calc.massMarketMargin)})`);
  lines.push(`• Локальний авторський бренд / Хендмейд (+70%): ${formatCurrencyUAH(calc.localBrandPrice)} (маржа: ${formatCurrencyUAH(calc.localBrandMargin)})`);
  lines.push(`• Преміум / Люкс сегмент (+150%): ${formatCurrencyUAH(calc.luxuryPrice)} (маржа: ${formatCurrencyUAH(calc.luxuryMargin)})`);
  if (state.customMarkupPercent !== 30 && state.customMarkupPercent !== 70 && state.customMarkupPercent !== 150) {
    lines.push(`• Користувацька націнка (+${state.customMarkupPercent}%): ${formatCurrencyUAH(calc.customPrice)} (маржа: ${formatCurrencyUAH(calc.customMarginVal)})`);
  }
  lines.push('');
  lines.push('--- АНАЛІТИЧНИЙ ВИСНОВОК ЕКСПЕРТА ---');
  lines.push(`• Категорія технологічної складності: ${calc.complexityScore}`);
  lines.push(`• Співвідношення робота/метал: ${calc.laborToMetalRatio}x`);
  lines.push('==================================================');

  return lines.join('\n');
}

export function downloadTxtReport(state: AppState, calc: CalculationResult): void {
  const content = generateTxtReport(state, calc);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  const safeTitle = (state.general.productName || 'jewelry_estimate')
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїє]/gi, '_')
    .substring(0, 30);
  const dateStr = new Date().toISOString().slice(0, 10);

  a.href = url;
  a.download = `jewelry_estimate_${safeTitle}_${dateStr}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
