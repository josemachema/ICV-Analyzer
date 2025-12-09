import React, { useState } from 'react';
import { ColorControls } from './ColorControls';
import { MetricsPanel } from './MetricsPanel';
import { InterfacePreview } from './InterfacePreview';
import { Trophy } from 'lucide-react';
import { calculateICV } from '../utils/colorimetry';

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

export const PaletteComparator: React.FC = () => {
    const [paletteA, setPaletteA] = useState(defaultPalette);
    const [paletteB, setPaletteB] = useState(darkPalette);

    const icvA = calculateICV(paletteA.background, paletteA.text, paletteA.primary);
    const icvB = calculateICV(paletteB.background, paletteB.text, paletteB.primary);

    const handleChangeA = (k: string, v: string) => setPaletteA(p => ({ ...p, [k]: v }));
    const handleChangeB = (k: string, v: string) => setPaletteB(p => ({ ...p, [k]: v }));

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
            {/* Palette A */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        Paleta A
                        {icvA < icvB && <Trophy className="text-yellow-500" size={20} />}
                    </h3>
                    <span className="text-2xl font-bold">{icvA} <span className="text-sm font-normal text-muted-foreground">ICV</span></span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorControls
                        colors={paletteA}
                        onColorChange={handleChangeA}
                        onReset={() => setPaletteA(defaultPalette)}
                    />
                    <div className="h-[300px] md:h-auto">
                        <InterfacePreview colors={paletteA} />
                    </div>
                </div>
                <div className="h-[300px]">
                    <MetricsPanel colors={paletteA} />
                </div>
            </div>

            {/* Palette B */}
            <div className="space-y-4 border-t xl:border-t-0 xl:border-l border-border pt-8 xl:pt-0 xl:pl-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        Paleta B
                        {icvB < icvA && <Trophy className="text-yellow-500" size={20} />}
                    </h3>
                    <span className="text-2xl font-bold">{icvB} <span className="text-sm font-normal text-muted-foreground">ICV</span></span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorControls
                        colors={paletteB}
                        onColorChange={handleChangeB}
                        onReset={() => setPaletteB(darkPalette)}
                    />
                    <div className="h-[300px] md:h-auto">
                        <InterfacePreview colors={paletteB} />
                    </div>
                </div>
                <div className="h-[300px]">
                    <MetricsPanel colors={paletteB} />
                </div>
            </div>

            <div className="xl:col-span-2 bg-secondary/20 p-4 rounded-lg flex items-center justify-center gap-4 text-sm">
                <span className="font-bold">Conclusión:</span>
                {icvA < icvB ? (
                    <p>La <span className="font-bold">Paleta A</span> es más ergonómica ({icvB - icvA} puntos menos de carga visual).</p>
                ) : icvB < icvA ? (
                    <p>La <span className="font-bold">Paleta B</span> es más ergonómica ({icvA - icvB} puntos menos de carga visual).</p>
                ) : (
                    <p>Ambas paletas tienen la misma carga visual.</p>
                )}
            </div>
        </div>
    );
};
