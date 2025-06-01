<template>
  <div style="position: absolute;left:0;top:0;width: 100%;height: 30px;display: flex;align-items: center;justify-content: space-between;">
    <div style="display: flex;align-items: center;display: none;">
      <el-dropdown trigger="click" size="small">
        <el-icon style="color:#00f3ff;font-size: 20px;margin-left:10px;" v-html="userSvg"/>
        <img :src="user.avatar" style="width: 24px; height: 24px; border-radius: 50%" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="Reset"><el-icon v-html="ResetSvg"/>重&emsp;置</el-dropdown-item>
            <!-- <el-dropdown-item :icon="Setting">捐赠</el-dropdown-item> -->
            <el-dropdown-item  slot="dropdown" @click="userClick"><el-icon v-html="LockSvg"></el-icon>改密码</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div style="font-size: 16px;margin-left: 10px;"><strong>{{ user.username }}</strong>,欢迎您！</div>
      <DigitalClock/>
    </div>
    <div style="display: flex;align-items: center;">
      <el-badge :value="0" type="warning" :is-dot="false" :offset="[-15,2]" :show-zero="false" @click="alarmClick">
        <el-icon v-html="alarmSvg" style="font-size:20px; color:#00f3ff;margin-right:10px"/>
      </el-badge>
      <el-icon v-html="settingSvg" style="font-size:20px; color:#00f3ff;margin-right:10px" @click="settingClick"/>
      <el-icon v-html="logoutSvg" @click="logout" style="font-size:20px; color:#00f3ff;margin-right:10px"/>
    </div>
    <div style="transform: translateX(-50%) translateX(-550px);display: absolute;top:35px;left:50%;display: flex;width: 110px;height: 20px;justify-content: center;" @click.native="menuClick(0)">
      <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute;left:0;top:0;width: 100%;height: 100%;">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==0" xmlns="http://www.w3.org/2000/svg" style="position: absolute;left: 0;top:0;width: 100%;height: 100%;">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="cyan" stroke-width="1"/>
        <polygon points="0,0 10,0 20,20 10,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div style="font-weight: bolder;color:cyan;z-index: 1;">
        首页
      </div>
    </div>
    <div class="menuItem" style="transform: translateX(-50%) translateX(-400px);position: absolute;top:35px;left: 50%;display: flex;width: 110px;justify-content: center;" @click="menuClick(1)">
      <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute;left: 0;top:0;width: 100%;height: 100%;">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==1" xmlns="http://www.w3.org/2000/svg" style="position: absolute;left:0;top:0;width: 100%;height: 100%;">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="cyan" stroke-width="1"/>
        <polygon points="0,0 10,0 20,20 10,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div style="font-weight: bolder;color:cyan;z-index: 1;">
        数据产品
      </div>
    </div>
    <div class="menuItem" style="transform: translateX(-50%) translateX(+400px);position: absolute;top:35px;left:50%;display: flex;width: 110px;justify-content: center;;" @click="menuClick(2)">
      <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute;left: 0;top:0;width: 100%;height: 100%;">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==2" xmlns="http://www.w3.org/2000/svg" style="position: absolute;left: 0;top:0;width: 100%;height: 100%;">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="cyan" stroke-width="1"/>
        <polygon points="10,0 20,0 10,20 0,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div style="font-weight: bolder;color:cyan;z-index: 1">
        设备管理
      </div>
    </div>
    <div class="menuItem" style="transform: translateX(-50%) translateX(+550px);position: absolute;top:35px;left:50%;display: flex;width: 110px;justify-content: center;" @click="menuClick(3)">
      <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute;left:0;top:0;width: 100%;height: 100%;">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==3" xmlns="http://www.w3.org/2000/svg" style="position: absolute;left:0;top:0;width: 100%;height: 100%;">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="gray" stroke-width="1"/>
        <polygon points="10,0 20,0 10,20 0,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div style="font-weight: bolder;color:cyan;z-index: 1;">
        气象服务
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import settingSvg from '~/assets/setting.svg?raw'
import userSvg from '~/assets/user.svg?raw'
import logoutSvg from '~/assets/logout.svg?raw'
import alarmSvg from '~/assets/alarm.svg?raw'
import LockSvg from '~/assets/lock.svg?raw'
import ResetSvg from '~/assets/reset.svg?raw'
import {hasPermission} from '~/tools'

import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useIconStore } from "~/stores/icon";
const icon = useIconStore();
import { useUserStore } from "~/stores/user";
const user = useUserStore();
import { useDataStore } from "~/stores/data";
const data = useDataStore();
import { useExclude } from "~/myComponents/bus";
const exclude = useExclude();
import { useTheme } from "~/theme"
const theme = useTheme()

const props = withDefaults(defineProps<{menuIndex:number}>(),{menuIndex:0})
function menuClick(index:number){
  emits('update:menuIndex',index)
}
const emits = defineEmits(['setting','editUser','alarm','update:menuIndex'])
function settingClick(){
  emits('setting')
}
function userClick(){
  emits('editUser')
}
function alarmClick(){
  emits('alarm')
}
import { useRouter } from 'vue-router';
import DigitalClock from '~/tools/DigitalClock2.vue';
const router = useRouter()
function logout(){
  user.$reset();
  user.Logout().catch((e) => {
    throw e;
  });
  sessionStorage.clear();
  router.push({ path: "/login", replace: true });
}
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
  exclude.push("contain"); //重置，对应组件和其子组件应该需要被重新渲染，因为重置pinia的数据后会导致页面可能显示异常，涉及到的组件需要重新渲染
  router.replace({ ...router.currentRoute.value, force: true });
};
</script>
<style lang="scss">
.menuItem:hover svg{
  polygon{
    stroke:cyan;
  }
}
</style>