<template>
  <el-config-provider namespace="ep" :locale="setting.locale">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { useSettingStore } from './stores/setting'
const setting = useSettingStore()
</script>