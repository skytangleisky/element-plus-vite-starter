import router from '~/router'
import NProgress from 'nprogress'
import { useUserStore } from './stores/user'
import "nprogress/nprogress.css"
NProgress.configure({ showSpinner: false })
const whiteList=['/login','/404','/401']
router.beforeEach((to,from,next)=>{
  NProgress.start()
  // document.title = xxx
  const user = useUserStore()
  if(whiteList.indexOf(to.path)>=0){
    next()
  }else{
    if(user.logined){
      next()
    }else{
      next('/login')
    }
  }
})

router.afterEach((to,from)=>{
  NProgress.done()
})