import React, { useState } from 'react';
import { PresetItem, AppState } from '../types';
import { BookmarkCheck, X, Check, Search, Plus, Sparkles, Scale, Gem } from 'lucide-react';
import { METAL_COEFFICIENTS } from '../services/calculator';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: PresetItem[];
  currentState: AppState;
  onApplyPreset: (preset: PresetItem) => void;
  onSaveCustomPreset: (preset: PresetItem) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  presets,
  currentState,
  onApplyPreset,
  onSaveCustomPreset,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Всі');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  if (!isOpen) return null;

  const categories = ['Всі', ...Array.from(new Set(presets.map((p) => p.category || 'Інше')))];

  const filteredPresets = presets.filter((p) => {
    const matchesCategory = activeCategory === 'Всі' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveCurrentAsPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newPreset: PresetItem = {
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      description: customDesc.trim() || 'Користувацький шаблон виробу',
      category: 'Користувацькі',
      settings: {
        general: currentState.general,
        works: currentState.works,
        stones: currentState.stones,
        finishing: currentState.finishing,
        galvanics: currentState.galvanics,
        additional: currentState.additional,
      },
    };

    onSaveCustomPreset(newPreset);
    setShowSaveForm(false);
    setCustomName('');
    setCustomDesc('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12141c] border border-[#232838] rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232838] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Готові шаблони ювелірних виробів</h3>
              <p className="text-xs text-neutral-400">
                Миттєве завантаження типових налаштувань монтування та закріпки
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

        {/* Search & Categories */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Пошук шаблону..."
              className="w-full bg-[#0c0e14] border border-[#262c3e] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowSaveForm(!showSaveForm)}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1a1f2c] hover:bg-[#222838] text-amber-300 border border-amber-500/30 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Зберегти поточний виріб</span>
          </button>
        </div>

        {/* Save Form Dropdown */}
        {showSaveForm && (
          <form
            onSubmit={handleSaveCurrentAsPreset}
            className="bg-[#0c0e14] p-4 rounded-xl border border-amber-500/30 space-y-3 animate-fade-in"
          >
            <h4 className="text-xs font-bold text-amber-300">Збереження поточного розрахунку як нового шаблону:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Назва шаблону (напр. Авторські сережки з перлами)"
                className="bg-[#12141c] border border-[#262c3e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Опис (особливості монтування чи закріпки)"
                className="bg-[#12141c] border border-[#262c3e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSaveForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:bg-[#1a1f2c]"
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950"
              >
                Зберегти шаблон
              </button>
            </div>
          </form>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'bg-[#0c0e14] text-neutral-400 hover:bg-[#1a1f2c] hover:text-white border border-[#232838]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="overflow-y-auto flex-1 pr-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPresets.map((preset) => {
            const metalMeta =
              METAL_COEFFICIENTS[preset.settings.general.metal] || METAL_COEFFICIENTS.gold_585;
            const stonesCount = preset.settings.stones.reduce((acc, s) => acc + (s.qty || 0), 0);

            return (
              <div
                key={preset.id}
                className="bg-[#0c0e14] p-4 rounded-xl border border-[#232838] hover:border-amber-500/50 transition flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 uppercase">
                      {preset.category}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {metalMeta.name} {metalMeta.purityLabel}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1a1f2c] text-xs">
                  <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3 h-3 text-neutral-500" />
                      {preset.settings.general.weight} г
                    </span>
                    {stonesCount > 0 && (
                      <span className="flex items-center gap-1">
                        <Gem className="w-3 h-3 text-purple-400" />
                        {stonesCount} вст.
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplyPreset(preset);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a1f2c] hover:bg-amber-500 hover:text-neutral-950 text-white transition shadow-sm border border-[#262c3e]"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Застосувати</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
