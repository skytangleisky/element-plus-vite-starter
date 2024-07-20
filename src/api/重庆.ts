import request from '../utils/request'
export function getDataList(query:{radar_id:string,path:string}){
  return request({
    url: '/qt/dataList',
    method: 'post',
    data:{
      "version":"1.0",
      "secretKey":"904c396f6956d02c59a6ad35c08f5678",
      "radar_id":query.radar_id,
      "path":query.path
    }
  })
}

export function getFkxHisData(query:{radar_id:string,dateTime:string}){
  return request({
    url: '/qt/hisCSV/dbs',
    method: 'post',
    data: {"version":"1.0","secretKey":"904c396f6956d02c59a6ad35c08f5678","radar_id":query.radar_id,"dataTime":query.dateTime,num:4}
  })
}

//mock
export function getFkxRealData(query:{radar_id:string,dateTime:string,num:number}){
  let data = {
    "version": "1.0",
    "secretKey": "904c396f6956d02c59a6ad35c08f5678",
    "radar_id": query.radar_id,
    "dataTime": query.dateTime,
    "level":3,
    "num":query.num
  }
  return request({
    url: '/qt/realCSV/dbs',
    method: 'post',
    headers:{
      'content-type':'application/json'
    },
    data
  })
}

export function getPPIRadial(query:{radar_id:string,dataTime:string}){
  let data = {
    "version":"1.0",
    "secretKey":"904c396f6956d02c59a6ad35c08f5678",
    "radar_id":query.radar_id,
    "dataTime":query.dataTime,
  }
  return request({
    url: '/qt/hisCSV/ppi',
    method: 'post',
    headers:{
    'content-type':'application/json'
    },
    data
  })
}
export function getPPIGrid(query:{radar_id:string,dataTime:string}){
  let data = {
    "version":"1.0",
    "secretKey":"904c396f6956d02c59a6ad35c08f5678",
    "radar_id":"A6418",
    "dataTime":'20240715203223',
  }
  return request({
    url: '/qt/realCSV/ppi',
    method: 'post',
    headers:{
    'content-type':'application/json'
    },
    data
  })
}
export function getRHIRadial(query:{radar_id:string,dataTime:string}){
  let data = {
    "version":"1.0",
    "secretKey":"904c396f6956d02c59a6ad35c08f5678",
    "radar_id":query.radar_id,
    "dataTime":query.dataTime,
  }
  return request({
    url: '/qt/hisRadialVecData/rhi',
    method: 'post',
    headers:{
    'content-type':'application/json'
    },
    data
  })
}
export function getSensorData(query:{radar_id:string,dataTime:string}){
  let data = {
    "version":"1.0",
    "secretKey":"904c396f6956d02c59a6ad35c08f5678",
    "radar_id":query.radar_id,
    "dataTime":query.dataTime,
  }
  return request({
    url: '/qt/sensor',
    method: 'post',
    headers:{
      'content-type':'application/json'
    },
    data
  })
}
