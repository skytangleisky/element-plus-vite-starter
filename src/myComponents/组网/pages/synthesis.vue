<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <edit-map
      style="backdrop-filter: blur(25px)"
      v-model:loadmap="setting.组网.监控.loadmap"
      v-model:district="setting.组网.监控.district"
      v-model:tile="setting.组网.监控.tile"
      v-model:center="setting.组网.监控.center"
      v-model:zoom="setting.组网.监控.zoom"
    ></edit-map>
    <div
      class="absolute left-10px top-10px b-solid b-1px dark:b-gray-5 b-gray dark:bg-#2b2b2b bg-white dark:color-white color-black w-150px h-80px flex flex-col justify-between p-10px"
      style="border-radius: 8px; font-size: 16px"
    >
      <span>反制设备 10台</span>
      <span>合作无人机 0架</span>
      <span>黑飞无人机 0架</span>
    </div>
    <div
      :class="`bottom-drawer ${setting.组网.监控.bottom_disappear ? 'disappear' : ''}`"
    >
      <div class="handle p-8px">
        <el-badge
          v-for="(v, k) in menus"
          :key="k"
          :value="v.value"
          :type="v.type"
          :show-zero="false"
          @click="click(v)"
          ><el-icon :class="`${v.active ? 'fourCorners' : ''}`" v-html="v.svg"></el-icon
        ></el-badge>
      </div>
      <el-icon
        class="cursor-pointer z-1"
        style="position: absolute; top: 0; right: 0; font-size: 1.5rem"
        v-html="forkSvg"
        @click.stop="setting.组网.监控.bottom_disappear = true"
      ></el-icon>
      <datatable></datatable>
    </div>
    <div :class="`right-drawer ${setting.组网.监控.disappear ? 'disappear' : ''}`">
      <div
        class="handle"
        @click.native="setting.组网.监控.disappear = !setting.组网.监控.disappear"
      >
        <el-icon v-html="rightSvg"></el-icon>
      </div>
      <selectTile v-model:list="tileList"></selectTile>
      <span style="font-size: 20px; margin-top: 20px">图层设置</span>
      <div style="display: flex; flex-direction: column">
        <el-checkbox
          v-model="setting.组网.监控.loadmap"
          label="显示瓦片地图"
        ></el-checkbox>
        <el-checkbox
          v-model="setting.组网.监控.district"
          label="显示行政区划"
        ></el-checkbox>
        <el-checkbox label="反制设备图层"></el-checkbox>
        <el-checkbox label="探测目标图层"></el-checkbox>
        <el-checkbox label="禁飞区图层"></el-checkbox>
        <el-checkbox label="备案空域图层"></el-checkbox>
      </div>
    </div>
  </div>
</template>
<script setup>
import editMap from "../editMap.vue";
import forkSvg from "~/assets/fork.svg?raw";
import rightSvg from "~/assets/right.svg?raw";
import warnSvg from "~/assets/warn.svg?raw";
import uavSvg from "~/assets/uav.svg?raw";
import deviceSvg from "~/assets/device.svg?raw";
import recordSvg from "~/assets/record.svg?raw";
import whitelistSvg from "~/assets/whitelist.svg?raw";
import statisticSvg from "~/assets/statistic.svg?raw";
import selectTile from "../selectTile.vue";
import { watch, ref, reactive } from "vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import url1 from "~/assets/street.png?url";
import url2 from "~/assets/satellite.png?url";
import datatable from "~/myComponents/datatable/index.vue";
const menus = reactive([
  { value: 12, type: "warning", svg: warnSvg, active: true },
  { value: 12, type: "success", svg: uavSvg, active: false },
  { value: 12, type: "primary", svg: deviceSvg, active: false },
  { value: 12, type: "danger", svg: recordSvg, active: false },
  { value: 12, type: "info", svg: whitelistSvg, active: false },
  { value: 0, svg: statisticSvg, active: false },
]);
const click = (v) => {
  setting.组网.监控.bottom_disappear = false;
  v.active = true;
  menus
    .filter((item) => item !== v)
    .map((item) => {
      item.active = false;
    });
};
const tileList = ref([
  { name: "街道地图", url: url1 },
  { name: "卫星地图", url: url2 },
]);
tileList.value.map((item, k) => {
  if (item.name == setting.组网.监控.tile) {
    item.selected = true;
  } else {
    item.selected = false;
  }
});
watch(
  () => setting.组网.监控.tile,
  (v) => {
    // 容易造成死循环
    tileList.value.map((item) => {
      if (item.name == v) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
  }
);
watch(
  tileList,
  (list) => {
    list.map((item) => {
      if (item.selected) {
        setting.组网.监控.tile = item.name;
      }
    });
  },
  { deep: true }
);
</script>
<style scoped lang="scss">
$time: 1s;
.bottom-drawer {
  white-space: nowrap;
  position: absolute;
  height: 240px;
  background-color: #fff;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  border-top: 1px solid #ddd;
  transition: transform $time;
  & > .handle {
    position: absolute;
    transform: translateY(-100%);
    .ep-badge {
      margin: 0 20px;
      .ep-icon {
        cursor: pointer;
        filter: drop-shadow(0 0 8px #000);
        font-size: 2rem;
        color: #fff;
      }
    }
  }
  &.disappear {
    transform: translateY(100%);
  }
}
.dark .bottom-drawer {
  border-top: 1px solid gray;
  background-color: #2b2b2b;
  & > .handle {
    .ep-badge {
      .ep-icon {
        color: #2b2b2b;
        filter: drop-shadow(0 0 8px #fff);
      }
    }
  }
}
.right-drawer {
  z-index: 4;
  position: absolute;
  right: 0;
  width: 240px;
  box-sizing: border-box;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  transition: transform $time;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
  & > .handle {
    display: flex;
    justify-content: start;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    left: -16px;
    background-color: #fff;
    width: 16px;
    height: 30px;
    border: 1px solid #ddd;
    border-right: none;
    & > .ep-icon {
      transition: transform $time;
      color: #bbb;
    }
  }
  &.disappear {
    transform: translateX(calc(100%));
    & > .handle > .ep-icon {
      transform: rotateY(180deg);
    }
  }
}
.dark .right-drawer {
  background-color: #2b2b2b;
  border-left: 1px solid gray;
  & > .handle {
    background-color: #2b2b2b;
    border: 1px solid grey;
    border-right: none;
    & > .ep-icon {
      color: #ddd;
    }
  }
}
.fourCorners {
  &::after {
    filter: drop-shadow(-2px -2px 4px #00000044);
    --offset: -6px;
    --borderWidth: 3px;
    position: absolute;
    left: var(--offset);
    top: var(--offset);
    content: "";
    width: calc(100% - 2 * var(--offset));
    height: calc(100% - 2 * var(--offset));
    border-radius: 6px;
    box-sizing: border-box;
    border: var(--borderWidth) solid white;
    --len: 12px;
    mask: conic-gradient(at var(--len) var(--len), transparent 75%, red 75%) 0 0 /
      calc(100% - var(--len)) calc(100% - var(--len));
  }
}
.dark .fourCorners::after {
  border: var(--borderWidth) solid #000;
  filter: drop-shadow(2px 2px 4px #ffffff44);
}
</style>
