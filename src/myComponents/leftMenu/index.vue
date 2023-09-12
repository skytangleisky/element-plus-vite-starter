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
import { array2components } from "~/tools";
const change = (v: any) => {
  function fn(list: any[]) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].children instanceof Array) {
        fn(list[i].children);
      }
      if (list[i].name === "a7ef7b88-5e6b-0c62-129b-00a18980cdce") {
        list[i] = {
          ...list[i],
          path: "map",
          name: "a7ef7b88-5e6b-0c62-129b-00a18980cdce",
          component: v,
          label: "地图",
        };
      }
    }
  }
  fn(setting.routes);

  router.getRoutes().forEach((v) => {
    v.name && router.removeRoute(v.name);
  });
  array2components(setting.routes).map((v: any) => {
    router.addRoute(v);
  });
  router.push({ path: "/map", replace: false });
};
</script>
