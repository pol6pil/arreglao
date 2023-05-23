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
      // eslint-disable-next-line no-undef
      showGuide(guide, div)
    }
  } else {
    const error = document.createElement('span')
    error.append('¡No hay ninguna guia para este electrodomestico disponible!')
    div.append(error)
  }
}
const guidesSection = document.querySelector('#guides')
// eslint-disable-next-line no-undef
showGuides(isAdmin(), guidesSection)
