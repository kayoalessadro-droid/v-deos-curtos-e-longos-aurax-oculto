import { describe, expect, it } from 'vitest';
import { CLONES_SCENES, CLONES_DURATION, getClonesFrame, T } from './clones-timeline';

describe('Lucas — cópias de si mesmo', () => {
  it('has the 7 requested scenes, contiguous, about 1:30 long', () => {
    expect(CLONES_SCENES).toHaveLength(7);
    CLONES_SCENES.slice(1).forEach((s, i) => expect(s.start).toBe(CLONES_SCENES[i]?.end));
    expect(CLONES_DURATION).toBeGreaterThan(85);
    expect(CLONES_DURATION).toBeLessThan(105);
  });
  it('maps narration time to the right scene', () => {
    expect(getClonesFrame(5).scene.id).toBe('01');
    expect(getClonesFrame(T.copyLine).scene.id).toBe('06');
    expect(getClonesFrame(T.question).scene.id).toBe('07');
  });
  it('holds a short dramatic pause after the final question', () => {
    const pause = T.frozen - T.questionEnd;
    expect(pause).toBeGreaterThan(.8);
    expect(pause).toBeLessThan(2);
  });
});
