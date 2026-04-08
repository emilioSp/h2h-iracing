import { useEffect, useRef, useState } from 'react';

type Props = {
  windRelativeDeg: number;
  size?: number;
};

const shortestDelta = (from: number, to: number): number => {
  let delta = (((to - from) % 360) + 360) % 360;
  if (delta > 180) delta -= 360;
  return delta;
};

const TICK_COUNT = 8;
const CARDINALS = ['N', 'E', 'S', 'W'] as const;
const COLOR = '#00e676';

export const CompassRose = ({ windRelativeDeg, size = 280 }: Props) => {
  const r = size / 2;
  const ringR = r * 0.82;
  const tickOuter = ringR;
  const tickInner = ringR * 0.88;
  const labelR = ringR * 1.18;

  const accumulatedRef = useRef(windRelativeDeg);
  const [displayDeg, setDisplayDeg] = useState(windRelativeDeg);

  useEffect(() => {
    const delta = shortestDelta(accumulatedRef.current, windRelativeDeg);
    accumulatedRef.current = accumulatedRef.current + delta;
    setDisplayDeg(accumulatedRef.current);
  }, [windRelativeDeg]);

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = (i * 360) / TICK_COUNT;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 2 === 0;
    const inner = isMajor ? tickInner * 0.94 : tickInner;
    return {
      angle,
      x1: r + Math.sin(rad) * inner,
      y1: r - Math.cos(rad) * inner,
      x2: r + Math.sin(rad) * tickOuter,
      y2: r - Math.cos(rad) * tickOuter,
      isMajor,
    };
  });

  const cardinalPositions = CARDINALS.map((label, i) => {
    const angle = (i * 90 * Math.PI) / 180;
    return {
      label,
      x: r + Math.sin(angle) * labelR,
      y: r - Math.cos(angle) * labelR,
    };
  });

  // Stealth arrow dimensions — tip at centre (r, r), body goes toward ring edge
  const wingW = ringR * 0.25; // triangle half-width
  const hh = ringR * 0.45; // triangle height
  const cw = ringR * 0.13; // trail chunk half-width
  const ch = ringR * 0.09; // trail chunk height
  const cg = ringR * 0.05; // gap between chunks / between head and first chunk

  // Chevron head: tip at (r, r), flat base at y = r - hh
  const headPoints = [
    [r - wingW, r - hh], // base-left
    [r + wingW, r - hh], // base-right
    [r, r], // tip at centre
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(' ');

  // Parallelogram trail chunks above the head, fading out
  const trailChunks = [0, 1, 2, 3].map((i) => {
    const y = r - hh - cg - i * (ch + cg);
    return {
      key: i,
      opacity: 1 - i * 0.28,
      points: [
        [r + cw, y + ch * 0.2],
        [r + cw, y + ch],
        [r - cw, y + ch * 0.8],
        [r - cw, y],
      ]
        .map(([x, yy]) => `${x},${yy}`)
        .join(' '),
    };
  });

  const pad = size * 0.12;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
      aria-label="Wind direction compass"
      role="img"
    >
      {/* Outer ring */}
      <circle
        cx={r}
        cy={r}
        r={ringR}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth="1.5"
      />

      {/* Tick marks */}
      {ticks.map((t) => (
        <line
          key={t.angle}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={t.isMajor ? '#555' : '#333'}
          strokeWidth={t.isMajor ? 1.5 : 1}
        />
      ))}

      {/* Cardinal labels */}
      {cardinalPositions.map(({ label, x, y }) => (
        <text
          key={label}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={size * 0.1}
          fontFamily="Courier New, monospace"
          fontWeight="bold"
        >
          {label}
        </text>
      ))}

      {/* Stealth arrow — rotates around centre */}
      <g
        style={{
          transform: `rotate(${displayDeg}deg)`,
          transformOrigin: `${r}px ${r}px`,
          transition: 'transform linear',
        }}
      >
        {/* Trail chunks */}
        {trailChunks.map((chunk) => (
          <polygon
            key={chunk.key}
            points={chunk.points}
            fill={COLOR}
            opacity={chunk.opacity}
          />
        ))}

        {/* Chevron head */}
        <polygon points={headPoints} fill={COLOR} />
      </g>
    </svg>
  );
};
