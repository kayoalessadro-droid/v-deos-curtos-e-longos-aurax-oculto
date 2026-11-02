// Timeline for "E se você pudesse se teletransportar?" — keyed to the mixed audio track.
export const TP_DURATION = 89.5;
export const TP_CUT = 88;
export const TP_SCENES = [
  { id: '01', start: 0, end: 10.5, title: 'A descoberta' },
  { id: '02', start: 10.5, end: 24, title: 'O primeiro teste' },
  { id: '03', start: 24, end: 37, title: 'A diversão' },
  { id: '04', start: 37, end: 47.5, title: 'Excesso de confiança' },
  { id: '05', start: 47.5, end: 62, title: 'Algo dá errado' },
  { id: '06', start: 62, end: 74.5, title: 'A tentativa de voltar' },
  { id: '07', start: 74.5, end: 89.5, title: 'O suspense final' },
] as const;

// Narration placement: [original start, original end, placed start] per spoken scene.
export const NARRATION_PLACEMENT = [
  [0, 6.64, 1.0], [7.42, 16.68, 11.5], [17.62, 26.5, 25.0], [27.18, 33.84, 38.0],
  [35.16, 45.46, 48.5], [46.8, 54.9, 63.0], [55.9, 65.9, 75.5],
] as const;

const RAW_CAPTIONS: [number, number, string][] = [
  [0, 3.4, 'E se você pudesse desaparecer de um lugar'], [3.4, 6.64, 'e surgir em outro em apenas um segundo?'],
  [7.42, 10.76, 'No começo, ele achou que estava imaginando coisas.'], [11.26, 13.8, 'Mas, quando tentou novamente,'], [13.8, 16.68, 'percebeu que realmente podia fazer isso.'],
  [17.62, 20.6, 'Em poucos minutos, ele descobriu'], [20.6, 23.64, 'que podia atravessar distâncias sem dar um único passo.'], [24.2, 26.5, 'Para ele, parecia o poder perfeito.'],
  [27.18, 29.84, 'Mas a curiosidade falou mais alto.'], [30.4, 33.84, 'Ele decidiu tentar algo que nunca havia feito antes.'],
  [35.16, 38.66, 'Dessa vez, alguma coisa deu errado.'], [39.22, 41.96, 'Ele chegou a um lugar que não reconhecia'], [42.16, 45.46, 'e percebeu que não tinha controle total sobre o próprio poder.'],
  [46.8, 48.92, 'Ele tentou voltar imediatamente.'], [49.5, 52.2, 'Mas, quanto mais tentava,'], [52.2, 54.9, 'mais difícil parecia encontrar o caminho de volta.'],
  [55.9, 58.9, 'Foi então que percebeu a verdadeira pergunta:'], [59.9, 62.9, 'se podia desaparecer de qualquer lugar...'], [63.4, 65.9, 'será que conseguiria voltar para casa?'],
];
export const placeTime = (t: number) => {
  const p = NARRATION_PLACEMENT.find(([a, b]) => t >= a - 0.01 && t <= b + 0.01) ?? NARRATION_PLACEMENT[0];
  return t - p[0] + p[2];
};
export const CAPTIONS = RAW_CAPTIONS.map(([a, b, text]) => ({ start: placeTime(a), end: placeTime(b) + 0.25, text }));

export function wrapCaption(text: string, max = 20) {
  const lines: string[] = [];
  for (const w of text.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && (last + ' ' + w).length <= max) lines[lines.length - 1] = last + ' ' + w;
    else lines.push(w);
  }
  return lines;
}

// Teleport hops: at time t the hero vanishes from the previous spot and appears at x (y offset optional).
type Hop = { t: number; x: number; y?: number; dir?: 1 | -1; fail?: boolean };
const HOPS: Hop[] = [
  { t: 4.3, x: 330, dir: 1 },
  { t: 14.2, x: 70, dir: -1 }, { t: 17.6, x: 320, dir: 1 }, { t: 21.2, x: 190, dir: -1 },
  { t: 25.6, x: 40, dir: 1 }, { t: 27.0, x: 360, y: -150, dir: -1 }, { t: 28.4, x: 150, dir: 1 }, { t: 29.8, x: 320, dir: -1 },
  { t: 31.2, x: 60, y: -150, dir: 1 }, { t: 32.6, x: 260, dir: -1 }, { t: 34.2, x: 170, dir: 1 },
  { t: 46.8, x: -400, dir: 1 },
  { t: 50.2, x: 170, dir: 1 },
  { t: 65.2, x: 185, dir: 1, fail: true }, { t: 68.6, x: 150, dir: -1, fail: true }, { t: 72.0, x: 175, dir: 1, fail: true },
];
const HOP_HALF = 0.22;

export function getTpFrame(time: number) {
  const t = Math.max(0, Math.min(TP_DURATION, time));
  const scene = TP_SCENES.find(s => t >= s.start && t < s.end) ?? TP_SCENES[6];
  const n = Number(scene.id);
  const local = t - scene.start;
  let x = 40, y = 0, dir: 1 | -1 = 1;
  for (const h of HOPS) if (t >= h.t) { x = h.x; y = h.y ?? 0; dir = h.dir ?? dir; }
  let walking = false;
  if (t < 4.3) { x = 40 + Math.min(t, 4.08) * 27; walking = t < 4.08; }
  if (n === 1 && t > 5.6 && t < 8.6) dir = -1; // looks back
  if (n === 2 && local < 3.7) dir = 1;
  // vanish/appear amount 0..1 (1 = fully visible)
  let vis = 1, ring: { x: number; y: number; p: number; fail: boolean }[] = [];
  for (let i = 0; i < HOPS.length; i++) {
    const h = HOPS[i]!; const prev = i === 0 ? { x: 40 + 4.08 * 27, y: 0 } : { x: HOPS[i - 1]!.x, y: HOPS[i - 1]!.y ?? 0 };
    const d = t - h.t;
    if (d > -HOP_HALF && d < 0) vis = Math.min(vis, -d / HOP_HALF);
    if (d >= 0 && d < HOP_HALF) vis = Math.min(vis, d / HOP_HALF);
    if (d > -HOP_HALF && d < 0.6) {
      const p = (d + HOP_HALF) / (0.6 + HOP_HALF);
      ring.push({ x: prev.x, y: prev.y, p, fail: !!h.fail });
      if (d >= 0) ring.push({ x: h.x, y: h.y ?? 0, p: d / 0.6, fail: !!h.fail });
    }
  }
  if (n === 4 && local > 9.3) vis = Math.max(0, 1 - (local - 9.3) / 0.22);
  if (n === 5 && local < 2.7) vis = 0;
  const flash = n === 5 && local < 1.0 ? 1 - local : 0;
  const expression: 'curious' | 'happy' | 'surprised' | 'worried' =
    n === 1 ? (t < 4.3 ? 'happy' : 'surprised') : n === 2 ? (local < 6 ? 'surprised' : 'happy') : n === 3 ? 'happy' :
    n === 4 ? 'curious' : n === 5 ? (local < 7 ? 'curious' : 'worried') : 'worried';
  const aura = n === 4 && local > 5 ? (local - 5) / 4.3 : n === 6 ? Math.max(0, Math.sin(local * 1.1)) * 0.6 : n === 7 ? Math.min(1, local / 13.5) : 0;
  return { t, scene, n, local, x, y, dir, walking, vis, ring, flash, expression, aura, black: t >= TP_CUT };
}
