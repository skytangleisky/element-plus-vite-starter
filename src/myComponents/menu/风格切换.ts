import { radioClick, Item } from './def'
function 暗黑(e:Event,item:Item,k:number){
  radioClick(e,item,k)
  $('html').addClass('dark')
}
function 明亮(e:Event,item:Item,k:number){
  radioClick(e,item,k)
  $('html').removeClass('dark')
}
export default [
  {name:'暗黑',onClick:暗黑,leftImgSrc:'/src/assets/checked.svg'},
  {name:'明亮',onClick:明亮},
]