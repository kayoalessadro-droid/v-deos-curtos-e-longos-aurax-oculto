import { describe, expect, it } from 'vitest';
import { GELO_SCENES, GELO_SHOTS, GELO_DURATION, getGeloFrame, seaLevel } from './gelo-timeline';

describe('Gelo — e se todo o gelo da Terra derretesse', () => {
  it('has the 5 requested scenes, contiguous, and stays around 1:30', () => {
    expect(GELO_SCENES).toHaveLength(5);
    GELO_SCENES.slice(1).forEach((s, i) => expect(s.start).toBe(GELO_SCENES[i]?.end));
    expect(GELO_DURATION).toBeGreaterThan(85);
    expect(GELO_DURATION).toBeLessThanOrEqual(93);
  });
  it('never holds one shot longer than 8 seconds (no static scenes)', () => {
    GELO_SHOTS.slice(1).forEach((s, i) => expect(s - (GELO_SHOTS[i] ?? 0)).toBeLessThanOrEqual(8));
  });
  it('maps narration time to the right scene', () => {
    expect(getGeloFrame(5).scene.id).toBe('01');
    expect(getGeloFrame(30).scene.id).toBe('02');
    expect(getGeloFrame(47).scene.id).toBe('03');
    expect(getGeloFrame(60).scene.id).toBe('04');
    expect(getGeloFrame(90).scene.id).toBe('05');
  });
  it('raises the sea by about 70 metres by the end of the melt', () => {
    expect(seaLevel(0)).toBe(0);
    expect(seaLevel(40)).toBe(70);
  });
});
