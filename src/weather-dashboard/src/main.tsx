import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
if (!root) throw new Error('No #root element');

createRoot(root).render(<div>TEST WEATHER DASHBOARD</div>);
