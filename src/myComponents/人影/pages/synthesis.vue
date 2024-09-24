<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute;">
    <edit-map
      v-model:prevRequestShow="setting.人影.监控.prevPlanRequestShow"
      v-model:prevRequestData="setting.人影.监控.prevPlanRequestData"
      style="backdrop-filter: blur(25px)"
      v-model:routeLine="setting.人影.监控.routeLine"
      v-model:loadmap="setting.人影.监控.loadmap"
      v-model:zyd="setting.人影.监控.zyd"
      v-model:district="setting.人影.监控.district"
      v-model:tile="setting.人影.监控.tile"
      v-model:center="setting.人影.监控.center"
      v-model:zoom="setting.人影.监控.zoom"
      v-model:pitch="setting.人影.监控.pitch"
      v-model:bearing="setting.人影.监控.bearing"
      v-model:zdz="setting.人影.监控.zdz"
      v-model:plane="setting.人影.监控.plane"
      v-model:gridPoint="setting.人影.监控.gridPoint"
      v-model:gridValue="setting.人影.监控.gridValue"
      v-model:isolines="setting.人影.监控.isolines"
      v-model:isobands="setting.人影.监控.isobands"
      v-model:districtLineColor="setting.人影.监控.districtLineColor"
    ></edit-map>
    <div
      class="absolute left-10px top-10px b-solid b-1px dark:b-gray-5 b-gray dark:bg-#2b2b2b bg-white dark:color-white color-black w-150px h-80px flex flex-col justify-between p-10px"
      style="border-radius: 8px; font-size: 16px; display: none"
    >
      <span>反制设备 10台</span>
      <span>合作无人机 0架</span>
      <span>黑飞无人机 0架</span>
    </div>
    <div :class="`right-drawer ${setting.人影.监控.disappear ? 'disappear' : ''}`">
      <div
        class="handle"
        @click.native="setting.人影.监控.disappear = !setting.人影.监控.disappear"
      >
        <el-icon v-html="rightSvg"></el-icon>
      </div>
      <div class="p-4px" style="overflow: auto">
        <selectTile v-model:list="tileList"></selectTile>
        <fieldset class="b-solid b-1px rounded-lg">
          <legend class="font-size-20px">图层设置</legend>
          <div style="display: flex; flex-direction: column; padding: 0 4px">
            <el-checkbox
              name="控制瓦片"
              v-model="setting.人影.监控.loadmap"
              label="显示瓦片地图"
            ></el-checkbox>
            <div class="flex items-center"><el-checkbox name="控制区划" v-model="setting.人影.监控.district"></el-checkbox><div class="p-l-8px">显示行政区划</div></div>
            <el-checkbox name="控制人影飞行区" v-model="setting.人影.监控.人影飞行区" label="人影飞行区"></el-checkbox>
            <el-checkbox name="控制航线" v-model="setting.人影.监控.routeLine" label="航路航线"></el-checkbox>
            <el-checkbox name="控制作业点" v-model="setting.人影.监控.zyd" label="显示作业点"></el-checkbox>
            <el-checkbox name="飞机" v-model="setting.人影.监控.plane" label="显示飞机"></el-checkbox>
            <template v-if="checkPermission(['admin'])">
              <el-checkbox name="控制自动站" v-model="setting.人影.监控.zdz" label="自动站"></el-checkbox>
              <el-checkbox name="控制网格点" v-model="setting.人影.监控.gridPoint" label="网格点"></el-checkbox>
              <el-checkbox name="控制网格值" v-model="setting.人影.监控.gridValue" label="网格值"></el-checkbox>
              <el-checkbox name="控制等值线" v-model="setting.人影.监控.isolines" label="等值线"></el-checkbox>
              <el-checkbox name="控制等值带" v-model="setting.人影.监控.isobands" label="等值带"></el-checkbox>
            </template>
          </div>
        </fieldset>
        <fieldset class="b-solid b-1px rounded-lg">
          <legend class="font-size-14px">人影飞行区域 显示风格</legend>
          <div class="flex flex-col">
            <el-checkbox name="图层显示控制" class="row-start-1 col-span-3" label="图层显示"></el-checkbox>
            <label class="flex"><input type="radio" class="m-0" name="选择颜色" :value="0" v-model="setting.人影.监控.showColorSelector">图层颜色<div :style="`background:${setting.人影.监控.districtLineColor};flex:1;`"></div></label>
            <label class="flex"><input type="radio" class="m-0" name="选择颜色" :value="1" v-model="setting.人影.监控.showColorSelector">填充颜色<div :style="`background:${setting.人影.监控.districtFillColor};flex:1;`"></div></label>
            <!-- <div class="row-start-2 col-span-1">图层颜色</div><el-color-picker class="row-start-2 col-span-3" v-model="color" show-alpha :predefine="predefineColors" color-format="hex" /> -->
            <!-- <div class="row-start-2 col-span-1">省界颜色</div><div :style="`background:${setting.人影.监控.districtLineColor}`" @click="setting.人影.监控.districtLineColorSelector=!setting.人影.监控.districtLineColorSelector" tabindex="-1"></div>
            <div class="row-start-2 col-span-1">填充颜色</div><div :style="`background:${setting.人影.监控.districtFillColor}`" @click="setting.人影.监控.districtFillColorSelector=!setting.人影.监控.districtFillColorSelector" tabindex="-1"></div> -->
            <el-checkbox name="填充控制" class="row-start-3 col-span-3" label="填充"></el-checkbox>
            <el-checkbox name="比例尺显示" class="row-start-4 col-span-3" label="比例尺显示控制"></el-checkbox>
          </div>
        </fieldset>
      </div>
    </div>
    <div
      :class="`bottom-drawer ${setting.人影.监控.bottom_disappear ? 'disappear' : ''}`"
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
        @click.stop="setting.人影.监控.bottom_disappear = true"
      ></el-icon>
      <datatable
        :database="'host=192.168.0.240&port=3306&user=root&password=mysql&database=ryplat_bjry'"
        :table="'zydpara'"
      ></datatable>
    </div>
  </div>
  <dialog-plan-request
    v-model:show="setting.人影.监控.prevPlanRequestShow"
    v-model:data="setting.人影.监控.prevPlanRequestData"
    @click="confirm"
    style="z-index:2010"
  ></dialog-plan-request>
  <ColorSelector v-if="setting.人影.监控.showColorSelector == 0" v-model:selectorColor="setting.人影.监控.districtLineColor" style="z-index: 2010;" @cancel="setting.人影.监控.showColorSelector=-1"></ColorSelector>
  <ColorSelector v-if="setting.人影.监控.showColorSelector == 1" v-model:selectorColor="setting.人影.监控.districtFillColor" style="z-index: 2010;" @cancel="setting.人影.监控.showColorSelector=-1"></ColorSelector>
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
import DialogPlanRequest, { prevRequestDataType } from "../../dialog_plan_request.vue";
import { useSettingStore } from "~/stores/setting";
import { eventbus } from "~/eventbus/index";
import ColorSelector from "~/myComponents/colorSelector/index.vue"
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
const confirm = (data: prevRequestDataType) => {
  eventbus.emit("人影-地面作业申请-网络上报", data);
};
const click = (v: any) => {
  setting.人影.监控.bottom_disappear = false;
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
    name: "天地图(地形)",
    url: formatUrl(
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c"
    ),
    tileData: [
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
    ],
  },
  {
    selected: false,
    name: "天地图(影像)",
    url: formatUrl(
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c"
    ),
    tileData: [
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
    ],
  },
  {
    selected: false,
    name: "天地图(矢量图)",
    url: formatUrl(
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c"
    ),
    tileData: [
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
    ],
  },
  {
    selected: false,
    name: "天地图(标注)",
    url: formatUrl(
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c"
    ),
    tileData: [
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
    ],
  },
  {
    selected: false,
    name: "天地图(网路)",
    url: formatUrl(
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c"
    ),
    tileData: [
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
    ],
  },
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
  if (k == setting.人影.监控.tile.index) {
    item.selected = true;
  } else {
    item.selected = false;
  }
});
watch(
  () => setting.人影.监控.tile,
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
        setting.人影.监控.tile.index = k;
        setting.人影.监控.tile.tileData = item.tileData;
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
