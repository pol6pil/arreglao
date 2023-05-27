'use strict'
async function mostrarPieza (id) {
  const part = await obtenerPieza(id)
  const title = document.querySelector('title')
  title.append(part.name)
  const cartButton = document.querySelector('#addPart')
  const quantity = document.querySelector('#quantity')
  cartButton.onclick = () => {
    addPartCart(part, quantity.value)
  }

  // Mostramos la pieza
  const productOverview = document.querySelector('#productOverview')

  const divImage = document.createElement('div')
  divImage.className = 'productImage'
  const image = document.createElement('img')
  image.id = 'partImage'
  divImage.append(image)

  const price = document.querySelector('#productInfoPrice')
  mostrarOpcion(part.options[0], image, price)

  const divProductInfo = document.querySelector('#divProductInfo')
  const h1 = document.querySelector('#divProductInfo h1')
  h1.append(part.name)

  const description = document.querySelector('#mainDetail p')
  description.append(part.description)

  const partWarranty = document.querySelector('#partWarranty')

  if (part.warranty > 1) {
    partWarranty.append(`Garantia de ${part.warranty} años`)
  } else if (part.warranty === 1) {
    partWarranty.append('Garantia de 1 año')
  } else if (part.warranty === 0) {
    partWarranty.append('Garantia de por vida')
  }

  // Mostramos la guia disponible para la pieza
  const asideDetailDiv = document.querySelector('#asideDetail')
  showPartGuide(part.id, asideDetailDiv)

  // Obtenemos el electrodomestico para mostrar el nombre
  const appliance = await obtenerElectrodomestico(part.appliance)
  const partAppliance = document.querySelector('#partAppliance')
  partAppliance.append(appliance.name)
  partAppliance.setAttribute('href', `./parts.html?appliance=${part.appliance}`)
  // const lastDiv = document.querySelector('#divProductInfo div:last-child')

  // Si el producto tiene nota se muestra
  if (part.note.length > 0) {
    const div = document.querySelector('#mainDetail')
    showInfoBox('note', part.note, div)
  }
  // Igual con la advertencia
  if (part.warning.length > 0) {
    const div = document.querySelector('#mainDetail')
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

  showReviews(id)
}

function mostrarOpcion (option, img, span) {
  img.setAttribute('src', option.imgUrl)
  img.alt = option.id
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

async function showPartGuide (partId, div) {
  // Obtenemos la guia
  const guide = await getGuide(partId)
  if (guide !== null) {
    // Mostramos la guia
  // eslint-disable-next-line no-undef
    showGuide(guide, div)
  }
}

async function getPfp (email) {
  const res = await fetch(`http://localhost/users/${email}`)
  const json = await res.json()
  return json.imgUrl
}

async function getGuide (partId) {
  const res = await fetch(`http://localhost/guides/part/${partId}`)
  return await res.json()
}

async function showReviews (id) {
  const section = document.querySelector('#reviews')
  const reviews = await getReviews(id)
  for (const review of reviews) {
    showReview(review, section)
  }
}

async function showReview (review, div) {
  const article = document.createElement('article')
  const userDiv = document.createElement('div')
  article.append(userDiv)
  // Mostramos la foto de perfil
  const pfp = document.createElement('img')
  userDiv.append(pfp)
  const imgUrl = await getPfp(review.email)
  pfp.setAttribute('src', imgUrl)
  // Mostramos el correo
  const emailSpan = document.createElement('span')
  userDiv.append(emailSpan)
  emailSpan.append(review.email)

  // Mostramos la puntuacion
  const guideTitleDiv = document.createElement('div')
  article.append(guideTitleDiv)
  const score = document.createElement('ul')
  guideTitleDiv.append(score)
  score.className = 'rating'
  for (let i = 0; i < 5; i++) {
    const scoreStar = document.createElement('li')
    score.append(scoreStar)
    scoreStar.className = 'rating-item'
    scoreStar.setAttribute('data-rate', i + 1)
    if (i + 1 === review.score) {
      scoreStar.classList.add('active')
    }
  }
  // Mostramos el titulo
  const title = document.createElement('h3')
  guideTitleDiv.append(title)
  title.textContent = review.title

  // Mostramos el contenido de la review
  const contentDiv = document.createElement('div')
  const p = document.createElement('p')
  p.textContent = review.content
  contentDiv.append(p)
  article.append(contentDiv)

  div.append(article)
}

async function getReviews (id) {
  const res = await fetch(`http://localhost/reviews/${id}`)
  return await res.json()
}

function getTotalScore (reviews) {

}

// Funcion para añadir al carrito la pieza
function addPartCart (part, quantity) {
  // Si no existe creamos el carrito
  if (window.localStorage.getItem('cart') === null) {
    window.localStorage.setItem('cart', JSON.stringify([]))
  }

  // Añadimos la pieza al carrito
  const cart = JSON.parse(window.localStorage.getItem('cart'))

  // GARRAFAL ERROR DE SEGURIDAD!!!!! (Si dios quiere tengo tiempo para arreglarlo)
  // const price = Number(((document.querySelector('#productInfoPrice').innerText).slice(0, -1)))

  // Se pudo arreglar :)
  const optionId = Number(document.querySelector('#partImage').alt)
  const option = part.options.find(option => option.id === optionId)
  const partCart = {
    id: part.id,
    name: part.name,
    quantity: Number(quantity),
    price: option.price,
    imgUrl: option.imgUrl,
    optionId: option.id
  }
  let alreadyInCart = false
  // Si el producto esta en el carrito, le sumamos la cantidad
  for (const product of cart) {
    if (product.optionId === partCart.optionId) {
      product.quantity += partCart.quantity
      alreadyInCart = true
    }
  }
  // Si el producto no esta en carrito se añade
  if (!alreadyInCart) {
    cart.push(partCart)
  }

  window.localStorage.setItem('cart', JSON.stringify(cart))

  window.location.href = './cart.html'
}

// Obtenemos el id de la pieza deseada
const urlParams = new URLSearchParams(window.location.search)
const partId = urlParams.get('id') || 0

mostrarPieza(partId)
