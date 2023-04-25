import 弹药设置 from './弹药设置'
import 弹药查询统计 from './弹药查询统计'
export default [
  {name:'入库历史'},
  {name:'出库历史'},
  {name:'装备概况'},
  {name:'弹药设置',right:true,children:弹药设置},
  {name:'弹药详情'},
  {name:'弹药查询统计',children:弹药查询统计},
]