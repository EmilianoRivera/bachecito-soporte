"use client";
import React, { useContext,useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../../../../../context/AuthContext"
import { useAuthUser } from "../../../../../hooks/useAuthUser";
 
import "./style.css";
import { enc } from "@/scripts/Cifrado/Cifrar";

function NuevoDev() {
  useAuthUser();
  const { isLogged } = useContext(AuthContext);

  const [nombre, setNombre] = useState("Sin nombre");
  const [apmat, setApmat] = useState("Sin apmat");
  const [appat, setAppat] = useState("Sin appat");
  const [correo, setCorreo] = useState("Sin correo");
  const [contraseña, setContraseña] = useState("Sin contraseña");
  const [fechaNacimiento, setFechaNacimiento] = useState("Sin fecha nacimiento");
  const [tipo, setTipo] = useState("Sin tipo");
  const router = useRouter();
  useEffect(() => {
    if (!isLogged || !auth.currentUser?.emailVerified) {
      router.push("/Cuenta");
    }
  }, [isLogged, auth.currentUser]);


  if (!isLogged || !auth.currentUser?.emailVerified) {
    return null; // O puedes mostrar un mensaje de "No autorizado"
  }

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

    const name = enc(nombre)
    const apellidoP = enc(appat)
    const apellidoM = enc(apmat)
    const email = enc(correo)
    const password = enc(contraseña)
    const fechaN = enc(fechaNacimiento)
    const tip = enc(tipo)


    const parametros = {
      nom: encodeURIComponent(name),
      appat: encodeURIComponent(apellidoP),
      apmat: encodeURIComponent(apellidoM),
      corr: encodeURIComponent(email),
      pass: encodeURIComponent(password),
      fechaNac: encodeURIComponent(fechaN),
      tipoDev: encodeURIComponent(tip)
    }
    const baseURL = process.env.NEXT_PUBLIC_RUTA_ND


    try {
      e.preventDefault();
      const res = await fetch(`${baseURL}/${encodeURIComponent(name)}/${encodeURIComponent(apellidoP)}/${encodeURIComponent(apellidoM)}/${encodeURIComponent(email)}/${encodeURIComponent(password)}/${encodeURIComponent(fechaN)}/${encodeURIComponent(tip)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parametros),
      })

      if(!res.ok) {
        throw new Error("Error al crear nuevo dev")
      }

      alert("Se envió email de verificación")
      router.push("/Cuenta/SuperAdmin/GestionDevs")
    } catch (error) {
      console.error("error al crear la cuenta: ", error)
      alert(error.mesagge)
    }
  };

  const handlePaste = (event) => {
    event.preventDefault(); // Prevenir la acción por defecto del pegado del texto
  };

  const generateRandomString = () => {
    return Math.random().toString(36).substring(2, 15); //Prevenir que se autocomplete por el navegado
  };

  //VALIDACIÓN NOMBRE--------------------------------------------------------------------------------------------------------------------
  const handleNameKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[a-zA-Z\s]/.test(key) || value.length >= 50) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };
  const handleNameBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 3;

    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {
      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  //VALIDACIÓN APELLIDOS--------------------------------------------------------------------------------------------------------------------
  const handleAPKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[a-zA-Z]/.test(key) || value.length >= 20) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };

  const handleAPBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 4;
    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {
      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  const [error, setError] = useState("");


  //VALIDACIÓN Fecha de nacimiento-------------------------------------------------------------------------------------------------------------------- // Estado para la fecha de nacimiento
  const [edadValida, setEdadValida] = useState(true); // Estado para la validación de edad

  const showAlert = (message) => {
    const alertContainer = document.createElement("div");
    alertContainer.classList.add("custom-alertCU");

    // Agrega un enlace para mostrar la alerta al hacer clic
    const linkMarkup = `<a href="#" class="alert-link">Contáctanos</a>`;

    alertContainer.innerHTML = `<p>${message} ${linkMarkup}</p>`;
    document.body.appendChild(alertContainer);

    // Maneja el clic en el enlace
    const alertLink = alertContainer.querySelector(".alert-link");
    alertLink.addEventListener("click", handleClick);

    // Elimina la alerta después de cierto tiempo (opcional)
    setTimeout(() => {
      alertContainer.remove();
    }, 6000); // Eliminar la alerta después de 5 segundos
  };

  const handleClick = (event) => {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace

    // Muestra una alerta al usuario
    const confirmation = confirm(
      "Estás a punto de ser redirigido a tu cuenta de correo electrónico. ¿Deseas continuar?"
    );

    // Si el usuario acepta, abre el cliente de correo
    if (confirmation) {
      const subject = encodeURIComponent(
        "Atención al usuario por BACHECITO 26 - WEB"
      );
      const body = encodeURIComponent(
        "¡Hola GEMMA!👋 Me pongo en contacto con ustedes debido a..."
      );
      window.open(
        "mailto:somos.gemma.01@gmail.com?subject=" + subject + "&body=" + body
      );
    } else {
      // Si el usuario no acepta, no se hace nada
      return;
    }
  };

  const handleFechaNacimientoChange = (event) => {
    const fecha = event.target.value;
    setFechaNacimiento(fecha);

    // Validar la fecha de nacimiento
    const fechaNacimientoDate = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoDate.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < fechaNacimientoDate.getDate())
    ) {
      edad = edad - 1; // Decrementar la edad si no ha pasado el mes de cumpleaños
    }

    if (edad < 18 || edad > 70) {
      setEdadValida(false);
    } else {
      setEdadValida(true);
    }
  };

  const handleCheckBoxChange = () => {
    setCheckBoxChecked(!checkBoxChecked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let missingFields = [];

    if (!nombre) missingFields.push("Nombre");
    if (!appat) missingFields.push("Apellido Paterno");
    if (!apmat) missingFields.push("Apellido Materno");
    if (!fechaNacimiento) missingFields.push("Fecha de Nacimiento");
    if (!email) missingFields.push("Correo Electrónico");
    if (!password) missingFields.push("Contraseña");
    if (!checkBoxChecked) missingFields.push("Aceptar Términos y Condiciones");

    if (missingFields.length > 0) {
      showAlert(
        "Faltan los siguientes campos por llenar: " + missingFields.join(", ")
      );
      return;
    }

    if (!edadValida) {
      showAlert("La edad debe estar entre 18 y 70 años.");
      return;
    }

    if (!checkBoxChecked) {
      showAlert(
        "Debes aceptar la política de privacidad y los términos y condiciones."
      );
      return;
    }

    handleSignUp(event);
  };

  //VALIDACIÓN Correo--------------------------------------------------------------------------------------------------------------------
  const handleMailKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[A-Za-z0-9_@.-]/.test(key) || value.length >= 100) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };

  const handleMailBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 10;

    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {
      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  //VALIDACIÓN Contraseña--------------------------------------------------------------------------------------------------------------------
  const handlePassKeyDown = (event) => {
    const key = event.key;
    const value = event.target.value;
    // Permitir borrar caracteres si se presiona la tecla "Supr" y hay caracteres seleccionados
    if (
      key === "Backspace" ||
      (key === "Delete" &&
        event.target.selectionStart !== event.target.selectionEnd)
    ) {
      return;
    }
    // Verificar si la tecla presionada no es una letra o si la longitud del valor excede 20 caracteres
    if (!/[A-Za-z0-9-_]/.test(key) || value.length >= 20) {
      event.preventDefault(); // Prevenir la acción por defecto si no es una letra o si se supera la longitud máxima
    }
  };

  const handlePassBlur = (event) => {
    const value = event.target.value;
    // Definir el mínimo de caracteres requeridos, por ejemplo, 3 caracteres
    const minLength = 8;

    // Verificar si la longitud del valor es menor que el mínimo requerido
    if (value.length < minLength) {
      setCanSubmit(false); // No se puede enviar el formulario
    } else {
      setCanSubmit(true); // Se puede enviar el formulario
    }
  };

  return (
    <div className="bodyNuevoDev">
      <div className="container-nuevodev">
        <div className="NuevoDev">

          <h2 id="titulo-dev">Nuevo Desarrollador</h2>

          <div className="formularioNuevoDev">
            <form onSubmit={handleRegistroDev}>
              <input onBlur={handleNameBlur} onKeyDown={handleNameKeyDown} minLength={3} onPaste={handlePaste} autoComplete={generateRandomString()} className="datosDev" type="text" onChange={handleNombre} placeholder="Nombre Completo" />
              <br />
              <div className="apellidos_Container">
                <input onBlur={handleAPBlur} onKeyDown={handleAPKeyDown} minLength={4} onPaste={handlePaste} autoComplete={generateRandomString()} className="datosDev" id="appat" type="text" onChange={handleApellidoPaterno} placeholder="Apellido Paterno" />
                <br />
                <input onBlur={handleAPBlur} onKeyDown={handleAPKeyDown} minLength={4} onPaste={handlePaste} autoComplete={generateRandomString()} className="datosDev" id="apmat" type="text" onChange={handleApellidoMaterno} placeholder="Apellido Materno" />
                <br />
              </div>
              <input className="datosDev" type="date" onChange={handleFechaNacimiento} placeholder="Fecha de Nacimiento" />
              <br />
              <input onBlur={handleMailBlur} onKeyDown={handleMailKeyDown} minLength={10} onPaste={handlePaste} autoComplete={generateRandomString()} className="datosDev" type="email" onChange={handleCorreo} placeholder="Correo Electrónico" />
              <br />
              <input onBlur={handlePassBlur} onKeyDown={handlePassKeyDown} minLength={8} className="datosDev" type="password" onChange={handleContraseña} placeholder="Contraseña" />
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