import { checkClick as onClick, Item } from './def'
import { useSettingStore } from '~/stores/setting'
import { toRefs } from 'vue'
const setting  = useSettingStore()
// const setting = JSON.parse(localStorage.getItem('setting')||'{"loadmap":true,"district":false,"navigation":false,"airline":false,"radar":false}')
export default [
  {name:'瓦片地图',onClick,leftImgSrc:toRefs(setting).loadmap},
  {name:'行政区划',onClick,leftImgSrc:toRefs(setting).district},
  {name:'导航台',onClick,leftImgSrc:toRefs(setting).navigation},
  {name:'航线',onClick,leftImgSrc:toRefs(setting).airline},
  {name:'雷达',onClick,leftImgSrc:toRefs(setting).radar},
  {name:'流场',onClick,leftImgSrc:toRefs(setting).stream},
  {name:'webgpu',onClick,leftImgSrc:toRefs(setting).webgpu},
]