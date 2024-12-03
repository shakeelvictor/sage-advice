import { useState, useEffect } from 'react';

export const useWakeLock = (isActive: boolean) => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if (isActive && 'wakeLock' in navigator) {
          const lock = await navigator.wakeLock.request('screen');
          setWakeLock(lock);
        }
      } catch (err) {
        console.info('Wake Lock not supported or permission denied');
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLock) {
        try {
          await wakeLock.release();
          setWakeLock(null);
        } catch (err) {
          console.info('Error releasing wake lock');
        }
      }
    };

    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Handle visibility change
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isActive) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [isActive, wakeLock]);

  return wakeLock !== null;
};