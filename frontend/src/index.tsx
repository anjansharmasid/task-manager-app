import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root with proper TypeScript typing
const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);