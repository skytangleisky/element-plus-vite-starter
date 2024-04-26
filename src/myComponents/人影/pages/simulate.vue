<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: absolute;
    "
  >
    <edit-map
      style="backdrop-filter: blur(25px); position: relative"
      v-model:loadmap="setting.人影.模拟.loadmap"
      v-model:district="setting.人影.模拟.district"
      v-model:tile="setting.人影.模拟.tile"
      v-model:center="setting.人影.模拟.center"
      v-model:zoom="setting.人影.模拟.zoom"
    ></edit-map>
  </div>
</template>
<script lang="ts" setup>
import editMap from "../editMap.vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
</script>
