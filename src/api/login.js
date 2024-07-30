import request from '../utils/request'
const url = 'backend/libs/db/src/login.php?host=tanglei.top&port=3306&user=root&password=tanglei&database=union'
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
