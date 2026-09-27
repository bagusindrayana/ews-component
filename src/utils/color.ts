export interface ParsedColor {
  isCustom: boolean;
  preset?: 'red' | 'orange';
  color?: string;
  glowColor?: string;
}

/**
 * Checks if a string is a valid HEX color (#RGB, #RGBA, #RRGGBB, #RRGGBBAA or without #)
 */
export function isHexColor(colorStr: string): boolean {
  if (!colorStr || typeof colorStr !== 'string') return false;
  return /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(colorStr.trim());
}

/**
 * Checks if a string is a valid rgb() or rgba() color
 */
export function isRgbOrRgbaColor(colorStr: string): boolean {
  if (!colorStr || typeof colorStr !== 'string') return false;
  return /^rgba?\(\s*(\d{1,3}%?|[0-9.]+)[\s,]+(\d{1,3}%?|[0-9.]+)[\s,]+(\d{1,3}%?|[0-9.]+)(?:[\s,/]+([0-9.]+%?))?\s*\)$/i.test(colorStr.trim());
}

/**
 * Parses a color string (HEX, RGB, RGBA, or presets like 'red', 'orange')
 * and returns standard color and calculated glow color (80% opacity).
 */
export function parseColor(colorInput?: string): ParsedColor {
  if (!colorInput || typeof colorInput !== 'string') {
    return { isCustom: false };
  }

  const trimmed = colorInput.trim();
  const lower = trimmed.toLowerCase();

  // Known presets
  if (lower === 'red' || lower === 'orange') {
    return {
      isCustom: false,
      preset: lower,
      color: lower === 'red' ? '#e60908' : '#fa0',
      glowColor: lower === 'red' ? 'rgba(255, 17, 0, 0.8)' : 'rgba(255, 94, 0, 0.8)',
    };
  }

  // 1. Detect HEX color
  const hexMatch = trimmed.match(/^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hexMatch) {
    const rawHex = hexMatch[1];
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 1;

    if (rawHex.length === 3 || rawHex.length === 4) {
      r = parseInt(rawHex[0] + rawHex[0], 16);
      g = parseInt(rawHex[1] + rawHex[1], 16);
      b = parseInt(rawHex[2] + rawHex[2], 16);
      if (rawHex.length === 4) {
        a = Math.round((parseInt(rawHex[3] + rawHex[3], 16) / 255) * 100) / 100;
      }
    } else if (rawHex.length === 6 || rawHex.length === 8) {
      r = parseInt(rawHex.slice(0, 2), 16);
      g = parseInt(rawHex.slice(2, 4), 16);
      b = parseInt(rawHex.slice(4, 6), 16);
      if (rawHex.length === 8) {
        a = Math.round((parseInt(rawHex.slice(6, 8), 16) / 255) * 100) / 100;
      }
    }

    const normalizedColor = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    const glowAlpha = Math.min(a, 0.8);
    const glowColor = `rgba(${r}, ${g}, ${b}, ${glowAlpha})`;

    return {
      isCustom: true,
      color: normalizedColor,
      glowColor,
    };
  }

  // 2. Detect RGB / RGBA color
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d{1,3}%?|[0-9.]+)[\s,]+(\d{1,3}%?|[0-9.]+)[\s,]+(\d{1,3}%?|[0-9.]+)(?:[\s,/]+([0-9.]+%?))?\s*\)$/i
  );
  if (rgbMatch) {
    const parseComponent = (val: string) => {
      if (val.endsWith('%')) {
        return Math.round((parseFloat(val) / 100) * 255);
      }
      return Math.min(255, Math.max(0, parseFloat(val)));
    };

    const r = parseComponent(rgbMatch[1]);
    const g = parseComponent(rgbMatch[2]);
    const b = parseComponent(rgbMatch[3]);

    let a = 1;
    if (rgbMatch[4] !== undefined) {
      const alphaVal = rgbMatch[4].trim();
      if (alphaVal.endsWith('%')) {
        a = parseFloat(alphaVal) / 100;
      } else {
        a = parseFloat(alphaVal);
      }
      a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    }

    const glowAlpha = Math.round(Math.min(a, 0.8) * 100) / 100;
    const glowColor = `rgba(${r}, ${g}, ${b}, ${glowAlpha})`;

    return {
      isCustom: true,
      color: trimmed,
      glowColor,
    };
  }

  // 3. Fallback for other valid CSS colors (e.g. hsl, cyan, etc.)
  return {
    isCustom: true,
    color: trimmed,
    glowColor: `color-mix(in srgb, ${trimmed} 80%, transparent)`,
  };
}
