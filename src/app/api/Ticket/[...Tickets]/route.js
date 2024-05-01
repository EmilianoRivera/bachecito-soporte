import { NextResponse } from "next/server";  
import { db, collection, addDoc, getDocs } from "../../../../../firebase";
//import nodemailer from "nodemailer";
import { Resend } from 'resend';

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
      priori = "PRIORIDAD ALTA";
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
      priori = "PRIORIDAD MEDIA";
      break;
    default:
      priori = "PRIORIDAD DESCONOCIDA";
  }
  return priori; // Devuelve el string con la prioridad
}

export async function POST(req, { params }) {
  try {
    console.log(params.Soporte);

    // Extraer los datos del cuerpo de la solicitud

    const [
      errorSeleccionado,
      sistemaOperativo,
      navegador,
      rutaError,
      descripcionProblema,
      correoA,
      nombre,
      url,
      area

    ] = params.Soporte;
    const rutitaD = decodeURIComponent(rutaError);
    const urlsitaD = decodeURIComponent(url);
    const folio = await folioTicket(errorSeleccionado, rutaError);
    const priori = prioridad(errorSeleccionado);
    // Validar los datos si es necesario
    console.log(
      errorSeleccionado,
      " ",
      sistemaOperativo,
      " ",
      navegador,
      " ",
      rutitaD,
      " ",
      descripcionProblema,
      " ",
      urlsitaD, " ", priori, " ", folio
    ); 
    console.log(resend)
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: correoA,
      subject: 'Confirmación de recepción de ticket',
      html: `Se ha recibido su ticket con el folio: ${folio}.`
    });
    


    const docRef = await addDoc(collection(db, 'tickets'), {
        folio,
        priori,
        errorSeleccionado,
        sistemaOperativo,
        navegador,
        rutitaD,
        descripcionProblema,
        fechaDeEnvio: new Date(),
        urlsitaD,
        nombre,
        correoA,
        area
      });

  console.log(docRef)
    // Enviar una respuesta de éxito
    return NextResponse.json(docRef );
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
