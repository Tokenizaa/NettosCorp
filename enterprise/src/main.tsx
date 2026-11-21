import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { agencyCatalogService } from './services/agencyCatalogService';

// Expõe o serviço de catálogo no window para permitir importação manual dos 283
// perfis via console do navegador (import-profiles-console.js) enquanto o catálogo
// não dispõe de importação automática via Supabase em produção.
declare global {
  interface Window {
    agencyCatalogService?: typeof agencyCatalogService;
  }
}
window.agencyCatalogService = agencyCatalogService;

createRoot(document.getElementById('root')!).render(<App />);
