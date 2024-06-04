import { desc, enc } from '@/scripts/Cifrado/Cifrar';
import { auth, db, query, collection, where, getDocs } from '../../../../../firebase';
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  try {
    const id = params.uid
    const Uid = decodeURIComponent(id)
    const uid = desc(Uid)
    const userQuery = query(
      collection(db, 'usuarios'),
      where('uid', '==', uid)  
    );
    const userDocs = await getDocs(userQuery);
    if (!userDocs.empty) {
      const userData = userDocs.docs[0].data();
      const userDesc = enc(userData)
      return NextResponse.json(userDesc);
    }  
  } catch (error) {
    return NextResponse.error("Error al obtener datos del usuario", { status: 500 });
  }
}
 