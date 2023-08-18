// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { fetchList } from '../api/光恒/station'
interface Station {
  radar_id:string
  name:string
  status:boolean
  longitude:number
  latitude:number
}
export const useStationStore = defineStore({
  id: 'station',
  state: () => ({
    result:new Array<Station>()
  }),
  actions: {
    FetchList(){
      // fetchList().then((res:any)=>{
      //   let result = res.data.data
      //   this.$patch({result})
      // }).catch(()=>{
      //   this.$reset()
      // })

      let res = {
        "code": 200,
        "message": "请求成功。",
        "data": [
          {
            "radar_id": "a60b3812-d062-4a32-9714-f68ff981f949",
            "ent": {
              "ent_id": "e0b8c933-fb01-46da-8812-65c55141492b",
              "name": "成都胜威通达科技有限公司",
              "uscc": "91510100399427443B",
              "contacts": "王可",
              "phone_number": "18628228677"
            },
            "name": "胜威通达01",
            "type": {
              "type_id": "a01e3a26-eb7a-4e9d-a1b2-70586d2cacc5",
              "name": "HJ-400"
            },
            "longitude": 115.5,
            "latitude": 39.56,
            "height": null,
            "pull_url": "",
            "is_online": false,
            "status": false
          },
          {
            "radar_id": "5e27a52b-ad4b-46db-9fdd-256ff315c852",
            "ent": {
              "ent_id": "766b50ed-4120-4b51-a849-f03a5ae18cd9",
              "name": "北京威胜通达科技有限公司",
              "uscc": "911101086675134960",
              "contacts": "王可",
              "phone_number": "18628228677"
            },
            "name": "威胜通达02",
            "type": {
              "type_id": "f05eb84b-02f2-439e-a437-eadfbd3dfdb4",
              "name": "DJ-3000"
            },
            "longitude": 115.37,
            "latitude": 39.64,
            "height": 0,
            "pull_url": "",
            "is_online": false,
            "status": false
          },
          {
            "radar_id": "61df3c3b-7c53-481b-87b3-206707cb77d0",
            "ent": {
              "ent_id": "766b50ed-4120-4b51-a849-f03a5ae18cd9",
              "name": "北京威胜通达科技有限公司",
              "uscc": "911101086675134960",
              "contacts": "王可",
              "phone_number": "18628228677"
            },
            "name": "威胜通达01",
            "type": {
              "type_id": "a01e3a26-eb7a-4e9d-a1b2-70586d2cacc5",
              "name": "HJ-400"
            },
            "longitude": 115.37,
            "latitude": 39.66,
            "height": 0,
            "pull_url": "",
            "is_online": false,
            "status": false
          }
        ]
      }
      this.result = res.data
    }
  },
  persist: false,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStationStore, import.meta.hot))
}

