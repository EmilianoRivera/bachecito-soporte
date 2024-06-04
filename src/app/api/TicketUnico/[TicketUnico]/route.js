import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where} from "../../../../../firebase";
import { desc, enc } from "@/scripts/Cifrado/Cifrar";

export async function GET(request, {params}) {
  try {
    const fol = params.TicketUnico;

    const folDeco = decodeURIComponent(fol)
    const folio = desc(folDeco)


    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, where("folio", "==", folio));
    const ticketsSnapShot = await getDocs(q);

    if (!ticketsSnapShot.empty) {
      // Si no se encuentra ningún ticket, retornar un error 404
      const ticketData = ticketsSnapShot.docs[0].data();
      const ticketDataEnc = enc(ticketData)
      console.log(ticketDataEnc)
      return NextResponse.json(ticketDataEnc);
    } 
  } catch (error) {
    console.error("Error al obtener el ticket:", error);
    return NextResponse.error("Error al obtener el ticket", { status: 500 });
  }
}