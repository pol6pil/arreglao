'use strict'
// eslint-disable-next-line no-unused-vars
function mostrarParte (part, div) {
  const article = document.createElement('article')
  const a = document.createElement('a')
  // eslint-disable-next-line no-undef
  if (isAdmin()) {
    a.setAttribute('href', `./insertPart.html?id=${part.id}`)
  } else {
    a.setAttribute('href', `./part.html?id=${part.id}`)
  }

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

  article.append(a)
  div.append(article)
}
