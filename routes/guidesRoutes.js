'use strict'
const express = require('express')
const router = express.Router()
// Recibimos los metodos de las piezas del controlador de las piezas
const guide = require('../controller/guidesController')
const multer = require('multer')
const path = require('path')
const { randomInt } = require('crypto')

// Configuramos el almacenamiento de multer con la carpeta piezas
const storage = multer.diskStorage({
  destination: path.join(process.cwd(), '/public/images/guides/'),
  filename: function (_req, file, cb) {
    cb(null, file.fieldname + randomInt(1, 9420564) + '-' + Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage,
  limits: {
    fileSize: 15000000 // 150 KB for a 1080x1080 JPG 90
  },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb)
  }
})
function checkFileType (file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    return cb(null, false)
  }
}

// Rutas de pieza
router.get('/accepted', guide.getAcceptedGuides)
// router.get('/pending', part.getPendingGuides)
router.get('/:id', guide.getGuide)
// router.get('/part/:id', part.getGuideByPart)
router.post('/', upload.array('files'), guide.addGuide)
router.put('/:id', upload.array('files'), guide.editGuide)
router.delete('/:id', guide.deleteGuide)

module.exports = router
