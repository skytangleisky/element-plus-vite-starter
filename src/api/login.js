import request from '../utils/request'
const url = 'backend/libs/db/src/login.php'
export function login(data) {
  return request({
    url,
    method: 'post',
    timeout: 5000,
    data
  })
}
export function getInfo() {
  return request({
    url,
    method: 'get'
  })
}
export function logout() {
  const data = { 'logout': 'true' }
  return request({
    url,
    method: 'delete',
    data
  })
}
