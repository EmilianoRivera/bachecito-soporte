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
  const [foliosGuardados, setFoliosGuardados] = useState([]);
  const [userData, setUserData] = useState({});
  const router = useRouter();
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
      return dateObject.toLocaleString();
    } else {
      // Si no se puede convertir, devuelve un mensaje de error
      return "No se puede convertir el timestamp";
    }
  }
 
  // Función para guardar el array de folios en la base de datos
  const guardarTicketBD = async (folio, userData) => {
    try {
    console.log(folio, " " ,userData)

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

            // Verificar si el folio ya ha sido guardado previamente
            if (foliosGuardadosAnteriores.includes(folio)) {
              // Eliminar el folio del array de folios guardados
              const nuevosFoliosGuardados = foliosGuardadosAnteriores.filter(
                (f) => f !== folio
              );
              console.log("NUEVOS FOLIOS", nuevosFoliosGuardados)
              // Actualizar el documento del usuario con el nuevo array de folios
              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });

              console.log("Folio eliminado de la base de datos del usuario.");
            } else {
              // Agregar el nuevo folio al array de folios guardados
              const nuevosFoliosGuardados = [
                ...foliosGuardadosAnteriores,
                folio,
              ];

              // Actualizar el documento del usuario con el nuevo array de folios
              await updateDoc(userDocRef, {
                foliosGuardados: nuevosFoliosGuardados,
              });

              console.log("Folio guardado en la base de datos del usuario.");
            }
          } else {
            console.error(
              "El documento del usuario no existe en la base de datos."
            );
          }
        } else {
          console.error(
            "No se encontró ningún documento de usuario que contenga el UID proporcionado."
          );
        }
      } else {
        console.error("No se proporcionaron datos de usuario válidos.");
      }
    } catch (error) {
      console.error("Error al guardar el folio en la base de datos:", error);
    }
  };
  return (
    <div className="ticket-container"> {/* Nuevo contenedor para el ticket */}
      <div className="ticket-header"> {/* Encabezado del ticket */}
        <p className="ticket-title">Tickets de Soporte</p>
      </div>
      {tick.map((ticketsito, index) => (
        <div key={index} className="ticket-body"> {/* Cuerpo del ticket */}
          <p>AREA: {ticketsito.area}</p>
          <p>Correo: {ticketsito.correoA}</p>
          <p>Descripción: {ticketsito.descripcionProblema}</p>
          <p>{ticketsito.errorSeleccionado}</p>
          <p>{ticketsito.folio}</p>
          <p>Fecha de Envío: {formatTimestamp(ticketsito.fechaDeEnvio)}</p>
          <p>{ticketsito.navegador}</p>
          <p>{ticketsito.nombre}</p>
          <p>{ticketsito.priori}</p>
          <p>{ticketsito.rutitaD}</p>
          <p>{ticketsito.sistemaOperativo}</p>
          <div className="fotografía">
            <img src={ticketsito.url} alt={"FOTO"} style={{ width: '100%', maxHeight: '100%' }} />
          </div>
          <button onClick={() => guardarTicketBD(ticketsito.folio, userData)}>Asignar </button>
        </div>
      ))}
    </div>
  );
}

export default Tickets;
