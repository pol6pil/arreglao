'use strict'

async function getNewParts (partCount) {
  const res = await fetch(`http://localhost/parts?orderBy=id_pieza&limit=${partCount}`)
  const json = await res.json()
  return json
}

async function showNewParts(count, div) {
    
}
