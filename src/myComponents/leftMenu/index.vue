<template>
  <div class="flex flex-col">
    <el-scrollbar
      class="flex-1"
      :style="`height: 100%; background-color: ${isDark ? '#304156' : '#eee'};${
        isCollapse ? '' : 'min-width:210px'
      }`"
    >
      <el-menu
        :background-color="isDark ? '#304156' : '#eee'"
        :text-color="isDark ? '#bfcbd9' : '#000'"
        :active-text-color="isDark ? '#409eff' : '#ffd04b'"
        :collapse="isCollapse"
        class="el-menu-vertical-demo"
        :default-openeds="setting.defaultOpends"
        :default-active="setting.defaultActive"
        @open="open"
        @close="close"
        @select="select"
        style="border-right: 0"
        v-permission="['admin']"
      >
        <!-- <SubMenu
          v-permission="['prod']"
          v-for="route in setting.routes[0].children"
          :key="route.name"
          :item="route"
          absoluteRootPath="/contain"
        ></SubMenu> -->
        <SubMenu
          v-for="route in setting.routes"
          :key="route.name"
          :item="route"
        ></SubMenu>
      </el-menu>
      <el-menu
        :background-color="isDark ? '#304156' : '#eee'"
        :text-color="isDark ? '#bfcbd9' : '#000'"
        :active-text-color="isDark ? '#409eff' : '#ffd04b'"
        :collapse="isCollapse"
        class="el-menu-vertical-demo"
        :default-openeds="setting.defaultOpends"
        :default-active="setting.defaultActive"
        @open="open"
        @close="close"
        @select="select"
        style="border-right: 0"
        v-permission="['prod']"
      >
        <SubMenu
          v-for="route in setting.routes[0].children"
          :key="route.name"
          :item="route"
          absoluteRootPath="/contain"
        ></SubMenu>
      </el-menu>
    </el-scrollbar>
    <!-- <el-select
      v-model="setting.component"
      filterable
      style="width: 100%"
      @change="change"
    >
      <el-option v-for="(k, v) in languages" :key="v" :label="v" :value="v" />
    </el-select> -->
  </div>
</template>
<script lang="ts" setup>
import { isDark } from "~/composables";
import { ref, onMounted, watch, nextTick } from "vue";
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
let DEV = import.meta.env.DEV;
onMounted(() => {
  icon.FetchList();
});
const isCollapse = ref(false);
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
  (array2components(setting.routes) as Array<any>).map((v: any) => {
    router.addRoute(v);
  });
  router.push({ path: "/contain/map", replace: false });
};
watch(
  () => setting.routes,
  (routes) => {
    console.log(routes);
    router.getRoutes().forEach((v) => {
      v.name && router.removeRoute(v.name);
    });
    (array2components(routes) as Array<any>).map((v: any) => {
      router.addRoute(v);
    });
    try {
      router.replace(router.currentRoute.value.fullPath);
    } catch (error) {
      console.log(error);
    }
  },
  {
    deep: true,
  }
);
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
.dark {
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
}
</style>
