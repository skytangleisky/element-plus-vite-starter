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
  <websocket></websocket>
</template>
<script lang="ts" setup>
import websocket from "~/myComponents/websocket/index.vue";
import { useSettingStore } from "./stores/setting";
const setting = useSettingStore();
import { useExclude } from "./myComponents/bus";
const exclude = useExclude();
</script>
