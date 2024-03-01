import { useUserStore } from '../stores/user';
function checkPermission(el, { value }) {
  const user = useUserStore()
  if (value && Array.isArray(value) && value.length > 0) {
    if (!user.roles.some((permission) => {
      return value.includes(permission)
    })){
      el.style.display='none'
    }else{
      el.style.display=''
    }
  } else {
    el.style.display='none'
    throw new Error(`请设置操作权限标签值`)
  }
}
export default {
  created(el, binding, vnode, prevVnode) {
    // console.log('created')
  },
  beforeMount(el, binding, vnode, prevVnode) {
    // console.log('beforeMount')
  },
  mounted(el, binding, vnode, prevVnode) {
    // console.log('mounted')
    checkPermission(el, binding)
  },
  beforeUpdate(el, binding, vnode, prevVnode) {
    // console.log('beforeUpdate')
  },
  updated(el, binding, vnode, prevVnode) {
    checkPermission(el,binding)
    // console.log('updated')
  },
  beforeUnmount(el, binding, vnode, prevVnode) {
    // console.log('beforeUnmount')
  },
  unmounted(el, binding, vnode, prevVnode) {
    // console.log('unmounted')
  }
}