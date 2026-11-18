import {
  AlertTriangle,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import {
  BeakerConfig,
  FairTestResult,
  PartSpec,
} from '../types/experiment';
import { BeakerVisual } from './BeakerVisual';
import { ElectronicBalance } from './ElectronicBalance';

interface LabStageProps {
  spec: PartSpec;
  beakerX: BeakerConfig;
  beakerY: BeakerConfig;
  fairTest: FairTestResult;
  simStatus: 'idle' | 'running' | 'paused' | 'completed';
  elapsedSeconds: number;
  targetTimeX: number;
  targetTimeY: number;
  speed: 1 | 2 | 4;
  onChangeSpeed: (speed: 1 | 2 | 4) => void;
  onStartOrResume: () => void;
  onPause: () => void;
  onReset: () => void;
  onApplyRecommended: () => void;
}

export function LabStage({
  spec,
  beakerX,
  beakerY,
  fairTest,
  simStatus,
  elapsedSeconds,
  targetTimeX,
  targetTimeY,
  speed,
  onChangeSpeed,
  onStartOrResume,
  onPause,
  onReset,
  onApplyRecommended,
}: LabStageProps) {
  const progressX =
    simStatus === 'idle' ? 0 : Math.min(1, elapsedSeconds / targetTimeX);
  const progressY =
    simStatus === 'idle' ? 0 : Math.min(1, elapsedSeconds / targetTimeY);

  const dissolvedTimeX = progressX >= 1 ? targetTimeX : null;
  const dissolvedTimeY = progressY >= 1 ? targetTimeY : null;

  return (
    <section
      aria-label="Laboratory Workbench"
      className="flex flex-col gap-5"
    >
      {/* Fair-Test Diagnostic Banner */}
      <div
        className={`rounded-lg border p-4 ${
          fairTest.isFairTest
            ? 'border-emerald-200 bg-emerald-50/70'
            : 'border-amber-200 bg-amber-50/80'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {fairTest.isFairTest ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            )}
            <div>
              <p
                className={`text-sm font-semibold ${
                  fairTest.isFairTest ? 'text-emerald-900' : 'text-amber-900'
                }`}
              >
                {fairTest.headline}
              </p>
              {fairTest.details.length > 0 && (
                <ul className="mt-1.5 space-y-1 text-xs text-amber-900/90">
                  {fairTest.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              )}
              {simStatus === 'completed' && !fairTest.isFairTest && (
                <p className="mt-2 text-xs font-medium text-amber-950">
                  Trial finished, but results were not recorded in Step IV because this setup is not a fair test.
                </p>
              )}
            </div>
          </div>

          {!fairTest.isFairTest && (
            <button
              type="button"
              onClick={onApplyRecommended}
              disabled={simStatus === 'running'}
              className="rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100/70 disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              Use Textbook Setup
            </button>
          )}
        </div>
      </div>

      {/* Main Bench Container */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Laboratory Bench
            </h2>
            <p className="text-xs text-slate-500">
              Compare Beaker X and Beaker Y under controlled conditions
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <span>Solute: Copper(II) sulphate</span>
          </div>
        </div>

        {/* Beakers X & Y on Bench */}
        <div className="relative mt-4 rounded-lg border border-slate-100 bg-slate-50/80 px-4 pt-4 pb-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <BeakerVisual
              label="X"
              config={beakerX}
              status={simStatus}
              progress={progressX}
              dissolveTime={dissolvedTimeX}
            />
            <BeakerVisual
              label="Y"
              config={beakerY}
              status={simStatus}
              progress={progressY}
              dissolveTime={dissolvedTimeY}
            />
          </div>
          {/* Subtle bench tabletop edge */}
          <div
            aria-hidden="true"
            className="mt-4 h-2 w-full rounded bg-slate-200/80"
          />
        </div>

        {/* Instrument Console: Stopwatch + Electronic Balance */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Digital Stopwatch Card */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-slate-600" />
                <h3 className="text-xs font-semibold text-slate-800">
                  Digital Stopwatch
                </h3>
              </div>

              {/* Playback Speed Segmented Control */}
              <div
                className="flex items-center gap-0.5 rounded-md border border-slate-200 bg-white p-0.5"
                role="group"
                aria-label="Simulation speed"
              >
                {([1, 2, 4] as const).map((factor) => (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => onChangeSpeed(factor)}
                    className={`rounded px-2 py-0.5 text-xs font-medium transition-colors tabular-nums ${
                      speed === factor
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {factor}×
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-md border border-slate-200 bg-white px-4 py-2">
                <span className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                  {elapsedSeconds.toFixed(1)} s
                </span>
              </div>

              <div className="flex items-center gap-2">
                {simStatus === 'running' ? (
                  <button
                    type="button"
                    onClick={onPause}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap"
                  >
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onStartOrResume}
                    disabled={simStatus === 'completed'}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 whitespace-nowrap"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>
                      {simStatus === 'paused' ? 'Resume' : 'Start Experiment'}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Electronic Balance */}
          <ElectronicBalance
            targetMassX={beakerX.soluteMassG}
            targetFormX={beakerX.soluteForm}
            targetMassY={beakerY.soluteMassG}
            targetFormY={beakerY.soluteForm}
          />
        </div>
      </div>

      {/* Laboratory Safety Caution */}
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <div className="text-xs text-slate-800">
            <span className="font-semibold text-amber-900">Caution: </span>
            {spec.cautions.join(' ')}
          </div>
        </div>
      </div>
    </section>
  );
}
