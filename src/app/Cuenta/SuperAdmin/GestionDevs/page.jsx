"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../../../../firebase";
import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import "./gestionDevs.css";

function GestionDevs() {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  async function fetchTicket(folio) {
    try {
      const ticketResponse = await fetch(`/api/TicketUnico/${folio}`);
      if (!ticketResponse.ok) {
        throw new Error("Failed to fetch ticket data");
      }
      const ticketDatas = await ticketResponse.json();
      console.log(ticketDatas)
      setSelectedTicket(ticketDatas);
    } catch (error) {
      console.error("Hubo un error", error);
    }
  }

  const openModal = (folio) => {
    fetchTicket(folio);

    setSelectedTicket(folio);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await fetch("/api/DevsGeneral");
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userDatas = await userResponse.json();

        setUserData(userDatas);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="bodyGestionDevs">
      <div className="containerGestionDevs">
        <table className="tableGestionDevs">
          <thead>
            <tr className="table-header">
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Correo</th>
              <th>Folios Guardados</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(userData) &&
              userData.map((user, index) => (
                <tr key={index} className="ticket-body">
                  <td>{user.nombre}</td>
                  <td>{user.tipo}</td>
                  <td>{user.correo}</td>

                  <td>
                    <select className="select" onChange={(e) => openModal(e.target.value)}>
                      {user.foliosGuardados.map((folio, index) => (
                        <option key={index} value={folio}>{folio}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>
                &times;
              </span>
              <p>Detalles del ticket</p>
              <p>Prioridad: {selectedTicket.priori}</p>
              <p>Estado: {selectedTicket.estado}</p>
              <p>Fecha Asignado: {selectedTicket.fechaAsignado}</p>{/* 
            <p>Fecha De Envio: {selectedTicket.fechaDeEnvio.toDate()}</p>
            <p>Fecha De Resuelto: {selectedTicket.fechaResuleto.toDate()}</p> */}
              <p>Estado: {selectedTicket.estado}</p>
              <p>Folio: {selectedTicket.folio}</p>
              <p>Area: {selectedTicket.area}</p>
              <p>Admin: {selectedTicket.nombre}</p>
              <p>Correo: {selectedTicket.correoA}</p>
              <p>Navegador: {selectedTicket.navegador}</p>
              <p>Sistema Operativo: {selectedTicket.sistemaOperativo}</p>
              <p>Tipo de error: {selectedTicket.errorSeleccionado}</p>
              <p>Ruta: {selectedTicket.rutitaD}</p>
              <p>Descripción: {selectedTicket.descripcionProblema}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionDevs;
