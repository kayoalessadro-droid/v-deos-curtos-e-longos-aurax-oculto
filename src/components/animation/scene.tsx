import { getFrame } from '@/lib/leo-timeline';
import { Leo } from './leo';

export function AnimationScene({ time, model = false }: { time: number; model?: boolean }) {
  const f = getFrame(time);
  const w = f.worldTime;
  const x = f.walk ? 148 + Math.sin(f.localTime * 0.68) * 85 : 171;
  const angle = w * 90;
  return <svg viewBox="0 0 540 960" role="img" aria-label={model ? 'Modelo vetorial definitivo de Léo' : `Animação da cena ${f.scene.id}`} className={`animation-canvas ${f.frozen ? 'world-frozen' : ''}`}>
    <defs><pattern id="street-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" className="grid-line"/></pattern></defs>
    <rect width="540" height="960" className="scene-sky"/>
    {model ? <><rect width="540" height="960" fill="url(#street-grid)"/><circle cx="270" cy="430" r="190" className="model-circle"/><text x="270" y="130" textAnchor="middle" className="model-title">LÉO</text><text x="270" y="164" textAnchor="middle" className="model-caption">MODELO 01 / VETOR 2D</text><ellipse cx="270" cy="805" rx="104" ry="14" className="ground-shadow"/><g transform="translate(94 264) scale(1.95)"><Leo time={time} expression="happy"/></g></> : <>
      <g className="environment">
        <circle cx="453" cy="170" r="46" className="scene-sun"/>
        <path className="scene-cloud" d="M38 195Q24 173 43 161Q54 137 76 153Q101 138 113 167Q137 165 132 187Z" transform={`translate(${w * 3} 0)`}/>
        <path className="building-back" d="M0 335H85V297H164V384H233V322H315V386H396V307H469V363H540V660H0Z"/>
        <path className="building-main" d="M-20 438H110V650H-20ZM393 420H560V650H393Z"/>
        {[0,1,2].map(i => <g key={i}><rect x="14" y={465+i*53} width="27" height="30" className="building-window"/><rect x="61" y={465+i*53} width="27" height="30" className="building-window"/><rect x="424" y={450+i*59} width="35" height="34" className="building-window"/><rect x="482" y={450+i*59} width="35" height="34" className="building-window"/></g>)}
        <path className="tree-trunk" d="M359 600V441"/><path className="tree-leaves" d="M323 458Q300 427 323 403Q312 364 344 352Q386 337 404 374Q433 403 403 428Q408 462 370 473Z"/>
        <rect y="644" width="540" height="316" className="scene-road"/><path className="road-line" d="M0 778H540M0 930H540"/>
        <path className="sidewalk" d="M0 614H540V659H0Z"/>
        <g transform={`translate(${((w * 25) % 170) - 85} 485)`}>
          <rect width="354" height="153" rx="18" className="bus-body"/><path className="bus-stripe" d="M0 106H354V128H0Z"/>
          <rect x="18" y="20" width="49" height="61" rx="5" className="bus-window"/><rect x="79" y="20" width="49" height="61" rx="5" className="bus-window"/><rect x="140" y="20" width="49" height="61" rx="5" className="bus-window"/><rect x="202" y="20" width="49" height="61" rx="5" className="bus-window"/><rect x="270" y="20" width="65" height="105" rx="5" className="bus-window"/><path className="bus-divider" d="M302 20V125"/>
          {[66,279].map(cx => <g key={cx} transform={`translate(${cx} 145)`}><circle r="25" className="bus-wheel"/><circle r="12" className="wheel-hub"/><path d="M-10 0H10M0-10V10" className="wheel-spoke" transform={`rotate(${angle})`}/></g>)}
        </g>
        <g transform={`translate(${426-w*8} 547)`}><circle cy="-20" r="13" className="pedestrian-skin"/><path className="pedestrian-coat" d="M-15 0H15L20 50H-20Z"/><path className="pedestrian-leg" d={`M-8 48L${-12-Math.sin(w*4)*8} 89M8 48L${12+Math.sin(w*4)*8} 89`}/></g>
        {Array.from({length: 16}, (_,i) => <path key={i} d="M0 0L-3 13" className="rain-drop" transform={`translate(${(i*83+19)%540} ${(i*71+w*150)%570+170})`}/>)}
      </g>
      <ellipse cx={x+100} cy="847" rx="70" ry="12" className="ground-shadow"/>
      <g data-testid="leo-pose" transform={`translate(${x} 445) scale(1.15)`}><Leo time={time} walking={f.walk} expression={f.impact > 0 ? 'surprised' : f.walk ? 'happy' : 'curious'}/></g>
      <g transform="translate(270 220)"><circle r="65" className="clock-face"/><path className="clock-tick" d="M0-51V-43M51 0H43M0 51V43M-51 0H-43"/><path className="clock-hand" d="M0 0V-35" transform={`rotate(${f.frozen ? 0 : angle})`}/><circle r="4" className="leo-eye"/></g>
      <text x="270" y="106" textAnchor="middle" className="scene-heading">{f.scene.id === '01' ? 'E SE…' : f.scene.id === '02' ? 'O MUNDO PAROU.' : '10 SEGUNDOS.'}</text>
      <text x="270" y="141" textAnchor="middle" className="scene-subheading">{f.scene.id === '02' ? 'MAS O LÉO NÃO.' : 'TU PUDESSE PARAR O TEMPO?'}</text>
      {f.frozen && <g><rect x="192" y="319" width="156" height="32" rx="4" className="freeze-label-bg"/><text x="270" y="341" textAnchor="middle" className="freeze-label">TEMPO CONGELADO</text></g>}
      {f.impact > 0 && <g opacity={f.impact} transform={`translate(270 460) scale(${1 + (1-f.impact)*0.5})`}><path className="impact-burst" d="M0-150L25-65L105-117L69-33L157 0L68 28L112 113L25 64L0 151L-27 65L-112 117L-69 25L-153 0L-65-29L-108-114L-26-64Z"/><text textAnchor="middle" y="22" className="impact-text">PÁ!</text></g>}
    </>}
  </svg>;
}