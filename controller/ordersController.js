'use strict'

const order = require('../model/order')
const con = require('../middleware/sqlconnection')
// Funcionalidades de la api respecto a piezas
module.exports.getUserOrders = async (req, res) => {
  try {
    const email = req.query.email || 0

    // Conexion a la bbdd
    // Almacenamos la consulta en un string para luego modificarlo
    const consult = 'SELECT * FROM pedidos WHERE email = ?'
    // Consulta a la bbdd con la consulta almacenada
    const sqlResponse = await con.query(consult, [email])

    // Obtencion de las filas devueltas
    const rows = sqlResponse[0]

    // Procesamos las filas para poder enviarlas
    const rowsJson = []
    for (const row of rows) {
    // Consula a la bbdd de las opciones de la pieza
      const options = await con.query('SELECT * FROM pedido_pieza WHERE id_pedido = ?', [row.id_pedido])
      rowsJson.push(order.toJson(row, options[0]))
    }
    res.send(rowsJson)
  } catch (error) {
    res.status(400).send({ error: 'select failed' })
  }
}

module.exports.addOrder = async (req, res) => {
  console.log(req.body)
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
      // Insertamos el pedido
      const query1 = 'INSERT INTO `pedidos`(`fecha`, `email`) VALUES (?,?)'
      const result1 = await con.query(query1,
        [req.body.date, req.body.email])
      const orderId = result1[0].insertId
      const parts = JSON.parse(req.body.parts)
      for (const part of parts) {
        const queryOption = 'INSERT INTO `pedido_pieza`(`id_pedido`, `id_pieza`, `id_opcion`, `cantidad`, precio) VALUES (?,?,?,?,?)'
        await con.query(queryOption, [orderId, part.id, part.optionId, part.quantity, part.price])
      }
      res.send({ message: 'order placed' })
      await connection.commit()
      // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
    } catch (error) {
      await connection.rollback()
      console.log(error)
      res.status(400).send({ error: 'insert failed' })
    }
  }
}
