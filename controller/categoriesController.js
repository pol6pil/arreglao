'use strict'

const category = require('../model/category')
const con = require('../middleware/sqlconnection')

module.exports.getCategory = async (req, res) => {
  const id = Number(req.params.id) || 0

  // Si el id se ha marcado hacemos la consulta
  if (id > 0) {
    // Consulta a la bbdd a la categoria con el id
    const sqlResponse = await con.query('SELECT * FROM categorias WHERE id_categoria = ?', [id])
    // Procesamos la respuesta para poder enviarlas
    console.log(sqlResponse)
    const json = category.toJson(sqlResponse[0][0])
    res.send(json)
  } else {
    res.send({})
  }
}

module.exports.getCategories = async (req, res) => {
  const sqlResponse = await con.query('SELECT * FROM categorias')

  // Procesamos la respuesta para poder enviarlas
  const rows = sqlResponse[0]
  const jsons = []
  for (const row of rows) {
    jsons.push(category.toJson(row))
  }
  res.send(jsons)
}
