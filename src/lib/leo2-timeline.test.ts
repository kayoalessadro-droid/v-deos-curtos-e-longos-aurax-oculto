import { describe, expect, it } from 'vitest';
import { getL2Frame, L2_SCENES, L2_DURATION, worldClock } from './leo2-timeline';

describe('Léo parte 2', () => {
  it('has 7 contiguous scenes covering the narration', () => {
    expect(L2_SCENES).toHaveLength(7);
    L2_SCENES.slice(1).forEach((s, i) => expect(s.start).toBe(L2_SCENES[i]?.end));
    expect(L2_SCENES[6].end).toBe(L2_DURATION);
  });
  it('freezes the world after "E pá" and resumes when the 10 seconds end', () => {
    expect(worldClock(20)).toBe(worldClock(35));
    expect(getL2Frame(30).frozen).toBe(true);
    expect(getL2Frame(45).frozen).toBe(false);
  });
  it('freezes a second time and returns to normal after the whisper', () => {
    expect(getL2Frame(62).frozen).toBe(true);
    expect(getL2Frame(95).rate).toBe(1);
  });
});
