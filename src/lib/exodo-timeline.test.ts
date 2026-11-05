import { describe, expect, it } from 'vitest';
import { EXODO_SCENES, EXODO_SHOTS, EXODO_DURATION, getExodoFrame, earthInWindow, sproutGrowth, T } from './exodo-timeline';

describe('Êxodo — e se a humanidade precisasse abandonar a Terra', () => {
  it('has the 5 requested scenes, contiguous, and stays around 1:30', () => {
    expect(EXODO_SCENES.map(s => s.title)).toEqual(['A descoberta', 'A evacuação', 'A partida', 'A busca', 'A revelação final']);
    EXODO_SCENES.slice(1).forEach((s, i) => expect(s.start).toBe(EXODO_SCENES[i]?.end));
    expect(EXODO_DURATION).toBeGreaterThan(85);
    expect(EXODO_DURATION).toBeLessThanOrEqual(93);
  });
  it('never holds one shot longer than 8 seconds (no static scenes)', () => {
    EXODO_SHOTS.slice(1).forEach((s, i) => expect(s - (EXODO_SHOTS[i] ?? 0)).toBeLessThanOrEqual(8));
  });
  it('maps narration time to the right scene', () => {
    expect(getExodoFrame(5).scene.id).toBe('01');
    expect(getExodoFrame(20).scene.id).toBe('02');
    expect(getExodoFrame(35).scene.id).toBe('03');
    expect(getExodoFrame(50).scene.id).toBe('04');
    expect(getExodoFrame(80).scene.id).toBe('05');
  });
  it('shrinks the Earth in the window to a dot when the narrator says "pontinho azul"', () => {
    expect(earthInWindow(33.6)).toBe(230);
    expect(earthInWindow(T.dot)).toBeLessThanOrEqual(6);
  });
  it('grows the seedling only during the years of travel', () => {
    expect(sproutGrowth(30)).toBe(0);
    expect(sproutGrowth(70)).toBe(1);
  });
});
