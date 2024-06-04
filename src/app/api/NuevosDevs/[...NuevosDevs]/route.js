import { NextResponse } from "next/server";
import { db, auth, collection, addDoc, getDocs, app } from "../../../../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { desc } from "@/scripts/Cifrado/Cifrar";
//import nodemailer from "nodemailer";
 
export async function POST(req, { params }) {
  try {
   
    const [
    name, appat, apmat, email,pass,fechaNacimiento, tip
    ] = params.NuevosDevs;
 
    const nam = decodeURIComponent(name)
    const apellidoPaterno = decodeURIComponent(appat)
    const apellidoMaterno = decodeURIComponent(apmat)
    const fechaN = decodeURIComponent(fechaNacimiento)
    const corr = decodeURIComponent(email)
    const contra = decodeURIComponent(pass)
    const tipoDev = decodeURIComponent(tip)


    const nombre = desc(nam)
    const apellidoP = desc(apellidoPaterno)
    const apellidoM = desc(apellidoMaterno)
    const fechaNac = desc(fechaN)
    const correo = desc(corr)
    const contraseña = desc(contra)
    const tipo = desc(tipoDev)
    const devCredential = await createUserWithEmailAndPassword(auth, correo, contraseña)
    const dev = devCredential.user
    sendEmailVerification(dev)
    const uid = dev.uid

    const usuariosCollection = collection(db, "usuarios")   //collection(db, "tickets")
    const nuevoUsuario = {
      uid: uid,
      nombre: nombre,
      apellidoPaterno: apellidoP,
      apellidoMaterno: apellidoM,
      fechaNacimiento: fechaNac,
      correo: correo,
      estadoCuenta: true,
      rol: "dev",
      tipo: tipo,
    }
    addDoc(usuariosCollection, nuevoUsuario)


 
    return NextResponse.json("Estatus 200");
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    return NextResponse.error("Error al crear cuenta", { status: 500 });
  }
}
