import { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SavedVideo } from '../../../types/video';
import { layoutGarden, Plant, STAGE_LABEL } from '../../../utils/garden';
import { springSoft } from '../../../styles/motion';

const Bed = styled.div`
  position: relative;
  width: 100%;
  border-radius: var(--radius-l);
  border: 1px solid ${({ theme }) => theme.colors.line};
  background:
    radial-gradient(60% 50% at 50% 100%, color-mix(in srgb, ${({ theme }) => theme.colors.amber} 14%, transparent), transparent 70%),
    ${({ theme }) => theme.colors.surface};
  overflow: hidden;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.75rem 1.1rem 0;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.ink3};

  b {
    color: ${({ theme }) => theme.colors.ink2};
    font-weight: 700;
  }
`;

const GROUND = 262;
const W = 1000;

/** Point on the stem's quadratic curve at t. */
const onStem = (p: Plant, t: number) => {
  const cx = p.lean;
  const cy = -p.height * 0.55;
  const ex = p.lean * 1.4;
  const ey = -p.height;
  return {
    x: (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * cx + t * t * ex,
    y: (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * cy + t * t * ey,
  };
};

const Leaf = ({ x, y, side, size, color }: { x: number; y: number; side: 1 | -1; size: number; color: string }) => (
  <ellipse cx={x + side * size * 0.8} cy={y} rx={size} ry={size * 0.42} transform={`rotate(${side * -32} ${x} ${y})`} fill={color} opacity={0.9} />
);

const PlantFigure = ({ plant, index, selected, onSelect }: { plant: Plant; index: number; selected: boolean; onSelect: () => void }) => {
  const { x, height, lean, leaves, stage, seed, video } = plant;
  const px = x * W;
  const tip = onStem(plant, 1);
  const stemD = `M0 0 Q ${lean} ${-height * 0.55} ${lean * 1.4} ${-height}`;
  const leafColor = stage === 'sprout' ? 'var(--moss)' : 'var(--sage)';
  const swayDuration = 5 + (seed % 30) / 10;

  return (
    <g transform={`translate(${px} ${GROUND})`}>
      <motion.g initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ ...springSoft, delay: 0.1 + index * 0.06 }}>
        <motion.g animate={{ rotate: [-1.6, 1.6, -1.6] }} transition={{ duration: swayDuration, repeat: Infinity, ease: 'easeInOut', delay: (seed % 20) / 10 }}>
          <path d={stemD} fill="none" stroke="var(--sage)" strokeWidth={2.2} strokeLinecap="round" opacity={0.9} />
          {Array.from({ length: leaves }).map((_, i) => {
            const t = 0.32 + (i / Math.max(leaves, 1)) * 0.5;
            const { x: lx, y: ly } = onStem(plant, t);
            return <Leaf key={i} x={lx} y={ly} side={i % 2 === 0 ? 1 : -1} size={stage === 'sprout' ? 10 : 13} color={leafColor} />;
          })}
          {stage === 'bloom' && (
            <g transform={`translate(${tip.x} ${tip.y})`}>
              {[0, 60, 120, 180, 240, 300].map((r) => (
                <ellipse key={r} cx={0} cy={-9} rx={5.5} ry={10} transform={`rotate(${r})`} fill="var(--amber)" opacity={0.92} />
              ))}
              <circle r={4.5} fill="var(--ember)" />
            </g>
          )}
          {stage === 'leaf' && <circle cx={tip.x} cy={tip.y} r={4.5} fill="var(--amber)" opacity={0.85} />}
          {stage === 'sprout' && (
            <>
              <Leaf x={tip.x} y={tip.y} side={1} size={8} color={leafColor} />
              <Leaf x={tip.x} y={tip.y} side={-1} size={8} color={leafColor} />
            </>
          )}
        </motion.g>
        {selected && (
          <motion.circle
            cx={tip.x}
            cy={tip.y}
            r={26}
            fill="none"
            stroke="var(--amber)"
            strokeWidth={1.5}
            strokeDasharray="4 6"
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${tip.x}px ${tip.y}px` }}
          />
        )}
        <rect
          x={Math.min(0, lean * 1.4) - 24}
          y={-height - 24}
          width={Math.abs(lean * 1.4) + 48}
          height={height + 30}
          fill="transparent"
          role="button"
          tabIndex={0}
          aria-label={`${video.title}, ${STAGE_LABEL[stage].toLowerCase()}`}
          aria-pressed={selected}
          style={{ cursor: 'pointer', outline: 'none' }}
          onClick={onSelect}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect())}
        />
      </motion.g>
    </g>
  );
};

interface GardenViewProps {
  videos: SavedVideo[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const GardenView = ({ videos, selectedId, onSelect }: GardenViewProps) => {
  const plants = useMemo(() => layoutGarden(videos), [videos]);
  const counts = plants.reduce(
    (acc, p) => ({ ...acc, [p.stage]: acc[p.stage] + 1 }),
    { sprout: 0, leaf: 0, bloom: 0 },
  );

  return (
    <div>
      <Bed>
        <svg viewBox={`0 0 ${W} 320`} role="group" aria-label={`Your garden: ${videos.length} kept lines`}>
          <defs>
            <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--sage)" stopOpacity="0.22" />
              <stop offset="1" stopColor="var(--sage)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0 ${GROUND} C 250 ${GROUND - 10}, 500 ${GROUND + 10}, 750 ${GROUND - 6} S 1000 ${GROUND + 4}, ${W} ${GROUND} L ${W} 320 L 0 320 Z`} fill="url(#soil)" />
          <path d={`M0 ${GROUND} C 250 ${GROUND - 10}, 500 ${GROUND + 10}, 750 ${GROUND - 6} S 1000 ${GROUND + 4}, ${W} ${GROUND}`} fill="none" stroke="var(--sage)" strokeWidth={1.5} opacity={0.55} />
          {plants.map((plant, i) => (
            <PlantFigure
              key={plant.video.id}
              plant={plant}
              index={i}
              selected={selectedId === plant.video.id}
              onSelect={() => onSelect(selectedId === plant.video.id ? null : plant.video.id)}
            />
          ))}
        </svg>
      </Bed>
      <Legend>
        <span>
          <b>{videos.length}</b> {videos.length === 1 ? 'line' : 'lines'} · <b>{counts.sprout}</b> sprouting · <b>{counts.leaf}</b> in leaf · <b>{counts.bloom}</b> in bloom
        </span>
        <span>A note gives a line leaves. Watching it again brings the bloom.</span>
      </Legend>
    </div>
  );
};

export default GardenView;
