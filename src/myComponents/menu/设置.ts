import { checkClick as onClick, Item } from './def'
import { useSettingStore } from '~/stores/setting'
import { storeToRefs } from 'pinia'
const setting  = useSettingStore()
// const setting = JSON.parse(localStorage.getItem('setting')||'{"loadmap":true,"district":false,"navigation":false,"airline":false,"radar":false}')
export default [
  {name:'瓦片地图',onClick,leftImgSrc:storeToRefs(setting).loadmap},
  {name:'行政区划',onClick,leftImgSrc:storeToRefs(setting).district},
  {name:'导航台',onClick,leftImgSrc:storeToRefs(setting).navigation},
  {name:'航线',onClick,leftImgSrc:storeToRefs(setting).airline},
  {name:'雷达',onClick,leftImgSrc:storeToRefs(setting).radar},
]