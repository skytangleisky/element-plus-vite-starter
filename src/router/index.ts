import { createRouter, createWebHistory } from 'vue-router'
import container from '../container.vue'
import login from '../login.vue'
export const constantRoutes = [
  {
    path: '/',
    component: container
  },
  {
    path: '/qqlogin',
    component: () => import('../qqlogin.vue') //最好是异步加载
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/pixi',
    component: () => import('../myComponents/pixi/index.vue') 
  },
  {
    path: '/deck',
    component: () => import('../myComponents/deck/index.vue')
  }
]
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})
export default router