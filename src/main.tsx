import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import App from './App';
import { api } from '@/lib/api';
import './index.css';

try {
  api.getDb();
} catch (e) {
  console.warn('DB init failed, clearing storage:', e);
  localStorage.removeItem('helpdesk_db_v2');
  api.getDb();
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element #root not found');
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
