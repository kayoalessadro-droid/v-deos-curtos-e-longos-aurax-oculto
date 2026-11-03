// Enzo — "E se tudo o que você tocasse congelasse?". Times are seconds in the assembled narration (enzo-mix).
import cues from './enzo-cues.json';

export const ENZO_DURATION = 100.5;
export const ENZO_SCENES = [
  { id: '01', start: 0, end: 12.4, title: 'Gancho' },
  { id: '02', start: 12.4, end: 26.5, title: 'A descoberta' },
  { id: '03', start: 26.5, end: 40.55, title: 'Testando o poder' },
  { id: '04', start: 40.55, end: 53.45, title: 'O poder aumenta' },
  { id: '05', start: 53.45, end: 66.6, title: 'O acidente' },
  { id: '06', start: 66.6, end: 79.6, title: 'Desespero' },
  { id: '07', start: 79.6, end: ENZO_DURATION, title: 'Final com suspense' },
] as const;

/** Spoken-word anchors (from word-level transcription of the narration). */
export const T = {
  railTouch: 7.12, glassTouch: 18.45, spoon: 23.48, apple: 24.36, plant: 29.9, knob: 33.18, floor: 36.1, crack: 38.0,
  bench: 45.76, stop: 50.46, flee: 51.5, friendArrive: 58.7, grab: 59.46, sleeve: 61.4, floor2: 63.2, backAway: 64.9,
  help: 66.84, spread: 69.1, wide: 70.6, hands: 74.44, crystals: 76.6, night: 79.6, reach: 83.26, mugFreeze: 89.9,
  worse: 91.64, evolve: 94.28, finalShot: 95.6, fade: 98.2,
} as const;

export const ENZO_CUES: ReadonlyArray<{ t: number; type: string }> = cues;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ease = (v: number) => { const x = clamp(v); return x * x * (3 - 2 * x); };
export const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const lin = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

export function getEnzoFrame(t: number) {
  const time = clamp(t, 0, ENZO_DURATION);
  const index = ENZO_SCENES.findIndex(s => time < s.end);
  const scene = ENZO_SCENES[index < 0 ? ENZO_SCENES.length - 1 : index] ?? ENZO_SCENES[0];
  return { t: time, scene, n: Number(scene.id), local: time - scene.start };
}

/** World position of the rig's front hand for a given arm angle (matches Leo rig pivots). */
export function handPos(angle: number, tx: number, ty: number, s: number, flip = false) {
  const r = angle * Math.PI / 180;
  const hx = 115 + 45 * Math.cos(r) - 50 * Math.sin(r), hy = 145 + 45 * Math.sin(r) + 50 * Math.cos(r);
  return { x: flip ? tx + s * 180 - s * hx : tx + s * hx, y: ty + s * hy };
}
