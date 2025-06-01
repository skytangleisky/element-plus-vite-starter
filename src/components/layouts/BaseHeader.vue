<script lang="ts" setup>
import { useTheme, isDark } from "~/theme"
const theme = useTheme()
function toggleDark() {
  isDark ? theme.value = 'light' : theme.value = 'dark'
}
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1">Element Plus</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item>
    <el-menu-item h="full" @click="toggleDark()">
      <button style="height: var(--el-menu-item-height);border:none;width: 100%;background-color: transparent;cursor: pointer;">
        <i inline-flex i="dark:ep-moon ep-sunny"></i>
      </button>
    </el-menu-item>
  </el-menu>
</template>
