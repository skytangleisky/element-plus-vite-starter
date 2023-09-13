<template>
  <div
    ref="infoContainer"
    class="infoContainer grid grid-cols-3 grid-rows-4 w-full h-full"
  >
    <div class="item">
      <span>时间</span>:<span>{{ station.result[station.active]?.data_time }}</span>
    </div>
    <div class="item">
      <span>舱内温度</span>:<span>{{
        station.result[station.active]?.edfa_temperature
      }}</span>
    </div>
    <div class="item">
      <span>舱外温度</span>:<span>{{
        station.result[station.active]?.external_temperature
      }}</span>
    </div>
    <div class="item">
      <span>GPS状态</span>:<span>{{ station.result[station.active]?.gps_status }}</span>
    </div>
    <div class="item">
      <span>经度</span>:<span>{{ station.result[station.active]?.longitude }}</span>
    </div>
    <div class="item">
      <span>纬度</span>:<span>{{ station.result[station.active]?.latitude }}</span>
    </div>
    <div class="item">
      <span>纬度</span>:<span>{{ station.result[station.active]?.latitude }}</span>
    </div>
    <div class="item">
      <span>EDFA模块状态</span>:<span>{{
        station.result[station.active]?.edfa_status
      }}</span>
    </div>
    <div class="item">
      <span>EDFA模块温度</span>:<span>{{
        station.result[station.active]?.edfa_status
      }}</span>
    </div>
    <div class="item">
      <span>EDFA模块温度</span>:<span>{{
        station.result[station.active]?.edfa_status
      }}</span>
    </div>
    <div class="item">
      <span>泵浦电流1</span>:<span>{{
        station.result[station.active]?.pumping_current_1
      }}</span>
    </div>
    <div class="item">
      <span>泵浦电流2</span>:<span>{{
        station.result[station.active]?.pumping_current_2
      }}</span>
    </div>
    <div class="item">
      <span>泵浦电流3</span>:<span>{{
        station.result[station.active]?.pumping_current_3
      }}</span>
    </div>
    <div class="item">
      <span>电子罗盘状态</span>:<span>{{
        station.result[station.active]?.compass_status
      }}</span>
    </div>
    <div class="item">
      <span>横倾角</span>:<span>{{ station.result[station.active]?.heel_angle }}</span>
    </div>
    <div class="item">
      <span>纵倾角</span>:<span>{{ station.result[station.active]?.trim_angle }}</span>
    </div>
    <div class="item">
      <span>北向角</span>:<span>{{ station.result[station.active]?.trim_angle }}</span>
    </div>
    <div class="item">
      <span>镜头温度</span>:<span>{{
        station.result[station.active]?.lens_temperature
      }}</span>
    </div>
    <div class="item">
      <span>采集卡状态</span>:<span>{{
        station.result[station.active]?.grabber_status
      }}</span>
    </div>
    <div class="item">
      <span>软件版本</span>:<span>{{
        station.result[station.active]?.software_version
      }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch } from "vue";
import { useStationStore } from "~/stores/station";
import { storeToRefs } from "pinia";
const station = useStationStore();
console.log(station.result);
watch(storeToRefs(station).result, (newVal) => {
  console.log(newVal);
});
</script>
<style>
.infoContainer {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  width: 100%;
  height: auto;
}
</style>
