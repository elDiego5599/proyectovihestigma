import { useEffect, useState } from 'react';
import { Presentation } from './components/Presentation';
import { SimulationScreen } from './components/SimulationScreen';

const MODE_KEY = 'mito-realidad-modo';
type Mode = 'slides' | 'activity';

function loadMode(): Mode {
  try {
    return localStorage.getItem(MODE_KEY) === 'activity' ? 'activity' : 'slides';
  } catch {
    return 'slides';
  }
}

export default function App() {
  const [mode, setMode] = useState<Mode>(loadMode);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* ignorar */
    }
  }, [mode]);

  return mode === 'slides' ? (
    <Presentation onStart={() => setMode('activity')} />
  ) : (
    <SimulationScreen onPresentation={() => setMode('slides')} />
  );
}
