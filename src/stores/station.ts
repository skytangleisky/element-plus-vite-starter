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
      fetchList().then((res:any)=>{
        let result = res.data.data
        this.$patch({result})
      }).catch(()=>{
        this.$reset()
      })
    }
  },
  persist: false,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStationStore, import.meta.hot))
}

