<template>
  <el-config-provider namespace="ep" :locale="setting.locale">
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { useSettingStore } from './stores/setting'
const setting = useSettingStore()
</script>