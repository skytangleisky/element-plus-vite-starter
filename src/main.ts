import { createApp } from "vue";
import App from "./App.vue";

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

const app = createApp(App);
// app.use(ElementPlus, { locale });
import router from './router'
import './permission.ts'
app.use(router)
import pinia from "./stores"
import { gsap, Power0, Power1, Power2, Power3, Power4 } from 'gsap'
app.use(pinia)
app.directive('dialogDrag',{
  beforeMount(el, binding, vnode, oldVnode) {
    let obj
    const mousemoveFunc = event => {
      var ev = event || window.event
      posl = { x: ev.clientX, y: ev.clientY }
      var x = posl.x - pos.x; var y = posl.y - pos.y
      pos = JSON.parse(JSON.stringify(posl))
      obj.targetLeft += x
      obj.targetTop += y
      gsap.to(obj, {
        duration: 1,
        left: obj.targetLeft,
        top: obj.targetTop,
        onUpdate: () => {
          el.style.left = obj.left + 'px'
          el.style.top = obj.top + 'px'
        },
        ease: Power4.easeOut
      })
      el.style.cursor = 'move'
    }
    const mouseupFunc = function() {
      document.removeEventListener('mousemove', mousemoveFunc)
      document.removeEventListener('mouseup', mouseupFunc)
      el.style.cursor = 'default'
    }
    var pos, posl
    window.deep = 1
    el.addEventListener('mousedown', event => {
      el.style['z-index'] = window.deep++
      var ev = event || window.event
      event.stopPropagation()
      obj = { targetLeft: el.offsetLeft, targetTop: el.offsetTop, left: el.offsetLeft, top: el.offsetTop }
      pos = { x: ev.clientX, y: ev.clientY }
      document.addEventListener('mousemove', mousemoveFunc)
      document.addEventListener('mouseup', mouseupFunc)
    })
  }
})
app.mount("#app")
