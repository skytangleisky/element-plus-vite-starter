import { checkClick } from './def'
import 人影作业查询 from './人影作业查询'
import 通报自动移除时间 from './通报自动移除时间'
export default [
  {name:'人影本地设置'},
  {name:'人影单位设置'},
  {name:'人影作业点设置'},
  {name:'人影网络状态查看'},
  {name:'人影完成信息查询'},
  {name:'人影作业查询',children:人影作业查询},
  {name:'作业通报自动移除',onClick:checkClick,leftImgSrc:'checked.svg'},
  {name:'通报自动移除时间',left:true,children:通报自动移除时间},
  {name:'作业点显示设置'},
]