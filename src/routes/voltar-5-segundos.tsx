import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RewindScene } from '@/components/animation/rewind-scene';
import mix from '@/assets/audio/rewind-mix.m4a.asset.json';
import { getRewindFrame, REWIND_DURATION, REWIND_SCENES } from '@/lib/rewind-timeline';

export const Route = createFileRoute('/voltar-5-segundos')({
  head: () => ({ meta: [
    { title: 'E se você pudesse voltar 5 segundos no tempo? | Aurax Oculto' },
    { name: 'description', content: 'Curta 2D: Gabriel descobre que pode voltar cinco segundos no tempo, salva vidas e percebe que alguém observa cada volta.' },
    { property: 'og:title', content: 'E se você pudesse voltar 5 segundos no tempo?' },
    { property: 'og:description', content: 'Cinco segundos para corrigir qualquer erro — e um homem de capa amarela em todas as voltas.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: RewindPage,
});

function RewindPage() {
  const [time, setTime] = useState(0), [playing, setPlaying] = useState(false), [renderOnly, setRenderOnly] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setRenderOnly(new URLSearchParams(window.location.search).has('render'));
    const render = (e: Event) => { if (e instanceof CustomEvent && typeof e.detail === 'number') { const t = e.detail; flushSync(() => setTime(t)); } };
    window.addEventListener('leo-render-frame', render);
    return () => window.removeEventListener('leo-render-frame', render);
  }, []);
  useEffect(() => { if (!playing) return; let h = 0; const tick = () => { if (audio.current) setTime(audio.current.currentTime); h = requestAnimationFrame(tick); }; h = requestAnimationFrame(tick); return () => cancelAnimationFrame(h); }, [playing]);
  const f = getRewindFrame(time);
  return <main className={`review-app ${renderOnly ? 'render-only' : ''}`}>
    <audio ref={audio} src={mix.url} preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    <div className="review-layout"><section className="preview-column">
      <div className="preview-heading"><span>5 SEGUNDOS · CENA {f.scene.id} · {f.scene.title}</span><span>9:16 / 2D</span></div>
      <div className="player"><RewindScene time={time}/></div>
      <div className="playback"><div className="playback-row">
        <Button variant="ghost" size="icon" aria-label={playing ? 'Pausar' : 'Reproduzir'} onClick={() => playing ? audio.current?.pause() : void audio.current?.play()}>{playing ? <Pause/> : <Play/>}</Button>
        <span className="timecode">{time.toFixed(1)} s <span>/ {REWIND_DURATION} s</span></span>
      </div>
      <input className="timeline-range" type="range" aria-label="Posição" min="0" max={REWIND_DURATION} step="0.01" value={time} onChange={e => { const t = Number(e.target.value); setTime(t); if (audio.current) audio.current.currentTime = t; }}/>
      <div className="timeline-labels">{REWIND_SCENES.map(s => <span key={s.id}>{s.id}</span>)}</div></div>
    </section></div>
  </main>;
}
