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

import pinia from "./stores"
app.use(pinia)
// app.use(ElementPlus, { locale });
import router from './router'
app.use(router)
import { gsap, Power0, Power1, Power2, Power3, Power4 } from 'gsap'
import './permission.ts'
app.directive('dialogDrag',{
  beforeMount(el, binding, vnode, oldVnode) {
    let obj:any
    const mousemoveFunc = (event:any) => {
      var ev = event || window.event
      posl = { x: ev.clientX, y: ev.clientY }
      var x = posl.x - pos.x; var y = posl.y - pos.y
      pos = JSON.parse(JSON.stringify(posl))
      obj.targetLeft += x
      obj.targetTop += y
      obj.targetRight -= x
      obj.targetBottom -= y
      gsap.to(obj, {
        duration: 1,
        left: obj.targetLeft,
        top: obj.targetTop,
        right: obj.targetRight,
        bottom: obj.targetBottom,
        onUpdate: () => {
          if(el.style.cssText.indexOf('right:')>-1){
            el.style.right = obj.right + 'px'
          }else{
            el.style.left = obj.left + 'px'
          }
          if(el.style.cssText.indexOf('bottom:')>-1){
            el.style.bottom = obj.bottom + 'px'
          }else{
            el.style.top = obj.top + 'px'
          }
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
    var pos:any, posl:any
    window.deep = 1
    el.addEventListener('mousedown', (event:any) => {
      el.style['z-index'] = window.deep++
      var ev = event || window.event
      event.stopPropagation()
      let rect = el.getBoundingClientRect()
      let rectParent = el.parentNode.getBoundingClientRect()
      obj = { 
        targetLeft: rect.left,
        targetTop: rect.top,
        targetRight:rectParent.width - rect.right,
        targetBottom: rectParent.height - rect.bottom,
        left: rect.left,
        top: rect.top,
        right:rectParent.width - rect.right,
        bottom:rectParent.height - rect.bottom }
      pos = { x: ev.clientX, y: ev.clientY }
      document.addEventListener('mousemove', mousemoveFunc)
      document.addEventListener('mouseup', mouseupFunc)
    })
  }
})
app.mount("#app")
