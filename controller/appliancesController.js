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
    res.status(400).send({ error: 'invalid id' })
  }
}

module.exports.deleteAppliance = async (req, res) => {
  const id = Number(req.params.id) || 0

  // Si el id se ha marcado hacemos la consulta
  if (id > 0) {
    try {
      // Consulta a la bbdd con el id
      const sqlResponse = await con.query('SELECT * FROM electrodomestico WHERE id_electrodomestico = ?', [id])
      // Procesamos la respuesta para poder enviarlas
      const row = sqlResponse[0][0]
      // Consulta a la bbdd con el id
      await con.query('DELETE FROM electrodomestico WHERE id_electrodomestico = ?', [id])
      res.send({ status: 'ok' })
      // Borramos la imagen
      deleteFile(path.join(process.cwd(), '/public/images/appliances/', row.imagen))
    } catch (error) {
      console.log(error)
      res.status(400).send({ error })
    }
  } else {
    res.status(400).send({ error: 'invalid id' })
  }
}
module.exports.addAppliance = async (req, res) => {
  if (typeof req.body === 'undefined') {
    res.json({
      status: 'error',
      message: 'data is undefined'
    })
  } else {
    try {
      // Insertamos el electrodomestico
      const query = 'INSERT INTO `electrodomestico`(`nombre`, `imagen`) VALUES (?,?)'
      const result = await con.query(query,
        [req.body.name, req.files[0].filename])
      const applianceId = result[0].insertId
      // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
      res.send(await getApplianceSql(applianceId))
    } catch (error) {
      // Borramos la imagen si da error
      deleteFile(path.join(process.cwd(), '/public/images/appliances/', req.files[0].filename))

      console.log(error)
      res.status(400).send({ error: 'insert failed' })
    }
  }
}

module.exports.editAppliance = async (req, res) => {
  const applianceId = req.params.id || 0
  if (typeof req.body === 'undefined' || applianceId === 0) {
    res.json({
      status: 'error',
      message: 'data is undefined'
    })
  } else {
    const connection = await con.getConnection()
    // Hacemos una transaccion para poder actualizar el nombre y la imagen por separado en caso de que solo queramos actualizar 1 cosa
    try {
      // Si el body tiene una propiedad name la actualizamos
      if (req.body.name !== 'undefined') {
        // Actualizamos el electrodomestico
        const query = 'UPDATE `electrodomestico` SET `nombre`=? WHERE id_electrodomestico = ?'
        await con.query(query, [req.body.name, applianceId])
      }
      // Si la peticion tiene archivos actualizamos la imagen
      if (req.files.length > 0) {
        // Obtenemos la imagen antes de modificarla para luego poder borrar la imagen
        const imgUrl = await getApplianceImageSql(applianceId)
        // Actualizamos el electrodomestico
        const query = 'UPDATE `electrodomestico` SET `imagen`=? WHERE id_electrodomestico = ?'
        await con.query(query, [req.files[0].filename, applianceId])
        // Borramos la imagen anterior si existe
        if (imgUrl !== null) {
          deleteFile(path.join(process.cwd(), '/public/images/appliances/', imgUrl))
        }
      }

      // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
      res.send(await getApplianceSql(applianceId))
      await connection.commit()
      // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
    } catch (error) {
      await connection.rollback()
      console.log(error)
      // Borramos la imagen
      if (req.files.length > 0) {
        deleteFile(path.join(process.cwd(), '/public/images/appliances/', req.files[0].filename))
      }
      res.status(400).send({ error: 'update failed' })
    }
  }
}

async function getApplianceSql (id) {
  // Consulta a la bbdd con el id
  const sqlResponse = await con.query('SELECT * FROM electrodomestico WHERE id_electrodomestico = ?', [id])
  // Procesamos la respuesta para poder enviarlas
  const row = sqlResponse[0]
  return appliance.toJson(row[0])
}

async function getApplianceImageSql (id) {
  // Consulta a la bbdd a la pieza con el id
  const sqlResponse = await con.query('SELECT imagen FROM electrodomestico WHERE id_electrodomestico = ?', [id])
  // Procesamos la respuesta para poder enviarlas
  return sqlResponse[0][0].imagen
}
