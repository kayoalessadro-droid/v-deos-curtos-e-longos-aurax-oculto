import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeleportScene } from '@/components/animation/teleport-scene';
import mix from '@/assets/audio/teleporte-mix.m4a.asset.json';
import { getTpFrame, TP_DURATION, TP_SCENES } from '@/lib/teleport-timeline';

export const Route = createFileRoute('/teleporte')({
  head: () => ({ meta: [
    { title: 'Teletransporte | Aurax Oculto — revisão' },
    { name: 'description', content: 'Animação 2D vertical: e se você pudesse se teletransportar para qualquer lugar?' },
    { property: 'og:title', content: 'Teletransporte | Aurax Oculto' },
    { property: 'og:description', content: 'Um jovem descobre que pode sumir e surgir em outro lugar — até não conseguir voltar.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Teleporte,
});

function Teleporte() {
  const [time, setTime] = useState(0), [playing, setPlaying] = useState(false), [renderOnly, setRenderOnly] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    setRenderOnly(new URLSearchParams(window.location.search).has('render'));
    const render = (e: Event) => { if (e instanceof CustomEvent && typeof e.detail === 'number') flushSync(() => setTime(e.detail)); };
    window.addEventListener('leo-render-frame', render);
    return () => window.removeEventListener('leo-render-frame', render);
  }, []);
  useEffect(() => { if (!playing) return; let h = 0; const tick = () => { if (audio.current) setTime(audio.current.currentTime); h = requestAnimationFrame(tick); }; h = requestAnimationFrame(tick); return () => cancelAnimationFrame(h); }, [playing]);
  const f = getTpFrame(time);
  return <main className={`review-app ${renderOnly ? 'render-only' : ''}`}>
    <audio ref={audio} src={mix.url} preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
    <div className="review-layout"><section className="preview-column">
      <div className="preview-heading"><span>TELETRANSPORTE · CENA {f.scene.id} · {f.scene.title}</span><span>9:16 / 2D</span></div>
      <div className="player"><TeleportScene time={time}/></div>
      <div className="playback"><div className="playback-row">
        <Button variant="ghost" size="icon" aria-label={playing ? 'Pausar' : 'Reproduzir'} onClick={() => playing ? audio.current?.pause() : void audio.current?.play()}>{playing ? <Pause/> : <Play/>}</Button>
        <span className="timecode">{time.toFixed(1)} s <span>/ {TP_DURATION} s</span></span>
      </div>
      <input className="timeline-range" type="range" aria-label="Posição" min="0" max={TP_DURATION} step="0.01" value={time} onChange={e => { const t = Number(e.target.value); setTime(t); if (audio.current) audio.current.currentTime = t; }}/>
      <div className="timeline-labels">{TP_SCENES.map(s => <span key={s.id}>{s.id}</span>)}</div></div>
    </section></div>
  </main>;
}
