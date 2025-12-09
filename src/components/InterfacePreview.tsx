import React from 'react';
import { Home, Settings, User, Bell, Search, Menu } from 'lucide-react';

interface InterfacePreviewProps {
    colors: {
        background: string;
        text: string;
        primary: string;
        secondary: string;
    };
}

export const InterfacePreview: React.FC<InterfacePreviewProps> = ({ colors }) => {
    // We apply styles inline for dynamic simulation
    const containerStyle = { backgroundColor: colors.background, color: colors.text };
    const primaryStyle = { backgroundColor: colors.primary, color: '#FFFFFF' }; // Assuming white text on primary for now, could act smarter
    const secondaryStyle = { backgroundColor: colors.secondary };
    const borderStyle = { borderColor: colors.secondary };

    return (
        <div className="bg-card text-card-foreground p-1 rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-3 border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Simulador de Interfaz
            </div>

            {/* Simulation Container - Isolated DOM */}
            <div
                className="flex-1 p-4 overflow-hidden relative transition-colors duration-300"
                style={containerStyle}
            >
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-6 pb-2" style={{ borderBottom: `1px solid ${colors.secondary}` }}>
                    <div className="flex items-center gap-3">
                        <Menu size={20} />
                        <span className="font-bold text-lg">App</span>
                    </div>
                    <div className="flex gap-3">
                        <Search size={20} />
                        <Bell size={20} />
                        <div className="w-8 h-8 rounded-full" style={primaryStyle}></div>
                    </div>
                </div>

                <div className="flex gap-6 h-full">
                    {/* Mock Sidebar */}
                    <div className="w-12 md:w-48 hidden md:flex flex-col gap-4 pr-4" style={{ borderRight: `1px solid ${colors.secondary}` }}>
                        <div className="flex items-center gap-3 p-2 rounded opacity-50"><Home size={18} /> <span className="text-sm font-medium">Dashboard</span></div>
                        <div className="flex items-center gap-3 p-2 rounded" style={primaryStyle}><User size={18} /> <span className="text-sm font-medium">Profile</span></div>
                        <div className="flex items-center gap-3 p-2 rounded opacity-50"><Settings size={18} /> <span className="text-sm font-medium">Settings</span></div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col gap-4">
                        <h1 className="text-2xl font-bold mb-2">Resumen General</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Card 1 */}
                            <div className="p-4 rounded-lg shadow-sm" style={secondaryStyle}>
                                <h3 className="text-sm font-semibold opacity-70 mb-1">Total Users</h3>
                                <p className="text-3xl font-bold">1,234</p>
                            </div>
                            {/* Card 2 */}
                            <div className="p-4 rounded-lg shadow-sm" style={secondaryStyle}>
                                <h3 className="text-sm font-semibold opacity-70 mb-1">Active Now</h3>
                                <p className="text-3xl font-bold">567</p>
                            </div>
                            {/* Card 3 */}
                            <div className="p-4 rounded-lg shadow-sm" style={secondaryStyle}>
                                <h3 className="text-sm font-semibold opacity-70 mb-1">Revenue</h3>
                                <p className="text-3xl font-bold">$89k</p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 rounded-lg border" style={borderStyle}>
                            <h4 className="font-semibold mb-3">Actividad Reciente</h4>
                            <div className="h-2 w-full rounded mb-2 opacity-10" style={{ backgroundColor: colors.text }}></div>
                            <div className="h-2 w-3/4 rounded mb-2 opacity-10" style={{ backgroundColor: colors.text }}></div>
                            <div className="h-2 w-1/2 rounded mb-2 opacity-10" style={{ backgroundColor: colors.text }}></div>
                        </div>

                        <div className="mt-2 flex gap-2">
                            <button className="px-4 py-2 rounded text-sm font-medium shadow-sm transition-opacity hover:opacity-90" style={primaryStyle}>
                                Primary Action
                            </button>
                            <button className="px-4 py-2 rounded text-sm font-medium border" style={{ borderColor: colors.text, color: colors.text }}>
                                Secondary
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
