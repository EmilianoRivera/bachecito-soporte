import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where} from "../../../../../firebase";

export async function GET(request, {params}) {
  try {
    const folio = params.TicketUnico;
    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, where("folio", "==", folio));
    const ticketsSnapShot = await getDocs(q);

    if (!ticketsSnapShot.empty) {
      // Si no se encuentra ningún ticket, retornar un error 404
      const ticketData = ticketsSnapShot.docs[0].data();
      return NextResponse.json(ticketData);
    } 
  } catch (error) {
    console.error("Error al obtener el ticket:", error);
    return NextResponse.error("Error al obtener el ticket", { status: 500 });
  }
}