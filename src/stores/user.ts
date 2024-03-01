// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
import { login, getInfo,logout } from '../api/login.js'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    username: '',
    isAdmin: true,
    token: '',
    avatar: '',
    logined: false,
    roles:[]
  }),

  actions: {
    logout() {
      this.$reset()
      // we could do other stuff like redirecting the user
    },
    info(){
      return new Promise((resolve,reject)=>{
        getInfo().then((infoRes:any)=>{
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
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
