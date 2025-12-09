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

                <div className="flex gap-6 h-full font-sans">
                    {/* Mock Sidebar */}
                    <div className="w-12 md:w-48 hidden md:flex flex-col gap-4 pr-4" style={{ borderRight: `1px solid ${colors.secondary}` }}>
                        <div className="flex items-center gap-3 p-2 rounded opacity-50"><Home size={18} /> <span className="text-sm font-medium">Dashboard</span></div>
                        <div className="flex items-center gap-3 p-2 rounded" style={primaryStyle}><User size={18} /> <span className="text-sm font-medium">Profile</span></div>
                        <div className="flex items-center gap-3 p-2 rounded opacity-50"><Settings size={18} /> <span className="text-sm font-medium">Settings</span></div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col gap-6 overflow-hidden">

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Stats */}
                            <div className="p-4 rounded-lg shadow-sm" style={secondaryStyle}>
                                <h3 className="text-xs font-semibold opacity-70 mb-1 uppercase tracking-wider">Total Users</h3>
                                <p className="text-2xl font-bold">1,234</p>
                            </div>
                            <div className="p-4 rounded-lg shadow-sm" style={secondaryStyle}>
                                <h3 className="text-xs font-semibold opacity-70 mb-1 uppercase tracking-wider">Active Now</h3>
                                <p className="text-2xl font-bold">567</p>
                            </div>
                            <div className="p-4 rounded-lg shadow-sm" style={secondaryStyle}>
                                <h3 className="text-xs font-semibold opacity-70 mb-1 uppercase tracking-wider">Revenue</h3>
                                <p className="text-2xl font-bold">$89k</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Forms Section */}
                            <div className="p-4 rounded-lg border flex flex-col gap-3 shadow-sm bg-opacity-50" style={{ borderColor: colors.secondary }}>
                                <h4 className="font-semibold text-sm mb-1">Configuración</h4>
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium opacity-80">Nombre del Proyecto</label>
                                        <div className="h-9 w-full rounded border px-3 flex items-center text-sm opacity-80" style={{ borderColor: colors.secondary, backgroundColor: colors.background }}>
                                            Dashboard V2
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: colors.text, backgroundColor: colors.primary }}>
                                            <div className="w-2 h-2 bg-white rounded-sm" />
                                        </div>
                                        <span className="text-sm">Notificaciones activas</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60">
                                        <div className="w-4 h-4 rounded border" style={{ borderColor: colors.text }} />
                                        <span className="text-sm">Modo Oscuro</span>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t flex gap-2" style={{ borderColor: colors.secondary }}>
                                    <button className="px-3 py-1.5 rounded text-xs font-medium shadow-sm" style={primaryStyle}>Guardar</button>
                                    <button className="px-3 py-1.5 rounded text-xs font-medium opacity-70 hover:opacity-100 border" style={{ borderColor: colors.secondary }}>Cancelar</button>
                                </div>
                            </div>

                            {/* Alert & Table Section */}
                            <div className="flex flex-col gap-4">
                                {/* Alerts */}
                                <div className="p-3 rounded-lg border border-l-4 flex flex-col gap-1" style={{ backgroundColor: colors.secondary, borderColor: colors.primary, borderLeftColor: colors.primary }}>
                                    <h5 className="text-xs font-bold flex items-center gap-2" style={{ color: colors.text }}><Bell size={12} /> Nueva Actualización</h5>
                                    <p className="text-xs opacity-80">El sistema se ha actualizado correctamente.</p>
                                </div>

                                {/* Table */}
                                <div className="border rounded-lg overflow-hidden text-sm" style={{ borderColor: colors.secondary }}>
                                    <div className="p-2 border-b bg-opacity-10 font-medium text-xs opacity-70" style={{ borderColor: colors.secondary, backgroundColor: colors.secondary }}>
                                        Últimos Accesos
                                    </div>
                                    <div className="p-2 border-b flex justify-between items-center" style={{ borderColor: colors.secondary }}>
                                        <span>User_01</span>
                                        <span className="opacity-50 text-xs">2 min ago</span>
                                    </div>
                                    <div className="p-2 flex justify-between items-center">
                                        <span>User_02</span>
                                        <span className="opacity-50 text-xs text-red-500 font-bold">Offline</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
