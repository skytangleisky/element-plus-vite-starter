// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
import { 查询雷达列表接口, 查询雷达在线列表接口,查询雷达离线列表接口,查询近期新增雷达列表接口,查询平均风数据接口,查询瞬时风数据接口,查询径向风数据接口} from '../api/光恒/station'
interface Station {
  "radar": {
    "radar_id": "c5f8c28e-1a3d-4dca-93ef-25fe76ee8b6b",
    "ent": {
      "ent_id": "4132d673-57e4-4d75-a7fb-dd34535dc0fa",
      "name": "珠海光恒科技有限公司",
      "uscc": "91440400MA4WAGEK48",
      "contacts": "张三",
      "phone_number": "13688888888"
    },
    "name": "HS23090001007",
    "type": {
      "type_id": "93a75713-e05e-4871-a874-8738318bfbfc",
      "name": "机舱"
    },
    "sn_code": "HS23090001007",
    "pull_url": "",
    "is_online": true,
    "data_status": true
  },
  "data_time": "2023-11-24 11:29:57",
  "model": "",
  "sn_code": "",
  "control_plate_status": true,
  "internal_status": true,
  "internal_temperature": 24.4,
  "internal_humidity": 57.5,
  "lens_temperature": 0,
  "external_status": false,
  "external_temperature": 26.8,
  "external_humidity": 0,
  "edfa_status": true,
  "laser_temperature": 38,
  "laser_power": 727.27,
  "grabber_status": true,
  "grabber_temperature": 39,
  "compass_status": true,
  "north_angle": 46.3,
  "heel_angle": -0.6,
  "trim_angle": -0.7,
  "gps_status": false,
  "longitude": 0,
  "latitude": 0,
  "cpu_temperature": 0,
  "disk_capacity": 210.68
}
interface Wind {
  [key:string]:Array<{
    [key:string]:Array<{
      [key:string]:{
        distance:number
        layers:number
        center_h_speed:number
        center_h_direction_abs:number
        vert_airflow:number
        ex_temp:number
        ex_hum:number
      }
    }>
  }>;
}
export const useStationStore = defineStore({
  id: 'station',
  state: () => ({
    result:new Array<Station>(),//设备信息列表
    avgWindData: new Array<Wind>(),//平均风数据
    secondWindData: new Array<Wind>(),//平均风数据
    radialWindData: new Array(),
    active:-1
  }),
  actions: {
    查询雷达列表接口(query:any){
      return new Promise((resolve,reject)=>{
        查询雷达列表接口(query).then((res:any)=>{
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
    查询雷达在线列表接口(query:any){
      return new Promise((resolve,reject)=>{
        查询雷达在线列表接口(query).then((res:any)=>{
          let result = res.data.data
          this.$patch({result})
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询雷达离线列表接口(query:any){
      return new Promise((resolve,reject)=>{
        查询雷达离线列表接口(query).then((res:any)=>{
          let result = res.data.data
          this.$patch({result})
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询近期新增雷达列表接口(query:any){
      return new Promise((resolve,reject)=>{
        查询近期新增雷达列表接口(query).then((res:any)=>{
          let result = res.data.data
          this.$patch({result})
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询平均风数据接口(query:any){
      return new Promise((resolve,reject)=>{
        查询平均风数据接口(query).then((res:any)=>{
          resolve(res)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询瞬时风数据接口(query:any){
      return new Promise((resolve,reject)=>{
        查询瞬时风数据接口(query).then((res:any)=>{
          resolve(res)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询径向风数据接口(query:any){
      return new Promise((resolve,reject)=>{
        查询径向风数据接口(query).then((res:any)=>{
          resolve(res)
        }).catch((e)=>{
          reject(e)
        })
      })
    }
  },
  persist: true,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStationStore, import.meta.hot))
}

