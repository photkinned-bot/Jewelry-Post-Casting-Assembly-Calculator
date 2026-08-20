import React, { useState } from 'react';
import { CalculationResult, AppState, ProductionPrepState } from '../types';
import {
  Calculator,
  Coins,
  Gem,
  Hammer,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  FileDown,
  ShoppingBag,
  Crown,
  Palette,
  Percent,
  Layers,
  Compass,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { formatCurrencyUAH, formatNumber } from '../services/calculator';
import { generateTxtReport } from '../services/exporter';

interface CostSummaryCardProps {
  calc: CalculationResult;
  state: AppState;
  onCustomMarkupChange: (markup: number) => void;
  onExportTxt: () => void;
}

export const CostSummaryCard: React.FC<CostSummaryCardProps> = ({
  calc,
  state,
  onCustomMarkupChange,
  onExportTxt,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClipboard = async () => {
    const text = generateTxtReport(state, calc);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  // Percentage shares for visual bar
  const total = calc.totalManufacturingCost || 1;
  const metalShare = Math.round((calc.metalTotalCost / total) * 100);
  const prepShare = Math.round((calc.productionPrepSubtotal / total) * 100);
  const laborShare = Math.round((calc.totalLaborAndServicesCost / total) * 100);
  const stoneShare = Math.round((calc.stoneMaterialSubtotal / total) * 100);

  return (
    <div className="bg-[#12141c]/90 rounded-2xl border border-[#232838] p-5 shadow-xl space-y-5 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#232838] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Підсумкова калькуляція</h2>
            <p className="text-xs text-neutral-400">Повна собівартість та ціноутворення</p>
          </div>
        </div>

        <button
          onClick={handleCopyClipboard}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1a1f2c] hover:bg-[#222838] text-neutral-200 border border-[#262c3e] transition"
          title="Скопіювати текстовий розрахунок у буфер обміну"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Скопійовано!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-neutral-400" />
              <span>Копіювати</span>
            </>
          )}
        </button>
      </div>

      {/* Main Prime Cost Hero Badge */}
      <div className="bg-[#0c0e14] border-2 border-amber-500/40 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase inline-block mb-1">
          Загальна собівартість (Total Cost)
        </span>
        <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight text-amber-400 drop-shadow-sm">
          {formatCurrencyUAH(calc.totalManufacturingCost)}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Метал ({formatNumber(calc.metalTotalWeightWithLoss, 2)}г) + Литво/3D + Вставки + Робота + Покриття
        </p>
      </div>

      {/* Cost Distribution Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-neutral-400">
          <span>Структура собівартості:</span>
          <span>
            Метал {metalShare}% {prepShare > 0 ? `/ Литво ${prepShare}%` : ''} / Робота {laborShare}% {stoneShare > 0 ? `/ Камені ${stoneShare}%` : ''}
          </span>
        </div>
        <div className="h-2.5 w-full bg-[#0c0e14] rounded-full overflow-hidden flex border border-[#232838]">
          <div
            className="bg-amber-400 transition-all duration-300"
            style={{ width: `${metalShare}%` }}
            title={`Метал: ${formatCurrencyUAH(calc.metalTotalCost)} (${metalShare}%)`}
          />
          {prepShare > 0 && (
            <div
              className="bg-orange-500 transition-all duration-300"
              style={{ width: `${prepShare}%` }}
              title={`Підготовка та литво: ${formatCurrencyUAH(calc.productionPrepSubtotal)} (${prepShare}%)`}
            />
          )}
          <div
            className="bg-blue-500 transition-all duration-300"
            style={{ width: `${laborShare}%` }}
            title={`Робота: ${formatCurrencyUAH(calc.totalLaborAndServicesCost)} (${laborShare}%)`}
          />
          {stoneShare > 0 && (
            <div
              className="bg-purple-500 transition-all duration-300"
              style={{ width: `${stoneShare}%` }}
              title={`Каміння: ${formatCurrencyUAH(calc.stoneMaterialSubtotal)} (${stoneShare}%)`}
            />
          )}
        </div>
      </div>

      {/* Detailed Items Breakdown */}
      <div className="space-y-2 text-xs bg-[#0c0e14] p-3.5 rounded-xl border border-[#232838] divide-y divide-[#1e2330]">
        {/* Metal */}
        <div className="flex items-center justify-between pb-2">
          <span className="text-neutral-300 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Метал з угаром ({formatNumber(calc.metalTotalWeightWithLoss, 2)}г):
          </span>
          <span className="font-mono font-bold text-white">
            {formatCurrencyUAH(calc.metalTotalCost)}
          </span>
        </div>

        {/* Production Prep / Casting Subtotal */}
        {calc.productionPrepSubtotal > 0 && (
          <div className="flex items-center justify-between py-2">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              3D-дизайн, формування та лиття:
            </span>
            <span className="font-mono font-bold text-white">
              {formatCurrencyUAH(calc.productionPrepSubtotal)}
            </span>
          </div>
        )}

        {/* Stones Labor & Material */}
        <div className="flex items-center justify-between py-2">
          <span className="text-neutral-300 flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-purple-400" />
            Закріпка вставок ({calc.stonesTotalCount} шт):
          </span>
          <span className="font-mono font-bold text-white">
            {formatCurrencyUAH(calc.stoneSettingSubtotal)}
          </span>
        </div>

        {calc.stoneMaterialSubtotal > 0 && (
          <div className="flex items-center justify-between py-2">
            <span className="text-neutral-400 pl-5">└ Вартість матеріалу каміння:</span>
            <span className="font-mono text-neutral-300">
              {formatCurrencyUAH(calc.stoneMaterialSubtotal)}
            </span>
          </div>
        )}

        {/* Assembly Works */}
        <div className="flex items-center justify-between py-2">
          <span className="text-neutral-300 flex items-center gap-1.5">
            <Hammer className="w-3.5 h-3.5 text-blue-400" />
            Слюсарка, пайка та збирання:
          </span>
          <span className="font-mono font-bold text-white">
            {formatCurrencyUAH(calc.assemblyWorksSubtotal)}
          </span>
        </div>

        {/* Finishing & Galvanics */}
        <div className="flex items-center justify-between py-2">
          <span className="text-neutral-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Фінішна обробка та гальваніка:
          </span>
          <span className="font-mono font-bold text-white">
            {formatCurrencyUAH(calc.finishingSubtotal + calc.galvanicsSubtotal)}
          </span>
        </div>

        {/* Consumables & Assay */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-neutral-400 pl-5">Витратні матеріали та пробірка:</span>
          <span className="font-mono text-neutral-300">
            {formatCurrencyUAH(calc.additionalSubtotal)}
          </span>
        </div>
      </div>

      {/* Commercial Pricing & Market Segments */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span>Оціночні роздрібні ціни за сегментами</span>
        </div>

        <div className="space-y-2.5">
          {/* 1. Mass Market (+30%) */}
          <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#232838] hover:border-[#32394e] transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-neutral-400" />
                Масмаркет (+30%)
              </span>
              <span className="text-xs font-bold text-white font-mono">
                {formatCurrencyUAH(calc.massMarketPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <span>Серійне виробництво / опт</span>
              <span className="text-emerald-400/90 font-mono">маржа: +{formatCurrencyUAH(calc.massMarketMargin)}</span>
            </div>
          </div>

          {/* 2. Local Brand / Handmade (+70%) */}
          <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/30 hover:border-amber-500/50 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Авторський бренд / Хендмейд (+70%)
              </span>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {formatCurrencyUAH(calc.localBrandPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Крафтова майстерня / Шоурум</span>
              <span className="text-emerald-400 font-mono">маржа: +{formatCurrencyUAH(calc.localBrandMargin)}</span>
            </div>
          </div>

          {/* 3. Luxury / Boutique (+150%) */}
          <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#232838] hover:border-purple-500/30 transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-purple-400" />
                Преміум / Люкс бутік (+150%)
              </span>
              <span className="text-xs font-bold text-purple-300 font-mono">
                {formatCurrencyUAH(calc.luxuryPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-500">
              <span>Ексклюзивний дизайн & упаковка</span>
              <span className="text-emerald-400 font-mono">маржа: +{formatCurrencyUAH(calc.luxuryMargin)}</span>
            </div>
          </div>
        </div>

        {/* Custom Profit Margin Slider */}
        <div className="bg-[#0c0e14] p-3.5 rounded-xl border border-[#232838] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300 font-medium flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              Власна націнка бренду:
            </label>
            <span className="font-mono font-bold text-amber-300">
              +{state.customMarkupPercent}%
            </span>
          </div>

          <input
            id="slider-custom-markup"
            type="range"
            min="0"
            max="300"
            step="5"
            value={state.customMarkupPercent}
            onChange={(e) => onCustomMarkupChange(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-[#1b1f2b] rounded-lg appearance-none cursor-pointer accent-amber-500"
          />

          <div className="flex items-center justify-between pt-1 border-t border-[#1e2330] text-xs">
            <span className="text-neutral-400">Ціна з націнкою:</span>
            <div className="text-right">
              <span className="font-mono font-bold text-amber-400 text-sm">
                {formatCurrencyUAH(calc.customPrice)}
              </span>
              <span className="block text-[10px] text-emerald-400 font-mono">
                (маржа: +{formatCurrencyUAH(calc.customMarginVal)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Trigger for TXT */}
      <button
        id="btn-download-txt-summary"
        onClick={onExportTxt}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
      >
        <FileDown className="w-4 h-4" />
        <span>Завантажити офіційний кошторис (.TXT)</span>
      </button>
    </div>
  );
};

