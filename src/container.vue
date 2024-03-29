<template>
  <my-header></my-header>
  <div class="flex flex-row" style="width: 100%; height: calc(100% - 40px)">
    <left-menu></left-menu>
    <div
      class="relative w-full h-full b-solid b-red b-0px box-border"
      style="overflow: auto"
    >
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component
            :key="
              $route.meta?.time
                ? $route.fullPath + '?time=' + $route.meta.time
                : $route.fullPath
            "
            :is="Component"
          />
        </keep-alive>
      </router-view>
    </div>
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
<script setup name="contain">
import { ref, onMounted } from "vue";
// import { version as piniaVersion } from "~/tools/pinia/src/package.json'
// import { version as vueVersion } from 'vue/package.json'
// import { version as elementplusVersion } from 'element-plus/package.json'
// import { version as vueRouterVersion } from 'vue-router/package.json'
// import RemoteComponent from './myComponents/remoteComponent.vue'
// import TestButton from './elementplus/basic/button.vue'
// import TestBorder from './elementplus/basic/border.vue'
// import Search from "./myComponents/search.vue";
import myHeader from "./header.vue";
import leftMenu from "./myComponents/leftMenu/index.vue";
import { useExclude } from "./myComponents/bus";
const exclude = useExclude();
onMounted(() => {
  exclude.length = 0; //当组件被渲染后，该组件应该可以一直被复用
});
// const list = ref([{name:'测试',left:true,children:[{name:'456',leftImgSrc:'checked.svg'},{name:'789',leftImgSrc:'checked.svg'}]}])
// setTimeout(()=>{
//   list.value = undefined
// },1000)

// <component :is="Component" /> // 存在的问题是相同组件在router-view中无法区分
// <component :key="$route.fullPath" :is="Component" /> // 存在的问题是路由组件无法热更新
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
.element-plus-logo {
  width: 50%;
}
</style>
