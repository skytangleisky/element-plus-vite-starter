<template>
  <div style="scroll-snap-align: start; scroll-snap-stop: always; width: 100%">
    <div
      style="
        color: rgb(78, 129, 184);
        font-size: 20px;
        scroll-snap-align: start;
        scroll-snap-stop: always;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
        min-height: 60px;
      "
    >
      <div class="goToHisData" @click="click" style="position: relative;cursor:pointer">{{ item.device_name }}</div>
      <span style="font-size: small; color: grey; right: 0">{{ item.radar_id }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, reactive, nextTick } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
import moment from "moment";
const bus = useBus();
const item = reactive({
  radar_id:'',
  device_name:'',
  data_time:'',
});
import { useRouter } from "vue-router";
const router = useRouter()
const click = () => {
  // window.top?.open(
  //   `https://main.emgo-tech.com/admin/device/radar/${item.value.radar.id}/change/`,
  //   "_self"
  // );
  router.replace('/cq/device/'+item.radar_id)
};
watch( [()=>bus.avgWindData_重庆,() => station.active],  ([avgWindData,active]) => {
  if(avgWindData.data){
    avgWindData.data.map((radial:any,k:number)=>{
      if(k==0){
        bus.风雷达组网地图相关雷达站点信息.map(v=>{
          if(v.no == active){
            item.radar_id = v.no
            item.device_name = v.device_name
            // item.data_time = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
          }
        })
      }
    })
  }
  // nextTick(() => {
  //   let battery_level = item.value.battery_level;
  //   let battery = (batteryRef.value as unknown) as HTMLDivElement;
  //   if (battery) {
  //     if (battery_level < 0) {
  //       //do nothing,use default style
  //     } else if (battery_level < 30) {
  //       battery.style.setProperty("--battery", battery_level + "%");
  //       battery.style.setProperty("--batteryColor", "#f00");
  //     } else if (battery_level < 80) {
  //       battery.style.setProperty("--battery", battery_level + "%");
  //       battery.style.setProperty("--batteryColor", "#fa0");
  //     } else if (battery_level <= 100) {
  //       battery.style.setProperty("--battery", battery_level + "%");
  //       battery.style.setProperty("--batteryColor", "#0f0");
  //     }
  //   }
  // });
});
</script>
<style lang="scss">
.goToHisData:hover{
  text-decoration: underline;
}
</style>
