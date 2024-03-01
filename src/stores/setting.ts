import { defineStore, acceptHMRUpdate2 } from "pinia"
import zhCn from '../languages/zh-cn.mjs'
import en from '../languages/en.mjs'
export const useSettingStore = defineStore({
  id: 'setting',
  state:()=>({
    mapbox:{
      showStation:false,
      showStream:false,
      satellite:false,
    },
    openlayers:{
      zoom:5,
      center:[100.41462758184835, 36.57697037305711],
    },
    无人机:{
      回放:{
        zoom:5,
        center:[100.41462758184835, 36.57697037305711],
        district:true,
        loadmap:true,
      },
      编辑:{
        zoom:5,
        center:[100.41462758184835, 36.57697037305711],
        district:true,
        loadmap:true,
      },
      模拟:{
        zoom:5,
        center:[100.41462758184835, 36.57697037305711],
        district:true,
        loadmap:true,
      }
    },
    projection: 'globe',// mercator|globe
    lang: 'zh-cn',
    webgpu:false,
    loadmap:false,
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
    status: 'play',//记录时间轴的播放状态
    now: undefined,//时间轴的当前时间
    level:undefined,//时间轴的缩放等级
    playback:{
    status: 'pause',//记录时间轴的播放状态
    now: undefined,//时间轴的当前时间
    level:undefined,//时间轴的缩放等级
    },
    component:'/src/myComponents/menu/index.vue',
    factor:[
      {toolTips:'站号',name:'ZH',val:false,visible:false},
      {toolTips:'站名',name:'ZN',val:true,visible:true},
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
        redirect: { path: '/contain/synthesis' },
        name:'65e99b66-e340-4d4b-6b26-629f41dc63d9',
        label:'contain',
        svg:'2071b6c53b4211ee8077b025aa2c9ada',
        children:[
          {
            path:'map',
            name:'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
            component:'/src/myComponents/menu/index.vue',
            label:'地图',
            replace:true,
            hide:true,
            svg:'8226ee256c6711ee8c80b025aa2c9ada',
          },
          {
            path:'edit',
            name:'12254d40-71a3-8406-b0d8-cc9eb3aed11c',
            component:'/src/myComponents/leftMenu/edit.vue',
            label:'菜单',
            replace:true,
            hide:true,
            svg:'887ba0af3b3511ee8077b025aa2c9ada',
          },
          {
            path: 'openlayers',
            name: '961a22a1-f5da-9845-fc89-3519ed95059e',
            // component:'/src/myComponents/openlayers/radarStatistic.vue'
            // component:'/src/myComponents/menu/index.vue'
            component:'/src/myComponents/openlayers/index.vue',
            replace:true,
            hide:true,
            label:'openlayers',
            svg:'4db7562c3aa011ee8077b025aa2c9ada',
          },
          {
            path: 'synthesis',
            name: '961a22a1-f5da-9845-fc89-3519ed950510',
            // component:'/src/myComponents/openlayers/radarStatistic.vue'
            // component:'/src/myComponents/menu/index.vue'
            component:'/src/myComponents/无人机/index.vue',
            replace:true,
            label:'综合监控',
            svg:'66ef0fa1d6cc11ee9aafb025aa2c9ada',
          },
          {
            path: 'history',
            name: '961a22a1-f5da-9845-fc89-3519ed950610',
            // component:'/src/myComponents/openlayers/radarStatistic.vue'
            // component:'/src/myComponents/menu/index.vue'
            component:'/src/myComponents/无人机/playback.vue',
            replace:true,
            label:'历史回放',
            svg:'42a4578ed6cd11ee9aafb025aa2c9ada',
          },
          {
            path: 'zrender',
            name: 'c4961e04-e574-0e1f-ae23-94f157b14a42',
            component: '/src/myComponents/zrender/demo.vue',
            label: 'zrender',
            svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
            hide:true,
          },
          {
            path: 'record',
            name: 'c4961e04-e574-0e1f-ae23-94f157b14a45',
            component: '/src/myComponents/datatable/record.vue',
            label: '备案查询',
            svg:'18821b0ad6cb11ee9aafb025aa2c9ada'
          },
          {
            path: 'statistics',
            name: '961a22a1-f5da-9845-fc89-3519ed950710',
            // component:'/src/myComponents/openlayers/radarStatistic.vue'
            // component:'/src/myComponents/menu/index.vue'
            component:'/src/myComponents/datatable/whitelist.vue',
            replace:true,
            label:'数据统计',
            svg:'a2a749dfd6ca11ee9aafb025aa2c9ada',
          },
          {
            path: 'system',
            name:'65e99b66-e340-4d4b-6b26-629f41dc64a9',
            label:'系统管理',
            svg:'7809a650d6c811ee9aafb025aa2c9ada',
            children:[
              {
                path: 'device',
                name: 'c4961e04-e574-0e1f-ae23-94f157b15a45',
                component: '/src/myComponents/datatable/device.vue',
                label: '反无设备详情',
                svg:'2133405ad6ca11ee9aafb025aa2c9ada'
              },
              {
                path: 'simulate',
                name: 'c4961e04-e574-0e1f-ae23-94f157b15b45',
                component:'/src/myComponents/无人机/simulate.vue',
                label: '设备布防模拟',
                svg:'8bdc8331d6c911ee9aafb025aa2c9ada'
              },
              {
                path: 'airspace',
                name: 'c4961e04-e574-0e1f-ae23-94f157b15c45',
                component: '/src/myComponents/无人机/edit.vue',
                label: '禁飞区管理',
                svg:'fb9ca5f8d6c811ee9aafb025aa2c9ada'
              },
              {
                path: 'whitelist',
                name: 'c4961e04-e574-0e1f-ae23-94f157b15d45',
                component: '/src/myComponents/datatable/whitelist.vue',
                label: '白名单管理',
                svg:'41416b3ed6c911ee9aafb025aa2c9ada'
              },
            ]
          },
          {
            path: 'user',
            name:'65e99b66-e340-4d4a-6b26-629f41dc64a9',
            label:'用户管理',
            svg:'b9cef812d6c711ee9aafb025aa2c9ada',
            children:[
              {
                path: 'personal',
                name: 'c4961e01-e571-0e1f-ae23-94f157b15a45',
                component: '/src/myComponents/datatable/user.vue',
                label: '个人用户',
                svg:'f11a18a8d6c711ee9aafb025aa2c9ada'
              },
              {
                path: 'enterprise',
                name: 'c4961e02-e572-0e1f-ae23-94f157b15b45',
                component: '/src/myComponents/datatable/enterprise.vue',
                label: '企业用户',
                svg:'20a7ae2bd6c811ee9aafb025aa2c9ada'
              },
            ]
          },
          {
            path: 'permission',
            name:'65e99b66-e340-4d41-6b26-629f41dc64a9',
            label:'权限管理',
            svg:'3c94a7e5d6c611ee9aafb025aa2c9ada',
            children:[
              {
                path: 'administrator',
                name: 'c4961e04-e571-0e1f-ae23-94f157b15a45',
                component: '/src/myComponents/datatable/whitelist.vue',
                label: '系统用户管理',
                svg:'6a190295d6c711ee9aafb025aa2c9ada'
              },
              {
                path: 'group',
                name: 'c4961e04-e572-0e1f-ae23-94f157b15b45',
                component: '/src/myComponents/datatable/whitelist.vue',
                label: '用户组管理',
                svg:'e5fc96bfd6c611ee9aafb025aa2c9ada'
              },
              {
                path: 'institution',
                name: 'c4961e04-e573-0e1f-ae23-94f157b15b45',
                component: '/src/myComponents/datatable/whitelist.vue',
                label: '机构管理',
                svg:'2e727627d6c711ee9aafb025aa2c9ada'
              },
            ]
          },
          {
            path: ':catchAll(.*)*',
            component: '/src/myComponents/404/index.vue',
            hide:true
          },
        ]
      },
      {
        path: 'qqlogin',
        name: '3c1f8a79-4fe6-2263-08fb-477f961fc946',
        component: '/src/qqlogin.vue', //最好是异步加载
        label:'扣扣登录',
        svg:'92210ef73b4111ee8077b025aa2c9ada',
        hide:true,
      },
      {
        path: 'login',
        name: '97f11ef1-f3aa-9b9f-3e77-a131a9278a08',
        component: '/src/login.vue',
        label:'登录',
        svg:'97d8a6d93ab711ee8077b025aa2c9ada',
        hide:true,
      },
      {
        path: 'openlayers',
        name: '961a22a1-f5da-9845-fc89-3519ed95059f',
        // component:'/src/myComponents/openlayers/radarStatistic.vue'
        // component:'/src/myComponents/menu/index.vue'
        component:'/src/myComponents/openlayers/index.vue',
        label:'openlayers',
        svg:'4db7562c3aa011ee8077b025aa2c9ada',
        hide:true
      },
      {
        path: 'deck',
        name: 'e4961e04-e574-0e1f-ae23-94f157b14a36',
        component: '/src/myComponents/deck/index.vue',
        label: 'openlayers',
        svg:'a69daeed81e611ee98afb025aa2c9ada',
        hide:true
      },
      {
        path: 'deck2',
        name: 'e4961e04-e574-0e1f-ae23-94f157b14a37',
        component: '/src/myComponents/deck/index2.vue',
        label: 'openlayers2',
        svg:'a69daeed81e611ee98afb025aa2c9ada',
        hide:true
      },
      {
        path: 'mapbox',
        name: 'e4961e04-e574-0e1f-ae23-94f157b14a38',
        component: '/src/myComponents/mapbox/index.vue',
        label: 'mapbox',
        svg:'11b6b95281e711ee98afb025aa2c9ada',
        hide:true
      },
      {
        path: 'fabric',
        name: 'e4961e04-e574-0e1f-ae23-94f157b14a39',
        component: '/src/myComponents/fabric/index.vue',
        label: 'fabric',
        svg:'ef5f059d9cb611ee9b6cb025aa2c9ada',
        hide:true
      },
      {
        path: 'timeline',
        name: 'e4961e04-e574-0e1f-ae23-94f157b14a40',
        component: '/src/tools/timeLine.vue',
        label: 'timeline',
        svg:'8fc8736b9cb611ee9b6cb025aa2c9ada',
        hide:true
      },
      {
        path: 'graph',
        name: 'e4961e04-e574-0e1f-ae23-94f157b14a41',
        component: '/src/tools/graph.vue',
        label: 'graph',
        svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
        hide:true
      },
      {
        path: 'test',
        name: 'c4961e04-e574-0e1f-ae23-94f157b14a44',
        component: '/src/myComponents/zrender/test.vue',
        label: 'test',
        svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
        hide:true
      },
      {
        path: 'calibration',
        name: 'c4961e04-e574-0e1f-ae23-94f157b14a43',
        component: '/src/myComponents/calibration/index.vue',
        label: 'calibration',
        svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
        hide:true
      },
      {
        path: '',
        name: '99961e04-e574-0e1f-ae23-94f157b14a43',
        redirect: '/contain/synthesis',
        hide:true
      },
      {
        path: ':catchAll(.*)*',
        component: '/src/myComponents/404/index.vue',
        hide:true
      },
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
if(import.meta.hot){
  import.meta.hot.accept(acceptHMRUpdate2(useSettingStore, import.meta.hot))
}