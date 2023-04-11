'use strict'
// Formulario para insertar un electrodomestico
const form = document.forms.appliance

console.log(form)

form.onsubmit = (e) => {
  e.preventDefault()
  const file = form.imagen
  console.log(file)
  const formData = new FormData()

  formData.append('name', form.nombre.value)

  formData.append('files', file.files[0])

  submitAppliance(formData)
}

async function submitAppliance (formData) {
  const res = await fetch('http://localhost:80/appliances', {
    method: 'POST',
    body: formData
  })
  const json = await res.json()
  console.log(json)
}
