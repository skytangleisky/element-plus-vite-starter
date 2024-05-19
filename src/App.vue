<template>
  <el-config-provider namespace="ep" :locale="user.locale" :message="{ max: Infinity }">
    <router-view v-slot="{ Component }">
      <keep-alive :exclude="exclude">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
  <websocket v-permission="['admin']"></websocket>
</template>
<script lang="ts" setup>
import websocket from "~/myComponents/websocket/index.vue";
import { useUserStore } from "./stores/user";
const user = useUserStore();
import { useExclude } from "./myComponents/bus";
const exclude = useExclude();
</script>
