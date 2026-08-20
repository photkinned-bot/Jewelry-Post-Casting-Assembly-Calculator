import React from 'react';
import { StoneRow, SettingType, StoneCategory } from '../types';
import { Gem, Plus, Trash2, Info } from 'lucide-react';
import { formatCurrencyUAH } from '../services/calculator';
import { INITIAL_DEFAULT_PRICES } from '../data/defaultPrices';

interface StoneSettingCardProps {
  stones: StoneRow[];
  onChange: (updatedStones: StoneRow[]) => void;
}

export const StoneSettingCard: React.FC<StoneSettingCardProps> = ({ stones, onChange }) => {
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
    <div className="bg-[#12141c]/90 rounded-2xl border border-[#232838] p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232838]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Gem className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">4. Закріпка каміння та вставки</h2>
            <p className="text-xs text-neutral-400">
              Динамічна таблиця розрахунку вартості закріпки та матеріалів каменів
            </p>
          </div>
        </div>

        <button
          id="btn-add-stone-row"
          type="button"
          onClick={handleAddStone}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Додати вставку</span>
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
              <tbody className="divide-y divide-[#232838]/60">
                {stones.map((stone) => {
                  const rowLabor = (Number(stone.qty) || 0) * (Number(stone.settingPrice) || 0);
                  const rowStoneCost = (Number(stone.qty) || 0) * (Number(stone.stoneCostPerUnit) || 0);
                  const rowTotal = rowLabor + rowStoneCost;

                  return (
                    <tr key={stone.id} className="hover:bg-[#181c28]/60 transition">
                      {/* Setting Type */}
                      <td className="py-2.5 pl-2">
                        <select
                          value={stone.settingType}
                          onChange={(e) =>
                            handleUpdateRow(stone.id, {
                              settingType: e.target.value as SettingType,
                            })
                          }
                          className="bg-[#0c0e14] border border-[#262c3e] text-neutral-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-full"
                        >
                          <option value="krapan">Крапанова</option>
                          <option value="bezel">Глуха (Bezel)</option>
                          <option value="korner">Корнерова</option>
                          <option value="pave">Паве (Pave)</option>
                          <option value="microscope">Мікроскоп</option>
                          <option value="channel">Канальна</option>
                          <option value="fantasy">Фантазійна</option>
                        </select>
                      </td>

                      {/* Stone Type */}
                      <td className="py-2.5 px-2">
                        <select
                          value={stone.stoneType}
                          onChange={(e) =>
                            handleUpdateRow(stone.id, {
                              stoneType: e.target.value as StoneCategory,
                            })
                          }
                          className="bg-[#0c0e14] border border-[#262c3e] text-neutral-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-full"
                        >
                          <option value="cz">Фіаніти (CZ)</option>
                          <option value="diamond">Діаманти</option>
                          <option value="precious">Сапфір / Смарагд / Рубін</option>
                          <option value="semiprecious">Напівдорогоцінне</option>
                          <option value="pearl">Перли</option>
                        </select>
                      </td>

                      {/* Quantity */}
                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={stone.qty || ''}
                          onChange={(e) =>
                            handleUpdateRow(stone.id, {
                              qty: parseInt(e.target.value, 10) || 0,
                            })
                          }
                          className="w-full bg-[#0c0e14] border border-[#262c3e] rounded-lg px-2 py-1 text-xs text-white font-mono text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>

                      {/* Setting Price */}
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
                          placeholder="80"
                        />
                      </td>

                      {/* Stone Material Price */}
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
              <span>Всього каменів: <strong className="text-white font-mono">{totalStoneCount} шт</strong></span>
              <span>Робота закріпки: <strong className="text-amber-300 font-mono">{formatCurrencyUAH(totalSettingLabor)}</strong></span>
              {totalStoneMaterials > 0 && (
                <span>Каміння (матеріал): <strong className="text-neutral-300 font-mono">{formatCurrencyUAH(totalStoneMaterials)}</strong></span>
              )}
            </div>

            <div className="text-right">
              <span className="text-neutral-400 mr-2">Разом за блок:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {formatCurrencyUAH(totalCombined)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
