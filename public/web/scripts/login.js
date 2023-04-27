async function login (formData) {
    const res = await fetch('http://localhost/users/login', {
      method: 'POST',
      body: formData // Payload is formData object
    })
    if(res.ok){
      console.log('todo ok')
      const json = await res.json()
      console.log(json)
    }
    else{
      console.log('todo MAL')
    }
  
  }
  
  const form = document.forms.login
  
  form.onsubmit = (e) => {
    e.preventDefault()
  
    const formData = new FormData(form)
    login(formData)
  }
  