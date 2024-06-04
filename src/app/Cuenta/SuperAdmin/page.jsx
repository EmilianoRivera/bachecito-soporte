"use client"
import React from 'react';
import { auth } from "../../../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import "./style.css"
// Importar los estilos CSS

function SuperAdmin() {
  const router = useRouter();
  const CerrarSesion = () => {
    signOut(auth)
      .then(() => {
        console.log("Cierre de sesión exitoso");
        router.push("/Cuenta");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }

  return (
    <div className="bodySuperAdmin">
      <div className='containerSuperAdmin'>
        <br/>
        <h1>BIENVENIDO SUPER ADMIN 🐜</h1>

        <p>¿Qué deseas hacer hoy? 👀</p>

        <br/><br/>

        <div className="opcionesSuperAdmin">
          <a href="/Cuenta/SuperAdmin/NuevoDev"> NUEVOS DEVS </a>
          <br></br>
    {/*       <a href="/Cuenta/SuperAdmin/GestionDevs"> GESTIÓN DEVS </a>
          <br></br> */}
          <a href="/Cuenta/SuperAdmin/GestionTickets"> GESTIÓN TICKETS </a>
          <br></br>
          <a onClick={CerrarSesion}> CERRAR SESIÓN </a>
        </div>

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
  );
}

export default SuperAdmin;

