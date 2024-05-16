"use client"
import Link from 'next/link'
import React from 'react'
import { auth } from "../../../../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
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
    <div>
      Bienvenido equipo de soporte, que desean hacer hoy?
      <br/>
      <Link href="/Cuenta/Desarrolladores/MisTickets">Mis tickets</Link>
      <br/>
      <Link href="/Cuenta/Desarrolladores/Ticketsito">Tickets</Link>
      <br></br>
      <button onClick={CerrarSesion}> CERRAR SESION </button>  
    </div>
  )
}

export default Desarrolladores