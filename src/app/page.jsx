import React from 'react';
import Link from 'next/link';
import "./globals.css";


function Landing() {
  return (
    <div className='body-principal'>
      <div className='container'>
        <section className="banner contenedor">
          <section className="banner_title">
            <br /><br />
            <h2>Bienvenido al área <br /> de Soporte</h2>
            <Link
              href="/Cuenta"
              className="llamanos"
            > Inicio</Link>
          </section>
          <div className="banner_img">
            <br /><br /><br />
            <img src="https://i.postimg.cc/0jPzB8Y0/laptop-support.png" alt="" />
          </div>
        </section>

        <div className="burbujas">
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
          <div className="burbuja"></div>
        </div>
      </div>

    </div>
  )
}

export default Landing