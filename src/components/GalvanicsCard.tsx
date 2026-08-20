import React from 'react';
import { GalvanicsState, RhodiumType } from '../types';
import { Droplet, Sun, Moon, ChevronDown } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';

interface GalvanicsCardProps {
  galvanics: GalvanicsState;
  onChange: (updated: Partial<GalvanicsState>) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const GalvanicsCard: React.FC<GalvanicsCardProps> = ({
  galvanics,
  onChange,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const handleUpdate = <K extends keyof GalvanicsState>(key: K, data: Partial<GalvanicsState[K]>) => {
    onChange({
      [key]: { ...galvanics[key], ...data },
    });
  };

  const rhodiumTotal = galvanics.rhodiumPlating.enabled
    ? galvanics.rhodiumPlating.qty * galvanics.rhodiumPlating.price
    : 0;
  const goldTotal = galvanics.goldPlating.enabled
    ? galvanics.goldPlating.qty * galvanics.goldPlating.price
    : 0;
  const oxidationTotal = galvanics.oxidation.enabled
    ? galvanics.oxidation.qty * galvanics.oxidation.price
    : 0;

  const totalGalvanics = rhodiumTotal + goldTotal + oxidationTotal;

  return (
    <div
      id="card-galvanics"
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
            <Droplet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                5. Гальваніка та покриття поверхонь
              </h2>
              <span className="text-[10px] font-mono text-neutral-400 bg-[#0e1017] px-2 py-0.5 rounded-md border border-[#232838]">
                Блок 5 / 7
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5 hidden sm:block">
              Родіювання (біле/чорне), золочення та художнє чорніння
            </p>
          </div>
        </div>

        {/* Badge & Chevron */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-amber-300 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            {formatCurrencyUAH(totalGalvanics)}
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
            {/* 1. Rhodium */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                galvanics.rhodiumPlating.enabled
                  ? 'bg-[#0c0e14] border-[#293044]'
                  : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-rhodium-enabled"
                      checked={galvanics.rhodiumPlating.enabled}
                      onChange={(e) => handleUpdate('rhodiumPlating', { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>

                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Родіювання поверхонь</span>
                      <span className="text-[10px] text-neutral-400">Нанесення захисно-декоративного шару родію</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <select
                    value={galvanics.rhodiumPlating.type}
                    disabled={!galvanics.rhodiumPlating.enabled}
                    onChange={(e) =>
                      handleUpdate('rhodiumPlating', {
                        type: e.target.value as RhodiumType,
                        price: e.target.value === 'black' ? 250 : 200,
                      })
                    }
                    className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  >
                    <option value="white">Білий родій</option>
                    <option value="black">Чорний родій</option>
                  </select>

                  <span className="text-[11px] text-neutral-400">Ціна:</span>
                  <div className="relative w-24">
                    <input
                      type="number"
                      disabled={!galvanics.rhodiumPlating.enabled}
                      value={galvanics.rhodiumPlating.price || ''}
                      onChange={(e) =>
                        handleUpdate('rhodiumPlating', { price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="200"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                      грн
                    </span>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                    {formatCurrencyUAH(rhodiumTotal)}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Gold Plating */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                galvanics.goldPlating.enabled
                  ? 'bg-[#0c0e14] border-[#293044]'
                  : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-gold-plating-enabled"
                      checked={galvanics.goldPlating.enabled}
                      onChange={(e) => handleUpdate('goldPlating', { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>

                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Золочення (позолота)</span>
                      <span className="text-[10px] text-neutral-400">Гальванічне покриття золотом 585 / 750 / 999</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <span className="text-[11px] text-neutral-400">Ціна:</span>
                  <div className="relative w-28">
                    <input
                      type="number"
                      disabled={!galvanics.goldPlating.enabled}
                      value={galvanics.goldPlating.price || ''}
                      onChange={(e) =>
                        handleUpdate('goldPlating', { price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="250"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                      грн
                    </span>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                    {formatCurrencyUAH(goldTotal)}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Oxidation */}
            <div
              className={`p-3.5 rounded-xl border transition ${
                galvanics.oxidation.enabled
                  ? 'bg-[#0c0e14] border-[#293044]'
                  : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle-oxidation-enabled"
                      checked={galvanics.oxidation.enabled}
                      onChange={(e) => handleUpdate('oxidation', { enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>

                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-neutral-400" />
                    <div>
                      <span className="text-xs font-semibold text-white block">Оксидування / Чорніння срібла</span>
                      <span className="text-[10px] text-neutral-400">Хімічне або сірчане патинування рельєфу</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                  <span className="text-[11px] text-neutral-400">Ціна:</span>
                  <div className="relative w-28">
                    <input
                      type="number"
                      disabled={!galvanics.oxidation.enabled}
                      value={galvanics.oxidation.price || ''}
                      onChange={(e) =>
                        handleUpdate('oxidation', { price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                      placeholder="150"
                    />
                    <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                      грн
                    </span>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                    {formatCurrencyUAH(oxidationTotal)}
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
