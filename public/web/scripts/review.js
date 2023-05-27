'use strict'

async function getPart (id) {
  const res = await fetch(`http://localhost/parts/${id}`)
  return await res.json()
}

async function showReviewPart (id, div) {
  const part = await getPart(id)
  // eslint-disable-next-line no-undef
  mostrarParte(part, div)
}

async function uploadReview (formData) {
  await fetch('http://localhost/reviews', {
    method: 'POST',
    body: formData
  })
}

function getScore () {
  return Number(document.querySelector('.active').getAttribute('data-rate'))
}
// Funcionamiento de las estrellas
const container = document.querySelector('.rating')
const items = container.querySelectorAll('.rating-item')
container.onclick = (e) => {
  const eClass = e.target.classList
  if (!eClass.contains('active')) {
    items.forEach(
      item => item.classList.remove('active')
    )
    eClass.add('active')
  }
  console.log()
}

// Mostramos la pieza
const partDiv = document.querySelector('#part')
const urlParams = new URLSearchParams(window.location.search)
const partId = urlParams.get('part') || 0

showReviewPart(partId, partDiv)

const form = document.forms.review
form.onsubmit = (e) => {
  e.preventDefault()
  const user = JSON.parse(window.localStorage.getItem('user'))
  const date = new Date().toISOString().slice(0, 10)
  const formData = new FormData()
  formData.append('title', form.title.value)
  formData.append('score', getScore())
  formData.append('content', form.content.value)
  formData.append('email', user.email)
  formData.append('part', partId)
  formData.append('date', date)
  uploadReview(formData)
  document.location.href = `./part.html?id=${partId}`
}
