import {Item} from './def'
import { toggleDark, isDark } from '~/composables'
import {computed} from 'vue'
function 暗黑(e:Event,item:Item,k:number){
  toggleDark(true)
}
function 明亮(e:Event,item:Item,k:number){
  toggleDark(false)
}
export default [
  {name:'暗黑',onClick:暗黑,leftImgSrc:isDark},
  {},
  {name:'明亮',onClick:明亮,leftImgSrc:computed(()=>!isDark.value)},
]