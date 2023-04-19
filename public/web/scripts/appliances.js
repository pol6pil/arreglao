'use strict'

async function getAllAppliances() {
  const res = await fetch('http://localhost:80/appliances')
  const json = await res.json()
  const divAppliances = document.querySelector('#appliances')

  for (const appliance of json) {
    showAppliance(divAppliances, appliance)
  }
}
getAllAppliances()
const isAdmin = true
function showAppliance(div, appliance) {
  const divAppliance = document.createElement('div')
  divAppliance.className = 'appliance'

  if (!isAdmin) {
    const a = document.createElement('a')
    a.setAttribute('href', `./products.html?appliance=${appliance.id}`)
  }
  else {

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