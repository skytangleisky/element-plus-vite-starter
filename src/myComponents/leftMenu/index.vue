<template>
  <div
    class="flex flex-col"
    style="color: black; background-color: #304156; overflow: auto; min-width: 240px"
  >
    <el-menu
      :key="setting.menuKey"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      class="el-menu-vertical-demo"
      :default-openeds="setting.defaultOpends"
      :default-active="setting.defaultActive"
      style="width: 100%; flex: 1; border-right: 0"
      @open="open"
      @close="close"
      @select="select"
    >
      <SubMenu v-for="route in setting.routes" :key="route.name" :item="route"></SubMenu>
    </el-menu>
    <el-select
      v-model="setting.component"
      filterable
      style="width: 100%"
      @change="change"
    >
      <el-option v-for="(k, v) in languages" :key="v" :label="v" :value="v" />
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onActivated } from "vue";
import { useIconStore } from "~/stores/icon";
const icon = useIconStore();
const modules = import.meta.glob("~/**/*.vue");
const languages = ref(modules);
import { useRouter } from "vue-router";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
const router = useRouter();
import SubMenu from "./SubMenu.vue";
import { array2components } from "~/tools";
setting.menuKey++;
onMounted(() => {
  icon.FetchList();
});
onActivated(() => {
  setting.menuKey++;
  icon.FetchList();
});
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
const open = (id: string) => {
  setting.defaultOpends.push(id);
};
const close = (id: string) => {
  setting.defaultOpends = setting.defaultOpends.filter((item) => item != id);
};
const select = (id: string) => {
  setting.defaultActive = id;
};
</script>
<style lang="scss">
.submenu-title-noDropdown,
.ep-sub-menu__title {
  &:hover {
    background-color: #263445 !important;
  }
}

.is-active > .ep-submenu__title {
  color: #f4f4f5 !important;
}
.ep-sub-menu {
  .ep-menu {
    background-color: #1f2d3d !important;
    .ep-menu-item:hover {
      background-color: #001528 !important;
    }
  }
}
</style>
