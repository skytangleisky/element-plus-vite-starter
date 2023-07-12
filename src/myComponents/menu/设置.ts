import { checkClick, Item } from './def'
import { useSettingStore } from '~/stores/setting'
function onClick(e:Event,item:Item,k:number){
  checkClick(e,item,k)
  window.postMessage(JSON.parse(JSON.stringify({type:'自定义',from:'作业声音设置.ts',obj:item.children&&item.children[k]})))
}
const setting  = useSettingStore()
// const setting = JSON.parse(localStorage.getItem('setting')||'{"loadmap":true,"district":false,"navigation":false,"airline":false,"radar":false}')
export default [
  {name:'瓦片地图',onClick:onClick,leftImgSrc:setting.loadmap?'checked.svg':undefined},
  {name:'行政区划',onClick:onClick,leftImgSrc:setting.district?'checked.svg':undefined},
  {name:'导航台',onClick:onClick,leftImgSrc:setting.navigation?'checked.svg':undefined},
  {name:'航线',onClick:onClick,leftImgSrc:setting.airline?'checked.svg':undefined},
  {name:'雷达',onClick:onClick,leftImgSrc:setting.radar?'checked.svg':undefined},
]