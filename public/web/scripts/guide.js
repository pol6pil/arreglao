'use strict'

async function getGuide (id) {
  const res = await fetch(`http://localhost/guides/${id}`)
  return await res.json()
}

async function getPart (id) {
  const res = await fetch(`http://localhost/parts/${id}`)
  return await res.json()
}

async function showGuide (id) {
  const guide = await getGuide(id)
  console.log(guide)
  // Rellemanos la seccion de presentacion
  const presentation = document.querySelector('#presentation')
  const presentationImg = document.createElement('img')
  presentationImg.alt = guide.name
  presentationImg.setAttribute('src', guide.imgUrl)
  presentation.prepend(presentationImg)
  const presentationH1 = document.querySelector('#presentation h1')
  presentationH1.append(guide.name)
  const presentationAuthor = document.querySelector('#author')
  presentationAuthor.append(guide.user)

  const guideInfoDiv = document.querySelector('#guideInfo')
  presentation.append(guideInfoDiv)

  // Mostramos la duracion
  const durationDiv = document.createElement('div')
  const durationSpan = document.createElement('span')
  durationSpan.append(`${guide.duration} minutos`)
  durationDiv.id = 'duration'
  durationDiv.append(durationSpan)
  guideInfoDiv.append(durationDiv)

  // Mostramos la difficultad
  const difficultyDiv = document.createElement('div')
  const difficultySpan = document.createElement('span')
  difficultyDiv.append(difficultySpan)
  difficultyDiv.className = 'difficulty'
  if (guide.difficulty === 0) {
    difficultyDiv.className += ' easy'
    difficultySpan.append('Facil')
  } else if (guide.difficulty === 1) {
    difficultyDiv.className += ' medium'
    difficultySpan.append('Normal')
  } else if (guide.difficulty === 2) {
    difficultyDiv.className += ' hard'
    difficultySpan.append('Dificil')
  }
  guideInfoDiv.append(difficultyDiv)

  // Mostramos la introduccion
  const introDiv = document.querySelector('#introContent')
  const introP = document.createElement('p')
  introP.append(guide.intro)
  introDiv.append(introP)
  // Mostramos la pieza
  const partDiv = document.querySelector('#part')
  const part = await getPart(guide.part)
  // eslint-disable-next-line no-undef
  mostrarParte(part, partDiv)

  // Mostramos los pasos
  let stepIndex = 0
  for (const step of guide.steps) {
    const stepsDiv = document.querySelector('#steps')
    showStep(step, stepsDiv, stepIndex)
    stepIndex++
  }

  // Mostramos el boton para aceptar la guia
  // eslint-disable-next-line no-undef
  if (isAdmin()) {
    const introHeaderDiv = document.querySelector('#introContent div:first-child')
    if (guide.accepted === 0) {
      const acceptButton = document.createElement('button')
      acceptButton.append('Aceptar guía')
      acceptButton.type = 'button'
      acceptButton.onclick = async () => {
        const message = await acceptGuide(guide.id)
        // Si se ha aceptado con exito lo mostramos
        if (message.message !== undefined) {
          window.alert('Guia aceptada exitosamente')
          window.location.href = './index.html'
        }
      }
      introHeaderDiv.append(acceptButton)
    }
    const deleteButton = document.createElement('button')
    deleteButton.append('Borrar guia')
    deleteButton.type = 'button'
    deleteButton.className = 'eraseButton'
    deleteButton.onclick = async () => {
      const message = await deleteGuide(guide.id)
      // Si se ha aceptado con exito lo mostramos
      if (message.message !== undefined) {
        window.alert('Guia borrada exitosamente')
        window.location.href = './index.html'
      }
    }
    introHeaderDiv.append(deleteButton)
  }
}

async function deleteGuide (id) {
  const res = await fetch(`http://localhost/guides/${id}`, {
    method: 'DELETE'
  })
  return await res.json()
}

async function acceptGuide (id) {
  const res = await fetch(`http://localhost/guides/accept/${id}`, {
    method: 'PUT'
  })
  return await res.json()
}

function showStep (step, div, i) {
  const article = document.createElement('article')
  article.id = `step${i}`
  // Mostramos el numero del paso y el nombre si tiene
  const titleDiv = document.createElement('div')
  article.append(titleDiv)
  const titleh2 = document.createElement('h2')
  titleDiv.append(titleh2)
  const titleStrong = document.createElement('strong')
  titleStrong.append(`Paso ${i + 1} `)
  titleh2.append(titleStrong)
  // Si tiene nombre lo mostramos
  if (step.name.length > 0) {
    const titleSpan = document.createElement('span')
    titleSpan.append(step.name)
    titleh2.append(titleSpan)
  }
  const contentDiv = document.createElement('div')
  article.append(contentDiv)

  // Mostramos la imagen del paso
  const imageDiv = document.createElement('div')
  contentDiv.append(imageDiv)
  const image = document.createElement('img')
  imageDiv.append(image)
  image.alt = `step${i}Image`
  image.setAttribute('src', step.imgUrl)

  // Mostramos las instrucciones del paso
  const instructionsDiv = document.createElement('div')
  contentDiv.append(instructionsDiv)
  const instructionsUl = document.createElement('ul')
  instructionsDiv.append(instructionsUl)
  for (const instruction of step.instructions) {
    showInstruction(instruction, instructionsUl)
  }
  div.append(article)
}

function showInstruction (instruction, ul) {
  const instructionLi = document.createElement('li')
  instructionLi.append(instruction.instruction)
  if (instruction.type === 1) {
    instructionLi.className = 'advice'
  } else if (instruction.type === 2) {
    instructionLi.className = 'warning'
  }
  ul.append(instructionLi)
}

const urlParams = new URLSearchParams(window.location.search)
const guideId = urlParams.get('id') || 0
console.log(guideId)

// Si no hay ninguna guia, redirigimos la pagina
if (guideId === 0) {
  window.location.href = './error.html'
}

showGuide(guideId)
