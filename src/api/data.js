import request from '../utils/request'
const url = 'backend/db/data'
export function fetchList(query) {
  return request({
    url,
    method: 'post',
    data: {
      "select":["*"], // 需要获取的字段，"*"代表所有字段
      "distinct":false, // 是否对筛选后的数据去重
      "where":[
        // {
        //   "relation":"AND", // AND|OR|NOT
        //   "field":"id", // 某个字段
        //   "relationship":"=", // <|<=|=|>=|>|!<|!>|!=|<>|LIKE|IS|IS NOT
        //   "condition":"50" // 当值为null时，relationship的值为IS或者IS NOT
        // },
        // {
        //   "relation":"AND",
        //   "field":"username",
        //   "relationship":"IS NOT",
        //   "condition":null
        // }
      ],
      "groupby":[], // 分组，传参类似"select"
      "having":[], // 分组后的条件，传参类似"where"
      "orderby": [ // 根据字段排序
        {
          "field": "id", // 某个字段
          "order": "ASC" // ASC|DESC
        }
      ],
      "offset": query.offset, // 数据偏移量 
      "limit": query.limit // 数据数量
    }
  })
}

export function fetchData(uuid) {
  return request({
    url,
    method: 'post',
    data: {
      "where":[
        {
          "relation":"AND", // AND|OR|NOT
          "field":"uuid", // 某个字段
          "relationship":"=", // <|<=|=|>=|>|!<|!>|!=|<>|LIKE|IS|IS NOT
          "condition":uuid // 当值为null时，relationship的值为IS或者IS NOT
        }
      ]
    }
  })
}

export function saveData(data) {
  return request({
    url,
    method: 'post',
    data
  })
}

export function deleteData(data) {
  return request({
    url,
    method: 'delete',
    data
  })
}
