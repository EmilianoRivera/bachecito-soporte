"use client";
import React from 'react';
import './navbar.css';

const Navbar = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <nav>
      <ul>
        <li><a href="#" onClick={goBack}>Atrás</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
