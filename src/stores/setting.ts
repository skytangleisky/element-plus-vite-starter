import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'
import zhCn from '../languages/zh-cn.mjs'
import en from '../languages/en.mjs'

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    lang: 'zh-cn',
    loadmap:true,
    district:false,
    airline:false,
    navigation:false,
  }),
  getters:{
    locale: state => {
      if(state.lang==='en'){
        return en
      }
      return zhCn
    }
  },
  actions: {
    changeLanguage(lang: string) {
      console.log(lang)
      this.$patch({
        lang
      })
    },
    setloadMap(bool:boolean){
      this.$patch({
        loadmap:bool
      })
    }
  },
  persist: true
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
