// @ts-check
import { defineStore, acceptHMRUpdate } from 'pinia'
import { login, getInfo,logout } from '../api/login.js'

/**
 * Simulate a login
 */
function apiLogin(a: string, p: string) {
  if (a === 'ed' && p === 'ed') return Promise.resolve({ isAdmin: true })
  if (p === 'ed') return Promise.resolve({ isAdmin: false })
  return Promise.reject(new Error('invalid credentials'))
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    username: '游客',
    isAdmin: true,
    token: '',
    avatar: '',
    logined: false,
  }),

  actions: {
    logout() {
      this.$patch({
        username: '游客',
        isAdmin: false,
        avatar: '',
        logined: false,
      })
      // we could do other stuff like redirecting the user
    },
    info(){
      getInfo().then(infoRes=>{
        this.$patch({
          logined: true,
          ...infoRes.data,
        })
      }).catch(()=>{
        this.$patch({username:'游客',avatar:'',logined:false})
      })
    },
    Login(data) {
      // const res = await login({username:'admin',password:'admin'})
      login(data).then(loginRes=>{
        console.log(loginRes)
        if(loginRes.code===20000){
          this.info()
        }else{
          this.$reset()
        }
      }).catch(()=>{
        this.$patch({username:'游客',avatar:'',logined:false})
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
