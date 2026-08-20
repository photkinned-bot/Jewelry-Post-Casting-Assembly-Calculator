import React from 'react';
import { FinishingState, PolishingType, MattingType, LaserType, EnamelType } from '../types';
import { Sparkle, Sliders, Type, Zap, Palette, ChevronDown } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';

interface FinishingCardProps {
  finishing: FinishingState;
  onChange: (updated: Partial<FinishingState>) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const FinishingCard: React.FC<FinishingCardProps> = ({
  finishing,
  onChange,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const handleUpdate = <K extends keyof FinishingState>(key: K, data: Partial<FinishingState[K]>) => {
    onChange({
      [key]: { ...finishing[key], ...data },
    });
  };

  const polishingTotal = finishing.polishing.enabled ? finishing.polishing.qty * finishing.polishing.price : 0;
  const mattingTotal = finishing.matting.enabled ? finishing.matting.qty * finishing.matting.price : 0;
  const engravingTotal = finishing.engraving.enabled ? finishing.engraving.qty * finishing.engraving.price : 0;
  const laserTotal = finishing.laserEngraving.enabled ? finishing.laserEngraving.qty * finishing.laserEngraving.price : 0;
  const enamelTotal = finishing.enameling.enabled ? finishing.enameling.qty * finishing.enameling.price : 0;

  const totalFinishing = polishingTotal + mattingTotal + engravingTotal + laserTotal + enamelTotal;

  return (
    <div
      id="card-finishing"
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
            <Sparkle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                7. Фінішна обробка та декорування
              </h2>
              <span className="text-[10px] font-mono text-neutral-400 bg-[#0e1017] px-2 py-0.5 rounded-md border border-[#232838]">
                Блок 7 / 8
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5 hidden sm:block">
              Полірування, матування, лазерне та ручне гравіювання, емаль
            </p>
          </div>
        </div>

        {/* Badge & Chevron */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="text-xs font-semibold text-amber-300 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            {formatCurrencyUAH(totalFinishing)}
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

        {/* 1. Polishing */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            finishing.polishing.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-polishing-enabled"
                  checked={finishing.polishing.enabled}
                  onChange={(e) => handleUpdate('polishing', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Полірування виробу</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <select
                value={finishing.polishing.type}
                disabled={!finishing.polishing.enabled}
                onChange={(e) =>
                  handleUpdate('polishing', {
                    type: e.target.value as PolishingType,
                    price: e.target.value === 'manual' ? 150 : e.target.value === 'tumbling' ? 70 : 120,
                  })
                }
                className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="manual">Ручне (стандарт)</option>
                <option value="tumbling">Галтовка / Барабан</option>
                <option value="fluff">Пушок / Фінішний глянець</option>
              </select>

              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!finishing.polishing.enabled}
                  value={finishing.polishing.price || ''}
                  onChange={(e) => handleUpdate('polishing', { price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="150"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(polishingTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Matting / Texturing */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            finishing.matting.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-matting-enabled"
                  checked={finishing.matting.enabled}
                  onChange={(e) => handleUpdate('matting', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">Матування / Сатинування</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <select
                value={finishing.matting.type}
                disabled={!finishing.matting.enabled}
                onChange={(e) =>
                  handleUpdate('matting', {
                    type: e.target.value as MattingType,
                    price: e.target.value === 'sandblast' ? 120 : e.target.value === 'brush' ? 90 : 180,
                  })
                }
                className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="sandblast">Піскоструй (Sandblast)</option>
                <option value="brush">Щітка / Сатин</option>
                <option value="diamond">Алмазна грань</option>
              </select>

              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!finishing.matting.enabled}
                  value={finishing.matting.price || ''}
                  onChange={(e) => handleUpdate('matting', { price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="120"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(mattingTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Manual Engraving */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            finishing.engraving.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-manual-engraving-enabled"
                  checked={finishing.engraving.enabled}
                  onChange={(e) => handleUpdate('engraving', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Ручне штихельне гравіювання</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <span className="text-[11px] text-neutral-400">Знаків:</span>
              <div className="relative w-20">
                <input
                  type="number"
                  min="1"
                  disabled={!finishing.engraving.enabled}
                  value={finishing.engraving.qty || ''}
                  onChange={(e) => handleUpdate('engraving', { qty: parseInt(e.target.value, 10) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="10"
                />
              </div>

              <span className="text-[11px] text-neutral-400">Ціна/знак:</span>
              <div className="relative w-24">
                <input
                  type="number"
                  disabled={!finishing.engraving.enabled}
                  value={finishing.engraving.price || ''}
                  onChange={(e) => handleUpdate('engraving', { price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="45"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(engravingTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Laser Engraving */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            finishing.laserEngraving.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-laser-engraving-enabled"
                  checked={finishing.laserEngraving.enabled}
                  onChange={(e) => handleUpdate('laserEngraving', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-white">Лазерне гравіювання</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <select
                value={finishing.laserEngraving.type}
                disabled={!finishing.laserEngraving.enabled}
                onChange={(e) =>
                  handleUpdate('laserEngraving', {
                    type: e.target.value as LaserType,
                    price: e.target.value === '3d' ? 450 : 250,
                  })
                }
                className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="inside">Всередині (напис / дата)</option>
                <option value="outside">Зовні / По периметру</option>
                <option value="3d">3D Рельєфне / Глибоке</option>
              </select>

              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!finishing.laserEngraving.enabled}
                  value={finishing.laserEngraving.price || ''}
                  onChange={(e) => handleUpdate('laserEngraving', { price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="250"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(laserTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Enameling */}
        <div
          className={`p-3.5 rounded-xl border transition ${
            finishing.enameling.enabled
              ? 'bg-[#0c0e14] border-[#293044]'
              : 'bg-[#0c0e14]/40 border-[#1f2433]/40 opacity-70'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-enamel-enabled"
                  checked={finishing.enameling.enabled}
                  onChange={(e) => handleUpdate('enameling', { enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-[#1b1f2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
              </label>

              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-white">Ювелірне емалювання</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <select
                value={finishing.enameling.type}
                disabled={!finishing.enameling.enabled}
                onChange={(e) =>
                  handleUpdate('enameling', {
                    type: e.target.value as EnamelType,
                    price: e.target.value === 'hot' ? 550 : 200,
                  })
                }
                className="bg-[#12151e] border border-[#262c3e] text-xs text-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
              >
                <option value="cold">Холодна емаль</option>
                <option value="hot">Гаряча перегородчаста</option>
              </select>

              <div className="relative w-28">
                <input
                  type="number"
                  disabled={!finishing.enameling.enabled}
                  value={finishing.enameling.price || ''}
                  onChange={(e) => handleUpdate('enameling', { price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#12151e] border border-[#262c3e] rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
                  placeholder="200"
                />
                <span className="absolute right-2 top-1.5 text-[10px] text-neutral-500 pointer-events-none">
                  грн
                </span>
              </div>

              <div className="w-24 text-right font-mono font-semibold text-xs text-white">
                {formatCurrencyUAH(enamelTotal)}
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

