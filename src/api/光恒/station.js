import request from '../../utils/request'
const user_id = '1e2ef8820806421eb849ed2dead33bff'
// const time = '20231026'
const time = new Date().Format('yyyyMMdd')
export function 雷达统计接口(query){
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/radars/count',
    method: 'post',
    data: query
  })
}

export function 查询雷达列表接口(query) {
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/radars',
    method: 'post',
    data: query
  })
}

export function 查询雷达在线列表接口(query) {
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/radars/online',
    method: 'post',
    data: query
  })
}

export function 查询某一天的雷达状态数据接口(query,time){
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: '/api/radar/status/' + time,
    method: 'post',
    data: query
  })
}

export function 查询雷达离线列表接口(query) {
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/radars/offline',
    method: 'post',
    data: query
  })
}

export function 查询近期新增雷达列表接口(query) {
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/radars/new',
    method: 'post',
    data: query
  })
}
export function 查询平均风数据接口(query,time) {
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/weather/wind/avg/'+time,
    method: 'post',
    data: query
  })
}
export function 查询瞬时风数据接口(query) {
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/weather/wind/second/'+time,
    method: 'post',
    data: query
  })
}
export function 查询径向风数据接口(query){
  if(!query.user_id){
    query.user_id = user_id
  }
  return request({
    url: 'api/weather/wind/radial/'+time,
    method: 'post',
    data:query
  })
}

export function 发送电子邮件接口(){
  return request({
    url: 'api/mail',
    method: 'post',
    data: {
      subject: '文本测试',
      html_message: '<p>Hello World.</p>',
      recipient_list: [
        "2413081441@qq.com"
      ]
    }
  })
}

export function 发送带附件的邮件接口(){
  return request({
    url: 'api/mail_with_atachments',
    method: 'post',
    data: {
      subject: '文本测试',
      html_message: '<p>Hello World.</p>',
      file_url: 'http://127.0.0.1/测试docx',
      recipient_list: [
        "2413081441@qq.com"
      ]
    }
  })
}

export function 发送短信接口(){
  return request({
    url: 'api/sms',
    method: 'post',
    data: {
      phone_numbers: "13265328058",
      sign_name: "阿里云短信测试",
      template_code: "SMS_154950909",
      template_param: "{\"code\": \"1234\"}"
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
