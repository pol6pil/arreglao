'use strict'
// eslint-disable-next-line no-unused-vars
function saveUser (user) {
  window.localStorage.setItem('user', JSON.stringify(user))
  window.location.href = './index.html'
}
