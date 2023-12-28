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
    <div style="font-size: 20px; color: rgb(78, 129, 184)">水平风</div>
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
const setDBS = (isDark: boolean) => {
  dbs = new DBS();
  dbs.init({
    el: fkxContainer.value,
    size: 1,
    isDark,
  });
  // Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  // dbs.process(Object.assign({}, Fdata));
  // const timer = setInterval(() => {
  //   Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  //   dbs.process(Object.assign({}, Fdata));
  //   // clearInterval(timer);
  // }, 5000);
  watch(
    [() => bus.avgWindData, () => bus.result, () => station.active],
    ([avgWindData, result, active]) => {
      dbs.clear();
      if (avgWindData.length && result.length) {
        avgWindData.map((v, k) => {
          let data;
          for (let key in v) {
            if (result[active] && key == result[active].radar.radar_id) {
              data = v[key];
            }
          }
          if (data) {
            let Fdatas: any[] = [];
            data.map((v, k) => {
              for (let k in v) {
                let fData: { [key: string]: any } = {};
                fData.timestamp = k;
                fData.data = [];
                v[k].map((item) => {
                  for (let tmp in item) {
                    fData.data.push({
                      fHei: item[tmp].distance.toString(),
                      fHAngle: item[tmp].center_h_direction_abs.toString(),
                      fHSpeed: item[tmp].center_h_speed.toString(),
                      fVSpeed: item[tmp].vert_airflow.toString(),
                      // iBelieveable: v[k].reliability,
                    });
                  }
                });
                fData.data.reverse();
                Fdatas.unshift(fData);
                // console.log(fData);
              }
            });
            dbs.process(Fdatas);
          }
        });
      }
    }
  );
};
onBeforeUnmount(() => {
  // clearInterval(timer);
  dbs.destroy();
});
</script>
