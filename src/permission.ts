import router from '~/router'
import NProgress from 'nprogress'
import { useUserStore } from './stores/user'
import "nprogress/nprogress.css"
import "./styles/nprogress.scss"
NProgress.configure({ showSpinner: false })
const whiteList=['/login','/qqlogin','/register','/404','/401', '/openlayers','/mapbox','/calibration']
router.beforeEach((to,from,next)=>{
  NProgress.start()
  document.title = to.meta.label as string
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
  const user = useUserStore()
  if(router.currentRoute.value.name){
    user.defaultActive = router.currentRoute.value.name.toString()
  }else{
    user.defaultActive = ''
  }
  NProgress.done()
})
router.onError(e=>{
  const user = useUserStore()
  if(router.currentRoute.value.name){
    user.defaultActive = router.currentRoute.value.name.toString()
  }else{
    user.defaultActive = ''
  }
})