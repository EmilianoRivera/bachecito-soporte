"use client"
import Link from 'next/link'
import React from 'react'
import { auth } from "../../../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import "./style.css";

function Desarrolladores() {
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
    <div className='bodyDev'>
      <div className='containerDev'>
        <h1>Bienvenido equipo de soporte 🛠️</h1>
        
        <br />
        <div className='opcionesDev'>
          <Link className="link" href="/Cuenta/Desarrolladores/MisTickets">MIS TICKETS</Link>
          <br />
          <Link className="link" href="/Cuenta/Desarrolladores/Ticketsito">TICKETS</Link>
          <br></br>
          <button onClick={CerrarSesion}> CERRAR SESIÓN </button>
        </div>
      </div>
    </div>
  )
}

export default Desarrolladores