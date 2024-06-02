import React from 'react';
import Link from 'next/link';
import "./globals.css";


function Landing() {
  return (
    <div className='body-principal'>
      <div className='container'>
        <section class="banner contenedor">
          <section class="banner_title">
            <br /><br />
            <h2>Bienvenido al área <br /> de Soporte</h2>
            <Link
              href="/Cuenta"
              className="llamanos"
            > Inicio</Link>
          </section>
          <div class="banner_img">
            <br /><br /><br />
            <img src="https://i.postimg.cc/0jPzB8Y0/laptop-support.png" alt="" />
          </div>
        </section>

        <div class="burbujas">
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
          <div class="burbuja"></div>
        </div>
      </div>

    </div>
  )
}

export default Landing