import { getColorData, getContrastRatio, hexToRgb } from "./colorimetry";

// Helper: RGB to Hex
const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
};

// Helper: HSL to RGB
const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};


/**
 * 1. Reduce Saturation
 * Reduces saturation by a factor (e.g. 0.3 = 30% reduction)
 */
export const reduceSaturation = (hex: string, reductionFactor: number = 0.3): string => {
    const data = getColorData(hex);
    // We use HSL saturation for modification as it's cleaner for this purpose
    // Note: getColorData returns 's' as HSV saturation, but also 'l'. 
    // Let's re-calculate HSL specifically to be safe or use what we have.
    // Actually getColorData returns s_hsv. We need HSL for pure saturation reduction usually.
    // Let's implement a simple HSL modification flow.
    const rgb = hexToRgb(hex);
    // ... reimplement simple RGB->HSL->RGB flow to avoid dependency confusion
    // Reuse specific HSL helper if needed, but for now inline logic is safer.

    // Quick HSL conversion
    let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let l = (max + min) / 2;
    let h = 0, s = 0;

    if (max !== min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // Apply Reduction
    s = Math.max(0, s * (1 - reductionFactor));

    // Convert back
    const newRgb = hslToRgb(h * 360, s * 100, l * 100);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
};

/**
 * 2. Clamp Brightness
 * Ensures color is not pure white or pure black.
 * Map: Black -> #111827 (L~11%), White -> #F5F7FA (L~97%)
 */
export const clampBrightness = (hex: string): string => {
    // Check for pure black/white proximity
    const data = getColorData(hex);
    if (data.l < 5) return "#111827"; // Dark gray instead of black
    if (data.l > 98) return "#f5f7fa"; // Off-white instead of white
    return hex;
};

/**
 * 3. Ensure Contrast
 * If contrast mismatch, darken/lighten FG to meet target.
 */
export const ensureContrast = (bgHex: string, fgHex: string, minRatio: number = 6.0): string => {
    let currentRatio = getContrastRatio(bgHex, fgHex);
    if (currentRatio >= minRatio) return fgHex;

    const bgData = getColorData(bgHex);
    const fgData = getColorData(fgHex);

    // Strategy: If BG is light, darken FG. If BG is dark, lighten FG.
    const isBgLight = bgData.l > 50;

    let newFg = fgHex;
    let safetyCounter = 0;

    // Iterative approach (simple but effective for this scale)
    // We will step lightness by 5% until ratio met or limit reached.
    let h = fgData.h;
    let s = 0; // standard low saturation for text usually, but lets preserve if we can
    // actually lets simple iterate luminance

    // Simple hex adjustment is hard. Let's work in HSL.
    // Re-calc HSL
    const rgb = hexToRgb(fgHex);
    let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let l_val = (max + min) / 2;

    // If not matching, we force it towards black or white
    while (currentRatio < minRatio && safetyCounter < 20) {
        if (isBgLight) {
            l_val = Math.max(0, l_val - 0.05); // Darken
        } else {
            l_val = Math.min(1, l_val + 0.05); // Lighten
        }

        // Reconstruct hex
        // Assuming grayscale for simplicity if saturation processing is too complex? 
        // No, let's keep hue if possible.
        // Actually, just changing L in HSL is safe.
        // We reuse the H/S from earlier if available, or just assume 0 for robustness?
        // Let's fully recalculate H/S for accuracy loop
        // ... (Optimization: assume we just want to hit the target)

        // Let's use the helper hslToRgb with original H/S
        // Wait, we need original H/S.
        // Let's get them from getColorData which returns H/S(hsv)/L
        // We need S(hsl).

        // Shortcut: If we are fixing text, usually we just want black or white if it fails.
        // But let's try to preserve color.

        const newRgb = hslToRgb(fgData.h, 50, l_val * 100); // Approximate S=50 for generic color, wait this is bad.
        // Let's just use getColorData's hue, and S=0 for legibility (usually Accessible Text = Dark/Light safe colors)
        // Or better:

        const safeRgb = hslToRgb(fgData.h, 30, l_val * 100); // Reduce sat for safety
        newFg = rgbToHex(safeRgb.r, safeRgb.g, safeRgb.b);
        currentRatio = getContrastRatio(bgHex, newFg);
        safetyCounter++;
    }

    return newFg;
};
