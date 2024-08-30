import { defineStore, acceptHMRUpdate2 } from "pinia"
import moment from 'moment'
import {type prevRequestDataType} from '../myComponents/dialog_plan_request.vue'
import ry from "./subs/ry.js";
import jx from "./subs/jx.js";
import dev from "./subs/dev.js";
import zh from "./subs/zh.js";
import cq from "./subs/cq.js";
import device from "./subs/device.js";
export const useSettingStore = defineStore({
  id: 'setting',
  state:()=>({
    scrollTop:0,
    isCollapse:false,
    catalogue:{
      dirs:[],
      files:[],
    },
    mapbox:{
      showStation:true,
      showStream:true,
      satellite:true,
      center:[0,0],
      zoom:8
    },
    openlayers:{
      // zoom:5,
      // center:[100.41462758184835, 36.57697037305711],
      "zoom": 8.882777980661407,
      "center": [
          117.04212403858509,
          28.1994655756006
      ],
    },
    风雷达组网地图相关:{
      等距环:false,
      relativeHeight:1,
      风场数据:"无",
      反演风场:"无",
      站名:true,
      站号:false,
      高度:false,
      风向:false,
      风速:false,
      垂直气流:false,
      时间:false,
      请求时间:"",
      "zoom": 6.612522982969934,
      "center": [
        108,
        30.286192617004076
      ],
      ppiOpacity:0,
      mapOpacity:1,
      factor:[
        {toolTips:'站名',name:'ZN',val:true,visible:false},
        {toolTips:'站号',name:'ZH',val:false,visible:false},
        {toolTips:'风羽',name:'FY',val:false,visible:false},
        {toolTips:'信噪比',name:'SNR',val:false,visible:false},
        {toolTips:'垂直气流',name:'W',val:false,visible:false},
        {toolTips:'站点',name:'N',val:false,visible:false},
        {toolTips:'普宽',name:'SW',val:false,visible:false},
        {toolTips:'温度',name:'T',val:false,visible:false},
        {toolTips:'露点',name:'Td',val:true,visible:false},
        {toolTips:'湿度',name:'RH',val:false,visible:false},
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
            {name:'三维雷达',val: 0},
            {name:'linux-机舱雷达',val: 2},
            {name:'linux-塔式雷达',val: 0},
            {name:'linux-三维雷达',val: 0},
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
            {name:'三维雷达',val: 0},
            {name:'linux-机舱雷达',val: 1},
            {name:'linux-塔式雷达',val: 0},
            {name:'linux-三维雷达',val: 0},
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
            {name:'三维雷达',val: 0},
            {name:'linux-机舱雷达',val: 1},
            {name:'linux-塔式雷达',val: 0},
            {name:'linux-三维雷达',val: 0},
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
            {name:'三维雷达',val: 0},
            {name:'linux-机舱雷达',val: 2},
            {name:'linux-塔式雷达',val: 0},
            {name:'linux-三维雷达',val: 0},
          ],
          select: false
        },
      ],
    },
    无人机:{
      监控:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        disappear:false,
        bottom_disappear:true,
        tile:'卫星地图',
      },
      回放:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      编辑:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      模拟:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      }
    },
    组网:{
      监控:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        pitch:0,
        radar:true,
        district:true,
        loadmap:true,
        disappear:false,
        bottom_disappear:true,
        tile:'卫星地图',
      },
      回放:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      编辑:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      模拟:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      }
    },
    风雷达组网:{
      监控:{
        "zoom": 8.882777980661407,
        "center": [
          117.04212403858509,
          28.1994655756006
        ],
        gridValue:false,
        gridPoint:false,
        isobands:false,
        isolines:false,
        zdz:true,
        bearing:0,
        pitch:0,
        routeLine:true,
        zyd:true,
        plane:true,
        district:true,
        loadmap:true,
        disappear:false,//右侧菜单
        prevPlanRequestShow:false,
        prevPlanRequestData:{
          strID: "",
          strCode: "",
          strName: "",
          strPos: "",
          iMaxShotRange: 0,
          iMaxShotHei: 0,
          iWeapon: 0,
          iWorkType:1,
          iShotRangeBegin: 0,
          iShotRangeEnd: 0,
          beginTime: moment().format("HH:mm:ss"),
          duration: 1,
        },
        bottom_disappear:true,
        tile:{
          index:0,
          tileData:new Array<string>()
        },
      },
      回放:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      编辑:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      模拟:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      }
    },
    人影:{
      监控:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        gridValue:false,
        gridPoint:false,
        isobands:false,
        isolines:false,
        zdz:true,
        bearing:0,
        pitch:0,
        routeLine:true,
        zyd:true,
        plane:true,
        district:true,
        loadmap:true,
        disappear:false,//右侧菜单
        prevPlanRequestShow:false,
        prevPlanRequestData:{
          strID: "",
          strCode: "",
          strName: "",
          strPos: "",
          iMaxShotRange: 0,
          iMaxShotHei: 0,
          iWeapon: 0,
          iWorkType: 1,
          iShotRangeBegin: 0,
          iShotRangeEnd: 0,
          beginTime: moment().format("HH:mm:ss"),
          duration: 1,
          unitName:"",
        },
        bottom_disappear:true,
        tile:{
          index:0,
          tileData:new Array<string>()
        },
      },
      回放:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      编辑:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      模拟:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      }
    },
    珠海:{
      监控:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        gridValue:true,
        gridPoint:true,
        isobands:true,
        isolines:true,
        zdz:true,
        bearing:0,
        pitch:0,
        routeLine:true,
        zyd:true,
        district:true,
        loadmap:true,
        disappear:false,
        bottom_disappear:true,
        tile:'卫星地图',
      },
      回放:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      编辑:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      },
      模拟:{
        "zoom": 8.882777980661407,
        "center": [
            117.04212403858509,
            28.1994655756006
        ],
        district:true,
        loadmap:true,
        tile:'街道地图',
      }
    },
    projection: 'globe',// mercator|globe
    webgpu:false,
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
          {name:'三维雷达',val: 0},
          {name:'linux-机舱雷达',val: 2},
          {name:'linux-塔式雷达',val: 0},
          {name:'linux-三维雷达',val: 0},
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
          {name:'三维雷达',val: 0},
          {name:'linux-机舱雷达',val: 1},
          {name:'linux-塔式雷达',val: 0},
          {name:'linux-三维雷达',val: 0},
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
          {name:'三维雷达',val: 0},
          {name:'linux-机舱雷达',val: 1},
          {name:'linux-塔式雷达',val: 0},
          {name:'linux-三维雷达',val: 0},
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
          {name:'三维雷达',val: 0},
          {name:'linux-机舱雷达',val: 2},
          {name:'linux-塔式雷达',val: 0},
          {name:'linux-三维雷达',val: 0},
        ],
        select: false
      },
    ],
    routes:[
      dev,
      zh,
      ry,
      jx,
      cq,
      device,
      {
        path: 'qqlogin',
        name: '3c1f8a79-4fe6-2263-08fb-477f961fc946',
        component: '/src/qqlogin.vue', //最好是异步加载
        svg:'92210ef73b4111ee8077b025aa2c9ada',
        hide:true,
        meta:{
          label:'扣扣登录',
        }
      },
      {
        path: 'login',
        name: '97f11ef1-f3aa-9b9f-3e77-a131a9278a08',
        component: '/src/login.vue',
        svg:'97d8a6d93ab711ee8077b025aa2c9ada',
        hide:true,
        meta:{
          label:'登录',
        }
      },
      {
        path: 'openlayers',
        name: '961a22a1-f5da-9845-fc89-3519ed95059f',
        // component:'/src/myComponents/openlayers/radarStatistic.vue'
        // component:'/src/myComponents/menu/index.vue'
        component:'/src/myComponents/openlayers/index.vue',
        svg:'4db7562c3aa011ee8077b025aa2c9ada',
        hide:true,
        meta:{
          label:'光恒网站',
        }
      },
      {
        path: 'calibration',
        name: 'c4961e04-e574-0e1f-ae23-94f157b14a43',
        component: '/src/myComponents/calibration/index.vue',
        svg:'5e38a2e3aaf011eeb80bb025aa2c9ada',
        hide:true,
        meta:{
          label: '光恒标定场',
        }
      },
      {
        path: '',
        name: '99961e04-e574-0e1f-1e23-94f157b14a41',
        redirect: '/ry/synthesis',
        hide:true,
        meta:{
          label:'北京人影',
          roles:['ry']
        }
      },
      {
        path: '',
        name: '99961e04-e574-0e1f-2e23-94f157b14a42',
        redirect: '/jx/synthesis',
        hide:true,
        meta:{
          label:'江西无人机',
          roles:['jx']
        }
      },
      {
        path: '',
        name: '99961e04-e574-0e1f-2e23-94f157b14b42',
        redirect: '/zh/synthesis/monitor',
        hide:true,
        meta:{
          label:'珠海',
          roles:['zh']
        }
      },
      {
        path: '',
        name: '99961e04-e574-0e1f-2e23-94f157b14b55',
        redirect: '/cq/synthesis',
        hide:true,
        meta:{
          label:'重庆组网',
          roles:['cq']
        }
      },
      {
        path: '',
        name: '99961e0a-e574-0e1f-2e23-94f157b14b55',
        redirect: '/device/synthesis',
        hide:true,
        meta:{
          label:'设备组网',
          roles:['device']
        }
      },
      {
        path: '',
        name: '99961e04-e574-0e1f-3e23-94f157b14a43',
        redirect: '/ry/synthesis',
        hide:true,
        meta:{
          label:'超级用户',
          roles:['admin']
        }
      },
      {
        path: ':catchAll(.*)*',
        component: '/src/myComponents/404/index.vue',
        hide:true,
        meta:{
          label:'404'
        }
      },
    ]
  }),
  actions: {
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