import React from 'react';
import { AppState, CalculationResult } from '../types';
import { Printer, X } from 'lucide-react';
import { formatCurrencyUAH, formatNumber, METAL_COEFFICIENTS } from '../services/calculator';

interface PrintEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AppState;
  calc: CalculationResult;
}

export const PrintEstimateModal: React.FC<PrintEstimateModalProps> = ({
  isOpen,
  onClose,
  state,
  calc,
}) => {
  if (!isOpen) return null;

  const metalMeta = METAL_COEFFICIENTS[state.general.metal] || METAL_COEFFICIENTS.gold_585;
  const currentDate = new Date().toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:p-0 print:bg-white animate-fade-in">
      <div className="bg-white text-neutral-900 rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:w-full print:p-0">
        {/* Top Action Bar (hidden in print) */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-neutral-900">Попередній перегляд друку</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-neutral-950 transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Друкувати / Зберегти як PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Work Order / Estimate */}
        <div className="space-y-6 font-sans text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-neutral-900 pb-4">
            <div>
              <h1 className="text-xl font-black tracking-tight text-neutral-900 uppercase">
                ТЕХНОЛОГІЧНА СПЕЦИФІКАЦІЯ ТА КОШТОРИС
              </h1>
              <p className="text-neutral-500 font-mono mt-0.5">
                Наряд-замовлення № {state.general.orderNumber || '001'} | Дата: {currentDate}
              </p>
            </div>
            <div className="text-right">
              <span className="font-bold text-neutral-900 block text-sm">Ювелірне Виробництво</span>
              <span className="text-neutral-500 text-[11px]">Post-Casting & Assembly v2.0</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Виріб:</span>
              <span className="font-bold text-sm text-neutral-900">{state.general.productName}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Сплав та вага:</span>
              <span className="font-semibold text-neutral-800">
                {metalMeta.name} {metalMeta.purityLabel} — Чиста вага: {formatNumber(state.general.weight, 2)} г (з угаром{' '}
                {state.general.lossPercent}%: {formatNumber(calc.metalTotalWeightWithLoss, 2)} г)
              </span>
            </div>
          </div>

          {/* Detailed Calculations Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 text-neutral-600 font-semibold">
                <th className="py-2 text-left">№</th>
                <th className="py-2 text-left">Стаття витрат / Технологічна операція</th>
                <th className="py-2 text-center w-24">Кількість</th>
                <th className="py-2 text-right w-28">Ціна (грн)</th>
                <th className="py-2 text-right w-32">Сума (грн)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 text-neutral-800">
              <tr>
                <td className="py-2 text-neutral-400">1</td>
                <td className="py-2 font-medium">
                  Дорогоцінний метал ({metalMeta.name} {metalMeta.purityLabel}) з урахуванням втрат
                </td>
                <td className="py-2 text-center font-mono">{formatNumber(calc.metalTotalWeightWithLoss, 2)} г</td>
                <td className="py-2 text-right font-mono">{formatNumber(calc.metalPricePerGramAlloy, 2)}</td>
                <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.metalTotalCost)}</td>
              </tr>

              {calc.productionPrepSubtotal > 0 && (
                <tr>
                  <td className="py-2 text-neutral-400">2</td>
                  <td className="py-2 font-medium">
                    3D-дизайн та послуги лиття (CAD дизайн: {formatCurrencyUAH(calc.design3dCost)}, лиття: {formatCurrencyUAH(calc.castingCost)})
                  </td>
                  <td className="py-2 text-center font-mono">1 компл.</td>
                  <td className="py-2 text-right font-mono">-</td>
                  <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.productionPrepSubtotal)}</td>
                </tr>
              )}

              {calc.stonesTotalCount > 0 && (
                <tr>
                  <td className="py-2 text-neutral-400">3</td>
                  <td className="py-2 font-medium">Закріпка каміння (всі типи)</td>
                  <td className="py-2 text-center font-mono">{calc.stonesTotalCount} шт</td>
                  <td className="py-2 text-right font-mono">-</td>
                  <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.stoneSettingSubtotal)}</td>
                </tr>
              )}

              {calc.stoneMaterialSubtotal > 0 && (
                <tr>
                  <td className="py-2 text-neutral-400">4</td>
                  <td className="py-2 font-medium">Вставки (матеріал/закупівля каміння)</td>
                  <td className="py-2 text-center font-mono">-</td>
                  <td className="py-2 text-right font-mono">-</td>
                  <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.stoneMaterialSubtotal)}</td>
                </tr>
              )}

              {calc.assemblyWorksSubtotal > 0 && (
                <tr>
                  <td className="py-2 text-neutral-400">5</td>
                  <td className="py-2 font-medium">Слюсарна обробка, пайка та збирання вузлів</td>
                  <td className="py-2 text-center font-mono">1 компл.</td>
                  <td className="py-2 text-right font-mono">-</td>
                  <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.assemblyWorksSubtotal)}</td>
                </tr>
              )}

              {calc.finishingSubtotal > 0 && (
                <tr>
                  <td className="py-2 text-neutral-400">6</td>
                  <td className="py-2 font-medium">Фінішна обробка (полірування, матування, гравіювання)</td>
                  <td className="py-2 text-center font-mono">-</td>
                  <td className="py-2 text-right font-mono">-</td>
                  <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.finishingSubtotal)}</td>
                </tr>
              )}

              {calc.galvanicsSubtotal > 0 && (
                <tr>
                  <td className="py-2 text-neutral-400">7</td>
                  <td className="py-2 font-medium">Гальванічні покриття (родій / позолота / оксидування)</td>
                  <td className="py-2 text-center font-mono">-</td>
                  <td className="py-2 text-right font-mono">-</td>
                  <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.galvanicsSubtotal)}</td>
                </tr>
              )}

              {calc.additionalSubtotal > 0 && (
                <tr>
                  <td className="py-2 text-neutral-400">8</td>
                  <td className="py-2 font-medium">Витратні матеріали та апробація у Пробірній палаті</td>
                  <td className="py-2 text-center font-mono">-</td>
                  <td className="py-2 text-right font-mono">-</td>
                  <td className="py-2 text-right font-mono font-semibold">{formatCurrencyUAH(calc.additionalSubtotal)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Grand Totals */}
          <div className="border-t-2 border-neutral-900 pt-4 space-y-2">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>ЗАГАЛЬНА СОБІВАРТІСТЬ ВИГОТОВЛЕННЯ (Prime Cost):</span>
              <span className="font-mono text-base">{formatCurrencyUAH(calc.totalManufacturingCost)}</span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <div>
                <span className="block">
                  РЕКОМЕНДОВАНА ЦІНА РЕАЛІЗАЦІЇ (+{state.customMarkupPercent}%):
                </span>
                <span className="text-[11px] font-normal text-amber-800">
                  {state.customMarkupPercent === 30
                    ? 'Сегмент: Масмаркет (серійне/опт)'
                    : state.customMarkupPercent === 70
                    ? 'Сегмент: Авторський бренд / Хендмейд'
                    : state.customMarkupPercent === 150
                    ? 'Сегмент: Преміум / Люкс бутік'
                    : `Індивідуальна торговельна націнка (+${state.customMarkupPercent}%)`}
                  {' | '}Розрахункова маржа: +{formatCurrencyUAH(calc.customMarginVal)}
                </span>
              </div>
              <span className="font-mono text-xl text-amber-950 font-black">{formatCurrencyUAH(calc.customPrice)}</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-200">
            <div className="border-t border-neutral-400 pt-2">
              <span className="text-[11px] text-neutral-500 block">Майстер-ювелір / Монтувальник:</span>
              <span className="text-neutral-400 italic">________________ / (підпис)</span>
            </div>
            <div className="border-t border-neutral-400 pt-2 text-right">
              <span className="text-[11px] text-neutral-500 block">Замовник / Приймальник:</span>
              <span className="text-neutral-400 italic">________________ / (підпис)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
