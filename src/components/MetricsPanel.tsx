import React, { useMemo } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, Radar, RadarChart, PolarGrid, PolarRadiusAxis } from 'recharts';
import { calculateICV, getICVRating, getColorData, getContrastRatio } from '../utils/colorimetry';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface MetricsPanelProps {
    colors: {
        background: string;
        text: string;
        primary: string;
        secondary: string;
    };
    icvMultiplier?: number;
    mode?: 'normal' | 'astigmatism' | 'miopia' | 'accessible';
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ colors, icvMultiplier = 1, mode = 'normal' }) => {
    const icv = useMemo(() => Math.round(calculateICV(colors.background, colors.text) * icvMultiplier), [colors, icvMultiplier]);
    const rating = getICVRating(icv);

    // Detailed Analysis
    const bgData = getColorData(colors.background);
    const contrast = getContrastRatio(colors.background, colors.text);

    // Prepare Radar Data (Normalized 0-100 where 100 is "High Impact/Load")
    const radarData = useMemo(() => [
        { subject: 'Saturación', A: bgData.s, fullMark: 100 },
        { subject: 'Brillo Extremo', A: Math.abs(bgData.v - 50) * 2, fullMark: 100 }, // Extremes (0 or 100) are higher load than 50
        { subject: 'Contraste (Inv)', A: Math.max(0, 21 - contrast) * 4, fullMark: 100 }, // Low contrast = High load. 
        { subject: 'Tono (Azul)', A: (bgData.h > 200 && bgData.h < 260) ? 80 : 10, fullMark: 100 },
    ], [bgData, contrast]);

    // Gauge Data
    const gaugeData = [
        { name: 'ICV', value: icv, fill: icv > 60 ? '#ef4444' : icv > 30 ? '#eab308' : '#22c55e' }
    ];

    return (
        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                Métricas de Carga Visual (ICV)
                <span title="Índice de 0 a 100. Menor es mejor." className="cursor-help flex items-center text-muted-foreground">
                    <HelpCircle size={14} />
                </span>
            </h3>

            <div className="flex flex-col xl:flex-row items-center gap-6 flex-1">
                {/* Main Score Gauge */}
                <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            innerRadius="80%"
                            outerRadius="100%"
                            barSize={10}
                            data={gaugeData}
                            startAngle={180}
                            endAngle={0}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey="value" cornerRadius={30} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-4">
                        <span className={cn("text-4xl font-bold block", rating.color)}>{icv}</span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">ICV Score</span>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-10 text-center w-full">
                        <span className={cn("text-sm font-semibold px-3 py-1 rounded-full bg-secondary", rating.color)}>
                            {rating.label}
                        </span>
                    </div>
                </div>

                {/* Detailed Breakdown Chart */}
                <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height={200}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid opacity={0.3} />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Impacto" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium border-b border-border pb-2">Diagnóstico Rápido</h4>

                <div className="grid gap-2 text-sm">
                    {mode === 'astigmatism' ? (
                        <>
                            <div className="flex items-center gap-2 p-2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <AlertTriangle size={16} />
                                <span className="font-medium">Modo Astigmatismo Activado</span>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded space-y-2">
                                <p className="font-medium text-xs uppercase opacity-70">Recomendaciones Específicas:</p>
                                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                    <li>Evita blancos puros (Usar #F8FAFC o similar).</li>
                                    <li>Usa texto más grueso (Font-weight 500+).</li>
                                    <li>Incrementa contraste mínimo a 6:1.</li>
                                </ul>
                            </div>
                        </>
                    ) : mode === 'miopia' ? (
                        <>
                            <div className="flex items-center gap-2 p-2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                <AlertTriangle size={16} />
                                <span className="font-medium">Modo Miopía Activado</span>
                            </div>
                            <div className="p-3 bg-secondary/30 rounded space-y-2">
                                <p className="font-medium text-xs uppercase opacity-70">Recomendaciones Específicas:</p>
                                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                    <li>Evita texto muy delgado (Usar semibold).</li>
                                    <li>Aumenta contraste mínimo a 6.5:1.</li>
                                    <li>Aumenta el tamaño de fuente un 10–15%.</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                                <span>Contraste Texto/Fondo</span>
                                <span className={cn("font-mono font-bold", contrast < 4.5 ? "text-red-500" : "text-green-500")}>
                                    {contrast.toFixed(2)}:1
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded bg-secondary/30">
                                <span>Fatiga Cromática</span>
                                <span className={cn("font-medium", bgData.s > 70 ? "text-red-500" : "text-green-500")}>
                                    {bgData.s > 70 ? "Alta (Saturada)" : "Baja"}
                                </span>
                            </div>
                        </>
                    )}

                    <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded text-sm">
                        {contrast < 3 && <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
                        {contrast >= 3 && <CheckCircle size={16} className="mt-0.5 shrink-0" />}
                        <p>
                            {contrast < 3 ? "CRÍTICO: El contraste es insuficiente. Aumente la diferencia de brillo." :
                                contrast > 15 ? "PRECAUCIÓN: Contraste muy alto puede causar halos visuales (astigmatismo)." :
                                    "El contraste se encuentra en rango ergonómico óptimo."}
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};
