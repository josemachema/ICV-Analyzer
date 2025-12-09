import React, { useState, useMemo } from 'react';
import { ColorControls } from './ColorControls';
import { MetricsPanel } from './MetricsPanel';
import { InterfacePreview } from './InterfacePreview';
import { Trophy } from 'lucide-react';
import { calculateICV } from '../utils/colorimetry';
import { clampBrightness, ensureContrast, reduceSaturation } from '../utils/accessibility';

const defaultPalette = {
    background: "#f8fafc",
    text: "#0f172a",
    primary: "#3b82f6",
    secondary: "#e2e8f0"
};

const darkPalette = {
    background: "#0f172a",
    text: "#f8fafc",
    primary: "#60a5fa",
    secondary: "#1e293b"
};

interface PaletteComparatorProps {
    mode?: 'normal' | 'astigmatism' | 'miopia' | 'accessible';
}

export const PaletteComparator: React.FC<PaletteComparatorProps> = ({ mode = 'normal' }) => {
    const [paletteA, setPaletteA] = useState(defaultPalette);
    const [paletteB, setPaletteB] = useState(darkPalette);

    // Independent modes for each palette
    const [modeA, setModeA] = useState(mode);
    const [modeB, setModeB] = useState(mode);

    // Update local modes if global mode changes (optional, but good for starting point)
    React.useEffect(() => {
        setModeA(mode);
        setModeB(mode);
    }, [mode]);

    // Apply Accessibility Logic if needed
    const correctedPaletteA = useMemo(() => {
        if (modeA !== 'accessible') return paletteA;
        let bg = clampBrightness(paletteA.background);
        let txt = clampBrightness(paletteA.text);
        bg = reduceSaturation(bg, 0.2);
        txt = reduceSaturation(txt, 0.2);
        const prim = reduceSaturation(paletteA.primary, 0.3);
        const sec = reduceSaturation(paletteA.secondary, 0.2);
        txt = ensureContrast(bg, txt, 6.0);
        return { background: bg, text: txt, primary: prim, secondary: sec };
    }, [paletteA, modeA]);

    const correctedPaletteB = useMemo(() => {
        if (modeB !== 'accessible') return paletteB;
        let bg = clampBrightness(paletteB.background);
        let txt = clampBrightness(paletteB.text);
        bg = reduceSaturation(bg, 0.2);
        txt = reduceSaturation(txt, 0.2);
        const prim = reduceSaturation(paletteB.primary, 0.3);
        const sec = reduceSaturation(paletteB.secondary, 0.2);
        txt = ensureContrast(bg, txt, 6.0);
        return { background: bg, text: txt, primary: prim, secondary: sec };
    }, [paletteB, modeB]);

    // Helper for multiliers
    const getMultiplier = (m: string) => m === 'astigmatism' ? 1.2 : m === 'miopia' ? 1.3 : m === 'accessible' ? 0.8 : 1;

    // Metrics use the effective colors
    const icvA = calculateICV(correctedPaletteA.background, correctedPaletteA.text) * getMultiplier(modeA);
    const icvB = calculateICV(correctedPaletteB.background, correctedPaletteB.text) * getMultiplier(modeB);

    const handleChangeA = (k: string, v: string) => setPaletteA(p => ({ ...p, [k]: v }));
    const handleChangeB = (k: string, v: string) => setPaletteB(p => ({ ...p, [k]: v }));

    // Visual Filters
    const getFilterStyle = (m: string) => {
        if (m === 'astigmatism') return { filter: 'blur(1px) drop-shadow(0px 0px 3px rgba(255,255,255,0.3))' };
        if (m === 'miopia') return { filter: 'blur(2px) contrast(0.85)' };
        return {};
    };
    const filterStyle = getFilterStyle; // Fix reference

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-8">
            {/* Palette A */}
            <div className="space-y-4">
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            Paleta A
                            {icvA < icvB && <Trophy className="text-yellow-500" size={20} />}
                        </h3>
                        <AnalyzerSelector value={modeA} onChange={(v) => setModeA(v as any)} />
                    </div>
                    <span className="text-2xl font-bold">{Math.round(icvA)} <span className="text-sm font-normal text-muted-foreground">ICV</span></span>
                </div>
                <div className="flex flex-col gap-6">
                    <ColorControls
                        colors={paletteA}
                        onColorChange={handleChangeA}
                        onReset={() => setPaletteA(defaultPalette)}
                    />
                    <div className="h-[500px] border border-border/50 rounded-xl overflow-hidden shadow-sm" style={getFilterStyle(modeA)}>
                        <InterfacePreview colors={correctedPaletteA} mode={modeA} />
                    </div>
                </div>
                <div>
                    <MetricsPanel colors={correctedPaletteA} icvMultiplier={getMultiplier(modeA)} mode={modeA} />
                </div>
            </div>

            {/* Palette B */}
            <div className="space-y-4 border-t xl:border-t-0 xl:border-l border-border pt-8 xl:pt-0 xl:pl-8">
                <div className="flex items-center justify-between bg-card p-3 rounded-lg border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            Paleta B
                            {icvB < icvA && <Trophy className="text-yellow-500" size={20} />}
                        </h3>
                        <AnalyzerSelector value={modeB} onChange={(v) => setModeB(v as any)} />
                    </div>
                    <span className="text-2xl font-bold">{Math.round(icvB)} <span className="text-sm font-normal text-muted-foreground">ICV</span></span>
                </div>
                <div className="flex flex-col gap-6">
                    <ColorControls
                        colors={paletteB}
                        onColorChange={handleChangeB}
                        onReset={() => setPaletteB(darkPalette)}
                    />
                    <div className="h-[500px] border border-border/50 rounded-xl overflow-hidden shadow-sm" style={getFilterStyle(modeB)}>
                        <InterfacePreview colors={correctedPaletteB} mode={modeB} />
                    </div>
                </div>
                <div>
                    <MetricsPanel colors={correctedPaletteB} icvMultiplier={getMultiplier(modeB)} mode={modeB} />
                </div>
            </div>

            <div className="xl:col-span-2 bg-secondary/20 p-4 rounded-lg flex items-center justify-center gap-4 text-sm mt-4">
                <span className="font-bold">Conclusión:</span>
                {icvA < icvB ? (
                    <p>La <span className="font-bold">Paleta A</span> es más ergonómica ({Math.round(icvB - icvA)} puntos menos de carga visual).</p>
                ) : icvB < icvA ? (
                    <p>La <span className="font-bold">Paleta B</span> es más ergonómica ({Math.round(icvA - icvB)} puntos menos de carga visual).</p>
                ) : (
                    <p>Ambas paletas tienen la misma carga visual.</p>
                )}
            </div>
        </div>
    );
};

const AnalyzerSelector = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs border rounded px-2 py-1 bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
    >
        <option value="normal">Normal</option>
        <option value="astigmatism">Astigmatismo</option>
        <option value="miopia">Miopía</option>
        <option value="accessible">Accesible</option>
    </select>
);
