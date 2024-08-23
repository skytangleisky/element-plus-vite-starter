import {reactive} from 'vue'
export interface Station {
  "id": 342,
  "radar_id": "ccc86388-4a1a-4439-a26a-17d866a5f67b",
  "sn_code": "HW24050020187",
  "pull_url": "",
  "is_online": false,
  "data_status": false,
  "name": "HW24050020187",
  "longitude": null,
  "latitude": null,
  "ent": {
      "ent_id": "e8acd033-4667-4553-95f7-cb2751867262",
      "name": "光恒标定场",
      "uscc": "91440400MA4WAGEK48",
      "contacts": "梁健琳",
      "phone_number": "18669004621"
  },
  "type": {
      "type_id": "de29de93-ae2a-4a9c-a838-bee2431b9f43",
      "name": "linux-机舱"|"塔式"
  },
  "status": {
    "data_time": "2024-08-15 18:49:00",
    "model": "HJ2-200",
    "sn_code": "HS24030010063",
    "control_plate_status": true,
    "internal_status": false,
    "internal_temperature": 38,
    "internal_humidity": 0,
    "lens_temperature": 0,
    "external_status": false,
    "external_temperature": 0,
    "external_humidity": 0,
    "edfa_status": true,
    "laser_temperature": 0,
    "laser_power": 601.2,
    "grabber_status": true,
    "grabber_temperature": 57,
    "compass_status": true,
    "north_angle": 305,
    "heel_angle": -0.25,
    "trim_angle": 11.6,
    "gps_status": true,
    "longitude": 113.483666,
    "latitude": 22.302415,
    "cpu_temperature": 76,
    "disk_capacity": 209,
    "local_wind_speed": 0,
    "local_wind_direction": 0,
    "local_temperature": 0,
    "local_humidity": 0,
    "local_atmos": 0,
    "sensor_wind_speed": -1000,
    "sensor_wind_direction": -1000,
    "atmos": -1000,
    "battery_level": -1000,
    "battery_voltage": -1000,
    "battery_temperature": -1000,
    "controller_temperature": -1000,
    "load_voltage": -1000,
    "load_current": -1000,
    "load_power": -1000,
    "solar_panel_voltage": -1000,
    "solar_panel_current": -1000,
    "solar_panel_power": -1000,
    "firmware_version": "1400"
  }
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
const obj = reactive({
  avgWindData_重庆:{},
  avgWindData:new Array<Wind>(),
  avgWindDataLatest:new Array<Wind>(),
  secondWindData:new Array<Wind>(),
  radialWindData:Array<Wind>(),
  result:new Array<Station>(),
  风雷达组网地图相关雷达站点信息:new Array<{
    id:number,
    uuid:string,
    no:string,
    device_name:string,
    device_type:string,
    device_no:string,
    device_model:string,
    address:string,
    manufacturer:string,
    lng:string,
    lat:string,
    altitude:number,
    height:number,
    data_path:string,
    color:string,
    status:string,
    speed:number,
    hide:string,
    orientation:string,
    createtime:string,
    updatetime:string
  }>(),
  wsData:new Object(),
  uavData:new Object(),
  uavOffline:new Object(),
  listData:new Object(),
})
export const useBus = () => {
  return obj
}
const exclude = reactive(new Array<any>());
export const useExclude = () => {
  return exclude
}