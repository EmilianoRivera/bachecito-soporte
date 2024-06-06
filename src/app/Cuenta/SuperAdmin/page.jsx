"use client";
import React, { useContext, useEffect } from 'react';
import { auth } from "../../../../firebase";
import AuthContext from "../../../../context/AuthContext";
import { useAuthUser } from "../../../../hooks/useAuthUser";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import "./style.css";

function SuperAdmin() {
  useAuthUser();
  const { isLogged } = useContext(AuthContext);

  const router = useRouter();
  
  useEffect(() => {
    if (!isLogged || !auth.currentUser?.emailVerified) {
      router.push("/Cuenta");
    }
  }, [isLogged, auth.currentUser]);

  const CerrarSesion = () => {
    signOut(auth)
      .then(() => {
        console.log("Cierre de sesión exitoso");
        router.push("/Cuenta");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  if (!isLogged || !auth.currentUser?.emailVerified) {
    return null; // O puedes mostrar un mensaje de "No autorizado"
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
          {/* <a href="/Cuenta/SuperAdmin/GestionDevs"> GESTIÓN DEVS </a>
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
