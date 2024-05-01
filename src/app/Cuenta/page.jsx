"use client";
import React, { useState, useEffect, useRef } from "react";
import anime from 'animejs';
import { auth, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { updateDoc,collection, query, where, getDocs, addDoc} from "firebase/firestore";
import './style.css'

function Administrador() {
    useEffect(() => {
      let currentAnimation = null;
  
      const emailInput = document.querySelector('#correo');
      const passwordInput = document.querySelector('#contraseña');
      const submitButton = document.querySelector('#iniciarSesion-btn');
      const pathElement = document.querySelector('path');
  
      const createAnimation = (offsetValue, dashArrayValue) => {
        if (currentAnimation) currentAnimation.pause();
        currentAnimation = anime({
          targets: 'path',
          strokeDashoffset: {
            value: offsetValue,
            duration: 700,
            easing: 'easeOutQuart',
          },
          strokeDasharray: {
            value: dashArrayValue,
            duration: 700,
            easing: 'easeOutQuart',
          },
        });
      };
  
      emailInput.addEventListener('focus', () => {
        createAnimation(0, '240 1386');
      });
  
      passwordInput.addEventListener('focus', () => {
        createAnimation(-336, '240 1386');
      });
  
      submitButton.addEventListener('click', () => {
        createAnimation(-730, '530 1386');
      });
  
      return () => {
        if (currentAnimation) currentAnimation.pause();
      };
    }, []);
  
    const { push } = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        
        email,
        password
      );
      const user = userCredential.user;
  
      if (user && !user.emailVerified) {
        alert("Por favor, verifica tu correo electrónico para iniciar sesión.");
        signOut(auth);
      } else {
        const reportesRef = collection(db, "usuarios");
        const q = query(reportesRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
  
        let estadoCuenta;
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          estadoCuenta = data.estadoCuenta;
        });
  
        if (estadoCuenta === false) {
          const confirm = window.confirm(
            "Tu cuenta ha sido desactivada. ¿Deseas restablecerla?"
          );
          if (confirm) {
            querySnapshot.forEach(async (doc) => {
              await updateDoc(doc.ref, {
                estadoCuenta: true,
              });
            });
            alert("Cuenta restablecida correctamente");
            push("/Cuenta/Administrador/Dashboard");
          } else {
            signOut(auth);
            alert("Inicio de sesión cancelado");
          }
        } else {
          let isAdmin = false;
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (userData.rol === "admin") {
              isAdmin = true;
            }
          });
  
          if (isAdmin) {
            alert("Inicio de sesión exitoso");
            push("/Cuenta/Administrador/Dashboard");
          } else {
            signOut(auth);
            alert("No tienes permiso para iniciar sesión como administrador");
          }
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

    return (
      <div className="page">
        <div className="container">
          <div className="left">
            <div className="login">¡Hola!<p className='emoji'>👋</p></div>
            <div className="eula">Bienvenido administrador, asegurate de hacer buen uso de tu cuenta ¡gracias por tu labor!</div>
          </div>
          <div className="right">
            <svg viewBox="0 0 320 300">
              <defs>
                <linearGradient id="linearGradient" x1="13" y1="193.49992" x2="307" y2="193.49992" gradientUnits="userSpaceOnUse">
                  <stop style={{ stopColor: '#fce302' }} offset="0" id="stop876" />
                  <stop style={{ stopColor: '#ff0000' }} offset="1" id="stop878" />
                </linearGradient>
              </defs>
              <path d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143" />
            </svg>

            <form className='centered' onSubmit={handleSignIn}>
                <label >Correo</label>
                <input type="text"  value={email}  onChange={(e) => setEmail(e.target.value)} id="correo" />
                <label >Contraseña</label>
                <input type="text"  value={password}  onChange={(e) => setPassword(e.target.value)}  id="contraseña" />
                <button type="submit" id="iniciarSesion-btn">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

    export default Administrador