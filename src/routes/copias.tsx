import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClonesScene } from '@/components/animation/clones-scene';
import mix from '@/assets/audio/clones-mix.m4a.asset.json';
import { getClonesFrame, CLONES_DURATION, CLONES_SCENES } from '@/lib/clones-timeline';

export const Route = createFileRoute('/copias')({
  head: () => ({ meta: [
    { title: 'Lucas — cópias de si mesmo | Aurax Oculto' },
    { name: 'description', content: 'Animação 2D: Lucas descobre que pode criar cópias perfeitas de si mesmo, até uma delas parar de obedecer.' },
    { property: 'og:title', content: 'E se você pudesse criar cópias de si mesmo?' },
    { property: 'og:description', content: 'Lucas cria cópias idênticas de si mesmo, até que uma delas pergunta: e se você for a cópia?' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: CopiasPage,
});

function CopiasPage() {
  const [time, setTime] = useState(0), [playing, setPlaying] = useState(false), [renderOnly, setRenderOnly] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setRenderOnly(new URLSearchParams(window.location.search).has('render'));
    const render = (e: Event) => { if (e instanceof CustomEvent && typeof e.detail === 'number') { const t = e.detail; flushSync(() => setTime(t)); } };
    window.addEventListener('leo-render-frame', render);
    return () => window.removeEventListener('leo-render-frame', render);
  }, []);
  useEffect(() => { if (!playing) return; let h = 0; const tick = () => { if (audio.current) setTime(audio.current.currentTime); h = requestAnimationFrame(tick); }; h = requestAnimationFrame(tick); return () => cancelAnimationFrame(h); }, [playing]);
  const f = getClonesFrame(time);
  return <main className={`review-app ${renderOnly ? 'render-only' : ''}`}>
    <audio ref={audio} src={mix.url} preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    <div className="review-layout"><section className="preview-column">
      <div className="preview-heading"><span>LUCAS · CENA {f.scene.id} · {f.scene.title}</span><span>9:16 / 2D</span></div>
      <div className="player"><ClonesScene time={time}/></div>
      <div className="playback"><div className="playback-row">
        <Button variant="ghost" size="icon" aria-label={playing ? 'Pausar' : 'Reproduzir'} onClick={() => playing ? audio.current?.pause() : void audio.current?.play()}>{playing ? <Pause/> : <Play/>}</Button>
        <span className="timecode">{time.toFixed(1)} s <span>/ {CLONES_DURATION} s</span></span>
      </div>
      <input className="timeline-range" type="range" aria-label="Posição" min="0" max={CLONES_DURATION} step="0.01" value={time} onChange={e => { const t = Number(e.target.value); setTime(t); if (audio.current) audio.current.currentTime = t; }}/>
      <div className="timeline-labels">{CLONES_SCENES.map(s => <span key={s.id}>{s.id}</span>)}</div></div>
    </section></div>
  </main>;
}
