import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {TranslationProvider} from './i18n';
import {CurrencyProvider} from './CurrencyContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TranslationProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </TranslationProvider>
    </BrowserRouter>
  </StrictMode>,
);
