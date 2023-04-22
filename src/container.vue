<template>
  <div class="app-container">
    <!-- <box>{{ t("tl.Success") }}</box> -->
    <div class="nav-wrapper"></div>
    <search></search>
    Using <a href="https://cn.vuejs.org/" target="_blank">Vue</a> v{{ vueVersion }}, <a href="https://element-plus.gitee.io/zh-CN/" target="_blank">Element-plus</a> v{{ elementplusVersion }}, <a href="https://pinia.web3doc.top/" target="_blank">Pinia</a> v{{ piniaVersion }} and <a href="https://router.vuejs.org/" target="_blank">Vue-router</a> v{{ vueRouterVersion }}.
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
  </div>
</template>
<script setup>
import { version as piniaVersion } from 'pinia/package.json'
import { version as vueVersion } from 'vue/package.json'
import { version as elementplusVersion } from 'element-plus/package.json'
import { version as vueRouterVersion } from 'vue-router/package.json'
import { useLocale } from 'element-plus'
let { t } = useLocale()
// import RemoteComponent from './myComponents/remoteComponent.vue'
import TestButton from './elementplus/basic/button.vue'
import TestBorder from './elementplus/basic/border.vue'
import Box from './myComponents/box.vue'
import Search from './myComponents/search.vue'
</script>

<style lang="scss">
@media (prefers-color-scheme: light) {
  /** ... */
}
@media (prefers-color-scheme: dark) {
  /** ... */
}
@media (prefers-color-scheme: no-preference) {
  /** ... */
}
body{
  overscroll-behavior: none;
}
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}
.app-container{
  background-size: cover;
  box-sizing: border-box;
  min-height: 100vh;
}
.nav-wrapper{
  width: 100%;
  line-height: 50px;
  height: 65px;
  background: url(assets/nav.png) no-repeat;
  background-size:100% 100%;
}
.element-plus-logo {
  width: 50%;
}
</style>
<style lang="scss">
.dark{
  .app-container{
    // background: url(assets/newBg.jpg);
    // background: #131417;
    background-size: cover;
  }
}
</style>