export function saveUser (email, isAdmin) {
  window.localStorage.setItem('user', JSON.stringify({ email, isAdmin }))
  window.location.href = './index.html'
}
