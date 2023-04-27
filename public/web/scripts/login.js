'use strict'
import * as userLogger from './generic/userLogger.js'

async function login (formData) {
  const res = await fetch('http://localhost/users/login', {
    method: 'POST',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  if (res.ok) {
    console.log('todo ok')
    // Iniciamos sesion
    userLogger.saveUser(json.email, json.isAdmin)
  } else {
    console.log(json.error)
  }
}

const form = document.forms.login

form.onsubmit = (e) => {
  e.preventDefault()

  const formData = new FormData(form)
  login(formData)
}
