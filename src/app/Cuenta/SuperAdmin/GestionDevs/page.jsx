"use client";
import React, { useState, useEffect } from "react";
import "./gestionDevs.css";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";

function GestionDevs() {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  async function fetchTicket(folio) {
    try {
      const folEnc = enc(folio);
      const folioEncode = encodeURIComponent(folEnc);
      const baseURL = process.env.NEXT_PUBLIC_RUTA_TU;
      const ticketResponse = await fetch(`${baseURL}/${folioEncode}`);
      if (!ticketResponse.ok) {
        throw new Error("Failed to fetch ticket data");
      }
      const ticketDatas = await ticketResponse.json();
      const ticketDec = desc(ticketDatas);
  
      setSelectedTicket(ticketDec);
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
        const baseURL = process.env.NEXT_PUBLIC_RUTA_DG
        const userResponse = await fetch(`${baseURL}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userDatas = await userResponse.json();
        const data = userDatas.map(rep => desc(rep))
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

 
  return (
    <div className="bodyGestionDevs">
      <div className="containerGestionDevs">

        <h1>Gestión de Desarrolladores 📠</h1>

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
        {user.foliosGuardados && user.foliosGuardados.length > 0 ? (
          <select className="select" onChange={(e) => openModal(e.target.value)}>
            {user.foliosGuardados.map((folio, index) => (
              <option key={index} value={folio}>{folio}</option>
            ))}
          </select>
        ) : (
          <p>No hay folios guardados</p>
        )}
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
              {selectedTicket && (
                <>
              <p>Prioridad: {selectedTicket.priori}</p>
              <p>Estado: {selectedTicket.estado}</p>
 
              <p>Folio: {selectedTicket.folio}</p>
              <p>Area: {selectedTicket.areas}</p>
              <p>Admin: {selectedTicket.nom}</p>
              <p>Correo: {selectedTicket.corr}</p>
              <p>Navegador: {selectedTicket.navegador}</p>
              <p>Sistema Operativo: {selectedTicket.sistemaOperativo}</p>
              <p>Tipo de error: {selectedTicket.errorE}</p>
              <p>Ruta: {selectedTicket.rutaE}</p>
              <p>Descripción: {selectedTicket.dP}</p>
              </>
            )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionDevs;