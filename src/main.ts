// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`
// import locale from './languages/zh-cn.mjs'

import "~/styles/index.scss";
import '~/composables';//初始化主题，默认自动主题
import 'uno.css'
// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss"
import "element-plus/theme-chalk/src/message-box.scss"
import app from './app'
// app.use(ElementPlus, { locale });
import router from './router'
import dragable from './directive/dialogDrag'
import resize from './directive/resize'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import permissionDirective from './directive/permission'
app.use(router)
import './permission'
app.directive('dialogDrag',dragable)
app.directive('resize',resize)
app.directive('permission',permissionDirective)
app.use(VueDOMPurifyHTML)
router.isReady().then(()=>app.mount("#app"))