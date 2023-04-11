'use strict'

const appliance = require('../model/appliance')
const con = require('../middleware/sqlconnection')
const deleteFile = require('../middleware/deleteFile')
const path = require('path')

// Funcionalidades de la api respecto a piezas
module.exports.getAllAppliances = async (req, res) => {
  const limit = Number(req.query.limit) || 0
  const orderBy = req.query.orderBy || undefined
  const sort = req.query.sort || undefined

  // Conexion a la bbdd
  // Almacenamos la consulta en un string para luego modificarlo
  let consult = 'SELECT * FROM electrodomestico'
  // Si tiene limite la consulta se lo añadimos al string
  if (limit > 0) {
    consult += ' LIMIT ?'
  }
  // Si tiene que ordernarse por alguna columna se añade al string
  if (orderBy !== undefined) {
    consult += ' ORDER BY ?'
    if (sort === 'DESC') {
      consult += ' DESC'
    }
  }
  // Consulta a la bbdd con la consulta almacenada
  const sqlResponse = await con.query(consult, [limit, orderBy])

  // Obtencion de las filas devueltas
  const rows = sqlResponse[0]

  // Procesamos las filas para poder enviarlas
  const rowsJson = []
  for (const row of rows) {
    rowsJson.push(appliance.toJson(row))
  }
  res.send(rowsJson)
}

module.exports.getAppliance = async (req, res) => {
  const id = Number(req.params.id) || 0

  // Si el id se ha marcado hacemos la consulta
  if (id > 0) {
    res.send(await getApplianceSql(id))
  } else {
    res.send({})
  }
}
module.exports.addAppliance = async (req, res) => {
  console.log(req.body, 'a', req.files[0])
  if (typeof req.body === 'undefined') {
    res.json({
      status: 'error',
      message: 'data is undefined'
    })
  } else {
    const connection = await con.getConnection()
    // Hacemos una transaccion para poder insertar tanto como las piezas como las opciones
    try {
      await connection.beginTransaction()
      // Insertamos la pieza
      const query = 'INSERT INTO `electrodomestico`(`nombre`, `imagen`) VALUES (?,?)'
      const result = await con.query(query,
        [req.body.name, req.files[0].filename])
      const partId = result[0].insertId
      // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
      res.send(await getApplianceSql(partId))
      await connection.commit()
      // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
    } catch (error) {
      await connection.rollback()
      // Borramos todas la imagen
      deleteFile(path.join(process.cwd(), '/public/images/appliances/', req.files[0].filename))

      console.log(error)
      res.status(400).send({ error: 'insert failed' })
    }
  }
}

async function getApplianceSql (id) {
  // Consulta a la bbdd a la pieza con el id
  const sqlResponse = await con.query('SELECT * FROM electrodomestico WHERE id_electrodomestico = ?', [id])
  // Procesamos la respuesta para poder enviarlas
  const row = sqlResponse[0]
  return appliance.toJson(row[0])
}
