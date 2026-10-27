// Mounts the car dashboard when its browser page opens.
import { createRoot } from 'react-dom/client';

import { App } from '#car-dashboard/App.tsx';
import { assertRootElement } from '#common/utils/assert-root-element.ts';

const root = document.getElementById('root');

assertRootElement(root);

createRoot(root).render(<App />);
