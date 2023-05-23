'use strict'

async function showUser (user) {
  const nameSpan = document.querySelector('#nameUser')
  nameSpan.append(`${user.name} ${user.surname1} ${user.surname2}`)
  const pfpImg = document.querySelector('#pfp')
  pfpImg.alt = `${user.email}pfp`
  pfpImg.setAttribute('src', user.imgUrl)
  const balanceSpan = document.querySelector('#balance')
  balanceSpan.textContent = `Saldo: ${user.balance}€`
  showOrders(user)
}

async function showOrders (email) {
  const orders = await getUserOrders(email)
  const section = document.querySelector('#orders')
  for (const order of orders) {
    showOrder(section, order)
  }
}

async function showOrder (section, order) {
  const article = document.createElement('article')
  const h3 = document.createElement('h3')
  article.append(h3)
  h3.append(order.date)
  const partsDiv = document.createElement('div')
  article.append(partsDiv)
  console.log(order)
  // Mostramos las piezas
  for (const part of order.parts) {
    showPart(partsDiv, part.id, part.option, part.quantity, part.price)
  }
  section.append(article)
}

async function showPart (div, partId, optionId, quantity, price) {
  // Obtenemos la pieza
  const part = await getPart(partId)

  // Obtenemos la opcion
  const option = part.options.find(opt => opt.id === optionId)
  console.log(option)
  // Mostramos la imagen de la opcion
  const img = document.createElement('img')
  div.append(img)
  img.setAttribute('src', option.imgUrl)
  img.alt = option.imgUrl

  // Mostramos el nombre de la opcion
  const nameSpan = document.createElement('span')
  nameSpan.append(option.name)
  div.append(nameSpan)

  // Mostramos la cantidad y el precio
  const quantitySpan = document.createElement('span')
  quantitySpan.append(`${quantity} unidades`)
  div.append(quantitySpan)

  const priceSpan = document.createElement('span')
  priceSpan.append(`${price}€/u`)
  div.append(priceSpan)

  // Mostramos el enlace para escribir la review
  const reviewA = document.createElement('a')
  reviewA.append('Escribir reseña')
  reviewA.setAttribute('href', `./writeReview.html?part=${partId}&option=${optionId}`)
  div.append(reviewA)
}

async function getUserOrders (email) {
  const res = await fetch(`http://localhost/orders/${email}`)
  return await res.json()
}

async function showGuides () {

}

async function getUserGuides () {

}

async function addBalance () {

}

async function changePfp () {

}

async function getPart (partId) {
  const res = await fetch(`http://localhost/parts/${partId}`)
  return await res.json()
}

if (window.localStorage.getItem('user') !== null) {
  const user = JSON.parse(window.localStorage.getItem('user'))
  showUser(user)
} else {
  window.location.href = './error.html'
}
