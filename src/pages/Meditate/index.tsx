import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Bell, CloudRain, Waves, VolumeX } from 'lucide-react';
import useSound from 'use-sound';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, PageHeader, PageTitle, PageIntro, Chip, IconButton } from '../../components/ui';
import { useWakeLock } from '../../hooks/useWakeLock';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { markPracticed } from '../../store/ritualSlice';
import { todayKey } from '../../utils/ritual';
import { PATTERNS, PHASE_LABEL, PatternId, breathAt } from '../../utils/breathing';

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Section = styled.section`
  display: grid;
  gap: 0.75rem;
  justify-items: center;
`;

const SectionLabel = styled(Eyebrow)`
  color: ${({ theme }) => theme.colors.ink3};
`;

const Hint = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.ink3};
  text-align: center;
`;

const Ring = styled.div`
  position: relative;
  width: min(78vw, 300px);
  aspect-ratio: 1;
  margin: 0 auto;
  display: grid;
  place-items: center;
`;

const Glow = styled(motion.div)`
  position: absolute;
  inset: 8%;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow), transparent 70%);
  filter: blur(10px);
`;

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const Track = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.line};
  stroke-width: 3;
`;

const Progress = styled(motion.circle)`
  fill: none;
  stroke: ${({ theme }) => theme.colors.amber};
  stroke-width: 3;
  stroke-linecap: round;
`;

const Time = styled.div`
  position: relative;
  font-size: clamp(3rem, 12vw, 4.25rem);
  font-weight: 300;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.ink};
  line-height: 1;
`;

const State = styled(motion.div)`
  position: absolute;
  bottom: 22%;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};

  b {
    font-family: ${({ theme }) => theme.fonts.display};
    font-weight: 400;
    font-size: 1.1rem;
    letter-spacing: 0;
    color: ${({ theme }) => theme.colors.amber};
    font-variant-numeric: tabular-nums;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Volume = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: min(100%, 280px);
  color: ${({ theme }) => theme.colors.ink2};

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.8;
  }

  input {
    flex: 1;
    height: 4px;
    appearance: none;
    border-radius: 2px;
    background: linear-gradient(to right, var(--amber) 0%, var(--amber) var(--v), var(--line) var(--v), var(--line) 100%);
    outline: none;
  }

  input::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface};
    border: 2px solid ${({ theme }) => theme.colors.amber};
    cursor: pointer;
  }

  input::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface};
    border: 2px solid ${({ theme }) => theme.colors.amber};
    cursor: pointer;
  }
`;

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DURATIONS = [1, 5, 10, 15, 20];
const INTERVALS = [0, 1, 2, 5];

type Soundscape = 'silence' | 'rain' | 'waves';
const SOUNDSCAPES: { id: Soundscape; label: string; Icon: typeof Bell }[] = [
  { id: 'silence', label: 'Silence', Icon: VolumeX },
  { id: 'rain', label: 'Rain', Icon: CloudRain },
  { id: 'waves', label: 'Waves', Icon: Waves },
];

const GLOW_SCALE = { in: 1.22, out: 0.88 } as const;

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

const Meditate = () => {
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [patternId, setPatternId] = useState<PatternId>('none');
  const [soundscape, setSoundscape] = useState<Soundscape>('silence');
  const [interval, setInterval] = useState(0);

  useWakeLock(isActive);

  const [playBell, { stop: stopBell }] = useSound('/sounds/meditation-bell.mp3', { volume, interrupt: true });
  const [playRain, { stop: stopRain, sound: rainSound }] = useSound('/sounds/rain.mp3', { volume, loop: true });
  const [playWaves, { stop: stopWaves, sound: wavesSound }] = useSound('/sounds/waves.mp3', { volume, loop: true });

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
      dispatch(markPracticed(todayKey()));
    }
  }, [finished, dispatch]);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsActive(false);
  }, [duration]);

  // Ambience follows the sit: it plays while active, fades when paused, stops when done.
  const volumeRef = useRef(volume);
  volumeRef.current = volume;
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

  useEffect(() => () => stopAll(), [stopAll]);

  const progress = 1 - timeLeft / total;
  const glowTarget = breath
    ? breath.kind === 'hold'
      ? { opacity: 1 }
      : { scale: GLOW_SCALE[breath.kind], opacity: 1 }
    : isActive
      ? { scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] }
      : { scale: 1, opacity: 0.45 };
  const glowTransition = breath
    ? { duration: breath.seconds, ease: 'easeInOut' }
    : isActive
      ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
      : { duration: 0.8 };

  return (
    <PageTransition>
      <Container>
        <PageHeader style={{ marginBottom: 0 }}>
          <Eyebrow>Be still</Eyebrow>
          <PageTitle>Still</PageTitle>
          <PageIntro>A quiet timer with a breath to follow if you want one. The screen stays awake, and a bell tells you when the time is done.</PageIntro>
        </PageHeader>

        <Section>
          <SectionLabel>Minutes</SectionLabel>
          <Row role="group" aria-label="Duration">
            {DURATIONS.map((d) => (
              <Chip key={d} $active={duration === d} aria-pressed={duration === d} onClick={() => setDuration(d)}>
                {d}
              </Chip>
            ))}
          </Row>
        </Section>

        <Ring>
          <Glow animate={glowTarget} transition={glowTransition} />
          <Svg viewBox="0 0 100 100" aria-hidden>
            <Track cx="50" cy="50" r={RADIUS} />
            <Progress
              cx="50"
              cy="50"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </Svg>
          <Time aria-live="off">{format(timeLeft)}</Time>
          <AnimatePresence mode="wait">
            <State
              key={breath ? breath.kind : finished ? 'done' : isActive ? 'active' : 'ready'}
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
                'Done'
              ) : isActive ? (
                'Sitting'
              ) : (
                'Ready'
              )}
            </State>
          </AnimatePresence>
        </Ring>

        <Controls>
          <IconButton $size={52} onClick={reset} aria-label="Reset" whileTap={{ scale: 0.9 }}>
            <RotateCcw />
          </IconButton>
          <IconButton
            $tone="amber"
            $size={72}
            onClick={() => (finished ? reset() : setIsActive(!isActive))}
            aria-label={isActive ? 'Pause' : 'Begin'}
            whileTap={{ scale: 0.92 }}
          >
            {isActive ? <Pause /> : <Play style={{ marginLeft: 3 }} />}
          </IconButton>
          <span style={{ width: 52 }} aria-hidden />
        </Controls>

        <Section>
          <SectionLabel>Breath</SectionLabel>
          <Row role="group" aria-label="Breathing pattern">
            {PATTERNS.map((p) => (
              <Chip key={p.id} $active={patternId === p.id} aria-pressed={patternId === p.id} onClick={() => setPatternId(p.id)} title={p.detail}>
                {p.label}
              </Chip>
            ))}
          </Row>
          <Hint>{pattern.detail}</Hint>
        </Section>

        <Section>
          <SectionLabel>Soundscape</SectionLabel>
          <Row role="group" aria-label="Soundscape during the sit">
            {SOUNDSCAPES.map(({ id, label, Icon }) => (
              <Chip key={id} $active={soundscape === id} aria-pressed={soundscape === id} onClick={() => setSoundscape(id)}>
                <Icon aria-hidden /> {label}
              </Chip>
            ))}
          </Row>
        </Section>

        <Section>
          <SectionLabel>Interval bell</SectionLabel>
          <Row role="group" aria-label="Interval bell">
            {INTERVALS.filter((i) => i === 0 || i < duration).map((i) => (
              <Chip key={i} $active={interval === i} aria-pressed={interval === i} onClick={() => setInterval(i)} style={{ textTransform: 'none' }}>
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
        </Section>
      </Container>
    </PageTransition>
  );
};

export default Meditate;
