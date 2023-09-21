// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { 查询雷达列表接口, 查询雷达在线列表接口,查询雷达离线列表接口,查询近期新增雷达列表接口,查询平均风数据接口} from '../api/光恒/station'
interface Station {
  data_time:string
  is_online:boolean
  longitude:number
  latitude:number
  gps_status:null
  edfa_status:null
  edfa_temperature:null
  pumping_current_1:null
  pumping_current_2:null
  pumping_current_3:null
  compass_status:null
  heel_angle:null
  trim_angle:null
  north_angle:null
  internal_temperature:null
  external_temperature:null
  lens_temperature:null
  grabber_status:null
  software_version:null
  radar:{
    ent:{
      contacts:string
      ent_id:string
      name:string
      phone_number:string
      uscc:string
    }
    name:string
    radar_id:string
    type:{
      name:string
      type_id:string
    }
    pull_url:string
  }
}
interface Wind {
  [key:string]:Array<{
    [key:string]:Array<{
      [key:string]:{
        height:number
        layers:number
        speed:number
        direction:number
        min_speed:number
        max_speed:number
        rsd:number
        reliability:number
        temperature:number
        humidity:number
      }
    }>
  }>;
}
export const useStationStore = defineStore({
  id: 'station',
  state: () => ({
    result:new Array<Station>(),//设备信息列表
    avgWindData: new Array<Wind>(),//平均风数据
    active:-1
  }),
  actions: {
    查询雷达列表接口(){
      return new Promise((resolve,reject)=>{
        查询雷达列表接口().then((res:any)=>{
          let result = res.data.data
          this.$patch({result})
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })

        // this.result = {
        //   "code": 200,
        //   "message": "请求成功。",
        //   "data": [
        //     {
        //       "radar": {
        //         "radar_id": "5e27a52b-ad4b-46db-9fdd-256ff315c852",
        //         "ent": {
        //           "ent_id": "766b50ed-4120-4b51-a849-f03a5ae18cd9",
        //           "name": "北京威胜通达科技有限公司",
        //           "uscc": "911101086675134960",
        //           "contacts": "王可",
        //           "phone_number": "18628228677"
        //         },
        //         "name": "威胜通达02",
        //         "type": {
        //           "type_id": "f05eb84b-02f2-439e-a437-eadfbd3dfdb4",
        //           "name": "DJ-3000"
        //         },
        //         "pull_url": ""
        //       },
        //       "data_time": "2023-08-25 14:34:54",
        //       "is_online": true,
        //       "gps_status": null,
        //       "longitude": 115.17,
        //       "latitude": 38.24,
        //       "edfa_status": null,
        //       "edfa_temperature": null,
        //       "pumping_current_1": null,
        //       "pumping_current_2": null,
        //       "pumping_current_3": null,
        //       "compass_status": null,
        //       "heel_angle": null,
        //       "trim_angle": null,
        //       "north_angle": null,
        //       "internal_temperature": null,
        //       "external_temperature": null,
        //       "lens_temperature": null,
        //       "grabber_status": null,
        //       "software_version": null
        //     },
        //     {
        //       "radar": {
        //         "radar_id": "61df3c3b-7c53-481b-87b3-206707cb77d0",
        //         "ent": {
        //           "ent_id": "766b50ed-4120-4b51-a849-f03a5ae18cd9",
        //           "name": "北京威胜通达科技有限公司",
        //           "uscc": "911101086675134960",
        //           "contacts": "王可",
        //           "phone_number": "18628228677"
        //         },
        //         "name": "威胜通达01",
        //         "type": {
        //           "type_id": "a01e3a26-eb7a-4e9d-a1b2-70586d2cacc5",
        //           "name": "HJ-400"
        //         },
        //         "pull_url": ""
        //       },
        //       "data_time": "2023-08-17 16:49:11",
        //       "is_online": true,
        //       "gps_status": null,
        //       "longitude": 115.37,
        //       "latitude": 39.66,
        //       "edfa_status": null,
        //       "edfa_temperature": null,
        //       "pumping_current_1": null,
        //       "pumping_current_2": null,
        //       "pumping_current_3": null,
        //       "compass_status": null,
        //       "heel_angle": null,
        //       "trim_angle": null,
        //       "north_angle": null,
        //       "internal_temperature": null,
        //       "external_temperature": null,
        //       "lens_temperature": null,
        //       "grabber_status": null,
        //       "software_version": null
        //     }
        //   ]
        // }.data
      })
    },
    查询雷达在线列表接口(){
      return new Promise((resolve,reject)=>{
        查询雷达在线列表接口().then((res:any)=>{
          let result = res.data.data
          this.$patch({result})
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询雷达离线列表接口(){
      return new Promise((resolve,reject)=>{
        查询雷达离线列表接口().then((res:any)=>{
          let result = res.data.data
          this.$patch({result})
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询近期新增雷达列表接口(){
      return new Promise((resolve,reject)=>{
        查询近期新增雷达列表接口().then((res:any)=>{
          let result = res.data.data
          this.$patch({result})
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询平均风数据接口(){
      return new Promise((resolve,reject)=>{
        查询平均风数据接口().then((res:any)=>{
          resolve(res)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
  },
  persist: true,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStationStore, import.meta.hot))
}

