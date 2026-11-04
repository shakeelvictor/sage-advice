import { Stage } from '../../../utils/garden';

/**
 * The small plant on a kept line's left edge. A sprout when saved, leaves once you write a note or
 * watch it again, a bloom once you have done both (see utils/garden.ts).
 */
const GrowthMark = ({ stage, size = 40 }: { stage: Stage; size?: number }) => {
  const young = 'color-mix(in srgb, var(--sage) 55%, var(--mint))';
  return (
    <svg viewBox="0 0 32 44" width={size * (32 / 44)} height={size} aria-hidden focusable="false">
      {stage === 'sprout' && (
        <>
          <path d="M16 42 C16 36 16 32 16 27" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="11" cy="25" rx="5.5" ry="2.6" transform="rotate(-28 16 27)" fill={young} />
          <ellipse cx="21" cy="25" rx="5.5" ry="2.6" transform="rotate(28 16 27)" fill={young} />
        </>
      )}
      {stage === 'leaf' && (
        <>
          <path d="M16 42 C15 32 17 22 16 12" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="10" cy="31" rx="6.5" ry="3" transform="rotate(-30 15.8 32)" fill="var(--sage)" />
          <ellipse cx="22" cy="24" rx="6.5" ry="3" transform="rotate(30 16.2 25)" fill="var(--sage)" />
          <ellipse cx="11" cy="17" rx="5" ry="2.4" transform="rotate(-30 16 18)" fill={young} />
          <circle cx="16" cy="10" r="3.2" fill="var(--ember)" />
        </>
      )}
      {stage === 'bloom' && (
        <>
          <path d="M16 42 C15 33 17 24 16 15" stroke="var(--sage)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="10" cy="33" rx="6.5" ry="3" transform="rotate(-30 15.8 34)" fill="var(--sage)" />
          <ellipse cx="22" cy="26" rx="6.5" ry="3" transform="rotate(30 16.2 27)" fill="var(--sage)" />
          <g transform="translate(16 10)">
            {[0, 60, 120, 180, 240, 300].map((r) => (
              <ellipse key={r} cx="0" cy="-5.2" rx="3.1" ry="5.4" transform={`rotate(${r})`} fill="var(--ember)" opacity="0.92" />
            ))}
            <circle r="2.6" fill="var(--ember-ink)" />
          </g>
        </>
      )}
    </svg>
  );
};

export default GrowthMark;
