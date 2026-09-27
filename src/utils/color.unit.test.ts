import { describe, it, expect } from 'vitest';
import { parseColor, isHexColor, isRgbOrRgbaColor } from './color';

describe('color utility', () => {
  it('detects and handles hex colors correctly', () => {
    expect(isHexColor('#00ffcc')).toBe(true);
    expect(isHexColor('00ffcc')).toBe(true);
    expect(isHexColor('#f0c')).toBe(true);
    expect(isHexColor('#ff0055aa')).toBe(true);
    expect(isHexColor('not-hex')).toBe(false);

    const parsed = parseColor('#00ffcc');
    expect(parsed.isCustom).toBe(true);
    expect(parsed.color).toBe('#00ffcc');
    expect(parsed.glowColor).toBe('rgba(0, 255, 204, 0.8)');
  });

  it('detects and handles rgb and rgba colors correctly', () => {
    expect(isRgbOrRgbaColor('rgb(0, 255, 128)')).toBe(true);
    expect(isRgbOrRgbaColor('rgba(255, 0, 100, 0.5)')).toBe(true);
    expect(isRgbOrRgbaColor('invalid-rgb')).toBe(false);

    const parsedRgb = parseColor('rgb(10, 20, 30)');
    expect(parsedRgb.isCustom).toBe(true);
    expect(parsedRgb.color).toBe('rgb(10, 20, 30)');
    expect(parsedRgb.glowColor).toBe('rgba(10, 20, 30, 0.8)');

    const parsedRgba = parseColor('rgba(10, 20, 30, 0.5)');
    expect(parsedRgba.isCustom).toBe(true);
    expect(parsedRgba.glowColor).toBe('rgba(10, 20, 30, 0.5)');
  });

  it('handles red and orange presets correctly', () => {
    const red = parseColor('red');
    expect(red.isCustom).toBe(false);
    expect(red.preset).toBe('red');

    const orange = parseColor('orange');
    expect(orange.isCustom).toBe(false);
    expect(orange.preset).toBe('orange');
  });
});
