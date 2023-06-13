'use strict'

const review = require('../model/review')
const con = require('../middleware/sqlconnection')
// Funcionalidades de la api respecto a reviews
module.exports.getPartReviews = async (req, res) => {
  try {
    const partId = req.params.partId || 0

    // Conexion a la bbdd
    // Almacenamos la consulta en un string para luego modificarlo
    const consult = 'SELECT * FROM reviews WHERE id_pieza = ?'
    // Consulta a la bbdd con la consulta almacenada
    const sqlResponse = await con.query(consult, [partId])

    // Obtencion de las filas devueltas
    const rows = sqlResponse[0]
    // Procesamos las filas para poder enviarlas
    const rowsJson = []
    for (const row of rows) {
      rowsJson.push(review.toJson(row))
    }
    res.send(rowsJson)
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'select failed' })
  }
}

module.exports.addReview = async (req, res) => {
  if (typeof req.body === 'undefined') {
    res.json({
      status: 'error',
      message: 'data is undefined'
    })
  } else {
    // Hacemos una transaccion para poder insertar tanto como las piezas como las opciones
    try {
      // Insertamos la review
      const query1 = 'INSERT INTO `reviews`(`titulo`, `puntuacion`, `fecha`, `subtitulo`, `email`, `id_pieza`) VALUES (?,?,?,?,?,?)'
      await con.query(query1,
        [req.body.title, req.body.score, req.body.date, req.body.content, req.body.email, req.body.part])
      res.send({ status: 'ok' })
      // Si da error la insercion, enviamos el error
    } catch (error) {
      console.log(error)
      res.status(400).send({ status: 'insert failed' })
    }
  }
}

module.exports.deleteReview = async (req, res) => {
  const id = Number(req.params.id) || 0

  // Si el id se ha marcado hacemos la consulta
  if (id > 0) {
    try {
      // Consulta a la bbdd con el id
      await con.query('DELETE FROM reviews WHERE id_review = ?', [id])
      res.send({ status: 'ok' })
    } catch (error) {
      console.log(error)
      res.status(400).send({ error })
    }
  } else {
    res.status(400).send({ error: 'invalid id' })
  }
}
