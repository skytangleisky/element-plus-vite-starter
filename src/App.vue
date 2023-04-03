<template>
  <el-config-provider namespace="ep" :locale="setting.locale">
    <container></container>
  </el-config-provider>
</template>
<script lang="ts" setup>
import Container from './container.vue'
import { useSettingStore } from './stores/setting'
const setting = useSettingStore()
</script>