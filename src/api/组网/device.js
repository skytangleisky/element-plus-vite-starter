import request from '../../utils/request'
export function getDevice(){
  return request({
    url: 'backend/device',
    method: 'get',
  })
}