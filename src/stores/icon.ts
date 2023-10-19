// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { fetchList, saveData } from '~/api/icon'
interface Icon {
  name:string
  svg:string
  uuid:string
}
export const useIconStore = defineStore({
  id: 'icon',
  state: () => ({
    results:new Array<Icon>()
  }),
  actions: {
    FetchList(){
      fetchList().then((res:any)=>{
        this.results = res.data.results
      }).catch(()=>{
        this.$reset()
      })
    },
    saveData
  },
  persist: true,
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useIconStore, import.meta.hot))
}

