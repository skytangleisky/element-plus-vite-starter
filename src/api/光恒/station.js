import request from '../../utils/request'
const url = '/guangheng/api/radars/'
export function fetchList(query) {
  return request({
    url,
    method: 'post',
    data: {
      ent_id:'123'
    }
  })
}

// export function fetchData(uuid) {
//   return request({
//     url,
//     method: 'post',
//     data: {
//       "where":[
//         {
//           "relation":"AND", // AND|OR|NOT
//           "field":"uuid", // 某个字段
//           "relationship":"=", // <|<=|=|>=|>|!<|!>|!=|<>|LIKE|IS|IS NOT
//           "condition":uuid // 当值为null时，relationship的值为IS或者IS NOT
//         }
//       ]
//     }
//   })
// }

// export function saveData(data) {
//   return request({
//     url,
//     method: 'post',
//     data
//   })
// }

// export function deleteData(data) {
//   return request({
//     url,
//     method: 'delete',
//     data
//   })
// }
