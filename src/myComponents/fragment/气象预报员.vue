<template>
  <map-box></map-box>
</template>
<script setup lang="ts">
import MapBox from '../风雷达组网地图相关/index.vue'
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
setting.permissions = [{
  name:'16d44138-0721-49cf-8f32-49c6894512bd',
  meta:{
    label:'山西测风雷达组网系统'
  },
  children:[
    {
      name:'943642f4-42e6-467a-a561-de178ebf22dd',
      meta:{
        label:'权限配置'
      },
      children:[
        {
          name: 'be8f429f-32c6-3755-72de-49911acfbf27',
          checked:false,
          meta:{
            label: '雷达状态分布',
          }
        },
        {
          name: 'e75b5831-04f8-4504-844e-9ff4857b15c0',
          checked:false,
          meta:{
            label: '各厂商雷达状态',
          }
        },
        {
          name: 'e75b5833-04f8-4504-844e-9ff4857b15c0',
          checked:true,
          meta:{
            label: '雷达设备',
          }
        },
        {
          name: 'e2c7295c-4e04-45ce-a58e-3e547ba25b25',
          checked:true,
          meta:{
            label: '组网产品',
          }
        },
        {
          name: '1b186065-deea-409f-8e78-fb32d50b3df0',
          checked:true,
          meta:{
            label: 'PPI',
          }
        },
        {
          name: 'e9b2ee62-7cb2-4dc3-99a0-f422b704fdb7',
          checked:true,
          meta:{
            label: '图层管理',
          }
        },
        {
          name: 'c4f37908-bd83-46ff-a712-0d93eec212a0',
          checked:true,
          meta:{
            label: '风廓线图表',
          }
        },
        {
          name: '36b3e515-351e-4d19-bc53-9c885e59dfa9',
          checked:true,
          meta:{
            label: '过滤器',
          }
        },
        {
          name: '4e98b05a-d317-45d1-b3e5-b12dacabc7e8',
          checked:true,
          meta:{
            label: '图例',
          }
        },
        {
          name: '41caf125-b812-477c-8719-61b96c473488',
          checked:false,
          meta:{
            label: '雷达基础信息',
          }
        },

        {
          name: 'e44f37e1-f642-4aaf-83ca-052313b217f5',
          checked:true,
          meta:{
            label: '山西组网-timestep',
          }
        },
        {
          name: 'e44f37e1-f642-4dbf-83ca-052313b217f5',
          checked:false,
          meta:{
            label: '山西组网-timeline',
          }
        },
        {
          name: '5dd862f4-112f-46cf-a843-98c3f5aba1cf',
          checked:false,
          meta:{
            label: '重庆组网界面-组网产品-格点',
          }
        },
        {
          name: '5dd862f4-112f-46cf-a843-11c3f5aba1cf',
          checked:false,
          meta:{
            label: '重庆组网界面-组网产品-风场',
          }
        },
        {
          name: 'df127f84-1983-42c1-b718-a0d04fc92720',
          checked:true,
          meta:{
            label: '重庆组网界面-组网产品-等值线',
          }
        },
        {
          name: '182392d2-6928-4add-b006-784e9fde0213',
          checked:true,
          meta:{
            label: '重庆组网界面-组网产品-等值线填充',
          }
        },
      ]
    },
    {
      name:'d1f8d849-3ea9-4ea5-a1e2-6bb7d6e3b41a',
      meta:{
        label:'右侧图表',
      },
      children:[
        {
          name:'2353f2f5-b27b-473c-b281-4aa76858ff51',
          checked:false,
          meta:{
            label:'风廓线'
          }
        },
        {
          name:'aa0f5674-ca38-4987-9964-f232024f0992',
          checked:false,
          meta:{
            label:'风速风向'
          }
        },
        {
          name:'ecd5d757-94eb-4b5e-9275-0ffb25a7cbc9',
          checked:false,
          meta:{
            label:'风向廓线'
          }
        },
        {
          name:'d16bc38f-4b41-4294-b8e6-6230f7633120',
          checked:false,
          meta:{
            label:'高度风速曲线'
          }
        },
        {
          name:'fc040225-820d-42f0-8e1a-239c9a76058a',
          checked:false,
          meta:{
            label:'高度信噪比曲线'
          }
        },
        {
          name:'31aba6cc-6da7-432a-87a3-576e4d5f59f2',
          checked:false,
          meta:{
            label:'温湿度曲线'
          }
        },
      ]
    }
  ]
}]
</script>
<style scoped lang="scss">
</style>