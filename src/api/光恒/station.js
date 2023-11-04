import request from '../../utils/request'

export function 雷达统计接口(){
  return request({
    url: '/guangheng/api/radars/count',
    method: 'post',
    data: {
      user_id: 'e13df6498a4e46bc8970b95ec47779f5'
    }
  })
}

export function 查询雷达列表接口(query) {
  return request({
    url: '/guangheng/api/radars',
    method: 'post',
    data: {
      user_id: 'e13df6498a4e46bc8970b95ec47779f5'
    }
  })
}

export function 查询雷达在线列表接口(query) {
  return request({
    url: '/guangheng/api/radars/online',
    method: 'post',
    data: {
      user_id: 'e13df6498a4e46bc8970b95ec47779f5'
    }
  })
}

export function 查询雷达离线列表接口(query) {
  return request({
    url: '/guangheng/api/radars/offline',
    method: 'post',
    data: {
      user_id: 'e13df6498a4e46bc8970b95ec47779f5'
    }
  })
}

export function 查询近期新增雷达列表接口(query) {
  return request({
    url: '/guangheng/api/radars/new',
    method: 'post',
    data: {
      user_id: 'e13df6498a4e46bc8970b95ec47779f5'
    }
  })
}
export function 查询平均风数据接口(query) {
  return request({
    url: '/guangheng/api/weather/wind/avg',
    method: 'post',
    data: {
      user_id: "e13df6498a4e46bc8970b95ec47779f5",
      // date: new Date().Format('yyyyMMdd')
      date: "20231026"
    }
  })
}
export function 查询径向风数据接口(){
  return request({
    url: 'guangheng/api/weather/wind/radial',
    method: 'post',
    data:{
      user_id:'e13df6498a4e46bc8970b95ec47779f5',
      date:'20231026'
    }
  })
}

export function 发送电子邮件接口(){
  return request({
    url: '/guangheng/api/mail',
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
    url: '/guangheng/api/mail_with_atachments',
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
    url: '/guangheng/api/sms',
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
