<template>
  <ol class="menus flex items-center content-center flex-row"><!--导航栏-->
    <li tabindex="-1" v-for="(item,index) in list" :key="index">
      {{ item.name }}
      <ol class="absolute flex-col p-0 left-0 top-100%" v-if="item.children"><!--一级菜单-->
        <submenu :list="item.children"></submenu>
      </ol>
    </li>
  </ol>
</template>
<script lang="ts" setup>
  import submenu from './menu.vue'
  interface Item{
    name:String;
    children?:Array<Item>;
  }
  type Props = {
    list?: Item[]
  }
  withDefaults(defineProps<Props>(), {
    list: () => [
      {name:'系统',children:[
        {name:'系统日志查询'},
        {name:'作业声音设置',left:true,children:[
          {name:'语音简报'},
          {name:'声音提示'},
          {name:'静音'},
        ]},
        {name:'风格切换',children:[
          {name:'蓝色'},
          {name:'白色'},
          {name:'亮蓝'},
        ]},
        {name:'关于'},
      ]},
      {name:'飞行作业',children:[
        {name:'飞行器注册信息'},
        {name:'适应性参数设置'},
        {name:'空域数据维护'},
        {name:'电台通信',children:[
          {name:'电台文本'},
          {name:'电台语音'},
        ]},
        {name:'航迹过滤设置'},
        {name:'航迹颜色设置'},
        {name:'数据回放',children:[
          {name:'打开回放进程'},
          {name:'人影历史航迹查看'},
        ]},
      ]},
      {name:'飞行计划',children:[
        {name:'飞行任务规划'},
        {name:'机场管理'},
        {name:'人影飞机管理'},
        {name:'机型管理'},
        {name:'航路点管理'},
      ]},
      {name:'辅助管理',children:[
        {name:'图层管理',children:[
          {name:'图层显示管理'},
          {name:'临时图层显示管理'},
          {name:'临时图层编辑'},
          {name:'常用点管理'},
        ]},
        {name:'绘图工具'},
        {name:'综合空情显示设置'},
        {name:'人影态势展示窗口'},
      ]},
      {name:'地面作业',children:[
        {name:'人影本地设置'},
        {name:'人影单位设置'},
        {name:'人影作业点设置'},
        {name:'人影网络状态查看'},
        {name:'人影完成信息查询'},
        {name:'人影作业查询',children:[
          {name:'人影作业历史查询'},
          {name:'人影文本记录查询'},
          {name:'人影操作历史查询'},
          {name:'人影操作历史统计'},
        ]},
        {name:'作业通报自动移除'},
        {name:'通报自动移除时间',children:[
          {name:'60秒'},
          {name:'120秒'},
          {name:'300秒'},
        ]},
        {name:'作业点显示设置'},
      ]},
      {name:'弹药管理',children:[
        {name:'入库历史'},
        {name:'出库历史'},
        {name:'装备概况'},
        {name:'弹药设置',children:[
          {name:'装备管理'},
          {name:'弹药注册'},
          {name:'厂商设置'},
          {name:'仓库查看'},
          {name:'型号设置',children:[
            {name:'装备型号设置'},
            {name:'弹药型号设置'},
          ]},
          {name:'车辆管理'},
          {name:'年度采购计划'},
          {name:'人工校准'},
          {name:'国家局',children:[
            {name:'国家局模拟'},
            {name:'国家局历史数据'},
          ]},
        ]},
        {name:'弹药详情'},
        {name:'弹药查询统计',children:[
          {name:'弹药批次查询'},
          {name:'弹药日志记录'},
          {name:'单个弹药索引'},
          {name:'弹药统计'},
          {name:'清点历史'},
          {name:'日志校正'},
        ]},
      ]},
      {name:'人员管理',children:[
        {name:'用户管理'},
        {name:'人员登记'},
      ]},
      {name:'烟炉管理',children:[
        {name:'烟炉总览'},
        {name:'烟炉控制平台'},
      ]},
      {name:'地面闪电',children:[
        {name:'地闪数据目录',children:[
          {name:'E:/2019'},
          {name:'切换目录'},
        ]},
        {name:'图层可见'},
        {name:'保留时间',children:[
          {name:'5分钟'},
          {name:'10分钟'},
        ]},
        {name:'历史查询'},
      ]},
      {name:'聊天',children:[
        {name:"单位协商"},
        {name:"用户聊天室"},
      ]},
      {name:'天气雷达',children:[
        {name:"天气雷达组网路径设置"},
      ]},
    ]
  })
</script>
<script lang="ts">
  export default{
    name: 'menus'
  }
</script>
<style lang="scss">
  ol{
    user-select: none;
    list-style: none;
    position: relative;
    display: none;
    background-color: rgb(42, 42, 40);
    li{
      position: relative;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      padding: 0 4px 0 4px;
      cursor:default;
    }
    &:focus-within li:hover>ol{
      display: flex;
    }
  }
  .menus{
    background-color: transparent;
    &>li:hover{
      background-color: rgb(53, 54, 51);
      border-radius: 4px;
      li{
        align-items: center;
        justify-content: space-between;
        &:hover{
          background-color: rgb(62, 110, 197);
          border-radius: 4px;
        }
        &:has(ol:hover){
          background-color: rgb(64, 64, 62);
        }
      }
    }
    li>ol{
      border:1px solid #fff;
      border-style:inset;
      border-radius: 4px;
      padding: 4px;
    }
    &>li{
      padding:0 8px 0 8px;
    }
  }
</style>