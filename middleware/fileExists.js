/* eslint-disable no-unused-vars */
'use strict'
const fs = require('fs')
// Funcion que comprueba si un archivo existe o no

// const fileExists = (path, thenFunc, catchfunc) => fs.promises.stat(path).then(() => thenFunc, () => catchfunc)
const fileExists = (path, thenFunc, catchfunc) => {
  if (fs.existsSync(path)) {
    thenFunc()
  } else {
    catchfunc()
  }
}

module.exports = fileExists
