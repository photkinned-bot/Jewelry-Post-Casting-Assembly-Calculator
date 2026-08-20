import { AppState } from '../types';

export interface ValidationErrors {
  weight?: string;
  lossPercent?: string;
  manualPrice?: string;
  [key: string]: string | undefined;
}

export function validateAppState(state: AppState): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  // General weight
  if (state.general.weight === undefined || state.general.weight === null || isNaN(state.general.weight)) {
    errors.weight = 'Введіть коректну вагу виробу';
  } else if (state.general.weight <= 0) {
    errors.weight = 'Вага напівфабрикату повинна бути більше 0.01 г';
  } else if (state.general.weight > 10000) {
    errors.weight = 'Максимальна вага — 10 000 г';
  }

  // Loss %
  if (state.general.lossPercent < 0 || state.general.lossPercent > 100 || isNaN(state.general.lossPercent)) {
    errors.lossPercent = 'Відсоток угару має бути від 0 до 100%';
  }

  // Manual price
  if (state.metalPricing.isManualOverride) {
    if (
      state.metalPricing.manualPricePerGram === null ||
      isNaN(state.metalPricing.manualPricePerGram) ||
      state.metalPricing.manualPricePerGram <= 0
    ) {
      errors.manualPrice = 'Введіть ручну ціну за грам металу (> 0)';
    }
  }

  // Stones validation
  state.stones.forEach((stone, index) => {
    if (stone.qty <= 0 || isNaN(stone.qty)) {
      errors[`stone_${index}_qty`] = 'Кількість має бути щонайменше 1 шт';
    }
    if (stone.settingPrice < 0 || isNaN(stone.settingPrice)) {
      errors[`stone_${index}_price`] = 'Ціна закріпки не може бути від’ємною';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
