<template>
  <el-slider
    v-model="value"
    show-input
    :format-tooltip="formatTooltip"
    :min="1"
    :max="max"
    @input="input"
  />
  <div class="media">
    <el-icon v-html="playStatus == 'play' ? playSvg : pauseSvg" @click="click"></el-icon>
    <el-icon v-html="stopSvg" @click="stop"></el-icon>
    <el-icon v-html="nextSvg" style="transform: rotate(180deg)" @click="prev"></el-icon>
    <el-icon v-html="nextSvg" @click="next"></el-icon>
    播放速度：
    <el-slider
      style="width: 100px; padding-left: 4px"
      v-model="speed"
      :show-tooltip="false"
      :min="0"
      :max="100"
    />
  </div>
</template>
<script lang="ts" setup>
import pauseSvg from "~/assets/pause.svg?raw";
import playSvg from "~/assets/play.svg?raw";
import stopSvg from "~/assets/stop.svg?raw";
import nextSvg from "~/assets/next.svg?raw";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useBus } from "../bus";
let timer: number;
let playStatus = ref("play");
const speed = ref(0);
const click = () => {
  if (playStatus.value == "play") {
    playStatus.value = "pause";
    if (value.value == max.value) {
      value.value = 1;
    }
    let func = () => {
      if (value.value == max.value) {
        playStatus.value = "play";
        clearTimeout(timer);
      } else {
        value.value++;
      }
      timer = setTimeout(func, 500 - (400 / 100) * speed.value);
    };
    timer = setTimeout(func, 500 - (400 / 100) * speed.value);
  } else if (playStatus.value == "pause") {
    playStatus.value = "play";
    clearTimeout(timer);
  }
};
const stop = () => {
  value.value = max.value;
  playStatus.value = "play";
};
const prev = () => {
  clearTimeout(timer);
  playStatus.value = "play";
  value.value > 1 && value.value--;
};
const next = () => {
  clearTimeout(timer);
  playStatus.value = "play";
  value.value < max.value && value.value++;
};
const input = () => {
  clearTimeout(timer);
  playStatus.value = "play";
};
const bus = useBus();
const value = ref(100);
const max = ref(100);
const formatTooltip = (val: number) => {
  return ((Number(val) / max.value) * 100).toFixed(3) + "%";
};
import { getData } from "~/api/rhi.js";
onMounted(() => {
  getData({ offset: 0, preLimit: 0, clientTime: performance.now() }).then((res: any) => {
    let totalTime = performance.now() - res.data.properties.clientTime;
    let serverProcessTime = res.data.properties.processTime;
    let networkTime = totalTime - serverProcessTime;
    console.log(
      "服务端处理时长",
      serverProcessTime.toFixed(2) + "ms",
      "网络传输时长",
      networkTime.toFixed(2) + "ms"
    );
    max.value = res.data.ObservationInfo.RcdNum;
    value.value = max.value;
    console.log(res.data);
    getData({ offset: max.value - 1, preLimit: 100, clientTime: performance.now() }).then(
      (res: any) => {
        let totalTime = performance.now() - res.data.properties.clientTime;
        let serverProcessTime = res.data.properties.processTime;
        let networkTime = totalTime - serverProcessTime;
        console.log(
          "服务端处理时长",
          serverProcessTime.toFixed(2) + "ms",
          "网络传输时长",
          networkTime.toFixed(2) + "ms"
        );
        value.value = max.value;
        console.log(res.data);
      }
    );
  });
});
watch(value, (value) => {
  if (value && 1 <= value && value <= max.value) {
    getData({ offset: value - 1, preLimit: 1, clientTime: performance.now() })
      .then((res: any) => {
        let totalTime = performance.now() - res.data.properties.clientTime;
        let serverProcessTime = res.data.properties.processTime;
        let networkTime = totalTime - serverProcessTime;
        console.log(
          "服务端处理时长",
          serverProcessTime.toFixed(2) + "ms",
          "网络传输时长",
          networkTime.toFixed(2) + "ms"
        );
        bus.listData = res.data.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>
<style lang="scss">
.media {
  white-space: nowrap;
  display: flex;
  align-items: center;
  .ep-icon {
    font-size: 1.4rem;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin: 0 4px;
    &:hover {
      border: 1px solid #888;
    }
    &:active {
      border: 1px solid #ddd;
    }
  }
}
</style>
