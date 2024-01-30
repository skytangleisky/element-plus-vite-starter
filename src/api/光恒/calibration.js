import request from '../../utils/request'
const user_id = '1e2ef8820806421eb849ed2dead33bff'
export function 查询标定场数据接口(query){
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: '/api/radar/calibration_fields',
    method: 'post',
    data: query
  })
}
