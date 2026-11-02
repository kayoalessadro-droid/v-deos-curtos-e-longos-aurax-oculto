// Léo — Parte 2. Times are seconds in the assembled narration (voice.wav / leo2-mix).
export const L2_DURATION = 103.68;
export const L2_SCENES = [
  { id: '01', start: 0, end: 13.77, title: 'O problema na prova' },
  { id: '02', start: 13.77, end: 26.95, title: 'O mundo congelado' },
  { id: '03', start: 26.95, end: 40.53, title: 'Uma descoberta inesperada' },
  { id: '04', start: 40.53, end: 55.42, title: 'O tempo volta' },
  { id: '05', start: 55.42, end: 67.4, title: 'Será que ele imaginou?' },
  { id: '06', start: 67.4, end: 82.06, title: 'Alguém mais' },
  { id: '07', start: 82.06, end: 103.68, title: 'A revelação' },
] as const;

export const FREEZE_1 = 14.3, RESUME_1 = 40.65, FREEZE_2 = 58.0, SLOW_START = 82.06, RESUME_2 = 92.75, CUT_BLACK = 101.9;

/** World clock: stops while frozen, creeps back slowly in scene 07, then runs normally. */
export function worldClock(t: number) {
  if (t < FREEZE_1) return t;
  const a = FREEZE_1;
  if (t < RESUME_1) return a;
  const b = a + (Math.min(t, FREEZE_2) - RESUME_1);
  if (t < SLOW_START) return b;
  const d = RESUME_2 - SLOW_START;
  if (t < RESUME_2) { const u = t - SLOW_START; return b + 0.4 * u * u / (2 * d); }
  return b + 0.2 * d + (t - RESUME_2);
}

/** Time-flow rate 0..1 (0 = frozen). */
export function flow(t: number) {
  if (t < FREEZE_1) return 1;
  if (t < RESUME_1) return 0;
  if (t < FREEZE_2) return 1;
  if (t < SLOW_START) return 0;
  if (t < RESUME_2) return Math.min(0.4, (t - SLOW_START) / (RESUME_2 - SLOW_START) * 0.4);
  return 1;
}

const ease = (x: number) => { const c = Math.max(0, Math.min(1, x)); return c * c * (3 - 2 * c); };
export const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));

export function getL2Frame(time: number) {
  const t = Math.max(0, Math.min(L2_DURATION, time));
  const scene = L2_SCENES.find(s => t >= s.start && t < s.end) ?? L2_SCENES[6];
  const n = Number(scene.id);
  const local = t - scene.start;
  const rate = flow(t);
  const world = worldClock(t);
  // shockwaves at freeze / resume moments
  const waves = [FREEZE_1, RESUME_1, FREEZE_2, RESUME_2].map((w, i) => ({ p: (t - w) / 0.9, resume: i % 2 === 1 })).filter(w => w.p >= 0 && w.p < 1);
  const black = t >= CUT_BLACK;
  return { t, scene, n, local, rate, world, frozen: rate === 0, waves, black };
}
