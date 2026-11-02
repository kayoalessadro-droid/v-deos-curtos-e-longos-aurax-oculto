import {describe,it,expect} from 'vitest';
import {DURATION,SCENES,getFrame,IMPACT_CENTER,IMPACT_TIME} from './leo-timeline';
describe('Approved full animation',()=>{
 it('has exactly 20 contiguous scenes through the original audio duration',()=>{expect(SCENES).toHaveLength(20);expect(SCENES[0].start).toBe(0);expect(SCENES[19].end).toBe(83.128095);SCENES.slice(1).forEach((s,i)=>expect(s.start).toBe(SCENES[i]?.end));expect(DURATION).toBe(83.128095);});
 it('walks only forward throughout scene 02',()=>{const samples=Array.from({length:50},(_,i)=>getFrame(3.32+i*.1).leoX);samples.slice(1).forEach((x,i)=>{const previous=samples[i];if(previous===undefined)throw new Error('Missing sample');expect(x).toBeGreaterThan(previous);});});
 it('freezes the world but keeps Léo moving in scene 02',()=>{expect(getFrame(4).worldTime).toBe(getFrame(8).worldTime);expect(getFrame(4).leoX).not.toBe(getFrame(8).leoX);expect(getFrame(8).walk).toBe(true);});
 it('positions the entire impact above the face',()=>{expect(IMPACT_CENTER.y+IMPACT_CENTER.radius).toBeLessThan(445+1.15*18);});
 it('freezes at the spoken PÁ and resumes in scene 09',()=>{expect(IMPACT_TIME).toBe(21.78);expect(getFrame(21.7).frozen).toBe(false);expect(getFrame(21.9).impact).toBeGreaterThan(0);expect(getFrame(22).worldTime).toBe(getFrame(39).worldTime);expect(getFrame(40.5).frozen).toBe(false);expect(getFrame(41).worldTime).toBeGreaterThan(getFrame(40.5).worldTime);});
 it('uses measured question and suspense phrase boundaries',()=>{expect(getFrame(53.24).scene.id).toBe('12');expect(getFrame(54.28).scene.id).toBe('13');expect(getFrame(77).scene.id).toBe('19');expect(getFrame(79.88).scene.id).toBe('20');expect(getFrame(DURATION).scene.id).toBe('20');});
});
