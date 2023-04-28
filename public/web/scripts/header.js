'use strict'

// Mostramos el header de las paginas

async function obtenerPfp (email) {
  const res = await fetch(`http://localhost/users/${email}`)
  return await res.json()
}

async function mostrarHeader () {
  const header = document.createElement('header')
  const aboutUs = document.createElement('a')
  aboutUs.setAttribute('href', './aboutUs.html')
  aboutUs.append('Sobre nosotros')
  header.append(aboutUs)
  const store = document.createElement('a')
  store.setAttribute('href', './index.html')
  store.append('Tienda')
  header.append(store)
  const guides = document.createElement('a')
  guides.setAttribute('href', './guides.html')
  header.append(guides)
  guides.append('Guias')

  const searchForm = document.createElement('form')
  searchForm.name = 'search'
  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Buscar'
  const searchButton = document.createElement('button')
  searchButton.type = 'submit'
  const searchIcon = document.createElement('img')
  searchIcon.setAttribute('src', './images/icons/search.png')
  searchButton.append(searchIcon)
  searchForm.append(searchInput)
  searchForm.append(searchButton)
  header.append(searchForm)

  // Si el usuario no esta logeado
  if (window.localStorage.getItem('user') === null) {
    const login = document.createElement('a')
    login.setAttribute('href', './login.html')
    login.append('Iniciar Sesion')
    header.append(login)
    const register = document.createElement('a')
    register.setAttribute('href', './register.html')
    register.append('Registrarse')
    header.append(register)
  } else {
    // Si el usuario esta logeado
    const user = JSON.parse(window.localStorage.getItem('user'))
    const logoff = document.createElement('a')
    logoff.setAttribute('href', './index.html')
    logoff.onclick = () => { window.localStorage.removeItem('user') }
    logoff.append('Cerrar Sesion')
    header.append(logoff)

    const pfpA = document.createElement('a')
    const pfpImg = document.createElement('img')
    pfpImg.setAttribute('src', (await obtenerPfp(user.email)).imgUrl)
    pfpA.append(pfpImg)
    pfpA.setAttribute('href', './user.html')
    header.append(pfpA)
  }

  document.body.prepend(header)
}
mostrarHeader()
