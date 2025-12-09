import React from 'react';
import { getColorData, getContrastRatio } from '../utils/colorimetry';

interface HeatmapViewProps {
    colors: {
        background: string;
        text: string;
        primary: string;
        secondary: string;
    };
}

// Helper to determine heat intensity (0-1) based on ergonomic risk
// High saturation = Heat
// High contrast or Very Low contrast = Heat
const getElementHeat = (bgHex: string, fgHex: string) => {
    const bg = getColorData(bgHex);
    const contrast = getContrastRatio(bgHex, fgHex);

    let score = 0;

    // Saturation (0-100) -> 0-0.5 impact
    score += (bg.s / 100) * 0.5;

    // Contrast Extremes
    if (contrast < 3) score += 0.4; // Hard to read = Strain
    if (contrast > 18) score += 0.3; // Glare = Strain

    // Blue Light
    if (bg.h > 200 && bg.h < 250 && bg.s > 50) score += 0.3;

    return Math.min(1, score);
};

const HeatOverlay = ({ intensity }: { intensity: number }) => {
    // Map 0-1 to Transparent -> Red
    // rgba(255, 0, 0, intensity)
    const style = { backgroundColor: `rgba(255, 0, 0, ${intensity * 0.8})` };
    return (
        <div className="absolute inset-0 pointer-events-none z-10 transition-colors duration-500 flex items-center justify-center" style={style}>
            {intensity > 0.3 && <span className="text-white text-xs font-bold drop-shadow-md">{Math.round(intensity * 100)}%</span>}
        </div>
    );
};

export const HeatmapView: React.FC<HeatmapViewProps> = ({ colors }) => {
    const bgHeat = getElementHeat(colors.background, colors.text); // Background heat (glare?)
    const primaryHeat = getElementHeat(colors.primary, '#ffffff'); // Primary button heat
    const secondaryHeat = getElementHeat(colors.secondary, colors.text); // Card heat

    return (
        <div className="relative w-full h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col items-center justify-center p-8">
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-grid-slate-900/[0.04] [mask-image:linear-gradient(to_bottom_right,white,transparent)]" />

            <div className="relative z-0 w-full max-w-2xl aspect-video bg-white shadow-xl rounded-lg overflow-hidden flex flex-col">
                {/* Simulate Layout */}
                <div className="relative h-12 w-full border-b flex items-center px-4 gap-4">
                    <div className="w-6 h-6 rounded bg-slate-200" />
                    <div className="w-24 h-4 rounded bg-slate-200" />

                    {/* Heat Overlay for Header context (using background color heat as proxy for overall glare) */}
                    <HeatOverlay intensity={bgHeat * 0.5} />
                </div>

                <div className="flex-1 flex p-4 gap-4 bg-slate-50">
                    {/* Sidebar */}
                    <div className="relative w-16 h-full rounded flex flex-col gap-2">
                        <div className="w-full h-8 rounded bg-slate-200" />
                        <div className="w-full h-8 rounded bg-slate-200" />
                        <div className="w-full h-8 rounded bg-slate-200" />

                        <HeatOverlay intensity={secondaryHeat} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="relative h-24 w-full rounded bg-blue-500">
                            {/* Primary Element */}
                            <HeatOverlay intensity={primaryHeat} />
                        </div>

                        <div className="flex gap-4 h-full">
                            <div className="relative flex-1 rounded bg-white shadow-sm border">
                                <div className="p-4 space-y-2">
                                    <div className="w-3/4 h-4 bg-slate-100 rounded" />
                                    <div className="w-1/2 h-4 bg-slate-100 rounded" />
                                </div>
                                <HeatOverlay intensity={secondaryHeat} />
                            </div>
                            <div className="relative flex-1 rounded bg-white shadow-sm border">
                                <div className="p-4 space-y-2">
                                    <div className="w-3/4 h-4 bg-slate-100 rounded" />
                                    <div className="w-1/2 h-4 bg-slate-100 rounded" />
                                </div>
                                <HeatOverlay intensity={secondaryHeat} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-slate-200">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nivel de Carga Visual</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-600">Baja</span>
                            <div className="h-2 w-32 rounded-full bg-gradient-to-r from-transparent via-red-200 to-red-600 border border-slate-100" />
                            <span className="text-xs font-medium text-slate-900 font-bold">Alta</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-2" />
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-slate-500">
                            % = Probabilidad de Fatiga
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
