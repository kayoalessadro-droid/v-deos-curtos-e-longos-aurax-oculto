import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Download, ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Scan, UserRound, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimationScene } from '@/components/animation/scene';
import { getFrame, DURATION, SCENES } from '@/lib/leo-timeline';
import narration from '@/assets/audio/narracao-leo.mp3.asset.json';
import video from '@/assets/videos/leo-completo.mp4.asset.json';

export const Route = createFileRoute('/')({
 head: () => ({ meta: [
 {title:'Léo — dez segundos | Montagem para aprovação'},
 {name:'description',content:'Animação 2D vertical de Léo em vinte cenas com a narração original aprovada.'},
 {property:'og:title',content:'Léo — dez segundos | Montagem para aprovação'},
 {property:'og:description',content:'Vinte cenas animadas, um mundo congelado e um mistério sem resposta.'},
 {property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},
 ]}), component:Index,
});
const timecode=(t:number)=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
function Index(){
 const [time,setTime]=useState(0),[playing,setPlaying]=useState(false),[model,setModel]=useState(false),[muted,setMuted]=useState(false),[error,setError]=useState(''),[renderOnly,setRenderOnly]=useState(false);
 const audio=useRef<HTMLAudioElement>(null),player=useRef<HTMLDivElement>(null);
 const frame=getFrame(time);
 useEffect(()=>{
  setRenderOnly(new URLSearchParams(window.location.search).has('render'));
  const render=(event:Event)=>{if(event instanceof CustomEvent&&typeof event.detail==='number')flushSync(()=>setTime(event.detail));};
  window.addEventListener('leo-render-frame',render);
  return()=>window.removeEventListener('leo-render-frame',render);
 },[]);
 useEffect(()=>{if(!playing)return;let handle=0;const tick=()=>{const el=audio.current;if(el)setTime(el.currentTime);handle=requestAnimationFrame(tick);};handle=requestAnimationFrame(tick);return()=>cancelAnimationFrame(handle);},[playing]);
 const seek=(t:number)=>{setTime(t);if(audio.current)audio.current.currentTime=t;};
 const play=async()=>{const el=audio.current;if(!el)return;setModel(false);if(el.currentTime>=DURATION-.1)seek(0);try{await el.play();setError('');}catch{setError('Não foi possível tocar o áudio. Tente novamente.');}};
 const toggle=()=>{if(playing)audio.current?.pause();else void play();};
 const selectScene=(start:number)=>{setModel(false);seek(start);};
 const changeScene=(direction:number)=>{const i=SCENES.findIndex(s=>s.id===frame.scene.id),next=SCENES[(i+direction+SCENES.length)%SCENES.length];if(next)selectScene(next.start);};
 return <main className={`review-app ${renderOnly?'render-only':''}`}>
 <audio ref={audio} src={narration.url} preload="auto" muted={muted} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>{setTime(DURATION);setPlaying(false);}} onSeeked={()=>{if(audio.current)setTime(audio.current.currentTime);}} onError={()=>setError('A narração não carregou. Confira sua conexão e tente novamente.')}/>
 <header className="review-header"><a href="/" className="wordmark">LÉO<span className="wordmark-dot">.</span><span className="wordmark-divider"/><span className="wordmark-label">10 SEGUNDOS</span></a><span className="draft-status"><span/>EM REVISÃO</span></header>
 <div className="review-layout"><section className="preview-column"><div className="preview-heading"><span>MONTAGEM COMPLETA</span><span>9:16 <span className="heading-divider">/</span> 2D</span></div>
 <div className="player" ref={player}><AnimationScene time={time} model={model}/><div className="player-corner"><span>{model?'LÉO / MODELO':`CENA ${frame.scene.id}`}</span>{muted?<VolumeX size={15}/>:<Volume2 size={15}/>}</div></div>
 <div className="playback"><div className="playback-row"><Button variant="ghost" size="icon" title={playing?'Pausar':'Reproduzir'} aria-label={playing?'Pausar':'Reproduzir'} onClick={toggle}>{playing?<Pause/>:<Play/>}</Button><Button variant="ghost" size="icon" title="Reiniciar" aria-label="Reiniciar" onClick={()=>{seek(0);void play();}}><RotateCcw/></Button><span className="timecode">{timecode(time)} <span>/ 01:23</span></span><Button variant="ghost" size="icon" title={muted?'Ativar som':'Silenciar'} aria-label={muted?'Ativar som':'Silenciar'} onClick={()=>setMuted(!muted)}>{muted?<VolumeX/>:<Volume2/>}</Button><Button className="fullscreen-button" variant="ghost" size="icon" title="Tela cheia" aria-label="Tela cheia" onClick={()=>{if(player.current&&!document.fullscreenElement)void player.current.requestFullscreen?.();else void document.exitFullscreen?.();}}><Scan/></Button></div><input className="timeline-range" type="range" aria-label="Posição da animação" min="0" max={DURATION} step="0.01" value={time} onChange={e=>seek(Number(e.target.value))}/><div className="timeline-labels"><span>01 · IDEIA</span><span>10 · PERGUNTAS</span><span>20 · MISTÉRIO</span></div>{error&&<p role="alert" className="player-error">{error}</p>}</div></section>
 <aside className="review-sidebar"><div className="sidebar-intro"><p className="eyebrow">LÉO & O TEMPO</p><h1>Dez segundos.<br/>Um mundo parado.</h1><div className="intro-meta"><span>PARA APROVAÇÃO</span><span>20 CENAS</span><span>1 MIN 23 S</span></div></div><div className="view-switch" role="group" aria-label="Visualização"><Button variant={!model?'default':'ghost'} onClick={()=>setModel(false)}><Play/>Animação</Button><Button variant={model?'default':'ghost'} onClick={()=>{audio.current?.pause();setModel(true);}}><UserRound/>Personagem</Button></div>
 <div className="scene-list"><div className="section-label">CENAS<span>01 — 20</span></div><div className="scene-list-scroll">{SCENES.map(scene=><Button key={scene.id} variant="ghost" className={`scene-button ${!model&&frame.scene.id===scene.id?'active':''}`} onClick={()=>selectScene(scene.start)} aria-label={`Ver cena ${scene.id}`}><span className="scene-number">{scene.id}</span><span className="scene-description"><strong>{scene.title}</strong><small>{timecode(scene.start)} · {(scene.end-scene.start).toFixed(1)} s</small></span><ArrowRight/></Button>)}</div></div>
 <div className="narration-excerpt"><span className="section-label">{model?'PERSONAGEM':`ROTEIRO · CENA ${frame.scene.id}`}</span><p>{model?'Léo':`“${frame.scene.line}”`}</p>{model&&<div className="character-swatches"><span className="swatch hair" title="Cabelo preto"/><span className="swatch shirt" title="Camiseta verde"/><span className="swatch pants" title="Calça grafite"/><span className="swatch bag" title="Mochila coral"/></div>}</div><Button asChild variant="outline" className="mp4-download"><a href={video.url} download="leo-10-segundos.mp4" target="_blank" rel="noreferrer"><Download/>Abrir MP4 · 1080 × 1920</a></Button><div className="review-footer"><Volume2 size={15}/><span>Narração original · sem cortes</span></div><div className="scene-navigation"><Button variant="ghost" size="icon" aria-label="Cena anterior" title="Cena anterior" onClick={()=>changeScene(-1)}><ArrowLeft/></Button><span>{model?'MODELO 01':`CENA ${frame.scene.id}`}</span><Button variant="ghost" size="icon" aria-label="Próxima cena" title="Próxima cena" onClick={()=>changeScene(1)}><ArrowRight/></Button></div></aside></div></main>;
}
