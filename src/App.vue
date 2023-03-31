<template>
  <el-config-provider namespace="ep" :locale="setting.locale">
    ??{{ setting.locale.name }}??
    <container></container>
  </el-config-provider>
</template>
<script lang="ts" setup>
import Container from './container.vue'
import { useSettingStore } from './stores/setting.ts'
const setting = useSettingStore()
</script>