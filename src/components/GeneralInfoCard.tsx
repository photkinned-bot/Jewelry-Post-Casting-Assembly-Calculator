import React from 'react';
import { GeneralState, MetalType, ProductType } from '../types';
import { Sparkles, Scale, Percent, Tag, ShieldCheck } from 'lucide-react';
import { METAL_COEFFICIENTS } from '../services/calculator';
import { INITIAL_DEFAULT_PRICES } from '../data/defaultPrices';

interface GeneralInfoCardProps {
  general: GeneralState;
  onChange: (updated: Partial<GeneralState>) => void;
  errorWeight?: string;
  errorLoss?: string;
}

export const GeneralInfoCard: React.FC<GeneralInfoCardProps> = ({
  general,
  onChange,
  errorWeight,
  errorLoss,
}) => {
  const handleMetalChange = (metal: MetalType) => {
    const defaultLoss = INITIAL_DEFAULT_PRICES.general.defaultLosses[metal] || 6.0;
    onChange({
      metal,
      lossPercent: defaultLoss,
    });
  };

  const handleResetLoss = () => {
    const defaultLoss = INITIAL_DEFAULT_PRICES.general.defaultLosses[general.metal] || 6.0;
    onChange({ lossPercent: defaultLoss });
  };

  return (
    <div className="bg-[#12141c]/90 rounded-2xl border border-[#232838] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#232838]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">1. Інформація про виріб</h2>
            <p className="text-xs text-neutral-400">Тип прикраси, метал, проба та базова вага</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-neutral-400 bg-[#0e1017] px-2.5 py-1 rounded-md border border-[#232838]">
          Блок 1 / 7
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product Type */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            Тип виробу
          </label>
          <select
            id="select-product-type"
            value={general.productType}
            onChange={(e) => onChange({ productType: e.target.value as ProductType })}
            className="w-full bg-[#0c0e14] border border-[#262c3e] hover:border-[#38415a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
          >
            <option value="ring">Каблучка / Перстень</option>
            <option value="earrings">Сережки (пара)</option>
            <option value="pendant">Кулон / Підвіска</option>
            <option value="chain">Ланцюжок / Браслет</option>
            <option value="brooch">Брошка</option>
            <option value="other">Інше (індивідуальний виріб)</option>
          </select>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
            <span>Назва моделі / Артикул</span>
          </label>
          <input
            id="input-product-name"
            type="text"
            value={general.productName}
            onChange={(e) => onChange({ productName: e.target.value })}
            placeholder="напр. Каблучка з мікропаве діамантами"
            className="w-full bg-[#0c0e14] border border-[#262c3e] hover:border-[#38415a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>

        {/* Metal & Purity */}
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Метал та Проба
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">
              коеф. {METAL_COEFFICIENTS[general.metal]?.coeff}
            </span>
          </label>
          <select
            id="select-metal-type"
            value={general.metal}
            onChange={(e) => handleMetalChange(e.target.value as MetalType)}
            className="w-full bg-[#0c0e14] border border-[#262c3e] hover:border-[#38415a] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition font-medium"
          >
            <option value="gold_585">Золото 585° (Au 58.5%)</option>
            <option value="gold_750">Золото 750° (Au 75.0%)</option>
            <option value="silver_925">Срібло 925° (Ag 92.5%)</option>
            <option value="platinum_950">Платина 950° (Pt 95.0%)</option>
          </select>
        </div>

        {/* Weight & Loss % in flex */}
        <div className="grid grid-cols-2 gap-3">
          {/* Semi-finished weight */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-neutral-400" />
                Вага відливки (г)
              </span>
            </label>
            <div className="relative">
              <input
                id="input-product-weight"
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                value={general.weight || ''}
                onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-[#0c0e14] border ${
                  errorWeight ? 'border-red-500 ring-1 ring-red-500' : 'border-[#262c3e] hover:border-[#38415a]'
                } rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition font-mono`}
                placeholder="5.00"
              />
              <span className="absolute right-3 top-2.5 text-xs text-neutral-500 pointer-events-none">г</span>
            </div>
            {errorWeight && <p className="text-[11px] text-red-400 mt-1">{errorWeight}</p>}
          </div>

          {/* Loss % */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-neutral-400" />
                Угар (%)
              </label>
              <button
                type="button"
                onClick={handleResetLoss}
                className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono"
                title="Скинути до галузевого нормативу"
              >
                Норматив
              </button>
            </div>
            <div className="relative">
              <input
                id="input-loss-percent"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={general.lossPercent || ''}
                onChange={(e) => onChange({ lossPercent: parseFloat(e.target.value) || 0 })}
                className={`w-full bg-[#0c0e14] border ${
                  errorLoss ? 'border-red-500 ring-1 ring-red-500' : 'border-[#262c3e] hover:border-[#38415a]'
                } rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition font-mono`}
                placeholder="6.0"
              />
              <span className="absolute right-3 top-2.5 text-xs text-neutral-500 pointer-events-none">%</span>
            </div>
            {errorLoss && <p className="text-[11px] text-red-400 mt-1">{errorLoss}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
