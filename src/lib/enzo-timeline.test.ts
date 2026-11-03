import { describe, expect, it } from 'vitest';
import { ENZO_SCENES, ENZO_DURATION, getEnzoFrame, handPos } from './enzo-timeline';

describe('Enzo — tudo o que toca congela', () => {
  it('has the 7 requested scenes, contiguous, about 1:30–1:45 long', () => {
    expect(ENZO_SCENES).toHaveLength(7);
    ENZO_SCENES.slice(1).forEach((s, i) => expect(s.start).toBe(ENZO_SCENES[i]?.end));
    expect(ENZO_DURATION).toBeGreaterThan(85);
    expect(ENZO_DURATION).toBeLessThan(105);
  });
  it('maps narration time to the right scene', () => {
    expect(getEnzoFrame(7).scene.id).toBe('01');
    expect(getEnzoFrame(60).scene.id).toBe('05');
    expect(getEnzoFrame(99).scene.id).toBe('07');
  });
  it('puts the resting hand where the rig hand is drawn', () => {
    const h = handPos(0, 0, 0, 1);
    expect(h.x).toBeCloseTo(160);
    expect(h.y).toBeCloseTo(195);
  });
});
