"use client";
import React, { useState, useEffect } from 'react';
import "./globals.css";

/*
export const metadata = {
  title: "Soporte Bachecito 26",
  description: "Desarrollado por GEMMA",
};*/

export default function RootLayout({ children }) {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <html lang="en">
      <body>
        <button className="btn-dark" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <img src="https://i.postimg.cc/90d68651/dom-1.png" /> : <img className="lunaaaa" src="https://i.postimg.cc/cLf0dypr/luna.png" />}
        </button>
        {children}
      </body>
    </html>
  );
}
