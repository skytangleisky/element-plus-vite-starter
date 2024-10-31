import request from '../utils/request'
import moment from 'moment';
// export const databaseRaw = 'host=127.0.0.1&port=3306&user=root&password=tanglei&database=weatherservice';
// export const databaseRaw = 'host=tanglei.top&port=3306&user=root&password=tanglei&database=union';
export const databaseRaw = 'host=tanglei.top&port=3308&user=root&password=mysql&database=weatherservice';
// export const databaseRaw = 'host=127.0.0.1&port=3306&user=admin&password=EkWM76Z8IJbfviCr&database=weatherservice';
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

export function getFkxData(query:{dataTime:string,altitude:number}){
  let data = {
    "version": "1.0",
    "secretKey": "904c396f6956d02c59a6ad35c08f5678",
    "dataTime": query.dataTime,
    "altitude": query.altitude,
    "dataTime_interval":600,
    "alt_interval": 50,
    "level": 3
  }
  return request({
    url: '/qt/dbsNet',
    method: 'post',
    headers:{
      'content-type':'application/json'
    },
    data
  })
}

export function getPPIData(query:{radar_id:string,dataTime:string},level=1){
  let data = {
    "version":"1.0",
    "secretKey":"904c396f6956d02c59a6ad35c08f5678",
    "radar_id":query.radar_id,
    "dataTime":query.dataTime,
    "level":level//1,径向数据，2,风场数据
  }
  return request({
    url: '/python/api/weather/realCSV/ppi',
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
    "radar_id":query.radar_id,//''表示返回所有
    "dataTime":query.dataTime
  }
  return request({
    url: '/python/api/weather/statistics/sensor',
    method: 'post',
    headers:{
    'content-type':'application/json'
    },
    data
  })
}

export function getDbsData(query:{radar_id:string,dataTime:string}){
  let data = {
    "version":"1.0",
    "secretKey":"904c396f6956d02c59a6ad35c08f5678",
    "radar_id":query.radar_id,//''表示返回所有
    "dataTime":query.dataTime
  }
  return request({
    url: '/python/api/weather/statistics/dbs',
    method: 'post',
    headers:{
    'content-type':'application/json'
    },
    data
  })
}

// export function get10minWindAvgData(query:{radar_id:string,dataTime:string}){
//   let data = {
//     "version":"1.0",
//     "secretKey":"904c396f6956d02c59a6ad35c08f5678",
//     "radar_id":query.radar_id,//''表示返回所有
//     "dataTime":query.dataTime,
//     "dataTime_interval":60,
//   }
//   return request({
//     url: '/qt/statistics/dbs',
//     method: 'post',
//     headers:{
//     'content-type':'application/json'
//     },
//     data
//   })
// }
// get10minWindAvgData({radar_id:'',dataTime:moment().format('YYYYMMDD')}).then((res)=>{
//   console.log(res.data)//结果不符合预期
// })
