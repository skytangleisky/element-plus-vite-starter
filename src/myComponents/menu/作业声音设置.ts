import { checkClick, Item } from './def'
function 瓦片地图(e:Event,item:Item,k:number){
  checkClick(e,item,k)
  window.postMessage(JSON.parse(JSON.stringify({type:'自定义',from:'作业声音设置.ts',obj:item.children&&item.children[k]})))
}
const setting = JSON.parse(localStorage.getItem('setting')||'{"loadmap":true}')
export default [
  {name:'瓦片地图',onClick:瓦片地图,leftImgSrc:setting.loadmap?'checked.svg':undefined},
  {name:'语音简报',onClick:checkClick,leftImgSrc:'checked.svg'},
  {name:'声音提示',onClick:checkClick},
  {name:'静音',onClick:checkClick},
]