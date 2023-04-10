'use strict'

const express = require('express')
const router = express.Router()
// Recibimos los metodos de las piezas del controlador de las piezas
const img = require('../controller/imgController')

// Rutas de pieza

// router.get('/categories', part.getPartCategories)
// router.get('/category/:category', part.getPartsInCategory)
router.get('/parts/:img', img.getPart)
router.get('/appliances/:img', img.getAppliance)

// router.post('/', part.addPart)
// router.put('/:id', part.editPart)
// router.delete('/:id', part.deletePart)

module.exports = router
