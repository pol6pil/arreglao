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
