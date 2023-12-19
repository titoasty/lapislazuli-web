import '../css/index.scss';

import { App } from 'components/App/App';
import { createRoot } from 'react-dom/client';

window.globals = {};

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
