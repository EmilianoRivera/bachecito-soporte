"use client"
import React, { useState, useEffect } from 'react';
import { auth, db } from "../../../../../firebase";
import './tickets.css';
import { useRouter } from "next/navigation";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

function Gtickets() {
  const [tick, setTick] = useState([]);
  const [userData, setUserData] = useState({});
  const [userData2, setUserData2] = useState({});
  const [userData3, setUserData3] = useState({});
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null); 
  const [selectedTicket2, setSelectedTicket2] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };
  const openModal2 = (ticket) => {
    setSelectedTicket2(ticket);
    setShowModal2(true);
  };
  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };
  // Función para cerrar el modal
  const closeModal2 = () => {
    setShowModal2(false);
  };
//UID
useEffect(() => {
  if (typeof window !== "undefined") {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        fetchData(uid);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }

  async function fetchData(uid) {
    try {
      const userResponse = await fetch(`/api/Usuario/${uid}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userDatas = await userResponse.json();
      
      
      setUserData(userDatas);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}, []);
//OBTENER TICKETS
useEffect(() => {
  async function fetchData() {
    try {
      const response = await fetch("/api/TicketsTotales");
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
useEffect(() => {
  async function fetchData() {
    try {
      if (selectedTicket2) {
        // Realizar la consulta para obtener el documento del usuario asignado al ticket
        const userQuery = query(collection(db, "usuarios"), where("uid", "==", selectedTicket2.usuarioAsignado));
        const querySnapshot = await getDocs(userQuery);
        
        // Verificar si hay algún documento en el resultado de la consulta
        if (!querySnapshot.empty) {
          // Obtener el primer documento (asumiendo que solo habrá uno)
          const userDoc = querySnapshot.docs[0];
          // Establecer los datos del usuario en el estado
          setUserData2(userDoc.data());
        } else {
          console.error("User document does not exist");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchData();
}, [selectedTicket2]);
useEffect(() => {
  async function fetchData() {
    try {
      if (selectedTicket2) {
        // Realizar la consulta para obtener el documento del usuario asignado al ticket
        const userQuery = query(collection(db, "usuarios"), where("uid", "==", selectedTicket2.resueltoPor));
        const querySnapshot = await getDocs(userQuery);
        
        // Verificar si hay algún documento en el resultado de la consulta
        if (!querySnapshot.empty) {
          // Obtener el primer documento (asumiendo que solo habrá uno)
          const userDoc = querySnapshot.docs[0];
          // Establecer los datos del usuario en el estado
          setUserData3(userDoc.data());
        } else {
          console.error("User document does not exist");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchData();
}, [selectedTicket2]);


 //Fecha
  function formatTimestamp(timestamp) {
    // Verifica si timestamp es un objeto con propiedades seconds y nanoseconds
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
        // Crea una nueva instancia de Date utilizando los segundos del timestamp
        const dateObject = new Date(timestamp.seconds * 1000); // Multiplica por 1000 para convertir segundos a milisegundos
        // Formatea la fecha como una cadena legible
        return dateObject.toLocaleDateString(); // Obtener solo la fecha sin la hora
    } else {
        // Si no se puede convertir, devuelve un mensaje de error
        return "SIN FECHA";
    }
}
//HORA
function hora(timestamp) {
 // Verifica si timestamp es un objeto con propiedades seconds y nanoseconds
 if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
  // Crea una nueva instancia de Date utilizando los segundos del timestamp
  const dateObject = new Date(timestamp.seconds * 1000); // Multiplica por 1000 para convertir segundos a milisegundos
  // Opciones de formato para la hora
  const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
  };
  return dateObject.toLocaleString('en-US', options);
} else {
  return "SIN HORA";
}
}

return (
  <div className="ticket-container">
    <div className="ticket-header">
      <p className="ticket-title">Cambios en los Tickets</p>
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
        {tick.map((ticketsito, index) => (
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
              <button className="detalles" onClick={() => openModal(ticketsito)}>Detalles</button>
            </td>
            <td>
              <button className="detalles" onClick={() => openModal2(ticketsito)}>Historial</button>
            </td>
         {/*  <td>
              <button onClick={() => guardarTicketBD(ticketsito.folio, userData, ticketsito)}>Asignar</button>
        </td>*/}
           
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
          </div>
        </div>
      )}
       {showModal2 && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal2}>&times;</span>
            <p>Historial del ticket</p>
            <p>Prioridad: {selectedTicket2.priori}</p>
            <p>Area: {selectedTicket2.area}</p>
            <p>Enviado por: {selectedTicket2.nombre} - {selectedTicket2.correoA}</p>
            <p>Fecha de Envio: {formatTimestamp(selectedTicket2.fechaDeEnvio)}</p>
            <p>Hora de Envio: {hora(selectedTicket2.fechaDeEnvio)}</p>
            <p>Asignado a:  {userData2.nombre}  {userData2.apellidoPaterno} ({userData2.rol} / {userData2.tipo} )</p>
            <p>Fecha de Asignación: {formatTimestamp(selectedTicket2.fechaAsignado)}</p>
            <p>Hora de Asignación: {hora(selectedTicket2.fechaAsignado)}</p>
            <p>Resuelto por: {userData3.nombre}  {userData3.apellidoPaterno} ({userData3.rol} / {userData3.tipo} ) </p>
            <p>Fecha de Resolución: {formatTimestamp(selectedTicket2.fechaResuelto)}</p>
            <p>Hora de Resolución: {hora(selectedTicket2.fechaResuelto)}</p>
            
          </div>
        </div>
      )}
  </div>
);

}
export default Gtickets;