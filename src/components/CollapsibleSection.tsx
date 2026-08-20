import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  stepNumber?: string;
  icon: React.ReactNode;
  badgeSummary?: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  headerRightContent?: React.ReactNode;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  subtitle,
  stepNumber,
  icon,
  badgeSummary,
  isCollapsed,
  onToggle,
  headerRightContent,
  children,
}) => {
  return (
    <div
      id={id}
      className={`bg-[#12141c]/90 rounded-2xl border transition-all duration-200 shadow-sm ${
        isCollapsed
          ? 'border-[#232838] hover:border-[#333a52]'
          : 'border-[#232838] shadow-md'
      }`}
    >
      {/* Clickable Card Header */}
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none rounded-2xl focus:outline-none focus:ring-1 focus:ring-amber-500/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-semibold text-white tracking-tight truncate">{title}</h2>
              {stepNumber && (
                <span className="text-[10px] font-mono text-neutral-400 bg-[#0e1017] px-2 py-0.5 rounded-md border border-[#232838]">
                  {stepNumber}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-neutral-400 truncate mt-0.5 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side controls: Badges, custom buttons & chevron */}
        <div
          className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
          onClick={(e) => {
            // Prevent bubbling if user clicks child buttons in headerRightContent
            const target = e.target as HTMLElement;
            if (target.closest('button, input, select, label')) {
              e.stopPropagation();
            }
          }}
        >
          {badgeSummary && <div>{badgeSummary}</div>}
          {headerRightContent && <div>{headerRightContent}</div>}

          <div
            className={`p-1.5 rounded-lg bg-[#1b1f2b] text-neutral-400 border border-[#262c3e] transition-transform duration-200 ${
              isCollapsed ? '' : 'rotate-180 text-amber-400'
            }`}
            aria-label={isCollapsed ? 'Розгорнути блок' : 'Згорнути блок'}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Collapsible Content Body */}
      {!isCollapsed && (
        <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-0 border-t border-[#232838]/80 mt-1 space-y-4">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
};
