'use strict'

// Mostramos el header de las paginas

async function obtenerPfp (email) {
  const res = await fetch(`http://localhost/users/${email}`)
  const json = await res.json()
  return json.imgUrl
}

async function mostrarHeader () {
  const blackBg = document.createElement('div')
  blackBg.classList.add('blackBg')
  const header = document.createElement('header')
  blackBg.append(header)
  const divLinks = document.createElement('div')
  const aboutUs = document.createElement('a')
  aboutUs.setAttribute('href', './aboutUs.html')
  aboutUs.append('Sobre nosotros')
  divLinks.append(aboutUs)
  const store = document.createElement('a')
  store.setAttribute('href', './index.html')
  store.append('Tienda')
  divLinks.append(store)
  const guides = document.createElement('a')
  guides.setAttribute('href', './appliancesGuide.html')
  divLinks.append(guides)
  guides.append('Guias')
  header.append(divLinks)

  const divActions = document.createElement('div')
  const searchForm = document.createElement('form')
  searchForm.name = 'search'
  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Buscar'
  const searchButton = document.createElement('button')
  searchButton.id = 'searchButton'
  searchButton.type = 'submit'
  const searchIcon = document.createElement('img')
  searchIcon.setAttribute('src', './images/icons/search.png')
  searchButton.append(searchIcon)
  searchForm.append(searchInput)
  searchForm.append(searchButton)
  divActions.append(searchForm)
  let cart = document.createElement('a')
  cart.append('Carrito')
  cart.setAttribute('href', './cart.html')

  // Si el usuario no esta logeado
  if (window.localStorage.getItem('user') === null) {
    const login = document.createElement('a')
    login.setAttribute('href', './login.html')
    login.append('Iniciar Sesion')
    divActions.append(login)
    const register = document.createElement('a')
    register.setAttribute('href', './register.html')
    register.append('Registrarse')
    divActions.append(register)
  } else {
    // Si el usuario esta logeado, comprobamos si es admin
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user.isAdmin === 0) {
      const pfpA = document.createElement('a')
      const pfpImg = document.createElement('img')
      pfpImg.className = 'pfpImage'
      pfpImg.setAttribute('src', (await obtenerPfp(user.email)))
      pfpA.append(pfpImg)
      pfpA.setAttribute('href', './user.html')
      divActions.append(pfpA)
    } else {
      aboutUs.remove()
      cart = null
      const insertPart = document.createElement('a')
      insertPart.setAttribute('href', './insertPart.html')
      insertPart.append('Crear pieza nueva')
      divLinks.append(insertPart)
      const insertAppliance = document.createElement('a')
      insertAppliance.setAttribute('href', './insertAppliance.html')
      insertAppliance.append('Crear electrodomestico nuevo')
      divLinks.append(insertAppliance)
    }
    const logoff = document.createElement('a')
    logoff.setAttribute('href', './index.html')
    logoff.onclick = () => { window.localStorage.removeItem('user') }
    logoff.append('Cerrar Sesion')
    divActions.append(logoff)
  }
  if (cart !== null) {
    divActions.append(cart)
  }
  header.append(divActions)
  document.body.prepend(blackBg)
}
mostrarHeader()
