import 系统 from './系统'
import 飞行作业 from './飞行作业'
import 飞行计划 from './飞行计划'
import 辅助管理 from './辅助管理'
import 地面作业 from './地面作业'
import 弹药管理 from './弹药管理'
import 人员管理 from './人员管理'
import 烟炉管理 from './烟炉管理'
import 地面闪电 from './地面闪电'
import 聊天 from './聊天'
import 天气雷达 from './天气雷达'
export default [
  {name:'系统',left:false,right:true,children:系统},
  {name:'飞行作业',right:true,children:飞行作业},
  {name:'飞行计划',children:飞行计划},
  {name:'辅助管理',right:true,children:辅助管理},
  {name:'地面作业',left:true,right:true,children:地面作业},
  {name:'弹药管理',right:true,children:弹药管理},
  {name:'人员管理',children:人员管理},
  {name:'烟炉管理',children:烟炉管理},
  {name:'地面闪电',left:true,right:true,children:地面闪电},
  {name:'聊天',children:聊天},
  {name:'天气雷达',children:天气雷达},
]