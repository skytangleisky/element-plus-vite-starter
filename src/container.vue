<template>
  <div class="app-container">
    <!-- <box>{{ t("tl.Success") }}</box> -->
    <search></search>
    <el-button mb-2 @click="toggle">{{ t('tl.switchLanguage') }}</el-button>
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
import { useLocale } from 'element-plus'
import { computed, ref } from 'vue'
import zhCn from './languages/zh-cn.mjs'
import en from './languages/en.mjs'
let props = defineProps({
  value:{
    type:Object,
    default: en,
  }
})
let { t } = useLocale()
const emit = defineEmits(["update:value"]);
const toggle = () => {
  if(props.value.name==en.name){
    emit('update:value', zhCn)
    localStorage.setItem('language',zhCn.name)
  }else{
    emit('update:value', en)
    localStorage.setItem('language',en.name)
  }
}
const handleClick = () => {
  console.log('click')
}
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