import React from 'react';
import { MetalPricingState, MetalType, CalculationResult } from '../types';
import { Coins, CheckCircle2, AlertCircle, Edit3, ArrowRight } from 'lucide-react';
import { formatCurrencyUAH, formatNumber, METAL_COEFFICIENTS } from '../services/calculator';

interface MetalRateCardProps {
  metalPricing: MetalPricingState;
  selectedMetal: MetalType;
  weight: number;
  lossPercent: number;
  calc: CalculationResult;
  onChange: (updated: Partial<MetalPricingState>) => void;
  errorManualPrice?: string;
}

export const MetalRateCard: React.FC<MetalRateCardProps> = ({
  metalPricing,
  selectedMetal,
  weight,
  lossPercent,
  calc,
  onChange,
  errorManualPrice,
}) => {
  const metalMeta = METAL_COEFFICIENTS[selectedMetal] || METAL_COEFFICIENTS.gold_585;

  const handleToggleManual = (enabled: boolean) => {
    onChange({
      isManualOverride: enabled,
      manualPricePerGram: enabled
        ? metalPricing.manualPricePerGram || calc.metalPricePerGramAlloy
        : null,
    });
  };

  return (
    <div className="bg-[#12141c]/90 rounded-2xl border border-[#232838] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#232838]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">2. Курс металу та вартість сплаву</h2>
            <p className="text-xs text-neutral-400">
              Котирування банківського металу НБУ та розрахунок вартості з урахуванням угару
            </p>
          </div>
        </div>

        {/* Manual override switch */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-300 select-none">
          <span className="hidden sm:inline">Ручна ціна за грам</span>
          <span className="sm:hidden">Ручна ціна</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              id="toggle-manual-metal-rate"
              checked={metalPricing.isManualOverride}
              onChange={(e) => handleToggleManual(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NBU Rates & Pure Price Indicator */}
        <div className="bg-[#0c0e14] p-3.5 rounded-xl border border-[#232838] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Котирування НБУ (999.9 проба):
            </span>
            <span className="text-neutral-500 font-mono text-[11px]">
              {metalPricing.nbuRates.date || 'Актуально'}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-base font-bold text-white font-mono">
                {formatCurrencyUAH(calc.metalPricePerGramPure)} <span className="text-xs font-normal text-neutral-400">/г чистоти</span>
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                {metalMeta.name} {metalMeta.purityLabel} (коеф. {metalMeta.coeff})
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-neutral-400 font-medium">Розрахункова ціна проби:</div>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {formatCurrencyUAH(calc.metalPricePerGramAlloy)} /г
              </div>
            </div>
          </div>

          {metalPricing.nbuRates.source === 'fallback' && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Використовуються базові галузеві котирування (НБУ офлайн).</span>
            </div>
          )}
        </div>

        {/* Manual Override Input OR Info Box */}
        <div className="bg-[#0c0e14] p-3.5 rounded-xl border border-[#232838] flex flex-col justify-between">
          {metalPricing.isManualOverride ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-amber-300 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                Власна ціна за грам сплаву ({metalMeta.purityLabel}):
              </label>
              <div className="relative">
                <input
                  id="input-manual-metal-price"
                  type="number"
                  step="1"
                  min="1"
                  value={metalPricing.manualPricePerGram || ''}
                  onChange={(e) =>
                    onChange({
                      manualPricePerGram: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder={calc.metalPricePerGramAlloy.toString()}
                  className={`w-full bg-[#12151e] border ${
                    errorManualPrice ? 'border-red-500' : 'border-amber-500/50'
                  } rounded-lg px-3 py-2 text-sm text-amber-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500`}
                />
                <span className="absolute right-3 top-2 text-xs text-neutral-500 font-mono pointer-events-none">
                  грн/г
                </span>
              </div>
              {errorManualPrice && <p className="text-[11px] text-red-400">{errorManualPrice}</p>}
              <p className="text-[10px] text-neutral-500">
                Задайте фіксовану вартість власного литва, купленого лому або специфічного сплаву.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Автоматичний розрахунок за формулою НБУ
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Формула: <span className="font-mono text-neutral-300">Ціна 999.9 × {metalMeta.coeff}</span> ={' '}
                <span className="font-mono text-amber-300 font-medium">
                  {formatCurrencyUAH(calc.metalPricePerGramAlloy)}/г
                </span>
                . При зміні біржового курсу перерахунок відбувається миттєво.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Metal Weight & Cost Formula Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#161a24] to-[#0c0e14] border border-amber-500/20 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-neutral-300 font-mono">
          <span>Вага: <strong className="text-white">{formatNumber(weight, 2)} г</strong></span>
          <span className="text-amber-400">+</span>
          <span>Угар ({formatNumber(lossPercent, 1)}%): <strong className="text-amber-300">{formatNumber(calc.metalLossWeight, 2)} г</strong></span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
          <span>Разом металу: <strong className="text-white">{formatNumber(calc.metalTotalWeightWithLoss, 2)} г</strong></span>
        </div>

        <div className="text-right sm:border-l sm:border-[#232838] sm:pl-4">
          <span className="text-[11px] text-neutral-400 block sm:inline mr-2">Вартість металу:</span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {formatCurrencyUAH(calc.metalTotalCost)}
          </span>
        </div>
      </div>
    </div>
  );
};
