import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Scan, UserRound, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimationScene } from '@/components/animation/scene';
import { getFrame, TEST_DURATION, TEST_SCENES } from '@/lib/leo-timeline';

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Léo — teste de animação 2D' },
    { name: 'description', content: 'Prévia das cenas 01, 02 e 05 da história de Léo e os dez segundos.' },
    { property: 'og:title', content: 'Léo — teste de animação 2D' },
    { property: 'og:description', content: 'Léo, um mundo congelado e um teste de animação vetorial.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [model, setModel] = useState(false);
  const player = useRef<HTMLDivElement>(null);
  const frame = getFrame(time);
  useEffect(() => {
    setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  useEffect(() => {
    if (!playing) return;
    let handle = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      setTime(t => (t + elapsed) % TEST_DURATION);
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [playing]);
  const selectScene = (start: number) => { setModel(false); setTime(start); };
  const changeScene = (direction: number) => {
    const i = TEST_SCENES.findIndex(s => s.id === frame.scene.id);
    const next = TEST_SCENES[(i + direction + TEST_SCENES.length) % TEST_SCENES.length];
    if (next) selectScene(next.start);
  };
  return <main className="review-app">
    <header className="review-header">
      <a href="/" className="wordmark">LÉO<span className="wordmark-dot">.</span><span className="wordmark-divider"/><span className="wordmark-label">10 SEGUNDOS</span></a>
      <span className="draft-status"><span/>TESTE 01</span>
    </header>
    <div className="review-layout">
      <section className="preview-column">
        <div className="preview-heading"><span>PRÉVIA DE ANIMAÇÃO</span><span>9:16 <span className="heading-divider">/</span> 2D</span></div>
        <div className="player" ref={player}>
          <AnimationScene time={time} model={model}/>
          <div className="player-corner"><span>{model ? 'LÉO / MODELO' : `CENA ${frame.scene.id}`}</span><VolumeX size={15} aria-label="Sem áudio"/></div>
        </div>
        <div className="playback">
          <div className="playback-row">
            <Button variant="ghost" size="icon" title={playing ? 'Pausar' : 'Reproduzir'} aria-label={playing ? 'Pausar' : 'Reproduzir'} onClick={() => setPlaying(!playing)}>{playing ? <Pause/> : <Play/>}</Button>
            <Button variant="ghost" size="icon" title="Reiniciar" aria-label="Reiniciar" onClick={() => { setTime(0); setPlaying(true); }}><RotateCcw/></Button>
            <span className="timecode">00:{Math.floor(time).toString().padStart(2, '0')} <span>/ 00:12</span></span>
            <Button className="fullscreen-button" variant="ghost" size="icon" title="Tela cheia" aria-label="Tela cheia" onClick={() => { if (player.current && !document.fullscreenElement) player.current.requestFullscreen?.(); else document.exitFullscreen?.(); }}><Scan/></Button>
          </div>
          <input className="timeline-range" type="range" aria-label="Posição da animação" min="0" max="11.99" step="0.01" value={time} onChange={e => { setTime(Number(e.target.value)); setPlaying(false); }}/>
          <div className="timeline-labels"><span>01 · IDEIA</span><span>02 · CONGELAMENTO</span><span>05 · IMPACTO</span></div>
        </div>
      </section>
      <aside className="review-sidebar">
        <div className="sidebar-intro"><p className="eyebrow">LÉO & O TEMPO</p><h1>Dez segundos.<br/>Um mundo parado.</h1><div className="intro-meta"><span>ETAPA 01</span><span>3 CENAS</span><span>12 S</span></div></div>
        <div className="view-switch" role="group" aria-label="Visualização">
          <Button variant={!model ? 'default' : 'ghost'} onClick={() => setModel(false)}><Play/>Animação</Button>
          <Button variant={model ? 'default' : 'ghost'} onClick={() => setModel(true)}><UserRound/>Personagem</Button>
        </div>
        <div className="scene-list">
          <div className="section-label">CENAS EM TESTE<span>01 / 02 / 05</span></div>
          {TEST_SCENES.map(scene => <Button key={scene.id} variant="ghost" className={`scene-button ${!model && frame.scene.id === scene.id ? 'active' : ''}`} onClick={() => selectScene(scene.start)} aria-label={`Ver cena ${scene.id}`}><span className="scene-number">{scene.id}</span><span className="scene-description"><strong>{scene.title}</strong><small>{scene.end - scene.start} segundos</small></span><ArrowRight/></Button>)}
        </div>
        <div className="narration-excerpt"><span className="section-label">{model ? 'PERSONAGEM' : `ROTEIRO · CENA ${frame.scene.id}`}</span><p>{model ? 'Léo' : `“${frame.scene.line}”`}</p>{model && <div className="character-swatches"><span className="swatch hair" title="Cabelo preto"/><span className="swatch shirt" title="Camiseta verde"/><span className="swatch pants" title="Calça grafite"/><span className="swatch bag" title="Mochila coral"/></div>}</div>
        <div className="review-footer"><VolumeX size={15}/><span>Teste silencioso · narração preservada</span></div>
        <div className="scene-navigation"><Button variant="ghost" size="icon" aria-label="Cena anterior" title="Cena anterior" onClick={() => changeScene(-1)}><ArrowLeft/></Button><span>{model ? 'MODELO 01' : `CENA ${frame.scene.id}`}</span><Button variant="ghost" size="icon" aria-label="Próxima cena" title="Próxima cena" onClick={() => changeScene(1)}><ArrowRight/></Button></div>
      </aside>
    </div>
  </main>;
}
