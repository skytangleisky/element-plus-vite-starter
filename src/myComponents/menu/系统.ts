import 作业声音设置 from './作业声音设置'
import 风格切换 from './风格切换'
import 设置 from './设置'
export default [
  {name:'系统日志查询'},
  {name:'作业声音设置',left:true,children:作业声音设置},
  {name:'风格切换',left:true,children:风格切换},
  {name:'设置',left:true,children:设置},
  {name:'关于'},
]