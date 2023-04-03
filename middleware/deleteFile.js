/* eslint-disable no-unused-vars */
'use strict'
// Funcion que borra un archivo

const fs = require('fs')

const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
    }

    // file removed
  })
}

module.exports = deleteFile
