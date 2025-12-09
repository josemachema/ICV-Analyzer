import { useState } from 'react';
import { ColorControls } from './ColorControls';
import { InterfacePreview } from './InterfacePreview';
import { MetricsPanel } from './MetricsPanel';
import { PaletteComparator } from './PaletteComparator';
import { HeatmapView } from './HeatmapView';
import { LayoutDashboard, Share2, Download, BarChart2, SplitSquareHorizontal, Flame } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
    onModeChange?: (mode: 'normal' | 'astigmatism' | 'miopia' | 'accessible') => void;
    currentMode?: 'normal' | 'astigmatism' | 'miopia' | 'accessible';
}

export const DashboardAstigmatismo: React.FC<DashboardProps> = ({ onModeChange, currentMode = 'astigmatism' }) => {
    const [currentView, setCurrentView] = useState<'analyzer' | 'compare' | 'heatmap'>('analyzer');

    const [colors, setColors] = useState({
        background: "#f8fafc", // Slate-50
        text: "#0f172a", // Slate-900
        primary: "#3b82f6", // Blue-500
        secondary: "#e2e8f0" // Slate-200
    });

    const handleColorChange = (key: string, value: string) => {
        setColors(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleReset = () => {
        setColors({
            background: "#f8fafc",
            text: "#0f172a",
            primary: "#3b82f6",
            secondary: "#e2e8f0"
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="text-primary" size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight hidden md:block">ICV Analyzer (Modo Astigmatismo)</h1>
                        <p className="text-xs text-muted-foreground hidden lg:block">Visual Load Evaluation Dashboard</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center bg-secondary/50 p-1 rounded-lg">
                    <button
                        onClick={() => setCurrentView('analyzer')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                            currentView === 'analyzer' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <BarChart2 size={16} /> <span className="hidden sm:inline">Analizador</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('compare')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                            currentView === 'compare' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <SplitSquareHorizontal size={16} /> <span className="hidden sm:inline">Comparador</span>
                    </button>
                    <button
                        onClick={() => setCurrentView('heatmap')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                            currentView === 'heatmap' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <Flame size={16} /> <span className="hidden sm:inline">Mapa de Calor</span>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mode Selector */}
                    <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/50">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modo:</span>
                        <select
                            value={currentMode}
                            onChange={(e) => onModeChange?.(e.target.value as any)}
                            className="bg-transparent text-sm font-bold text-foreground border-none focus:ring-0 cursor-pointer outline-none"
                        >
                            <option value="normal">Normal</option>
                            <option value="astigmatism">Astigmatismo</option>
                            <option value="miopia">Miopía</option>
                            <option value="accessible">Accesible</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-secondary rounded-lg text-sm font-medium flex items-center gap-2 text-muted-foreground transition-colors">
                            <Share2 size={16} /> <span className="hidden xl:inline">Compartir</span>
                        </button>
                        <button className="px-3 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 transition-all">
                            <Download size={16} /> <span className="hidden md:inline">Exportar</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 overflow-hidden">
                {currentView === 'analyzer' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                        {/* Left Column: Controls & Metrics */}
                        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-6rem)]">
                            <section>
                                <ColorControls
                                    colors={colors}
                                    onColorChange={handleColorChange}
                                    onReset={handleReset}
                                />
                            </section>

                            <section className="flex-1">
                                <MetricsPanel
                                    colors={colors}
                                    icvMultiplier={1.20}
                                    mode="astigmatism"
                                />
                            </section>
                        </div>

                        {/* Right Column: Visualizer */}
                        <div className="lg:col-span-8 overflow-y-auto max-h-[calc(100vh-6rem)]">
                            {/* Astigmatism Simulation Wrapper */}
                            <div style={{ filter: 'blur(1px) drop-shadow(0px 0px 3px rgba(255,255,255,0.3))' }} className="h-full">
                                <InterfacePreview colors={colors} />
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'compare' && (
                    <div className="h-full overflow-y-auto">
                        <PaletteComparator mode="astigmatism" />
                    </div>
                )}

                {currentView === 'heatmap' && (
                    <div className="h-full flex items-center justify-center p-4 lg:p-12">
                        <div className="w-full h-full max-w-5xl">
                            <HeatmapView colors={colors} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
