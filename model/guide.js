'use strict'

module.exports.toJson = (rawGuide, rawSteps, rawInstructions) => {
  // Procesamos las imagenes para que contengan peticiones a la api
  const steps = []
  const instructions = []
  for (const instruction of rawInstructions) {
    instructions.push(
      {
        id: instruction.id_instruccion,
        instruction: instruction.instruction,
        type: instruction.tipo,
        step: instruction.id_paso
      }
    )
  }
  for (const step of rawSteps) {
    steps.push(
      {
        id: step.id_paso,
        name: step.nombre,
        imgUrl: `http://127.0.0.1:80/images/guides/${step.imagen}`,
        guide: step.id_guia,
        instructions
      }
    )
  }
  return {
    id: rawGuide.id_guia,
    name: rawGuide.nombre,
    intro: rawGuide.introduccion,
    duration: rawGuide.duracion,
    difficulty: rawGuide.dificultad,
    accepted: rawGuide.aceptada,
    imgUrl: `http://127.0.0.1:80/images/guides/${rawGuide.imagen}`,
    part: rawGuide.id_pieza,
    appliance: rawGuide.id_electrodomestico,
    user: rawGuide.email,
    steps
  }
}
