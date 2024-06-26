"use client";
import React, { useState,useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  auth,
  db,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "../../../../../firebase";
import "./tickets.css";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";

function MisTickets() {

  const textareaRef = useRef(null);
  const [userData, setUserData] = useState({});
  const [userTickets, setUserTickets] = useState([]);
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchFolio, setSearchFolio] = useState("");
  const [comment, setComment] = useState("");
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCommentModal2, setShowCommentModal2] = useState(false);

  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
    textareaRef.current.scrollHeight + "px";
  }

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openCommentModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowCommentModal(true);
  };
  const openCommentModal2 = (ticket) => {
    setSelectedTicket(ticket);
    setShowCommentModal2(true);
  };
  const closeCommentModal = () => {
    setShowCommentModal(false);
  };
  const closeCommentModal2 = () => {
    setShowCommentModal2(false);
  };

  async function fetchData(uid) {
    try {
      const baseURL = process.env.NEXT_PUBLIC_RUTA_U;
      const baseURL2 = process.env.NEXT_PUBLIC_RUTA_TT;
      const Uid = enc(uid);

      const userResponse = await fetch(`${baseURL}/${encodeURIComponent(Uid)}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      const userDesc = desc(userData);
      setUserData(userDesc);

      const ticketsResponse = await fetch(`${baseURL2}`);
      if (!ticketsResponse.ok) {
        throw new Error("Failed to fetch user tickets");
      }
      const allTickets = await ticketsResponse.json();
      const ticketsDesc = allTickets.map((rep) => desc(rep));

      // Ensure userDesc.foliosGuardados is defined and an array
      if (Array.isArray(userDesc.foliosGuardados)) {
        const userTick = ticketsDesc.filter((ticket) =>
          userDesc.foliosGuardados.includes(ticket.folio)
        );
        setUserTickets(userTick);
      } else {
        console.error(
          "userDesc.foliosGuardados is not an array or is undefined"
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

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
    if (timestamp && timestamp.seconds && timestamp.nanoseconds) {
      const dateObject = new Date(timestamp.seconds * 1000);
      return dateObject.toLocaleDateString();
    } else {
      return "No se puede convertir el timestamp";
    }
  }

  const cambiarEstado = async (folio, comment) => {
    try {
      const ticketQuery = query(
        collection(db, "tickets"),
        where("folio", "==", folio)
      );
      const ticketQuerySnapshot = await getDocs(ticketQuery);
      const ticketDocRef = ticketQuerySnapshot.docs[0].ref;
      await updateDoc(ticketDocRef, {
        estado: "Resuelto",
        fechaResuelto: new Date(),
        comentario: comment,
      });

      const updatedTickets = userTickets.map((ticket) =>
        ticket.folio === folio
          ? { ...ticket, estado: "Resuelto", comentario: comment }
          : ticket
      );
      setUserTickets(updatedTickets);
      closeCommentModal();
    } catch (error) {
      console.error("Error al cambiar el estado del ticket:", error);
    }
  };
  const cambiarEstado2 = async (folio, comment) => {
    try {
      const ticketQuery = query(
        collection(db, "tickets"),
        where("folio", "==", folio)
      );
      const ticketQuerySnapshot = await getDocs(ticketQuery);
      const ticketDocRef = ticketQuerySnapshot.docs[0].ref;
      await updateDoc(ticketDocRef, {
        estado: "Resuelto",
        fechaSReapertura: new Date(),
        comentarioR: comment,
      });

      const updatedTickets = userTickets.map((ticket) =>
        ticket.folio === folio
          ? { ...ticket, estado: "Resuelto", comentario: comment }
          : ticket
      );
      setUserTickets(updatedTickets);
      closeCommentModal2();
    } catch (error) {
      console.error("Error al cambiar el estado del ticket:", error);
    }
  };
  const filteredTickets = userTickets.filter((ticket) => {
    return (
      (filterPriority ? ticket.priori === filterPriority : true) &&
      (filterStatus ? ticket.estado === filterStatus : true) &&
      (searchFolio ? ticket.folio.includes(searchFolio) : true)
    );
  });

  return (
    <div className="body-tickets-dev">
      <div className="ticket-container">
        <div className="ticket-header">
          <p className="ticket-title">🏷️ TUS TICKETS 🏷️</p>
          <div className="filters">
            <div className="select">
              <select
                onChange={(e) => setFilterPriority(e.target.value)}
                value={filterPriority}
              >
                <option value="">Todas las Prioridades</option>
                <option value="ALTA">ALTA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="BAJA">BAJA</option>
              </select>
            </div>
            <div className="select">
              <select
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
              >
                <option value="">Todos los Estados</option>
                <option value="Asignado">Asignado</option>
                <option value="Resuelto">Resuelto</option>
                <option value="Reabierto">Reabierto</option>
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
        </div>
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
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticketsito, index) => (
              <tr key={index} className="ticket-body">
                <td className="folio">{ticketsito.folio}</td>
                <td>{ticketsito.areas}</td>
                <td>{ticketsito.dP}</td>
                <td>{formatTimestamp(ticketsito.fechaDeEnvio)}</td>
                <td>{ticketsito.estado}</td>
                <td>{ticketsito.priori}</td>
                <td>{ticketsito.rutaE}</td>
                <td>
                  <button
                    className="detalles"
                    onClick={() => openModal(ticketsito)}
                  >
                    Gestionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="titul">
            <p id="titulin">Detalles del ticket 📑</p>
          </div>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <table className="table-content">
              <tr>
                <td className="tdsito1">
                  <p className="psito">Fecha de Envío: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">
                    {formatTimestamp(selectedTicket.fechaDeEnvio)}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Prioridad: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.priori}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Folio: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.folio}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Área: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.areas}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Administrador: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.nom}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Correo: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.corr}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Navegador: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.navegador}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Sistema Operativo: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.sistemaOperativo}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Tipo de error: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.errorE}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Ruta: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.rutaE}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Descripción: </p>
                </td>
                <td className="tdsito2">
                  <p className="p">{selectedTicket.dP}</p>
                </td>
              </tr>
              <tr>
                <td className="tdsito1">
                  <p className="psito">Fotografía: </p>
                </td>
                <td className="tdsito2">
                  <div className="fotografía">
                    <img
                      src={selectedTicket.foto}
                      alt={"FOTO"}
                      style={{ width: "100%", maxHeight: "100%" }}
                    />
                  </div>
                </td>
              </tr>
            </table>
            <br />
            {selectedTicket.estado === "Asignado" && (
              <button className= "ticket-button" onClick={() => openCommentModal(selectedTicket)}>
                Resuelto
              </button>
            )}
            <br />
            {selectedTicket.estado === "Reabierto" && (
              <button className= "ticket-button"onClick={() => openCommentModal2(selectedTicket)}>
                Resuelto 2
              </button>

            )}
          </div>
        </div>
      )}
      {showCommentModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeCommentModal}>
              &times;
            </span>
            <p>¿Deseas agregar un comentario?</p>
            <div className="wrapper">
              <textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Agrega tu comentario aquí..."
            />
            </div>
            
            <button
              id="btn-resuelto"
              className= "ticket-buttonn"
              onClick={() => cambiarEstado(selectedTicket.folio, comment)}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
      {showCommentModal2 && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeCommentModal2}>
              &times;
            </span>
            <p>¿Deseas agregar un comentario?2</p>
            <br />
            <div className="wrapper">
              <textarea
              rows="1" // Esto evita que el textarea se ajuste automáticamente en altura
              cols="50"
              style={{ resize: "none" }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Agrega tu comentario aquí..."
            />
            </div>
            
            <br /><br /><br/>
            <button
              id="btn-resuelto"
              className= "ticket-button"
              onClick={() => cambiarEstado2(selectedTicket.folio, comment)}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisTickets;
