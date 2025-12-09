import React from 'react';
import { RefreshCcw, Info } from 'lucide-react';

interface ColorControlsProps {
    colors: {
        background: string;
        text: string;
        primary: string;
        secondary: string;
    };
    onColorChange: (key: string, value: string) => void;
    onReset: () => void;
}

export const ColorControls: React.FC<ColorControlsProps> = ({ colors, onColorChange, onReset }) => {
    return (
        <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Configuración de Color</h3>
                <button
                    onClick={onReset}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                    title="Restablecer valores"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>

            <div className="space-y-4">
                <div className="group">
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                        Fondo (Background)
                        <Info size={14} className="text-muted-foreground" />
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={colors.background}
                            onChange={(e) => onColorChange('background', e.target.value)}
                            className="h-10 w-20 rounded cursor-pointer bg-transparent"
                        />
                        <input
                            type="text"
                            value={colors.background}
                            onChange={(e) => onColorChange('background', e.target.value)}
                            className="flex-1 bg-input border border-border rounded px-3 text-sm font-mono uppercase focus:ring-2 focus:ring-ring outline-none"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                        Texto Principal
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={colors.text}
                            onChange={(e) => onColorChange('text', e.target.value)}
                            className="h-10 w-20 rounded cursor-pointer bg-transparent"
                        />
                        <input
                            type="text"
                            value={colors.text}
                            onChange={(e) => onColorChange('text', e.target.value)}
                            className="flex-1 bg-input border border-border rounded px-3 text-sm font-mono uppercase focus:ring-2 focus:ring-ring outline-none"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                        Acento / Primario
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={colors.primary}
                            onChange={(e) => onColorChange('primary', e.target.value)}
                            className="h-10 w-20 rounded cursor-pointer bg-transparent"
                        />
                        <input
                            type="text"
                            value={colors.primary}
                            onChange={(e) => onColorChange('primary', e.target.value)}
                            className="flex-1 bg-input border border-border rounded px-3 text-sm font-mono uppercase focus:ring-2 focus:ring-ring outline-none"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-sm font-medium mb-1.5 flex items-center gap-2">
                        Elementos Secundarios
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={colors.secondary}
                            onChange={(e) => onColorChange('secondary', e.target.value)}
                            className="h-10 w-20 rounded cursor-pointer bg-transparent"
                        />
                        <input
                            type="text"
                            value={colors.secondary}
                            onChange={(e) => onColorChange('secondary', e.target.value)}
                            className="flex-1 bg-input border border-border rounded px-3 text-sm font-mono uppercase focus:ring-2 focus:ring-ring outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="text-xs text-muted-foreground mt-4 p-3 bg-secondary/50 rounded-lg">
                <p>Ajuste los colores para ver el impacto inmediato en el índice de carga visual (ICV).</p>
            </div>
        </div>
    );
};
