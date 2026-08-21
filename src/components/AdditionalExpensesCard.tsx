import React from 'react';
import { AdditionalState } from '../types';
import { Package, Award, ChevronDown } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';

interface AdditionalExpensesCardProps {
  additional: AdditionalState;
  directLaborTotal: number;
  onChange: (updated: Partial<AdditionalState>) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdditionalExpensesCard: React.FC<AdditionalExpensesCardProps> = ({
  additional,
  directLaborTotal,
  onChange,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const handleConsumablesChange = (updated: Partial<AdditionalState['consumables']>) => {
    onChange({
      consumables: { ...additional.consumables, ...updated },
    });
  };

  const handleAssayChange = (updated: Partial<AdditionalState['assayOffice']>) => {
    onChange({
      assayOffice: { ...additional.assayOffice, ...updated },
    });
  };

  const consumablesCost = additional.consumables.enabled
    ? additional.consumables.type === 'percent'
      ? (directLaborTotal * (additional.consumables.value || 0)) / 100
      : additional.consumables.value || 0
    : 0;

  const assayCost = additional.assayOffice.enabled
    ? (additional.assayOffice.qty || 0) * (additional.assayOffice.price || 0)
    : 0;

  const totalAdditional = consumablesCost + assayCost;

  return (
    <div
      id="card-additional-expenses"
      className={`bg-[#12141c]/90 rounded-2xl border transition-all duration-200 shadow-sm ${
        isCollapsed ? 'border-[#232838] hover:border-[#333a52]' : 'border-[#232838] shadow-md'
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
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                8. Додаткові та супутні витрати
              </h2>
              <span className="text-[10px] font-mono text-neutral-400 bg-[#0e1017] px-2 py-0.5 rounded-md border border-[#232838]">
                Блок 8 / 8
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5 hidden sm:block">
              Витратні матеріали майстерні, апробація та клеймування
            </p>
          </div>
        </div>

        {/* Badge & Chevron */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-amber-300 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            {formatCurrencyUAH(totalAdditional)}
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
        <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 border-t border-[#232838]/80 mt-1 space-y-4">
          <div className="pt-4 space-y-3">
            {/* 1. Consumables */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                additional.consumables.enabled
                  ? 'bg-[#0c0e14] border-[#293044]'
                  : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-consumables-enabled"
                      checked={additional.consumables.enabled}
                      onChange={(e) => handleConsumablesChange({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Витратні матеріали майстерні</span>
                      <span className="text-[10px] text-neutral-400">Флюси, припої, відбіли, пилочки, диски, полірувальні пасти</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <select
                    value={additional.consumables.type}
                    disabled={!additional.consumables.enabled}
                    onChange={(e) =>
                      handleConsumablesChange({
                        type: e.target.value as 'percent' | 'fixed',
                        value: e.target.value === 'percent' ? 5 : 100,
                      })
                    }
                    className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  >
                    <option value="percent">% від робіт</option>
                    <option value="fixed">Фіксована сума</option>
                  </select>

                  <div className="relative w-28">
                    <input
                      type="number"
                      disabled={!additional.consumables.enabled}
                      value={additional.consumables.value || ''}
                      onChange={(e) =>
                        handleConsumablesChange({
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder={additional.consumables.type === 'percent' ? '5' : '100'}
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                      {additional.consumables.type === 'percent' ? '%' : 'грн'}
                    </span>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                    {formatCurrencyUAH(consumablesCost)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Assay Office */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                additional.assayOffice.enabled
                  ? 'bg-[#0c0e14] border-[#293044]'
                  : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-assay-enabled"
                      checked={additional.assayOffice.enabled}
                      onChange={(e) => handleAssayChange({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>

                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Пробірна палата / Клеймування</span>
                      <span className="text-[10px] text-neutral-400">Державне клеймування проби та нанесення іменника</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <span className="text-[11px] text-neutral-400">Штук:</span>
                  <div className="relative w-16">
                    <input
                      type="number"
                      min="1"
                      disabled={!additional.assayOffice.enabled}
                      value={additional.assayOffice.qty || ''}
                      onChange={(e) =>
                        handleAssayChange({
                          qty: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="1"
                    />
                  </div>

                  <span className="text-[11px] text-neutral-400">Ціна:</span>
                  <div className="relative w-24">
                    <input
                      type="number"
                      disabled={!additional.assayOffice.enabled}
                      value={additional.assayOffice.price || ''}
                      onChange={(e) =>
                        handleAssayChange({
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="120"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                      грн
                    </span>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                    {formatCurrencyUAH(assayCost)}
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
