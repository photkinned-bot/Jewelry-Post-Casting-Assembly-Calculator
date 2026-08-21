import React from 'react';
import { ProductionPrepState } from '../types';
import { Layers, Flame, Compass, ChevronDown } from 'lucide-react';
import { formatCurrencyUAH, formatNumber } from '../services/calculator';

interface ProductionPrepCardProps {
  productionPrep: ProductionPrepState;
  productWeightWithLoss: number;
  onChange: (updated: Partial<ProductionPrepState>) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ProductionPrepCard: React.FC<ProductionPrepCardProps> = ({
  productionPrep,
  productWeightWithLoss,
  onChange,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const prep = productionPrep || {
    design3d: { enabled: false, price: 500 },
    casting: { enabled: false, type: 'fixed', price: 200 },
  };

  const handleDesignChange = (updated: Partial<ProductionPrepState['design3d']>) => {
    onChange({
      design3d: { ...prep.design3d, ...updated },
    });
  };

  const handleCastingChange = (updated: Partial<ProductionPrepState['casting']>) => {
    onChange({
      casting: { ...prep.casting, ...updated },
    });
  };

  const designCost = prep.design3d?.enabled ? (Number(prep.design3d.price) || 0) : 0;
  const castingQty = prep.casting?.type === 'per_gram' ? productWeightWithLoss : 1;
  const castingCost = prep.casting?.enabled ? castingQty * (Number(prep.casting.price) || 0) : 0;
  const totalPrep = designCost + castingCost;

  return (
    <div
      id="card-production-prep"
      className={`bg-[#12141c]/90 rounded-2xl border transition-all duration-200 shadow-sm ${
        isCollapsed ? 'border-[#232838] hover:border-[#333a52]' : 'border-amber-500/30 shadow-md shadow-amber-500/5'
      }`}
    >
      {/* Clickable Header */}
      <div
        onClick={onToggleCollapse}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleCollapse?.();
          }
        }}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                3. 3D-дизайн, формування та лиття виробу
              </h2>
              <span className="text-[10px] font-mono text-neutral-400 bg-[#0e1017] px-2 py-0.5 rounded-md border border-[#232838]">
                Блок 3 / 8
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5 hidden sm:block">
              3D CAD моделювання та послуги ювелірного лиття
            </p>
          </div>
        </div>

        {/* Badge & Chevron */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-amber-300 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            {formatCurrencyUAH(totalPrep)}
          </span>

          <div
            className={`p-1.5 rounded-lg bg-[#1b1f2b] text-neutral-400 border border-[#262c3e] transition-transform duration-200 ${
              isCollapsed ? '' : 'rotate-180 text-amber-400'
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Body */}
      {!isCollapsed && (
        <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 border-t border-[#232838]/80 mt-1 space-y-3">
          <div className="pt-3.5 space-y-3">
            {/* 1. 3D Design & CAD */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                prep.design3d?.enabled
                  ? 'bg-[#0c0e14] border-[#293044]'
                  : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-design3d-enabled"
                      checked={!!prep.design3d?.enabled}
                      onChange={(e) => handleDesignChange({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>

                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Дизайн та 3D-моделювання (CAD)</span>
                      <span className="text-[10px] text-neutral-400">Побудова STL/3DM геометрії, візуалізація та адаптація</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:ml-auto">
                  <span className="text-[11px] text-neutral-400">Вартість:</span>
                  <div className="relative w-28">
                    <input
                      type="number"
                      disabled={!prep.design3d?.enabled}
                      value={prep.design3d?.price || ''}
                      onChange={(e) => handleDesignChange({ price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="500"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                      грн
                    </span>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                    {formatCurrencyUAH(designCost)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Casting Services (combines forming, burnout, and casting) */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                prep.casting?.enabled
                  ? 'bg-[#0c0e14] border-[#293044]'
                  : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-casting-enabled"
                      checked={!!prep.casting?.enabled}
                      onChange={(e) => handleCastingChange({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>

                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Послуги лиття</span>
                      <span className="text-[10px] text-neutral-400">Формування, випалювання опоки та лиття металу</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <select
                    value={prep.casting?.type || 'fixed'}
                    disabled={!prep.casting?.enabled}
                    onChange={(e) =>
                      handleCastingChange({
                        type: e.target.value as 'fixed' | 'per_gram',
                        price: e.target.value === 'per_gram' ? 35 : 200,
                      })
                    }
                    className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  >
                    <option value="fixed">Фіксоване литво</option>
                    <option value="per_gram">За грам відливки</option>
                  </select>

                  {prep.casting?.type === 'per_gram' && (
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {formatNumber(productWeightWithLoss, 2)}г ×
                    </div>
                  )}

                  <div className="relative w-28">
                    <input
                      type="number"
                      disabled={!prep.casting?.enabled}
                      value={prep.casting?.price || ''}
                      onChange={(e) => handleCastingChange({ price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder={prep.casting?.type === 'per_gram' ? '35' : '200'}
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                      {prep.casting?.type === 'per_gram' ? 'грн/г' : 'грн'}
                    </span>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                    {formatCurrencyUAH(castingCost)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
