import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PART_SPECS } from '../data/experimentSpec';
import {
  ConclusionState,
  PartId,
  PartState,
  StageId,
} from '../types/experiment';

interface ConclusionViewProps {
  partStates: Record<PartId, PartState>;
  conclusion: ConclusionState;
  onUpdateConclusion: (updater: (prev: ConclusionState) => ConclusionState) => void;
  onNavigateStage: (stage: StageId) => void;
}

export function ConclusionView({
  partStates,
  conclusion,
  onUpdateConclusion,
  onNavigateStage,
}: ConclusionViewProps) {
  const allCorrect =
    conclusion.stirring === 'stirred' &&
    conclusion.temperature === 'higher' &&
    conclusion.surfaceArea === 'larger';

  const allSelected =
    conclusion.stirring !== null &&
    conclusion.temperature !== null &&
    conclusion.surfaceArea !== null;

  const describeCondition = (partId: PartId, label: 'X' | 'Y') => {
    const res = partStates[partId].recordedResult;
    if (!res) return 'Not recorded';
    const cfg = label === 'X' ? res.configX : res.configY;
    if (partId === 'A') return cfg.stirring ? 'Stirred' : 'Undisturbed';
    if (partId === 'B')
      return cfg.tempType === 'hot' ? 'Hot water (~60 °C)' : 'Tap water (~22 °C)';
    return cfg.soluteForm === 'powder' ? 'Powder (larger area)' : 'Crystals (smaller area)';
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="text-xs font-medium text-sky-700">
          Experiment 2.5 · Synthesis
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Conclusion & Evidence Summary
        </h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Review the evidence you collected in Parts A, B, and C, then select the statements that correctly describe how each factor affects the rate of dissolving.
        </p>

        {/* Evidence Summary Cards */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {(['A', 'B', 'C'] as PartId[]).map((pid) => {
            const spec = PART_SPECS[pid];
            const res = partStates[pid].recordedResult;

            return (
              <div
                key={pid}
                className="flex flex-col justify-between rounded-md border border-slate-200 bg-slate-50/70 p-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {spec.navLabel}
                    </span>
                    {res ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                  </div>

                  {res ? (
                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded border border-slate-200 bg-white px-2.5 py-1.5">
                        <span className="text-slate-600">
                          X ({describeCondition(pid, 'X')})
                        </span>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums">
                          {res.timeX.toFixed(1)} s
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded border border-slate-200 bg-white px-2.5 py-1.5">
                        <span className="text-slate-600">
                          Y ({describeCondition(pid, 'Y')})
                        </span>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums">
                          {res.timeY.toFixed(1)} s
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-xs text-slate-500">
                      No fair-test result recorded yet for {spec.shortLabel}.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateStage(pid)}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800"
                >
                  <span>{res ? `Review ${spec.shortLabel}` : `Complete ${spec.shortLabel}`}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Textbook Conclusion Checkboxes */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-base font-bold text-slate-900">Conclusion</h2>
        <p className="mt-1.5 text-sm text-slate-700">
          From all the results of this experiment, it can be concluded that the{' '}
          <span className="font-semibold text-slate-900">rate of dissolving</span>{' '}
          increases when:
        </p>

        <div className="mt-4 space-y-3">
          {/* (a) Stirring */}
          <div className="grid grid-cols-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50/50 p-3 sm:grid-cols-[36px_1fr_1fr]">
            <span className="text-xs font-bold text-slate-700">(a)</span>
            <label className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="radio"
                name="conclusion-a"
                checked={conclusion.stirring === 'stirred'}
                onChange={() =>
                  onUpdateConclusion((prev) => ({
                    ...prev,
                    stirring: 'stirred',
                    checked: false,
                  }))
                }
                className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>the solution is stirred</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="radio"
                name="conclusion-a"
                checked={conclusion.stirring === 'not_stirred'}
                onChange={() =>
                  onUpdateConclusion((prev) => ({
                    ...prev,
                    stirring: 'not_stirred',
                    checked: false,
                  }))
                }
                className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>the solution is not stirred</span>
            </label>
          </div>

          {/* (b) Temperature */}
          <div className="grid grid-cols-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50/50 p-3 sm:grid-cols-[36px_1fr_1fr]">
            <span className="text-xs font-bold text-slate-700">(b)</span>
            <label className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="radio"
                name="conclusion-b"
                checked={conclusion.temperature === 'higher'}
                onChange={() =>
                  onUpdateConclusion((prev) => ({
                    ...prev,
                    temperature: 'higher',
                    checked: false,
                  }))
                }
                className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>the temperature of the solvent is higher</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="radio"
                name="conclusion-b"
                checked={conclusion.temperature === 'lower'}
                onChange={() =>
                  onUpdateConclusion((prev) => ({
                    ...prev,
                    temperature: 'lower',
                    checked: false,
                  }))
                }
                className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>the temperature of the solvent is lower</span>
            </label>
          </div>

          {/* (c) Surface area */}
          <div className="grid grid-cols-1 items-center gap-2 rounded-md border border-slate-200 bg-slate-50/50 p-3 sm:grid-cols-[36px_1fr_1fr]">
            <span className="text-xs font-bold text-slate-700">(c)</span>
            <label className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="radio"
                name="conclusion-c"
                checked={conclusion.surfaceArea === 'larger'}
                onChange={() =>
                  onUpdateConclusion((prev) => ({
                    ...prev,
                    surfaceArea: 'larger',
                    checked: false,
                  }))
                }
                className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>the surface area of the solute is larger</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50">
              <input
                type="radio"
                name="conclusion-c"
                checked={conclusion.surfaceArea === 'smaller'}
                onChange={() =>
                  onUpdateConclusion((prev) => ({
                    ...prev,
                    surfaceArea: 'smaller',
                    checked: false,
                  }))
                }
                className="h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-600"
              />
              <span>the surface area of the solute is smaller</span>
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!allSelected}
            onClick={() =>
              onUpdateConclusion((prev) => ({ ...prev, checked: true }))
            }
            className="rounded-lg bg-sky-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Check Conclusion
          </button>

          {conclusion.checked && !allCorrect && (
            <p className="text-xs font-medium text-amber-800">
              One or more conclusions do not match the experimental evidence. Check which condition gave a shorter dissolving time in Parts A, B, and C.
            </p>
          )}
        </div>

        {/* Key Point summary revealed upon correct conclusion */}
        {conclusion.checked && allCorrect && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
              <span>Key Point Verified</span>
            </div>
            <p className="mt-2 text-sm text-emerald-950">
              The rate of dissolving increases when:
            </p>
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-emerald-900">
              <li>the solution is stirred.</li>
              <li>the temperature of the solvent is higher.</li>
              <li>the surface area of the solute is larger.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
