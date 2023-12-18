import { defineStore, acceptHMRUpdate } from "pinia"
import zhCn from '../languages/zh-cn.mjs'
import en from '../languages/en.mjs'
export const state = {
  openlayers:{
    zoom:5,
    center:[100.41462758184835, 36.57697037305711],
  },
  projection: 'mercator',
  lang: 'zh-cn',
  webgpu:true,
  loadmap:true,
  district:true,
  airline:true,
  navigation:true,
  radar:false,
  stream:false,
  graticule:false,
  tileUrl:'',
  station:true,
  feather:true,
  legend:false,
  disappear:true,
  component:'/src/myComponents/menu/index.vue',
  factor:[
    {toolTips:'站号',name:'ZH',val:false,visible:false},
    {toolTips:'站名',name:'ZN',val:true,visible:false},
    {toolTips:'风羽',name:'FY',val:false,visible:false},
    {toolTips:'信噪比',name:'SNR',val:false,visible:false},
    {toolTips:'垂直气流',name:'W',val:false,visible:false},
    {toolTips:'站点',name:'N',val:false,visible:false},
    {toolTips:'普宽',name:'SW',val:false,visible:false},
    {toolTips:'温度',name:'T',val:true,visible:true},
    {toolTips:'露点',name:'Td',val:true,visible:false},
    {toolTips:'湿度',name:'RH',val:true,visible:true},
    {toolTips:'高度',name:'H',val:true,visible:false},
  ],
  checks:[
    {
      name: "雷达总数",
      show:false,
      showSelect:true,
      showCollapse:false,
      val:0,
      showVal:true,
      children: [
        {name:'机舱雷达',val: 2},
        {name:'塔式雷达',val: 0},
        {name:'三维雷达',val: 0}
      ],
      select: true
    },
    {
      name: "在线雷达",
      showCollapse:false,
      show:false,
      showSelect:true,
      val:0,
      showVal:true,
      children:[
        {name:'机舱雷达',val: 1},
        {name:'塔式雷达',val: 0},
        {name:'三维雷达',val: 0}
      ],
      select: false
    },
    {
      name: "离线雷达",
      showCollapse:false,
      show:false,
      showSelect:true,
      val:0,
      showVal:true,
      children: [
        {name:'机舱雷达',val: 1},
        {name:'塔式雷达',val: 0},
        {name:'三维雷达',val: 0}
      ],
      select: false
    },
    {
      name: "新增雷达",
      showCollapse:false,
      show:false,
      showSelect:true,
      val:0,
      showVal:true,
      children: [
        {name:'机舱雷达',val: 2},
        {name:'塔式雷达',val: 0},
        {name:'三维雷达',val: 0}
      ],
      select: false
    },
  ],
  defaultActive: 'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
  defaultOpends:['65e99b66-e340-4d4b-6b26-629f41dc63d9'],
  routes:[
    {
      path: 'contain',
      component: '/src/container.vue',
      redirect: { path: '/contain/map' },
      name:'65e99b66-e340-4d4b-6b26-629f41dc63d9',
      label:'contain',
      svg:'8226ee256c6711ee8c80b025aa2c9ada',
      children:[
        {
          path:'map',
          name:'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
          component:'/src/myComponents/menu/index.vue',
          label:'地图',
          replace:true,
          svg:'8226ee256c6711ee8c80b025aa2c9ada',
        },
        {
          path:'edit',
          name:'12254d40-71a3-8406-b0d8-cc9eb3aed11c',
          component:'/src/myComponents/leftMenu/edit.vue',
          label:'菜单',
          replace:true,
          svg:'887ba0af3b3511ee8077b025aa2c9ada',
        },
        {
          path: 'openlayers',
          name: '961a22a1-f5da-9845-fc89-3519ed95059e',
          // component:'/src/myComponents/openlayers/radarStatistic.vue'
          // component:'/src/myComponents/menu/index.vue'
          component:'/src/myComponents/openlayers/index.vue',
          replace:true,
          label:'openlayers',
          svg:'4db7562c3aa011ee8077b025aa2c9ada',
        },
      ]
    },
    {
      path: 'qqlogin',
      name: '3c1f8a79-4fe6-2263-08fb-477f961fc946',
      component: '/src/qqlogin.vue', //最好是异步加载
      label:'扣扣登录',
      svg:'92210ef73b4111ee8077b025aa2c9ada',
    },
    {
      path: 'login',
      name: '97f11ef1-f3aa-9b9f-3e77-a131a9278a08',
      component: '/src/login.vue',
      label:'登录',
      svg:'97d8a6d93ab711ee8077b025aa2c9ada'
    },
    {
      path: 'openlayers',
      name: '961a22a1-f5da-9845-fc89-3519ed95059f',
      // component:'/src/myComponents/openlayers/radarStatistic.vue'
      // component:'/src/myComponents/menu/index.vue'
      component:'/src/myComponents/openlayers/index.vue',
      label:'openlayers',
      svg:'4db7562c3aa011ee8077b025aa2c9ada',
    },
    {
      path: 'deck',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a36',
      component: '/src/myComponents/deck/index.vue',
      label: 'openlayers',
      svg:'a69daeed81e611ee98afb025aa2c9ada'
    },
    {
      path: 'deck2',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a37',
      component: '/src/myComponents/deck/index2.vue',
      label: 'openlayers2',
      svg:'a69daeed81e611ee98afb025aa2c9ada'
    },
    {
      path: 'mapbox',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a38',
      component: '/src/myComponents/mapbox/index.vue',
      label: 'mapbox',
      svg:'11b6b95281e711ee98afb025aa2c9ada'
    },
    {
      path: 'fabric',
      name: 'e4961e04-e574-0e1f-ae23-94f157b14a39',
      component: '/src/myComponents/fabric/index.vue',
      label: 'fabric',
      svg:'11b6b95281e711ee98afb025aa2c9ada'
    },
    {
      path: '',
      redirect: '/contain/map',
    },
  ]
}
export const useSettingStore = defineStore({
  id: 'setting',
  state:()=>state,
  getters:{
    locale: state => {
      if(state.lang==='en'){
        return en
      }
      return zhCn
    }
  },
  actions: {
    changeLanguage(lang: string) {
      console.log(lang)
      this.$patch({
        lang
      })
    },
    setloadMap(bool:boolean){
      this.$patch({
        loadmap:bool
      })
    }
  },
  persist: true
})
if(import.meta.hot){
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}