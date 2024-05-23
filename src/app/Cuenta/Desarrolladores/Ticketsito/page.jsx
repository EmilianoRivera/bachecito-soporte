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

function Tickets() {
  const [tick, setTick] = useState([]);
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
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
  //Convertir timestamp
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
  //FOLIOS
  const guardarTicketBD = async (folio, userData, ticketsito) => {
    try {
      console.log(folio, " ", userData);

      // Verificar si userData no es null y tiene la propiedad uid
      if (userData && userData.uid) {
        // Realizar una consulta para encontrar el documento del usuario
        const userQuery = query(
          collection(db, "usuarios"),
          where("uid", "==", userData.uid)
        );

        // Obtener el resultado de la consulta
        const userQuerySnapshot = await getDocs(userQuery);

        // Verificar si se encontró algún documento
        if (!userQuerySnapshot.empty) {
          // Obtener la referencia al primer documento encontrado
          const userDocRef = userQuerySnapshot.docs[0].ref;

          // Obtener el documento del usuario
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // Obtener los datos actuales del documento del usuario
            const userData = userDocSnap.data();
            const foliosGuardadosAnteriores = userData.foliosGuardados || [];

            // Verificar si el usuario tiene el mismo tipo de área que el ticket
            if ((userData.tipo === "Frontend" && ticketsito.area === "Frontend") ||
              (userData.tipo === "Backend" && ticketsito.area === "Backend")) {

              // Verificar si el folio ya ha sido guardado previamente
              if (foliosGuardadosAnteriores.includes(folio)) {
                console.log("El folio ya ha sido guardado anteriormente.");
                return; // Salir de la función si el folio ya está guardado
              }

              // Agregar el nuevo folio al array de folios guardados
              const nuevosFoliosGuardados = [
                ...foliosGuardadosAnteriores,
                folio,
              ];

              // Actualizar el documento del usuario con el nuevo array de folios
              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });

              const ticketQuery = query(
                collection(db, "tickets"),
                where("folio", "==", ticketsito.folio)
              );

              const ticketQuerySnapshot = await getDocs(ticketQuery);
              const estadito = "Asignado";
              if (!ticketQuerySnapshot.empty) {
                const ticketDocRef = ticketQuerySnapshot.docs[0].ref;

                // Crear el objeto con los campos a actualizar
                const camposActualizados = {
                  usuarioAsignado: userData.uid,
                  fechaAsignado: new Date(),
                  estado: estadito
                };

                // Actualizar solo los campos especificados en el documento del ticket
                await updateDoc(ticketDocRef, camposActualizados);

                console.log("Usuario asignado y fecha de asignación actualizados en el documento del ticket.");
                const rows = document.querySelectorAll('.ticket-body');
                rows.forEach((row) => {
                  if (row.querySelector('.folio').textContent === folio) {
                    row.remove();
                  }
                });
              }
            } else {
              // Si el área del ticket no coincide con el área del usuario, mostrar alerta
              alert("LO SENTIMOS, NO ES DE TU AREA");
            }

            console.log("Folio guardado en la base de datos del usuario.");
          } else {
            console.error("El documento del usuario no existe en la base de datos.");
          }
        } else {
          console.error("No se encontró ningún documento de usuario que contenga el UID proporcionado.");
        }
      } else {
        console.error("No se proporcionaron datos de usuario válidos.");
      }
    } catch (error) {
      console.error("Error al guardar el folio en la base de datos:", error);
    }
  };


  return (
    <div className='body-ticketsito-dev'>
      <div className="ticket-container">
        <div className="ticket-header">
          <p className="ticket-title">Tickets de Soporte 🛠️</p>
        </div>

        <div className='container-table'>
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
                    <button className="detalles" onClick={() => openModal(ticketsito)}>Detalles</button>
                  </td>
                  <td>
                    <button className="asignar" onClick={() => guardarTicketBD(ticketsito.folio, userData, ticketsito)}>Asignar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p id='titulinn'>Detalles del ticket 📑</p>
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
    </div>

  );

}
export default Tickets;