import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from 'lucide-react';
import {
  CONTROL_VARIABLE_LABELS,
  PART_SPECS,
} from '../data/experimentSpec';
import {
  BeakerConfig,
  FairTestResult,
  HypothesisOption,
  PartId,
  PartState,
  SoluteForm,
  SoluteMass,
  SolventVolume,
  StageId,
  SupportOption,
  VariableKey,
  WaterTempType,
} from '../types/experiment';

interface InquiryDeckProps {
  partId: PartId;
  state: PartState;
  fairTest: FairTestResult;
  simRunning: boolean;
  onUpdateState: (updater: (prev: PartState) => PartState) => void;
  onUpdateBeaker: (beaker: 'X' | 'Y', patch: Partial<BeakerConfig>) => void;
  onNavigateStage: (stage: StageId) => void;
}

export function InquiryDeck({
  partId,
  state,
  fairTest,
  simRunning,
  onUpdateState,
  onUpdateBeaker,
  onNavigateStage,
}: InquiryDeckProps) {
  const [showProcedure, setShowProcedure] = useState(false);
  const spec = PART_SPECS[partId];

  const isHypothesisCorrect = state.hypothesis === spec.correctHypothesis;

  const isVariablesCorrect =
    state.independentVar === spec.correctIndependentVar &&
    state.dependentVar === spec.correctDependentVar &&
    state.controlVars.length === spec.correctControlVars.length &&
    spec.correctControlVars.every((v) => state.controlVars.includes(v));

  const toggleControlVar = (key: VariableKey) => {
    onUpdateState((prev) => {
      const exists = prev.controlVars.includes(key);
      return {
        ...prev,
        variablesChecked: false,
        controlVars: exists
          ? prev.controlVars.filter((k) => k !== key)
          : [...prev.controlVars, key],
      };
    });
  };

  const getVariableDiagnostic = (): string | null => {
    if (!state.variablesChecked || isVariablesCorrect) return null;
    if (state.independentVar !== spec.correctIndependentVar) {
      return 'Check the Independent variable: it should be the single factor we intentionally change between Beaker X and Beaker Y.';
    }
    if (state.dependentVar !== spec.correctDependentVar) {
      return 'Check the Dependent variable: we measure the time taken for the solute (copper(II) sulphate) to dissolve with the stopwatch.';
    }
    const forbiddenControl = CONTROL_VARIABLE_LABELS.find(
      (c) =>
        !spec.correctControlVars.includes(c.key) &&
        state.controlVars.includes(c.key)
    );
    if (forbiddenControl) {
      return `Remember: "${forbiddenControl.label}" is the variable being tested, so it must NOT be ticked as a control variable.`;
    }
    return 'Select all four control variables that must be kept identical between Beaker X and Beaker Y for a fair test.';
  };

  const nextStage: StageId =
    partId === 'A' ? 'B' : partId === 'B' ? 'C' : 'conclusion';
  const nextLabel =
    partId === 'A'
      ? 'Continue to Part B'
      : partId === 'B'
        ? 'Continue to Part C'
        : 'Go to Final Conclusion';

  const variableDiagnostic = getVariableDiagnostic();

  const renderBeakerColumn = (label: 'X' | 'Y', cfg: BeakerConfig) => (
    <div className="rounded-md border border-slate-200 bg-slate-50/60 p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900">Beaker {label}</span>
        {simRunning && (
          <span className="text-[11px] text-slate-400">Locked during run</span>
        )}
      </div>

      <div className="space-y-2.5">
        {/* Solvent Volume */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">
            Solvent Volume (Tap/Hot water)
          </label>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {([25, 50, 75] as SolventVolume[]).map((vol) => (
              <button
                key={vol}
                type="button"
                disabled={simRunning}
                onClick={() => onUpdateBeaker(label, { volumeCm3: vol })}
                className={`rounded py-1 text-xs font-medium transition-colors tabular-nums ${
                  cfg.volumeCm3 === vol
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                } disabled:opacity-60`}
              >
                {vol} cm³
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">
            Temperature of Solvent
          </label>
          <div className="mt-1 grid grid-cols-2 gap-1">
            {(
              [
                { value: 'tap', text: 'Tap (~22 °C)' },
                { value: 'hot', text: 'Hot (~60 °C)' },
              ] as { value: WaterTempType; text: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={simRunning}
                onClick={() => onUpdateBeaker(label, { tempType: opt.value })}
                className={`rounded py-1 text-xs font-medium transition-colors ${
                  cfg.tempType === opt.value
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                } disabled:opacity-60`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Solute Form */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">
            Copper(II) Sulphate Form
          </label>
          <div className="mt-1 grid grid-cols-2 gap-1">
            {(
              [
                { value: 'powder', text: 'Powder' },
                { value: 'crystals', text: 'Crystals' },
              ] as { value: SoluteForm; text: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={simRunning}
                onClick={() => onUpdateBeaker(label, { soluteForm: opt.value })}
                className={`rounded py-1 text-xs font-medium transition-colors ${
                  cfg.soluteForm === opt.value
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                } disabled:opacity-60`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Solute Mass */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">
            Mass of Solute
          </label>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {([1, 2, 4] as SoluteMass[]).map((mass) => (
              <button
                key={mass}
                type="button"
                disabled={simRunning}
                onClick={() => onUpdateBeaker(label, { soluteMassG: mass })}
                className={`rounded py-1 text-xs font-medium transition-colors tabular-nums ${
                  cfg.soluteMassG === mass
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                } disabled:opacity-60`}
              >
                {mass.toFixed(1)} g
              </button>
            ))}
          </div>
        </div>

        {/* Stirring */}
        <div>
          <label className="block text-[11px] font-medium text-slate-600">
            Stirring with Glass Rod
          </label>
          <div className="mt-1 grid grid-cols-2 gap-1">
            <button
              type="button"
              disabled={simRunning}
              onClick={() => onUpdateBeaker(label, { stirring: false })}
              className={`rounded py-1 text-xs font-medium transition-colors ${
                !cfg.stirring
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              } disabled:opacity-60`}
            >
              Undisturbed
            </button>
            <button
              type="button"
              disabled={simRunning}
              onClick={() => onUpdateBeaker(label, { stirring: true })}
              className={`rounded py-1 text-xs font-medium transition-colors ${
                cfg.stirring
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              } disabled:opacity-60`}
            >
              Stirred
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <aside aria-label="Scientific Inquiry Sheet" className="flex flex-col gap-5">
      {/* Title Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="text-xs font-medium text-sky-700">
          Experiment 2.5 · {spec.shortLabel}
        </div>
        <h1 className="mt-1 text-xl font-bold leading-snug text-slate-900 [text-wrap:balance]">
          {spec.title}
        </h1>
      </div>

      {/* I. Hypothesis */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold text-slate-900">I. Hypothesis</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          {spec.hypothesisStem}{' '}
          <select
            aria-label="Hypothesis prediction"
            value={state.hypothesis ?? ''}
            onChange={(e) =>
              onUpdateState((prev) => ({
                ...prev,
                hypothesis: (e.target.value || null) as HypothesisOption | null,
                hypothesisChecked: false,
              }))
            }
            className="mx-1 inline-block rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-sm font-semibold text-sky-800 focus:border-sky-600 focus:outline-none"
          >
            <option value="">— select —</option>
            <option value="increases">increases</option>
            <option value="decreases">decreases</option>
            <option value="same">stays the same</option>
          </select>
          .
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!state.hypothesis}
            onClick={() =>
              onUpdateState((prev) => ({ ...prev, hypothesisChecked: true }))
            }
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Check Hypothesis
          </button>

          {state.hypothesisChecked && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                isHypothesisCorrect ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {isHypothesisCorrect ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Reasonable hypothesis. Now test it with a fair test!</span>
                </>
              ) : (
                <>
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>
                    You can still test this prediction in the experiment below.
                  </span>
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {/* II. Variable Table */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">
            II. Variable Table
          </h2>
          <span className="text-xs text-slate-500">Fair test design</span>
        </div>
        <p className="mt-1 text-xs text-slate-600">
          Identify the variables in this fair test.
        </p>

        <div className="mt-3 space-y-3">
          <div>
            <label
              htmlFor={`iv-${partId}`}
              className="block text-xs font-semibold text-slate-800"
            >
              Independent variable{' '}
              <span className="font-normal text-slate-500">
                (the only variable that is changed)
              </span>
            </label>
            <select
              id={`iv-${partId}`}
              value={state.independentVar}
              onChange={(e) =>
                onUpdateState((prev) => ({
                  ...prev,
                  independentVar: e.target.value,
                  variablesChecked: false,
                }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
            >
              <option value="">Select independent variable...</option>
              {spec.independentVarOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor={`dv-${partId}`}
              className="block text-xs font-semibold text-slate-800"
            >
              Dependent variable{' '}
              <span className="font-normal text-slate-500">
                (the variable to be measured)
              </span>
            </label>
            <select
              id={`dv-${partId}`}
              value={state.dependentVar}
              onChange={(e) =>
                onUpdateState((prev) => ({
                  ...prev,
                  dependentVar: e.target.value,
                  variablesChecked: false,
                }))
              }
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
            >
              <option value="">Select dependent variable...</option>
              {spec.dependentVarOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-800">
              Control variables{' '}
              <span className="font-normal text-slate-500">
                (variables that are kept the same)
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {CONTROL_VARIABLE_LABELS.map((item) => {
                const checked = state.controlVars.includes(item.key);
                return (
                  <label
                    key={item.key}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                      checked
                        ? 'border-sky-300 bg-sky-50/70 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleControlVar(item.key)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-600"
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() =>
                onUpdateState((prev) => ({ ...prev, variablesChecked: true }))
              }
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              Check Variables
            </button>

            {state.variablesChecked && isVariablesCorrect && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>All variables identified correctly.</span>
              </p>
            )}

            {variableDiagnostic && (
              <p className="mt-2 text-xs text-amber-800">{variableDiagnostic}</p>
            )}
          </div>
        </div>
      </div>

      {/* III. Apparatus Setup & Procedure */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900">
            III. Setup & Procedure
          </h2>
          <button
            type="button"
            onClick={() => setShowProcedure((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-800"
          >
            <span>{showProcedure ? 'Hide steps' : 'Textbook steps'}</span>
            {showProcedure ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {showProcedure && (
          <ol className="mt-3 list-decimal space-y-1.5 rounded-md border border-slate-200 bg-slate-50 py-2.5 pr-3 pl-7 text-xs text-slate-700">
            {spec.procedures.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        )}

        <p className="mt-1.5 text-xs text-slate-600">
          Configure Beaker X and Beaker Y on the bench, then press{' '}
          <span className="font-semibold text-slate-800">Start Experiment</span>.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {renderBeakerColumn('X', state.beakerX)}
          {renderBeakerColumn('Y', state.beakerY)}
        </div>
      </div>

      {/* IV. Results & Evaluation */}
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-bold text-slate-900">IV. Results</h2>

        <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 font-semibold">
                  Measurement
                </th>
                <th className="border-b border-l border-slate-200 px-3 py-2 text-center font-semibold">
                  Beaker X
                </th>
                <th className="border-b border-l border-slate-200 px-3 py-2 text-center font-semibold">
                  Beaker Y
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-2.5 font-medium text-slate-800">
                  Time taken (s)
                </td>
                <td className="border-l border-slate-200 px-3 py-2.5 text-center font-mono font-semibold text-slate-900 tabular-nums">
                  {state.recordedResult
                    ? state.recordedResult.timeX.toFixed(1)
                    : '—'}
                </td>
                <td className="border-l border-slate-200 px-3 py-2.5 text-center font-mono font-semibold text-slate-900 tabular-nums">
                  {state.recordedResult
                    ? state.recordedResult.timeY.toFixed(1)
                    : '—'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {!state.recordedResult && (
          <p className="mt-2 text-xs text-slate-500">
            {fairTest.isFairTest
              ? 'Run the experiment on the bench to record dissolving times.'
              : 'Configure a valid fair test and run the experiment to record results.'}
          </p>
        )}

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold text-slate-800">
            Do the results support the hypothesis? If not, what should you do next?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                { value: 'yes', label: 'Yes.' },
                { value: 'no', label: 'No. I should modify my hypothesis.' },
              ] as { value: SupportOption; label: string }[]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={!state.recordedResult}
                onClick={() =>
                  onUpdateState((prev) => ({
                    ...prev,
                    hypothesisSupported: opt.value,
                  }))
                }
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  state.hypothesisSupported === opt.value
                    ? 'bg-sky-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {state.recordedResult && state.hypothesisSupported && (
            <div className="mt-3">
              {(() => {
                const expectedSupport: SupportOption =
                  state.hypothesis === spec.correctHypothesis ? 'yes' : 'no';
                const accurate = state.hypothesisSupported === expectedSupport;
                return (
                  <p
                    className={`text-xs font-medium ${
                      accurate ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {accurate
                      ? expectedSupport === 'yes'
                        ? 'Your recorded evidence supports your hypothesis.'
                        : 'Correct scientific reasoning: when evidence contradicts your hypothesis, you should modify your hypothesis.'
                      : 'Compare the recorded times for X and Y against your chosen hypothesis in Section I.'}
                  </p>
                );
              })()}
            </div>
          )}

          {state.recordedResult && state.hypothesisSupported && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => onNavigateStage(nextStage)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <span>{nextLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
