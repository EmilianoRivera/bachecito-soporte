import Link from 'next/link'
import React from 'react'

function Desarrolladores() {
  return (
    <div>
      Bienvenido equipo de soporte, que desean hacer hoy?
      <br/>
      <Link href="/Cuenta/Desarrolladores/MisTickets">Mis tickets</Link>
      <br/>
      <Link href="/Cuenta/Desarrolladores/Ticketsito">Tickets</Link>
    </div>
  )
}

export default Desarrolladores