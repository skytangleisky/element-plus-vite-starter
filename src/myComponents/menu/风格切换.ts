import { radioClick, Item } from './def'
import { toggleDark } from '~/composables'
function 暗黑(e:Event,item:Item,k:number){
  radioClick(e,item,k)
  toggleDark(true)
}
function 明亮(e:Event,item:Item,k:number){
  radioClick(e,item,k)
  toggleDark(false)
}
export default [
  {name:'暗黑',onClick:暗黑,leftImgSrc:'/src/assets/checked.svg'},
  {},
  {name:'明亮',onClick:明亮},
]