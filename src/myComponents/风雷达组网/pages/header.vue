<template>
  <div class="absolute left-0 top-0 w-full h-30px flex items-center justify-between">
    <div class="flex items-center hidden">
      <el-dropdown trigger="click" size="small">
        <el-icon style="color:#00f3ff;font-size: 20px;margin-left:10px;" v-html="userSvg"/>
        <img :src="user.avatar" style="width: 24px; height: 24px; border-radius: 50%" />
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item @click="login" :icon="Select">登陆</el-dropdown-item> -->
            <!-- <el-dropdown-item :icon="Setting">捐赠</el-dropdown-item> -->
            <el-dropdown-item  slot="dropdown" @click="userClick"><el-icon v-html="Lock"></el-icon>修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="font-size-16px m-l-10px"><strong>{{ user.username }}</strong>,欢迎您！</div>
      <DigitalClock class="font-size-20px hidden xl:flex"/>
    </div>
    <div class="flex items-center">
      <el-badge :value="1" type="warning" :is-dot="true" :offset="[-15,2]" :show-zero="false" @click="alarmClick">
        <el-icon v-html="alarmSvg" style="font-size:20px; color:#00f3ff;margin-right:10px"/>
      </el-badge>
      <el-icon v-html="settingSvg" style="font-size:20px; color:#00f3ff;margin-right:10px" @click="settingClick"/>
      <el-icon v-html="logoutSvg" @click="logout" style="font-size:20px; color:#00f3ff;margin-right:10px"/>
    </div>
    <div class="menuItem absolute top-35px left-50% flex w-110px h-20px justify-center" style="transform: translateX(-50%) translateX(-550px);" @click.native="menuClick(0)">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==0" xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="cyan" stroke-width="1"/>
        <polygon points="0,0 10,0 20,20 10,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div class="color-cyan z-1" style="font-weight: bolder;">
        首页
      </div>
    </div>
    <div class="menuItem absolute top-35px left-50% flex w-110px justify-center" style="transform: translateX(-50%) translateX(-400px);" @click="menuClick(1)">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==1" xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="0,0 100,0 110,20 10,20" fill="none" stroke="cyan" stroke-width="1"/>
        <polygon points="0,0 10,0 20,20 10,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div class="color-cyan z-1" style="font-weight: bolder;">
        数据产品
      </div>
    </div>
    <div class="menuItem absolute top-35px left-50% flex w-110px justify-center" style="transform: translateX(-50%) translateX(+400px);" @click="menuClick(2)">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==2" xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="cyan" stroke-width="1"/>
        <polygon points="10,0 20,0 10,20 0,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div class="color-cyan z-1" style="font-weight: bolder;">
        设备管理
      </div>
    </div>
    <div class="menuItem absolute top-35px left-50% flex w-110px justify-center" style="transform: translateX(-50%) translateX(+550px);" @click="menuClick(3)">
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="gray" stroke-width="1"/>
      </svg>
      <svg v-if="menuIndex==3" xmlns="http://www.w3.org/2000/svg" class="absolute left-0 top-0 w-full h-full">
        <polygon points="10,0 100,0 90,20 0,20" fill="none" stroke="gray" stroke-width="1"/>
        <polygon points="10,0 20,0 10,20 0,20" fill="cyan" stroke="cyan" stroke-width="1"/>
      </svg>
      <div class="color-cyan z-1" style="font-weight: bolder;">
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
import Lock from './lock.svg?raw'
import { useUserStore } from '~/stores/user';
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
const user = useUserStore()
import { useRouter } from 'vue-router';
import DigitalClock from '~/tools/DigitalClock.vue';
const router = useRouter()
function logout(){
  user.$reset();
  user.Logout().catch((e) => {
    throw e;
  });
  sessionStorage.clear();
  router.push({ path: "/login", replace: true });
}
</script>
<style lang="scss">
.menuItem:hover svg{
  polygon{
    stroke:cyan;
  }
}
</style>