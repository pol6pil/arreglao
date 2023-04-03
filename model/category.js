'use strict'

module.exports.toJson = (category) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  return {
    id: category.id_categoria,
    name: category.nombre,
    imgUrl: `http://127.0.0.1:80/img/categories/${category.imagen}`
  }
}
