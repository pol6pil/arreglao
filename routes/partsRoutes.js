'use strict'

const express = require('express')
const router = express.Router()
// Recibimos los metodos de las piezas del controlador de las piezas
const part = require('../controller/partsController')

// Rutas de pieza

router.get('/', part.getAllParts)
// router.get('/categories', part.getPartCategories)
router.get('/category/:category', part.getAllPartsInCategory)
router.get('/:id', part.getPart)
router.post('/', part.addPart)
// router.put('/:id', part.editPart)
// router.delete('/:id', part.deletePart)

module.exports = router
