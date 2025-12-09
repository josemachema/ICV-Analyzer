import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { DashboardAstigmatismo } from './components/DashboardAstigmatismo';
import { DashboardMiopia } from './components/DashboardMiopia';
import { DashboardAccesible } from './components/DashboardAccesible';

type AppMode = 'normal' | 'astigmatism' | 'miopia' | 'accessible';

function App() {
  const [mode, setMode] = useState<AppMode>('normal');

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
  };

  return (
    <>
      {mode === 'normal' && (
        <Dashboard
          onModeChange={handleModeChange}
          currentMode="normal"
        />
      )}
      {mode === 'astigmatism' && (
        <DashboardAstigmatismo
          onModeChange={handleModeChange}
          currentMode="astigmatism"
        />
      )}
      {mode === 'miopia' && (
        <DashboardMiopia
          onModeChange={handleModeChange}
          currentMode="miopia"
        />
      )}
      {mode === 'accessible' && (
        <DashboardAccesible
          onModeChange={handleModeChange}
          currentMode="accessible"
        />
      )}
    </>
  );
}

export default App;
