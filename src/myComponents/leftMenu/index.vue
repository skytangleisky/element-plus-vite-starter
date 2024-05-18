<template>
  <div class="relative flex flex-col">
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
        :default-openeds="user.defaultOpends"
        :default-active="user.defaultActive"
        @open="open"
        @close="close"
        @select="select"
        style="border-right: 0"
      >
        <SubMenu
          v-for="route in routes"
          :absoluteRootPath="absoluteRootPath"
          :key="route.name"
          :item="route"
        ></SubMenu>
      </el-menu>
    </el-scrollbar>
    <el-select
      v-if="DEV"
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
import { isDark } from "~/composables";
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { useIconStore } from "~/stores/icon";
const icon = useIconStore();
const modules = import.meta.glob("~/**/*.vue");
const languages = ref(modules);
import { useRouter } from "vue-router";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { useUserStore } from "~/stores/user";
const user = useUserStore();
let router = useRouter();
const absoluteRootPath = ref("");
import { intersection } from "~/tools";
const routes = computed(() => {
  let arr = new Array<any>();
  setting.routes.map((item: any) => {
    if (item.children) {
      if (!item.meta || !item.meta.roles || intersection(user.roles, item.meta.roles)) {
        arr.push(item);
      }
    }
  });
  if (arr.length == 1) {
    absoluteRootPath.value = "/" + arr[0].path;
    return arr[0].children;
  } else {
    absoluteRootPath.value = "";
    return arr;
  }
});
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
        list[i] = Object.assign(list[i], {
          component: v,
        });
      }
    }
  }
  fn(setting.routes);
  router.getRoutes().forEach((v) => {
    v.name && router.removeRoute(v.name);
  });
  array2components(setting.routes, user.roles).map((v: any) => {
    router.addRoute(v);
  });
  nextTick(() => {
    router.push({ path: "/ry/map", replace: true });
  });
};
watch(
  () => setting.routes,
  (routes) => {
    router.getRoutes().forEach((v) => {
      v.name && router.removeRoute(v.name);
    });
    array2components(routes, user.roles).map((v: any) => {
      router.addRoute(v);
    });
    nextTick(() => {
      router.replace(router.currentRoute.value.fullPath);
      // router.replace({ ...router.currentRoute.value, force: true });
    });
  },
  {
    deep: true,
  }
);
const open = (id: string) => {
  user.defaultOpends.push(id);
};
const close = (id: string) => {
  user.defaultOpends = user.defaultOpends.filter((item) => item != id);
};
const select = (id: string) => {
  user.defaultActive = id;
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
