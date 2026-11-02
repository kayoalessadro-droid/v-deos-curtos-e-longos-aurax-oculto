import { describe, expect, it } from 'vitest';
import { getFrame, TEST_SCENES } from './leo-timeline';

describe('Approved animation test', () => {
  it('contains only scenes 01, 02 and 05', () => {
    expect(TEST_SCENES.map(s => s.id)).toEqual(['01', '02', '05']);
  });
  it('keeps the world frozen while Léo walks in scene 02', () => {
    expect(getFrame(5).worldTime).toBe(4);
    expect(getFrame(8).worldTime).toBe(4);
    expect(getFrame(8).walk).toBe(true);
    expect(getFrame(8).time).not.toBe(getFrame(5).time);
  });
  it('stops the environment at the impact in scene 05', () => {
    expect(getFrame(9.5).frozen).toBe(false);
    expect(getFrame(10.2).frozen).toBe(true);
    expect(getFrame(10.2).worldTime).toBe(getFrame(11).worldTime);
    expect(getFrame(10.2).impact).toBeGreaterThan(0);
  });
});