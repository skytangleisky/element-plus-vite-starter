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
      <div @click="click" style="position: relative">{{ item?.radar.name }}</div>
      <span style="font-size: small; color: grey; right: 0">{{ item?.data_time }}</span>
    </div>
    <div class="grid grid-cols-3 grid-rows-4 w-full h-auto">
      <div class="info_item" style="grid-column: 1/2">
        <span>序列号:</span><span>{{ item?.radar.sn_code }}</span>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>在线状态:</span>
        <div
          :class="`${item?.radar.is_online ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>数据采集状态:</span>
        <div
          :class="`${item?.radar.data_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>控制板状态:</span>
        <div
          :class="`${item?.control_plate_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>CPU温度:</span><span>{{ item?.cpu_temperature }}</span>
      </div>
      <div class="info_item">
        <span>硬盘容量:</span><span>{{ item?.disk_capacity }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>舱内温湿度状态:</span>
        <div
          :class="`${item?.internal_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>舱内温度:</span><span>{{ item?.internal_temperature }}</span>
      </div>
      <div class="info_item">
        <span>舱内湿度:</span><span>{{ item?.internal_humidity }}</span>
      </div>
      <div class="info_item">
        <span>窗口片温度:</span><span>{{ item?.lens_temperature }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>舱外温湿度状态:</span>
        <div
          :class="`${item?.external_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>舱外温度:</span><span>{{ item?.external_temperature }}</span>
      </div>
      <div class="info_item">
        <span>舱外湿度:</span><span>{{ item?.external_humidity }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>EDFA状态:</span>
        <div
          :class="`${item?.edfa_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>激光器温度:</span><span>{{ item?.laser_temperature }}</span>
      </div>
      <div class="info_item">
        <span>激光器功率:</span><span>{{ item?.laser_power }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>采集卡状态:</span>
        <div
          :class="`${item?.grabber_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>采集卡温度:</span><span>{{ item?.grabber_temperature }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>电子罗盘状态:</span>
        <div
          :class="`${item?.compass_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>北向角:</span><span>{{ item?.north_angle }}</span>
      </div>
      <div class="info_item">
        <span>横倾角:</span><span>{{ item?.heel_angle }}</span>
      </div>
      <div class="info_item">
        <span>纵倾角:</span><span>{{ item?.trim_angle }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>GPS状态:</span>
        <div
          :class="`${item?.gps_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>位置经度:</span><span>{{ item?.longitude }}</span>
      </div>
      <div class="info_item">
        <span>位置纬度:</span><span>{{ item?.latitude }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
const bus = useBus();
const item = ref(undefined);
const click = () => {
  window.open(
    `https://main.emgo-tech.com/admin/device/radar/${item.value.radar.id}/change/`,
    "_self"
  );
};
watch([() => bus.result, () => station.active], ([result, active]) => {
  result.map((v) => {
    if (v.radar.radar_id === active) {
      item.value = v;
    }
  });
});
</script>
<style lang="scss">
.info_item {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  margin: 8px 8px;
  padding: 0 2px;
  box-shadow: 0 0 4px 4px #00000011;
  border-color: #00000011;
}
</style>
