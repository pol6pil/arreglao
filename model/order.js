'use strict'

module.exports.toJson = (rawOrder, rawParts) => {
  const parts = []
  if (rawParts !== undefined) {
    for (const part of rawParts) {
      parts.push(
        {
          id: part.id_pieza,
          option: part.id_opcion,
          quantity: part.cantidad,
          price: part.precio
        }
      )
    }
  }

  return {
    id: rawOrder.id_pedido,
    date: rawOrder.fecha.toISOString().slice(0, 10),
    parts
  }
}
