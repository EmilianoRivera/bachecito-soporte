"use client"
import React, {useState, useEffect} from 'react'
import './tickets.css';
function Tickets() {
  const [tick, setTick] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/ObtenerT");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setTick(data);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);
  return (
    <div>
      {tick.map((ticketsito, index) => (
        <div key={index}>
          <p>AREA: {ticketsito.area}</p>
          <p>Correo: {ticketsito.correoA}</p>
          <p>Descripción: {ticketsito.descripcionProblema}</p>
          <p>{ticketsito.errorSeleccionado}</p>
          <p>{ticketsito.folio}</p>
          <p>{ticketsito.navegador}</p>
          <p>{ticketsito.nombre}</p>
          <p>{ticketsito.priori}</p>
          <p>{ticketsito.rutitaD}</p>
          <p>{ticketsito.sistemaOperativo}</p>
          <div className="fotografía">
          <img src={ticketsito.urlsitaD} alt={"FOTO"} style={{ width: '100%', maxHeight: '100%' }}/></div>
        </div>
      ))}
    </div>
  );
}

export default Tickets;