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
    <div style="font-size: 20px; color: rgb(78, 129, 184); background: #eee">风廓线</div>
    <div ref="fkxContainer" class="w-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStationStore } from "~/stores/station";
import { useSettingStore } from "~/stores/setting";
const station = useStationStore();
const setting = useSettingStore();
import DBS, { Fdata } from "~/tools/fkx.js";
const fkxContainer = ref(null);
onMounted(() => {
  const dbs = new DBS();
  dbs.init({
    el: fkxContainer.value,
    size: 1,
  });
  // Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  // dbs.process(Object.assign({}, Fdata));
  // const timer = setInterval(() => {
  //   Fdata.timestamp = new Date(Math.floor(new Date().getTime() / 5000) * 5000).Format();
  //   dbs.process(Object.assign({}, Fdata));
  //   // clearInterval(timer);
  // }, 5000);
  watch(
    [
      storeToRefs(station).avgWindData,
      storeToRefs(setting).featherValue,
      storeToRefs(station).result,
      storeToRefs(station).active,
    ],
    ([avgWindData, featherValue, result, active]) => {
      avgWindData.map((v, k) => {
        for (let key in v) {
          if (key == result[active].radar.radar_id) {
            let data = v[key];
            let Fdatas: any[] = [];
            data.map((v, k) => {
              for (let k in v) {
                let fData: { [key: string]: any } = {};
                fData.timestamp = k;
                fData.data = [];
                v[k].map((v) => {
                  for (let k in v) {
                    //{
                    //   'fHei': '436.00',
                    //   'fHorChange': '999.00',
                    //   'fHAngle': '40.40',
                    //   'fHSpeed': '21.37',
                    //   'fSDev': '0.00',
                    //   'fVSpeed': '-1.79',
                    //   'fVerChange': '999.00',
                    //   'iBelieveable': '1'
                    // }
                    fData.data.push({
                      fHei: v[k].height.toString(),
                      fHAngle: v[k].direction.toString(),
                      fHSpeed: v[k].speed.toString(),
                      fVSpeed: 0,
                      iBelieveable: v[k].reliability,
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
        }
      });
    },
    { immediate: true }
  );
  onBeforeUnmount(() => {
    // clearInterval(timer);
    dbs.disconnect();
  });
});
</script>
