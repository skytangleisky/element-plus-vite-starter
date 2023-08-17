// import "~/styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
// import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`
// import locale from './languages/zh-cn.mjs'

import "~/styles/index.scss";
import 'uno.css'
// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss"
import app from './app'
// app.use(ElementPlus, { locale });
import router from './router'
app.use(router)
import './permission'
localStorage.setItem('z-index','1')
import dragable from './directive/dialogDrag'
app.directive('dialogDrag',dragable)
app.mount("#app")