import request from '~/utils/request'
import {databaseRaw} from '~/api/重庆'
const url = 'backend/db/图标?'+databaseRaw
export function fetchList() {
  const data = {
    "select":["*"], // 需要获取的字段，"*"代表所有字段
    "distinct":false, // 是否对筛选后的数据去重
    "where":[
        // {
        //     "relation":"AND", // AND|OR|NOT
        //     "field":"id", // 某个字段
        //     "relationship":"=", // <|<=|=|>=|>|!<|!>|!=|<>|LIKE|IS|IS NOT
        //     "condition":"50" // 当值为null时，relationship的值为IS或者IS NOT
        // },
        // {
        //     "relation":"AND",
        //     "field":"username",
        //     "relationship":"IS NOT",
        //     "condition":null
        // }
    ],
    "groupby":[], // 分组，传参类似"select"
    "having":[], // 分组后的条件，传参类似"where"
    "orderby": [ // 根据字段排序
        {
            "field": "id", // 某个字段
            "order": "ASC" // ASC|DESC
        }
        // {
        //     "field": "username",
        //     "order": "DESC"
        // }
    ],
    "offset": 0, // 数据偏移量 
    "limit": 0 // 数据数量
  }
  return request({
    url,
    method: 'post',
    data,
  })
}
export function saveData(data) {
  return request({
    url,
    method: 'put',
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

export function exec({database,query}){
  return request({
    url: '/backend/transaction?'+database,
    method: 'post',
    data:query
  })
}