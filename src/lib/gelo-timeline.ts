// Théo — "E se todo o gelo da Terra derretesse?". Times are seconds in the assembled narration (gelo-mix).
import cues from './gelo-cues.json';
export { clamp, ease, ramp, lin } from './enzo-timeline';
import { clamp } from './enzo-timeline';

export const GELO_DURATION = 92.5;
export const GELO_SCENES = [
  { id: '01', start: 0, end: 14.75, title: 'O começo' },
  { id: '02', start: 14.75, end: 34.75, title: 'A transformação' },
  { id: '03', start: 34.75, end: 56.1, title: 'As cidades' },
  { id: '04', start: 56.1, end: 71.85, title: 'O novo planeta' },
  { id: '05', start: 71.85, end: GELO_DURATION, title: 'O final' },
] as const;

/** Spoken-word anchors from word-level transcription of the placed narration. */
export const T = {
  melt: 2.74, piece: 3.72, all: 4.8, antarctica: 5.86, thick: 7.72, crack: 11.28, wall: 12.88, tip: 13.36, collapse: 14.16,
  day: 14.88, centuries: 17.6, rivers: 19.2, fall: 21.22, rise: 22.88, cm: 24.28, meters: 26.36, final: 27.9, seventy: 29.32,
  building: 31.5, water: 33.5,
  vanish: 34.84, beaches: 39.28, avenues: 40.74, streets: 42.04, surround: 43.8, storms: 45.18,
  rio: 47.64, ny: 48.44, shanghai: 49.48, under: 50.72, people: 53.16,
  theo: 56.18, name: 57.88, hill: 59.78, roads: 62.88, sea: 65.98, realize: 67.5, map: 68.9, gone: 70.26,
  space: 71.98, blue: 75.12, islands: 77.06, restart: 79.34, tellMe: 81.94, future2: 83.7, today: 84.94, hoje: 86.64, follow: 87.54, fade: 90.6,
} as const;

/** Shot boundaries: every cut in the film, used by the scene renderer and the sound mix. */
export const GELO_SHOTS = [
  0, 3.6, 5.8, 9.9, 14.75, 19.1, 22.5, 24.15, 27.8, 34.75, 39.15, 42.0, 45.0, 47.5, 48.35, 49.4, 50.5, 53.05,
  56.1, 59.7, 62.75, 67.4, 70.0, 71.85, 76.95, 81.85, 84.85, GELO_DURATION,
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
