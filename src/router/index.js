import { createRouter, createWebHistory } from 'vue-router'
import {array2components} from '~/tools/index'
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
const routes = array2components(setting.routes)
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes
})
export default router