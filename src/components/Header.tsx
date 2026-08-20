import React from 'react';
import {
  Sparkles,
  RefreshCw,
  FolderOpen,
  Save,
  FileText,
  BookmarkCheck,
  Printer,
  Layers,
  Coins,
} from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';
import { MetalPricingState } from '../types';

interface HeaderProps {
  metalPricing: MetalPricingState;
  onRefreshNBU: () => void;
  onOpenPriceModal: () => void;
  onOpenPresetModal: () => void;
  onOpenImportModal: () => void;
  onExportJson: () => void;
  onExportTxt: () => void;
  onPrint: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metalPricing,
  onRefreshNBU,
  onOpenPriceModal,
  onOpenPresetModal,
  onOpenImportModal,
  onExportJson,
  onExportTxt,
  onPrint,
  onReset,
}) => {
  const { nbuRates } = metalPricing;

  return (
    <header className="bg-[#101216]/95 backdrop-blur-md border-b border-[#222733] sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/10 text-neutral-950 font-bold">
              <Sparkles className="w-4 h-4 text-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                  Jewelry Post-Casting & Assembly Calculator
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 uppercase tracking-wider">
                    Specialist v2.0
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-neutral-400">
                Калькулятор ювелірного монтування, закріпки, фінішної обробки та економіки собівартості
              </p>
            </div>
          </div>

          {/* Quick Metal Rates Ticker */}
          <div className="flex flex-wrap items-center gap-2 text-xs bg-[#161922] px-3 py-1.5 rounded-lg border border-[#272d3b]">
            <div className="flex items-center gap-1.5 text-neutral-400 font-medium mr-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px]">НБУ 999.9:</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300 font-mono text-[11px]">
              <span className="text-neutral-500">Au:</span>
              <span>{formatCurrencyUAH(nbuRates.gold_999 || 0)}/г</span>
            </div>
            <span className="text-neutral-700">|</span>
            <div className="flex items-center gap-1 text-neutral-300 font-mono text-[11px]">
              <span className="text-neutral-500">Ag:</span>
              <span>{formatCurrencyUAH(nbuRates.silver_999 || 0)}/г</span>
            </div>
            <span className="text-neutral-700">|</span>
            <div className="flex items-center gap-1 text-cyan-300 font-mono text-[11px]">
              <span className="text-neutral-500">Pt:</span>
              <span>{formatCurrencyUAH(nbuRates.platinum_999 || 0)}/г</span>
            </div>
            {nbuRates.date && (
              <span className="text-[10px] text-neutral-500 ml-1">({nbuRates.date})</span>
            )}
          </div>

          {/* Top Actions Panel */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full lg:w-auto">
            <button
              id="btn-refresh-nbu"
              onClick={onRefreshNBU}
              disabled={nbuRates.isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1a1d27] hover:bg-[#222736] text-neutral-200 border border-[#2a3040] hover:border-neutral-600 transition shadow-sm disabled:opacity-50"
              title="Оновити курси дорогоцінних металів з сайту Національного банку України"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${nbuRates.isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Метал</span> НБУ
            </button>

            <button
              id="btn-update-prices"
              onClick={onOpenPriceModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1a1d27] hover:bg-[#222736] text-neutral-200 border border-[#2a3040] hover:border-neutral-600 transition shadow-sm"
              title="Перевірити та оновити базові розцінки робіт за нормативами 2026"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Розцінки</span>
            </button>

            <button
              id="btn-open-presets"
              onClick={onOpenPresetModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition shadow-sm"
              title="Застосувати готовий шаблон виробу (каблучка, ланцюжок, сережки тощо)"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Шаблони</span>
            </button>

            <div className="h-4 w-px bg-neutral-700 mx-0.5 hidden sm:block" />

            <button
              id="btn-export-txt"
              onClick={onExportTxt}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1a1d27] hover:bg-[#222736] text-neutral-200 border border-[#2a3040] transition"
              title="Завантажити структурований текстовий кошторис .TXT"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Звіт TXT</span>
            </button>

            <button
              id="btn-export-json"
              onClick={onExportJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1a1d27] hover:bg-[#222736] text-neutral-200 border border-[#2a3040] transition"
              title="Зберегти весь поточний проєкт у файл .JSON"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON</span>
            </button>

            <button
              id="btn-import-json"
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1a1d27] hover:bg-[#222736] text-neutral-200 border border-[#2a3040] transition"
              title="Завантажити збережений проєкт .JSON"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Відкрити</span>
            </button>

            <button
              id="btn-print"
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#1a1d27] hover:bg-[#222736] text-neutral-200 border border-[#2a3040] transition"
              title="Роздрукувати кошторис або зберегти як PDF"
            >
              <Printer className="w-3.5 h-3.5 text-neutral-300" />
              <span className="hidden md:inline">Друк</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
