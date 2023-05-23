'use strict'

// Mostramos el carrito
function showParts (cart, div) {
  if (cart !== null) {
    for (const part of cart) {
      showPart(part, div)
    }
  } else {
    const h3 = document.createElement('h3')
    h3.append('No hay productos en el carrito!')
    div.append(h3)
  }

  // Mostramos el total
  const totalPriceSpan = document.querySelector('#totalPrice')
  totalPriceSpan.textContent = `${getTotal(cart)}€`
}

function getTotal (cart) {
  let totalPrice = 0
  if (cart !== null) {
    for (const part of cart) {
      totalPrice += part.price * part.quantity
    }
  }
  return totalPrice
}

// Mostramos una pieza
function showPart (part, div) {
  const article = document.createElement('article')
  article.id = `option${part.optionId}`
  const partDiv = document.createElement('div')
  article.append(partDiv)
  // Mostramos la imagen
  const img = document.createElement('img')
  partDiv.append(img)
  img.setAttribute('src', part.imgUrl)
  img.alt = part.imgUrl
  // Mostramos el nombre
  const nameDiv = document.createElement('div')
  partDiv.append(nameDiv)
  const nameSpan = document.createElement('span')
  nameDiv.append(nameSpan)
  nameSpan.append(part.name)

  // Mostramos el precio
  const complementaryDiv = document.createElement('div')
  article.append(complementaryDiv)
  const priceDiv = document.createElement('div')
  complementaryDiv.append(priceDiv)
  const priceSpan = document.createElement('span')
  priceDiv.append(priceSpan)
  priceSpan.append(`${part.price}€`)

  // Mostramos la cantidad
  const quantityDiv = document.createElement('div')
  complementaryDiv.append(quantityDiv)
  const quantitySpan = document.createElement('span')
  quantityDiv.append(quantitySpan)
  quantitySpan.append(`${part.quantity} unidades`)

  // Mostramos el boton de borrar del carrito
  const eraseButton = document.createElement('button')
  eraseButton.type = 'button'
  eraseButton.append('X')
  eraseButton.className = 'eraseButton'
  eraseButton.onclick = () => {
    deletePart(part)
  }
  complementaryDiv.append(eraseButton)
  div.append(article)
}

function deletePart (part) {
  // Mostramos un confirm al usuario
  if (window.confirm(`Esta seguro que quiere eliminar ${part.name} del carrito?`)) {
    // Borramos la pieza de la interfaz
    const article = document.querySelector(`#option${part.optionId}`)
    article.remove()
    // Borramos la pieza del carrito
    let cart = JSON.parse(window.localStorage.getItem('cart'))
    cart = cart.filter(item => item.optionId !== part.optionId)
    // Guardamos los cambios
    if (cart.length > 0) {
      window.localStorage.setItem('cart', JSON.stringify(cart))
    } else {
      window.localStorage.removeItem('cart')
      cart = null
    }
    // Volvemos a renderizar el carrito
    const section = document.querySelector('#products')
    showParts(cart, section)
  }
}

function buyCart (cart) {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (cart !== null) {
    if (user !== null) {
      if (user.balance >= getTotal(cart)) {
        // Restamos el saldo al usuario
        user.balance -= getTotal(cart)
        // Subimos el pedido a la api
        const formData = new FormData()
        formData.append('email', user.email)
        formData.append('date', new Date().toISOString().slice(0, 10))
        formData.append('parts', JSON.stringify(cart))
        window.localStorage.setItem('user', JSON.stringify(user))
        placeOrder(formData)
        // Limpiamos el carrito
        window.localStorage.removeItem('cart')
      } else {
        // Si el usuario no tiene suficiente saldo se muestra
        window.alert('Saldo insuficiente')
      }
    } else {
      window.alert('Necesitas iniciar sesion para comprar productos')
    }
  } else {
    window.alert('No hay productos en el carrito')
  }
}

async function placeOrder (formData) {
  const res = await fetch('http://localhost/orders', {
    method: 'POST',
    body: formData
  })
  const json = await res.json()
  console.log(json)
}

const cart = JSON.parse(window.localStorage.getItem('cart'))
const section = document.querySelector('#products')
showParts(cart, section)

// Boton de comprar
const buyButton = document.querySelector('#buy')
buyButton.onclick = () => { buyCart(cart) }
