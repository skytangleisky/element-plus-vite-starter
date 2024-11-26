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
      v-model:loadmap="setting.人影.回放.loadmap"
      v-model:district="setting.人影.回放.district"
      v-model:tile="setting.人影.回放.tile"
      v-model:center="setting.人影.回放.center"
      v-model:zoom="setting.人影.回放.zoom"
    ></edit-map>
    <el-date-picker
      class="bg-#fff dark:bg-#2b2b2b"
      style="position: absolute; left: 20px; top: 10px"
      v-model="value2"
      type="datetimerange"
      start-placeholder="Start Date"
      end-placeholder="End Date"
      :default-time="defaultTime2"
    />
    <time-line
      :data="data"
      @toLeft="change"
      @toRight="change"
      @toMiddle="change"
      v-model:now="setting.playback.now"
      v-model:status="setting.playback.status"
      v-model:level="setting.playback.level"
      style="position: relative"
    ></time-line>
  </div>
</template>
<script lang="ts" setup>
import { useSettingStore } from "~/stores/setting";
import timeLine from "~/tools/timeLine.vue";
const setting = useSettingStore();
import editMap from "../editMap.vue";
import { ref, reactive } from "vue";
const value2 = ref("");
const defaultTime2 = [new Date(2000, 1, 1, 12, 0, 0), new Date(2000, 2, 1, 8, 0, 0)];
const data = reactive([]);
let preTime: number;
const change = (it: any) => {
  if (it.time !== preTime) {
    // to do
    preTime = it.time;
  }
};
</script>
