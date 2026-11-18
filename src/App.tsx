import { useEffect, useMemo, useRef, useState } from 'react';
import { ApparatusModal } from './components/ApparatusModal';
import { ConclusionView } from './components/ConclusionView';
import { InquiryDeck } from './components/InquiryDeck';
import { LabStage } from './components/LabStage';
import { TopBar } from './components/TopBar';
import {
  calculateDissolveTimeSeconds,
  createInitialPartState,
  PART_SPECS,
  validateFairTest,
} from './data/experimentSpec';
import {
  BeakerConfig,
  ConclusionState,
  PartId,
  PartState,
  StageId,
} from './types/experiment';

const INITIAL_CONCLUSION: ConclusionState = {
  stirring: null,
  temperature: null,
  surfaceArea: null,
  checked: false,
};

export default function App() {
  const [activeStage, setActiveStage] = useState<StageId>('A');
  const [apparatusOpen, setApparatusOpen] = useState(false);

  const [partStates, setPartStates] = useState<Record<PartId, PartState>>(() => ({
    A: createInitialPartState('A'),
    B: createInitialPartState('B'),
    C: createInitialPartState('C'),
  }));

  const [conclusion, setConclusion] =
    useState<ConclusionState>(INITIAL_CONCLUSION);

  // Simulation runtime state for the active part's bench
  const [simStatus, setSimStatus] = useState<
    'idle' | 'running' | 'paused' | 'completed'
  >('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [speed, setSpeed] = useState<1 | 2 | 4>(2);
  const [runCount, setRunCount] = useState(0);
  const [runTargets, setRunTargets] = useState<{
    timeX: number;
    timeY: number;
  } | null>(null);

  const activePartId: PartId | null =
    activeStage === 'conclusion' ? null : activeStage;

  const activePartState = activePartId ? partStates[activePartId] : null;
  const activeSpec = activePartId ? PART_SPECS[activePartId] : null;

  const activeFairTest = useMemo(() => {
    if (!activePartId || !activePartState) return null;
    return validateFairTest(
      activePartId,
      activePartState.beakerX,
      activePartState.beakerY
    );
  }, [activePartId, activePartState]);

  const effectiveTargetX =
    runTargets?.timeX ??
    (activePartState
      ? calculateDissolveTimeSeconds(activePartState.beakerX, runCount)
      : 18.4);

  const effectiveTargetY =
    runTargets?.timeY ??
    (activePartState
      ? calculateDissolveTimeSeconds(activePartState.beakerY, runCount + 2)
      : 18.4);

  // Refs for accurate requestAnimationFrame stopwatch stepping
  const lastFrameRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  useEffect(() => {
    if (simStatus !== 'running' || !activePartId || !activePartState || !activeFairTest) {
      lastFrameRef.current = null;
      return;
    }

    const maxTime = Math.max(effectiveTargetX, effectiveTargetY);
    let rafId = 0;

    const tick = (now: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }
      const dtSeconds = ((now - lastFrameRef.current) / 1000) * speedRef.current;
      lastFrameRef.current = now;

      setElapsedSeconds((prev) => {
        const next = prev + dtSeconds;
        if (next >= maxTime) {
          setSimStatus('completed');
          if (activeFairTest.isFairTest) {
            setPartStates((prevParts) => ({
              ...prevParts,
              [activePartId]: {
                ...prevParts[activePartId],
                recordedResult: {
                  timeX: effectiveTargetX,
                  timeY: effectiveTargetY,
                  configX: { ...prevParts[activePartId].beakerX },
                  configY: { ...prevParts[activePartId].beakerY },
                },
                hypothesisSupported: null,
              },
            }));
          }
          return maxTime;
        }
        return next;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [
    simStatus,
    activePartId,
    activePartState,
    activeFairTest,
    effectiveTargetX,
    effectiveTargetY,
  ]);

  const resetBench = () => {
    setSimStatus('idle');
    setElapsedSeconds(0);
    setRunTargets(null);
  };

  const handleSelectStage = (stage: StageId) => {
    if (stage === activeStage) return;
    resetBench();
    setActiveStage(stage);
  };

  const handleStartOrResume = () => {
    if (!activePartState) return;
    if (simStatus === 'idle') {
      const nextSeed = runCount + 1;
      setRunCount(nextSeed);
      const tX = calculateDissolveTimeSeconds(activePartState.beakerX, nextSeed);
      const tY = calculateDissolveTimeSeconds(
        activePartState.beakerY,
        nextSeed + 2
      );
      setRunTargets({ timeX: tX, timeY: tY });
      setElapsedSeconds(0);
      setSimStatus('running');
    } else if (simStatus === 'paused') {
      setSimStatus('running');
    }
  };

  const handleUpdatePartState = (updater: (prev: PartState) => PartState) => {
    if (!activePartId) return;
    setPartStates((prev) => ({
      ...prev,
      [activePartId]: updater(prev[activePartId]),
    }));
  };

  const handleUpdateBeaker = (beaker: 'X' | 'Y', patch: Partial<BeakerConfig>) => {
    if (!activePartId || simStatus === 'running') return;
    resetBench();
    setPartStates((prev) => {
      const current = prev[activePartId];
      return {
        ...prev,
        [activePartId]: {
          ...current,
          beakerX:
            beaker === 'X' ? { ...current.beakerX, ...patch } : current.beakerX,
          beakerY:
            beaker === 'Y' ? { ...current.beakerY, ...patch } : current.beakerY,
        },
      };
    });
  };

  const handleApplyRecommended = () => {
    if (!activePartId || !activeSpec || simStatus === 'running') return;
    resetBench();
    setPartStates((prev) => ({
      ...prev,
      [activePartId]: {
        ...prev[activePartId],
        beakerX: { ...activeSpec.recommendedX },
        beakerY: { ...activeSpec.recommendedY },
      },
    }));
  };

  const handleResetAllProgress = () => {
    resetBench();
    setPartStates({
      A: createInitialPartState('A'),
      B: createInitialPartState('B'),
      C: createInitialPartState('C'),
    });
    setConclusion(INITIAL_CONCLUSION);
    setActiveStage('A');
  };

  const completedParts: Record<PartId, boolean> = {
    A:
      partStates.A.recordedResult !== null &&
      partStates.A.hypothesisSupported !== null,
    B:
      partStates.B.recordedResult !== null &&
      partStates.B.hypothesisSupported !== null,
    C:
      partStates.C.recordedResult !== null &&
      partStates.C.hypothesisSupported !== null,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar
        activeStage={activeStage}
        onSelectStage={handleSelectStage}
        completedParts={completedParts}
        onOpenApparatus={() => setApparatusOpen(true)}
      />

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {activeStage === 'conclusion' ? (
          <ConclusionView
            partStates={partStates}
            conclusion={conclusion}
            onUpdateConclusion={setConclusion}
            onNavigateStage={handleSelectStage}
          />
        ) : (
          activePartId &&
          activeSpec &&
          activePartState &&
          activeFairTest && (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,1fr)]">
              <div className="lg:sticky lg:top-6">
                <LabStage
                  spec={activeSpec}
                  beakerX={activePartState.beakerX}
                  beakerY={activePartState.beakerY}
                  fairTest={activeFairTest}
                  simStatus={simStatus}
                  elapsedSeconds={elapsedSeconds}
                  targetTimeX={effectiveTargetX}
                  targetTimeY={effectiveTargetY}
                  speed={speed}
                  onChangeSpeed={setSpeed}
                  onStartOrResume={handleStartOrResume}
                  onPause={() => setSimStatus('paused')}
                  onReset={resetBench}
                  onApplyRecommended={handleApplyRecommended}
                />
              </div>

              <InquiryDeck
                partId={activePartId}
                state={activePartState}
                fairTest={activeFairTest}
                simRunning={simStatus === 'running'}
                onUpdateState={handleUpdatePartState}
                onUpdateBeaker={handleUpdateBeaker}
                onNavigateStage={handleSelectStage}
              />
            </div>
          )
        )}
      </main>

      <ApparatusModal
        open={apparatusOpen}
        onClose={() => setApparatusOpen(false)}
        onResetAllProgress={handleResetAllProgress}
      />
    </div>
  );
}
