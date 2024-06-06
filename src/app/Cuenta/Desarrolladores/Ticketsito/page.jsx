"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../../../../firebase";
import "./tickets.css";
import { enc, desc } from "@/scripts/Cifrado/Cifrar";
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
  const [filterPriority, setFilterPriority] = useState("");
  const [searchFolio, setSearchFolio] = useState("");
  const [tick, setTick] = useState([]);
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          const uid = user.uid;
          fetchUserData(uid);
        } else {
          router.push("/login");
        }
      });
      return () => unsubscribe();
    }
  }, []);

  async function fetchUserData(uid) {
    try {
      const Uid = enc(uid);
      const baseURL = process.env.NEXT_PUBLIC_RUTA_U;
      const userResponse = await fetch(`${baseURL}/${encodeURIComponent(Uid)}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userDatas = await userResponse.json();
      const descUser = desc(userDatas);
      setUserData(descUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    async function fetchTickets() {
      try {
        const baseURL = process.env.NEXT_PUBLIC_RUTA_OT;
        const response = await fetch(`${baseURL}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const dataDesc = data.map((rep) => desc(rep));
        const unassignedTickets = dataDesc.filter(
          (ticket) => ticket.estado === "Sin asignar"
        );
        setTick(unassignedTickets);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }

    fetchTickets();
  }, []);

  function formatTimestamp(timestamp) {
    if (timestamp && timestamp.seconds) {
      const dateObject = new Date(timestamp.seconds * 1000);
      return dateObject.toLocaleDateString();
    } else {
      return "No se puede convertir el timestamp";
    }
  }

  const guardarTicketBD = async (folio, userData, ticketsito) => {
    try {
      if (userData && userData.uid) {
        const userQuery = query(
          collection(db, "usuarios"),
          where("uid", "==", userData.uid)
        );
        const userQuerySnapshot = await getDocs(userQuery);
        if (!userQuerySnapshot.empty) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const foliosGuardadosAnteriores = userData.foliosGuardados || [];

            if (
              (userData.tipo === "Frontend" && ticketsito.areas === "Frontend") ||
              (userData.tipo === "Backend" && ticketsito.areas === "Backend")
            ) {
              if (foliosGuardadosAnteriores.includes(folio)) {
                console.log("El folio ya ha sido guardado anteriormente.");
                return;
              }

              const nuevosFoliosGuardados = [
                ...foliosGuardadosAnteriores,
                folio,
              ];

              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });

              const ticketQuery = query(
                collection(db, "tickets"),
                where("folio", "==", ticketsito.folio)
              );

              const ticketQuerySnapshot = await getDocs(ticketQuery);
              if (!ticketQuerySnapshot.empty) {
                const ticketDocRef = ticketQuerySnapshot.docs[0].ref;
                const camposActualizados = {
                  usuarioAsignado: userData.uid,
                  fechaAsignado: new Date(),
                  estado: "Asignado",
                };

                await updateDoc(ticketDocRef, camposActualizados);
                console.log(
                  "Usuario asignado y fecha de asignación actualizados en el documento del ticket."
                );

                const updatedTick = tick.filter((t) => t.folio !== folio);
                setTick(updatedTick);
              }
            } else {
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

  const handlePriorityFilter = (e) => {
    e.preventDefault();
    setFilterPriority(e.target.value);
  };

  const filteredTickets = tick.filter((ticketsito) => {
    if (searchFolio) {
      return ticketsito.folio.includes(searchFolio);
    } else {
      const isAreaMatch =
        (userData.tipo === "Backend" && ticketsito.areas === "Backend") ||
        (userData.tipo === "Frontend" && ticketsito.areas === "Frontend");

      const isPriorityMatch =
        !filterPriority || ticketsito.priori === filterPriority;

      return isAreaMatch && isPriorityMatch;
    }
  });

  return (
    <div className="body-ticketsito-dev">
      <div className="ticket-container">
        <div className="ticket-header">
          <p className="ticket-title">🏷️ Tickets de Soporte 🛠️</p>
        </div>
        <div className="filtritos">
          <div className="select">
            <select onChange={handlePriorityFilter} value={filterPriority}>
              <option value="">Todas las Prioridades</option>
              <option value="ALTA">ALTA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="BAJA">BAJA</option>
            </select>
          </div>
          <input
            className="buscador"
            type="text"
            placeholder="Buscar por folio"
            value={searchFolio}
            onChange={(e) => setSearchFolio(e.target.value)}
          />
        </div>
        <br />
        <table>
          <thead>
            <tr className="sticky-top">
              <th>Folio</th>
              <th>Área</th>
              <th>Descripción</th>
              <th>Fecha de envío</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Ruta</th>
              <th>Detalles</th>
              <th>Asignar</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="9">No existen tickets que coincidan con la búsqueda</td>
              </tr>
            ) : (
              filteredTickets.map((ticketsito, index) => (
                <tr key={index} className="ticket-body">
                  <td className="folio">{ticketsito.folio}</td>
                  <td>{ticketsito.areas}</td>
                  <td>{ticketsito.dP}</td>
                  <td>{formatTimestamp(ticketsito.fechaDeEnvio)}</td>
                  <td>{ticketsito.estado}</td>
                  <td>{ticketsito.priori}</td>
                  <td>{ticketsito.rutaE}</td>
                  <td>
                    <button className="detalles" onClick={() => openModal(ticketsito)}>Detalles</button>
                  </td>
                  <td>
                    <button className="asignar" onClick={() => guardarTicketBD(ticketsito.folio, userData, ticketsito)}>Asignar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && selectedTicket && (
        <div className="modal">
          <div className="titul">
            <p id="titulinn">Detalles del ticket 📑</p>
          </div>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <table className="table-content">
              <tbody>
                <tr>
                  <td className="tdsito1"><p className="psito">Fecha de Envio: </p></td>
                  <td className="tdsito2"><p className="p">{formatTimestamp(selectedTicket.fechaDeEnvio)}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Prioridad: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.priori}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Folio: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.folio}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Área: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.areas}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Admin: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.nom}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Correo: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.corr}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Navegador: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.navegador}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Sistema Operativo: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.sistemaOperativo}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Tipo de error: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.errorE}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Ruta: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.rutaE}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Descripción: </p></td>
                  <td className="tdsito2"><p className="p">{selectedTicket.dP}</p></td>
                </tr>
                <tr>
                  <td className="tdsito1"><p className="psito">Fotografía</p></td>
                  <td className="tdsito2">
                    <div className="fotografía">
                      <img src={selectedTicket.foto} alt={"FOTO"} style={{ width: "100%", maxHeight: "100%" }} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;
