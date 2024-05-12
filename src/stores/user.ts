// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
import { login, getInfo,logout } from '../api/login.js'
import zhCn from '../languages/zh-cn.js'
import en from '../languages/en.js'
import { useSettingStore } from "./setting.js"

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    lang: 'zh-cn',
    username: '',
    isAdmin: true,
    token: '',
    avatar: '',
    logined: false,
    roles:new Array<string>(),
    defaultActive: 'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
    defaultOpends:['65e99b66-e340-4d4b-6b26-629f41dc63d9'],
  }),

  actions: {
    logout() {
      this.$reset()
      // we could do other stuff like redirecting the user
    },
    info(){
      return new Promise((resolve,reject)=>{
        getInfo().then((infoRes:any)=>{
          //当权限不一致时，需要重置路由
          if(JSON.stringify(infoRes.data.data.roles)!==JSON.stringify(this.roles)){
            const setting = useSettingStore()
            setting.$resetFields('routes')
          }
          this.$patch({
            logined: true,
            ...infoRes.data.data,
          })
          resolve(infoRes)
        }).catch(e=>{
          this.$reset()
          reject(e)
        })
      })
    },
    Login(data:any) {
      return new Promise((resolve,reject)=>{
        login(data).then((loginRes:any)=>{
          this.info().then(res=>{
            resolve(res)
          }).catch(e=>{
            reject(e)
          })
        }).catch(e=>{
          this.$reset()
          reject(e)
        })
      })
    },
    Logout(){
      return new Promise((resolve,reject)=>{
        logout().then(res=>{
          resolve(res)
        }).catch(e=>{
          reject(e)
        })
      })
    }
  },
  getters:{
    locale: state => {
      if(state.lang==='en'){
        return en
      }
      return zhCn
    }
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
