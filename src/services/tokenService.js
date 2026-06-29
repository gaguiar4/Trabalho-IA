const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_username'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function saveUsername(username) {
  localStorage.setItem(USER_KEY, username)
}

export function getUsername() {
  return localStorage.getItem(USER_KEY)
}

export function isAuthenticated() {
  return !!getToken()
}
