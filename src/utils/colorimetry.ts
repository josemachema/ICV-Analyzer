/**
 * Logic for Visual Load Evaluation (Ergonomics)
 */

export interface ColorData {
    hex: string;
    r: number;
    g: number;
    b: number;
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100 (Lightness)
    v: number; // 0-100 (Value/Brightness)
}

// Convert Hex to RGB
export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// Convert RGB to HSL and HSV/HSB
export const rgbToHslHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const v = max;
    const l = (max + min) / 2;

    let h = 0, s_hsl = 0, s_hsv = 0;
    const d = max - min;

    s_hsv = max === 0 ? 0 : d / max;
    s_hsl = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max !== min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s_hsl: Math.round(s_hsl * 100),
        l: Math.round(l * 100),
        v: Math.round(v * 100),
        s_hsv: Math.round(s_hsv * 100)
    };
};

export const getColorData = (hex: string): ColorData => {
    const { r, g, b } = hexToRgb(hex);
    const { h, l, v, s_hsv } = rgbToHslHsv(r, g, b);
    // We use HSV saturation for some ergonomic calculations as it maps better to "color intensity" perceptually
    return { hex, r, g, b, h, s: s_hsv, l, v };
};

// Calculate Contrast Ratio
// (L1 + 0.05) / (L2 + 0.05)
const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const getContrastRatio = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Visual Load Index (ICV) - Índice de Carga Visual
 * 
 * Formula (Heuristic):
 * ICV = (W_S * Saturation) + (W_C * ContrastPenalty) + (W_B * BrightnessFatigue) + (W_H * HueImpact)
 */
export const calculateICV = (bgHex: string, fgHex: string): number => {
    const bgData = getColorData(bgHex);

    // 1. Saturation Impact (High saturation is tiring)
    // We use the saturation of the background as the primary driver for fatigue here.
    const satScore = bgData.s;

    // 2. Contrast Score
    const contrast = getContrastRatio(fgHex, bgHex);
    let contrastScore = 0;

    if (contrast < 3) contrastScore = 100; // Terrible
    else if (contrast < 4.5) contrastScore = 60; // Poor
    else if (contrast > 18) contrastScore = 30; // Too stark (halogen effect)
    else contrastScore = 10; // Good

    // 3. Brightness/Glare Component
    // If background is purely white (100% V) or purely black (0% V) it can be straining.
    // Slight off-white or dark-grey is better.
    let brightnessScore = 0;
    if (bgData.v > 95 || bgData.v < 5) brightnessScore = 40;
    else brightnessScore = 15;

    // 4. Hue Impact (Blue Light Hazard)
    // Blue range ~ 200-260
    let huePenalty = 0;
    if (bgData.h > 190 && bgData.h < 270 && bgData.s > 20) {
        huePenalty = 30; // High blue light penalty
    }

    // Weighted Sum
    // Normalized roughly to 0-100
    let icv = (satScore * 0.4) + (contrastScore * 0.3) + (brightnessScore * 0.2) + (huePenalty * 0.1);

    // Clamp
    icv = Math.min(100, Math.max(0, icv));

    return Math.round(icv);
};

export const getICVRating = (score: number) => {
    if (score <= 30) return { label: "Ergonómico", color: "text-green-500", desc: "Baja carga visual. Confortable." };
    if (score <= 60) return { label: "Tolerable", color: "text-yellow-500", desc: "Carga media. Aceptable por periodos cortos." };
    return { label: "Alto Riesgo", color: "text-red-500", desc: "Fatiga visual rápida. No recomendado." };
};
