import { checkClick } from './def'
import 地闪数据目录 from './地闪数据目录'
import 保留时间 from './保留时间'

export default [
  {name:'地闪数据目录',children:地闪数据目录},
  {name:'图层可见',onClick:checkClick,leftImgSrc:'/src/assets/checked.svg'},
  {name:'保留时间',left:true,children:保留时间},
  {name:'历史查询'},
]