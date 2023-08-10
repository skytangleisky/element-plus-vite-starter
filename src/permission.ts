import router from '~/router'
import NProgress from 'nprogress'
import { useUserStore } from './stores/user'
import "nprogress/nprogress.css"
NProgress.configure({ showSpinner: false })
const whiteList=['/login','/qqlogin','/register','/404','/401']
router.beforeEach((to,from,next)=>{
  NProgress.start()
  // document.title = 'abcdef'
  const user = useUserStore()
  if(user.logined){
    if(to.path === '/login'||to.path === '/register'){
      next({path: '/',replace:true})
    }else{
      next()
    }
  }else{
    if(whiteList.includes(to.path)){
      next()
    }else{
      next({path:'/login',replace:true})
    }
  }
})
router.afterEach((to,from)=>{
  NProgress.done()
})