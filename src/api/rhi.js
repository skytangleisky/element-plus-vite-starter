import request from '../utils/request'
const url = 'backend/rhi/getData'
export function getData(data) {
  return request({
    url: url + `?offset=${data.offset}&preLimit=${data.preLimit}&clientTime=${performance.now()}`,
    method: 'get'
  })
}