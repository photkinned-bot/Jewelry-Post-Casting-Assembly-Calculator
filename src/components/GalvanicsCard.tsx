import React from 'react';
import { GalvanicsState, RhodiumType } from '../types';
import { Droplet, Sun, Moon } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';

interface GalvanicsCardProps {
  galvanics: GalvanicsState;
  onChange: (updated: Partial<GalvanicsState>) => void;
}

export const GalvanicsCard: React.FC<GalvanicsCardProps> = ({ galvanics, onChange }) => {
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
    <div className="bg-[#12141c]/90 rounded-2xl border border-[#232838] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#232838]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Droplet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">6. Гальваніка та покриття поверхонь</h2>
            <p className="text-xs text-neutral-400">Родіювання (біле/чорне), золочення та художнє чорніння</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-neutral-400">Підсумок: </span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {formatCurrencyUAH(totalGalvanics)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
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
                <Droplet className="w-4 h-4 text-cyan-300" />
                <span className="text-xs font-semibold text-white">Родіювання виробу</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <select
                value={galvanics.rhodiumPlating.type}
                disabled={!galvanics.rhodiumPlating.enabled}
                onChange={(e) =>
                  handleUpdate('rhodiumPlating', {
                    type: e.target.value as RhodiumType,
                    price: e.target.value === 'white' ? 350 : e.target.value === 'black' ? 420 : 550,
                  })
                }
                className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="white">Білий родій</option>
                <option value="black">Чорний родій (Black Rhodium)</option>
                <option value="selective">Селективне / Двоколірне</option>
              </select>

              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!galvanics.rhodiumPlating.enabled}
                  value={galvanics.rhodiumPlating.price || ''}
                  onChange={(e) => handleUpdate('rhodiumPlating', { price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="350"
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
                <span className="text-xs font-semibold text-white">Золочення / Позолота</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <span className="text-[11px] text-neutral-400">Ціна:</span>
              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!galvanics.goldPlating.enabled}
                  value={galvanics.goldPlating.price || ''}
                  onChange={(e) => handleUpdate('goldPlating', { price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="400"
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
                <span className="text-xs font-semibold text-white">Оксидування / Чорніння срібла</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <span className="text-[11px] text-neutral-400">Ціна:</span>
              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!galvanics.oxidation.enabled}
                  value={galvanics.oxidation.price || ''}
                  onChange={(e) => handleUpdate('oxidation', { price: parseFloat(e.target.value) || 0 })}
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
  );
};
