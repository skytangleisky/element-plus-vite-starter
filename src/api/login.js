import request from '../utils/request'

export function login(data) {
  return request({
    url: 'libs/db/src/login.php',
    method: 'post',
    timeout: 5000,
    data
  })
}
export function getInfo() {
  return request({
    url: 'libs/db/src/login.php',
    method: 'get'
  })
}
export function logout() {
  const data = { 'logout': 'true' }
  return request({
    url: 'libs/db/src/login.php',
    method: 'delete',
    data
  })
}
