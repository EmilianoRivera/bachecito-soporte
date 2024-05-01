import { NextResponse } from "next/server";  
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, collection, addDoc, app } from "../../../../../firebase";

export async function POST(req, { params }) {
  try {
    // Extraer el archivo de la solicitud
    const [file, uid] = params.Imagen;
console.log(uid)
    // Configurar referencia al almacenamiento de Firebase
    const storage = getStorage(app);
    const randomId = Math.random().toString(36).substring(7);
    const imageName = `Ticket_${randomId}`;
    const storageRef = ref(storage, `ImagenesTickets/${uid}/${imageName}`);

    // Subir el archivo al almacenamiento de Firebase
    await uploadBytes(storageRef, file);

    // Obtener la URL de descarga del archivo
    const url = await getDownloadURL(storageRef);

    // Guardar la URL en la base de datos
    const docRef = await addDoc(collection(db, 'tickets'), {
      url
    });

    // Enviar una respuesta de éxito con la URL del archivo
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    return NextResponse.error("Error al subir la imagen", { status: 500 });
  }
}
