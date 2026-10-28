// Mounts the weather dashboard when its browser page opens.
import { createRoot } from 'react-dom/client';

import { assertRootElement } from '#common/utils/assert-root-element.ts';
import { App } from '#weather-dashboard/App.tsx';

const root = document.getElementById('root');

assertRootElement(root);

createRoot(root).render(<App />);
