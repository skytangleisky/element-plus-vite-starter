<template>
  <div
    class="flex flex-col"
    style="color: black; background-color: #fff; overflow: auto; min-width: 240px"
  >
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-vertical-demo"
      default-active="2"
      text-color="#fff"
      style="width: 100%; flex: 1; border-right: 0"
    >
      <SubMenu v-for="route in setting.routes" :key="route.name" :item="route"></SubMenu>
    </el-menu>
    <el-select v-model="lang" filterable style="width: 100%" @change="change">
      <el-option v-for="(k, v) in languages" :key="v" :label="v" :value="v" />
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const lang = ref("/src/myComponents/openlayers/index.vue");
const modules = import.meta.glob("~/**/*.vue");
const languages = ref(modules);
import { useRouter } from "vue-router";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
const router = useRouter();
import SubMenu from "./SubMenu.vue";
const change = (v: any) => {
  // console.log(languages.value[v])

  router.addRoute("top", {
    path: "map",
    name: "abcdefg",
    component: languages.value[v],
  });
  router.push({ path: "/map", replace: false });
  console.log(router.getRoutes());
};
</script>
