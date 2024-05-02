"use client"
import React, { useState } from "react";
import {auth, db} from "../../../../../firebase";
import {createUserWithEmailAndPassword, sendEmailVerification}from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import "./style.css";

function NuevoDev() {
  const [nombre, setNombre] = useState("Sin nombre");
  const [apmat, setApmat] = useState("Sin apmat");
  const [appat, setAppat] = useState("Sin appat");
  const [correo, setCorreo] = useState("Sin correo");
  const [contraseña, setContraseña] = useState("Sin contraseña");
  const [fechaNacimiento, setFechaNacimiento] = useState("Sin fecha nacimiento");
  const [tipo, setTipo] = useState("Sin tipo");

  const handleNombre = (e) => {
    setNombre(e.target.value);
  };

  const handleApellidoMaterno = (e) => {
    setApmat(e.target.value);
  };

  const handleApellidoPaterno = (e) => {
    setAppat(e.target.value);
  };

  const handleCorreo = (e) => {
    setCorreo(e.target.value);
  };

  const handleContraseña = (e) => {
    setContraseña(e.target.value);
  };

  const handleFechaNacimiento = (e) => {
    setFechaNacimiento(e.target.value);
  };

  const handleTipo = (e) => {
    setTipo(e.target.value);
  };

  const handleRegistroDev = async (e) => {
    e.preventDefault();
    console.log(nombre, apmat, appat, correo, contraseña, fechaNacimiento, tipo);
    try {
        e.preventDefault();
        const devCredential = await createUserWithEmailAndPassword(auth, correo, contraseña)
        const dev = devCredential.user
        sendEmailVerification(dev)
        alert("Se envió correo")
        const uid = dev.uid
        
        const usuariosCollection = collection(db, "usuarios")   //collection(db, "tickets")
        const nuevoUsuario = {
            uid: uid, 
            nombre: nombre,
            apellidoPaterno: appat,
            apellidoMaterno: apmat,
            fechaNacimiento: fechaNacimiento,
            correo: correo,
            estadoCuenta: true,
            rol: "dev",
            tipo: tipo
        }
        addDoc(usuariosCollection, nuevoUsuario)
        alert("Se guardó al desarrollador")
    } catch (error) {
        console.error("error al crear la cuenta: ", error)
        alert(error.mesagge)
    }
  };

  return (
    
    <div className="container-nuevodev">
      <h1>Nuevo Desarrollador</h1>
      <dev>
        <form onSubmit={handleRegistroDev}>
          <label>Nombre Completo: </label>
          <input type="text" onChange={handleNombre} />
          <br />
          <br />
          <br />

          <label>Apellido Materno: </label>
          <input type="text" onChange={handleApellidoMaterno} />
          <br />
          <br />
          <br />

          <label>Apellido Paterno: </label>
          <input type="text" onChange={handleApellidoPaterno} />
          <br />
          <br />
          <br />
          <label>Fecha de Nacimiento: </label>
          <input type="date" onChange={handleFechaNacimiento} />
          <br />
          <br />
          <br />
          <label>Correo: </label>
          <input type="email" onChange={handleCorreo} />
          <br />
          <br />
          <br />
          <label>Contraseña: </label>
          <input type="password" onChange={handleContraseña} />
          <br />
          <br />
          <br />
          <label>Tipo de Desarrollador: </label>
          <select value={tipo} onChange={handleTipo}>
            <option value="">Tipo de Desarrollador</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>
          <br />
          <br />
          <br />
          <button type="submit" id="btn-registrarDev">Registrarse</button>
        </form>
      </dev>
    </div>
  );
}

export default NuevoDev;
