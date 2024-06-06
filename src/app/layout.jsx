"use client"
import React, { useState, useEffect } from 'react';
import "./globals.css";
import Navbar from '../components/navbar';
import { ContextAuthProvider } from '../../context/AuthContext';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

 

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <html lang="es">
      <body>
        <ContextAuthProvider>
          <div>
            <Navbar />
          </div>
          <button className="btn-dark" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <img src="https://i.postimg.cc/90d68651/dom-1.png" alt="Light Mode" /> : <img className="lunaaaa" src="https://i.postimg.cc/cLf0dypr/luna.png" alt="Dark Mode" />}
          </button>
          {children}
        </ContextAuthProvider>
      </body>
    </html>
  );
}
