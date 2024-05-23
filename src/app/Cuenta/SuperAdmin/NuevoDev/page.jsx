"use client";
import React, { useState } from "react";
import { auth, db } from "../../../../../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
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
    <div className="bodyNuevoDev">
      <div className="container-nuevodev">
        <div className="NuevoDev">

          <h2 id="titulo-dev">Nuevo Desarrollador</h2>

          <div className="formularioNuevoDev">
            <form onSubmit={handleRegistroDev}>

              <input className="datosDev" type="text" onChange={handleNombre} placeholder="Nombre Completo" />
              <br />
              <div className="apellidos_Container">
                <input className="datosDev" id="appat" type="text" onChange={handleApellidoPaterno} placeholder="Apellido Paterno" />
                <br />
                <input className="datosDev" id="apmat" type="text" onChange={handleApellidoMaterno} placeholder="Apellido Materno" />
                <br />
              </div>
              <input className="datosDev" type="date" onChange={handleFechaNacimiento} placeholder="Fecha de Nacimiento" />
              <br />
              <input className="datosDev" type="email" onChange={handleCorreo} placeholder="Correo Electrónico" />
              <br />
              <input className="datosDev" type="password" onChange={handleContraseña} placeholder="Contraseña" />
              <br />
              <div className="select">
                <select value={tipo} onChange={handleTipo}>
                  <option value="">Tipo de Desarrollador</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                </select>
              </div>
              <button type="submit" id="btn-registrarDev">Registrarse</button>
            </form>
          </div>
        </div>

        <div className='imagen-nuevoDev'>
        </div>

      </div>
    </div>

  );
}

export default NuevoDev;
