import { Check } from 'lucide-react';
import { PartId, StageId } from '../types/experiment';

interface TopBarProps {
  activeStage: StageId;
  onSelectStage: (stage: StageId) => void;
  completedParts: Record<PartId, boolean>;
  onOpenApparatus: () => void;
}

const NAV_ITEMS: { id: StageId; label: string }[] = [
  { id: 'A', label: 'Part A: Stirring' },
  { id: 'B', label: 'Part B: Temperature' },
  { id: 'C', label: 'Part C: Surface Area' },
  { id: 'conclusion', label: 'Conclusion' },
];

export function TopBar({
  activeStage,
  onSelectStage,
  completedParts,
  onOpenApparatus,
}: TopBarProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-8 px-6 py-3.5">
        <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          Experiment 2.5
        </span>

        <nav aria-label="Experiment stages" className="flex items-center gap-6 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeStage === item.id;
            const isDone =
              item.id !== 'conclusion' && completedParts[item.id as PartId];

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectStage(item.id)}
                className={`relative flex items-center gap-1.5 py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 ${
                  isActive
                    ? 'text-sky-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {isDone && (
                  <Check
                    className="h-3.5 w-3.5 text-emerald-600 shrink-0"
                    aria-label="Completed"
                  />
                )}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 -bottom-[15px] left-0 h-0.5 bg-sky-600"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenApparatus}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-slate-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Apparatus List
          </button>
        </div>
      </div>
    </header>
  );
}
