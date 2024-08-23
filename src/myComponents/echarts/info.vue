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
      <div @click="click" style="position: relative">{{ item?.name }}</div>
      <span style="font-size: small; color: grey; right: 0">{{ item?.status.data_time }}</span>
    </div>
    <div class="grid grid-cols-3 grid-rows-4 w-full h-auto">
      <div class="info_item" style="grid-column: 1/3">
        <span>序列号:</span><span>{{ item?.status.sn_code }}</span>
      </div>
      <div style="grid-column: 3/4">
        <div
          v-if="item?.type.name == '塔式'"
          class="w-full h-full flex items-center"
        >
          蓄电池电量百分比:
          <div ref="batteryRef" class="battery" style="margin: 0 4px">
            <div class="positiveElectrode"></div>
          </div>
          <div v-if="item?.status.battery_level <= 50">{{ item?.status.battery_level }}%</div>
          <div v-else>{{ item?.status.battery_level }}%</div>
        </div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>雷达类型:</span><span>{{ item?.type.name }}</span>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>在线状态:</span>
        <div
          :class="`${item?.is_online ? 'bg-green' : 'bg-red'}`"
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
          :class="`${item?.status.control_plate_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>CPU温度:</span><span>{{ item?.status.cpu_temperature }}</span>
      </div>
      <div class="info_item">
        <span>硬盘容量:</span><span>{{ item?.status.disk_capacity }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>舱内温湿度状态:</span>
        <div
          :class="`${item?.status.internal_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>舱内温度:</span><span>{{ item?.status.internal_temperature }}</span>
      </div>
      <div class="info_item">
        <span>舱内湿度:</span><span>{{ item?.status.internal_humidity }}</span>
      </div>
      <div class="info_item">
        <span>窗口片温度:</span><span>{{ item?.status.lens_temperature }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>舱外温湿度状态:</span>
        <div
          :class="`${item?.status.external_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>舱外温度:</span><span>{{ item?.status.external_temperature }}</span>
      </div>
      <div class="info_item">
        <span>舱外湿度:</span><span>{{ item?.status.external_humidity }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>EDFA状态:</span>
        <div
          :class="`${item?.status.edfa_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>激光器温度:</span><span>{{ item?.status.laser_temperature }}</span>
      </div>
      <div class="info_item">
        <span>激光器功率:</span><span>{{ item?.status.laser_power }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>采集卡状态:</span>
        <div
          :class="`${item?.status.grabber_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>采集卡温度:</span><span>{{ item?.status.grabber_temperature }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>电子罗盘状态:</span>
        <div
          :class="`${item?.status.compass_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>北向角:</span><span>{{ item?.status.north_angle }}</span>
      </div>
      <div class="info_item">
        <span>横倾角:</span><span>{{ item?.status.heel_angle }}</span>
      </div>
      <div class="info_item">
        <span>纵倾角:</span><span>{{ item?.status.trim_angle }}</span>
      </div>

      <hr
        class="dark:b-#00000044 b-gray-1 b-b-1px b-0px b-solid w-full"
        style="grid-column: 1/4"
      />
      <div class="info_item" style="grid-column: 1/2">
        <span>GPS状态:</span>
        <div
          :class="`${item?.status.gps_status ? 'bg-green' : 'bg-red'}`"
          style="border-radius: 50%; width: 1rem; height: 1rem"
        ></div>
      </div>
      <div class="info_item" style="grid-column: 1/2">
        <span>位置经度:</span><span>{{ item?.status.longitude }}</span>
      </div>
      <div class="info_item">
        <span>位置纬度:</span><span>{{ item?.status.latitude }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref, nextTick } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
const bus = useBus();
import {Station} from '~/myComponents/bus'
const item = ref<Station>();
const click = () => {
  window.top?.open(
    `https://main.emgo-tech.com/admin/device/radar/${item.value.id}/change/`,
    "_self"
  );
};
const batteryRef = ref(null);
watch([() => bus.result, () => station.active], ([result, active]) => {
  result.map((v:Station) => {
    if (v.radar_id.replaceAll('-','') === active) {
      item.value = v;
      nextTick(() => {
        let battery_level = item.value?.status.battery_level!;
        let battery = (batteryRef.value as unknown) as HTMLDivElement;
        if (battery) {
          if (battery_level < 0) {
            //do nothing,use default style
          } else if (battery_level < 30) {
            battery.style.setProperty("--battery", battery_level + "%");
            battery.style.setProperty("--batteryColor", "#f00");
          } else if (battery_level < 80) {
            battery.style.setProperty("--battery", battery_level + "%");
            battery.style.setProperty("--batteryColor", "#fa0");
          } else if (battery_level <= 100) {
            battery.style.setProperty("--battery", battery_level + "%");
            battery.style.setProperty("--batteryColor", "#0f0");
          }
        }
      });
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
.battery {
  --battery: 100%;
  --batteryColor: grey;
  box-sizing: border-box;
  position: relative;
  height: 18px;
  width: 14px;
  border: 1px solid grey;
  margin: -1px;
  .positiveElectrode {
    position: absolute;
    background-color: grey;
    left: 50%;
    top: -2px;
    transform: translateX(-50%);
    width: 6px;
    height: 2px;
  }
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: var(--battery);
    background-color: var(--batteryColor);
  }
}
</style>
