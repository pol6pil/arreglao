'use strict'

async function getAllAppliances () {
  const res = await fetch('http://localhost:80/appliances')
  const json = await res.json()
  const divAppliances = document.querySelector('#appliances')

  for (const appliance of json) {
    showAppliance(divAppliances, appliance)
  }
}
getAllAppliances()

function showAppliance (div, appliance) {
  const divAppliance = document.createElement('div')
  divAppliance.className = 'appliance'
  const a = document.createElement('a')
  // eslint-disable-next-line no-undef
  if (!isAdmin()) {
    a.setAttribute('href', `./parts.html?appliance=${appliance.id}`)
  } else {
    a.setAttribute('href', `./insertappliance.html?id=${appliance.id}`)
  }

  const adiv = document.createElement('div')
  const h3 = document.createElement('h3')
  h3.append(appliance.name)

  const imgApp = document.createElement('img')
  imgApp.setAttribute('src', appliance.imgUrl)
  imgApp.alt = appliance.name

  adiv.append(h3)
  adiv.append(imgApp)

  a.append(adiv)
  divAppliance.append(a)

  div.append(divAppliance)
}
