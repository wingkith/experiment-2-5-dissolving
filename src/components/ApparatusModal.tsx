import { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { APPARATUS_LIST } from '../data/experimentSpec';

interface ApparatusModalProps {
  open: boolean;
  onClose: () => void;
  onResetAllProgress: () => void;
}

export function ApparatusModal({
  open,
  onClose,
  onResetAllProgress,
}: ApparatusModalProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apparatus-title"
    >
      <div className="w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2
              id="apparatus-title"
              className="text-lg font-bold text-slate-900"
            >
              Material and Apparatus
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Experiment 2.5 · Investigating the factors affecting the rate of dissolving
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmReset(false);
              onClose();
            }}
            aria-label="Close modal"
            className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="border-b border-slate-200 px-3.5 py-2.5 font-semibold">
                  Item
                </th>
                <th className="border-b border-slate-200 px-3.5 py-2.5 font-semibold">
                  Qty
                </th>
                <th className="border-b border-slate-200 px-3.5 py-2.5 font-semibold">
                  Role in Experiment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {APPARATUS_LIST.map((item) => (
                <tr key={item.name}>
                  <td className="px-3.5 py-2.5 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="px-3.5 py-2.5 font-mono text-slate-700 tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-3.5 py-2.5 text-slate-600">{item.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Progress</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-red-700">
                Clear all recorded data?
              </span>
              <button
                type="button"
                onClick={() => {
                  onResetAllProgress();
                  setConfirmReset(false);
                  onClose();
                }}
                className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setConfirmReset(false);
              onClose();
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
