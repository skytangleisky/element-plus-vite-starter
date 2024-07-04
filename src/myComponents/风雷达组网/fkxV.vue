<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="font-size: 20px; color: rgb(78, 129, 184)">风廓线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div ref="fkxContainer" class="w-full flex-1 h-full"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import DBS from "~/tools/fkxV.js";
import { isDark } from "~/composables";
import { useBus } from "~/myComponents/bus";
const bus = useBus();
const fkxContainer = ref(null);
import { eventbus } from "~/eventbus";
watch(isDark, (isDark) => {
  if (dbs) {
    dbs.destroy();
  }
  setDBS(isDark);
});
let dbs: DBS;
onMounted(() => {
  setDBS(isDark.value);
  eventbus.on("处理风廓线数据", 处理风廓线数据);
});
const currentTime = ref("");
let timer: number;
import moment from "moment";
const 处理风廓线数据 = (data: any, type1: string, diejia: string, type2: string) => {
  if (data) {
    console.log(data);
    dbs && dbs.clear();
    let Fdatas: any[] = [];
    data.map((v: any, k: number) => {
      if (k === 0) {
        currentTime.value = moment(v.name, "YYYYMMDDHHmmss").format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      let data_time = moment(v.name, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
      let data_list = v.subdirectories;
      let fData: { [key: string]: any } = {};
      fData.timestamp = data_time;
      fData.data = [];
      data_list.map((item: any) => {
        fData.data.push({
          fHei: item.fHei.toString(),
          fHAngle: item.fHAngle.toString(),
          fHSpeed: item.fHSpeed.toString(),
          fVSpeed: item.fVSpeed.toString(),
          iBelieveable: item.fHorBelieve.toString(),
        });
      });
      Fdatas.push(fData);
    });
    dbs.process(Fdatas, type1, diejia, type2);
  }
};
const setDBS = (isDark: boolean) => {
  dbs = new DBS();
  dbs.init({
    el: fkxContainer.value,
    size: 21,
    isDark,
  });

  // Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  // dbs.process(Object.assign({}, Fdata));
  // timer = setInterval(() => {
  //   Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  //   dbs.process(Object.assign({}, Fdata));
  //   // clearInterval(timer);
  // }, 5000);
};
onBeforeUnmount(() => {
  eventbus.off("处理风廓线数据", 处理风廓线数据);
  clearInterval(timer);
  dbs.destroy();
});
</script>
