'use strict'

module.exports.toJson = (appliance) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  return {
    id: appliance.id_electrodomestico,
    name: appliance.nombre,
    imgUrl: `http://127.0.0.1:80/img/appliances/${appliance.imagen}`
  }
}
