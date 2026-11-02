export const DURATION = 83.128095;
export const SCENES = [
  {"id": "01", "start": 0, "end": 3.32, "title": "E se…", "line": "E se tu pudesse parar o tempo por 10 segundos?"},
  {"id": "02", "start": 3.32, "end": 8.58, "title": "Só Léo se move", "line": "Tipo… tudo ao teu redor congelasse, mas tu continuasse se mexendo normalmente."},
  {"id": "03", "start": 8.58, "end": 14.92, "title": "Atrasado pra faculdade", "line": "O Léo descobriu que conseguia fazer isso numa situação bem comum: tentando não se atrasar pra faculdade."},
  {"id": "04", "start": 14.92, "end": 21.1, "title": "A ideia", "line": "Ele tava correndo pra pegar o ônibus quando pensou: “Mano, se o tempo parasse agora, eu chegava tranquilo.”"},
  {"id": "05", "start": 21.1, "end": 23.42, "title": "E PÁ!", "line": "E PÁ! Tudo congelou."},
  {"id": "06", "start": 23.42, "end": 28.9, "title": "O mundo congelado", "line": "O ônibus ficou parado, as pessoas viraram estátuas e até uma gota de chuva ficou suspensa no ar."},
  {"id": "07", "start": 28.9, "end": 35, "title": "Dentro do ônibus", "line": "O Léo achou aquilo incrível. Atravessou a rua, entrou no ônibus e sentou, todo satisfeito."},
  {"id": "08", "start": 35, "end": 40.4, "title": "O limite", "line": "Só que tinha um detalhe: ele não conseguia parar o tempo por mais de 10 segundos."},
  {"id": "09", "start": 40.4, "end": 46.3, "title": "O retrovisor", "line": "Quando tudo voltou ao normal… o motorista olhou pelo retrovisor e viu um cara sentado ali do nada."},
  {"id": "10", "start": 46.3, "end": 49.78, "title": "Mas calma…", "line": "Mas calma. O problema de verdade nem era esse."},
  {"id": "11", "start": 49.78, "end": 53.24, "title": "E o ar?", "line": "Se o mundo inteiro parasse, o ar também pararia?"},
  {"id": "12", "start": 53.24, "end": 54.28, "title": "Respirar?", "line": "Tu conseguiria respirar?"},
  {"id": "13", "start": 54.28, "end": 56.54, "title": "E a luz?", "line": "E a luz continuaria chegando aos teus olhos?"},
  {"id": "14", "start": 56.54, "end": 63.04, "title": "Um problemão?", "line": "Porque, dependendo de como esse poder funcionasse, enxergar e respirar poderiam virar um problemão."},
  {"id": "15", "start": 63.04, "end": 69.06, "title": "Mais sono", "line": "Aí o Léo teve uma ideia genial: usar os 10 segundos pra roubar uns minutos de sono."},
  {"id": "16", "start": 69.06, "end": 71.36, "title": "Esqueceu uma coisa", "line": "Só que ele esqueceu de uma coisa…"},
  {"id": "17", "start": 71.36, "end": 73.88, "title": "O tempo volta", "line": "O tempo sempre voltava a correr."},
  {"id": "18", "start": 73.88, "end": 77, "title": "A prova", "line": "E na primeira vez que ele tentou usar o poder durante uma prova…"},
  {"id": "19", "start": 77, "end": 79.88, "title": "Algo está errado", "line": "descobriu que tinha um problema muito maior."},
  {"id": "20", "start": 79.88, "end": 83.128095, "title": "O mistério", "line": "E esse problema? Tu não ia querer descobrir na hora."},
] as const;

export const IMPACT_TIME = 21.78;
export const IMPACT_CENTER = { x: 420, y: 350, radius: 68 };
export function getFrame(time: number) {
 const t = Math.max(0, Math.min(DURATION, time));
 const scene = SCENES.find(s => t >= s.start && t < s.end) ?? SCENES[19];
 const n = Number(scene.id);
 const localTime = t - scene.start;
 const progress = localTime / (scene.end - scene.start);
 const frozen = n === 2 || (t >= IMPACT_TIME && n <= 8) || (n >= 11 && n <= 14 && localTime >= 1.2) || n === 16 || (n >= 18 && t >= 75.42);
 const worldTime = frozen ? (n === 2 ? 3 : n <= 8 ? 2 : 1.2) : n === 9 ? localTime + 2 : n === 17 ? localTime : localTime;
 const walk = n === 2 || n === 3 || (n === 4 && t < 17.74) || (n === 7 && t < 33.34);
 const leoX = n === 2 ? 45 + progress * 255 : n === 3 || n === 4 ? 120 + progress * 110 : n === 7 ? 40 + Math.min(1, localTime / 4.44) * 240 : 171;
 const impact = t >= IMPACT_TIME && t < IMPACT_TIME + 0.6 ? 1 - (t - IMPACT_TIME) / 0.6 : 0;
 return { time: t, scene, n, localTime, progress, frozen, worldTime, walk, leoX, impact };
}
