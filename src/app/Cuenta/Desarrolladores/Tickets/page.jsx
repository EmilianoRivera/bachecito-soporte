import React, {useState, useEffect} from 'react'

function Tickets() {
  useEffect(()=> {
    async function fetchData () {
      try {
        
      } catch (error) {
        console.error("ERROR: ", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>Tickets</div>
  )
}

export default Tickets