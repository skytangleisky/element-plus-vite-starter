// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
import { fetchList, saveData,deleteData } from '~/api/icon'
interface Icon {
  name:string
  svg:string
  uuid:string
}
interface Item {
  id:number
  uuid:string
  datetime_create:string
  datetime_update:string
  icon_tree:Array<Icon>
  status:string
  remark:string
  role:string
}
export const useIconStore = defineStore({
  id: 'icon',
  state: () => ({
    row:{id:0,uuid:'',datetime_create:'',datetime_update:'',icon_tree:new Array<Icon>(),status:'',remark:'',role:''},
  }),
  actions: {
    FetchList(){
      fetchList().then((res:any)=>{
        let result = res.data.results[0]
        this.row.id = result.id
        this.row.uuid = result.uuid
        this.row.datetime_create = result.datetime_create
        this.row.datetime_update = result.datetime_update
        this.row.icon_tree = JSON.parse(result.icon_tree)
        this.row.remark = result.remark
        this.row.role = result.role
      }).catch(()=>{
        this.$reset()
      })
    },
    saveData,
    deleteData,
  },
  persist: true,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIconStore, import.meta.hot))
}

