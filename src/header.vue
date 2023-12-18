<template>
  <div class="nav">
    <img src="/src/assets/wstdlogo.ico" class="w-40px h-40px hidden" />
    <span
      class="color-black p-0 m-0 dark:color-white"
      style="height: 40px; line-height: 40px; font-size: 2rem"
      >雷达设备组网数据采集管理系统</span
    >
    <div class="absolute right-0 items-center hidden lg:flex">
      <div
        class="color-black dark:color-white"
        style="display: flex; align-items: center"
      >
        <el-dropdown v-if="user.logined" trigger="click" size="small">
          <el-avatar :size="32" :src="user.avatar">
            <!-- <span class="el-dropdown-link"><User style="width:24px;height:24px;"></User></span> -->
          </el-avatar>
          <img :src="user.avatar" style="width: 24px; height: 24px; border-radius: 50%" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="!user.logined" @click="login" :icon="Select"
                >登陆</el-dropdown-item
              >
              <!-- <el-dropdown-item :icon="ColdDrink">捐赠</el-dropdown-item> -->
              <el-dropdown-item :icon="Setting" @click="click">设置</el-dropdown-item>
              <el-dropdown-item :icon="Switch" @click="Reset">重置</el-dropdown-item>
              <el-dropdown-item
                v-if="user.logined"
                divided
                @click="logout"
                :icon="SwitchButton"
                >退出</el-dropdown-item
              >
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
import { h } from "vue";
import {
  Select,
  Setting,
  Close,
  SwitchButton,
  ColdDrink,
  User,
  CloseBold,
  Switch,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage } from "element-plus";
import { useSettingStore } from "./stores/setting";
const setting = useSettingStore();
import { useStationStore } from "./stores/station";
const station = useStationStore();
import { useIconStore } from "./stores/icon";
const icon = useIconStore();
import { useUserStore } from "~/stores/user";
const user = useUserStore();
import { useDataStore } from "./stores/data";
const data = useDataStore();

const click = () => {
  setting.$resetFields();
};
const Reset = () => {
  setting.$reset();
  setting.$dispose();
  icon.$reset();
  station.$reset();
  data.$reset();
  user.$reset();
  user.Logout().catch((e) => {
    throw e;
  });
  sessionStorage.clear();
  localStorage.clear();
  router.replace({ ...router.currentRoute.value, force: true });
};
const login = () => {};
const logout = () => {
  user.$reset();
  user.Logout().catch((e) => {
    throw e;
  });
  sessionStorage.clear();
  router.push({ path: "/login", replace: true });

  // user.Logout().then(()=>{
  //   router.push({path:'/login',replace:true})
  // }).catch(e=>{
  //   ElMessage({
  //     message: h('p', null, [
  //       // h('span', null, 'Message can be '),
  //       h('i', { style: 'color: teal' }, e.message),
  //     ]),
  //     type:'error'
  //   })
  // })
};
</script>
<style lang="scss">
.nav {
  width: 100%;
  height: 40px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
}
.dark .nav {
  background-color: #292a2d;
}
</style>
