"use client"
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
function navbar() {
  return (
    <div>
      <Link href="/Cuenta">Cuenta</Link>
      <Link href="/">Inicio</Link>
    </div>
  )
}

export default navbar