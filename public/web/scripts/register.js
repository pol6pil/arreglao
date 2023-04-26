async function insertPart (formData) {
  const res = await fetch('http://localhost/users/', {
    method: 'POST',
    body: formData // Payload is formData object
  })
  const json = await res.json()
  console.log(json)
}

const form = document.forms.register

form.onsubmit = (e) => {
  e.preventDefault()
  
  const formData = new FormData(form)
  insertPart(formData)
}
