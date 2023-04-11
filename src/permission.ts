import router from '/src/router'
const whiteList=['/login','/404','/401']
router.beforeEach(async(to)=>{
  // progressStart()
  // document.title = xxx

  return true
})

router.afterEach(()=>{
  // progressClose()
})