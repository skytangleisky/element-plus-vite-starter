<template>
  <template v-if="!item.hide">
    <el-sub-menu v-if="item.children" :index="item.name">
      <template #title>
        <el-icon v-dompurify-html="format(item.svg)"></el-icon>
        <span>{{ item.label }}</span>
      </template>
      <SubMenu
        v-for="route in item.children"
        :absoluteRootPath="`${absoluteRootPath}/${item.path}`"
        :key="route.name"
        :item="route"
      ></SubMenu>
    </el-sub-menu>
    <router-link
      v-else
      :to="`${absoluteRootPath}/${item.path}`"
      :replace="item.replace"
      style="text-decoration: none"
    >
      <el-menu-item :index="item.name">
        <el-icon v-dompurify-html="format(item.svg)" />
        <template #title>{{ item.label }}</template>
        <!-- <template #title>{{ `${absoluteRootPath}/${item.path}` }}</template> -->
      </el-menu-item>
    </router-link>

    <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon v-dompurify-html="test"></el-icon>
        <span>Navigator One</span>
      </template>
      <el-menu-item index="1-1">item one</el-menu-item>
      <el-menu-item index="1-2">item two</el-menu-item>
      <el-menu-item index="1-3">item three</el-menu-item>
      <el-sub-menu index="1-4">
        <template #title>item four</template>
        <el-menu-item index="1-4-1">item one</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="2">
      <el-icon><icon-menu /></el-icon>
      <span>Navigator Two</span>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <el-icon><document /></el-icon>
      <span>Navigator Three</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <span>Navigator Four</span>
    </el-menu-item> -->
  </template>
</template>
<script lang="ts" setup>
import { useIconStore } from "~/stores/icon";
const icon = useIconStore();
let DEV = import.meta.env.DEV;
const { item } = defineProps({
  item: {
    type: Object,
    default: { hide: true, name: "name", label: "label" },
  },
  absoluteRootPath: {
    type: String,
    default: "",
  },
});
const format = (svg: string) => {
  let res = icon.results.filter((it) => it.uuid == svg);
  if (res.length <= 0) {
    return "";
  } else if (res.length == 1) {
    return res[0].svg;
  } else {
    throw Error("uuid duplication!");
  }
};
</script>
<style lang="scss"></style>
