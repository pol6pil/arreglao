'use strict'

const part = require('../model/part')
const con = require('../middleware/sqlconnection')

// Funcionalidades de la api respecto a piezas
module.exports.getAllParts = async (req, res) => {
  const limit = Number(req.params.limit) || 0
  const orderBy = req.params.orderBy || undefined
  const sort = req.params.sort || undefined

  // Conexion a la bbdd
  // Almacenamos la consulta en un string para luego modificarlo
  let consult = 'SELECT * FROM piezas'
  // Si tiene limite la consulta se lo añadimos al string
  if (limit > 0) {
    consult += ` LIMIT BY ${limit}`
  }
  // Si tiene que ordernarse por alguna columna se añade al string
  if (orderBy !== undefined) {
    consult += ` ORDER BY ${orderBy}`
    if (sort === 'DESC') {
      consult += ' DESC'
    }
  }
  // Consulta a la bbdd con la consulta almacenada
  const sqlResponse = await con.query(consult)

  // Obtencion de las filas devueltas
  const rows = sqlResponse[0]

  // Procesamos las filas para poder enviarlas
  const rowsJson = []
  for (const row of rows) {
    // Consula a la bbdd de las opciones de la pieza
    const options = await con.query('SELECT * FROM opciones_piezas WHERE id_pieza = ?', [row.id_pieza])
    rowsJson.push(part.toJson(row, options[0]))
  }
  res.send(rowsJson)
}

module.exports.getAllPartsInCategory = async (req, res) => {
  const limit = Number(req.params.limit) || 0
  const orderBy = req.params.orderBy || undefined
  const sort = req.params.sort || undefined
  const category = req.params.category || 0

  if (category > 0) {
    // Conexion a la bbdd
    // Almacenamos la consulta en un string para luego modificarlo
    let consult = 'SELECT * FROM piezas WHERE id_categoria = ?'
    // Si tiene limite la consulta se lo añadimos al string
    if (limit > 0) {
      consult += ' LIMIT BY ?'
    }
    // Si tiene que ordernarse por alguna columna se añade al string
    if (orderBy !== undefined) {
      consult += ' ORDER BY ?'
      if (sort === 'DESC') {
        consult += ' DESC'
      }
    }
    // Consulta a la bbdd con la consulta almacenada
    const sqlResponse = await con.query(consult, [category, limit, orderBy])

    res.send(sqlResponse[0])
  } else {
    res.send({})
  }
}

module.exports.getPart = async (req, res) => {
  const id = Number(req.params.id) || 0

  // Si el id se ha marcado hacemos la consulta
  if (id > 0) {
    res.send(await getPartSql(id))
  } else {
    res.send({})
  }
}
module.exports.addPart = async (req, res) => {
  if (typeof req.body === 'undefined') {
    res.json({
      status: 'error',
      message: 'data is undefined'
    })
  } else {
    const connection = await con.getConnection()
    console.log(req.body)
    // Hacemos una transaccion para poder insertar tanto como las piezas como las opciones
    try {
      await connection.beginTransaction()
      // Insertamos la pieza
      const query1 = 'INSERT INTO `piezas`(`nombre`, `descripcion`, `garantia`, `advertencia`, `nota`, `id_categoria`, `id_electrodomestico`) VALUES (?,?,?,?,?,?,?)'
      const result1 = await con.query(query1,
        [req.body.name, req.body.description, req.body.warranty, req.body.warning, req.body.note, req.body.category, req.body.appliance])
      const partId = result1[0].insertId
      for (const option of req.body.options) {
        const queryOption = 'INSERT INTO `opciones_piezas`(`nombre`, `imagen`, `precio`, `id_pieza`) VALUES (?,?,?,?)'
        await con.query(queryOption, [option.name, option.imgUrl, option.price, partId])
      }

      // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
      res.send(await getPartSql(partId))
      await connection.commit()
    } catch (error) {
      await connection.rollback()
      console.log(error)
      res.status(400).send({ error: 'insert failed' })
    }
  }
}

// const product = {
//   id: 21,
//   title: req.body.title,
//   price: req.body.price,
//   description: req.body.description,
//   image: req.body.image,
//   category: req.body.category
// }
// product.save()
//   .then(product => res.json(product))
//   .catch(err => console.log(err))
// });}

async function getPartSql (id) {
  // Consulta a la bbdd a la pieza con el id
  const sqlResponse = await con.query('SELECT * FROM piezas WHERE id_pieza = ?', [id])
  // Procesamos la respuesta para poder enviarlas
  // Consula a la bbdd de las opciones de la pieza
  const options = await con.query('SELECT * FROM opciones_piezas WHERE id_pieza = ?', [id])

  const row = sqlResponse[0]
  return part.toJson(row[0], options[0])
}
