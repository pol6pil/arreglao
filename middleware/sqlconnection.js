/* eslint-disable no-unused-vars */
'use strict'
// Creacion de conexion con las credenciales a la bbdd
const mysql2 = require('mysql2/promise')

const con = mysql2.createPool({
  host: 'localhost',
  user: 'arreglao',
  password: '123',
  database: 'reparaciones'
})
module.exports = con
