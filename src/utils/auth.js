import Cookies from 'js-cookie'

const TokenKey = 'ReciteManager_Token'

export function getToken() {
  //return Cookies.get(TokenKey)
  return window.localStorage.getItem(TokenKey)
}

export function setToken(token) {
  //return Cookies.set(TokenKey, token)
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  //return Cookies.remove(TokenKey)
  window.localStorage.removeItem(TokenKey)
}
