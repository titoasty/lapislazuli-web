import '../css/index.scss';

import { App } from 'components/App/App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

window.globals = {};

const root = createRoot(document.getElementById('app')!);
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
