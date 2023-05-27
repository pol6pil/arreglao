'use strict'

module.exports.toJson = (rawReview) => {
  return {
    id: rawReview.id_review,
    title: rawReview.titulo,
    rating: rawReview.puntuacion,
    date: rawReview.fecha.toISOString().slice(0, 10),
    content: rawReview.subtitulo,
    email: rawReview.email,
    part: rawReview.id_pieza
  }
}
