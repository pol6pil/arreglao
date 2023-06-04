'use strict'

module.exports.toJson = (rawPart, rawOptions) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  const options = []
  if (rawOptions !== undefined) {
    for (const option of rawOptions) {
      options.push(
        {
          id: option.id_opcion,
          name: option.nombre,
          imgUrl: `http://127.0.0.1:80/images/parts/${option.imagen}`,
          price: option.precio,
          part_id: option.id_pieza
        }
      )
    }
  }
  return {
    id: rawPart.id_pieza,
    name: rawPart.nombre,
    description: rawPart.descripcion,
    warranty: rawPart.garantia,
    options,
    warning: rawPart.advertencia,
    note: rawPart.nota,
    category: rawPart.id_categoria,
    appliance: rawPart.id_electrodomestico
  }
}
