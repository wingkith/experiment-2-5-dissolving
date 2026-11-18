import { useState } from 'react';
import { Scale } from 'lucide-react';
import { SoluteForm, SoluteMass } from '../types/experiment';

interface ElectronicBalanceProps {
  targetMassX: SoluteMass;
  targetFormX: SoluteForm;
  targetMassY: SoluteMass;
  targetFormY: SoluteForm;
}

export function ElectronicBalance({
  targetMassX,
  targetFormX,
  targetMassY,
  targetFormY,
}: ElectronicBalanceProps) {
  const [selectedSample, setSelectedSample] = useState<'none' | 'X' | 'Y'>('none');
  const [tared, setTared] = useState(true);

  const activeMass =
    selectedSample === 'X'
      ? targetMassX
      : selectedSample === 'Y'
        ? targetMassY
        : 0;
  const activeForm =
    selectedSample === 'X'
      ? targetFormX
      : selectedSample === 'Y'
        ? targetFormY
        : 'powder';

  const displayedGrams = tared ? activeMass : activeMass + 0.4;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-slate-600" />
          <h3 className="text-xs font-semibold text-slate-800">
            Electronic Balance
          </h3>
        </div>
        <span className="text-xs text-slate-500">Weighing station</span>
      </div>

      {/* Balance visual & digital readout */}
      <div className="mt-3 flex items-center gap-4">
        <div className="relative flex h-16 w-24 shrink-0 flex-col items-center justify-end">
          {/* Weighing pan & paper */}
          <div className="relative flex h-4 w-20 items-end justify-center">
            {selectedSample !== 'none' && (
              <svg viewBox="0 0 60 20" className="h-5 w-14">
                <path
                  d="M6 16 Q30 19 54 16 L50 18 Q30 21 10 18 Z"
                  fill="#F1F5F9"
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
                {activeForm === 'powder' ? (
                  <path d="M16 16 Q30 4 44 16 Z" fill="#0284C7" />
                ) : (
                  <g fill="#0284C7" stroke="#0369A1" strokeWidth="0.8">
                    <polygon points="17,16 23,8 29,11 27,16" />
                    <polygon points="28,16 33,7 41,10 39,16" />
                    <polygon points="23,16 28,10 34,12 32,16" fill="#0EA5E9" />
                  </g>
                )}
              </svg>
            )}
          </div>
          <div className="h-1.5 w-20 rounded-t bg-slate-300 border border-slate-400" />
          <div className="h-6 w-24 rounded-b border border-slate-300 bg-slate-100 flex items-center justify-center">
            <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
              {displayedGrams.toFixed(1)} g
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                setTared(true);
                setSelectedSample('none');
              }}
              className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 whitespace-nowrap"
            >
              Tare (0.0 g)
            </button>
            <button
              type="button"
              onClick={() => {
                setTared(true);
                setSelectedSample('X');
              }}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedSample === 'X'
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Weigh X ({targetMassX.toFixed(1)} g {targetFormX})
            </button>
            <button
              type="button"
              onClick={() => {
                setTared(true);
                setSelectedSample('Y');
              }}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedSample === 'Y'
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Weigh Y ({targetMassY.toFixed(1)} g {targetFormY})
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            {selectedSample === 'none'
              ? 'Tare the balance and weigh equal masses of solute before adding to beakers.'
              : `Weighed ${activeMass.toFixed(1)} g of copper(II) sulphate ${activeForm} for Beaker ${selectedSample}.`}
          </p>
        </div>
      </div>
    </div>
  );
}
