'use strict'

// eslint-disable-next-line no-unused-vars
function showGuide (guide, div) {
  // Mostramos la guia
  const article = document.createElement('article')
  const a = document.createElement('a')
  a.setAttribute('href', `./guide.html?id=${guide.id}`)
  const aDiv = document.createElement('div')
  const span = document.createElement('span')
  span.append(guide.name)
  aDiv.append(span)
  const img = document.createElement('img')
  img.setAttribute('src', guide.imgUrl)
  aDiv.append(img)
  a.append(aDiv)
  article.append(a)
  div.append(article)
}
