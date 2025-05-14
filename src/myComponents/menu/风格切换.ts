import {Item} from './def'
import { useTheme,isDark } from "~/theme"
const theme = useTheme()
import {computed} from 'vue'
function 暗黑(e:Event,item:Item,k:number){
  theme.value = 'dark'
}
function 明亮(e:Event,item:Item,k:number){
  theme.value = 'light'
}
export default [
  {name:'暗黑',onClick:暗黑,leftImgSrc:isDark.value},
  {},
  {name:'明亮',onClick:明亮,leftImgSrc:computed(()=>!isDark.value)},
]