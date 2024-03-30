import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   {/* // <GoogleOAuthProvider clientId="229032397059-dgh41gson2bbvek02roal9d15n8injg1.apps.googleusercontent.com"></GoogleOAuthProvider> */}
    <App />
  </React.StrictMode>
);

