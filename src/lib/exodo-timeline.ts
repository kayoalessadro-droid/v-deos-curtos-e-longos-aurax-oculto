// Miguel & Bia — "E se a humanidade precisasse abandonar a Terra?". Times are seconds in the assembled narration (exodo-mix).
import cues from './exodo-cues.json';
export { clamp, ease, ramp, lin } from './enzo-timeline';
import { clamp } from './enzo-timeline';

export const EXODO_DURATION = 92;
export const EXODO_SCENES = [
  { id: '01', start: 0, end: 13.85, title: 'A descoberta' },
  { id: '02', start: 13.85, end: 28.1, title: 'A evacuação' },
  { id: '03', start: 28.1, end: 42.95, title: 'A partida' },
  { id: '04', start: 42.95, end: 60.6, title: 'A busca' },
  { id: '05', start: 60.6, end: EXODO_DURATION, title: 'A revelação final' },
] as const;

/** Spoken-word anchors from word-level transcription of the placed narration. */
export const T = {
  started: 3.08, orange: 4.58, drought: 5.6, news: 7.94, years: 9.96, alive: 13.12,
  sirens: 14.26, miguel: 15.5, door: 16.26, back: 18.14, bia: 19.94, sprout: 22.04, yard: 23.3, outside: 24.0, ships: 24.84, survivors: 27.14,
  engines: 28.46, ground: 30.14, ship: 31.52, tore: 31.92, window: 33.7, small: 35.62, smaller: 37.1, dot: 38.96, biaHand: 40.42, glass: 41.48, silence: 42.2,
  years2: 43.38, sprout2: 45.16, tree: 46.04, finally: 47.8, planet: 48.64, appeared: 49.18, green: 50.46, forests: 52.72, falls: 54.12, moons: 55.86, smile: 59.78,
  but: 60.76, scanner: 61.16, trees: 64.02, ruins: 64.98, cities: 65.88, oldShip: 67.64, wall: 69.14, people: 70.86, fleeing: 71.1, blueDot: 73.34, earth: 74.64,
  home: 77.7, returned: 78.88, began: 80.86, repeats: 82.16, learn: 85.3, comment: 85.8, follow: 87.02, voiceEnd: 89.3, fade: 90.2,
} as const;

/** Shot boundaries: every cut in the film, used by the scene renderer and the sound mix. */
export const EXODO_SHOTS = [
  0, 4.4, 5.45, 7.0, 10.0, 13.85, 15.4, 18.8, 21.85, 23.95, 28.1, 31.4, 33.6, 40.15, 42.95, 45.0, 47.6, 52.6, 56.95,
  60.6, 64.9, 67.4, 69.0, 73.2, 75.5, 81.7, 85.75, EXODO_DURATION,
] as const;

export const EXODO_CUES: ReadonlyArray<{ t: number; type: string }> = cues;

export function getExodoFrame(t: number) {
  const time = clamp(t, 0, EXODO_DURATION);
  const index = EXODO_SCENES.findIndex(s => time < s.end);
  const scene = EXODO_SCENES[index < 0 ? EXODO_SCENES.length - 1 : index] ?? EXODO_SCENES[0];
  let shot = EXODO_SHOTS.findIndex((s, i) => time >= s && time < (EXODO_SHOTS[i + 1] ?? Infinity));
  if (shot < 0 || shot >= EXODO_SHOTS.length - 1) shot = EXODO_SHOTS.length - 2;
  const shotStart = EXODO_SHOTS[shot] ?? 0, shotEnd = EXODO_SHOTS[shot + 1] ?? EXODO_DURATION;
  return { t: time, scene, n: Number(scene.id), shot, local: time - shotStart, p: (time - shotStart) / (shotEnd - shotStart) };
}

/** Radius of the Earth seen through the cabin window: big at lift-off, a single blue dot when the narration says "pontinho azul". */
export function earthInWindow(t: number) {
  const k = [[33.6, 230], [T.small, 120], [T.smaller, 42], [T.dot, 5], [40.15, 3.5]] as const;
  if (t <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++) {
    const a = k[i - 1], b = k[i];
    if (a && b && t <= b[0]) { const u = (t - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * u * u * (3 - 2 * u); }
  }
  return k[k.length - 1]?.[1] ?? 3.5;
}

/** Height of Bia's seedling (0 = tiny sprout from the yard, 1 = little tree): it grows during the years of travel. */
export function sproutGrowth(t: number) {
  if (t < 45.0) return 0;
  if (t < T.tree + .6) return clamp((t - 45.0) / (T.tree + .6 - 45.0));
  return 1;
}
