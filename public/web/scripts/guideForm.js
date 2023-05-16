'use strict'

/* eslint-disable no-eval */

async function showParts (select) {
  // Recibimos las partes
  const res = await fetch('http://localhost/parts')
  const json = await res.json()

  // Las mostramos en el select
  for (const part of json) {
    const option = document.createElement('option')
    option.value = part.id
    option.append(part.name)
    select.append(option)
  }
}

function howManySteps () {
  return document.querySelectorAll('.step:not([style*="display: none"])').length
}
function howManyInstructionsInStep (step) {
  return document.querySelectorAll(`.step${step}Instruction:not([style*="display: none"])`).length
}

async function insertGuide (formData) {
  const res = await fetch('http://localhost/parts', {
    method: 'POST',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  if (json.id !== undefined) {
    window.alert('Pieza insertada exitosamente')
    window.location.href = './index.html'
  }
}
async function updateGuide (id, formData) {
  const res = await fetch(`http://localhost/parts/${id}`, {
    method: 'PUT',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  if (json.id !== undefined) {
    window.location.href = './index.html'
  }
}
async function deleteGuide (id) {
  const res = await fetch(`http://localhost/parts/${id}`, {
    method: 'DELETE'
  })
  const json = await res.json()
  if (json.message === 'delete successful') {
    window.alert('Pieza borrada exitosamente')
    // window.location.href = './index.html'
  }
}

// Funcion que muestra la guia
async function showGuide (id, form) {
  // Recibimos la parte de la api
  const res = await fetch(`http://localhost/guides/${id}`)
  const json = await res.json()
  const imgDiv = document.querySelector('#imgDiv')
  const img = document.createElement('img')
  img.setAttribute('src', json.imgUrl)
  img.alt = json.name
  imgDiv.prepend(img)

  // Rellenamos los campos con la parte
  form.title.value = json.name
  form.intro.value = json.intro
  form.time.value = json.duration
  form.difficulty.selectedIndex = json.difficulty
  form.part.selectedIndex = json.part - 1

  // Mostramos las opciones de la parte
  let stepsQuantity = 0
  for (const step of json.steps) {
    console.log(step)
    addStepForm(stepsQuantity, true, step.id)
    eval('form.nameStep' + stepsQuantity + '.value = step.name')

    // Mostramos la imagen
    const stepImg = document.createElement('img')
    stepImg.setAttribute('src', step.imgUrl)

    const imageDiv = document.querySelector(`#step${stepsQuantity}Image`)
    imageDiv.append(stepImg)
    stepsQuantity++
  }
}
// Evento del boton para generar un formulario de instruccion
function addInstructionForm (div, i, stepNum, isUpdate, id) {
  // Generamos el div de la instruccion
  const instructionDiv = document.createElement('div')
  instructionDiv.className = `step${stepNum}Instruction`
  // Generamos el select con los tipos de instruccion
  const instructionType = document.createElement('select')
  instructionType.name = `step${stepNum}Instruction${i}Type`
  const normalType = document.createElement('option')
  normalType.value = 'normal'
  normalType.append('Normal')
  instructionType.append(normalType)
  const adviceType = document.createElement('option')
  adviceType.value = 'advice'
  adviceType.append('Consejo')
  instructionType.append(adviceType)
  const warningType = document.createElement('option')
  warningType.value = 'warning'
  warningType.append('Advertencia')
  instructionType.append(warningType)
  instructionDiv.append(instructionType)

  const instructionText = document.createElement('input')
  instructionText.type = 'text'
  instructionText.required = true
  instructionText.name = `step${stepNum}Instruction${i}Text`
  instructionDiv.append(instructionText)

  div.append(instructionDiv)
}
// Evento del boton para generar un formulario de paso
function addStepForm (i, isUpdate, id) {
  // Generamos el div del paso
  const stepsDiv = document.querySelector('#steps')
  const stepDiv = document.createElement('div')
  const stepHeader = document.createElement('div')
  const stepContent = document.createElement('div')
  stepDiv.className = 'step'

  // Si la opcion existe mostramos la imagen generamos un div en el que poner la imagen
  if (isUpdate) {
    const imageDiv = document.createElement('div')
    imageDiv.id = `step${i}Image`
    stepContent.append(imageDiv)
  }

  // Contenemos el formulario del step en un div
  const stepForm = document.createElement('div')

  // Generamos los campos de la opcion
  // Nombre
  const stepCounter = document.createElement('span')
  stepCounter.innerText = `Paso ${i + 1}`
  stepHeader.append(stepCounter)

  const nameDiv = document.createElement('div')

  const nameLabel = document.createElement('label')
  nameLabel.for = `nameStep${i}`
  nameLabel.append('Nombre:')
  nameDiv.append(nameLabel)

  const nameInput = document.createElement('input')
  nameInput.name = `nameStep${i}`
  nameInput.type = 'text'
  nameInput.required = true
  nameDiv.append(nameInput)

  stepForm.append(nameDiv)

  // Imagen
  const imageDiv = document.createElement('div')

  const imageLabel = document.createElement('label')
  imageLabel.for = `imagenOpt${i}`
  imageLabel.append('Imagen:')
  imageDiv.append(imageLabel)

  const imageInput = document.createElement('input')
  imageInput.name = `imagenOpt${i}`
  imageInput.type = 'file'
  imageInput.accept = 'image/*'
  imageDiv.append(imageInput)

  // Si la imagen no se actualiza es obligatoria
  if (!isUpdate) {
    imageInput.required = true
  }
  stepForm.append(imageDiv)
  // Creamos la lista para las instrucciones
  const instructionsDiv = document.createElement('div')
  instructionsDiv.id = `instrucctionsStep${i}`
  const instructionsHeader = document.createElement('span')
  instructionsHeader.append('Instrucciones:')
  instructionsDiv.append(instructionsHeader)
  stepForm.append(instructionsDiv)

  // Boton para crear instrucciones en el paso
  const addInstructionButton = document.createElement('button')
  addInstructionButton.type = 'button'
  addInstructionButton.append('+')
  addInstructionButton.onclick = () => {
    console.log(instructionsDiv, howManyInstructionsInStep(i), i)
    addInstructionForm(instructionsDiv, howManyInstructionsInStep(i), i)
  }
  stepForm.append(addInstructionButton)
  // Creacion del boton para eliminar la opcion
  const eraseButton = document.createElement('button')
  eraseButton.type = 'button'
  eraseButton.append('X')
  eraseButton.className = 'eraseButton'
  stepHeader.append(eraseButton)

  if (isUpdate) {
    stepDiv.className += ' stepUpdate'
  }
  // Si la opcion ya es existente le asignamos un id
  if (id > 0) {
    stepDiv.id = id
  }

  // Evento para borrar la opcion
  eraseButton.onclick = (e) => {
    // Si el contenedor es de clase stepUpdate no lo borraremos de la interfaz si no que se ocultara para luego
    // Poder acceder a sus datos para realizar la consulta de delete
    let div = e.target.closest('.stepUpdate')
    if (div !== null) {
      div.style.display = 'none'
    }
    // Si el contenedor es de clase step lo eliminaremos de la interfaz
    div = e.target.closest('.step')
    if (div !== null) {
      div.remove()
    }
  }
  stepContent.append(stepForm)
  stepDiv.append(stepHeader)
  stepDiv.append(stepContent)
  stepsDiv.append(stepDiv)
}
// Obtenemos el id de la pieza
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get('id') || 0

// Si el usuario es un admin o anonimo, le redirigimos a otra pagina
// eslint-disable-next-line no-undef
if (!isLogged()) {
  window.location.href = './error.html'
}

const form = document.forms.guia
showParts(form.part)
const addStepButton = document.querySelector('#addStepButton')
let stepsQuantity = 0

// Si tiene una id, se muestran los datos de la guia
if (id > 0) {
  showGuide(id, form)
  // Mostramos el boton para borrar la pieza
  const delButton = document.createElement('button')
  delButton.className = 'deleteBtn'
  delButton.type = 'button'
  delButton.innerText = 'Borrar pieza'
  delButton.onclick = () => {
    if (window.confirm('¿Está seguro de que quiere borrar la pieza de manera permanente?') === true) {
      // deletePart(id)
      window.location.href = './index.html'
    }
  }
  const delDiv = document.querySelector('#commands')
  delDiv.append(delButton)
}

// Creacion de los select de categorias
addStepButton.onclick = function (e) {
  addStepForm(stepsQuantity)
  stepsQuantity++
  console.log(document.querySelectorAll('.step'))
}

// Evento submit del formulario
form.onsubmit = (e) => {
  e.preventDefault()
  // Prevents HTML handling submission
  const steps = document.querySelectorAll('.stepUpdate, .step')
  // Creamos un formData al que pasarle todos los datos del formulario
  const formData = new FormData()

  formData.append('name', form.nombre.value)
  formData.append('description', form.descripcion.value)
  formData.append('warranty', form.garantia.value)
  formData.append('warning', form.advertencia.value)
  formData.append('note', form.nota.value)
  formData.append('category', form.categoria.value)
  formData.append('appliance', form.electronico.value)
  const stepsArr = []
  let i = 0
  for (const step of steps) {
    const file = eval('form.imagenOpt' + i)
    // Si la opcion se tiene que actualizar porque ya existia lo marcamos
    let update = step.className === 'stepUpdate'
    // Si la opcion ha sido borrada de la interfaz
    const isDelete = step.style.display === 'none'

    if (isDelete) {
      update = false
    }
    // Si la opcion tiene que actualizar la imagen
    const imageUpload = file.files[0] !== undefined
    if (imageUpload && !isDelete) {
      formData.append('files', file.files[0])
    }
    // Appends value of text input
    stepsArr.push({
      id: step.id,
      name: eval('form.nombreOpt' + i + '.value'),
      price: eval('form.precioOpt' + i + '.value'),
      update,
      imageUpload,
      isDelete
    })

    i++
  }
  const stepsJson = JSON.stringify(stepsArr)
  console.log(stepsJson)
  formData.append('steps', stepsJson)
  if (howManySteps() > 0) {
    // if (id > 0) {
    //   updatePart(id, formData)
    // } else {
    //   insertPart(formData)
    // }
  } else {
    window.alert('La pieza necesita como mínimo 1 opción')
  }
}
