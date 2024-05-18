import { createRouter, createWebHistory } from 'vue-router'
import {array2components} from '~/tools/index'
import { useSettingStore } from '~/stores/setting'
import { useUserStore } from '~/stores/user'
const setting = useSettingStore()
const user = useUserStore()
const routes = array2components(setting.routes,user.roles)
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes
})
export default router