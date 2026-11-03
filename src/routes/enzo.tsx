import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnzoScene } from '@/components/animation/enzo-scene';
import mix from '@/assets/audio/enzo-mix.m4a.asset.json';
import { getEnzoFrame, ENZO_DURATION, ENZO_SCENES } from '@/lib/enzo-timeline';

export const Route = createFileRoute('/enzo')({
  head: () => ({ meta: [
    { title: 'Enzo — tudo o que toca congela | Aurax Oculto' },
    { name: 'description', content: 'Animação 2D: Enzo descobre que tudo o que ele toca congela, e o poder está evoluindo.' },
    { property: 'og:title', content: 'E se tudo o que você tocasse congelasse?' },
    { property: 'og:description', content: 'Enzo descobre um poder gelado que ele não consegue controlar.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: EnzoPage,
});

function EnzoPage() {
  const [time, setTime] = useState(0), [playing, setPlaying] = useState(false), [renderOnly, setRenderOnly] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setRenderOnly(new URLSearchParams(window.location.search).has('render'));
    const render = (e: Event) => { if (e instanceof CustomEvent && typeof e.detail === 'number') { const t = e.detail; flushSync(() => setTime(t)); } };
    window.addEventListener('leo-render-frame', render);
    return () => window.removeEventListener('leo-render-frame', render);
  }, []);
  useEffect(() => { if (!playing) return; let h = 0; const tick = () => { if (audio.current) setTime(audio.current.currentTime); h = requestAnimationFrame(tick); }; h = requestAnimationFrame(tick); return () => cancelAnimationFrame(h); }, [playing]);
  const f = getEnzoFrame(time);
  return <main className={`review-app ${renderOnly ? 'render-only' : ''}`}>
    <audio ref={audio} src={mix.url} preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    <div className="review-layout"><section className="preview-column">
      <div className="preview-heading"><span>ENZO · CENA {f.scene.id} · {f.scene.title}</span><span>9:16 / 2D</span></div>
      <div className="player"><EnzoScene time={time}/></div>
      <div className="playback"><div className="playback-row">
        <Button variant="ghost" size="icon" aria-label={playing ? 'Pausar' : 'Reproduzir'} onClick={() => playing ? audio.current?.pause() : void audio.current?.play()}>{playing ? <Pause/> : <Play/>}</Button>
        <span className="timecode">{time.toFixed(1)} s <span>/ {ENZO_DURATION} s</span></span>
      </div>
      <input className="timeline-range" type="range" aria-label="Posição" min="0" max={ENZO_DURATION} step="0.01" value={time} onChange={e => { const t = Number(e.target.value); setTime(t); if (audio.current) audio.current.currentTime = t; }}/>
      <div className="timeline-labels">{ENZO_SCENES.map(s => <span key={s.id}>{s.id}</span>)}</div></div>
    </section></div>
  </main>;
}
