import React, { ErrorInfo, ReactNode, Component } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React tree:', error, errorInfo);
  }

  handleResetStorage = () => {
    try {
      localStorage.removeItem('jewelry_calc_state_v2');
      localStorage.removeItem('jewelry_calc_custom_presets');
      localStorage.removeItem('jewelry_calc_nbu_cache_v1');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c0e14] text-neutral-100 flex items-center justify-center p-4 font-sans">
          <div className="bg-[#12141c] border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Виникла помилка під час завантаження інтерфейсу</h2>
                <p className="text-xs text-neutral-400">Ювелірний калькулятор перехопив помилку виконання</p>
              </div>
            </div>

            <div className="bg-[#0c0e14] p-3 rounded-xl border border-[#232838] text-xs text-red-300 font-mono overflow-auto max-h-36">
              {this.state.error?.message || 'Невідома помилка'}
            </div>

            <div className="text-xs text-neutral-400">
              Якщо ця помилка виникла після оновлення версії або некоректних збережених даних, скористайтеся кнопкою скидання кешу.
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#232838]">
              <button
                type="button"
                onClick={this.handleResetStorage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/80 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Очистити кеш та перезавантажити</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Оновити сторінку</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
