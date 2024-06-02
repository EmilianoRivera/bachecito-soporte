import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where} from "../../../../firebase";

export async function GET(request) {
  try {
    const ticketsRef = collection(db, 'tickets')
    const q = query(ticketsRef,  where("estado", "==", "Sin asignar"));
    const ticketsSnapshot = await getDocs(q);

    const tickets = [];

    ticketsSnapshot.forEach((doc) => {
      const ticket = doc.data();
      tickets.push(ticket);
    });
    console.log(tickets)
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    return NextResponse.error("Error al obtener tickets", { status: 500 });
  }
}
