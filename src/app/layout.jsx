"use client";
import React, { useState, useEffect } from 'react';
import "./globals.css";
import Navbar from '../components/navbar';

/*
export const metadata = {
  title: "Soporte Bachecito 26",
  description: "Desarrollado por GEMMA",
};
*/

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Recuperar el estado de localStorage al montar el componente
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Aplicar la clase correspondiente al cuerpo del documento
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }

    // Guardar el estado en localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <html lang="es">
      <body>
        <div>
          <Navbar />
        </div>
        <button className="btn-dark" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <img src="https://i.postimg.cc/90d68651/dom-1.png" alt="Light Mode" /> : <img className="lunaaaa" src="https://i.postimg.cc/cLf0dypr/luna.png" alt="Dark Mode" />}
        </button>
        {children}
      </body>
    </html>
  );
}
