// Gabriel — "E se você pudesse voltar 5 segundos no tempo?". Times are seconds in the assembled narration (rewind-mix).
import cues from './rewind-cues.json';
export { clamp, ease, ramp, lin } from './enzo-timeline';
import { clamp } from './enzo-timeline';

export const REWIND_DURATION = 94.5;
export const REWIND_SCENES = [
  { id: '01', start: 0, end: 18.1, title: 'O descobrimento' },
  { id: '02', start: 18.1, end: 32.5, title: 'Os primeiros testes' },
  { id: '03', start: 32.5, end: 52.9, title: 'O perigo' },
  { id: '04', start: 52.9, end: 68.4, title: 'A grande revelação' },
  { id: '05', start: 68.4, end: REWIND_DURATION, title: 'Final surpreendente' },
] as const;

/** Shot cut points (start of each shot); shot i runs until SHOTS[i+1]. */
export const SHOT_STARTS = [
  0, 3.4, 5.6, 9.5, 12.6, // 01
  18.1, 22.0, 23.0, 26.6, 30.2, // 02
  32.5, 36.2, 38.4, 40.2, 41.5, 43.8, 45.2, 48.5, 51.3, // 03
  52.9, 55.7, 57.3, 60.4, 63.8, 66.3, // 04
  68.4, 73.3, 75.7, 79.3, 85.7, 89.4, // 05
] as const;

/** Narration anchors (sentence starts, from pause alignment of the placed voice). */
export const T = {
  five: 3.48, morning: 5.61, slip: 7.6, crash: 8.55, eyes: 9.56, angry: 11.59, opened: 12.62, whole: 15.85,
  phoneFall: 19.9, phoneRew: 20.6, catch: 21.5, trip: 22.3, ball: 23.0, ballRew: 24.0, dodge: 24.84, fist: 26.66, rewinds: 28.55, fun: 30.23,
  girl: 34.33, car: 36.21, run: 38.47, late: 39.69, back1: 40.24, run2: 41.52, shout: 42.55, fall: 42.91, back2: 43.84,
  calm: 45.25, signal: 46.97, carLook: 47.6, step: 48.3, pull: 48.9, pass: 51.0,
  confident: 53.07, storm: 55.74, pole: 57.33, back3: 60.42, fall2: 61.8, unpredict: 63.84, choose: 66.36, now: 67.63,
  last: 68.59, push: 70.58, empty: 71.89, over: 73.36, watch: 73.93, froze: 75.72, man: 79.36, coat: 81.01, stare: 84.23,
  question: 85.72, controls: 87.66, follow: 89.42, fade: 92.9,
} as const;

/** Rewind windows: the world visibly runs backwards inside each span. */
export const REWINDS = [[12.0, 13.6], [20.6, 21.2], [22.45, 22.85], [24.0, 24.55], [40.2, 41.5], [43.8, 45.2], [60.4, 61.2], [68.4, 69.6], [87.7, 89.0]] as const;

export const REWIND_CUES: ReadonlyArray<{ t: number; type: string }> = cues;

export function getRewindFrame(t: number) {
  const time = clamp(t, 0, REWIND_DURATION);
  const index = REWIND_SCENES.findIndex(s => time < s.end);
  const scene = REWIND_SCENES[index < 0 ? REWIND_SCENES.length - 1 : index] ?? REWIND_SCENES[0];
  let shot = 0;
  SHOT_STARTS.forEach((s, i) => { if (time >= s) shot = i; });
  return { t: time, scene, shot, local: time - (SHOT_STARTS[shot] ?? 0) };
}

/** 0..1 strength of the rewind effect at time t (ramps in and out at the edges of each window). */
export function rewindAmount(t: number) {
  for (const [a, b] of REWINDS) if (t >= a && t <= b) return clamp(Math.min((t - a) / .15, (b - t) / .15, 1));
  return 0;
}

/**
 * Action clock that runs forward, then backwards (rewind) and forward again.
 * Before `a` it equals t; between a and b it travels from a back to `to`; after b it continues from `to`.
 */
export function rewound(t: number, a: number, b: number, to: number) {
  if (t <= a) return t;
  if (t <= b) return a - (a - to) * ((t - a) / (b - a));
  return to + (t - b);
}
