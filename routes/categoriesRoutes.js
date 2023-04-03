'use strict'

const express = require('express')
const router = express.Router()
// Recibimos los metodos de las piezas del controlador de las piezas
const part = require('../controller/categoriesController')

// Rutas de pieza

// router.get('/', part.getAllCategories)
router.get('/:id', part.getCategory)

module.exports = router
