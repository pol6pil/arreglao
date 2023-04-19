'use strict'

async function obtenerPartes (appliance, orderBy, desc) {
  // Si el id del electrodomestico se ha declarado, filtraremos por electrodomestico
  let fetchQuerry = `http://localhost/parts/appliance/${appliance}`
  if (appliance <= 0) {
    fetchQuerry = 'http://localhost/parts'
  }
  const res = await fetch(fetchQuerry)
  const json = await res.json()

  // Si queremos ordenar las partes se ordenan
  if (orderBy !== undefined) {
    if (orderBy === 'price') {
      json.sort((a, b) => a.options[0].price - b.options[0].price)
    } else if (orderBy === 'name') {
      console.log(json)
      json.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  if (desc !== undefined) {
    json.reverse()
  }

  return json
}

async function mostrarPartes (appliance, orderBy, desc) {
  // Obtenemos las partes a mostrar
  const parts = await obtenerPartes(appliance, orderBy, desc)

  // Mostramos las partes
  const partsDiv = document.querySelector('#partes')
  for (const part of parts) {
    mostrarParte(part, partsDiv)
  }

  // Mostramos las categorias a filtrar
  const categories = await obtenerCategorias()
  mostrarCategorias(categories, parts)
  mostrarFiltroPrecio(categories, parts)
}

// Evento de los checkbox y del slider del precio que muestra las partes filtradas
function actualizarPartes (categories, parts) {
  const checkedCategories = []
  const partsDiv = document.querySelector('#partes')

  // Vaciamos el div que contiene las partes
  clearParts()

  // Filtramos por categorias
  if (categories !== undefined) {
    // Almacenamos las categorias que se quieren filtrar
    for (const category of categories) {
      const checkbox = document.querySelector(`#category${category.id}`)
      if (checkbox.checked) {
        checkedCategories.push(category.id)
      }
    }
  }

  // Filtramos por el precio
  const price = document.querySelector('#priceInput').value
  parts = parts.filter(part => part.options[0].price <= price)
  console.log(parts)

  // Si no hay ninguna categoria filtrada mostraremos todas
  if (checkedCategories.length === 0) {
    // Mostramos las partes
    for (const part of parts) {
      mostrarParte(part, partsDiv)
    }
  } else {
    // En caso de que haya se filtraran las categorias
    for (const checkedCategorie of checkedCategories) {
      const filteredParts = parts.filter(part => part.category === checkedCategorie)
      console.log(filteredParts)
      for (const part of filteredParts) {
        mostrarParte(part, partsDiv)
      }
    }
  }
}

// Obtenemos las categorias de la bbdd
async function obtenerCategorias () {
  const res = await fetch('http://localhost/categories')
  const json = await res.json()
  return json
}

// Mostramos las categorias
function mostrarCategorias (categories, parts) {
  const categoriasFiltrar = document.querySelector('#categoriasFiltrar')
  for (const category of categories) {
    const divCategory = document.createElement('div')
    const categoryName = document.createElement('span')
    categoryName.append(category.name)

    const categoryBox = document.createElement('input')
    categoryBox.type = 'checkbox'
    categoryBox.id = `category${category.id}`
    categoryBox.onchange = () => actualizarPartes(categories, parts)

    divCategory.append(categoryName)
    divCategory.append(categoryBox)

    categoriasFiltrar.append(divCategory)
  }
}
// Funcion que muestra el filtrado por precio
function mostrarFiltroPrecio (categories, parts) {
  // Obtenemos el precio maximo y minimo
  let maxPrice = 0
  let minPrice = 0

  for (const part of parts) {
    if (part.options[0].price > maxPrice) {
      maxPrice = part.options[0].price
    }
    if (part.options[0].price < minPrice) {
      minPrice = part.options[0].price
    }
  }

  const aside = document.querySelector('aside')
  const div = document.createElement('div')
  div.id = 'filtroPrecio'

  const span = document.createElement('span')
  span.append('Filtrar por precio')

  const price = document.createElement('span')
  price.append(maxPrice)
  price.id = 'priceOutput'

  const priceRange = document.createElement('input')
  priceRange.id = 'priceInput'
  priceRange.type = 'range'
  priceRange.value = maxPrice
  priceRange.max = maxPrice
  priceRange.min = minPrice
  priceRange.oninput = (e) => {
    const priceOutput = document.querySelector('#priceOutput')
    priceOutput.innerText = e.target.value
  }
  priceRange.onchange = () => actualizarPartes(categories, parts)
  div.append(span)
  div.append(price)
  div.append(priceRange)

  aside.append(div)
}

function mostrarParte (part, div) {
  const a = document.createElement('a')
  a.setAttribute('href', `./part.html?id=${part.id}`)

  const imgDiv = document.createElement('div')
  imgDiv.className = 'partPreviewImg'

  const img = document.createElement('img')
  img.setAttribute('src', part.options[0].imgUrl)
  imgDiv.append(img)

  const contentDiv = document.createElement('div')
  contentDiv.className = 'partPreviewInfo'

  const name = document.createElement('h3')
  name.append(part.name)
  contentDiv.append(name)

  const p = document.createElement('p')
  p.append(part.description)
  contentDiv.append(p)

  const price = document.createElement('span')
  price.append(`${part.options[0].price}€`)
  contentDiv.append(price)

  a.append(imgDiv)
  a.append(contentDiv)

  div.append(a)
}

// Funcion que vacia las partes
function clearParts () {
  // Vaciamos el div que contiene las partes
  const aParts = document.querySelectorAll('#partes a')

  for (const aPart of aParts) {
    aPart.remove()
  }
}

// Obtenemos el id del electrodomestico
const urlParams = new URLSearchParams(window.location.search)
const appliance = urlParams.get('appliance') || 0
mostrarPartes(appliance)

// Evento onclick para el dropdown de ordenar partes
window.onclick = (e) => {
  const dropdownContent = document.querySelector('#ordenarPorDropdown')
  if (e.target.id !== 'ordenarPorButton') {
    dropdownContent.style.display = 'none'
  } else {
    dropdownContent.style.display = 'block'
  }
}

// Evento onclick de los elementos del dropdown
const dropdowns = document.querySelectorAll('#ordenarPorDropdown p')
for (const dropdown of dropdowns) {
  dropdown.onclick = (e) => {
    clearParts()

    // ESTE TROZO DE CODIGO NO ME GUSTA !!!!!!!!!!!!
    const filtroPrecio = document.querySelector('#filtroPrecio')
    filtroPrecio.remove()
    const categoriasFiltrarArr = document.querySelectorAll('#categoriasFiltrar div')
    console.log(categoriasFiltrarArr)
    for (const categoriasFiltrar of categoriasFiltrarArr) {
      console.log(categoriasFiltrar)
      categoriasFiltrar.remove()
    }

    const urlParams = new URLSearchParams(window.location.search)
    const appliance = urlParams.get('appliance') || 0
    if (dropdown.id === 'sort1') {
      mostrarPartes(appliance, 'name')
    } else if (dropdown.id === 'sort2') {
      mostrarPartes(appliance, 'name', true)
    } else if (dropdown.id === 'sort3') {
      mostrarPartes(appliance, 'price')
    } else if (dropdown.id === 'sort4') {
      mostrarPartes(appliance, 'price', true)
    }
  }
}
