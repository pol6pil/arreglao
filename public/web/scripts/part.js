'use strict'
async function mostrarPieza (id) {
  const part = await obtenerPieza(id)
  console.log(part)
}

async function obtenerPieza (id) {
  const res = await fetch(`http://localhost/parts/${id}`)
  return await res.json()
}

// Obtenemos el id de la pieza deseada
const urlParams = new URLSearchParams(window.location.search)
const partId = urlParams.get('id') || 0

mostrarPieza(partId)
