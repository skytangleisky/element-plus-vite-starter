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
      getInfo().then((infoRes:any)=>{
        if(infoRes.code===20000){
          this.$patch({
            logined: true,
            ...infoRes.data,
          })
        }else{
          console.log(infoRes)
          this.$reset()
          // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired; 60204: Error;
        }
      }).catch(()=>{
        this.$reset()
      })
    },
    Login(data:any) {
      // const res = await login({username:'admin',password:'admin'})
      login(data).then((loginRes:any)=>{
        console.log(loginRes)
        if(loginRes.code===20000){
          this.info()
        }else{
          console.log(loginRes.code)
          // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired; 60204: Error;
          this.$reset()
        }
      }).catch(()=>{
        this.$reset()
      })
      // const userData = await apiLogin(user, password)
    },
    Logout(){
      logout().then(()=>{
        this.$reset()
      })
    }
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
