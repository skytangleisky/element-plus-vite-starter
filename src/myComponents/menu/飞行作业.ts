import 电台通信 from './电台通信'
import 数据回放 from './数据回放'
export default [
  {name:'飞行器注册信息'},
  {name:'适应性参数设置'},
  {name:'空域数据维护'},
  {name:'电台通信',children:电台通信},
  {name:'航迹过滤设置'},
  {name:'航迹颜色设置'},
  {name:'数据回放',children:数据回放},
]