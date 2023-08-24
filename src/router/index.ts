import { createRouter, createWebHistory } from 'vue-router'
const modules = import.meta.glob('~/**/*.vue')
export const constantRoutes = [
  {
    path: '/',
    component: modules['/src/container.vue'],
    redirect: { path: '/map' },
    children:[
      {
        path:'map',
        component:modules['/src/myComponents/menu/index.vue'],
      },
      {
        path:'edit',
        component:modules['/src/myComponents/leftMenu/edit.vue']
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
    // component:modules['/src/myComponents/openlayers/radarStatistic.vue']
    // component:modules['/src/myComponents/menu/index.vue']
    component:modules['/src/myComponents/openlayers/index.vue']
  }
]
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})
export default router