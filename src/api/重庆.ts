import request from '../utils/request'
import moment from 'moment';
// export const databaseRaw = 'host=127.0.0.1&port=3306&user=root&password=tanglei&database=weatherservice';
// export const databaseRaw = 'host=tanglei.top&port=3306&user=root&password=tanglei&database=union';
export const databaseRaw = 'host=192.168.0.240&port=3306&user=root&password=mysql&database=weatherservice';
// export const databaseRaw = 'host=127.0.0.1&port=3306&user=admin&password=EkWM76Z8IJbfviCr&database=weatherservice';


export const databaseRaw2 = 'host=192.168.0.240&port=3306&user=root&password=mysql&database=shanxi_weatherservice';

export function getDataList(query:{radar_id:string,path:string,type:string}){
  let url = '/python/api/weather/ppi/file/path';
  if(query.type=='DBS'){
    url = '/python/api/weather/avg10min/file/path'
  }
  return request({
    url: url,
    method: 'post',
    data:{
      "radar_id":query.radar_id,
      "path":query.path
    }
  })
}
export function getPPIRadial(query:{radar_id:string,data_type:number,path:string,date_time:string}){
  return request({
    url: '/python/api/weather/ppi/time_file',
    method: 'post',
    data:{
      "radar_id":query.radar_id,
      "path":query.path,
      "date_time":query.date_time,
      data_type:query.data_type
    }
  })
}

// export function getFkxHisData(query:{radar_id:string,dateTime:string}){
//   return request({
//     url: '/qt/hisCSV/dbs',
//     method: 'post',
//     data: {"version":"1.0","secretKey":"904c396f6956d02c59a6ad35c08f5678","radar_id":query.radar_id,"dataTime":query.dateTime,num:4}
//   })
// }

export function getFkxHisData(query:{radar_id:string,yearmonthdate:string}){//
  let data = {//yearmonthdate和file_name传一个参数就可以
    "radar_id": query.radar_id,
    "yearmonthdate": query.yearmonthdate,
    file_name:""
  }
  return request({
    url: '/python/api/weather/avg10min/date_file',
    method: 'post',
    headers:{
      'content-type':'application/json'
    },
    data
  })
}

// export function getFkxRealData(query:{radar_id:string,dateTime:string,num:number}){//风廓线径向数据(比较慢)-熊俊凯
//   let data = {
//     "version": "1.0",
//     "secretKey": "904c396f6956d02c59a6ad35c08f5678",
//     "radar_id": query.radar_id,
//     "dataTime": query.dateTime,
//     "level":3,
//     "num":query.num
//   }
//   return request({
//     url: '/qt/realCSV/dbs',
//     method: 'post',
//     headers:{
//       'content-type':'application/json'
//     },
//     data
//   })
// }
export function getFkxRealData(query:{radar_id:string,dateTime:string,num:number}){//风廓线径向数据-陈俊驰
  let data = {
    "radar_id": query.radar_id,
    "dataTime": query.dateTime,
    "level":3,
    "num":query.num
  }
  return request({
    url: '/python/api/weather/avg10min/latest',
    method: 'post',
    headers:{
      'content-type':'application/json'
    },
    data
  })
}

// export function getFkxData(query:{dataTime:string,altitude:number}){//熊俊凯（比较慢）
//   let data = {
//     "version": "1.0",
//     "secretKey": "904c396f6956d02c59a6ad35c08f5678",
//     "dataTime": query.dataTime,
//     "altitude": query.altitude,
//     "dataTime_interval":600,
//     "alt_interval": 50,
//     "level": 3
//   }
//   return request({
//     url: '/qt/dbsNet',
//     method: 'post',
//     headers:{
//       'content-type':'application/json'
//     },
//     data
//   })
// }
export function getFkxData(query:{dataTime:string,altitude:number}){//陈俊驰
  let data = {
    "dataTime": query.dataTime,
    "altitude": query.altitude,
    "dataTime_interval":600,
    "alt_interval": 50,
  }
  return request({
    url: '/python/api/weather/avg10min/data',
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

//获取CPU使用情况
export function getCPU(){
  return request({
    url: '/python/api/common/system/get_cpu_info',
    method: 'post',
    headers:{
    'content-type':'application/json'
    }
  })
}
export function getMEM(){
  return request({
    url: '/python/api/common/system/get_memory_info',
    method: 'post',
    headers:{
    'content-type':'application/json'
    }
  })
}
export function getDisk(){
  return request({
    url: '/python/api/common/system/get_disk_info_for_path',
    method: 'post',
    headers:{
    'content-type':'application/json'
    },
    data:{
      path:'D:/chongqing/A6418/'
    }
  })
}

export function 通过code获取子级(code:number){
  return request({
    url: 'backend/db/map_border_info?'+databaseRaw2,
    method: 'post',
    data:{
      select:['adcode','name'],
      where:[
        {
          relation:'and',
          field:'parent_adcode',
          relationship:'=',
          condition:code
        }
      ],
      order_by:[],
      limit:0,
      offset:0
    }
  })
}
export function 通过code获取雷达(code:string = ''){
  return request({
    url: 'backend/db/device?'+databaseRaw2,
    method: 'post',
    data:{
      select:['adcode','device_name','no'],
      where:[
        {
          relation:'and',
          field:'adcode',
          relationship:'=',
          condition:code
        },
        {
          relation:'and',
          field:'device_name',
          relationship:'is not',
          condition:null
        }
      ],
      order_by:[],
      limit:0,
      offset:0
    }
  })
}

export function 通过雷达ID获取传感器数据(radar_id:string){
  return request({
    url: 'backend/db/sensor?'+databaseRaw2,
    method: 'post',
    data:{
      select:['*'],
      where:[
        {
          relation:'and',
          field:'Device',
          relationship:'=',
          condition:radar_id
        }
      ],
      order_by:[],
      limit:0,
      offset:0
    }
  })
}
// 通过雷达ID获取传感器数据('A6418').then(res=>{
//   console.log(res.data)
// })

/**
 * @author yhl 2025-05-12 17:41:56
 * @description 获取雷达状态统计
 * @param adcode-行政区划
 * @param grade-级别 1：省 2：市 3：县
 * @param is_manufacturer-厂商id  0/null 统计所有
 */

export function queryRadarStatus(params:{adcode:string,grade:number,is_manufacturer:number}){
  return request({
    url:'/shanxi/api/device/statistics',
    method: 'post',
    data:{
      adcode:params.adcode || '140100',
      grade:params.grade ,
      is_manufacturer:params.is_manufacturer ,
    },
    headers:{
      'content-type':'application/json'
    },
  })
}
