'use strict'

const order = require('../model/order')
const con = require('../middleware/sqlconnection')
const nodemailer = require('nodemailer')

// Funcionalidades de la api respecto a piezas
module.exports.getUserOrders = async (req, res) => {
  const email = req.params.email || 0
  if (email !== 0) {
    try {
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
        const parts = await con.query('SELECT * FROM pedido_pieza WHERE id_pedido = ?', [row.id_pedido])
        rowsJson.push(order.toJson(row, parts[0]))
      }
      res.send(rowsJson)
    } catch (error) {
      res.status(400).send({ error: 'select failed' })
    }
  } else {
    res.send([])
  }
}

module.exports.addOrder = async (req, res) => {
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
      // Si todo esta correcto enviamos un correo con la factura
      sendMailOrder(parts, req.body.email)

      // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
    } catch (error) {
      await connection.rollback()
      console.log(error)
      res.status(400).send({ error: 'insert failed' })
    }
  }
}

async function getPartOption (id) {
  // Consula a la bbdd de las opciones de la pieza
  const option = await con.query('SELECT nombre FROM opciones_piezas WHERE id_opcion = ?', [id])
  return option[0][0].nombre
}

async function getPart (id) {
  // Consula a la bbdd de las opciones de la pieza
  const part = await con.query('SELECT nombre FROM piezas WHERE id_pieza = ?', [id])
  return part[0][0].nombre
}

async function sendMailOrder (parts, email) {
  // Creamos un array de las opciones y piezas realizadas por el usuario
  const nameOptions = []
  const nameParts = []

  for (const part of parts) {
    nameOptions.push(await getPartOption(part.optionId))
    nameParts.push(await getPart(part.id))
  }

  // Creamos el texto del correo
  let textemail = 'Ha realizado un pedido con los siguientes productos:'
  let i = 0
  for (const part of parts) {
    textemail += `\n Pieza: ${nameParts[i]}   Opcion: ${nameOptions[i]}  Precio: ${part.price}    Cantidad: ${part.quantity}`
    i++
  }

  // Crear objeto reusable que enviara los correos de las facturas
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'arreglaoticket@gmail.com', // usuario
      pass: 'vsanzgicetciqylo' // contraseña
    }
  })

  // Enviar el correo
  await transporter.sendMail({
    from: 'arreglaoticket@gmail.com', // direccion del emisor
    to: email, // lista de direcciones de los receptores
    subject: 'Pedido confirmado', // asunto del correo
    text: textemail // cuerpo del mensaje
  })
}
