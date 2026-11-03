// Lucas — "E se você pudesse criar cópias de si mesmo?". Times are seconds in the assembled narration (clones-mix).
import cues from './clones-cues.json';
export { clamp, ease, ramp, lin, handPos } from './enzo-timeline';
import { clamp } from './enzo-timeline';

export const CLONES_DURATION = 99;
export const CLONES_SCENES = [
  { id: '01', start: 0, end: 16.75, title: 'O gancho' },
  { id: '02', start: 16.75, end: 27.75, title: 'A descoberta' },
  { id: '03', start: 27.75, end: 41.1, title: 'As vantagens' },
  { id: '04', start: 41.1, end: 53.1, title: 'O exagero' },
  { id: '05', start: 53.1, end: 58.75, title: 'Algo está errado' },
  { id: '06', start: 58.75, end: 78.6, title: 'O confronto' },
  { id: '07', start: 78.6, end: CLONES_DURATION, title: 'A revelação final' },
] as const;

/** Spoken-word anchors from word-level transcription of the placed narration. */
export const T = {
  firstCopy: 10.93, hair: 13.0, clothes: 14.27, face: 15.35,
  power: 16.88, perfect: 21.2, spawn2: 22.0, swipe: 24.36, ready: 25.48, spawn3: 26.58,
  study: 29.9, chores: 31.02, free: 32.1, tidy: 34.4, homework: 35.26, lazy: 36.04,
  overdo: 41.23, crowd: 42.95, cook: 46.53, game: 47.45, guitar: 48.55, sofa: 49.59, chaos: 50.71,
  strange: 53.22, disobey: 57.12, undo: 58.9, same: 61.1, nothing: 62.94,
  lucasLine: 66.2, copyLine: 68.75, think: 69.99, feel: 70.73, realize: 73.6,
  approach: 78.8, eyes: 82.26, question: 85.6, questionEnd: 88.59, frozen: 89.8, who: 93.1, real: 95.02, fade: 96.6,
} as const;

/** Spoken dialogue spans (for the talking mouth). */
export const LINES = {
  lucas: [[66.2, 68.2]],
  copy: [[68.75, 73.2], [85.6, 88.5]],
} as const;

export const CLONES_CUES: ReadonlyArray<{ t: number; type: string }> = cues;

export function getClonesFrame(t: number) {
  const time = clamp(t, 0, CLONES_DURATION);
  const index = CLONES_SCENES.findIndex(s => time < s.end);
  const scene = CLONES_SCENES[index < 0 ? CLONES_SCENES.length - 1 : index] ?? CLONES_SCENES[0];
  return { t: time, scene, n: Number(scene.id), local: time - scene.start };
}

/** Mouth opening while a character is speaking one of its lines. */
export function talkAmount(t: number, who: keyof typeof LINES) {
  const on = LINES[who].some(([a, b]) => t >= a && t <= b);
  return on ? Math.abs(Math.sin(t * 15)) * .8 + Math.abs(Math.sin(t * 6.3)) * .2 : 0;
}

/** Spawn progress: 0 before, eases to 1 over `dur` seconds. */
export const appearAt = (t: number, at: number, dur = .55) => clamp((t - at) / dur);
