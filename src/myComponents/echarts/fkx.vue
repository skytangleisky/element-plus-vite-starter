<template>
  <div
    style="
      scroll-snap-align: start;
      scroll-snap-stop: always;
      width: 100%;
      min-height: 400px;
      display: flex;
      flex-direction: column;
    "
  >
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="font-size: 20px; color: rgb(78, 129, 184)">水平风</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div ref="fkxContainer" class="w-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import DBS, { Fdata } from "~/tools/fkx.js";
import { isDark } from "~/composables";
import { useBus } from "~/myComponents/bus";
const bus = useBus();
const fkxContainer = ref(null);
watch(isDark, (isDark) => {
  if (dbs) {
    dbs.destroy();
  }
  setDBS(isDark);
});
let dbs: DBS;
onMounted(() => {
  setDBS(isDark.value);
});
const currentTime = ref("");
let timer: number;
const setDBS = (isDark: boolean) => {
  dbs = new DBS();
  dbs.init({
    el: fkxContainer.value,
    size: 1,
    isDark,
  });
  // Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  // dbs.process(Object.assign({}, Fdata));
  // timer = setInterval(() => {
  //   Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  //   dbs.process(Object.assign({}, Fdata));
  //   // clearInterval(timer);
  // }, 5000);
  watch([() => bus.avgWindData, () => station.active], ([avgWindData, active]) => {
    console.log("dbs", avgWindData);
    dbs.clear();
    if (avgWindData) {
      avgWindData.map((v, k) => {
        let data;
        for (let key in v) {
          if (key == active) {
            data = v[key];
          }
        }
        if (data) {
          let Fdatas: any[] = [];
          data.map((v, k) => {
            if (k === 0) {
              currentTime.value = v.data_time;
            }
            let data_time = v.data_time;
            let data_list = v.data_list;
            let fData: { [key: string]: any } = {};
            fData.timestamp = data_time;
            fData.data = [];
            data_list.map((item) => {
              fData.data.push({
                fHei: item.distance.toString(),
                fHAngle: item.center_h_direction_abs.toString(),
                fHSpeed: item.center_h_speed.toString(),
                fVSpeed: item.vert_airflow.toString(),
                // iBelieveable: v[k].reliability,
              });
            });
            fData.data.reverse();
            Fdatas.unshift(fData);
            // console.log(fData);
          });
          dbs.process(Fdatas);
        }
      });
    }
  });
};
onBeforeUnmount(() => {
  clearInterval(timer);
  dbs.clear();
  dbs.destroy();
});
</script>
