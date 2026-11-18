import { CheckCircle2 } from 'lucide-react';
import { BeakerConfig } from '../types/experiment';

interface BeakerVisualProps {
  label: 'X' | 'Y';
  config: BeakerConfig;
  status: 'idle' | 'running' | 'paused' | 'completed';
  progress: number; // 0 to 1
  dissolveTime: number | null;
}

const POWDER_GRAINS = [
  { cx: 92, cy: 215, r: 2.2 },
  { cx: 100, cy: 213, r: 2.0 },
  { cx: 108, cy: 216, r: 2.3 },
  { cx: 116, cy: 214, r: 1.9 },
  { cx: 124, cy: 216, r: 2.1 },
  { cx: 96, cy: 218, r: 2.0 },
  { cx: 104, cy: 219, r: 2.4 },
  { cx: 113, cy: 218, r: 2.1 },
  { cx: 121, cy: 219, r: 2.2 },
  { cx: 129, cy: 217, r: 1.8 },
  { cx: 88, cy: 218, r: 1.9 },
  { cx: 109, cy: 212, r: 1.7 },
];

const CRYSTAL_CHUNKS = [
  { x: 87, y: 207, w: 12, h: 11, rot: -12 },
  { x: 101, y: 205, w: 14, h: 12, rot: 8 },
  { x: 117, y: 208, w: 13, h: 11, rot: -6 },
  { x: 95, y: 211, w: 11, h: 9, rot: 15 },
  { x: 111, y: 210, w: 12, h: 10, rot: -10 },
];

export function BeakerVisual({
  label,
  config,
  status,
  progress,
  dissolveTime,
}: BeakerVisualProps) {
  const isHot = config.tempType === 'hot';
  const isActivelyRunning = status === 'running' && progress < 1;
  const isStirringActive = config.stirring && isActivelyRunning;
  const isDone = progress >= 1;

  // Water height mapping inside beaker (bottom inner y = 222, top rim = 74)
  // 25 cm3 -> y=184 (height 38), 50 cm3 -> y=148 (height 74), 75 cm3 -> y=112 (height 110)
  const liquidTopY =
    config.volumeCm3 === 25 ? 184 : config.volumeCm3 === 50 ? 148 : 112;
  const liquidHeight = 222 - liquidTopY;

  // Concentration factor for CuSO4 blue intensity (2 g in 50 cm3 = baseline)
  const concentrationRatio = (config.soluteMassG / config.volumeCm3) / (2 / 50);
  const clampedConc = Math.min(1.5, Math.max(0.45, concentrationRatio));
  const dissolvedFraction = status === 'idle' ? 0 : progress;

  // Interpolate water color from pale clear-aqua to rich copper(II) sulphate azure
  const blueOpacity = 0.16 + dissolvedFraction * 0.62 * Math.min(1.25, clampedConc);
  const deepBlueOpacity = 0.08 + dissolvedFraction * 0.72 * Math.min(1.25, clampedConc);

  // Remaining solid scale
  const solidScale = status === 'idle' ? 1 : Math.max(0, 1 - progress);
  const massScale = config.soluteMassG === 1 ? 0.75 : config.soluteMassG === 4 ? 1.28 : 1;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[270px] w-[220px] items-end justify-center">
        <svg
          viewBox="0 0 220 260"
          className="h-full w-full overflow-visible"
          role="img"
          aria-label={`Beaker ${label}: ${config.volumeCm3} cubic centimeters of ${isHot ? 'hot' : 'tap'} water, ${config.soluteMassG} grams copper(II) sulphate ${config.soluteForm}, ${config.stirring ? 'stirred' : 'undisturbed'}`}
        >
          <defs>
            <linearGradient id={`liqGrad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="#38BDF8"
                stopOpacity={blueOpacity}
              />
              <stop
                offset="100%"
                stopColor="#0284C7"
                stopOpacity={deepBlueOpacity}
              />
            </linearGradient>

            <clipPath id={`beakerClip-${label}`}>
              <path d="M58 76 L58 214 Q58 224 68 224 L152 224 Q162 224 162 214 L162 76 Z" />
            </clipPath>
          </defs>

          {/* Subtle bench shadow under beaker */}
          <ellipse cx="110" cy="230" rx="56" ry="6" fill="#CBD5E1" opacity="0.65" />

          {/* Steam wisps for hot water (~60 °C) */}
          {isHot && (
            <g stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none">
              <path
                d="M84 64 Q79 50 85 38 Q91 26 85 16"
                className="animate-steam-1"
              />
              <path
                d="M110 62 Q104 48 111 35 Q117 22 110 12"
                className="animate-steam-2"
              />
              <path
                d="M136 65 Q131 52 137 40 Q143 28 137 18"
                className="animate-steam-3"
              />
            </g>
          )}

          {/* Solute sample hovering in weighing spoon/dish BEFORE start when idle */}
          {status === 'idle' && (
            <g transform="translate(110, 44)">
              <path
                d="M-24 6 Q0 14 24 6 L20 11 Q0 18 -20 11 Z"
                fill="#E2E8F0"
                stroke="#94A3B8"
                strokeWidth="1.2"
              />
              {config.soluteForm === 'powder' ? (
                <g fill="#0284C7">
                  <path
                    d={`M-${14 * massScale} 7 Q0 ${-7 * massScale} ${14 * massScale} 7 Z`}
                  />
                  <circle cx="-6" cy="5" r="1.4" fill="#0369A1" />
                  <circle cx="4" cy="3" r="1.3" fill="#38BDF8" />
                  <circle cx="7" cy="6" r="1.4" fill="#0369A1" />
                </g>
              ) : (
                <g fill="#0284C7" stroke="#0369A1" strokeWidth="0.9">
                  <polygon points="-11,7 -5,-2 2,1 0,8" />
                  <polygon points="1,7 5,-3 12,0 10,8" />
                  {config.soluteMassG >= 2 && (
                    <polygon points="-4,7 1,1 7,3 5,8" fill="#0EA5E9" />
                  )}
                  {config.soluteMassG === 4 && (
                    <polygon points="-15,7 -11,1 -6,3 -8,8" fill="#0369A1" />
                  )}
                </g>
              )}
            </g>
          )}

          {/* Liquid body clipped inside beaker */}
          <g clipPath={`url(#beakerClip-${label})`}>
            <rect
              x="56"
              y={liquidTopY}
              width="108"
              height={liquidHeight + 4}
              fill={`url(#liqGrad-${label})`}
            />

            {/* Meniscus / surface line */}
            <path
              d={
                isStirringActive
                  ? `M58 ${liquidTopY} Q110 ${liquidTopY + 9} 162 ${liquidTopY}`
                  : `M58 ${liquidTopY} Q110 ${liquidTopY + 3} 162 ${liquidTopY}`
              }
              fill="none"
              stroke={dissolvedFraction > 0.2 ? '#0284C7' : '#7DD3FC'}
              strokeWidth="1.8"
              opacity="0.85"
            />

            {/* Stirring vortex rings inside solution */}
            {isStirringActive && (
              <g
                stroke="#E0F2FE"
                strokeWidth="1.3"
                fill="none"
                className="animate-swirl"
                style={{ transformOrigin: '110px 180px' }}
              >
                <ellipse cx="110" cy={liquidTopY + 18} rx="28" ry="5" opacity="0.65" />
                <ellipse cx="110" cy={liquidTopY + 38} rx="22" ry="4" opacity="0.55" />
                <ellipse cx="110" cy="204" rx="18" ry="3.5" opacity="0.5" />
              </g>
            )}

            {/* Copper(II) sulphate solid at the bottom while dissolving */}
            {status !== 'idle' && solidScale > 0.01 && (
              <g
                opacity={Math.min(1, solidScale * 1.15)}
                transform={`translate(110, 218) scale(${
                  (0.3 + 0.7 * solidScale) * massScale
                }) translate(-110, -218)`}
              >
                {config.soluteForm === 'powder' ? (
                  <g>
                    <ellipse
                      cx="110"
                      cy="218"
                      rx="24"
                      ry="4.5"
                      fill="#0369A1"
                      opacity="0.45"
                    />
                    {POWDER_GRAINS.map((g, idx) => (
                      <circle
                        key={idx}
                        cx={g.cx}
                        cy={g.cy}
                        r={g.r}
                        fill={idx % 2 === 0 ? '#0284C7' : '#0EA5E9'}
                      />
                    ))}
                  </g>
                ) : (
                  <g>
                    {CRYSTAL_CHUNKS.map((c, idx) => (
                      <rect
                        key={idx}
                        x={c.x}
                        y={c.y}
                        width={c.w}
                        height={c.h}
                        rx="2"
                        transform={`rotate(${c.rot} ${c.x + c.w / 2} ${
                          c.y + c.h / 2
                        })`}
                        fill={idx % 2 === 0 ? '#0284C7' : '#0369A1'}
                        stroke="#38BDF8"
                        strokeWidth="0.8"
                      />
                    ))}
                  </g>
                )}
              </g>
            )}
          </g>

          {/* Glass stirring rod (present when stirring is enabled) */}
          {config.stirring && (
            <g className={isStirringActive ? 'animate-stir-rod' : ''}>
              <line
                x1="126"
                y1="28"
                x2="104"
                y2="212"
                stroke="#94A3B8"
                strokeWidth="5.5"
                strokeLinecap="round"
                opacity="0.65"
              />
              <line
                x1="125"
                y1="28"
                x2="103"
                y2="212"
                stroke="#F8FAFC"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>
          )}

          {/* Borosilicate glass beaker walls and spout */}
          <path
            d="M49 70 Q56 70 57 78 L57 214 Q57 226 69 226 L151 226 Q163 226 163 214 L163 78 Q164 70 169 70"
            fill="none"
            stroke="#475569"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glass highlight reflection */}
          <line
            x1="65"
            y1="88"
            x2="65"
            y2="212"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* 100 cm³ graduation markings */}
          <g stroke="#64748B" strokeWidth="1.2" fontSize="9" fill="#64748B">
            <line x1="143" y1="84" x2="158" y2="84" />
            <text x="122" y="87" stroke="none" className="font-mono tabular-nums">
              100
            </text>
            <line x1="147" y1="112" x2="158" y2="112" />
            <text x="128" y="115" stroke="none" className="font-mono tabular-nums">
              75
            </text>
            <line x1="143" y1="148" x2="158" y2="148" />
            <text x="128" y="151" stroke="none" className="font-mono tabular-nums">
              50
            </text>
            <line x1="147" y1="184" x2="158" y2="184" />
            <text x="128" y="187" stroke="none" className="font-mono tabular-nums">
              25
            </text>
          </g>

          {/* Beaker label badge etched on glass */}
          <g>
            <rect
              x="72"
              y="92"
              width="24"
              height="24"
              rx="4"
              fill="#FFFFFF"
              fillOpacity="0.88"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <text
              x="84"
              y="109"
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill="#0F172A"
            >
              {label}
            </text>
          </g>

          {/* Thermometer readout indicator on hot/tap water */}
          <g transform="translate(174, 152)">
            <rect
              x="0"
              y="0"
              width="42"
              height="22"
              rx="4"
              fill={isHot ? '#FEF2F2' : '#F8FAFC'}
              stroke={isHot ? '#FCA5A5' : '#CBD5E1'}
              strokeWidth="1"
            />
            <text
              x="21"
              y="14.5"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="600"
              fill={isHot ? '#B91C1C' : '#334155'}
              className="font-mono tabular-nums"
            >
              {isHot ? '60 °C' : '22 °C'}
            </text>
          </g>
        </svg>
      </div>

      {/* Beaker caption and live status below bench */}
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold text-slate-900">
          Beaker {label}
        </div>
        <div className="mt-0.5 text-xs text-slate-600 tabular-nums">
          <span>{config.volumeCm3} cm³</span>
          <span aria-hidden="true" className="mx-1.5 text-slate-300">·</span>
          <span>{isHot ? 'Hot water' : 'Tap water'}</span>
          <span aria-hidden="true" className="mx-1.5 text-slate-300">·</span>
          <span>
            {config.soluteMassG.toFixed(1)} g {config.soluteForm}
          </span>
          <span aria-hidden="true" className="mx-1.5 text-slate-300">·</span>
          <span>{config.stirring ? 'Stirred' : 'Undisturbed'}</span>
        </div>

        <div className="mt-2 h-6">
          {isDone && dissolveTime !== null ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 tabular-nums">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Dissolved in {dissolveTime.toFixed(1)} s</span>
            </div>
          ) : isActivelyRunning ? (
            <div className="text-xs font-medium text-sky-700 tabular-nums">
              Dissolving... {Math.round(progress * 100)}%
            </div>
          ) : status === 'paused' ? (
            <div className="text-xs font-medium text-amber-700 tabular-nums">
              Paused at {Math.round(progress * 100)}%
            </div>
          ) : (
            <div className="text-xs text-slate-400">Ready on bench</div>
          )}
        </div>
      </div>
    </div>
  );
}
