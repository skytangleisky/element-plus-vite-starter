// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { fetchList, fetchData, saveData, deleteData } from '../api/data.js'

export const useDataStore = defineStore({
  id: 'data',
  state: () => ({
    result:{
      total:0
    },
    page_size:6,
    current_page:1,
  }),
  actions: {
    FetchList(query:any){
      fetchList(query).then((result:any)=>{
        console.log(result)
        this.$patch({result:result.data})
      }).catch(()=>{
        this.$reset()
      })
    }
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
}

