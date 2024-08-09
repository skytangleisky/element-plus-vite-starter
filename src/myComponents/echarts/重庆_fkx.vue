<template>
  <div
    style="
      width: 100%;
      min-height: 400px;
      display: flex;
      flex-direction: column;
      position: relative;
      height: 100%;
      scroll-snap-align: start;
      scroll-snap-stop: always;
    "
  >
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="font-size: 20px; color: rgb(78, 129, 184)">风廓线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div ref="fkxContainer" class="w-full h-full"></div>
  </div>
</template>
<script lang="ts" setup>
import moment from "moment";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import DBS from "~/tools/重庆_fkx.js";
import { isDark } from "~/composables";
import { useBus } from "~/myComponents/bus";
const bus = useBus();
const fkxContainer = ref(null);
watch(isDark, (isDark) => {
  if (dbs) {
    dbs.destroy();
  }
  setDBS(isDark);
  let avgWindData = bus.avgWindData_重庆
  process(avgWindData)
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
  watch(() => bus.avgWindData_重庆, (avgWindData) => {
    dbs.clear();
    process(avgWindData)
  });
};
function process(avgWindData:any){
  if (avgWindData.data) {
    let Fdatas: any[] = [];
    avgWindData.data.map((radial:any,k:number)=>{
      let fData: { [key: string]: any } = {data:[]};
      fData.timestamp = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
      if(k===0){
        currentTime.value = fData.timestamp
      }
      radial.list.map((lib:any)=>{
        fData.data.push({
          fHei: lib['distance'].toString(),
          fHAngle: lib['WindDirection'].toString(),
          fHSpeed: lib['WindSpeed'].toString(),
          fVSpeed: lib['ZWind'].toString(),
        })
      })
      Fdatas.unshift(fData);
    })
    dbs.process(Fdatas);
  }
}
onBeforeUnmount(() => {
  clearInterval(timer);
  dbs.clear();
  dbs.destroy();
});
</script>
