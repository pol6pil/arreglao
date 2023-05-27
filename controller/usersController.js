'use strict'

const user = require('../model/user')
const con = require('../middleware/sqlconnection')
const deleteFile = require('../middleware/deleteFile')
const path = require('path')
const bcrypt = require('bcrypt')

// Funcionalidades de la api respecto a usuarios
module.exports.login = async (req, res) => {
  const email = req.body.email || 0
  const password = req.body.password || 0

  if (email === 0 || password === 0) {
    // Si el email no es valido enviamos un error
    res.status(400).send({ error: 'incomplete form' })
  }
  // Conexion a la bbdd
  // Almacenamos la consulta en un string
  const consult = 'SELECT * FROM usuarios WHERE email = ?'
  // Consulta a la bbdd con la consulta almacenada
  const sqlResponse = await con.query(consult, email)

  // Comprobamos si el usuario existe
  // Obtencion del usuario
  const userJson = user.toJson(sqlResponse[0][0])
  if (userJson === null) {
    res.status(400).send({ error: 'user not found' })
  } else {
    const userPassword = sqlResponse[0][0].pass
    if (await bcrypt.compare(password, userPassword)) {
      // Comprobamos si la contraseña es valida
      res.send(userJson)
    } else {
      res.status(400).send({ error: 'invalid password' })
    }
  }
}

module.exports.getPfp = async (req, res) => {
  const email = req.params.email || 0

  if (email === 0) {
    // Si el email no es valido enviamos un error
    res.status(400).send({ error: 'user not found' })
  } else {
    // Conexion a la bbdd
  // Almacenamos la consulta en un string
    const consult = 'SELECT foto FROM usuarios WHERE email = ?'
    // Consulta a la bbdd con la consulta almacenada
    const sqlResponse = await con.query(consult, email)

    // Comprobamos si el usuario existe
    // Obtencion del usuario
    const imgUrl = user.getImage(sqlResponse[0][0])
    res.send(imgUrl)
  }
}
module.exports.register = async (req, res) => {
  const email = req.body.email || 0
  const name = req.body.name || 0
  const surname1 = req.body.surname1 || 0
  const password = req.body.password || 0

  // Comprobamos que contiene los campos obligatorios
  if (email === 0 || name === 0 || password === 0 || surname1 === 0) {
    res.status(400).send({ error: 'incomplete form' })
  }

  try {
    // Generamos salt y encriptamos la contraseña
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, salt)
    // Conexion a la bbdd
    // Almacenamos la consulta en un string
    const query = 'INSERT INTO `usuarios`(`email`, `nombre`, `saldo`, `apellido1`, `apellido2`, `esAdmin`, `pass`) VALUES (?,?,?,?,?,?,?)'
    // Consulta a la bbdd con la consulta almacenada
    await con.query(query, [req.body.email, req.body.name, 0, surname1, req.body.surname2, false, hashedPass])

    // Consultamos a la bbdd el usuario insertado para enviarlo como respuesta
    const userSql = await getUser(email)
    res.send(user.toJson(userSql))
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'failed insert' })
  }
}

module.exports.updateBalance = async (req, res) => {
  const email = req.params.email || 0
  if (email === 0) {
    // Si el email no es valido enviamos un error
    res.status(400).send({ error: 'user not found' })
  } else {
    try {
    // Almacenamos la consulta en un string
      const consult = 'UPDATE usuarios SET saldo=? WHERE email=?'
      // Consulta a la bbdd con la consulta almacenada
      await con.query(consult, [req.body.balance, email])

      res.send({ status: 'ok' })
    } catch (error) {
      console.log(error)
      res.status(400).send({ error: 'failed update' })
    }
  }
}

module.exports.changePfp = async (req, res) => {
  const email = req.params.email || 0
  if (email === 0) {
    // Si el email no es valido enviamos un error
    res.status(400).send({ error: 'user not found' })
  } else {
    try {
    // Almacenamos la consulta en un string
      const consult = 'UPDATE usuarios SET foto=? WHERE email = ?'
      // Consulta a la bbdd con la consulta almacenada
      await con.query(consult, [req.files[0].filename, email])

      const consultSelect = 'SELECT foto FROM usuarios WHERE email = ?'
      // Consulta a la bbdd con la consulta almacenada
      const sqlResponse = await con.query(consultSelect, email)
      console.log(sqlResponse[0][0])

      // Obtencion de la nueva foto de perfil
      const imgUrl = user.getImage(sqlResponse[0][0])
      console.log(imgUrl)
      res.send(imgUrl)
    } catch (error) {
      console.log(error)
      res.status(400).send({ error: 'failed update' })
    }
  }
}

async function getUser (email) {
  // Consulta a la bbdd con la opcion
  const sqlResponse = await con.query('SELECT * FROM usuarios WHERE email = ?', [email])
  return sqlResponse[0][0]
}
