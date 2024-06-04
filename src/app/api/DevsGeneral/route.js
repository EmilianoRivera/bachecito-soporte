import { NextResponse } from "next/server";
import { db, collection, getDocs, query, where} from "../../../../firebase";
import { enc } from "@/scripts/Cifrado/Cifrar";

export async function GET(request) {
  try {
    const usuariosRef = collection(db, 'usuarios')
    const q = query(usuariosRef, where("rol", "==", "dev"));
    const usuariosSnapShot = await getDocs(q);

    const usuarios = []
 
    usuariosSnapShot.forEach((doc) => {
      const usuario = doc.data();
      const userEnc = enc(usuario)
      usuarios.push(userEnc);
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener los tickets:", error);
    return NextResponse.error("Error al obtener tickets", { status: 500 });
  }
}
