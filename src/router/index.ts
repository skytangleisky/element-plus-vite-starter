import { createRouter, createWebHistory } from 'vue-router'
import container from '../container.vue'
import qqLogin from '../qqlogin.vue'
export const constantRoutes = [{
  path: '/',
  component: container
},{
  path: '/qqlogin',
  component: qqLogin
}]
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})
export default router