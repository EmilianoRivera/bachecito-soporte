"use client"
import Link from 'next/link';
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
        <div className="container">  
            <h1>BIENVENIDO SUPER ADMIN</h1>
            <br></br>
            <a href="/Cuenta/SuperAdmin/GestionDevs"> GESTION DEVS </a>  
            <br></br>
            <a href="/Cuenta/SuperAdmin/NuevoDev"> NUEVOS DEVS </a>  
            <br></br>
            <a href="/Cuenta/SuperAdmin/GestionTickets"> GESTION TICKETS </a>  
            <br></br>
            <a onClick={CerrarSesion}> CERRAR SESION </a>  
        </div>
    );
}

export default SuperAdmin;
