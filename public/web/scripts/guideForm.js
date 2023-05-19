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
  console.log('a')
  const res = await fetch('http://localhost/guides', {
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
  const res = await fetch(`http://localhost/guides/${id}`, {
    method: 'PUT',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  if (json.id !== undefined) {
    window.location.href = './index.html'
  }
}
async function deleteGuide (id) {
  const res = await fetch(`http://localhost/guides/${id}`, {
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
  console.log(json)
  img.setAttribute('src', json.imgUrl)
  img.alt = json.name
  imgDiv.prepend(img)

  // Rellenamos los campos con la parte
  form.title.value = json.name
  form.intro.value = json.intro
  form.time.value = json.duration
  form.difficulty.selectedIndex = json.difficulty
  console.log(form.part)

  // Recorremos las opciones del select de las piezas para mostrar la opcion correcta
  const options = form.part.querySelectorAll('option')
  console.log(options)
  for (const option of options) {
    console.log(option.value === json.part.toString(), option.value, json.part.toString())
    option.selected = option.value === json.part.toString()
  }
  // Mostramos los pasos de la guia
  for (const step of json.steps) {
    addStepForm(howManySteps(), true, step.id)
    eval(`form.nameStep${howManySteps() - 1}.value = step.name`)

    // Mostramos la imagen
    const stepImg = document.createElement('img')
    stepImg.setAttribute('src', step.imgUrl)

    const imageDiv = document.querySelector(`#step${howManySteps() - 1}Image`)
    imageDiv.append(stepImg)
    for (const instruction of step.instructions) {
      console.log(instruction)
      const instructionsDiv = document.querySelector(`#instructionsStep${howManySteps() - 1}`)
      addInstructionForm(instructionsDiv, howManyInstructionsInStep(howManySteps() - 1), howManySteps() - 1, true, instruction.id)
      eval(`form.step${howManySteps() - 1}Instruction${howManyInstructionsInStep(howManySteps() - 1) - 1}Text.value = instruction.instruction`)
      eval(`form.step${howManySteps() - 1}Instruction${howManyInstructionsInStep(howManySteps() - 1) - 1}Type.selectedIndex = instruction.type`)
    }
  }
}
// Evento del boton para generar un formulario de instruccion
function addInstructionForm (div, i, stepNum, isUpdate, id) {
  // Generamos el div de la instruccion
  const instructionDiv = document.createElement('div')
  instructionDiv.className = `step${stepNum}Instruction`
  const instructionContentDiv = document.createElement('div')
  // Generamos el select con los tipos de instruccion
  const typeDiv = document.createElement('div')
  const typeSpan = document.createElement('span')
  typeSpan.append('Tipo:')
  typeDiv.append(typeSpan)
  const instructionType = document.createElement('select')
  instructionType.name = `step${stepNum}Instruction${i}Type`
  const normalType = document.createElement('option')
  normalType.value = 0
  normalType.append('Normal')
  instructionType.append(normalType)
  const adviceType = document.createElement('option')
  adviceType.value = 1
  adviceType.append('Consejo')
  instructionType.append(adviceType)
  const warningType = document.createElement('option')
  warningType.value = 2
  warningType.append('Advertencia')
  instructionType.append(warningType)
  typeDiv.append(instructionType)
  instructionContentDiv.append(typeDiv)

  const textDiv = document.createElement('div')
  const textSpan = document.createElement('span')
  textSpan.append('Instrucción')
  textDiv.append(textSpan)
  const instructionText = document.createElement('input')
  instructionText.type = 'text'
  instructionText.required = true
  instructionText.name = `step${stepNum}Instruction${i}Text`
  textDiv.append(instructionText)
  instructionContentDiv.append(textDiv)
  instructionDiv.append(instructionContentDiv)

  if (isUpdate) {
    instructionDiv.className += ' instructionUpdate'
  }
  // Si la guia ya es existente le asignamos un id
  if (id > 0) {
    instructionDiv.id = id
  }

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

  // Si la guia existe mostramos la imagen generamos un div en el que poner la imagen
  if (isUpdate) {
    const imageDiv = document.createElement('div')
    imageDiv.id = `step${i}Image`
    stepContent.append(imageDiv)
  }

  // Contenemos el formulario del step en un div
  const stepForm = document.createElement('div')
  if (id > 0) {
    stepForm.id = id
  }

  // Generamos los campos del paso
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
  nameDiv.append(nameInput)

  stepForm.append(nameDiv)

  // Imagen
  const imageDiv = document.createElement('div')

  const imageLabel = document.createElement('label')
  imageLabel.for = `imageStep${i}`
  imageLabel.append('Imagen:')
  imageDiv.append(imageLabel)

  const imageInput = document.createElement('input')
  imageInput.name = `imageStep${i}`
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
  instructionsDiv.id = `instructionsStep${i}`
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
  // Si la guia ya es existente le asignamos un id
  if (id > 0) {
    stepDiv.id = id
  }

  // Evento para borrar la opcion
  eraseButton.onclick = (e) => {
    // Si el contenedor es de clase stepUpdate no lo borraremos si no que se ocultara para luego
    // Poder acceder a sus datos para realizar la consulta de delete
    let div = e.target.closest('.stepUpdate')
    console.log(div)
    if (div !== null) {
      div.style.display = 'none'
    }
    // Si el contenedor es de clase step y no stepUpdate lo eliminaremos de la interfaz
    div = e.target.closest('.step:not(.stepUpdate)')
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
// Si tiene una id, se muestran los datos de la guia
if (id > 0) {
  setTimeout(() => showGuide(id, form), 20)

  // Mostramos el boton para borrar la pieza
  const delButton = document.createElement('button')
  delButton.className = 'deleteBtn'
  delButton.type = 'button'
  delButton.innerText = 'Borrar guia'
  delButton.onclick =(e) => {
    e.preventDefault()
    if (window.confirm('¿Está seguro de que quiere borrar la pieza de manera permanente?') === true) {
      deleteGuide(id)
      window.location.href = './index.html'
    }
  }
  const delDiv = document.querySelector('#commands')
  delDiv.append(delButton)
}

// Creacion de los select de los pasos
addStepButton.onclick = function (e) {
  addStepForm(howManySteps())
  console.log(document.querySelectorAll('.step'))
}

// Evento submit del formulario
console.log(form)
form.onsubmit = (e) => {
  e.preventDefault()
  // Prevents HTML handling submission
  const steps = document.querySelectorAll('.stepUpdate, .step')
  // Creamos un formData al que pasarle todos los datos del formulario
  const formData = new FormData()

  // Guardamos el email
  const user = JSON.parse(window.localStorage.getItem('user'))

  formData.append('title', form.title.value)
  formData.append('intro', form.intro.value)
  formData.append('time', form.time.value)
  formData.append('difficulty', form.difficulty.value)
  formData.append('email', user.email)
  formData.append('part', form.part.value)
  // Si la guia tiene que actualizar la imagen
  if (form.imagen.files[0] !== undefined) {
    formData.append('files', form.imagen.files[0])
    // Le añadimos un booleano para que el back pueda saber si la imagen es de la guia o de un paso
    formData.append('imageUpload', true)
  }
  const stepsArr = []
  let i = 0
  for (const step of steps) {
    const instructions = document.querySelectorAll(`.step${i}Instruction`)
    console.log(instructions, `step${i}Instruction`)
    const instructionsArr = []
    let j = 0
    for (const instruction of instructions) {
      let updateInstruction = instruction.classList.contains('instructionUpdate')
      // Si la instruccion ha sido borrada de la interfaz
      const isDelete = instruction.style.display === 'none'
      if (isDelete) {
        updateInstruction = false
      }
      instructionsArr.push({
        id: instruction.id,
        text: eval(`form.step${i}Instruction${j}Text.value`),
        type: eval(`form.step${i}Instruction${j}Type.value`),
        updateInstruction,
        isDelete
      })
      j++
    }
    const file = eval(`form.imageStep${i}`)
    // Si el paso se tiene que actualizar porque ya existia lo marcamos
    let update = step.classList.contains('stepUpdate')
    // Si el paso ha sido borrada de la interfaz
    const isDelete = step.style.display === 'none'

    if (isDelete) {
      update = false
    }
    // Si el paso tiene que actualizar la imagen
    console.log(file)
    const imageUpload = file.files[0] !== undefined
    if (imageUpload && !isDelete) {
      formData.append('files', file.files[0])
    }
    // Appends value of text input
    stepsArr.push({
      id: step.id,
      name: eval(`form.nameStep${i}.value`),
      update,
      imageUpload,
      isDelete,
      instructions: instructionsArr
    })

    i++
  }
  console.log(stepsArr)
  const stepsJson = JSON.stringify(stepsArr)
  console.log(stepsJson)
  formData.append('steps', stepsJson)
  if (howManySteps() > 0) {
    if (id > 0) {
      updateGuide(id, formData)
    } else {
      insertGuide(formData)
    }
  } else {
    window.alert('La pieza necesita como mínimo 1 opción')
  }
}
