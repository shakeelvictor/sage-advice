import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, Bell, CloudRain, Waves } from 'lucide-react';
import useSound from 'use-sound';
import PageTransition from '../../components/PageTransition';
import { Eyebrow, PageHeader, PageTitle, PageIntro, Chip, IconButton } from '../../components/ui';
import { useWakeLock } from '../../hooks/useWakeLock';

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
  inset: 6%;
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

const State = styled.div`
  position: absolute;
  bottom: 24%;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
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
const durations = [1, 5, 10, 15, 20];

type CompletionSound = 'bell' | 'rain' | 'waves';
const sounds: { id: CompletionSound; label: string; Icon: typeof Bell }[] = [
  { id: 'bell', label: 'Bell', Icon: Bell },
  { id: 'rain', label: 'Rain', Icon: CloudRain },
  { id: 'waves', label: 'Waves', Icon: Waves },
];

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

const Meditate = () => {
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [completionSound, setCompletionSound] = useState<CompletionSound>('bell');

  useWakeLock(isActive);

  const [playBell, { stop: stopBell }] = useSound('/sounds/meditation-bell.mp3', { volume, interrupt: true });
  const [playRain, { stop: stopRain }] = useSound('/sounds/rain.mp3', { volume, interrupt: true });
  const [playWaves, { stop: stopWaves }] = useSound('/sounds/waves.mp3', { volume, interrupt: true });

  const stopAll = useCallback(() => {
    stopBell();
    stopRain();
    stopWaves();
  }, [stopBell, stopRain, stopWaves]);

  const reset = useCallback(() => {
    setTimeLeft(duration * 60);
    setIsActive(false);
    stopAll();
  }, [duration, stopAll]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    const interval = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t - 1 <= 0) {
          setIsActive(false);
          ({ bell: playBell, rain: playRain, waves: playWaves })[completionSound]();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isActive, timeLeft, playBell, playRain, playWaves, completionSound]);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    const onHide = () => document.hidden && stopAll();
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', stopAll);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('blur', stopAll);
    };
  }, [stopAll]);

  const progress = 1 - timeLeft / (duration * 60);
  const finished = timeLeft === 0;

  return (
    <PageTransition>
      <Container>
        <PageHeader style={{ marginBottom: 0 }}>
          <Eyebrow>Be still</Eyebrow>
          <PageTitle>Still</PageTitle>
          <PageIntro>A quiet timer. The screen stays awake, and a sound tells you when the time is done.</PageIntro>
        </PageHeader>

        <Section>
          <SectionLabel>Minutes</SectionLabel>
          <Row role="group" aria-label="Duration">
            {durations.map((d) => (
              <Chip key={d} $active={duration === d} aria-pressed={duration === d} onClick={() => { setDuration(d); setIsActive(false); stopAll(); }}>
                {d}
              </Chip>
            ))}
          </Row>
        </Section>

        <Ring>
          <Glow
            animate={isActive ? { scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] } : { scale: 1, opacity: 0.45 }}
            transition={isActive ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 }}
          />
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
          <Time aria-live="polite">{format(timeLeft)}</Time>
          <State>{finished ? 'Done' : isActive ? 'Breathing' : 'Ready'}</State>
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
          <SectionLabel>Ends with</SectionLabel>
          <Row role="group" aria-label="Completion sound">
            {sounds.map(({ id, label, Icon }) => (
              <Chip key={id} $active={completionSound === id} aria-pressed={completionSound === id} onClick={() => setCompletionSound(id)}>
                <Icon aria-hidden /> {label}
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
