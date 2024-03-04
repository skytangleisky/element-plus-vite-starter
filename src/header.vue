<template>
  <div class="nav">
    <div class="items-center flex">
      <div
        class="color-black dark:color-white"
        style="display: flex; align-items: center"
      >
        <el-dropdown v-if="user.logined" trigger="click" size="small">
          <el-avatar :size="32" :src="user.avatar" style="margin: 0 8px">
            <!-- <span class="el-dropdown-link"><User style="width:24px;height:24px;"></User></span> -->
          </el-avatar>
          <img :src="user.avatar" style="width: 24px; height: 24px; border-radius: 50%" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-if="!user.logined" @click="login" :icon="Select"
                >登陆</el-dropdown-item
              >
              <!-- <el-dropdown-item :icon="ColdDrink">捐赠</el-dropdown-item> -->
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
        {{ user.username }}，欢迎您！
      </div>
    </div>
    <span class="title color-black p-0 m-0 dark:color-white md:block hidden"
      >低空飞行安全监控系统</span
    >
    <div style="line-height: 40px" class="flex items-center">
      <el-icon style="font-size: 1.5rem; width: 2rem" @click="toggleDark()"
        ><Moon v-if="isDark" /><Sunny v-else
      /></el-icon>
      <el-icon style="font-size: 1.5rem; width: 2rem" @click="click"><Setting /></el-icon>
      <el-icon
        style="font-size: 1.5rem; width: 2rem"
        @click="logout"
        v-html="logoutRaw"
      ></el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { h } from "vue";
import logoutRaw from "~/assets/logout.svg?raw";
import {
  Select,
  Setting,
  Close,
  SwitchButton,
  ColdDrink,
  User,
  CloseBold,
  Switch,
  Moon,
  Sunny,
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
import { toggleDark, isDark } from "~/composables";
const click = () => {
  let prev = setting.loadmap;
  setting.$resetFields("loadmap"); //单独重置某项设置,store热更新后无效
  console.log("loadmap", prev, "->", setting.loadmap);
};
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
  router.replace({ ...router.currentRoute.value, force: true }); //需要销毁的已缓存的组件无法被销毁，所以目前只能用下面的方式
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
<style scoped lang="scss">
.nav {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: aliceblue;
  display: flex;
  justify-content: space-between;
  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 40px;
    line-height: 40px;
    font-size: 2rem;
    padding: 2px 20px;
    background: #0d7c9d;
    clip-path: polygon(10px 100%, calc(100% - 10px) 100%, 100% 0, 0 0);
  }
}
.dark .nav {
  background-color: #292a2d;
}
</style>
