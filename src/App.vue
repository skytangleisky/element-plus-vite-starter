<template>
  <el-config-provider
    namespace="ep"
    :locale="setting.locale"
    :message="{ max: undefined }"
  >
    <router-view v-slot="{ Component }">
      <keep-alive :exclude="exclude">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { useSettingStore } from "./stores/setting";
const setting = useSettingStore();
import { useExclude } from "./myComponents/bus";
const exclude = useExclude();
</script>
