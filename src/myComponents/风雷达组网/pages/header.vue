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
  </div>
</template>
<script lang="ts" setup>
import settingSvg from '~/assets/setting.svg?raw'
import userSvg from '~/assets/user.svg?raw'
import logoutSvg from '~/assets/logout.svg?raw'
import alarmSvg from '~/assets/alarm.svg?raw'
import Lock from './lock.svg?raw'
import { useUserStore } from '~/stores/user';
const emits = defineEmits(['setting','editUser','alarm'])
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
</style>