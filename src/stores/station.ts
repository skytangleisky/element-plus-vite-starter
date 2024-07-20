// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
import { 查询雷达列表接口, 查询雷达在线列表接口,查询雷达离线列表接口,查询近期新增雷达列表接口,查询雷达最新的平均风数据接口,查询瞬时风数据接口,查询雷达最新的径向风数据接口} from '../api/光恒/station'
import {useBus} from '~/myComponents/bus'
const bus = useBus()
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
    active:"",
    风雷达组网地图相关被选中的设备:'',
    人影界面被选中的设备:'',
    珠海界面被选中的设备:'',
    组网界面被选中的设备:'',
  }),
  actions: {
    查询雷达列表接口(query:any){
      return new Promise((resolve,reject)=>{
        查询雷达列表接口(query).then((res:any)=>{
          let result = res.data.data
          // this.$patch({result})
          bus.result = result
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询雷达在线列表接口(query:any){
      return new Promise((resolve,reject)=>{
        查询雷达在线列表接口(query).then((res:any)=>{
          let result = res.data.data
          // this.$patch({result})
          bus.result = result
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
          // this.$patch({result})
          bus.result = result
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
          // this.$patch({result})
          bus.result = result
          resolve(result)
        }).catch((e)=>{
          reject(e)
        })
      })
    },
    查询雷达最新的平均风数据接口(query:any){
      return new Promise((resolve,reject)=>{
        查询雷达最新的平均风数据接口(query).then((res:any)=>{
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
    查询雷达最新的径向风数据接口(query:any){
      return new Promise((resolve,reject)=>{
        查询雷达最新的径向风数据接口(query).then((res:any)=>{
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

