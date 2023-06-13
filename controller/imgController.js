'use strict'
const path = require('path')
const fileCheck = require('../middleware/fileExists')

// Funcionalidades de la api respecto a imagenes
// Devolver imagen de una pieza
module.exports.getPart = (req, res) => {
  // Si la imagen existe la enviamos, si no enviamos una imagen por defecto
  const img = req.params.img
  const imgUrl = path.join(process.cwd(), `/public/images/parts/${img}`)

  fileCheck(imgUrl, () => res.sendFile(imgUrl), () => res.sendFile(path.join(process.cwd(), '/public/images/errorImage.webp')))
}

module.exports.getAppliance = (req, res) => {
  // Si la imagen existe la enviamos, si no enviamos una imagen por defecto
  const img = req.params.img
  const imgUrl = path.join(process.cwd(), `/public/images/appliances/${img}`)

  fileCheck(imgUrl, () => res.sendFile(imgUrl), () => res.sendFile(path.join(process.cwd(), '/public/images/errorImage.webp')))
}

module.exports.getUser = (req, res) => {
  // Si la imagen existe la enviamos, si no enviamos una imagen por defecto
  const img = req.params.img
  const imgUrl = path.join(process.cwd(), `/public/images/users/${img}`)

  fileCheck(imgUrl, () => res.sendFile(imgUrl), () => res.sendFile(path.join(process.cwd(), '/public/images/anon.jpg')))
}

module.exports.getGuide = (req, res) => {
  // Si la imagen existe la enviamos, si no enviamos una imagen por defecto
  const img = req.params.img
  const imgUrl = path.join(process.cwd(), `/public/images/guides/${img}`)

  fileCheck(imgUrl, () => res.sendFile(imgUrl), () => res.sendFile(path.join(process.cwd(), '/public/images/errorImage.webp')))
}
