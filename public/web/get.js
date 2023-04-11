'use strict'

export function getParameter (parameterName) {
  const parameters = new URLSearchParams(window.location.search)
  return parameters.get(parameterName)
}
