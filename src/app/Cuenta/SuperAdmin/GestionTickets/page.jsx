"use client";
import React, { useContext,useState, useEffect } from "react";
import { auth, db } from "../../../../../firebase";
import "./tickets.css";
import { useRouter } from "next/navigation";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";
import "../../../../components/navbar";
import AuthContext from "../../../../../context/AuthContext";
import { useAuthUser } from "../../../../../hooks/UseAuthUser";


import {
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import "./tickets.css";

function Gtickets() {
  useAuthUser();
  const { isLogged } = useContext(AuthContext);

  const [tick, setTick] = useState([]);
  const [userData, setUserData] = useState({});
  const [userData2, setUserData2] = useState({});
  const [userData3, setUserData3] = useState({});
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicket2, setSelectedTicket2] = useState(null);
  const [filtroPrioridad, setFiltroPrioridad] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [filtroArea, setFiltroArea] = useState(null);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  /*   useEffect(() => {
      console.log("esto es de mi use effect");
  
      if (showModal3) {
        console.log("mi registro",userData);
        userData.map((value, key)=> {
          console.log(value)
        })
        // Aquí recorro userData que es el objeto
        Object.entries(userData).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
      }
    }, [showModal3]); */
    useEffect(() => {
      if (!isLogged || !auth.currentUser?.emailVerified) {
        router.push("/Cuenta");
      }
    }, [isLogged, auth.currentUser]);
  
  
    if (!isLogged || !auth.currentUser?.emailVerified) {
      return null; // O puedes mostrar un mensaje de "No autorizado"
    }
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };
  const openModal2 = (ticket) => {
    setSelectedTicket2(ticket);
    setShowModal2(true);
  };
  const openModal3 = (ticket) => {
    setShowModal3(true);
    setSelectedTicket(ticket);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const closeModal2 = () => {
    setShowModal2(false);
  };
  const closeModal3 = () => {
    setShowModal3(false);
  };

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
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
      };
      return dateObject.toLocaleString("en-US", options);
    } else {
      return "SIN HORA";
    }
  }
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
        const Uid = enc(uid);
        const baseURL = process.env.NEXT_PUBLIC_RUTA_U;
        const userResponse = await fetch(
          `${baseURL}/${encodeURIComponent(Uid)}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userDatas = await userResponse.json();
        const dat = desc(userDatas);
        setUserData3(dat);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, []);
  //OBTENER TICKETS
  useEffect(() => {
    async function fetchData() {
      try {
        const baseURL = process.env.NEXT_PUBLIC_RUTA_TT;
        const response = await fetch(`${baseURL}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const dataEnc = data.map((rep) => desc(rep));
        setTick(dataEnc);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    }

    fetchData();
  }, []);
  //DATOS DEL USUARIO "Asignado" DEL TICKET
  useEffect(() => {
    async function fetchData() {
      try {
        if (selectedTicket2) {
          // Realizar la consulta para obtener el documento del usuario asignado al ticket
          const userQuery = query(
            collection(db, "usuarios"),
            where("uid", "==", selectedTicket2.usuarioAsignado)
          );
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
  //DEVS TODOS:
  useEffect(() => {
    async function fetchData() {
      try {
        const baseURL = process.env.NEXT_PUBLIC_RUTA_DG;
        const userResponse = await fetch(`${baseURL}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userDatas = await userResponse.json();
        const data = userDatas.map((rep) => desc(rep));
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  // REABRIR
  const Reabrir = async (folio) => {
    try {
      const ticketQuery = query(
        collection(db, "tickets"),
        where("folio", "==", folio)
      );
      const ticketQuerySnapshot = await getDocs(ticketQuery);

      if (!ticketQuerySnapshot.empty) {
        const ticketDocRef = ticketQuerySnapshot.docs[0].ref;
        const ticketDocSnap = await getDoc(ticketDocRef);

        if (ticketDocSnap.exists()) {
          const ticketData = ticketDocSnap.data();
          if (ticketData.fechaReapertura) {
            alert(
              "El ticket ya ha sido reabierto anteriormente y no se puede reabrir de nuevo."
            );
            return;
          }
          const motivoReapertura = prompt(
            "Ingrese el motivo de la reapertura:"
          );
          if (!motivoReapertura) {
            alert("Debe ingresar un motivo para la reapertura.");
            return;
          }
          await updateDoc(ticketDocRef, {
            estado: "Reabierto",
            fechaReapertura: new Date(),
            motivoReapertura: motivoReapertura,
          });

          console.log("Ticket reabierto exitosamente.");
          alert("Ticket reabierto exitosamente.");
        }
      } else {
        console.error(
          "No se encontró ningún documento de ticket con el folio proporcionado."
        );
        alert("No se encontró ningún ticket con el folio proporcionado.");
      }
    } catch (error) {
      console.error("Error al reabrir el ticket:", error);
      alert(
        "Hubo un error al intentar reabrir el ticket. Inténtelo nuevamente."
      );
    }
  };

  const Asignar = async (folio, user, ticketsito) => {
    try {
      // Verificar si userData no es null y tiene la propiedad uid
      if (user && user.uid) {
        // Realizar una consulta para encontrar el documento del usuario
        const userQuery = query(
          collection(db, "usuarios"),
          where("uid", "==", user.uid)
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
            if (
              (userData.tipo === "Frontend" &&
                ticketsito.areas === "Frontend") ||
              (userData.tipo === "Backend" && ticketsito.areas === "Backend") ||
              ticketsito.areas === "Otro"
            ) {
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
                  estado: estadito,
                };

                // Actualizar solo los campos especificados en el documento del ticket
                await updateDoc(ticketDocRef, camposActualizados);

                console.log(
                  "Usuario asignado y fecha de asignación actualizados en el documento del ticket."
                );
                alert("Ticket asignado exitosamente");
              }
            } else {
              // Si el área del ticket no coincide con el área del usuario, mostrar alerta
              alert(
                "Oh ese usuario no pertenece a esta area, intenta con otro(:"
              );
            }

            console.log("Folio guardado en la base de datos del usuario.");
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

  const filtrarTickets = (ticket) => {
    // Convertir el filtro de búsqueda y los campos de los tickets a mayúsculas
    const filtroMayuscula = filtroBusqueda.toUpperCase();
    const folioMayuscula = ticket.folio.toUpperCase();
    const rutaMayuscula = ticket.rutaE ? ticket.rutaE.toUpperCase() : "";
    // Aplicar filtro por prioridad
    if (filtroPrioridad && ticket.priori !== filtroPrioridad) {
      return false;
    }
    // Aplicar filtro por estado
    if (filtroEstado && ticket.estado !== filtroEstado) {
      return false;
    }
    // Aplicar filtro por área
    if (filtroArea && ticket.areas !== filtroArea) {
      return false;
    }
    // Aplicar filtro por búsqueda
    if (
      filtroBusqueda &&
      !(
        folioMayuscula.includes(filtroMayuscula) ||
        rutaMayuscula.includes(filtroMayuscula)
      )
    ) {
      return false;
    }
    return true;
  };
  // Asignar prioridades a los estados
  const estadoPrioridades = {
    "Sin asignar": 1,
    Asignado: 2,
    Resuelto: 3,
    Reabierto: 4,
  };

  // Función de comparación para ordenar los tickets
  const ordenarTickets = (a, b) => {
    const prioridadA = estadoPrioridades[a.estado];
    const prioridadB = estadoPrioridades[b.estado];

    if (prioridadA < prioridadB) {
      return -1;
    } else if (prioridadA > prioridadB) {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <div className="body_gest_tickets">
      <div className="ticket-container">
        <div className="ticket-header">
          <p className="ticket-title">🔄️ Cambios en los Tickets 🏷️</p>
          <div className="filtros">
            <div className="select">
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
              >
                <option value="">Todas las prioridades</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
            <div className="select">
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="Sin asignar">Sin asignar</option>
                <option value="Asignado">Asignado</option>
                <option value="Resuelto">Resuelto</option>
                <option value="Reabierto">Reabierto</option>
              </select>
            </div>
            <div className="select">
              <select
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value)}
              >
                <option value="">Todas las áreas</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <input
              className="buscador"
              type="text"
              placeholder=" Buscar por folio o ruta..."
              value={filtroBusqueda}
              onChange={(e) => setFiltroBusqueda(e.target.value)}
            />
          </div>
        </div>
        <table className="ticket-table">
          <thead>
            <tr className="sticky-top">
              <th className=".th">Folio</th>
              <th className=".th">Área</th>
              <th className=".th">Fecha de envío</th>
              <th className=".th">Estado</th>
              <th className=".th">Prioridad</th>
              <th className=".th">Ruta</th>
              <th className=".th">Detalles</th>
              <th className=".th">Historial</th>
            </tr>
          </thead>
          <tbody>
            {tick
              .sort(ordenarTickets)
              .filter(filtrarTickets)
              .map((ticketsito, index) => (
                <tr key={index} className="ticket-body">
                  <td className="td">{ticketsito.folio}</td>
                  <td className="td">{ticketsito.areas}</td>
                  <td className="td">
                    {formatTimestamp(ticketsito.fechaDeEnvio)}
                  </td>
                  <td className="td">{ticketsito.estado}</td>
                  <td className="td">{ticketsito.priori}</td>
                  <td className="td">{ticketsito.rutaE}</td>
                  <td className="td">
                    <button
                      className="ticket-button-detalles"
                      onClick={() => openModal(ticketsito)}
                    >
                      Detalles
                    </button>
                  </td>
                  <td className="td">
                    <button
                      className="ticket-button-historial"
                      onClick={() => openModal2(ticketsito)}
                    >
                      Historial
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
            <p id="titulin1">Detalles del ticket 📑</p>
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
          </div>
        </div>
      )}
      {showModal2 && (
        <div className="modal">
          <div className="titul">
            <p id="titulin2">Historial del ticket 🕗</p>
          </div>
          <div className="modal-content">
            <span className="close" onClick={closeModal2}>
              &times;
            </span>

            {selectedTicket2.estado === "Sin asignar" && (
              <div className="datos-sinasignar">
                <table className="table-content">
                  <tr>
                    <td className="tdsito1">
                      <p className="psito">Prioridad: </p>
                    </td>
                    <td className="tdsito2">
                      <p className="p">{selectedTicket2.priori}</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="tdsito1">
                      <p className="psito">Área: </p>
                    </td>
                    <td className="tdsito2">
                      <p className="p">{selectedTicket2.areas}</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="tdsito1">
                      <p className="psito">Enviado por: </p>
                    </td>
                    <td className="tdsito2">
                      <p className="p">
                        {selectedTicket2.nom} - {selectedTicket2.corr}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="tdsito1">
                      <p className="psito">Fecha de Envío: </p>
                    </td>
                    <td className="tdsito2">
                      <p className="p">
                        {formatTimestamp(selectedTicket2.fechaDeEnvio)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="tdsito1">
                      <p className="psito">Hora de Envío: </p>
                    </td>
                    <td className="tdsito2">
                      <p className="p">{hora(selectedTicket2.fechaDeEnvio)}</p>
                    </td>
                  </tr>
                </table>
                <br />
                <button
                  className="ticket-button-gestionar"
                  onClick={() => openModal3(selectedTicket2)}
                >
                  Gestionar
                </button>
              </div>
            )}

            {selectedTicket2.estado === "Asignado" && (
              <div className='datos-asignado'>
                <table className='table-content'>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Responsable del ticket: </p></td>
                    <td className='tdsito2'><p className='p'>{userData2.nombre} {userData2.apellidoPaterno} ({userData2.rol} / {userData2.tipo})</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Asignación: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaAsignado)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Asignación: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaAsignado)}</p></td>
                  </tr>
                </table>
              </div>
            )}

            {selectedTicket2.estado === "Resuelto" && !selectedTicket2.fechaReapertura && (
              <div className='datos-resolucion'>
                <table className='table-content'>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Prioridad: </p></td>
                    <td className='tdsito2'><p className='p'>{selectedTicket2.priori}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Área: </p></td>
                    <td className='tdsito2'><p className='p'>{selectedTicket2.area}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Envío: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaDeEnvio)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Envío: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaDeEnvio)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Responsable del ticket: </p></td>
                    <td className='tdsito2'><p className='p'>{userData2.nombre} {userData2.apellidoPaterno} ({userData2.rol} / {userData2.tipo})</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Asignación: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaAsignado)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Asignación: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaAsignado)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Resolución: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaResuelto)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Resolución: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaResuelto)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Comentario del desarrollador: </p></td>
                    <td className='tdsito2'><p className='p'>{selectedTicket2.comentario}</p></td>
                  </tr>
                </table>
                <button className="ticket-button-reabrir" onClick={() => Reabrir(selectedTicket2.folio)}>Reabrir</button>
              </div>
            )}

            {selectedTicket2.fechaReapertura && (

              <div className='datos-reabierto'>
                <p className='rayitass' align="center">Estado inicial del reporte antes de la reapertura</p>
                <br />
                <p className='rayitas' align="center">---------------------------------------------------------------------------------------------------</p>
                <table className='table-content'>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Envío: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaDeEnvio)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Envío: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaDeEnvio)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Responsable del ticket: </p></td>
                    <td className='tdsito2'><p className='p'>{userData2.nombre} {userData2.apellidoPaterno} ({userData2.rol} / {userData2.tipo})</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Asignación: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaAsignado)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Asignación: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaAsignado)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Resolución: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaResuelto)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Resolución: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaResuelto)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Comentario del desarrollador: </p></td>
                    <td className='tdsito2'><p className='p'>{selectedTicket2.comentario}</p></td>
                  </tr>
                </table>
                <p className='rayitas' align="center">---------------------------------------------------------------------------------------------------</p>
                <table className='table-content'>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Reapertura: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaReapertura)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Reapertura: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaReapertura)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Motivo de la reapertura: </p></td>
                    <td className='tdsito2'><p className='p'>{selectedTicket2.motivoReapertura}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Fecha de Resolución dos: </p></td>
                    <td className='tdsito2'><p className='p'>{formatTimestamp(selectedTicket2.fechaSReapertura)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Hora de Resolución: </p></td>
                    <td className='tdsito2'><p className='p'>{hora(selectedTicket2.fechaSReapertura)}</p></td>
                  </tr>
                  <tr>
                    <td className='tdsito1'><p className='psito'>Comentario del desarrollador: </p></td>
                    <td className='tdsito2'><p className='p'>{selectedTicket2.comentarioR}</p></td>
                  </tr>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal3 && (
        <div className="modal">
          <div className="modal-content-">
            <span className="close" onClick={closeModal3}>
              &times;
            </span>
            <p id="titulin3">Gestionar</p>
            <div className="tablita">
              <table>
                {Array.isArray(userData) && userData.map((user, index) => (
                  <tr key={index} className="ticket-body">
                    <td>{user.nombre}</td>
                    <td>{user.tipo}</td>
                    <td>{user.correo}</td>
                    <td>
                      <select>
                        {user.foliosGuardados && user.foliosGuardados.map((folio, folioIndex) => (
                          <option key={folioIndex} onClick={() => openModal(folio)}>
                            {folio}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        id="reasignar-btn"
                        onClick={() => Asignar(selectedTicket.folio, user, selectedTicket)}
                      >
                        Asignar
                      </button>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Gtickets;
