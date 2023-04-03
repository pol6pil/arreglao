'use strict'

// Importacion de modulos del server

const express = require('express')
const cors = require('cors')
// const multer = require('multer')
const app = express()
const bp = require('body-parser')
const path = require('path')

// Deficinicion del puerto de escucha
const PORT = process.env.PORT || 80

// Importacion de rutas
const partsRoute = require('./routes/partsRoutes')
const categoriesRoute = require('./routes/categoriesRoutes')
const imgRoute = require('./routes/imgRoutes')

// middleware
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true }))
app.use(bp.json())
app.use(express.json())
app.use(bp.json())
app.use(cors({
  origin: '*'
}))

// Asignacion de rutas
app.use('/parts', partsRoute)
app.use('/categories', categoriesRoute)
app.use('/img', imgRoute)

// Escucha al puerto
app.listen(PORT, () => console.log(`Server iniciado en puerto ${PORT}`))
