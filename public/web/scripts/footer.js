'use strict'

// Mostramos el footer de las paginas

function mostrarFooter () {
  const greyBg = document.createElement('div')
  greyBg.className = 'greyBg'
  const footer = document.createElement('footer')
  greyBg.append(footer)
  const footerDiv = document.createElement('div')
  footer.append(footerDiv)
  // Mostramos las redes sociales
  const footerRedes = document.createElement('div')
  footerDiv.append(footerRedes)
  footerRedes.id = 'footerRedes'

  const aFacebook = document.createElement('a')
  footerRedes.append(aFacebook)
  aFacebook.setAttribute('href', '#')
  const imgFacebook = document.createElement('img')
  aFacebook.append(imgFacebook)
  imgFacebook.setAttribute('src', './images/icons/fbG.png')

  const aInstagram = document.createElement('a')
  footerRedes.append(aInstagram)
  aInstagram.setAttribute('href', '#')
  const imgInstagram = document.createElement('img')
  aInstagram.append(imgInstagram)
  imgInstagram.setAttribute('src', './images/icons/igG.png')

  const aTwitter = document.createElement('a')
  footerRedes.append(aTwitter)
  aTwitter.setAttribute('href', '#')
  const imgTwitter = document.createElement('img')
  aTwitter.append(imgTwitter)
  imgTwitter.setAttribute('src', './images/icons/twG.png')

  // Mostramos el contacto
  const footerContact = document.createElement('div')
  footerDiv.append(footerContact)
  footerContact.id = 'footerContact'

  const emailDiv = document.createElement('div')
  const emailSpanBLACK = document.createElement('span')
  emailDiv.append(emailSpanBLACK)
  emailSpanBLACK.append('Correo electrónico')
  const emailSpan = document.createElement('span')
  emailDiv.append(emailSpan)
  emailSpan.append('pol6pil@gmail.com')
  footerContact.append(emailDiv)

  const phoneDiv = document.createElement('div')
  const phoneSpanBLACK = document.createElement('span')
  phoneDiv.append(phoneSpanBLACK)
  phoneSpanBLACK.append('Número de teléfono')
  const phoneSpan = document.createElement('span')
  phoneDiv.append(phoneSpan)
  phoneSpan.append('645 76 65 66')
  footerContact.append(phoneDiv)

  const locationDiv = document.createElement('div')
  const locationSpanBLACK = document.createElement('span')
  locationDiv.append(locationSpanBLACK)
  locationSpanBLACK.append('Dirección')
  const locationSpan = document.createElement('span')
  locationDiv.append(locationSpan)
  locationSpan.append('C/ dels Sants Just i Pastor, 70, 46940 Manises, Valencia')
  footerContact.append(locationDiv)

  // Mostramos el copyright
  const legalDiv = document.createElement('div')
  legalDiv.id = 'legal'
  const legalSpan = document.createElement('span')
  legalDiv.append(legalSpan)
  legalSpan.append('© 2023 Generalitat')
  const legalA = document.createElement('a')
  legalA.setAttribute('href', 'https://portal.edu.gva.es/iesrodrigobotet/es/inicio/')
  legalDiv.append(legalA)
  legalA.append('Términos de uso')
  footer.append(legalDiv)

  document.body.append(greyBg)
}
mostrarFooter()
