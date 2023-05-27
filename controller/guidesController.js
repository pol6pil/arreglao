'use strict'

const guideModel = require('../model/guide')
const con = require('../middleware/sqlconnection')
const deleteFile = require('../middleware/deleteFile')
const path = require('path')
// Funcionalidades de la api respecto a guias
module.exports.getAcceptedGuidesByAppliance = async (req, res) => {
  try {
    const id = Number(req.params.id) || 0

    // Si el id se ha marcado hacemos la consulta
    if (id > 0) {
      // Consulta a la bbdd con la consulta almacenada
      const guidesSql = await con.query('SELECT * FROM guias WHERE aceptada = 1 AND id_electrodomestico = ?', [id])
      // Procesamos las filas para poder enviarlas
      const guides = guidesSql[0]
      let steps
      let instrucctions
      const guidesJson = []
      for (const guide of guides) {
        console.log(guide)
        // Consula a la bbdd de los pasos de la guia
        const stepsSql = await con.query('SELECT * FROM pasos WHERE id_guia = ?', [guide.id_guia])
        steps = stepsSql[0]
        for (const step of steps) {
        // Consula a la bbdd de las instrucciones del paso
          const instrucctionsSql = await con.query('SELECT * FROM instrucciones WHERE id_paso = ?', [step.id_paso])
          instrucctions = instrucctionsSql[0]
        }
        guidesJson.push(guideModel.toJson(guide, steps, instrucctions))
      }
      res.send(guidesJson)
    }
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'select failed' })
  }
}

module.exports.getPendingGuides = async (req, res) => {
  try {
    const id = Number(req.params.id) || 0

    // Si el id se ha marcado hacemos la consulta
    if (id > 0) {
      // Consulta a la bbdd con la consulta almacenada
      const guidesSql = await con.query('SELECT * FROM guias WHERE aceptada = 0 AND id_electrodomestico = ?', [id])
      // Procesamos las filas para poder enviarlas
      const guides = guidesSql[0]
      let steps
      let instrucctions
      const guidesJson = []
      for (const guide of guides) {
        // Consula a la bbdd de los pasos de la guia
        const stepsSql = await con.query('SELECT * FROM pasos WHERE id_guia = ?', [guide.id_guia])
        steps = stepsSql[0]
        for (const step of steps) {
        // Consula a la bbdd de las instrucciones del paso
          const instrucctionsSql = await con.query('SELECT * FROM instrucciones WHERE id_paso = ?', [step.id_paso])
          instrucctions = instrucctionsSql[0]
        }
        guidesJson.push(guideModel.toJson(guide, steps, instrucctions))
      }
      res.send(guidesJson)
    }
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'select failed' })
  }
}

// module.exports.getAllPartsInAppliance = async (req, res) => {
//   const limit = Number(req.params.limit) || 0
//   const appliance = req.params.appliance || 0

//   if (appliance > 0) {
//     // Conexion a la bbdd
//     // Almacenamos la consulta en un string para luego modificarlo
//     let consult = 'SELECT * FROM piezas WHERE id_electrodomestico = ?'
//     const queryColumns = []
//     queryColumns.push(appliance)
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
// }

// module.exports.getAllPartsInCategory = async (req, res) => {
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
// }

module.exports.getGuide = async (req, res) => {
  const id = Number(req.params.id) || 0

  // Si el id se ha marcado hacemos la consulta
  if (id > 0) {
    res.send(await getGuideSql(id))
  } else {
    // Si el id no es valido enviamos un error
    res.status(400).send({ error: 'invalid id' })
  }
}

module.exports.getGuideByPart = async (req, res) => {
  const partId = Number(req.params.id) || 0
  // Si el id se ha marcado hacemos la consulta
  if (partId > 0) {
    // Consulta a la bbdd con la consulta almacenada
    const guideSql = await con.query('SELECT * FROM guias WHERE aceptada = 1 AND id_pieza = ?', [partId])
    // Procesamos las filas para poder enviarlas
    const guide = guideSql[0][0]
    if (guide !== undefined) {
      let instrucctions
      // Consula a la bbdd de los pasos de la guia
      const stepsSql = await con.query('SELECT * FROM pasos WHERE id_guia = ?', [guide.id_guia])
      const steps = stepsSql[0]
      for (const step of steps) {
        // Consula a la bbdd de las instrucciones del paso
        const instrucctionsSql = await con.query('SELECT * FROM instrucciones WHERE id_paso = ?', [step.id_paso])
        instrucctions = instrucctionsSql[0]
      }
      res.send(guideModel.toJson(guide, steps, instrucctions))
    } else {
      res.send(null)
    }
  } else {
    // Si el id no es valido enviamos un error
    res.status(400).send({ error: 'invalid id' })
  }
}

module.exports.getGuideByUser = async (req, res) => {
  const email = req.params.email || 0
  // Si el id se ha marcado hacemos la consulta
  if (email !== 0) {
    // Consulta a la bbdd con la consulta almacenada
    const guidesSql = await con.query('SELECT * FROM guias WHERE email = ?', [email])
    // Procesamos las filas para poder enviarlas
    const guides = []
    for (const guide of guidesSql[0]) {
      let instrucctions
      // Consula a la bbdd de los pasos de la guia
      const stepsSql = await con.query('SELECT * FROM pasos WHERE id_guia = ?', [guide.id_guia])
      const steps = stepsSql[0]
      for (const step of steps) {
      // Consula a la bbdd de las instrucciones del paso
        const instrucctionsSql = await con.query('SELECT * FROM instrucciones WHERE id_paso = ?', [step.id_paso])
        instrucctions = instrucctionsSql[0]
      }
      guides.push(guideModel.toJson(guide, steps, instrucctions))
    }
    if (guides.length > 0) {
      res.send(guides)
    } else {
      res.send(null)
    }
  } else {
    // Si el id no es valido enviamos un error
    res.status(400).send({ error: 'invalid id' })
  }
}

module.exports.addGuide = async (req, res) => {
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
      // Obtenemos el id del electrodomestico
      const applianceId = await getApplianceId(req.body.part)
      // Insertamos la pieza
      const query = 'INSERT INTO `guias`(`imagen`, `nombre`, `introduccion`, `id_pieza`, `id_electrodomestico`, `email`, `duracion`, `dificultad`, `aceptada`) VALUES (?,?,?,?,?,?,?,?,?)'
      const result = await con.query(query,
        [req.files[0].filename, req.body.title, req.body.intro, req.body.part, applianceId, req.body.email, req.body.time, req.body.difficulty, 0])
      const guideId = result[0].insertId
      const steps = JSON.parse(req.body.steps)
      // Creamos un indice para recorrer los archivos de las opciones
      let fileIndex = 1
      for (const step of steps) {
        console.log(step)
        // Si se ha insertado una imagen la subimos a la bbdd
        if (step.imageUpload) {
          const queryStep = 'INSERT INTO `pasos`(`nombre`, `imagen`, `id_guia`) VALUES (?,?,?)'
          const resultStep = await con.query(queryStep, [step.name, req.files[fileIndex].filename, guideId])
          const stepId = resultStep[0].insertId
          fileIndex++
          for (const instruction of step.instructions) {
            const queryStep = 'INSERT INTO `instrucciones`(`instruccion`, `tipo`, `id_paso`) VALUES (?,?,?)'
            await con.query(queryStep, [instruction.text, instruction.type, stepId])
          }
        }
      }

      // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
      res.send(await getGuideSql(guideId))
      await connection.commit()
      // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
    } catch (error) {
      await connection.rollback()
      // Borramos todas las imagenes
      const steps = JSON.parse(req.body.steps)
      for (let i = 0; i < steps.length + 1; i++) {
        if (req.files[i] !== undefined) {
          deleteFile(path.join(process.cwd(), '/public/images/guides/', req.files[i].filename))
        }
      }

      console.log(error)
      res.status(400).send({ error: 'insert failed' })
    }
  }
}

module.exports.acceptGuide = async (req, res) => {
  try {
    const id = Number(req.params.id) || 0
    // Si el id se ha marcado hacemos la consulta
    if (id > 0) {
      // Consulta a la bbdd con la consulta almacenada
      const query = 'UPDATE `guias` SET `aceptada`=1 WHERE `id_guia`=?'
      await con.query(query, [id])
      res.send({ message: 'guide accepted successfully' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'select failed' })
  }
}

module.exports.editGuide = async (req, res) => {
  const guideId = req.params.id || 0
  if (guideId > 0) {
    if (typeof req.body === 'undefined') {
      res.json({
        status: 'error',
        message: 'data is undefined'
      })
    } else {
      const connection = await con.getConnection()
      // Hacemos una transaccion para poder editar tanto como las piezas como las opciones
      try {
        await connection.beginTransaction()
        // Editamos la guia
        // Obtenemos el id del electrodomestico
        const applianceId = await getApplianceId(req.body.part)
        // Creamos un indice para recorrer los archivos de las opciones
        let fileIndex = 0
        // Si queremos actualizar la imagen, la subimos
        if (req.body.imageUpload) {
          // Obtenemos la imagen antigua antes de modificar las opciones para luego poder borrar la imagen
          const imgUrl = await getGuideImage(guideId)
          // Actualizamos la opcion en la bbdd
          const query = 'UPDATE `guias` SET `imagen`=?, `nombre`=?,`introduccion`=?,`id_pieza`=?,`id_electrodomestico`=?,`email`=?,`duracion`=?,`dificultad`=?,`aceptada`=? WHERE `id_guia`=?'
          await con.query(query,
            [req.files[fileIndex].filename, req.body.title, req.body.intro, req.body.part, applianceId, req.body.email, req.body.time, req.body.difficulty, 0, guideId])
          fileIndex++
          // Borramos la imagen anterior
          deleteFile(path.join(process.cwd(), '/public/images/guides/', imgUrl))
        } else {
          const query = 'UPDATE `guias` SET `nombre`=?,`introduccion`=?,`id_pieza`=?,`id_electrodomestico`=?,`email`=?,`duracion`=?,`dificultad`=?,`aceptada`=? WHERE `id_guia`=?'
          await con.query(query,
            [req.body.title, req.body.intro, req.body.part, applianceId, req.body.email, req.body.time, req.body.difficulty, 0, guideId])
        }
        const steps = JSON.parse(req.body.steps)

        for (const step of steps) {
          // Comprobamos si la opcion tiene que ser insertada o actualizada
          if (step.update) {
            // Si se ha insertado una imagen la subimos a la bbdd
            if (step.imageUpload) {
              // Obtenemos la imagen antes de modificar las opciones para luego poder borrar la imagen
              const imgUrl = await getStepImage(step.id)
              // Actualizamos la opcion en la bbdd
              // NO PERMITE HACER CONSULTA PREPARADA, FIXEO PENDIENTE SI EXISTE
              const query = 'UPDATE pasos SET nombre=?,imagen=?,id_guia=? WHERE id_paso=?'
              await con.query(query, [step.name, req.files[fileIndex].filename, guideId, step.id])
              fileIndex++
              // Borramos la imagen anterior
              deleteFile(path.join(process.cwd(), '/public/images/guides/', imgUrl))
            } else {
              // Actualizamos sin imagen
              const query = 'UPDATE pasos SET nombre=?,id_guia=? WHERE id_paso=?'
              await con.query(query, [step.name, guideId, step.id])
            }
            for (const instruction of step.instructions) {
              addInstruction(instruction, step.id)
            }
            // Comprobamos si el paso se tiene que borrar
          } else if (step.isDelete) {
            // Obtenemos la imagen para poder borrarla
            const imgUrl = await getStepImage(step.id)
            // Borramos el paso
            await deleteStep(step.id)
            // Borramos la imagen
            deleteFile(path.join(process.cwd(), '/public/images/guides/', imgUrl))
          } else {
            // Insertamos el paso
            if (step.imageUpload) {
              const queryStep = 'INSERT INTO `pasos`(`nombre`, `imagen`, `id_guia`) VALUES (?,?,?)'
              const resultStep = await con.query(queryStep, [step.name, req.files[fileIndex].filename, guideId])
              const stepId = resultStep[0].insertId
              fileIndex++
              for (const instruction of step.instructions) {
                const queryStep = 'INSERT INTO `instrucciones`(`instruccion`, `tipo`, `id_paso`) VALUES (?,?,?)'
                await con.query(queryStep, [instruction.text, instruction.type, stepId])
              }
            }
          }
        }

        // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
        res.send(await getGuideSql(guideId))
        await connection.commit()
        // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
      } catch (error) {
        await connection.rollback()
        // Borramos todas las imagenes
        const steps = JSON.parse(req.body.steps)
        for (let i = 0; i < steps.length + 1; i++) {
          if (req.files[i] !== undefined) {
            deleteFile(path.join(process.cwd(), '/public/images/guides/', req.files[i].filename))
          }
        }
        console.log(error)
        res.status(400).send({ error: 'update failed' })
      }
    }
  }
}

module.exports.deleteGuide = async (req, res) => {
  const guideId = req.params.id || 0
  if (guideId === 0) {
    res.json({
      status: 'error',
      message: 'data is undefined'
    })
  } else {
    const connection = await con.getConnection()
    // Hacemos una transaccion para poder borrar tanto como la guia como los pasos como las instrucciones
    try {
      await connection.beginTransaction()
      // Obtenemos los pasos de la guia
      const sqlResponse = await con.query('SELECT * FROM pasos WHERE id_guia = ?', [guideId])
      const steps = sqlResponse[0]
      // Borramos las instrucciones de los pasos
      for (const step of steps) {
        console.log(step)
        const queryInstruction = 'DELETE FROM instrucciones WHERE id_paso=?'
        await con.query(queryInstruction, [step.id_paso])
        // Borramos las imagenes de los pasos
        if (step.imagen !== null) {
          deleteFile(path.join(process.cwd(), '/public/images/guides/', step.imagen))
        }
      }
      // Borramos los pasos
      await con.query('DELETE FROM pasos WHERE id_guia = ?', [guideId])
      // Borramos la guia
      await con.query('DELETE FROM guias WHERE `id_guia`=?', [guideId])

      // Devolvemos el json del producto añadido si todo esta bien (reutilizamos codigo)
      res.send({ message: 'delete successful' })
      await connection.commit()
      // Si da error la insercion, borramos la imagen y hacemos un rollback a la transaccion
    } catch (error) {
      await connection.rollback()
      console.log(error)
      res.status(400).send({ error: 'update failed' })
    }
  }
}

async function getGuideSql (id) {
  // Consulta a la bbdd con la consulta almacenada
  const guideSql = await con.query('SELECT * FROM guias WHERE id_guia = ?', [id])
  // Procesamos las filas para poder enviarlas
  const guide = guideSql[0][0]
  if (guide !== undefined) {
    let instrucctions
    // Consula a la bbdd de los pasos de la guia
    const stepsSql = await con.query('SELECT * FROM pasos WHERE id_guia = ?', [id])
    const steps = stepsSql[0]
    for (const step of steps) {
    // Consula a la bbdd de las instrucciones del paso
      const instrucctionsSql = await con.query('SELECT * FROM instrucciones WHERE id_paso = ?', [step.id_paso])
      instrucctions = instrucctionsSql[0]
    }
    return guideModel.toJson(guide, steps, instrucctions)
  } else {
    return null
  }
}

async function addInstruction (instruction, stepId) {
  // Si la instruccion se tiene que actualizar, se actualiza
  if (instruction.updateInstruction) {
    const queryInstruction = 'UPDATE instrucciones SET instruccion=?,tipo=?,id_paso=? WHERE id_instruccion=?'
    await con.query(queryInstruction, [instruction.text, instruction.type, stepId, instruction.id])
  } else if (instruction.isDelete) {
  // Si se tiene que borrar
    const queryInstruction = 'DELETE FROM instrucciones WHERE id_instruccion=?'
    await con.query(queryInstruction, [instruction.id])
  } else {
  // Si se tiene que insertar
    const queryInstruction = 'INSERT INTO instrucciones (instruccion, tipo, id_paso) VALUES (?,?,?)'
    await con.query(queryInstruction, [instruction.text, instruction.type, stepId])
  }
}

async function getApplianceId (part) {
  // Consulta a la bbdd con la opcion
  const sqlResponse = await con.query('SELECT id_electrodomestico FROM piezas WHERE id_pieza = ?', [part])
  console.log(sqlResponse[0][0], sqlResponse[0][0].id_electrodomestico, part)
  return sqlResponse[0][0].id_electrodomestico
}

async function getGuideImage (id) {
  // Consulta a la bbdd
  const sqlResponse = await con.query('SELECT imagen FROM guias WHERE id_guia = ?', [id])
  return sqlResponse[0][0].imagen
}

async function getStepImage (id) {
  // Consulta a la bbdd
  const sqlResponse = await con.query('SELECT imagen FROM pasos WHERE id_paso = ?', [id])
  return sqlResponse[0][0].imagen
}

async function deleteStep (id) {
  // Consulta a la bbdd con el paso
  await con.query('DELETE FROM pasos WHERE id_paso = ?', [id])
}
