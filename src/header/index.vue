<template>
  <div ref="navRef" class="nav">
    <div style="display: flex;">
      <div class="title">
        {{ router.currentRoute.value.matched[0].meta.label }}
      </div>
      <div style="line-height: 56px;padding-left: 40px;display: flex;align-items: center;z-index: 0">
        <el-icon
          v-html="setting.isCollapse ? openSvg : collapseSvg"
          style="font-size: 25px; padding: 0 10px"
          @click="setting.isCollapse = !setting.isCollapse"
        ></el-icon>
        <breadcrumb></breadcrumb>
      </div>
    </div>
    <!-- <span class="title inline-block color-black p-0 m-0 dark:color-white md:block hidden">北京人影演示系统</span> -->
    <div style="align-items: center;display: flex;z-index: 0;">
      <div
        v-if="user.logined"
        class="loginInfo"
        style="display: flex; align-items: center; white-space: nowrap;"
      >
        <!-- <div v-else @click="login" class="QQ_Login_Button"></div> -->
        <DigitalClock style="margin-right: 40px;font-size: 20px;"/>
        {{ user.username }}，欢迎您！
        <el-dropdown v-if="user.logined" trigger="click" size="small">
          <el-avatar :size="32" :src="user.avatar" style="margin: 0 8px">
            <!-- <span class="el-dropdown-link"><User style="width:24px;height:24px;"></User></span> -->
          </el-avatar>
          <img :src="user.avatar" style="width: 24px; height: 24px; border-radius: 50%"/>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item @click="login" :icon="Select">登陆</el-dropdown-item> -->
              <!-- <el-dropdown-item :icon="ColdDrink">捐赠</el-dropdown-item> -->
              <el-dropdown-item @click="toggleDark()"><el-icon v-html="isDark ? Moon : Sunny"/>主&emsp;题</el-dropdown-item>
              <el-dropdown-item @click="Reset"><el-icon v-html="ResetSvg" style="font-size: 1em;"/>重&emsp;置</el-dropdown-item>
              <el-dropdown-item  slot="dropdown" @click="userClick"><el-icon v-html="LockSvg"></el-icon>改密码</el-dropdown-item>
              <el-dropdown-item
                v-if="user.logined"
                divided
                @click="logout"
                >
                <el-icon v-html="ExitSvg"/>退&emsp;出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LockSvg from '~/assets/lock.svg?raw'
import DigitalClock from '~/tools/DigitalClock.vue';
import ResetSvg from '~/assets/reset.svg?raw'
import openSvg from "~/assets/expand.svg?raw";
import collapseSvg from "~/assets/collapse.svg?raw";
import breadcrumb from "~/myComponents/breadcrumb.vue";
import logoutRaw from "~/assets/logout.svg?raw";
import Moon from '~/assets/moon.svg?raw'
import Sunny from '~/assets/sun.svg?raw'
import ExitSvg from '~/assets/exit.svg?raw'
import {
  Select,
  Setting,
  Close,
  SwitchButton,
  ColdDrink,
  User,
  CloseBold,
} from "@element-plus/icons-vue";
import {ref,watch,onMounted} from 'vue'
import { useRouter } from "vue-router";
const router = useRouter();
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
import { useTheme,isDark } from "~/theme";
const theme = useTheme();
const toggleDark = () => {
  isDark.value ? theme.value = "light" : theme.value = "dark";
};
const click = () => {
  setting.$resetFields("无人机.监控.loadmap");
};
import { useExclude } from "~/myComponents/bus";
const exclude = useExclude();
const navRef = ref()
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
const login = () => {};
const emits = defineEmits(['editUser'])
function userClick(){
  emits('editUser')
}
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
onMounted(()=>{
  watch(()=>setting.hueRotate,(angle)=>{
    navRef.value.style.setProperty('--angle',`${angle}deg`)
  },{immediate:true})
})
</script>
<style scoped lang="scss">
.nav {
  .loginInfo{
    color:black;
  }
  filter:drop-shadow(0px 0px 2px rgba(0,0,0,1));
  position: relative;
  z-index: 5;
  width: 100%;
  height: 56px;
  line-height: 56px;
  display: flex;
  justify-content: space-between;
  --angle: 0deg;
  &::before{
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    // background-image: url(./bg2.png);
    background-color: #fff;
    background-size: auto 100%;
    background-repeat: repeat no-repeat;
    filter:hue-rotate(var(--angle));
  }
  .title {
    padding-left:25px;
    position: relative;
    z-index: 1;
    text-shadow: 2px 2px 0px #888;
    color:black;
    font-size: 30px;
    line-height: 60px;
    &::before{
      background-image:linear-gradient(to bottom, #eee 0, #eee calc(100% - 1px),#888 calc(100% - 1px), #888 100%);
      z-index: -1;
      content:'';
      position: absolute;
      left:0;
      top:0;
      width: 100%;
      height: calc(100% + 4px);
    }
    &::after{
      background-color: #eee;
      background-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M0,60 Q30,60 30,30 T60,0" fill="none" stroke="%23888" stroke-width="2" /></svg>');
      z-index: -1;
      content:'';
      position: absolute;
      right:-100%;
      top:0;
      width: 100%;
      height: calc(100% + 4px);
      clip-path: path('M0,0 L0,60 Q30,60 30,30 T60,0Z');
    }
    // clip-path: polygon(10px 100%, calc(100% - 10px) 100%, 100% 0, 0 0);
  }
}
.dark .nav{
  .loginInfo{
    color:white;
  }
  background-color: #000;
  &::before{
    filter:hue-rotate(var(--angle));
    background-image:linear-gradient(to bottom, hsl(213, 49%, 22%) 0,hsl(212, 51%, 20%) 10%, hsl(212, 51%, 20%) 70%, hsl(212, 43%, 28%) calc(100% - 1px),hsl(208, 100%, 50%) calc(100% - 1px), hsl(208, 100%, 50%) 100%);
  }
  .title{
    text-shadow: 2px 2px 0px #642eff;
    color:#D0E2FC;
    &::before{
      filter:hue-rotate(var(--angle));
      background-image:linear-gradient(to bottom, hsl(213, 49%, 22%) 0,hsl(212, 51%, 20%) 10%, hsl(212, 51%, 20%) 70%, hsl(212, 43%, 28%) calc(100% - 1px),hsl(208, 100%, 50%) calc(100% - 1px), hsl(208, 100%, 50%) 100%);
    }
    &::after{
      filter:hue-rotate(var(--angle));
      background-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M0,60 Q30,60 30,30 T60,0" fill="none" stroke="%230089fe" stroke-width="2" /></svg>'),linear-gradient(to bottom, hsl(214, 49%, 22%) 0,hsl(212, 51%, 20%) 10%, hsl(212, 51%, 20%) 70%, hsl(212, 43%, 28%) calc(100% - 1px),hsl(208, 100%, 50%) calc(100% - 1px), hsl(208, 100%, 50%) 100%);
    }
  }
}

.dark .DigitalClock{
  color:#0f0;
}
.DigitalClock{
  color:black;
}
</style>
