import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../src/assets/css/style.css';

import $ from 'jquery';
window.$ = window.jQuery = $;


import '../src/assets/js/index.js'
import '../src/assets/js/owl.carousel.js'
import { GoogleOAuthProvider } from "@react-oauth/google";




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="247306035624-edqbirrgmm28mf3nm1t6759b65mbpldb.apps.googleusercontent.com">
       <App />
    </GoogleOAuthProvider>
    
  </StrictMode>
)
