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
    featherValue:5,
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
    ],
    checks:[
      { name: "雷达总数", val: "", select: true },
      { name: "在线雷达", val: "", select: false },
      { name: "离线雷达", val: "", select: false },
      { name: "新增雷达", val: "", select: false },
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
