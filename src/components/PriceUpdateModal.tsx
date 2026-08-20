import React from 'react';
import { PriceDiffItem } from '../types';
import { Layers, X, Check, ArrowRight } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';

interface PriceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  diffs: PriceDiffItem[];
  onApplyPrices: () => void;
}

export const PriceUpdateModal: React.FC<PriceUpdateModalProps> = ({
  isOpen,
  onClose,
  diffs,
  onApplyPrices,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12141c] border border-[#232838] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232838] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Синхронізація базових розцінок</h3>
              <p className="text-xs text-neutral-400">
                Порівняння ваших робочих цін з галузевим нормативом 2026 року
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1a1f2c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Table */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-3 text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#232838] text-neutral-400 font-medium">
                <th className="pb-2 pl-2">Операція</th>
                <th className="pb-2 px-2 text-right">Поточна ціна</th>
                <th className="pb-2 px-2 text-center w-8"></th>
                <th className="pb-2 px-2 text-right">Базова ціна</th>
                <th className="pb-2 pr-2 text-right">Різниця</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2330]">
              {diffs.map((item) => (
                <tr key={item.key} className="hover:bg-[#1a1f2c]/50">
                  <td className="py-2.5 pl-2">
                    <span className="font-semibold text-white block">{item.label}</span>
                    <span className="text-[10px] text-neutral-500">{item.category}</span>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-neutral-300">
                    {formatCurrencyUAH(item.currentValue)}
                  </td>
                  <td className="py-2.5 px-2 text-center text-neutral-600">
                    <ArrowRight className="w-3.5 h-3.5 mx-auto" />
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-amber-300">
                    {formatCurrencyUAH(item.newValue)}
                  </td>
                  <td className="py-2.5 pr-2 text-right font-mono">
                    {item.diff === 0 ? (
                      <span className="text-neutral-500">без змін</span>
                    ) : item.diff > 0 ? (
                      <span className="text-emerald-400 font-semibold">+{formatCurrencyUAH(item.diff)}</span>
                    ) : (
                      <span className="text-red-400 font-semibold">{formatCurrencyUAH(item.diff)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232838]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-[#1a1f2c] transition"
          >
            Скасувати
          </button>
          <button
            type="button"
            onClick={onApplyPrices}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Зафіксувати нові ціни</span>
          </button>
        </div>
      </div>
    </div>
  );
};
