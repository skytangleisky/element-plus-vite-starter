import 型号设置 from './型号设置'
import 国家局 from './国家局'
export default [
  {name:'装备管理'},
  {name:'弹药注册'},
  {name:'厂商设置'},
  {name:'仓库查看'},
  {name:'型号设置',children:型号设置},
  {name:'车辆管理'},
  {name:'年度采购计划'},
  {name:'人工校准'},
  {name:'国家局',children:国家局},
]