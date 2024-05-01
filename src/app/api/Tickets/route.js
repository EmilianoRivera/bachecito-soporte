import { auth, db, query, collection, where, getDocs } from '../../../../firebase';
import { NextResponse } from "next/server";

async function fetchData() {
    try {
        console.log("first")
        const res = await fetch("http://localhost:3000/api/g1")
        if(!res.ok) {
            throw new Error("Failer to fetch data")
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("HAY UN ERROR", error)
    }
}


export async function GET(request, {params}) {
  try {
      const data = await fetchData()
     return NextResponse.json(data)
  } catch (error) {
   
    return NextResponse.error("Error al obtener reportes", { status: 500 });
  }
}
 