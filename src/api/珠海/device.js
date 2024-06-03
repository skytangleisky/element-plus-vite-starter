import request from '../../utils/request'
export function getDevice(){
  return request({
    url: 'backend/ry_device',
    method: 'get',
  })
}