import React from 'react';
import { CalculationResult, AppState } from '../types';
import { Award, CheckCircle, AlertTriangle, Lightbulb, Compass } from 'lucide-react';
import { formatCurrencyUAH, formatNumber, METAL_COEFFICIENTS } from '../services/calculator';

interface ExpertConclusionCardProps {
  state: AppState;
  calc: CalculationResult;
}

export const ExpertConclusionCard: React.FC<ExpertConclusionCardProps> = ({ state, calc }) => {
  const metalMeta = METAL_COEFFICIENTS[state.general.metal] || METAL_COEFFICIENTS.gold_585;

  // Analytical indicators
  const laborRatio = calc.laborToMetalRatio;
  const isHighStoneLabor = calc.stoneSettingSubtotal > calc.assemblyWorksSubtotal && calc.stonesTotalCount > 10;
  const isHeavyMetal = state.general.weight >= 12;

  let economicVerdict = '';
  if (laborRatio < 0.25) {
    economicVerdict =
      'Виріб переважно матеріаломісткий (важкий метал із мінімальною слюсарною обробкою). Основна собівартість залежить від біржових котирувань металу. Рекомендовано працювати за схемою з фіксацією курсу металу на день розрахунку.';
  } else if (laborRatio >= 0.25 && laborRatio <= 0.8) {
    economicVerdict =
      'Збалансована економічна структура. Трудомісткість робіт та вартість сплаву мають класичне ювелірне співвідношення, що забезпечує стабільну маржинальність у роздрібній реалізації.';
  } else {
    economicVerdict =
      'Високотехнологічний та трудомісткий виріб (висока частка закріпки, ручної обробки або гравіювання). Основну додану вартість створює ювелірна майстерність. Рекомендовано позиціонувати виріб у авторському або преміум-сегменті (+70%...+150% націнки).';
  }

  return (
    <div className="bg-[#12141c]/90 rounded-2xl border border-[#232838] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#232838]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">8. Експертний аналітичний висновок</h2>
            <p className="text-xs text-neutral-400">
              Оцінка провідного ювеліра-технолога та головного економіста виробництва
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0c0e14] border border-[#262c3e] text-[11px] font-medium text-neutral-300">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Складність: <strong className="text-amber-300">{calc.complexityScore}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Metric 1 */}
        <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#232838]">
          <span className="text-[11px] text-neutral-400 block mb-1">Коефіцієнт Робота / Метал</span>
          <div className="text-base font-bold font-mono text-white">
            {laborRatio}x
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">
            {laborRatio > 0.6 ? 'Переважає ручна праця майстра' : 'Переважає вартість дорогоцінного металу'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#232838]">
          <span className="text-[11px] text-neutral-400 block mb-1">Втрати на угар та обробку</span>
          <div className="text-base font-bold font-mono text-amber-400">
            {formatNumber(calc.metalLossWeight, 2)} г ({state.general.lossPercent}%)
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">
            Вартість угару: {formatCurrencyUAH(calc.metalLossWeight * calc.metalPricePerGramAlloy)}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#232838]">
          <span className="text-[11px] text-neutral-400 block mb-1">Кількість вставок</span>
          <div className="text-base font-bold font-mono text-purple-300">
            {calc.stonesTotalCount} шт
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">
            Закріпка: {formatCurrencyUAH(calc.stoneSettingSubtotal)}
          </p>
        </div>
      </div>

      {/* Analytical Reasoning Box */}
      <div className="bg-[#0c0e14] p-4 rounded-xl border border-[#232838] space-y-3">
        <div className="flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs">
            <h4 className="font-semibold text-neutral-200">Економічне та технологічне обґрунтування:</h4>
            <p className="text-neutral-400 leading-relaxed">{economicVerdict}</p>
          </div>
        </div>

        {/* Specific recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#1a1f2c] text-xs">
          <div className="flex items-start gap-2 text-neutral-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Норма угару:</strong> {state.general.lossPercent}% відповідає стандарту для{' '}
              {metalMeta.name} {metalMeta.purityLabel}.
            </span>
          </div>

          {state.finishing.laserEngraving.enabled && (
            <div className="flex items-start gap-2 text-neutral-300">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Лазерне маркування:</strong> підвищує захист від підробок та додає брендову цінність.
              </span>
            </div>
          )}

          {galvanicsProtectionCheck(state)}

          {isHighStoneLabor && (
            <div className="flex items-start gap-2 text-amber-300/90">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Контроль посадки каменів:</strong> Рекомендовано перевірку під мікроскопом 20x.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function galvanicsProtectionCheck(state: AppState) {
  if (state.general.metal === 'silver_925') {
    if (state.galvanics.rhodiumPlating.enabled) {
      return (
        <div className="flex items-start gap-2 text-neutral-300">
          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Родіювання срібла:</strong> запобігає потьмянінню та окисленню виробу на вітрині.
          </span>
        </div>
      );
    } else if (state.galvanics.oxidation.enabled) {
      return (
        <div className="flex items-start gap-2 text-neutral-300">
          <CheckCircle className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Оксидування:</strong> підкреслює об’ємний рельєф та створює вінтажний ефект.
          </span>
        </div>
      );
    }
  }
  return null;
}
