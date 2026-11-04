import { useSyncExternalStore } from 'react';

/**
 * The living ground: a decorative WebGL layer behind every screen. It never carries meaning.
 * This module holds what other components talk to it with: the on/off setting and the warm pulse.
 */

const KEY = 'calmBackground';
const CHANGE = 'sage:calm-background';
const WARM = 'sage:warm';

const read = (): boolean => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener('storage', onChange);
  };
};

/** "Calm background: on / off" from About, persisted on this device. */
export const useCalmBackground = (): [boolean, (on: boolean) => void] => {
  const on = useSyncExternalStore(subscribe, read, () => true);
  const set = (next: boolean) => {
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off');
    } catch {
      /* Storage can be unavailable in private modes; the toggle still applies for this visit. */
    }
    window.dispatchEvent(new Event(CHANGE));
  };
  return [on, set];
};

/** Briefly warm the ember spot in the ground: when a line is kept or a sit ends. */
export const warmGround = () => window.dispatchEvent(new Event(WARM));

export const WARM_EVENT = WARM;
