'use strict'
const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()

// Recibimos los metodos de las electrodomesticos del controlador de las electrodomesticos
const review = require('../controller/reviewsController')

// Rutas de pedidos
router.get('/:partId', review.getPartReviews)
router.post('/', upload.none(), review.addReview)

module.exports = router
