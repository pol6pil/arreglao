'use strict'
const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer()

// Recibimos los metodos de los pedidos del controlador de los pedidos
const order = require('../controller/ordersController')

// Rutas de pedidos
router.get('/:email', order.getUserOrders)
router.post('/', upload.none(), order.addOrder)

module.exports = router
