import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AppState, PresetItem, PriceDiffItem, ProductionPrepState } from './types';
import { loadSavedState, saveCurrentState, exportProjectJson } from './services/storage';
import { calculateCost, computePriceDiffs } from './services/calculator';
import { fetchNBUMetalRates, NBURateResult } from './services/nbuApi';
import { downloadTxtReport } from './services/exporter';
import { DEFAULT_PRESETS } from './data/presets';
import { INITIAL_DEFAULT_PRICES } from './data/defaultPrices';
import { ChevronsDownUp, ChevronsUpDown, LayoutGrid } from 'lucide-react';

// Components
import { Header } from './components/Header';
import { GeneralInfoCard } from './components/GeneralInfoCard';
import { MetalRateCard } from './components/MetalRateCard';
import { ProductionPrepCard } from './components/ProductionPrepCard';
import { AssemblyWorksCard } from './components/AssemblyWorksCard';
import { StoneSettingCard } from './components/StoneSettingCard';
import { GalvanicsCard } from './components/GalvanicsCard';
import { FinishingCard } from './components/FinishingCard';
import { AdditionalExpensesCard } from './components/AdditionalExpensesCard';
import { CostSummaryCard } from './components/CostSummaryCard';
import { ExpertConclusionCard } from './components/ExpertConclusionCard';

// Modals
import { PresetModal } from './components/PresetModal';
import { PriceUpdateModal } from './components/PriceUpdateModal';
import { ImportProjectModal } from './components/ImportProjectModal';
import { PrintEstimateModal } from './components/PrintEstimateModal';

export const App: React.FC = () => {
  // 1. Central Application State
  const [state, setState] = useState<AppState>(() => loadSavedState());

  // 2. Collapsed Sections State
  const [collapsedSections, setCollapsedSections] = useState<{
    general: boolean;
    metalPricing: boolean;
    productionPrep: boolean;
    assemblyWorks: boolean;
    stoneSetting: boolean;
    galvanics: boolean;
    finishing: boolean;
    additionalExpenses: boolean;
    expertConclusion: boolean;
  }>({
    general: false,
    metalPricing: false,
    productionPrep: false,
    assemblyWorks: false,
    stoneSetting: false,
    galvanics: false,
    finishing: false,
    additionalExpenses: false,
    expertConclusion: false,
  });

  const toggleSection = (sectionKey: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const expandAllSections = () => {
    setCollapsedSections({
      general: false,
      metalPricing: false,
      productionPrep: false,
      assemblyWorks: false,
      stoneSetting: false,
      galvanics: false,
      finishing: false,
      additionalExpenses: false,
      expertConclusion: false,
    });
  };

  const collapseAllSections = () => {
    setCollapsedSections({
      general: true,
      metalPricing: true,
      productionPrep: true,
      assemblyWorks: true,
      stoneSetting: true,
      galvanics: true,
      finishing: true,
      additionalExpenses: true,
      expertConclusion: true,
    });
  };

  const totalSectionsCount = 9;
  const expandedSectionsCount = Object.values(collapsedSections).filter((c) => !c).length;

  // 3. Modals state
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isPriceDiffModalOpen, setIsPriceDiffModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // 4. Presets list (default + custom from localStorage)
  const [presets, setPresets] = useState<PresetItem[]>(() => {
    try {
      const savedCustom = localStorage.getItem('jewelry_calc_custom_presets');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        return [...DEFAULT_PRESETS, ...parsed];
      }
    } catch {
      // ignore
    }
    return DEFAULT_PRESETS;
  });

  // 5. Toast notification state
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(
    null
  );

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // 6. Automatic State Persistence
  useEffect(() => {
    saveCurrentState(state);
  }, [state]);

  // 7. Automatic NBU Rates Fetching on Initial Mount
  useEffect(() => {
    let isMounted = true;
    fetchNBUMetalRates().then((result: NBURateResult) => {
      if (!isMounted) return;
      if (result.gold_999 > 0) {
        setState((prev) => ({
          ...prev,
          metalPricing: {
            ...prev.metalPricing,
            nbuRates: {
              gold_999: result.gold_999,
              silver_999: result.silver_999,
              platinum_999: result.platinum_999,
              lastUpdated: result.date,
              isLoading: false,
              error: null,
            },
          },
        }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // 8. Manual NBU Rates Refresh Trigger
  const handleRefreshNbuRates = async () => {
    showToast('Оновлення біржових курсів металів через НБУ...', 'info');
    try {
      const result = await fetchNBUMetalRates(true);
      setState((prev) => ({
        ...prev,
        metalPricing: {
          ...prev.metalPricing,
          nbuRates: {
            gold_999: result.gold_999,
            silver_999: result.silver_999,
            platinum_999: result.platinum_999,
            lastUpdated: result.date,
            isLoading: false,
            error: null,
          },
        },
      }));
      showToast('Офіційні курси банківських металів НБУ оновлено!', 'success');
    } catch {
      showToast('Помилка запиту до НБУ. Використано збережені курси', 'error');
    }
  };

  // 9. Calculation Execution
  const calculation = useMemo(() => {
    return calculateCost(state);
  }, [state]);

  // 10. Handlers for partial updates
  const handleGeneralChange = (updated: Partial<AppState['general']>) => {
    setState((prev) => ({
      ...prev,
      general: { ...prev.general, ...updated },
    }));
  };

  const handleMetalPricingChange = (updated: Partial<AppState['metalPricing']>) => {
    setState((prev) => ({
      ...prev,
      metalPricing: { ...prev.metalPricing, ...updated },
    }));
  };

  const handleProductionPrepChange = (updated: Partial<ProductionPrepState>) => {
    setState((prev) => ({
      ...prev,
      productionPrep: { ...prev.productionPrep, ...updated },
    }));
  };

  const handleWorksChange = (updated: Partial<AppState['works']>) => {
    setState((prev) => ({
      ...prev,
      works: { ...prev.works, ...updated },
    }));
  };

  const handleStonesChange = (updatedStones: AppState['stones']) => {
    setState((prev) => ({
      ...prev,
      stones: updatedStones,
    }));
  };

  const handleFinishingChange = (updated: Partial<AppState['finishing']>) => {
    setState((prev) => ({
      ...prev,
      finishing: { ...prev.finishing, ...updated },
    }));
  };

  const handleGalvanicsChange = (updated: Partial<AppState['galvanics']>) => {
    setState((prev) => ({
      ...prev,
      galvanics: { ...prev.galvanics, ...updated },
    }));
  };

  const handleAdditionalChange = (updated: Partial<AppState['additional']>) => {
    setState((prev) => ({
      ...prev,
      additional: { ...prev.additional, ...updated },
    }));
  };

  const handleCustomMarkupChange = (markup: number) => {
    setState((prev) => ({
      ...prev,
      customMarkupPercent: markup,
    }));
  };

  // 11. Presets Application
  const handleApplyPreset = (preset: PresetItem) => {
    setState((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        ...preset.settings.general,
        productName: preset.name,
      },
      productionPrep: preset.settings.productionPrep
        ? { ...prev.productionPrep, ...preset.settings.productionPrep }
        : prev.productionPrep,
      works: { ...prev.works, ...preset.settings.works },
      stones: preset.settings.stones.map((s) => ({ ...s })),
      finishing: { ...prev.finishing, ...preset.settings.finishing },
      galvanics: { ...prev.galvanics, ...preset.settings.galvanics },
      additional: { ...prev.additional, ...preset.settings.additional },
    }));
    showToast(`Застосовано шаблон: "${preset.name}"`, 'success');
  };

  const handleSaveCustomPreset = (newPreset: PresetItem) => {
    const updated = [...presets, newPreset];
    setPresets(updated);
    try {
      const customOnly = updated.filter((p) => p.id.startsWith('custom_'));
      localStorage.setItem('jewelry_calc_custom_presets', JSON.stringify(customOnly));
    } catch {
      // ignore
    }
    showToast(`Шаблон "${newPreset.name}" збережено!`, 'success');
  };

  // 12. Price Diff Sync Modal
  const priceDiffs: PriceDiffItem[] = useMemo(() => {
    return computePriceDiffs(state, INITIAL_DEFAULT_PRICES);
  }, [state]);

  const handleApplyStandardPrices = () => {
    setState((prev) => ({
      ...prev,
      productionPrep: {
        design3d: { ...prev.productionPrep.design3d, price: INITIAL_DEFAULT_PRICES.productionPrep.design3d_base },
        casting: {
          ...prev.productionPrep.casting,
          price:
            prev.productionPrep.casting.type === 'per_gram'
              ? INITIAL_DEFAULT_PRICES.productionPrep.casting_per_gram
              : INITIAL_DEFAULT_PRICES.productionPrep.casting_fixed,
        },
      },
      works: {
        grinding: { ...prev.works.grinding, price: INITIAL_DEFAULT_PRICES.works.grinding_fixed },
        soldering: { ...prev.works.soldering, price: INITIAL_DEFAULT_PRICES.works.soldering_per_point },
        assembly: { ...prev.works.assembly, price: INITIAL_DEFAULT_PRICES.works.assembly_base },
        customElements: { ...prev.works.customElements, price: INITIAL_DEFAULT_PRICES.works.custom_elements_base },
      },
      finishing: {
        polishing: { ...prev.finishing.polishing, price: INITIAL_DEFAULT_PRICES.finishing.polishing_manual },
        matting: { ...prev.finishing.matting, price: INITIAL_DEFAULT_PRICES.finishing.matting_sandblast },
        engraving: { ...prev.finishing.engraving, price: INITIAL_DEFAULT_PRICES.finishing.engraving_manual_per_char },
        laserEngraving: { ...prev.finishing.laserEngraving, price: INITIAL_DEFAULT_PRICES.finishing.laser_inside },
        enameling: { ...prev.finishing.enameling, price: INITIAL_DEFAULT_PRICES.finishing.enamel_cold },
      },
      galvanics: {
        rhodiumPlating: { ...prev.galvanics.rhodiumPlating, price: INITIAL_DEFAULT_PRICES.galvanics.rhodium_white },
        goldPlating: { ...prev.galvanics.goldPlating, price: INITIAL_DEFAULT_PRICES.galvanics.gold_plating },
        oxidation: { ...prev.galvanics.oxidation, price: INITIAL_DEFAULT_PRICES.galvanics.oxidation_silver },
      },
      additional: {
        consumables: { ...prev.additional.consumables, value: INITIAL_DEFAULT_PRICES.additional.consumables_percent },
        assayOffice: { ...prev.additional.assayOffice, price: INITIAL_DEFAULT_PRICES.additional.assay_office_per_item },
      },
    }));
    setIsPriceDiffModalOpen(false);
    showToast('Базові нормативи розцінок успішно синхронізовано!', 'success');
  };

  // 13. Import / Export / Reset
  const handleImportSuccess = (imported: AppState) => {
    setState(imported);
    showToast(`Проєкт "${imported.general.productName}" успішно завантажено`, 'success');
  };

  const handleExportProjectJson = () => {
    exportProjectJson(state);
    showToast('Файл проєкту (.JSON) завантажено на пристрій', 'success');
  };

  const handleExportTxt = () => {
    downloadTxtReport(state, calculation);
    showToast('Офіційний текстовий кошторис (.TXT) згенеровано', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Ви впевнені, що бажаєте скинути всі параметри до початкових?')) {
      const defaultPreset = DEFAULT_PRESETS[0];
      if (defaultPreset) {
        handleApplyPreset(defaultPreset);
      }
      showToast('Форму калькулятора очищено', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in border ${
            toast.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-800'
              : toast.type === 'info'
              ? 'bg-blue-950/90 text-blue-200 border-blue-800'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        metalPricing={state.metalPricing}
        onRefreshNBU={handleRefreshNbuRates}
        onOpenPriceModal={() => setIsPriceDiffModalOpen(true)}
        onOpenPresetModal={() => setIsPresetModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportJson={handleExportProjectJson}
        onExportTxt={handleExportTxt}
        onPrint={() => setIsPrintModalOpen(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Layout: Left Column (Forms 1-8) & Right Column (Sticky Summary & Expert Advice) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 1-8 Calculator Modules */}
          <div className="lg:col-span-7 space-y-4">
            {/* Global Section Accordion Controls */}
            <div className="bg-[#12141c]/80 rounded-xl border border-[#232838] p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-sm">
              <div className="flex items-center gap-2 text-neutral-300 font-medium">
                <LayoutGrid className="w-4 h-4 text-amber-400" />
                <span>Технологічні блоки калькулятора:</span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#1c2230] text-amber-300 border border-[#2d3548]">
                  {expandedSectionsCount}/{totalSectionsCount} розгорнуто
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-expand-all"
                  type="button"
                  onClick={expandAllSections}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1a1f2c] hover:bg-[#242b3d] text-neutral-200 hover:text-white border border-[#2d3548] transition shadow-sm active:scale-95"
                  title="Розгорнути всі технологічні та фінансові блоки"
                >
                  <ChevronsUpDown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Розгорнути всі</span>
                </button>

                <button
                  id="btn-collapse-all"
                  type="button"
                  onClick={collapseAllSections}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1a1f2c] hover:bg-[#242b3d] text-neutral-300 hover:text-white border border-[#2d3548] transition shadow-sm active:scale-95"
                  title="Згорнути всі блоки для компактного огляду"
                >
                  <ChevronsDownUp className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Згорнути всі</span>
                </button>
              </div>
            </div>

            {/* 1. General Product Parameters */}
            <GeneralInfoCard
              general={state.general}
              onChange={handleGeneralChange}
              isCollapsed={collapsedSections.general}
              onToggleCollapse={() => toggleSection('general')}
            />

            {/* 2. Metal Rates & Loss Calculation */}
            <MetalRateCard
              metalPricing={state.metalPricing}
              selectedMetal={state.general.metal}
              weight={state.general.weight}
              lossPercent={state.general.lossPercent}
              calc={calculation}
              onChange={handleMetalPricingChange}
              isCollapsed={collapsedSections.metalPricing}
              onToggleCollapse={() => toggleSection('metalPricing')}
            />

            {/* 3. Assembly & Post-Casting Benchwork */}
            <AssemblyWorksCard
              works={state.works}
              productWeight={state.general.weight}
              onChange={handleWorksChange}
              isCollapsed={collapsedSections.assemblyWorks}
              onToggleCollapse={() => toggleSection('assemblyWorks')}
            />

            {/* 4. Stone Setting & Gem Materials */}
            <StoneSettingCard
              stones={state.stones}
              onChange={handleStonesChange}
              isCollapsed={collapsedSections.stoneSetting}
              onToggleCollapse={() => toggleSection('stoneSetting')}
            />

            {/* 5. Galvanic Coatings */}
            <GalvanicsCard
              galvanics={state.galvanics}
              onChange={handleGalvanicsChange}
              isCollapsed={collapsedSections.galvanics}
              onToggleCollapse={() => toggleSection('galvanics')}
            />

            {/* 6. Finishing & Texturing */}
            <FinishingCard
              finishing={state.finishing}
              onChange={handleFinishingChange}
              isCollapsed={collapsedSections.finishing}
              onToggleCollapse={() => toggleSection('finishing')}
            />

            {/* 7. Additional Expenses & Assay Office */}
            <AdditionalExpensesCard
              additional={state.additional}
              directLaborTotal={calculation.totalLaborAndServicesCost}
              onChange={handleAdditionalChange}
              isCollapsed={collapsedSections.additionalExpenses}
              onToggleCollapse={() => toggleSection('additionalExpenses')}
            />
          </div>

          {/* Right Column: 3D Design & Casting + Cost Summary & Chief Economist Conclusion */}
          <div className="lg:col-span-5 space-y-5">
            {/* 3D Design & Casting Prep Card (Collapsible) */}
            <ProductionPrepCard
              productionPrep={state.productionPrep}
              productWeightWithLoss={calculation.metalTotalWeightWithLoss}
              onChange={handleProductionPrepChange}
              isCollapsed={collapsedSections.productionPrep}
              onToggleCollapse={() => toggleSection('productionPrep')}
            />

            {/* Cost Summary & Margins */}
            <CostSummaryCard
              calc={calculation}
              state={state}
              onCustomMarkupChange={handleCustomMarkupChange}
              onExportTxt={handleExportTxt}
            />

            {/* Expert Conclusion */}
            <ExpertConclusionCard
              state={state}
              calc={calculation}
              isCollapsed={collapsedSections.expertConclusion}
              onToggleCollapse={() => toggleSection('expertConclusion')}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232838] py-6 text-center text-xs text-neutral-400 space-y-1 bg-[#101216]">
        <p>
          Калькулятор ювелірного монтування та фінішної обробки (Jewelry Post-Casting & Assembly Calculator) v2.0
        </p>
        <p className="text-[11px] text-neutral-500">
          Алгоритмічний розрахунок собівартості, технологічних втрат угару та роздрібного ціноутворення за нормативами галузі.
        </p>
      </footer>

      {/* Modals */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        presets={presets}
        currentState={state}
        onApplyPreset={handleApplyPreset}
        onSaveCustomPreset={handleSaveCustomPreset}
      />

      <PriceUpdateModal
        isOpen={isPriceDiffModalOpen}
        onClose={() => setIsPriceDiffModalOpen(false)}
        diffs={priceDiffs}
        onApplyPrices={handleApplyStandardPrices}
      />

      <ImportProjectModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      <PrintEstimateModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        state={state}
        calc={calculation}
      />
    </div>
  );
};

export default App;
