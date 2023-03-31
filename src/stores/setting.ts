import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'
import zhCn from '../languages/zh-cn.mjs'
import en from '../languages/en.mjs'

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    locale: zhCn,
  }),
  actions: {
    changeLanguage(lang: {}) {
      this.$patch({
        locale:lang
      })
    }
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
