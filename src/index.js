import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import "./styles/index.scss";
import "./firebase.config"
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
          <App />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);

