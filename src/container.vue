<template>
  <my-header></my-header>
  <div class="flex flex-row flex-1">
    <left-menu></left-menu>
    <menus class="menus"><!--<div class="nav-wrapper">人影空域申报系统</div>--></menus>
  </div>
  <!-- <search></search> -->
  <!-- Using <a href="https://cn.vuejs.org/" target="_blank">Vue</a> v{{ vueVersion }}, <a href="https://element-plus.org/zh-CN" target="_blank">Element-plus</a> v{{ elementplusVersion }}, <a href="https://pinia.web3doc.top/" target="_blank">Pinia</a> v{{ piniaVersion }} and <a href="https://router.vuejs.org/" target="_blank">Vue-router</a> v{{ vueRouterVersion }}. -->
  <!-- <el-table mb-1 :data="[]" /> -->
  <!-- <BaseHeader /> -->
  <!-- <div style="display: flex">
    <BaseSide />
    <div>
      <img alt="Vue logo" class="element-plus-logo" src="./assets/logo.png" />
      <HelloWorld msg="Hello Vue 3.0 + Element Plus + Vite" />
    </div>
  </div> -->
  <!-- <test-button></test-button> -->
  <!-- <test-border></test-border> -->
  <!-- <remote-component></remote-component> -->
</template>
<script setup>
import { ref } from 'vue'
// import { version as piniaVersion } from 'pinia/package.json'
// import { version as vueVersion } from 'vue/package.json'
// import { version as elementplusVersion } from 'element-plus/package.json'
// import { version as vueRouterVersion } from 'vue-router/package.json'
// import RemoteComponent from './myComponents/remoteComponent.vue'
// import TestButton from './elementplus/basic/button.vue'
// import TestBorder from './elementplus/basic/border.vue'
import Search from './myComponents/search.vue'
import myHeader from './header.vue'
import Menus from './myComponents/menu/index.vue'
import leftMenu from './myComponents/leftMenu/index.vue'

// const list = ref([{name:'测试',left:true,children:[{name:'456',leftImgSrc:'checked.svg'},{name:'789',leftImgSrc:'checked.svg'}]}])
// setTimeout(()=>{
//   list.value = undefined
// },1000)
</script>

<style lang="scss">
.menus{
  width: 100%;
  height: calc(100vh - 40px);
}
@media (prefers-color-scheme: light) {
  /** ... */
}
@media (prefers-color-scheme: dark) {
  /** ... */
}
@media (prefers-color-scheme: no-preference) {
  /** ... */
}
#app {
  color: var(--ep-text-color-primary);
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}
.nav-wrapper{
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  line-height: 50px;
  font-size: 1.5em;
  height: 65px;
  background: url(assets/nav.png) no-repeat;
  background-size:100% 100%;
  pointer-events: none;
}
.element-plus-logo {
  width: 50%;
}
</style>