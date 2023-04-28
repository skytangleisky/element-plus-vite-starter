import { radioClick, Item } from './def'
import { toggleDark, isDark } from '~/composables'
function 暗黑(e:Event,item:Item,k:number){
  radioClick(e,item,k)
  toggleDark(true)
}
function 明亮(e:Event,item:Item,k:number){
  radioClick(e,item,k)
  toggleDark(false)
}
export default [
  {name:'暗黑',onClick:暗黑,leftImgSrc:isDark.value?'/src/assets/checked.svg':undefined},
  {},
  {name:'明亮',onClick:明亮,leftImgSrc:isDark.value?undefined:'/src/assets/checked.svg'},
]