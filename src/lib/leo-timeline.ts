export const TEST_DURATION = 12;
export const TEST_SCENES = [
  { id: '01', start: 0, end: 4, title: 'E se o tempo parasse?', line: 'E se tu pudesse parar o tempo por 10 segundos?' },
  { id: '02', start: 4, end: 9, title: 'Só Léo se move', line: 'Tipo… tudo ao teu redor congelasse, mas tu continuasse se mexendo normalmente.' },
  { id: '05', start: 9, end: 12, title: 'E PÁ! Tudo congelou.', line: 'E PÁ! Tudo congelou.' },
] as const;

export function getFrame(time: number) {
  const t = Math.max(0, Math.min(TEST_DURATION, time));
  const scene = t < 4 ? TEST_SCENES[0] : t < 9 ? TEST_SCENES[1] : TEST_SCENES[2];
  const frozen = (t >= 4 && t < 9) || t >= 10;
  const worldTime = t < 4 ? t : t < 9 ? 4 : t < 10 ? t - 5 : 5;
  const walk = scene.id === '02';
  const impact = t >= 10 && t < 10.65 ? 1 - (t - 10) / 0.65 : 0;
  return { time: t, scene, frozen, worldTime, walk, impact, localTime: t - scene.start };
}