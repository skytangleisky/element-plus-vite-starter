<template>
  <div class="nav">
    <img src="/src/assets/wstdlogo.ico" class="w-40px h-40px">
    <span class="color-black p-0 m-0" style="height:40px;line-height: 40px;font-size: 2rem;">珠海光恒科技雷达设备组网数据采集管理系统</span>
    <div class="absolute right-0 items-center hidden lg:flex">
      <div style="display: flex;align-items: center;color:black;">
        <el-dropdown v-if="user.logined" trigger="click" size="small">
          <el-avatar :size="32" :src="user.avatar">
            <!-- <span class="el-dropdown-link"><User style="width:24px;height:24px;"></User></span> -->
          </el-avatar>
          <img :src="user.avatar" style="width:24px;height:24px;border-radius:50%;">
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="!user.logined" @click="login" :icon="Select">登陆</el-dropdown-item>
              <!-- <el-dropdown-item :icon="ColdDrink">捐赠</el-dropdown-item> -->
              <el-dropdown-item :icon="Setting">设置</el-dropdown-item>
              <el-dropdown-item v-if="user.logined" divided @click="logout" :icon="SwitchButton">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <div v-else @click="login" class="QQ_Login_Button"></div> -->
        {{ user.username }}
      </div>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { useUserStore } from '~/stores/user'
import { Select, Setting, Close, SwitchButton, ColdDrink, User, CloseBold } from '@element-plus/icons-vue'
import router from '~/router'
const user = useUserStore()
const login = () => {

}
const logout = () => {
  user.Logout()
  router.push({path:'/login'})
}
</script>
<style lang="scss">
.nav{
  width: 100%;
  height: 40px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
}
</style>