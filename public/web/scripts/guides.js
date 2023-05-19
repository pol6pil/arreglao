'use strict'

async function getGuides (appliance) {
  const res = await fetch(`http://localhost/guides/accepted/${appliance}`)
  return await res.json()
}

async function getPendingGuides (appliance) {
  const res = await fetch(`http://localhost/guides/pending/${appliance}`)
  return await res.json()
}

async function getApplianceName (appliance) {
  const res = await fetch(`http://localhost/appliances/${appliance}`)
  const json = await res.json()
  return json.name
}

async function showGuides (isAdmin, div) {
  // Mostramos el electrodomestico al que pertenecen las guias
  const urlParams = new URLSearchParams(window.location.search)
  const applianceId = urlParams.get('appliance') || 0
  const applianceName = await getApplianceName(applianceId)
  const h1 = document.querySelector('#guidesHeader')
  h1.append(applianceName)
  let guides = []
  // Obtenemos las guias
  if (isAdmin) {
    guides = await getPendingGuides(applianceId)
  } else {
    guides = await getGuides(applianceId)
  }
  // Mostramos las guias
  if (guides.length > 0) {
    for (const guide of guides) {
      showGuide(guide, div)
    }
  } else {
    const error = document.createElement('span')
    error.append('¡No hay ninguna guia para este electrodomestico disponible!')
    div.append(error)
  }
}

function showGuide (guide, div) {
  // Mostramos la guia
  const article = document.createElement('article')
  const a = document.createElement('a')
  a.setAttribute('href', `./guide.html?id=${guide.id}`)
  const aDiv = document.createElement('div')
  const span = document.createElement('span')
  span.append(guide.name)
  aDiv.append(span)
  const img = document.createElement('img')
  img.setAttribute('src', guide.imgUrl)
  aDiv.append(img)
  a.append(aDiv)
  article.append(a)
  div.append(article)
}
const guidesSection = document.querySelector('#guides')
showGuides(false, guidesSection)
