import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Bell, CloudRain, Waves, VolumeX } from 'lucide-react';
import useSound from 'use-sound';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, Headline, Chip, IconButton, Surface, ForestCard } from '../../components/ui';
import { useWakeLock } from '../../hooks/useWakeLock';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logPractice } from '../../store/ritualSlice';
import { PATTERNS, PHASE_LABEL, PatternId, breathAt } from '../../utils/breathing';

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  gap: 1.25rem;
  padding-block: 0.25rem 1rem;

  > * {
    min-width: 0;
  }
`;

const Top = styled.header`
  display: grid;
  gap: 0.6rem;
`;

/* The one forest surface on Still: it holds the orb, the time and the phase. */
const Stage = styled(ForestCard)`
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  padding-block: 2rem 1.75rem;
`;

const OrbFrame = styled.div`
  position: relative;
  width: min(62vw, 240px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  margin-bottom: 1rem;
`;

/* Progress: an ember halo that fills clockwise around the orb. The orb's size belongs to the breath. */
const Halo = styled.div<{ $p: number }>`
  --halo: ${({ $p }) => $p};
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    conic-gradient(from 0deg, var(--ember) calc(var(--halo) * 1turn), transparent 0),
    color-mix(in srgb, var(--on-forest) 9%, transparent);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 4px));
  transition: --halo 1s linear;
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--ember) 45%, transparent));
`;

const Orb = styled(motion.div)<{ $warm: boolean }>`
  position: relative;
  width: 72%;
  aspect-ratio: 1;
  /* A soft blob, not a disc: the outline drifts slowly. Reduced motion stops the drift. */
  border-radius: 48% 52% 50% 50% / 52% 48% 52% 48%;
  animation: orb-drift 16s ease-in-out infinite;

  @keyframes orb-drift {
    0%, 100% { border-radius: 48% 52% 50% 50% / 52% 48% 52% 48%; }
    33% { border-radius: 53% 47% 48% 52% / 47% 53% 49% 51%; }
    66% { border-radius: 50% 50% 53% 47% / 50% 51% 47% 53%; }
  }

  &::after {
    border-radius: 50%;
  }
  background: radial-gradient(circle at 50% 50%, var(--mint) 0%, color-mix(in srgb, var(--mint) 55%, var(--sage)) 58%, var(--sage) 100%);
  box-shadow:
    0 0 0 10px color-mix(in srgb, var(--mint) 10%, transparent),
    0 0 48px 6px color-mix(in srgb, var(--mint) 26%, transparent);

  /* The ember inner highlight. It warms when a sit ends. */
  &::after {
    content: '';
    position: absolute;
    left: 22%;
    top: 18%;
    width: 46%;
    aspect-ratio: 1;
    background: radial-gradient(circle, color-mix(in srgb, var(--ember) 85%, transparent), transparent 70%);
    opacity: ${({ $warm }) => ($warm ? 0.95 : 0.55)};
    filter: blur(6px);
    transition: opacity 0.8s ease;
  }
`;

const Time = styled.div`
  font-size: 60px;
  font-weight: 300;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: ${({ theme }) => theme.colors.onForest};
`;

const Phase = styled(motion.div)`
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  min-height: 1.6rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: color-mix(in srgb, ${({ theme }) => theme.colors.onForest} 78%, transparent);

  b {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.ember};
    font-variant-numeric: tabular-nums;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding-block: 0.25rem;
`;

const Settings = styled(Surface)`
  display: grid;
  gap: 1.25rem;
  padding: 1.25rem;
`;

const Setting = styled.div`
  display: grid;
  gap: 0.6rem;
`;

const SettingHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;

  small {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.ink3};
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Volume = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.ink2};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.9;
  }

  input {
    flex: 1;
    height: 4px;
    appearance: none;
    border-radius: 2px;
    background: linear-gradient(to right, var(--action) 0%, var(--action) var(--v), color-mix(in srgb, var(--sage) 35%, var(--surface)) var(--v), color-mix(in srgb, var(--sage) 35%, var(--surface)) 100%);
    outline-offset: 6px;
  }

  input::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface};
    border: 2px solid ${({ theme }) => theme.colors.action};
    cursor: pointer;
  }

  input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface};
    border: 2px solid ${({ theme }) => theme.colors.action};
    cursor: pointer;
  }
`;

const DURATIONS = [1, 5, 10, 15, 20];
const INTERVALS = [0, 1, 2, 5];
const DURATION_WORDS: Record<number, string> = { 1: 'One minute', 5: 'Five minutes', 10: 'Ten minutes', 15: 'Fifteen minutes', 20: 'Twenty minutes' };

type Soundscape = 'silence' | 'rain' | 'waves';
const SOUNDSCAPES: { id: Soundscape; label: string; Icon: typeof Bell }[] = [
  { id: 'silence', label: 'Silence', Icon: VolumeX },
  { id: 'rain', label: 'Rain', Icon: CloudRain },
  { id: 'waves', label: 'Waves', Icon: Waves },
];

/** Orb scale per breath phase. A hold keeps whatever size the last phase reached. */
const ORB_SCALE = { in: 1.15, out: 0.9 } as const;

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

const Meditate = () => {
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const level = muted ? 0 : volume;
  const [patternId, setPatternId] = useState<PatternId>('none');
  const [soundscape, setSoundscape] = useState<Soundscape>('silence');
  const [interval, setInterval] = useState(0);

  useWakeLock(isActive);

  const [playBell, { stop: stopBell }] = useSound('/sounds/meditation-bell.mp3', { volume: level, interrupt: true });
  const [playRain, { stop: stopRain, sound: rainSound }] = useSound('/sounds/rain.mp3', { volume: level, loop: true });
  const [playWaves, { stop: stopWaves, sound: wavesSound }] = useSound('/sounds/waves.mp3', { volume: level, loop: true });

  const stopAmbience = useCallback(() => {
    stopRain();
    stopWaves();
  }, [stopRain, stopWaves]);

  const stopAll = useCallback(() => {
    stopBell();
    stopAmbience();
  }, [stopBell, stopAmbience]);

  const total = duration * 60;
  const elapsed = total - timeLeft;
  const finished = timeLeft === 0;
  const pattern = useMemo(() => PATTERNS.find((p) => p.id === patternId) ?? PATTERNS[0], [patternId]);
  const breath = isActive && !finished ? breathAt(pattern, elapsed) : null;

  const reset = useCallback(() => {
    setTimeLeft(duration * 60);
    setIsActive(false);
    stopAll();
  }, [duration, stopAll]);

  // The clock. Interval bells ring on the minute boundaries you chose; the final bell ends the sit.
  const finishedRef = useRef(false);
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        if (next <= 0) {
          setIsActive(false);
          finishedRef.current = true;
          playBell();
          return 0;
        }
        const passed = total - next;
        if (interval > 0 && passed % (interval * 60) === 0) playBell();
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isActive, timeLeft, total, interval, playBell]);

  // A finished sit counts as a day of practice.
  useEffect(() => {
    if (finished && finishedRef.current) {
      finishedRef.current = false;
      dispatch(logPractice({ kind: 'sit', at: Date.now(), minutes: duration, pattern: patternId }));
    }
  }, [finished, dispatch, duration, patternId]);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsActive(false);
  }, [duration]);

  // Ambience follows the sit: it plays while active, fades when paused, stops when done.
  const volumeRef = useRef(level);
  volumeRef.current = level;
  useEffect(() => {
    const ambient = soundscape === 'rain' ? rainSound : soundscape === 'waves' ? wavesSound : null;
    if (!isActive || !ambient) {
      [rainSound, wavesSound].forEach((s) => s?.playing() && s.fade(s.volume(), 0, 600));
      const t = window.setTimeout(stopAmbience, 650);
      return () => window.clearTimeout(t);
    }
    // A fade-out leaves the Howl at volume 0, so restore it before every start.
    ambient.volume(volumeRef.current);
    if (soundscape === 'rain') {
      stopWaves();
      playRain();
    } else {
      stopRain();
      playWaves();
    }
  }, [isActive, soundscape, playRain, playWaves, stopRain, stopWaves, stopAmbience, rainSound, wavesSound]);

  // Leaving the tab silences everything; coming back resumes the ambience if the sit is still going.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        stopAll();
      } else if (isActive) {
        if (soundscape === 'rain') playRain();
        if (soundscape === 'waves') playWaves();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isActive, soundscape, playRain, playWaves, stopAll]);

  // Volume and mute changes reach an ambience that is already playing.
  useEffect(() => {
    [rainSound, wavesSound].forEach((s) => s?.playing() && s.volume(level));
  }, [level, rainSound, wavesSound]);

  useEffect(() => () => stopAll(), [stopAll]);

  const progress = 1 - timeLeft / total;
  const orbTarget = breath
    ? breath.kind === 'hold'
      ? {}
      : { scale: ORB_SCALE[breath.kind] }
    : isActive
      ? { scale: [1, 1.06, 1] }
      : { scale: 1 };
  const orbTransition = breath
    ? { duration: breath.seconds, ease: 'easeInOut' }
    : isActive
      ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 0.8 };
  const phaseKey = breath ? `${breath.kind}-${breath.index}-${breath.cycle}` : finished ? 'done' : isActive ? 'active' : 'ready';

  return (
    <PageTransition>
      <Container>
        <Top>
          <Eyebrow>Still</Eyebrow>
          <Headline>
            {DURATION_WORDS[duration] ?? `${duration} minutes`} <span>to reset.</span>
          </Headline>
        </Top>

        <Stage aria-label="Timer">
          <OrbFrame>
            <Halo $p={progress} aria-hidden />
            <Orb $warm={finished} animate={orbTarget} transition={orbTransition} aria-hidden />
          </OrbFrame>
          <Time role="timer" aria-live="off">{format(timeLeft)}</Time>
          <AnimatePresence mode="wait">
            <Phase
              key={phaseKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              aria-live="polite"
            >
              {breath ? (
                <>
                  {PHASE_LABEL[breath.kind]} <b>{breath.remaining}</b>
                </>
              ) : finished ? (
                'Done. Well sat.'
              ) : isActive ? (
                'Sitting'
              ) : (
                'Ready when you are'
              )}
            </Phase>
          </AnimatePresence>
        </Stage>

        <Controls>
          <IconButton $tone="surface" $size={52} onClick={reset} aria-label="Reset" whileTap={{ scale: 0.9 }}>
            <RotateCcw aria-hidden />
          </IconButton>
          <IconButton
            $tone="forest"
            $size={72}
            onClick={() => (finished ? reset() : setIsActive(!isActive))}
            aria-label={finished ? 'Start again' : isActive ? 'Pause' : 'Begin'}
            whileTap={{ scale: 0.92 }}
          >
            {isActive ? <Pause aria-hidden /> : <Play aria-hidden style={{ marginLeft: 3 }} />}
          </IconButton>
          <IconButton
            $tone="surface"
            $size={52}
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Turn sound on' : 'Mute sound'}
            aria-pressed={muted}
            whileTap={{ scale: 0.9 }}
          >
            {muted ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
          </IconButton>
        </Controls>

        <Settings as="section" aria-label="Sit settings">
          <Setting>
            <SettingHead>
              <Eyebrow>Length</Eyebrow>
              <small>minutes</small>
            </SettingHead>
            <Row role="group" aria-label="Duration in minutes">
              {DURATIONS.map((d) => (
                <Chip key={d} $active={duration === d} aria-pressed={duration === d} onClick={() => setDuration(d)}>
                  {d}
                </Chip>
              ))}
            </Row>
          </Setting>

          <Setting>
            <SettingHead>
              <Eyebrow>Breath</Eyebrow>
              <small>{pattern.detail}</small>
            </SettingHead>
            <Row role="group" aria-label="Breathing pattern">
              {PATTERNS.map((p) => (
                <Chip key={p.id} $active={patternId === p.id} aria-pressed={patternId === p.id} onClick={() => setPatternId(p.id)} title={p.detail}>
                  {p.label}
                </Chip>
              ))}
            </Row>
          </Setting>

          <Setting>
            <SettingHead>
              <Eyebrow>Soundscape</Eyebrow>
            </SettingHead>
            <Row role="group" aria-label="Soundscape during the sit">
              {SOUNDSCAPES.map(({ id, label, Icon }) => (
                <Chip key={id} $active={soundscape === id} aria-pressed={soundscape === id} onClick={() => setSoundscape(id)}>
                  <Icon aria-hidden /> {label}
                </Chip>
              ))}
            </Row>
          </Setting>

          <Setting>
            <SettingHead>
              <Eyebrow>Interval bell</Eyebrow>
            </SettingHead>
            <Row role="group" aria-label="Interval bell">
              {INTERVALS.filter((i) => i === 0 || i < duration).map((i) => (
                <Chip key={i} $active={interval === i} aria-pressed={interval === i} onClick={() => setInterval(i)}>
                  {i === 0 ? (
                    'None'
                  ) : (
                    <>
                      <Bell aria-hidden /> every {i} min
                    </>
                  )}
                </Chip>
              ))}
            </Row>
            <Volume style={{ ['--v' as string]: `${volume * 100}%` }}>
              <Volume2 aria-hidden />
              <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} aria-label="Volume" />
            </Volume>
          </Setting>
        </Settings>
      </Container>
    </PageTransition>
  );
};

export default Meditate;
