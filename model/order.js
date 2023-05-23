'use strict'

module.exports.toJson = (rawOrder, rawParts) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  const parts = []
  for (const part of rawParts) {
    parts.push(
      {
        id: part.id_pieza,
        option: part.id_pieza,
        quantity: part.cantidad,
        price: part.precio
      }
    )
  }
  return {
    id: rawOrder.id_pedido,
    date: rawOrder.fecha,
    parts
  }
}
