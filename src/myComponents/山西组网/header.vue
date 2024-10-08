<template>
  <div class="absolute left-0 top-0 w-full h-30px flex items-center justify-between">
    <div class="flex">
      <el-icon style="color:#00f3ff;font-size: 20px;margin-left:10px;" v-html="userSvg"/>
      <div class="font-size-16px m-l-10px"><strong>{{ user.username }}</strong>,欢迎您！</div>
    </div>
    <div>
      <el-icon v-html="settingSvg" style="font-size:20px; color:#00f3ff;margin-right:10px"/>
      <el-icon v-html="logoutSvg" @click="logout" style="font-size:20px; color:#00f3ff;margin-right:10px"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import settingSvg from '~/assets/setting.svg?raw'
import userSvg from '~/assets/user.svg?raw'
import logoutSvg from '~/assets/logout.svg?raw'
import { useUserStore } from '~/stores/user';
const user = useUserStore()
import { useRouter } from 'vue-router';
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