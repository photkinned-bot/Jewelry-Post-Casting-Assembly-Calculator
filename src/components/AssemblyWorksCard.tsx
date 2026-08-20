import React from 'react';
import { WorksState } from '../types';
import { Hammer, Wrench, Flame, Component, Lock, ChevronDown } from 'lucide-react';
import { formatCurrencyUAH, formatNumber } from '../services/calculator';

interface AssemblyWorksCardProps {
  works: WorksState;
  productWeight: number;
  onChange: (updated: Partial<WorksState>) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AssemblyWorksCard: React.FC<AssemblyWorksCardProps> = ({
  works,
  productWeight,
  onChange,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const handleGrindingChange = (updated: Partial<WorksState['grinding']>) => {
    onChange({
      grinding: { ...works.grinding, ...updated },
    });
  };

  const handleSolderingChange = (updated: Partial<WorksState['soldering']>) => {
    onChange({
      soldering: { ...works.soldering, ...updated },
    });
  };

  const handleAssemblyChange = (updated: Partial<WorksState['assembly']>) => {
    onChange({
      assembly: { ...works.assembly, ...updated },
    });
  };

  const handleCustomElementsChange = (updated: Partial<WorksState['customElements']>) => {
    onChange({
      customElements: { ...works.customElements, ...updated },
    });
  };

  const grindingQty = works.grinding.type === 'per_gram' ? productWeight : works.grinding.qty;
  const grindingTotal = works.grinding.enabled ? grindingQty * works.grinding.price : 0;
  const solderingTotal = works.soldering.enabled ? works.soldering.qty * works.soldering.price : 0;
  const assemblyTotal = works.assembly.enabled ? works.assembly.qty * works.assembly.price : 0;
  const customElementsTotal = works.customElements.enabled
    ? works.customElements.qty * works.customElements.price
    : 0;

  const totalWorks = grindingTotal + solderingTotal + assemblyTotal + customElementsTotal;

  return (
    <div
      id="card-assembly-works"
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
            <Hammer className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                4. Слюсарні та монтувальні роботи
              </h2>
              <span className="text-[10px] font-mono text-neutral-400 bg-[#0e1017] px-2 py-0.5 rounded-md border border-[#232838]">
                Блок 4 / 8
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5 hidden sm:block">
              Обробка литва, опилювання, пайка та збирання конструкції
            </p>
          </div>
        </div>

        {/* Badge & Chevron */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-amber-300 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            {formatCurrencyUAH(totalWorks)}
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

        {/* 1. Grinding / Filing */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            works.grinding.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-grinding-enabled"
                  checked={works.grinding.enabled}
                  onChange={(e) => handleGrindingChange({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-neutral-400" />
                <span className="text-xs font-semibold text-white">Шліфування / Опилювання литва</span>
              </div>
            </div>

            {/* Select type & Inputs */}
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <select
                value={works.grinding.type}
                disabled={!works.grinding.enabled}
                onChange={(e) =>
                  handleGrindingChange({
                    type: e.target.value as 'fixed' | 'per_gram',
                    price: e.target.value === 'per_gram' ? 45 : 200,
                  })
                }
                className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="fixed">Фіксована сума</option>
                <option value="per_gram">За грам ваги</option>
              </select>

              {/* Quantity */}
              <div className="relative w-24">
                <input
                  type="number"
                  disabled={!works.grinding.enabled || works.grinding.type === 'per_gram'}
                  value={works.grinding.type === 'per_gram' ? formatNumber(productWeight, 2) : works.grinding.qty}
                  onChange={(e) =>
                    handleGrindingChange({
                      qty: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#12151e] border border-[#262c3e] disabled:bg-[#0c0e14] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="1"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  {works.grinding.type === 'per_gram' ? 'г' : 'од'}
                </span>
              </div>

              {/* Price per unit */}
              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!works.grinding.enabled}
                  value={works.grinding.price || ''}
                  onChange={(e) =>
                    handleGrindingChange({
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="200"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              {/* Row Total */}
              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(grindingTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Soldering */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            works.soldering.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-soldering-enabled"
                  checked={works.soldering.enabled}
                  onChange={(e) => handleSolderingChange({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-semibold text-white">Пайка вузлів та швів</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <span className="text-[11px] text-neutral-400">Точок:</span>
              <div className="relative w-20">
                <input
                  type="number"
                  min="0"
                  step="1"
                  disabled={!works.soldering.enabled}
                  value={works.soldering.qty || ''}
                  onChange={(e) =>
                    handleSolderingChange({
                      qty: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="0"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  шт
                </span>
              </div>

              <span className="text-[11px] text-neutral-400">Ціна:</span>
              <div className="relative w-24">
                <input
                  type="number"
                  disabled={!works.soldering.enabled}
                  value={works.soldering.price || ''}
                  onChange={(e) =>
                    handleSolderingChange({
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
                {formatCurrencyUAH(solderingTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Assembly / Mounting */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            works.assembly.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-assembly-enabled"
                  checked={works.assembly.enabled}
                  onChange={(e) => handleAssemblyChange({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Component className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-white">Складання / Монтування виробу</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <span className="text-[11px] text-neutral-400">Вартість:</span>
              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!works.assembly.enabled}
                  value={works.assembly.price || ''}
                  onChange={(e) =>
                    handleAssemblyChange({
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="250"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(assemblyTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Custom Elements / Locks */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            works.customElements.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-custom-elements-enabled"
                  checked={works.customElements.enabled}
                  onChange={(e) => handleCustomElementsChange({ enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-white">Виготовлення замків / шарнірів / штифтів</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <span className="text-[11px] text-neutral-400">Кількість:</span>
              <div className="relative w-20">
                <input
                  type="number"
                  min="0"
                  disabled={!works.customElements.enabled}
                  value={works.customElements.qty || ''}
                  onChange={(e) =>
                    handleCustomElementsChange({
                      qty: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="1"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  шт
                </span>
              </div>

              <span className="text-[11px] text-neutral-400">Ціна:</span>
              <div className="relative w-24">
                <input
                  type="number"
                  disabled={!works.customElements.enabled}
                  value={works.customElements.price || ''}
                  onChange={(e) =>
                    handleCustomElementsChange({
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="300"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(customElementsTotal)}
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

