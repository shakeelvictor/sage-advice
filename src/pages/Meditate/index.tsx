import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BsPlayFill, BsPauseFill, BsArrowCounterclockwise, BsVolumeUp } from 'react-icons/bs';
import { TiWeatherDownpour } from 'react-icons/ti';
import { FaWater } from 'react-icons/fa';
import { IoMusicalNotes } from 'react-icons/io5';
import useSound from 'use-sound';
import PageTransition from '../../components/PageTransition';
import { useWakeLock } from '../../hooks/useWakeLock';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 3rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const DurationButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const DurationButton = styled(motion.button)<{ $active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background.secondary};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : `${theme.colors.background.secondary}dd`};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const TimerCircle = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CIRCLE_RADIUS = 140;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const CircleBackground = styled.circle`
  fill: none;
  stroke: ${({ theme }) => theme.colors.background.secondary};
  stroke-width: 8;
`;

const CircleProgress = styled(motion.circle)`
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary};
  stroke-width: 8;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 1s linear;
`;

const TimeDisplay = styled.div`
  position: absolute;
  font-size: 3rem;
  font-family: ${({ theme }) => theme.fonts.secondary};
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ControlButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 300px;
  margin: 0 auto 2rem;
`;

const VolumeSlider = styled.input`
  flex: 1;
  height: 4px;
  appearance: none;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 2px;
  outline: none;
  transition: all 0.3s ease;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
`;

const SoundButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const SoundButton = styled(motion.button)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.background.secondary};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : `${theme.colors.background.secondary}dd`};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const durations = [1, 5, 10, 15, 20];

type CompletionSound = 'bell' | 'rain' | 'waves';

const Meditate = () => {
  const [duration, setDuration] = useState(1);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [completionSound, setCompletionSound] = useState<CompletionSound>('bell');

  // Keep screen active while timer is running
  useWakeLock(isActive);

  const [playBell, { stop: stopBell }] = useSound('/sounds/meditation-bell.mp3', {
    volume,
    interrupt: true
  });

  const [playRain, { stop: stopRain }] = useSound('/sounds/rain.mp3', {
    volume,
    interrupt: true
  });

  const [playWaves, { stop: stopWaves }] = useSound('/sounds/waves.mp3', {
    volume,
    interrupt: true
  });

  const stopAllSounds = useCallback(() => {
    stopBell();
    stopRain();
    stopWaves();
  }, [stopBell, stopRain, stopWaves]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = useCallback(() => {
    setTimeLeft(duration * 60);
    setIsActive(false);
    stopAllSounds();
  }, [duration, stopAllSounds]);

  useEffect(() => {
    let interval: number;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;

          if (newTime <= 0) {
            setIsActive(false);
            switch (completionSound) {
              case 'bell':
                playBell();
                break;
              case 'rain':
                playRain();
                break;
              case 'waves':
                playWaves();
                break;
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, playBell, playRain, playWaves, completionSound]);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllSounds();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', stopAllSounds);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', stopAllSounds);
    };
  }, [stopAllSounds]);

  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - timeLeft / (duration * 60));

  return (
    <PageTransition>
      <Container>
        <Title>Meditation Timer</Title>
        <Subtitle>
          Choose your preferred completion sound below. When the timer ends, your selected sound will play.
          If no sound is selected, the meditation bell will play by default.
        </Subtitle>

        <Section>
          <SectionTitle>Duration</SectionTitle>
          <DurationButtons>
            {durations.map((d) => (
              <DurationButton
                key={d}
                $active={duration === d}
                onClick={() => {
                  setDuration(d);
                  reset();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {d} min
              </DurationButton>
            ))}
          </DurationButtons>
        </Section>

        <TimerCircle>
          <svg width="300" height="300" viewBox="0 0 300 300">
            <CircleBackground cx="150" cy="150" r={CIRCLE_RADIUS} />
            <CircleProgress
              cx="150"
              cy="150"
              r={CIRCLE_RADIUS}
              strokeDasharray={CIRCLE_CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: CIRCLE_CIRCUMFERENCE }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
          <TimeDisplay>{formatTime(timeLeft)}</TimeDisplay>
        </TimerCircle>

        <Controls>
          <ControlButton
            onClick={reset}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <BsArrowCounterclockwise size={24} />
          </ControlButton>
          <ControlButton
            onClick={() => setIsActive(!isActive)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
          </ControlButton>
        </Controls>

        <Section>
          <SectionTitle>Volume</SectionTitle>
          <VolumeControl>
            <BsVolumeUp size={20} />
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </VolumeControl>
        </Section>

        <Section>
          <SectionTitle>Completion Sound</SectionTitle>
          <SoundButtons>
            <SoundButton
              $active={completionSound === 'bell'}
              onClick={() => setCompletionSound('bell')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoMusicalNotes size={20} /> Bell
            </SoundButton>
            <SoundButton
              $active={completionSound === 'rain'}
              onClick={() => setCompletionSound('rain')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TiWeatherDownpour size={20} /> Rain
            </SoundButton>
            <SoundButton
              $active={completionSound === 'waves'}
              onClick={() => setCompletionSound('waves')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWater size={20} /> Waves
            </SoundButton>
          </SoundButtons>
        </Section>
      </Container>
    </PageTransition>
  );
};

export default Meditate;