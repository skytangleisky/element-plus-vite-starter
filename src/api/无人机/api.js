import request from '../../utils/request'
let tableName=''
let options = ''
let url = ''
function setConfig(){
  let filename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if(filename=='synthesis'||filename=='history'||filename=='simulate'||filename=='airspace'||filename=='networking'){
    tableName='enclosure'
    options = '?host=tanglei.top&port=3308&user=root&password=mysql&database=gis'
    url = 'backend/db/'+tableName+options
  }if(filename=='ry'){
    tableName='zydpara'
    options = '?host=tanglei.top&port=3308&user=root&password=mysql&database=ryplat_bjry'
    url = 'backend/db/'+tableName+options
  }else{
    tableName = filename
    options =  '?host=tanglei.top&port=3308&user=root&password=mysql&database=jiangxi';
    url = 'backend/db/'+tableName+options
  }
}
export function getColumns(){
  setConfig()
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
  setConfig()
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
  setConfig()
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
  setConfig()
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
          "condition":"02"//S净空区(糖果图) P禁飞区  D危险区 M可飞区   R限飞区  O计划空域  L	航线  F	航路 A	走廊
        },
        {
          "relation":"OR",
          "field":"enclosure_type",
          "relationship":"=",
          "condition":"03"
        },
        {
          "relation":"OR",
          "field":"enclosure_type",
          "relationship":"=",
          "condition":"00"
        },
        {
          "relation":"OR",
          "field":"enclosure_type",
          "relationship":"=",
          "condition":"06"
        }
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
  setConfig()
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
  setConfig()
  return request({
    url,
    method: 'put',
    data
  })
}

export function deleteData(data) {
  setConfig()
  return request({
    url,
    method: 'delete',
    data
  })
}
