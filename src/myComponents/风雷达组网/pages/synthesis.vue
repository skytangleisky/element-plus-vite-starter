<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <edit-map
      v-model:prevRequestShow="setting.风雷达组网.监控.prevPlanRequestShow"
      v-model:prevRequestData="setting.风雷达组网.监控.prevPlanRequestData"
      style="backdrop-filter: blur(25px)"
      v-model:routeLine="setting.风雷达组网.监控.routeLine"
      v-model:loadmap="setting.风雷达组网.监控.loadmap"
      v-model:zyd="setting.风雷达组网.监控.zyd"
      v-model:district="setting.风雷达组网.监控.district"
      v-model:tile="setting.风雷达组网.监控.tile"
      v-model:center="setting.风雷达组网.监控.center"
      v-model:zoom="setting.风雷达组网.监控.zoom"
      v-model:pitch="setting.风雷达组网.监控.pitch"
      v-model:bearing="setting.风雷达组网.监控.bearing"
      v-model:zdz="setting.风雷达组网.监控.zdz"
      v-model:plane="setting.风雷达组网.监控.plane"
      v-model:gridPoint="setting.风雷达组网.监控.gridPoint"
      v-model:gridValue="setting.风雷达组网.监控.gridValue"
      v-model:isolines="setting.风雷达组网.监控.isolines"
      v-model:isobands="setting.风雷达组网.监控.isobands"
    ></edit-map>
    <div
      class="absolute left-10px top-10px b-solid b-1px dark:b-gray-5 b-gray dark:bg-#2b2b2b bg-white dark:color-white color-black w-150px h-80px flex flex-col justify-between p-10px"
      style="border-radius: 8px; font-size: 16px; display: none"
    >
      <span>反制设备 10台</span>
      <span>合作无人机 0架</span>
      <span>黑飞无人机 0架</span>
    </div>
    <div :class="`right-drawer ${setting.风雷达组网.监控.disappear ? 'disappear' : ''}`">
      <div
        class="handle"
        @click.native="
          setting.风雷达组网.监控.disappear = !setting.风雷达组网.监控.disappear
        "
      >
        <el-icon v-html="rightSvg"></el-icon>
      </div>
      <div style="overflow: auto">
        <selectTile v-model:list="tileList"></selectTile>
        <span style="font-size: 20px; margin-top: 20px">图层设置</span>
        <div style="display: flex; flex-direction: column; padding: 0 4px">
          <el-checkbox
            name="控制瓦片"
            v-model="setting.风雷达组网.监控.loadmap"
            label="显示瓦片地图"
          ></el-checkbox>
          <el-checkbox
            name="控制区划"
            v-model="setting.风雷达组网.监控.district"
            label="显示行政区划"
          ></el-checkbox>
          <el-checkbox
            name="控制航线"
            v-model="setting.风雷达组网.监控.routeLine"
            label="航路航线"
          ></el-checkbox>
          <el-checkbox
            name="控制作业点"
            v-model="setting.风雷达组网.监控.zyd"
            label="显示作业点"
          ></el-checkbox>
          <el-checkbox
            name="飞机"
            v-model="setting.风雷达组网.监控.plane"
            label="显示飞机"
          ></el-checkbox>
          <template v-if="checkPermission(['admin'])">
            <el-checkbox
              name="控制自动站"
              v-model="setting.风雷达组网.监控.zdz"
              label="自动站"
            ></el-checkbox>
            <el-checkbox
              name="控制网格点"
              v-model="setting.风雷达组网.监控.gridPoint"
              label="网格点"
            ></el-checkbox>
            <el-checkbox
              name="控制网格值"
              v-model="setting.风雷达组网.监控.gridValue"
              label="网格值"
            ></el-checkbox>
            <el-checkbox
              name="控制等值线"
              v-model="setting.风雷达组网.监控.isolines"
              label="等值线"
            ></el-checkbox>
            <el-checkbox
              name="控制等值带"
              v-model="setting.风雷达组网.监控.isobands"
              label="等值带"
            ></el-checkbox>
          </template>
        </div>
      </div>
    </div>
    <div
      :class="`bottom-drawer ${
        setting.风雷达组网.监控.bottom_disappear ? 'disappear' : ''
      }`"
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
        @click.stop="setting.风雷达组网.监控.bottom_disappear = true"
      ></el-icon>
      <datatable
        :database="'host=192.168.0.240&port=3306&user=root&password=mysql&database=ryplat_bjry'"
        :table="'zydpara'"
      ></datatable>
    </div>
  </div>
</template>
<script lang="ts" setup>
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
import datatable from "~/myComponents/datatable/index.vue";
const menus = reactive([
  { value: 12, type: "warning", svg: warnSvg, active: true },
  { value: 12, type: "success", svg: uavSvg, active: false },
  { value: 12, type: "primary", svg: deviceSvg, active: false },
  { value: 12, type: "danger", svg: recordSvg, active: false },
  { value: 12, type: "info", svg: whitelistSvg, active: false },
  { value: 0, svg: statisticSvg, active: false },
]);
import { checkPermission } from "~/tools";
const click = (v: any) => {
  setting.风雷达组网.监控.bottom_disappear = false;
  v.active = true;
  menus
    .filter((item) => item !== v)
    .map((item) => {
      item.active = false;
    });
};
const formatUrl = (url: string) => {
  return url.replace("{x}", "105").replace("{y}", "48").replace("{z}", "7");
};
const tileList = ref([
  {
    selected: false,
    name: "高德街道地图",
    url: formatUrl(
      "https://wprd01.is.autonavi.com/appmaptile?style=10&x={x}&y={y}&z={z}"
    ),
    tileData: ["https://wprd01.is.autonavi.com/appmaptile?style=10&x={x}&y={y}&z={z}"],
  },
  {
    name: "高德卫星地图",
    url: formatUrl("https://wprd01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"),
    tileData: ["https://wprd01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"],
  },
  {
    name: "谷歌卫星地图",
    url: formatUrl("https://tile.tanglei.site/maps/vt?lyrs=y&x={x}&y={y}&z={z}"),
    tileData: ["https://tile.tanglei.site/maps/vt?lyrs=y&x={x}&y={y}&z={z}"],
  },
  {
    name: "谷歌卫星地图",
    url: formatUrl("https://tile.tanglei.site/maps/vt?lyrs=s&x={x}&y={y}&z={z}"),
    tileData: ["https://tile.tanglei.site/maps/vt?lyrs=s&x={x}&y={y}&z={z}"],
  },
  {
    name: "谷歌卫星地图",
    url: formatUrl("https://tile.tanglei.site/maps/vt?lyrs=h&x={x}&y={y}&z={z}"),
    tileData: ["https://tile.tanglei.site/maps/vt?lyrs=h&x={x}&y={y}&z={z}"],
  },
  {
    name: "谷歌地形地图",
    url: formatUrl("https://tile.tanglei.site/maps/vt?lyrs=t&x={x}&y={y}&z={z}"),
    tileData: ["https://tile.tanglei.site/maps/vt?lyrs=t&x={x}&y={y}&z={z}"],
  },
  {
    name: "谷歌地形地图",
    url: formatUrl("https://tile.tanglei.site/maps/vt?lyrs=p&x={x}&y={y}&z={z}"),
    tileData: ["https://tile.tanglei.site/maps/vt?lyrs=p&x={x}&y={y}&z={z}"],
  },
  {
    name: "谷歌地形地图",
    url: formatUrl("https://tile.tanglei.site/maps/vt?lyrs=m&x={x}&y={y}&z={z}"),
    tileData: ["https://tile.tanglei.site/maps/vt?lyrs=m&x={x}&y={y}&z={z}"],
  },
]);
tileList.value.map((item: any, k: number) => {
  if (k == setting.风雷达组网.监控.tile.index) {
    item.selected = true;
  } else {
    item.selected = false;
  }
});
watch(
  () => setting.风雷达组网.监控.tile,
  (v) => {
    if (tileList.value[v.index]) {
      tileList.value[v.index].selected = true;
    } else {
      tileList.value[0].selected = true;
    }
  }
);
watch(
  tileList,
  (list) => {
    list.map((item: any, k: number) => {
      if (item.selected) {
        setting.风雷达组网.监控.tile.index = k;
        setting.风雷达组网.监控.tile.tileData = item.tileData;
      }
    });
  },
  { immediate: true, deep: true }
);
</script>
<style scoped lang="scss">
$time: 1s;
.bottom-drawer {
  z-index: 2;
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
