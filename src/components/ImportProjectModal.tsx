import React, { useState, useRef } from 'react';
import { AppState } from '../types';
import { parseProjectJson } from '../services/storage';
import { FolderOpen, X, Check, UploadCloud, AlertCircle } from 'lucide-react';
import { METAL_COEFFICIENTS } from '../services/calculator';

interface ImportProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedState: AppState) => void;
}

export const ImportProjectModal: React.FC<ImportProjectModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<AppState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setErrorMsg(null);
    if (!file.name.endsWith('.json')) {
      setErrorMsg('Будь ласка, виберіть файл у форматі .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = parseProjectJson(content);
      if (parsed.success && parsed.state) {
        setPreviewState(parsed.state);
      } else {
        setErrorMsg(parsed.error || 'Не вдалося розпізнати проєкт');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Помилка зчитування файлу з диска');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (previewState) {
      onImportSuccess(previewState);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#12141c] border border-[#232838] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232838] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Завантаження ювелірного проєкту</h3>
              <p className="text-xs text-neutral-400">Імпорт файлу конфігурації .JSON</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1a1f2c] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone */}
        {!previewState ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
              dragOver
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-[#262c3e] hover:border-[#3a435c] bg-[#0c0e14]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-full bg-[#1a1f2c] flex items-center justify-center text-amber-400 border border-[#262c3e]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Перетягніть файл .JSON сюди або <span className="text-amber-400 underline">оберіть на диску</span>
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">Підтримуються файли збереження версії 1.0 та 2.0</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#0c0e14] p-4 rounded-xl border border-[#232838] space-y-3 animate-fade-in text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              Проєкт успішно перевірено
            </h4>
            <div className="space-y-1 text-neutral-400">
              <p>
                <strong>Назва:</strong> {previewState.general.productName || 'Ювелірний виріб'}
              </p>
              <p>
                <strong>Метал:</strong>{' '}
                {METAL_COEFFICIENTS[previewState.general.metal]?.name || ''}{' '}
                {METAL_COEFFICIENTS[previewState.general.metal]?.purityLabel || ''} (
                {previewState.general.weight} г)
              </p>
              <p>
                <strong>Кількість вставок:</strong> {previewState.stones?.length || 0} позицій
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#232838]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-[#1a1f2c] transition"
          >
            Скасувати
          </button>
          {previewState && (
            <button
              type="button"
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Застосувати проєкт</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
