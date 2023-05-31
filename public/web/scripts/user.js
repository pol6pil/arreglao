'use strict'

async function showUser (user) {
  console.log(user)
  const nameSpan = document.querySelector('#nameUser')
  nameSpan.append(`${user.name} ${user.surname1} ${user.surname2}`)
  const pfpImg = document.querySelector('#pfp')
  pfpImg.alt = `${user.email}pfp`
  pfpImg.setAttribute('src', user.imgUrl)
  const balanceSpan = document.querySelector('#balance')
  balanceSpan.textContent = `Saldo: ${user.balance}€`
  showOrders(user.email)
  showGuides(user.email)
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
  const partDiv = document.createElement('div')
  // Mostramos la imagen de la opcion
  const img = document.createElement('img')
  partDiv.append(img)
  img.setAttribute('src', option.imgUrl)
  img.alt = option.imgUrl

  // Mostramos el nombre de la opcion
  const nameSpan = document.createElement('span')
  nameSpan.append(option.name)
  partDiv.append(nameSpan)

  // Mostramos la cantidad y el precio
  const quantitySpan = document.createElement('span')
  quantitySpan.append(`${quantity} unidades`)
  partDiv.append(quantitySpan)

  const priceSpan = document.createElement('span')
  priceSpan.append(`${price}€/u`)
  partDiv.append(priceSpan)

  // Mostramos el enlace para escribir la review
  const reviewA = document.createElement('a')
  reviewA.append('Escribir reseña')
  reviewA.setAttribute('href', `./writeReview.html?part=${partId}`)
  partDiv.append(reviewA)
  div.append(partDiv)
}

async function getUserOrders (email) {
  console.log(email)
  const res = await fetch(`http://localhost/orders/${email}`)
  return await res.json()
}

async function showGuides (email) {
  const section = document.querySelector('#guidesSection')
  // Obtenemos las guias
  const guides = await getUserGuides(email)
  // Las mostramos
  for (const guide of guides) {
    // eslint-disable-next-line no-undef
    showGuide(guide, section, true)
  }
}

async function getUserGuides (email) {
  const res = fetch(`http://localhost/guides/user/${email}`)
  return (await res).json()
}

async function addBalance (balance, email, add) {
  if (add > 0) {
    const formData = new FormData()

    formData.append('balance', balance + add)
    const res = await fetch(`http://localhost/users/${email}/balance`, {
      method: 'PUT',
      body: formData
    })
    console.log(await res.json())
  }
}

async function changePfp (email, formData) {
  const res = await fetch(`http://localhost/users/${email}/changePfp`, {
    method: 'PUT',
    body: formData
  })
  const json = await res.json()
  return json.imgUrl
}

async function getPart (partId) {
  const res = await fetch(`http://localhost/parts/${partId}`)
  return await res.json()
}
let user
if (window.localStorage.getItem('user') !== null) {
  user = JSON.parse(window.localStorage.getItem('user'))
  showUser(user)
} else {
  window.location.href = './error.html'
}

const addBalanceButton = document.querySelector('#addBalance')
addBalanceButton.onclick = () => {
  addBalance(user.balance, user.email, 300)
  const balanceSpan = document.querySelector('#balance')
  user.balance += 300
  balanceSpan.textContent = `Saldo: ${user.balance}€`
  window.localStorage.setItem('user', JSON.stringify(user))
}

const changePfpButton = document.querySelector('#changePfp')
changePfpButton.onclick = async (e) => {
  e.preventDefault()
  const imageInput = document.querySelector('#imageInput')
  if (imageInput.files.length > 0) {
    // Si hay imagen, la actualizamos
    const formData = new FormData()
    formData.append('files', imageInput.files[0])

    // Recibimos el url de la imagen cambiada
    const imgUrl = await changePfp(user.email, formData)
    user.imgUrl = imgUrl

    // Actualizamos el usuario
    window.localStorage.setItem('user', JSON.stringify(user))
  } else {
    // Si no hay imagen lo mostramos
    window.alert('No se ha seleccionado ninguna imagen para cambiar')
  }
}
