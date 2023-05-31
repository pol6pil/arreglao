'use strict'

// eslint-disable-next-line no-unused-vars
function showGuide (guide, div, isOwner) {
  // Mostramos la guia
  const article = document.createElement('article')
  article.className = 'guide'
  const a = document.createElement('a')
  if (isOwner) {
    a.setAttribute('href', `./guideForm.html?id=${guide.id}`)
  } else {
    a.setAttribute('href', `./guide.html?id=${guide.id}`)
  }

  const span = document.createElement('span')
  span.append(guide.name)
  a.append(span)
  const img = document.createElement('img')
  img.setAttribute('src', guide.imgUrl)
  a.append(img)
  article.append(a)
  div.append(article)
}
