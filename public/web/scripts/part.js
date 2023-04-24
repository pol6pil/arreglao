'use strict'
async function mostrarPieza (id) {
  const part = await obtenerPieza(id)
  console.log(part)

  // Mostramos la pieza
  const productOverview = document.querySelector('#productOverview')

  const divImage = document.createElement('div')
  divImage.className = 'productImage'
  const image = document.createElement('img')
  divImage.append(image)

  const price = document.querySelector('#productInfoPrice')
  mostrarOpcion(part.options[0], image, price)

  const divProductInfo = document.querySelector('#divProductInfo')
  const h1 = document.querySelector('#divProductInfo h1')
  h1.append(part.name)

  const description = document.querySelector('#productDetail p')
  description.append(part.description)

  const partWarranty = document.querySelector('#partWarranty')

  if (part.warranty > 1) {
    partWarranty.append(`Garantia de ${part.warranty} años`)
  } else if (part.warranty === 1) {
    partWarranty.append('Garantia de 1 año')
  } else if (part.warranty === 0) {
    partWarranty.append('Garantia de por vida')
  }

  // Obtenemos el electrodomestico para mostrar el nombre
  const appliance = await obtenerElectrodomestico(part.appliance)
  const partAppliance = document.querySelector('#partAppliance')
  partAppliance.append(appliance.name)
  partAppliance.setAttribute('href', `./parts.html?appliance=${part.appliance}`)
  // const lastDiv = document.querySelector('#divProductInfo div:last-child')

  // Si el producto tiene nota se muestra
  if (part.note.length > 0) {
    const div = document.querySelector('#productDetail div:first-child')
    showInfoBox('note', part.note, div)
  }
  // Igual con la advertencia
  if (part.warning.length > 0) {
    const div = document.querySelector('#productDetail div:first-child')
    showInfoBox('warning', part.warning, div)
  }

  // Si la pieza tiene mas de una opcion las mostramos en un select
  if (part.options.length > 1) {
    const select = document.createElement('select')
    select.id = 'optionSelect'

    // Guardamos el indice de las opciones para ponerselo como value
    let optionsQuantity = 0
    for (const option of part.options) {
      const selectOption = document.createElement('option')
      selectOption.value = optionsQuantity
      selectOption.append(option.name)
      select.append(selectOption)

      select.onchange = (e) => {
        mostrarOpcion(part.options[e.target.value], image, price)
      }
      optionsQuantity++
    }
    divProductInfo.insertBefore(select, divProductInfo.children[3])
  } else {
    const option = document.createElement('span')
    option.append(`Option: ${part.options[0].name}`)
    divProductInfo.insertBefore(option, divProductInfo.children[3])
  }

  productOverview.prepend(divImage)
}

function mostrarOpcion (option, img, span) {
  img.setAttribute('src', option.imgUrl)
  span.innerText = `${option.price}€`
}

async function obtenerPieza (id) {
  const res = await fetch(`http://localhost/parts/${id}`)
  return await res.json()
}

async function obtenerElectrodomestico (id) {
  const res = await fetch(`http://localhost/appliances/${id}`)
  return await res.json()
}

function showInfoBox (type, content, div) {
  const infoDiv = document.createElement('div')
  const infoSpan = document.createElement('span')
  if (type === 'note') {
    infoDiv.className = 'note'
    infoSpan.append('NOTA')
  } else if (type === 'warning') {
    infoDiv.className = 'warning'
    infoSpan.append('ADVERTENCIA')
  } else {
    return
  }

  const infoContent = document.createElement('p')
  infoContent.append(content)
  infoDiv.append(infoSpan)
  infoDiv.append(infoContent)

  div.append(infoDiv)
}
// async function mostrarReviews () {

// }

// async function obtenerReviews (id) {
// }

// Obtenemos el id de la pieza deseada
const urlParams = new URLSearchParams(window.location.search)
const partId = urlParams.get('id') || 0

mostrarPieza(partId)
