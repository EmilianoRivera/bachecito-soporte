"use client"
import Link from 'next/link'
import React,{ useContext, useEffect}  from 'react'
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

        <section>
          <div className='wave wave1'></div>
          <div className='wave wave2'></div>
          <div className='wave wave3'></div>
          <div className='wave wave4'></div>
        </section>
      </div>
    </div>
  )
}

export default Desarrolladores