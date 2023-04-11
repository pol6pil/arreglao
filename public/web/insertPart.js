/* eslint-disable no-eval */

async function showCategories (div) {
  // Creamos el select
  const select = document.createElement('select')
  select.name = 'categoria'

  // Recibimos las categorias
  const res = await fetch('http://localhost/categories')
  const json = await res.json()

  for (const category of json) {
    const option = document.createElement('option')
    option.value = category.id
    option.append(category.name)
    select.append(option)
  }
  div.append(select)
}

async function showAppliances (div) {
  // Creamos el select
  const select = document.createElement('select')
  select.name = 'electronico'

  // Recibimos las categorias
  const res = await fetch('http://localhost/appliances')
  const json = await res.json()

  for (const category of json) {
    const option = document.createElement('option')
    option.value = category.id
    option.append(category.name)
    select.append(option)
  }
  div.append(select)
}

async function insertPart (formData) {
  const res = await fetch('http://localhost/parts', {
    method: 'POST',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  console.log(json)
}
async function updatePart (id, formData) {
  const res = await fetch(`http://localhost/parts/${id}`, {
    method: 'PUT',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  console.log(json)
}

// Funcion que muestra la parte
async function showPart (id, form) {
  // Recibimos la parte de la api
  const res = await fetch(`http://localhost/parts/${id}`)
  const json = await res.json()
  console.log(json)

  // Rellenamos los campos con la parte
  form.nombre.value = json.name
  form.descripcion.value = json.description
  form.garantia.value = json.warranty
  form.advertencia.value = json.warning
  form.nota.value = json.note
  form.garantia.value = json.warranty

  form.electronico.selectedIndex = json.appliance - 1
  form.categoria.selectedIndex = json.category - 1

  // Mostramos las opciones de la parte
  // eslint-disable-next-line no-unused-vars
  for (const option of json.options) {
    addOptionForm(options)
    eval('form.nombreOpt' + options + '.value = option.name')
    options++
  }
}
// Evento del boton para generar un formulario de opcion
function addOptionForm (id) {
  // Generamos el div de la opcion
  const optionsDiv = document.querySelector('#options')
  const optionDiv = document.createElement('div')
  optionDiv.className = 'option'

  // Generamos los campos de la opcion
  // Nombre
  const nombreDiv = document.createElement('div')

  const nombreLabel = document.createElement('label')
  nombreLabel.for = `nombreOpt${id}`
  nombreLabel.append('Nombre:')
  nombreDiv.append(nombreLabel)

  const nombreInput = document.createElement('input')
  nombreInput.name = `nombreOpt${id}`
  nombreInput.type = 'text'
  nombreInput.required = true
  nombreDiv.append(nombreInput)

  optionDiv.append(nombreDiv)

  // Imagen
  const imagenDiv = document.createElement('div')

  const imagenLabel = document.createElement('label')
  imagenLabel.for = `imagenOpt${id}`
  imagenLabel.append('Imagen:')
  imagenDiv.append(imagenLabel)

  const imagenInput = document.createElement('input')
  imagenInput.name = `imagenOpt${id}`
  imagenInput.type = 'file'
  imagenInput.accept = 'image/*'
  imagenDiv.append(imagenInput)

  optionDiv.append(imagenDiv)

  // Precio
  const precioDiv = document.createElement('div')

  const precioLabel = document.createElement('label')
  precioLabel.for = `precioOpt${id}`
  precioLabel.append('Precio:')
  precioDiv.append(precioLabel)

  const precioInput = document.createElement('input')
  precioInput.name = `precioOpt${id}`
  precioInput.type = 'number'
  precioInput.step = '.01'
  precioInput.required = true
  precioDiv.append(precioInput)

  optionDiv.append(precioDiv)
  optionsDiv.append(optionDiv)
}
// Recibimos el usuario y el id del producto
const isAdmin = true
// Create urlParams query string
const urlParams = new URLSearchParams(window.location.search)

// Get value of single parameter
const id = urlParams.get('id') || 0

// Si el usuario no es una admin, le redirigimos a otra pagina
if (!isAdmin) {
  window.location.href = './parts.html'
}

const form = document.forms.pieza
const categories = form.querySelector('#categories')
const appliances = form.querySelector('#appliances')
showCategories(categories)
showAppliances(appliances)
const addOptionButton = document.querySelector('#addOptionButton')
let options = 0

// Si tiene una id, se muestran los datos de la parte
if (id > 0) {
  showPart(id, form)
}

// Creacion de los select de categorias
addOptionButton.onclick = function (e) {
  addOptionForm(options)
  options++
}

// Evento submit del formulario
form.onsubmit = (e) => {
  e.preventDefault()
  // Prevents HTML handling submission
  const options = document.querySelectorAll('.option')
  const formData = new FormData()
  // Creates empty formData object
  formData.append('name', form.nombre.value)
  formData.append('description', form.descripcion.value)
  formData.append('warranty', form.garantia.value)
  formData.append('warning', form.advertencia.value)
  formData.append('note', form.nota.value)
  formData.append('category', form.categoria.value)
  formData.append('appliance', form.electronico.value)
  const optionsArr = []
  let i = 0
  // eslint-disable-next-line no-unused-vars
  for (const option of options) {
    // Appends value of text input
    optionsArr.push({
      name: eval('form.nombreOpt' + i + '.value'),
      price: eval('form.precioOpt' + i + '.value')
    })
    if (true) {
      const file = eval('form.imagenOpt' + i)
      formData.append('files', file.files[0])
      console.log(file.files)
    }
    i++
  }
  const optionsJson = JSON.stringify(optionsArr)
  formData.append('options', optionsJson)
  insertPart(formData)
//   if (id > 0) {
//     updatePart(formData)
//   } else {
//     insertPart(formData)
//   }
}
