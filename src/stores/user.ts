// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { login, getInfo,logout } from '../api/login.js'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    username: '',
    isAdmin: true,
    token: '',
    avatar: '',
    logined: false,
  }),

  actions: {
    logout() {
      this.$reset()
      // we could do other stuff like redirecting the user
    },
    info(){
      return new Promise((resolve,reject)=>{
        getInfo().then((infoRes:any)=>{
          if(infoRes.data.code===20000){
            this.$patch({
              logined: true,
              ...infoRes.data.data,
            })
          }else{
            console.log(infoRes)
            this.$reset()
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired; 60204: Error;
          }
          resolve(infoRes)
        }).catch(e=>{
          this.$reset()
          reject(e)
        })
      })
    },
    Login(data:any) {
      return new Promise((resolve,reject)=>{
        // const res = await login({username:'admin',password:'admin'})
        login(data).then((loginRes:any)=>{
          if(loginRes.data.code===20000){
            this.info().then(res=>{
              resolve(res)
            }).catch(e=>{
              reject(e)
            })
          }else{
            resolve(loginRes)
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired; 60204: Error;
            this.$reset()
          }
        }).catch(e=>{
          this.$reset()
          reject(e)
        })
        // const userData = await apiLogin(user, password)
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
