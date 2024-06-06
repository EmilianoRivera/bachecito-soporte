"use client"
import React from 'react'
import { useRouter, usePathname } from "next/navigation";
function  NotFound() {
   
   const { push } = useRouter();

   push("/Cuenta");

}

export default  NotFound