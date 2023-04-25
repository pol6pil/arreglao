'use strict'

// const part = require('../model/user')
const con = require('../middleware/sqlconnection')
const deleteFile = require('../middleware/deleteFile')
const path = require('path')
const bcrypt = require('bcrypt')

// Funcionalidades de la api respecto a usuarios
module.exports.login = async (req, res) => {
  console.log(req.body)
  const email = req.body.email || 0
  const password = req.body.password || 0

  if (email === 0) {
    // Si el email no es valido enviamos un error
    res.status(400).send({ error: 'user not found' })
  }

  // Generamos salt
  try {
    const salt = await bcrypt.genSalt()
    console.log(password)
    console.log(salt)
    const hashedPass = await bcrypt.hash(password, salt)
    console.log(hashedPass)
  } catch (error) {
    console.log(error)
  }
  // Conexion a la bbdd
  // Almacenamos la consulta en un string para luego modificarlo
  const consult = 'SELECT * FROM usuarios WHERE email = ?'
  // Consulta a la bbdd con la consulta almacenada
  const sqlResponse = await con.query(consult, email)
  // Obtencion del usuario devuelto
  // const row = sqlResponse[0]
  // Comprobamos si la contraseña es valida

  // res.send(rowsJson)
}

module.exports.getPfp = async (req, res) => {
//   const limit = Number(req.query.limit) || 0
//   const category = req.params.category || 0

//   if (category > 0) {
//     // Conexion a la bbdd
//     // Almacenamos la consulta en un string para luego modificarlo
//     let consult = 'SELECT * FROM piezas WHERE id_categoria = ?'
//     const queryColumns = []
//     queryColumns.push(category)
//     // Si tiene limite la consulta se lo añadimos al string
//     if (limit > 0) {
//       consult += ' LIMIT ?'
//       queryColumns.push(limit)
//     }
//     // Consulta a la bbdd con la consulta almacenada
//     const sqlResponse = await con.query(consult, queryColumns)
//     // Obtencion de las filas devueltas
//     const rows = sqlResponse[0]
//     // Procesamos las filas para poder enviarlas
//     const rowsJson = []
//     for (const row of rows) {
//       // Consula a la bbdd de las opciones de la pieza
//       const options = await con.query('SELECT * FROM opciones_piezas WHERE id_pieza = ?', [row.id_pieza])
//       rowsJson.push(part.toJson(row, options[0]))
//     }
//     res.send(rowsJson)
//   } else {
//     // Si el id no es valido enviamos un error
//     res.status(400).send({ error: 'invalid id' })
//   }
}
module.exports.register = async (req, res) => {
//   if (typeof req.body === 'undefined') {
//     res.json({
//       status: 'error',
//       message: 'data is undefined'
//     })
//   } else {
//     const connection = await con.getConnection()
//     // Hacemos una transaccion para poder insertar tanto como las piezas como las opciones
//     try {
//       await connection.beginTransaction()
//       // Insertamos la pieza
//       const query1 = 'INSERT INTO `piezas`(`nombre`, `descripcion`, `garantia`, `advertencia`, `nota`, `id_categoria`, `id_electrodomestico`) VALUES (?,?,?,?,?,?,?)'
//       const result1 = await con.query(query1,
//         [req.body.name, req.body.description, req.body.warranty, req.body.warning, req.body.note, req.body.category, req.body.appliance])
//       const partId = result1[0].insertId
//       const options = JSON.parse(req.body.options)
//       // Creamos un indice para recorrer los archivos de las opciones
//       let fileIndex = 0
//       for (const option of options) {
//         // Si se ha insertado una imagen la subimos a la bbdd
//         if (option.imageUpload) {
//           const queryOption = 'INSERT INTO `opciones_piezas`(`nombre`, `imagen`, `precio`, `id_pieza`) VALUES (?,?,?,?)'
//           await con.query(queryOption, [option.name, req.files[fileIndex].filename, option.price, partId])
//           fileIndex++
//         } else {
//           const queryOption = 'INSERT INTO `opciones_piezas`(`nombre`, `precio`, `id_pieza`) VALUES (?,?,?)'
//           await con.query(queryOption, [option.name, option.price, partId])
//         }
//       }

  //       // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
  //       res.send(await getPartSql(partId))
  //       await connection.commit()
  //       // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
  //     } catch (error) {
  //       await connection.rollback()
  //       // Borramos todas las imagenes
  //       for (let i = 0; i < JSON.parse(req.body.options).length; i++) {
  //         deleteFile(path.join(process.cwd(), '/public/images/parts/', req.files[i].filename))
  //       }

//       console.log(error)
//       res.status(400).send({ error: 'insert failed' })
//     }
//   }
}

module.exports.update = async (req, res) => {
//   const partId = req.params.id || 0
//   if (partId > 0) {
//     if (typeof req.body === 'undefined') {
//       res.json({
//         status: 'error',
//         message: 'data is undefined'
//       })
//     } else {
//       const connection = await con.getConnection()
//       // Hacemos una transaccion para poder insertar tanto como las piezas como las opciones
//       try {
//         await connection.beginTransaction()
//         // Editamos la pieza la pieza
//         const query1 = 'UPDATE `piezas` SET `nombre`=?,`descripcion`=?,`garantia`=?,`advertencia`=?,`nota`=?,`id_categoria`=?,`id_electrodomestico`=? WHERE `id_pieza`=?'
//         await con.query(query1,
//           [req.body.name, req.body.description, req.body.warranty, req.body.warning, req.body.note, req.body.category, req.body.appliance, partId])
//         const options = JSON.parse(req.body.options)

  //         // Creamos un indice para recorrer los archivos de las opciones
  //         let fileIndex = 0
  //         for (const option of options) {
  //           // Comprobamos si la opcion tiene que ser insertada o actualizada
  //           if (option.update) {
  //             // Si se ha insertado una imagen la subimos a la bbdd
  //             if (option.imageUpload) {
  //               // Obtenemos la imagen antes de modificar las opciones para luego poder borrar la imagen
  //               const imgUrl = await getOptionImage(option.id)
  //               // Actualizamos la opcion en la bbdd
  //               const queryOption = `UPDATE opciones_piezas SET nombre='${option.name}',imagen='${req.files[fileIndex].filename}',precio=${option.price} WHERE id_opcion=${option.id}`
  //               await con.query(queryOption)
  //               fileIndex++
  //               // Borramos la imagen anterior
  //               deleteFile(path.join(process.cwd(), '/public/images/parts/', imgUrl))
  //             } else {
  //               const queryOption = `UPDATE opciones_piezas SET nombre='${option.name}', precio=${option.price} WHERE id_opcion=${option.id}`
  //               await con.query(queryOption)
  //             }
  //             // Comprobamos si la opcion se tiene que borrar
  //           } else if (option.isDelete) {
  //             // Obtenemos la imagen para poder borrarla
  //             const imgUrl = await getOptionImage(option.id)

  //             // Borramos la opcion
  //             await deleteOption(option.id)

  //             // Borramos la imagen
  //             deleteFile(path.join(process.cwd(), '/public/images/parts/', imgUrl))
  //           } else {
  //             if (option.imageUpload) {
  //               const queryOption = 'INSERT INTO `opciones_piezas`(`nombre`, `imagen`, `precio`, `id_pieza`) VALUES (?,?,?,?)'
  //               await con.query(queryOption, [option.name, req.files[fileIndex].filename, option.price, partId])
  //               fileIndex++
  //             } else {
  //               const queryOption = 'INSERT INTO `opciones_piezas`(`nombre`, `precio`, `id_pieza`) VALUES (?,?,?)'
  //               await con.query(queryOption, [option.name, option.price, partId])
  //             }
  //           }
  //         }

  //         // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
  //         res.send(await getPartSql(partId))
  //         await connection.commit()
  //         // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
  //       } catch (error) {
  //         await connection.rollback()
  //         // Borramos todas las imagenes
  //         for (let i = 0; i < JSON.parse(req.body.options).length; i++) {
  //           if (req.files[i] !== undefined) {
  //             deleteFile(path.join(process.cwd(), '/public/images/parts/', req.files[i].filename))
  //           }
  //         }

//         console.log(error)
//         res.status(400).send({ error: 'update failed' })
//       }
//     }
//   }
}

async function getOptionImage (id) {
  // Consulta a la bbdd con la opcion
  const sqlResponse = await con.query('SELECT imagen FROM opciones_piezas WHERE id_opcion = ?', [id])
  return sqlResponse[0][0].imagen
}
