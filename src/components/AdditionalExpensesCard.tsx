import React from 'react';
import { AdditionalState } from '../types';
import { Package, Award } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';

interface AdditionalExpensesCardProps {
  additional: AdditionalState;
  directLaborTotal: number;
  onChange: (updated: Partial<AdditionalState>) => void;
}

export const AdditionalExpensesCard: React.FC<AdditionalExpensesCardProps> = ({
  additional,
  directLaborTotal,
  onChange,
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
    <div className="bg-[#12141c]/90 rounded-2xl border border-[#232838] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#232838]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">7. Додаткові та супутні витрати</h2>
            <p className="text-xs text-neutral-400">Витратні матеріали майстерні, апробація та клеймування</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-400">Підсумок: </span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {formatCurrencyUAH(totalAdditional)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Consumables */}
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
                  <span className="text-xs font-semibold text-white block">Витратні матеріали</span>
                  <span className="text-[10px] text-neutral-400">Припій, флюси, бори, полірувальні пасти, круги</span>
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
                    value: e.target.value === 'percent' ? 5.0 : 150,
                  })
                }
                className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="percent">% від суми робіт</option>
                <option value="fixed">Фіксована сума (грн)</option>
              </select>

              <div className="relative w-24">
                <input
                  type="number"
                  step="0.5"
                  disabled={!additional.consumables.enabled}
                  value={additional.consumables.value || ''}
                  onChange={(e) =>
                    handleConsumablesChange({
                      value: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="5"
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

        {/* Assay Office */}
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
                  id="toggle-assay-office-enabled"
                  checked={additional.assayOffice.enabled}
                  onChange={(e) => handleAssayChange({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Апробація та клеймування</span>
                  <span className="text-[10px] text-neutral-400">Державна Пробірна палата + логістика</span>
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
  );
};
