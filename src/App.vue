<template>
  <el-config-provider namespace="ep" :locale="user.locale" :message="{ max: Infinity }">
    <router-view v-slot="{ Component }">
      <keep-alive :exclude="exclude">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
  <websocket v-if="checkPermission(['admin', 'zh'])"></websocket>
  <debug v-if="checkPermission(['admin', 'zh'])"></debug>
  <!-- <AircraftPos v-if="checkPermission(['admin', 'ry'])"></AircraftPos> -->
</template>
<script lang="ts" setup>
import { onMounted,nextTick, onBeforeUnmount } from "vue";
import { checkPermission } from "./tools";
import websocket from "~/myComponents/websocket/index.vue";
import debug from "~/myComponents/websocket/debug.vue";
import AircraftPos from "~/myComponents/websocket/aircraftPosition.vue";
import { useUserStore } from "./stores/user";
const user = useUserStore();
import { useExclude } from "./myComponents/bus";
let timer:number
const exclude = useExclude();
onMounted(()=>{
  // timer = setInterval(()=>{
  //   fetch('/').then((resp)=>resp.text()).then((resp=>{
  //     if(!localStorage.getItem('versionFingerprint')){
  //       localStorage.setItem('versionFingerprint',resp)
  //     }else{
  //       if(localStorage.getItem('versionFingerprint')!=resp){
  //         clearInterval(timer)
  //         console.log('检测到新版本')
  //         localStorage.setItem('versionFingerprint',resp)
  //         Reset()
  //       }
  //     }
  //   })).catch(e=>{
  //     console.log(e)
  //   })
  // },5e3)
  // setTimeout(()=>{
  //   Reset()
  // },5e3)
})
onBeforeUnmount(()=>{
  clearInterval(timer)
})
import { useSettingStore } from "./stores/setting";
const setting = useSettingStore();
import { useIconStore } from "./stores/icon";
const icon = useIconStore();
import { useStationStore } from "./stores/station";
const station = useStationStore();
import { useDataStore } from "./stores/data";
const data = useDataStore();
import { usePreferredColorScheme } from '@vueuse/core'
import { isDark } from "./composables";
import { useRouter } from "vue-router";
const router = useRouter()
const Reset = () => {
  setting.$resetFields();
  icon.$resetFields();
  station.$reset();
  data.$reset();
  user.$reset();
  user.Logout().catch((e) => {
    throw e;
  });
  sessionStorage.clear();
  localStorage.clear();
  const preferredScheme = usePreferredColorScheme();
  if(preferredScheme.value == 'dark'){
    isDark.value=true
  }else{
    isDark.value=false
  }
  exclude.push("contain"); //重置，对应组件和其子组件应该需要被重新渲染，因为重置pinia的数据后会导致页面可能显示异常，涉及到的组件需要重新渲染
  router.replace({ ...router.currentRoute.value, force: true });
  // setTimeout(()=>{
  //   window.location.reload()
  // },10e3)
};
</script>
