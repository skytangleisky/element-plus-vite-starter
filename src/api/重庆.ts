import request from '../utils/request'
export function getDataList(query:{radar_id:string,dataType:string,date:string}){
  return request({
    url: '/qt/dataList',
    method: 'post',
    data:{
      "version":"1.0",
      "secretKey":"904c396f6956d02c59a6ad35c08f5678",
      "radar_id":query.radar_id,
      "dataType":query.dataType,
      "dataTime":query.date
    }
  })
}

export function getFkxHisData(query:{radar_id:string,dateTime:string}){
  return request({
    url: '/qt/hisData/fkx',
    method: 'post',
    data: {"version":"1.0","secretKey":"904c396f6956d02c59a6ad35c08f5678","radar_id":query.radar_id,"dataTime":query.dateTime}
  })
}

//mock
export function getFkxRealData(query:{radar_id:string,dateTime:string}){
  return request({
    url: '/backend/realData/fkx',
    method: 'post',
    headers:{
      'content-type':'application/json'
    },
    data:{}
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
    url: '/qt/hisRadialVecData/ppi',
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
