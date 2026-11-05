import { describe, expect, it } from 'vitest';
import { REWIND_SCENES, REWIND_DURATION, SHOT_STARTS, REWINDS, getRewindFrame, rewound, rewindAmount } from './rewind-timeline';

describe('Voltar 5 segundos no tempo', () => {
  it('has the 5 requested scenes, contiguous, and lasts about 1:30', () => {
    expect(REWIND_SCENES.map(s => s.title)).toEqual(['O descobrimento', 'Os primeiros testes', 'O perigo', 'A grande revelação', 'Final surpreendente']);
    REWIND_SCENES.slice(1).forEach((s, i) => expect(s.start).toBe(REWIND_SCENES[i]?.end));
    expect(REWIND_DURATION).toBeGreaterThan(85);
    expect(REWIND_DURATION).toBeLessThanOrEqual(96);
  });
  it('never holds one shot longer than 8 seconds (no prolonged static scenes)', () => {
    [...SHOT_STARTS, REWIND_DURATION].slice(1).forEach((s, i) => expect(s - (SHOT_STARTS[i] ?? 0)).toBeLessThanOrEqual(8));
  });
  it('maps narration time to the right scene', () => {
    expect(getRewindFrame(8).scene.id).toBe('01');
    expect(getRewindFrame(25).scene.id).toBe('02');
    expect(getRewindFrame(45).scene.id).toBe('03');
    expect(getRewindFrame(60).scene.id).toBe('04');
    expect(getRewindFrame(85).scene.id).toBe('05');
  });
  it('the street rescue is rewound twice before it succeeds', () => {
    expect(REWINDS.filter(([a]) => a >= 32.5 && a < 52.9)).toHaveLength(2);
    expect(rewindAmount(41)).toBe(1);
    expect(rewindAmount(50)).toBe(0);
  });
  it('the action clock runs backwards during a rewind', () => {
    expect(rewound(13, 12, 14, 7)).toBe(9.5);
    expect(rewound(15, 12, 14, 7)).toBe(8);
  });
});
