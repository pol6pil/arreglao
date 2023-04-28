'use strict'
async function login (formData) {
  const res = await fetch('http://localhost/users/login', {
    method: 'POST',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  if (res.ok) {
    console.log('todo ok')
    // Iniciamos sesion
    // eslint-disable-next-line no-undef
    saveUser(json.email, json.isAdmin)
  } else {
    clearErrors()
    if (json.error === 'user not found') {
      showError('Usuario no encontrado')
    } else if (json.error === 'invalid password') {
      showError('Contraseña invalida')
    }
  }
}

function clearErrors () {
  const errors = document.querySelectorAll('.error')
  for (const error of errors) {
    error.remove()
  }
}

function showError (errorMsg) {
  const form = document.forms.login
  const errorSpan = document.createElement('span')
  errorSpan.className = 'error'
  errorSpan.append(errorMsg)
  form.append(errorSpan)
}

const form = document.forms.login

form.onsubmit = (e) => {
  e.preventDefault()

  const formData = new FormData(form)
  login(formData)
}
