export type PatternId = 'none' | 'box' | '478' | 'coherent';
export type PhaseKind = 'in' | 'hold' | 'out';

export interface BreathPattern {
  id: PatternId;
  label: string;
  detail: string;
  /** Seconds per phase, in order. Empty means no guidance. */
  phases: { kind: PhaseKind; seconds: number }[];
}

export const PATTERNS: BreathPattern[] = [
  { id: 'none', label: 'Just sit', detail: 'No guidance', phases: [] },
  {
    id: 'box',
    label: 'Box',
    detail: '4 · 4 · 4 · 4',
    phases: [
      { kind: 'in', seconds: 4 },
      { kind: 'hold', seconds: 4 },
      { kind: 'out', seconds: 4 },
      { kind: 'hold', seconds: 4 },
    ],
  },
  {
    id: '478',
    label: '4-7-8',
    detail: 'In 4 · hold 7 · out 8',
    phases: [
      { kind: 'in', seconds: 4 },
      { kind: 'hold', seconds: 7 },
      { kind: 'out', seconds: 8 },
    ],
  },
  {
    id: 'coherent',
    label: 'Coherent',
    detail: 'In 5 · out 5',
    phases: [
      { kind: 'in', seconds: 5 },
      { kind: 'out', seconds: 5 },
    ],
  },
];

export const PHASE_LABEL: Record<PhaseKind, string> = { in: 'Breathe in', hold: 'Hold', out: 'Breathe out' };

export interface BreathState {
  index: number;
  kind: PhaseKind;
  seconds: number;
  /** Seconds remaining in this phase, counting down to 1. */
  remaining: number;
  /** Which cycle we are in, so a repeated phase still gets a fresh animation key. */
  cycle: number;
}

/** Where in the pattern we are after `elapsed` whole seconds. Derived, so pausing keeps it honest. */
export const breathAt = (pattern: BreathPattern, elapsed: number): BreathState | null => {
  if (pattern.phases.length === 0) return null;
  const cycleLength = pattern.phases.reduce((sum, p) => sum + p.seconds, 0);
  const cycle = Math.floor(elapsed / cycleLength);
  let position = elapsed % cycleLength;
  for (let index = 0; index < pattern.phases.length; index++) {
    const phase = pattern.phases[index];
    if (position < phase.seconds) {
      return { index, kind: phase.kind, seconds: phase.seconds, remaining: phase.seconds - position, cycle };
    }
    position -= phase.seconds;
  }
  return null;
};
