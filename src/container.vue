<template>
  <div class="app-container">
    <!-- <box>{{ t("tl.Success") }}</box> -->
    <search></search>
    Using <a href="https://cn.vuejs.org/" target="_blank">Vue</a> v{{ vueVersion }},<a href="https://element-plus.gitee.io/zh-CN/" target="_blank">Element-plus</a> v{{ elementplusVersion }} and <a href="https://pinia.web3doc.top/" target="_blank">Pinia</a> v{{ piniaVersion }}.
    <el-table mb-1 :data="[]" />
    <el-pagination :total="100" />
    <BaseHeader />
    <!-- <div style="display: flex">
      <BaseSide />
      <div>
        <img alt="Vue logo" class="element-plus-logo" src="./assets/logo.png" />
        <HelloWorld msg="Hello Vue 3.0 + Element Plus + Vite" />
      </div>
    </div> -->
    <div class="nav-wrapper"></div>
    <test-button></test-button>
    <test-border></test-border>
    <!-- <remote-component></remote-component> -->
  </div>
</template>
<script setup>
import { version as piniaVersion } from 'pinia/package.json'
import { version as vueVersion } from 'vue/package.json'
import { version as elementplusVersion } from 'element-plus/package.json'
import { useLocale } from 'element-plus'
let { t } = useLocale()
</script>
<script>
import RemoteComponent from './myComponents/remoteComponent.vue'
import TestButton from './elementplus/basic/button.vue'
import TestBorder from './elementplus/basic/border.vue'
import * as Vue from 'vue'
import Box from './myComponents/box.vue'
import Search from './myComponents/search.vue'
// import zhCn from './languages/zh-cn.mjs'
// import en from './languages/en.mjs'

export default {
  data(){
    return {

    }
  },
  components:{
    TestButton,
    TestBorder,
    RemoteComponent,
    Box,
    Search
  },
  mounted () {
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}
.app-container{
  overflow:auto;
  width: 100vw;
  height: 100vh;
  background-size: cover;
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
    overflow:auto;
    width: 100vw;
    height: 100vh;
    background: url(assets/newBg.jpg);
    background-size: cover;
  }
}
</style>