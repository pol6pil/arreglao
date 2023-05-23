'use strict'

// Funcion que obtiene las x piezas mas recientes de la bbdd
async function getNewParts (partCount) {
  const res = await fetch(`http://localhost/parts?orderBy=id_pieza&limit=${partCount}&desc=1`)
  return await res.json()
}

// Funcion que llama a getNewParts y muestra las partes obtenidas
async function showNewParts (count, div) {
  const parts = await getNewParts(count)
  for (const part of parts) {
    // eslint-disable-next-line no-undef
    mostrarParte(part, div)
  }
}

// Funcion que obtiene x electrodomesticos
async function getAppliances (count) {
  const res = await fetch(`http://localhost/appliances?limit=${count}`)
  return await res.json()
}

// Funcion que llama a getAppliances y llama a showAppliance
async function showAppliances (count, div) {
  const appliances = await getAppliances(count)
  for (const appliance of appliances) {
    showAppliance(appliance, div)
  }
}

function showAppliance (appliance, div) {
  const article = document.createElement('article')
  const a = document.createElement('a')
  // eslint-disable-next-line no-undef
  if (!isAdmin()) {
    a.setAttribute('href', `./parts.html?appliance=${appliance.id}`)
  } else {
    a.setAttribute('href', `./insertappliance.html?id=${appliance.id}`)
  }
  const img = document.createElement('img')
  img.setAttribute('src', appliance.imgUrl)
  a.append(img)
  const span = document.createElement('span')
  span.append(appliance.name)
  a.append(span)
  article.append(a)
  div.append(article)
}
const recentPartsDiv = document.querySelector('#recentParts')
showNewParts(4, recentPartsDiv)
const appliancesDiv = document.querySelector('#appliances')
showAppliances(6, appliancesDiv)
