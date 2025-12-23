import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * PONTO DE ENTRADA DO APLICATIVO (Entry Point)
 * Este arquivo é responsável por "acordar" o React e injetá-lo no HTML.
 */

// Busca o elemento <div id="root"> dentro do index.html
const rootElement = document.getElementById('root');

// Garantia de segurança: Se o elemento não existir, o app trava com um erro claro
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root para montar a aplicação.");
}

// Cria a raiz do React usando a nova API do React 18+
const root = ReactDOM.createRoot(rootElement);

// Renderiza o componente principal <App /> dentro do modo estrito (ajuda a achar bugs em desenvolvimento)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);