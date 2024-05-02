"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { auth, db, updateDoc, query, collection, where, getDocs } from "../../../../../firebase";
import './tickets.css';
function MisTickets() {
  const [userData, setUserData] = useState({});
  const [userTickets, setUserTickets] = useState([]);
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };

  async function fetchData(uid) {
    try {
      const userResponse = await fetch(`/api/Usuario/${uid}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      setUserData(userData);

      // Obtener los tickets guardados por el usuario
      const ticketsResponse = await fetch("/api/TicketsTotales");
      if (!ticketsResponse.ok) {
        throw new Error("Failed to fetch user tickets");
      }
      const allTickets = await ticketsResponse.json();

      // Filtrar los tickets que están en el array de folios guardados del usuario
      const userTickets = allTickets.filter(ticketsito => userData.foliosGuardados.includes(ticketsito.folio));
      setUserTickets(userTickets);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Obtener los datos del usuario y sus tickets al cargar el componente
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        fetchData(uid);
      } else {
        router.push("/Cuenta");
      }
    });
    return () => unsubscribe();
  }, []);

  function formatTimestamp(timestamp) {
    // Verifica si timestamp es un objeto con propiedades seconds y nanoseconds
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
        // Crea una nueva instancia de Date utilizando los segundos del timestamp
        const dateObject = new Date(timestamp.seconds * 1000); // Multiplica por 1000 para convertir segundos a milisegundos
        // Formatea la fecha como una cadena legible
        return dateObject.toLocaleDateString(); // Obtener solo la fecha sin la hora
    } else {
        // Si no se puede convertir, devuelve un mensaje de error
        return "No se puede convertir el timestamp";
    }
}

const cambiarEstado = async (folio, userData) => {
  try {
    const ticketQuery = query(
      collection(db, "tickets"),
      where("folio", "==", folio)
    );
    const ticketQuerySnapshot = await getDocs(ticketQuery);
    const ticketDocRef = ticketQuerySnapshot.docs[0].ref;
    await updateDoc(ticketDocRef, { 
      estado: 'Resuelto', 
      fechaResuelto: new Date(),
      resueltoPor: userData.uid
     });
    // Actualizar localmente el estado del ticket
    const updatedTickets = userTickets.map(ticket =>
      ticket.folio === folio ? { ...ticket, estado: 'Resuelto' } : ticket
    );
    setUserTickets(updatedTickets);
    closeModal(); 
  } catch (error) {
    console.error('Error al cambiar el estado del ticket:', error);
  }
};
  return (
    <div className="ticket-container">
    <div className="ticket-header">
      <p className="ticket-title">TUS TICKETS</p>
    </div>
    <table>
    <thead>
                    <tr className='sticky-top'>
                    <th>Folio</th>

                        <th>Area</th>
                        <th>Descripcion</th>
                        <th>Fecha de envio</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Ruta</th>
                    </tr>
                </thead>
      <tbody>
        {userTickets.map((ticketsito, index) => (
          <tr key={index} className="ticket-body">
            <td className="folio">{ticketsito.folio}</td>
            <td>{ticketsito.area}</td>
            <td>{ticketsito.descripcionProblema}</td>
            <td>{formatTimestamp(ticketsito.fechaDeEnvio)}</td>    
            <td>{ticketsito.estado}</td>      
            <td>{ticketsito.priori}</td>
            <td>{ticketsito.rutitaD}</td>
            <td>
            </td>
            <td>
              <button className="detalles" onClick={() => openModal(ticketsito)}>Gestionar</button>
            </td>           
          </tr>
        ))}
      </tbody>
    </table>
    {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>Detalles del ticket</p>
            <p>Fecha de Envio: {formatTimestamp(selectedTicket.fechaDeEnvio)}</p>
            <p>Prioridad: {selectedTicket.priori}</p>
            <p>Folio: {selectedTicket.folio}</p>
            <p>Area: {selectedTicket.area}</p>
            <p>Admin: {selectedTicket.nombre}</p>
            <p>Correo: {selectedTicket.correoA}</p>
            <p>Navegador: {selectedTicket.navegador}</p>
            <p>Sistema Operativo: {selectedTicket.sistemaOperativo}</p>
            <p>Tipo de error: {selectedTicket.errorSeleccionado}</p>
            <p>Ruta: {selectedTicket.rutitaD}</p>
            <p>Descripción: {selectedTicket.descripcionProblema}</p>
            <div className="fotografía">
                <img src={selectedTicket.url} alt={"FOTO"} style={{ width: '100%', maxHeight: '100%' }} />
        </div>  
        {selectedTicket.estado !== 'Resuelto' && (
        <button onClick={() => cambiarEstado(selectedTicket.folio, userData)}>Resuelto</button>
      )}
          </div>
        </div>
      )}
  </div>
  );
}

export default MisTickets;
