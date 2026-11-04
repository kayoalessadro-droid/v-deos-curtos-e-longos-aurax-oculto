// Théo — "E se todo o gelo da Terra derretesse?". Times are seconds in the assembled narration (gelo-mix).
import cues from './gelo-cues.json';
export { clamp, ease, ramp, lin } from './enzo-timeline';
import { clamp } from './enzo-timeline';

export const GELO_DURATION = 92.5;
export const GELO_SCENES = [
  { id: '01', start: 0, end: 14.6, title: 'O começo' },
  { id: '02', start: 14.6, end: 34.6, title: 'A transformação' },
  { id: '03', start: 34.6, end: 56.0, title: 'As cidades' },
  { id: '04', start: 56.0, end: 71.7, title: 'O novo planeta' },
  { id: '05', start: 71.7, end: GELO_DURATION, title: 'O final' },
] as const;

/** Spoken-word anchors from word-level transcription of the placed narration. */
export const T = {
  melt: 2.66, piece: 3.5, all: 4.62, antarctica: 5.8, thick: 8.04, crack: 11.08, wall: 12.6, collapse: 13.98,
  day: 14.76, centuries: 17.3, rivers: 19.18, fall: 21.0, rise: 22.6, cm: 24.1, meters: 26.4, final: 28.38, seventy: 29.14,
  building: 31.3, water: 33.6,
  vanish: 34.74, beaches: 39.0, avenues: 40.46, streets: 41.9, surround: 43.56, storms: 44.92,
  rio: 47.42, ny: 48.36, shanghai: 49.38, under: 50.36, people: 52.96,
  theo: 56.08, future: 58.22, hill: 59.64, roads: 62.66, sea: 65.7, realize: 67.4, map: 68.6, gone: 70.18,
  space: 71.86, blue: 75.02, islands: 76.88, restart: 79.16, tellMe: 81.88, future2: 83.6, today: 84.88, follow: 87.26, fade: 90.9,
} as const;

/** Shot boundaries: every cut in the film, used by the scene renderer and the sound mix. */
export const GELO_SHOTS = [
  0, 3.45, 5.75, 9.6, 14.6, 19.1, 22.4, 24.0, 28.3, 34.6, 38.9, 41.85, 44.85, 47.3, 48.3, 49.3, 50.3, 52.9,
  56.0, 59.55, 62.6, 67.3, 69.9, 71.7, 76.8, 81.8, 84.8, GELO_DURATION,
] as const;

export const GELO_CUES: ReadonlyArray<{ t: number; type: string }> = cues;

export function getGeloFrame(t: number) {
  const time = clamp(t, 0, GELO_DURATION);
  const index = GELO_SCENES.findIndex(s => time < s.end);
  const scene = GELO_SCENES[index < 0 ? GELO_SCENES.length - 1 : index] ?? GELO_SCENES[0];
  let shot = GELO_SHOTS.findIndex((s, i) => time >= s && time < (GELO_SHOTS[i + 1] ?? Infinity));
  if (shot < 0 || shot >= GELO_SHOTS.length - 1) shot = GELO_SHOTS.length - 2;
  const shotStart = GELO_SHOTS[shot] ?? 0, shotEnd = GELO_SHOTS[shot + 1] ?? GELO_DURATION;
  return { t: time, scene, n: Number(scene.id), shot, local: time - shotStart, p: (time - shotStart) / (shotEnd - shotStart) };
}

/** Sea level rise in metres implied by the story at time t (0 now, ~70 at the end of the melt). */
export function seaLevel(t: number) {
  if (t < T.day) return 0;
  if (t < T.water) return 70 * Math.pow(clamp((t - T.day) / (T.water - T.day)), 1.6);
  return 70;
}
