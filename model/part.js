'use strict'

module.exports.toJson = (row, rawOptions) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  const options = []
  for (const option of rawOptions) {
    options.push(
      {
        id: option.id,
        name: option.nombre,
        imgUrl: `http://127.0.0.1:80/images/parts/${option.imagen}`,
        price: option.precio,
        part_id: option.id_pieza
      }
    )
  }
  return {
    id: row.id_pieza,
    name: row.nombre,
    description: row.descripcion,
    warranty: row.garantia,
    options,
    warning: row.advertencia,
    note: row.nota,
    category: row.id_categoria,
    appliance: row.id_electrodomestico
  }
}
