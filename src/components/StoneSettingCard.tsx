import React from 'react';
import { StoneRow, SettingType, StoneCategory } from '../types';
import { Gem, Plus, Trash2, ChevronDown } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';
import { INITIAL_DEFAULT_PRICES } from '../data/defaultPrices';

interface StoneSettingCardProps {
  stones: StoneRow[];
  onChange: (updatedStones: StoneRow[]) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const StoneSettingCard: React.FC<StoneSettingCardProps> = ({
  stones,
  onChange,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const handleAddStone = () => {
    const defaultSetting: SettingType = 'krapan';
    const defaultCategory: StoneCategory = 'cz';
    const suggestedPrice =
      INITIAL_DEFAULT_PRICES.stoneSetting[defaultSetting]?.[defaultCategory] || 40;

    const newStone: StoneRow = {
      id: 'stone_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      settingType: defaultSetting,
      stoneType: defaultCategory,
      qty: 1,
      settingPrice: suggestedPrice,
      stoneCostPerUnit: 0,
      comment: '',
    };
    onChange([...stones, newStone]);
  };

  const handleRemoveStone = (id: string) => {
    onChange(stones.filter((s) => s.id !== id));
  };

  const handleUpdateRow = (id: string, updated: Partial<StoneRow>) => {
    onChange(
      stones.map((s) => {
        if (s.id !== id) return s;
        const merged = { ...s, ...updated };

        // If settingType or stoneType changed and settingPrice was unchanged from default, auto-suggest
        if (updated.settingType || updated.stoneType) {
          const st = updated.settingType || s.settingType;
          const ct = updated.stoneType || s.stoneType;
          const autoPrice = INITIAL_DEFAULT_PRICES.stoneSetting[st]?.[ct];
          if (autoPrice !== undefined && !updated.settingPrice) {
            merged.settingPrice = autoPrice;
          }
        }
        return merged;
      })
    );
  };

  const totalStoneCount = stones.reduce((acc, s) => acc + (Number(s.qty) || 0), 0);
  const totalSettingLabor = stones.reduce(
    (acc, s) => acc + (Number(s.qty) || 0) * (Number(s.settingPrice) || 0),
    0
  );
  const totalStoneMaterials = stones.reduce(
    (acc, s) => acc + (Number(s.qty) || 0) * (Number(s.stoneCostPerUnit) || 0),
    0
  );
  const totalCombined = totalSettingLabor + totalStoneMaterials;

  return (
    <div
      id="card-stone-setting"
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
            <Gem className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                4. Закріпка каміння та вставки
              </h2>
              <span className="text-[10px] font-mono text-neutral-400 bg-[#0e1017] px-2 py-0.5 rounded-md border border-[#232838]">
                Блок 4 / 7
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5 hidden sm:block">
              Динамічна таблиця розрахунку вартості закріпки та матеріалів каменів
            </p>
          </div>
        </div>

        {/* Header Right: Add Stone Button + Badge + Chevron */}
        <div
          className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button, input, select')) {
              e.stopPropagation();
            }
          }}
        >
          <button
            id="btn-add-stone-row"
            type="button"
            onClick={handleAddStone}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Додати вставку</span>
          </button>

          <span className="text-xs font-semibold text-amber-300 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            {formatCurrencyUAH(totalCombined)} ({totalStoneCount} шт)
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
            {/* Mobile Add button */}
            <div className="sm:hidden flex justify-end">
              <button
                type="button"
                onClick={handleAddStone}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Додати вставку</span>
              </button>
            </div>

            {stones.length === 0 ? (
              <div className="text-center py-8 px-4 bg-[#0c0e14]/80 rounded-xl border border-[#232838]/70 flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#1b1f2b] flex items-center justify-center text-neutral-400">
                  <Gem className="w-5 h-5 opacity-60 text-amber-400" />
                </div>
                <p className="text-xs font-medium text-neutral-300">Вставок не додано</p>
                <p className="text-[11px] text-neutral-500 max-w-sm">
                  Якщо виріб містить фіаніти, діаманти або коштовні камені, натисніть{' '}
                  <strong className="text-amber-400 font-semibold">«+ Додати вставку»</strong> для точного розрахунку закріпки.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#232838] text-neutral-400 font-medium">
                        <th className="pb-2 pl-2">Тип закріпки</th>
                        <th className="pb-2 px-2">Вид каменю</th>
                        <th className="pb-2 px-2 w-20 text-center">К-сть (шт)</th>
                        <th className="pb-2 px-2 w-24 text-right">Закріпка (грн)</th>
                        <th className="pb-2 px-2 w-24 text-right">Камінь (грн/шт)</th>
                        <th className="pb-2 px-2 w-28 text-right">Разом</th>
                        <th className="pb-2 pr-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e2330]">
                      {stones.map((stone) => {
                        const rowTotal =
                          (Number(stone.qty) || 0) *
                          ((Number(stone.settingPrice) || 0) + (Number(stone.stoneCostPerUnit) || 0));

                        return (
                          <tr key={stone.id} className="hover:bg-[#161a24] transition">
                            {/* Setting Type */}
                            <td className="py-2.5 pl-2">
                              <select
                                value={stone.settingType}
                                onChange={(e) =>
                                  handleUpdateRow(stone.id, {
                                    settingType: e.target.value as SettingType,
                                  })
                                }
                                className="w-full bg-[#0c0e14] border border-[#262c3e] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                              >
                                <option value="krapan">Крапанова (Krapan)</option>
                                <option value="gluha">Глуха (Bezel)</option>
                                <option value="pave">Паве / Мікропаве</option>
                                <option value="channel">Канальна (Channel)</option>
                                <option value="korner">Корнерова</option>
                                <option value="other">Спеціальна / Інше</option>
                              </select>
                            </td>

                            {/* Stone Category */}
                            <td className="py-2.5 px-2">
                              <select
                                value={stone.stoneType}
                                onChange={(e) =>
                                  handleUpdateRow(stone.id, {
                                    stoneType: e.target.value as StoneCategory,
                                  })
                                }
                                className="w-full bg-[#0c0e14] border border-[#262c3e] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                              >
                                <option value="cz">Фіаніт / Цирконій (CZ)</option>
                                <option value="diamond_small">Діамант дрібний (&le;0.05 ct)</option>
                                <option value="diamond_med">Діамант середній (0.06 - 0.29 ct)</option>
                                <option value="diamond_large">Діамант великий (&ge;0.30 ct)</option>
                                <option value="precious">Смарагд / Рубін / Сапфір</option>
                                <option value="semiprecious">Напівкоштовні (топаз, гранат)</option>
                                <option value="pearl">Перли / Опал (вклейка)</option>
                              </select>
                            </td>

                            {/* Qty */}
                            <td className="py-2.5 px-2">
                              <input
                                type="number"
                                min="1"
                                max="5000"
                                value={stone.qty || ''}
                                onChange={(e) =>
                                  handleUpdateRow(stone.id, {
                                    qty: parseInt(e.target.value, 10) || 0,
                                  })
                                }
                                className="w-full bg-[#0c0e14] border border-[#262c3e] rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                              />
                            </td>

                            {/* Setting Price per unit */}
                            <td className="py-2.5 px-2">
                              <input
                                type="number"
                                min="0"
                                value={stone.settingPrice || ''}
                                onChange={(e) =>
                                  handleUpdateRow(stone.id, {
                                    settingPrice: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full bg-[#0c0e14] border border-[#262c3e] rounded-lg px-2 py-1 text-xs text-amber-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                                placeholder="40"
                              />
                            </td>

                            {/* Stone Material Cost per unit */}
                            <td className="py-2.5 px-2">
                              <input
                                type="number"
                                min="0"
                                value={stone.stoneCostPerUnit || ''}
                                onChange={(e) =>
                                  handleUpdateRow(stone.id, {
                                    stoneCostPerUnit: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full bg-[#0c0e14] border border-[#262c3e] rounded-lg px-2 py-1 text-xs text-neutral-300 font-mono text-right focus:outline-none focus:ring-1 focus:ring-amber-500"
                                placeholder="0"
                                title="Вартість закупівлі каменю (залиште 0, якщо камінь замовника)"
                              />
                            </td>

                            {/* Row Total */}
                            <td className="py-2.5 px-2 text-right font-mono font-bold text-white">
                              {formatCurrencyUAH(rowTotal)}
                            </td>

                            {/* Delete */}
                            <td className="py-2.5 pr-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveStone(stone.id)}
                                className="p-1 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-[#1f2433] transition"
                                title="Видалити позицію"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table summary info strip */}
                <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#232838] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-neutral-400 font-medium">
                    <span>
                      Всього каменів: <strong className="text-white font-mono">{totalStoneCount} шт</strong>
                    </span>
                    <span>
                      Робота закріпки:{' '}
                      <strong className="text-amber-300 font-mono">{formatCurrencyUAH(totalSettingLabor)}</strong>
                    </span>
                    {totalStoneMaterials > 0 && (
                      <span>
                        Каміння (матеріал):{' '}
                        <strong className="text-neutral-300 font-mono">
                          {formatCurrencyUAH(totalStoneMaterials)}
                        </strong>
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-neutral-400 mr-2">Разом за вставки:</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {formatCurrencyUAH(totalCombined)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
