import { generateSpeech } from "@lovable.dev/ai-gateway";
import { mkdirSync, writeFileSync } from "node:fs";

const STYLE = "Narre em português brasileiro, como um contador de histórias jovem, natural e envolvente, falando com um amigo: ritmo ágil e dinâmico, sem pausas longas, com emoção, suspense crescente e um tom cinematográfico, dando ênfase às palavras importantes. Texto: ";
const SCENES: Record<string, string> = {
  s1: "E se a humanidade precisasse abandonar a Terra? Começou devagar: um céu mais laranja, uma seca que não acabava. Até que veio a notícia que ninguém queria ouvir... em poucos anos, a Terra não ia mais conseguir manter a gente vivo.",
  s2: "Quando as sirenes tocaram, o Miguel trancou a porta de casa sem saber se um dia ia voltar. A irmã dele, a Bia, levou só uma coisa: uma mudinha de árvore do quintal. Lá fora, naves gigantes esperavam milhares de sobreviventes.",
  s3: "Os motores acordaram, o chão tremeu, e a nave rasgou o céu. Pela janela, a Terra foi ficando pequena... cada vez menor... até virar só um pontinho azul. A Bia encostou a mão no vidro, em silêncio.",
  s4: "Foram anos de viagem. A mudinha virou uma arvorezinha. Até que, finalmente, um planeta apareceu: verde, com água, com ar. Florestas que brilhavam, cachoeiras enormes, duas luas no céu. Pela primeira vez, todo mundo sorriu.",
  s5: "Mas o scanner da nave encontrou alguma coisa embaixo das árvores: ruínas. Cidades inteiras... e uma nave antiga. Na parede, um desenho mostrava um povo fugindo do próprio planeta, rumo a um pontinho azul. A Terra. A gente não tinha encontrado um novo lar. A gente tinha voltado pro planeta de onde tudo começou. E se a história se repete... será que dessa vez a gente vai aprender? Comenta aí, e segue o Aurax Oculto pra próxima história.",
};
mkdirSync("raw", { recursive: true });
const only = process.argv.slice(2);
await Promise.all(Object.entries(SCENES).filter(([id]) => !only.length || only.includes(id)).map(async ([id, text]) => {
  const res = await generateSpeech({
    model: "google/gemini-3.1-flash-tts-preview",
    contents: [{ role: "user", parts: [{ text: STYLE + text }] }],
    generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } } },
  } as never);
  const buf = Buffer.from(await (await res.blob()).arrayBuffer());
  writeFileSync(`raw/${id}.bin`, buf);
  console.log(id, res.contentType, buf.length);
}));
