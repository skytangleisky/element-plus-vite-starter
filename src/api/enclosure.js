import request from '../utils/request'
let tableName='enclosure'
let options = '?host=tanglei.top&port=3308&user=root&password=mysql&database=gis'
let url = 'backend/db/'+tableName+options
export function getColumns(){
  return request({
    url: '/backend/transaction'+options,
    method: 'post',
    data:{
      "sqls":[
        "SHOW FULL COLUMNS FROM `"+tableName+"`"
      ],
      "vals":[
        []
      ]
    }
  })
}
export function getAll(){
  return request({
    url: '/backend/transaction'+options,
    method: 'post',
    data:{
      "sqls":[
        "SELECT * FROM `"+tableName+"`"
      ],
      "vals":[
        []
      ]
    }
  })
}
export function fetchList(query) {
  return request({
    url,
    method: 'post',
    data: {
      "select":["*"], // 需要获取的字段，"*"代表所有字段
      "distinct":false, // 是否对筛选后的数据去重
      "where": query.where,
      // [
      //   {
      //     "relation":"AND", // AND|OR|NOT
      //     "field":"id", // 某个字段
      //     "relationship":"=", // <|<=|=|>=|>|!<|!>|!=|<>|LIKE|IS|IS NOT
      //     "condition":"50" // 当值为null时，relationship的值为IS或者IS NOT
      //   },
      //   {
      //     "relation":"AND",
      //     "field":"username",
      //     "relationship":"IS NOT",
      //     "condition":null
      //   }
      // ],
      "groupby":[], // 分组，传参类似"select"
      "having":[], // 分组后的条件，传参类似"where"
      "orderby": [ // 根据字段排序
        // {
        //   "field": "id", // 某个字段
        //   "order": "ASC" // ASC|DESC
        // }
      ],
      "offset": query.offset, // 数据偏移量
      "limit": query.limit // 数据数量
    }
  })
}

export function 获取净空区() {
  return request({
    url,
    method: 'post',
    data: {
      "select":["*"], // 需要获取的字段，"*"代表所有字段
      "distinct":false, // 是否对筛选后的数据去重
      "where":[
        {
          "relation":"AND",
          "field":"enclosure_type",
          "relationship":"=",
          "condition":"02"
        },
        {
          "relation":"AND",
          "field":"standby1",
          "relationship":"=",
          "condition":"S"//S净空区(糖果图) P禁飞区  D危险区 M可飞区   R限飞区  O计划空域  L	航线  F	航路 A	走廊
        },
        {
          "relation":"OR",
          "field":"standby1",
          "relationship":"=",
          "condition":"O"//S净空区(糖果图) P禁飞区  D危险区 M可飞区   R限飞区  O计划空域  L	航线  F	航路 A	走廊
        },
        {
          "relation":"OR",
          "field":"standby1",
          "relationship":"=",
          "condition":"R"
        },
        // {
        //   "relation":"OR",
        //   "field":"enclosure_type",
        //   "relationship":"=",
        //   "condition":"06"
        // }
      ],
      "groupby":[], // 分组，传参类似"select"
      "having":[], // 分组后的条件，传参类似"where"
      "orderby": [ // 根据字段排序
        // {
        //   "field": "id", // 某个字段
        //   "order": "ASC" // ASC|DESC
        // }
      ],
      "offset": 0,
      "limit": 0
    }
  })
}

export function fetchData(key,value) {
  return request({
    url,
    method: 'post',
    data: {
      "where":[
        {
          "relation":"AND", // AND|OR|NOT
          "field":key, // 某个字段
          "relationship":"=", // <|<=|=|>=|>|!<|!>|!=|<>|LIKE|IS|IS NOT
          "condition":value // 当值为null时，relationship的值为IS或者IS NOT
        }
      ]
    }
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
