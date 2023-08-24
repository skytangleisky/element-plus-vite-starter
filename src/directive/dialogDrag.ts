// localStorage.setItem('z-index','1')
import { gsap, Power0, Power1, Power2, Power3, Power4 } from 'gsap'
export default {
  beforeMount(el:any, binding:any, vnode:any, oldVnode:any) {
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
          if(el.hasAttribute('right')){
            el.style.right = obj.right + 'px'
          }else{
            el.style.left = obj.left + 'px'
          }
          if(el.hasAttribute('bottom')){
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
    el.addEventListener('mousedown', (event:any) => {
      // let z = localStorage.getItem('z-index')
      // el.style['z-index']=z
      // localStorage.setItem('z-index',(Number(z)+1).toString())
      var ev = event || window.event
      event.stopPropagation()
      let rect = el.getBoundingClientRect()
      let rectParent = el.parentNode.getBoundingClientRect()
      obj = {
        targetLeft: rect.left-rectParent.left,
        targetTop: rect.top-rectParent.top,
        left: rect.left-rectParent.left,
        top: rect.top-rectParent.top,
        targetRight:rectParent.width - rect.right+rectParent.left,
        targetBottom: rectParent.height - rect.bottom+rectParent.top,
        right:rectParent.width - rect.right+rectParent.left,
        bottom:rectParent.height - rect.bottom+rectParent.top
      }
      pos = { x: ev.clientX, y: ev.clientY }
      document.addEventListener('mousemove', mousemoveFunc,{passive:true})
      document.addEventListener('mouseup', mouseupFunc,{passive:true})
    },{passive:true})
  }
}