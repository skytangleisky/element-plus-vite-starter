import { defineStore, acceptHMRUpdate } from 'pinia'
import zhCn from '../languages/zh-cn.mjs'
import en from '../languages/en.mjs'
export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    lang: 'zh-cn',
    loadmap:false,
    district:true,
    airline:false,
    navigation:false,
    tileUrl:'',
    radar:false,
    station:true,
    feather:true,
    featherValue:0,
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
      {toolTips:'高度',name:'H',val:true,visible:true},
    ],
    checks:[
      { name: "雷达总数", val: "", select: true },
      { name: "在线雷达", val: "", select: false },
      { name: "离线雷达", val: "", select: false },
      { name: "新增雷达", val: "", select: false },
    ],
    routes:[
      {
        path: '/',
        component: '/src/container.vue',
        redirect: { path: '/map' },
        name:'65e99b66-e340-4d4b-6b26-629f41dc63d9',
        label:'ROOT',
        svg:'<svg t="1692449636692" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4999" width="200" height="200"><path d="M737.28 0c-98.986667 0-177.493333 61.44-225.28 122.88C464.213333 61.44 382.293333 0 286.72 0 129.706667 0 0 129.706667 0 286.72c0 341.333333 481.28 716.8 501.76 733.866667 3.413333 3.413333 6.826667 3.413333 10.24 3.413333s6.826667 0 10.24-3.413333C542.72 1003.52 1024 628.053333 1024 286.72 1024 129.706667 894.293333 0 737.28 0z" fill="" p-id="5000"></path></svg>',
        children:[
          {
            path:'map',
            name:'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
            component:'/src/myComponents/menu/index.vue',
            label:'地图',
          },
          {
            path:'edit',
            name:'12254d40-71a3-8406-b0d8-cc9eb3aed11c',
            component:'/src/myComponents/leftMenu/edit.vue',
            label:'菜单'
          }
        ]
      },
      {
        path: '/qqlogin',
        name: '3c1f8a79-4fe6-2263-08fb-477f961fc946',
        component: '/src/qqlogin.vue', //最好是异步加载
        label:'扣扣登录',
      },
      {
        path: '/login',
        name: '97f11ef1-f3aa-9b9f-3e77-a131a9278a08',
        component: '/src/login.vue',
        label:'登录',
      },
      {
        path: '/pixi',
        name: 'a2eaedfb-9c3c-c37e-78c0-3b5851ec60b9',
        component: '/src/myComponents/pixi/index.vue',
        label:'pixi',
      },
      {
        path: '/deck',
        name: 'e4961e04-e574-0e1f-ae23-94f157b14a36',
        component: '/src/myComponents/deck/index.vue',
        label: 'deck',
      },
      {
        path: '/openlayers',
        name: '961a22a1-f5da-9845-fc89-3519ed95059e',
        // component:'/src/myComponents/openlayers/radarStatistic.vue'
        // component:'/src/myComponents/menu/index.vue'
        component:'/src/myComponents/openlayers/index.vue',
        label:'openlayers',
      }
    ]
  }),
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingStore, import.meta.hot))
}
