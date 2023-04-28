'use strict'

module.exports.toJson = (row) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  try {
    return {
      email: row.email,
      name: row.nombre,
      balance: row.saldo,
      surname1: row.apellido1,
      surname2: row.apellido2,
      isAdmin: row.esAdmin,
      imgUrl: `http://127.0.0.1:80/images/users/${row.foto}`
    }
  } catch (error) {
    return null
  }
}

module.exports.getImage = (row) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  try {
    return {
      imgUrl: `http://127.0.0.1:80/images/users/${row.foto}`
    }
  } catch (error) {
    return null
  }
}
