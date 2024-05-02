import { NextResponse } from "next/server";
import { db, collection, addDoc, getDocs, app } from "../../../../../firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

//import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

async function folioTicket(errorSeleccionado, rutaError) {
  const refTickets = collection(db, "tickets");
  const querySnapshot = await getDocs(refTickets);
  let maxNumeroFolio = 0;

  // Recorrer los documentos para encontrar el máximo número de folio del tipo de error seleccionado
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const folio = data.folio;

    // Verificar si el folio coincide con el tipo de error seleccionado y extraer el número de folio
    if (folio.startsWith(errorSeleccionado + "-")) {
      const numeroFolio = parseInt(folio.split("-")[1]);
      if (numeroFolio > maxNumeroFolio) {
        maxNumeroFolio = numeroFolio;
      }
    }
  });

  // Incrementar el número de folio en 1
  const nuevoNumeroFolio = maxNumeroFolio + 1;

  // Construir el nuevo folio
  const nuevoFolio = `${errorSeleccionado}-${nuevoNumeroFolio}`;

  return nuevoFolio;
}

function prioridad(errorSeleccionado) {
  let priori = "";
  switch (errorSeleccionado) {
    case "S001":
    case "S002":
    case "0000":
      priori = "ALTA";
      break;
    case "D001":
    case "D002":
    case "M001":
    case "M002":
    case "R001":
    case "R002":
    case "R003":
    case "P001":
    case "P002":
    case "T001":
      priori = "MEDIA";
      break;
    default:
      priori = "DESCONOCIDA";
  }
  return priori; // Devuelve el string con la prioridad
}

export async function POST(req, { params }) {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const [
      foto ,
      uid,
      errorSeleccionado,
      sistemaOperativo,
      navegador,
      rutaError,
      descripcionProblema,
      correoA,
      nombre,
      area,
    ] = params.Ticket;
 
    const storage = getStorage(app);
    const randomId = Math.random().toString(36).substring(7);
    const imageName = `Ticket_${randomId}`;
    const storageRef = ref(storage, `ImagenesTickets/${uid}/${imageName}`);
    // Subir el archivo al almacenamiento de Firebase
    await uploadBytes(storageRef, foto);

    // Obtener la URL de descarga del archivo
    const url = await getDownloadURL(storageRef);
    const rutitaD = decodeURIComponent(rutaError);
    const folio = await folioTicket(errorSeleccionado, rutaError);
    const priori = prioridad(errorSeleccionado);
    const estado = "Sin asignar"
    // Validar los datos si es necesario
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: correoA,
      subject: "Confirmación de recepción de ticket",
      html: `Se ha recibido su ticket con el folio: ${folio}.`,
    });

    const docRef = await addDoc(collection(db, "tickets"), {
      folio,
      uid,
      priori,
      errorSeleccionado,
      sistemaOperativo,
      navegador,
      rutitaD,
      descripcionProblema,
      fechaDeEnvio: new Date(),
      correoA,
      nombre,
      area,
      url,
      estado
    });

    // Enviar una respuesta de éxito
    return NextResponse.json(docRef);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
