import { createRouter, createWebHistory } from 'vue-router'
import container from '../container.vue'
const modules = import.meta.glob('~/**/*.vue')
export const constantRoutes = [
  {
    path: '/',
    component: container,
    redirect:   () => {
      return { path: '/map' }
    },
    children:[
      {
        path:'map',
        component:modules['/src/myComponents/menu/index.vue'],
      }
    ]
  },
  {
    path: '/qqlogin',
    component: modules['/src/qqlogin.vue'] //最好是异步加载
  },
  {
    path: '/login',
    component: modules['/src/login.vue']
  },
  {
    path: '/pixi',
    component: modules['/src/myComponents/pixi/index.vue']
  },
  {
    path: '/deck',
    component: modules['/src/myComponents/deck/index.vu']
  },
  {
    path: '/openlayers',
    component:modules['/src/myComponents/menu/index.vue']
  }
]
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})
export default router