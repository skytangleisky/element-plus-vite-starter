<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute;">
    <edit-map
      v-model:prevRequestShow="setting.人影.监控.prevPlanRequestShow"
      v-model:prevRequestData="setting.人影.监控.prevPlanRequestData"
      style="backdrop-filter: blur(25px)"
      v-model:routeLine="setting.人影.监控.routeLine"
      v-model:loadmap="setting.人影.监控.loadmap"
      v-model:zyd="setting.人影.监控.zyd"
      v-model:district="setting.人影.监控.districtOptions.district"
      v-model:tile="setting.人影.监控.tile"
      v-model:center="setting.人影.监控.center"
      v-model:zoom="setting.人影.监控.zoom"
      v-model:pitch="setting.人影.监控.pitch"
      v-model:bearing="setting.人影.监控.bearing"
      v-model:zdz="setting.人影.监控.zdz"
      v-model:plane="setting.人影.监控.plane"
      v-model:airport="setting.人影.监控.airport"
      v-model:gridPoint="setting.人影.监控.gridPoint"
      v-model:gridValue="setting.人影.监控.gridValue"
      v-model:isolines="setting.人影.监控.isolines"
      v-model:isobands="setting.人影.监控.isobands"
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
        <!-- <selectTile v-model:list="tileList"></selectTile> -->
        <fieldset class="b-solid b-1px rounded-lg">
          <legend class="font-size-20px">图层设置</legend>
          <div style="display: flex; flex-direction: column; padding: 0 4px">
            <el-checkbox
              name="控制瓦片"
              v-model="setting.人影.监控.loadmap"
              label="显示瓦片地图"
            ></el-checkbox>
            <div class="flex items-center"><el-checkbox name="控制区划" v-model="setting.人影.监控.districtOptions.district"></el-checkbox><div class="p-l-8px">显示行政区划</div></div>
            <el-checkbox name="控制华北飞行区" v-model="setting.人影.监控.ryAirspaces.fill" label="华北飞行区"></el-checkbox>
            <el-checkbox name="控制航线" v-model="setting.人影.监控.routeLine" label="航路航线"></el-checkbox>
            <el-checkbox name="控制作业点" v-model="setting.人影.监控.zyd" label="显示作业点"></el-checkbox>
            <el-checkbox name="飞机" v-model="setting.人影.监控.plane" label="显示飞机"></el-checkbox>
            <el-checkbox name="机场" v-model="setting.人影.监控.airport" label="显示机场"></el-checkbox>
            <el-checkbox name="导航台" v-model="setting.人影.监控.navigationStation" label="导航台"></el-checkbox>
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
          <legend class="font-size-14px">华北飞行区域 显示风格</legend>
          <div class="flex flex-col">
            <el-checkbox name="图层显示控制" class="row-start-1 col-span-3" label="图层显示"></el-checkbox>
            <label class="flex"><input type="radio" class="m-0" name="选择颜色" :value="0" v-model="setting.人影.监控.showColorSelector">图层颜色<div :style="`background:rgba(${setting.人影.监控.districtOptions.districtLineColor.r},${setting.人影.监控.districtOptions.districtLineColor.g},${setting.人影.监控.districtOptions.districtLineColor.b},${setting.人影.监控.districtOptions.districtLineColor.a});flex:1;`"></div></label>
            <label class="flex"><input type="radio" class="m-0" name="选择颜色" :value="1" v-model="setting.人影.监控.showColorSelector">填充颜色<div :style="`background:rgba(${setting.人影.监控.districtOptions.districtFillColor.r},${setting.人影.监控.districtOptions.districtFillColor.g},${setting.人影.监控.districtOptions.districtFillColor.b},${setting.人影.监控.districtOptions.districtFillColor.a});flex:1;`"></div></label>
            <el-checkbox name="填充控制" class="row-start-3 col-span-3" label="填充"></el-checkbox>
            <el-checkbox name="比例尺显示" class="row-start-4 col-span-3" label="比例尺显示控制"></el-checkbox>
          </div>
        </fieldset>
      </div>
    </div>
    <div
      v-if="false"
      :class="`bottom-drawer hidden ${setting.人影.监控.bottom_disappear ? 'disappear' : ''}`"
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
        :database="'host=tanglei.top&port=3308&user=root&password=mysql&database=ryplat_bjry'"
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
  <ColorSelector v-show="setting.人影.监控.showColorSelector !== -1" v-model:selectorColor="selectorColor" style="z-index: 2010;" @cancel="setting.人影.监控.showColorSelector=-1"></ColorSelector>
  <div ref="tweakPaneRef" class="tp-dfwv default" data-pane-lighttheme style="z-index: 1;"></div>
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
import { watch, ref, reactive,computed,onMounted, onBeforeUnmount } from "vue";
import DialogPlanRequest, { prevRequestDataType } from "../../dialog_plan_request.vue";
import { useSettingStore } from "~/stores/setting";
import { eventbus } from "~/eventbus/index";
import ColorSelector from "~/myComponents/colorSelector/index.vue"
import { Pane } from 'controlpane';
let pane:any
onMounted(()=>{
  pane = new Pane({
    container:tweakPaneRef.value
  });
  pane.addBinding(setting.人影.监控, 'loadmap',{label:'瓦片地图'});
  {// 行政区划图层配置
    const folder = pane.addFolder({title: '全国行政区划',expanded:false});
    folder.addBinding(setting.人影.监控.districtOptions, 'district',{label:'填充'});
    const fillColor = folder.addBinding(setting.人影.监控.districtOptions, 'districtFillColor',{label:'填充颜色',picker:'popup',expanded:false});
    fillColor.on('change', (ev:any) => {
      setting.人影.监控.districtOptions.districtFillColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.districtOptions.districtFillColor,()=>{
      fillColor.refresh()
    })
    folder.addBinding(setting.人影.监控.districtOptions, 'districtBase',{label:'底线'});
    folder.addBinding(setting.人影.监控.districtOptions, 'districtBaseWidth',{label:'底线宽度',min:0,max:5,step:0.1});
    const baseColor = folder.addBinding(setting.人影.监控.districtOptions, 'districtBaseColor',{label:'底线颜色',picker:'popup',expanded:false});
    baseColor.on('change', (ev:any) => {
      setting.人影.监控.districtOptions.districtBaseColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.districtOptions.districtBaseColor,()=>{
      baseColor.refresh()
    })
    folder.addBinding(setting.人影.监控.districtOptions, 'districtLine',{label:'界线'});
    folder.addBinding(setting.人影.监控.districtOptions, 'districtLineWidth',{label:'界线宽度',min:0,max:5,step:0.1});
    const lineColor = folder.addBinding(setting.人影.监控.districtOptions, 'districtLineColor',{label:'界线颜色',picker:'popup',expanded:false});
    lineColor.on('change', (ev:any) => {
      setting.人影.监控.districtOptions.districtLineColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.districtOptions.districtLineColor,()=>{
      lineColor.refresh()
    })
  }

  {// 北京行政区划图层配置
    const folder = pane.addFolder({title: '北京行政区划',expanded:false});
    folder.addBinding(setting.人影.监控.beijingOptions, 'district',{label:'填充'});
    const fillColor = folder.addBinding(setting.人影.监控.beijingOptions, 'districtFillColor',{label:'填充颜色',picker:'popup',expanded:false});
    fillColor.on('change', (ev:any) => {
      setting.人影.监控.beijingOptions.districtFillColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.beijingOptions.districtFillColor,()=>{
      fillColor.refresh()
    })
    folder.addBinding(setting.人影.监控.beijingOptions, 'districtBase',{label:'底线'});
    folder.addBinding(setting.人影.监控.beijingOptions, 'districtBaseWidth',{label:'底线宽度',min:0,max:5,step:0.1});
    const baseColor = folder.addBinding(setting.人影.监控.beijingOptions, 'districtBaseColor',{label:'底线颜色',picker:'popup',expanded:false});
    baseColor.on('change', (ev:any) => {
      setting.人影.监控.beijingOptions.districtBaseColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.beijingOptions.districtBaseColor,()=>{
      baseColor.refresh()
    })
    folder.addBinding(setting.人影.监控.beijingOptions, 'districtLine',{label:'界线'});
    folder.addBinding(setting.人影.监控.beijingOptions, 'districtLineWidth',{label:'界线宽度',min:0,max:5,step:0.1});
    const lineColor = folder.addBinding(setting.人影.监控.beijingOptions, 'districtLineColor',{label:'界线颜色',picker:'popup',expanded:false});
    lineColor.on('change', (ev:any) => {
      setting.人影.监控.beijingOptions.districtLineColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.beijingOptions.districtLineColor,()=>{
      lineColor.refresh()
    })
  }

  {// 华北飞行区图层配置
    const folder = pane.addFolder({title: '华北飞行区',expanded:false});
    folder.addBinding(setting.人影.监控.ryAirspaces, 'fill',{label:'填充'});
    const fillColor = folder.addBinding(setting.人影.监控.ryAirspaces, 'fillColor',{label:'填充颜色',picker:'popup',expanded:false});
    fillColor.on('change', (ev:any) => {
      setting.人影.监控.ryAirspaces.fillColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.ryAirspaces.fillColor,()=>{
      fillColor.refresh()
    })
    folder.addBinding(setting.人影.监控.ryAirspaces, 'base',{label:'底线'});
    folder.addBinding(setting.人影.监控.ryAirspaces, 'baseWidth',{label:'底线宽度',min:0,max:5,step:0.1});
    const baseColor = folder.addBinding(setting.人影.监控.ryAirspaces, 'baseColor',{label:'底线颜色',picker:'popup',expanded:false});
    baseColor.on('change', (ev:any) => {
      setting.人影.监控.ryAirspaces.baseColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.ryAirspaces.baseColor,()=>{
      baseColor.refresh()
    })
    folder.addBinding(setting.人影.监控.ryAirspaces, 'line',{label:'界线'});
    folder.addBinding(setting.人影.监控.ryAirspaces, 'lineWidth',{label:'界线宽度',min:0,max:5,step:0.1});
    const lineColor = folder.addBinding(setting.人影.监控.ryAirspaces, 'lineColor',{label:'界线颜色',picker:'popup',expanded:false});
    lineColor.on('change', (ev:any) => {
      setting.人影.监控.ryAirspaces.lineColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.ryAirspaces.baseColor,()=>{
      lineColor.refresh()
    })
    folder.addBinding(setting.人影.监控.ryAirspaces, 'label',{label:'标签'});
    const labelColor = folder.addBinding(setting.人影.监控.ryAirspaces, 'labelColor',{label:'标签颜色',picker:'popup',expanded:false});
    labelColor.on('change', (ev:any) => {
      setting.人影.监控.ryAirspaces.labelColor = {r:Math.round(ev.value.r),g:Math.round(ev.value.g),b:Math.round(ev.value.b),a:ev.value.a};
    });
    watch(()=>setting.人影.监控.ryAirspaces.labelColor,()=>{
      labelColor.refresh()
    })
  }
  pane.addBinding(setting.人影.监控, 'routeLine',{label:'航路航线'});
  pane.addBinding(setting.人影.监控, 'airport',{label:'机场'});
  pane.addBinding(setting.人影.监控, 'plane',{label:'飞机'});
  pane.addBinding(setting.人影.监控, 'zyd',{label:'作业点'});
  pane.addBinding(setting.人影.监控, 'navigationStation',{label:'导航台'});
  // pane.addBinding(setting.人影.监控, 'zdz',{label:'自动站'});
  // pane.addBinding(setting.人影.监控, 'gridPoint',{label:'网格点'});
  // pane.addBinding(setting.人影.监控, 'gridValue',{label:'网格值'});
  // pane.addBinding(setting.人影.监控, 'isolines',{label:'等值线'});
  // pane.addBinding(setting.人影.监控, 'isobands',{label:'等值带'});
})
onBeforeUnmount(()=>{
  pane.dispose();
})
const setting = useSettingStore();
watch([
  ()=>setting.人影.监控.loadmap,
  ()=>setting.人影.监控.districtOptions.district,
  ()=>setting.人影.监控.ryAirspaces.fill,
  ()=>setting.人影.监控.routeLine,
  ()=>setting.人影.监控.airport,
  ()=>setting.人影.监控.plane,
  ()=>setting.人影.监控.zyd,
  ()=>setting.人影.监控.navigationStation,
  ()=>setting.人影.监控.zdz,
  ()=>setting.人影.监控.gridPoint,
  ()=>setting.人影.监控.gridValue,
  ()=>setting.人影.监控.isolines,
  ()=>setting.人影.监控.isobands,
],()=>{
  pane&&pane.refresh()
})
import datatable from "~/myComponents/datatable/index.vue";
const menus = reactive([
  { value: 12, type: "warning", svg: warnSvg, active: true },
  { value: 12, type: "success", svg: uavSvg, active: false },
  { value: 12, type: "primary", svg: deviceSvg, active: false },
  { value: 12, type: "danger", svg: recordSvg, active: false },
  { value: 12, type: "info", svg: whitelistSvg, active: false },
  { value: 0, svg: statisticSvg, active: false },
]);
const selectorColor = computed({
  get(){
    return setting.人影.监控.districtOptions.districtFillColor
  },
  set(val:{r:number,g:number,b:number,a:number}){
    setting.人影.监控.districtOptions.districtFillColor = val
  }
})
const tweakPaneRef = ref<HTMLElement>();
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
  // {
  //   selected: false,
  //   name: "天地图(地形)",
  //   url: formatUrl(
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c"
  //   ),
  //   tileData: [
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=ter_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //   ],
  // },
  // {
  //   selected: false,
  //   name: "天地图(影像)",
  //   url: formatUrl(
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c"
  //   ),
  //   tileData: [
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=img_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //   ],
  // },
  {
    selected: false,
    name: "天地图(矢量图)",
    url: formatUrl(
      "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c"
    ),
    tileData: [
      "/tianditu/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      // "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      // "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      // "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      // "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      // "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      // "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
      // "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=vec_w&tk=2dc8b729dfa88525897633f08a61ad5c",
    ],
  },
  // {
  //   selected: false,
  //   name: "天地图(标注)",
  //   url: formatUrl(
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c"
  //   ),
  //   tileData: [
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cva_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //   ],
  // },
  // {
  //   selected: false,
  //   name: "天地图(网路)",
  //   url: formatUrl(
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c"
  //   ),
  //   tileData: [
  //     "http://t0.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t1.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t2.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t3.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t4.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t5.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t6.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //     "http://t7.tianditu.com/DataServer?x={x}&y={y}&l={z}&T=cia_w&tk=2dc8b729dfa88525897633f08a61ad5c",
  //   ],
  // },
  // {
  //   selected: false,
  //   name: "天地图",
  //   url: formatUrl(
  //     "http://10.1.65.144:81/DataServer?T=vec_c&x={x}&y={y}&l={z}"
  //   ),
  //   tileData: ["http://10.1.65.144:81/DataServer?T=vec_c&x={x}&y={y}&l={z}"],
  // },
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
<style lang="scss">
// .tp-dfwv{
//   --tp-base-background-color: hsla(230, 5%, 90%, 1);
//   --tp-base-shadow-color: hsla(0, 0%, 0%, 0.1);
//   --tp-button-background-color: hsla(230, 7%, 75%, 1);
//   --tp-button-background-color-active: hsla(230, 7%, 60%, 1);
//   --tp-button-background-color-focus: hsla(230, 7%, 65%, 1);
//   --tp-button-background-color-hover: hsla(230, 7%, 70%, 1);
//   --tp-button-foreground-color: hsla(230, 10%, 30%, 1);
//   --tp-container-background-color: hsla(230, 15%, 30%, 0.2);
//   --tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
//   --tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
//   --tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
//   --tp-container-foreground-color: hsla(230, 10%, 30%, 1);
//   --tp-groove-foreground-color: hsla(230, 15%, 30%, 0.1);
//   --tp-input-background-color: hsla(230, 15%, 30%, 0.1);
//   --tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
//   --tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
//   --tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
//   --tp-input-foreground-color: hsla(230, 10%, 30%, 1);
//   --tp-label-foreground-color: hsla(230, 10%, 30%, 0.7);
//   --tp-monitor-background-color: hsla(230, 15%, 30%, 0.1);
//   --tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.5);
// }
// .dark .tp-dfwv{
//   --tp-base-background-color: hsla(230, 7%, 17%, 1);
// 	--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
//   --tp-button-background-color: hsla(230, 7%, 70%, 1);
//   --tp-button-background-color-active: hsla(230, 7%, 85%, 1);
//   --tp-button-background-color-focus: hsla(230, 7%, 80%, 1);
//   --tp-button-background-color-hover: hsla(230, 7%, 75%, 1);
//   --tp-button-foreground-color: hsla(230, 7%, 17%, 1);
//   --tp-container-background-color: hsla(230, 7%, 75%, 0.1);
//   --tp-container-background-color-active: hsla(230, 7%, 75%, 0.25);
//   --tp-container-background-color-focus: hsla(230, 7%, 75%, 0.2);
//   --tp-container-background-color-hover: hsla(230, 7%, 75%, 0.15);
//   --tp-container-foreground-color: hsla(230, 7%, 75%, 1);
//   --tp-groove-foreground-color: hsla(230, 7%, 75%, 0.1);
//   --tp-input-background-color: hsla(230, 7%, 75%, 0.1);
//   --tp-input-background-color-active: hsla(230, 7%, 75%, 0.25);
//   --tp-input-background-color-focus: hsla(230, 7%, 75%, 0.2);
//   --tp-input-background-color-hover: hsla(230, 7%, 75%, 0.15);
//   --tp-input-foreground-color: hsla(230, 7%, 75%, 1);
//   --tp-label-foreground-color: hsla(230, 7%, 75%, 0.7);
//   --tp-monitor-background-color: hsla(230, 7%, 0%, 0.2);
//   --tp-monitor-foreground-color: hsla(230, 7%, 75%, 0.7);
// }
:root{
  --tp-base-background-color: hsla(230, 5%, 90%, 1);
  --tp-base-shadow-color: hsla(0, 0%, 0%, 0.1);
  --tp-button-background-color: hsla(230, 7%, 75%, 1);
  --tp-button-background-color-active: hsla(230, 7%, 60%, 1);
  --tp-button-background-color-focus: hsla(230, 7%, 65%, 1);
  --tp-button-background-color-hover: hsla(230, 7%, 70%, 1);
  --tp-button-foreground-color: hsla(230, 10%, 30%, 1);
  --tp-container-background-color: hsla(230, 15%, 30%, 0.2);
  --tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
  --tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
  --tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
  --tp-container-foreground-color: hsla(230, 10%, 30%, 1);
  --tp-groove-foreground-color: hsla(230, 15%, 30%, 0.1);
  --tp-input-background-color: hsla(230, 15%, 30%, 0.1);
  --tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
  --tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
  --tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
  --tp-input-foreground-color: hsla(230, 10%, 30%, 1);
  --tp-label-foreground-color: hsla(230, 10%, 30%, 0.7);
  --tp-monitor-background-color: hsla(230, 15%, 30%, 0.1);
  --tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.5);
}
.dark .tp-dfwv{
  &.default{
    --tp-base-background-color: hsla(230, 7%, 17%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(230, 7%, 70%, 1);
    --tp-button-background-color-active: hsla(230, 7%, 85%, 1);
    --tp-button-background-color-focus: hsla(230, 7%, 80%, 1);
    --tp-button-background-color-hover: hsla(230, 7%, 75%, 1);
    --tp-button-foreground-color: hsla(230, 7%, 17%, 1);
    --tp-container-background-color: hsla(230, 7%, 75%, 0.1);
    --tp-container-background-color-active: hsla(230, 7%, 75%, 0.25);
    --tp-container-background-color-focus: hsla(230, 7%, 75%, 0.2);
    --tp-container-background-color-hover: hsla(230, 7%, 75%, 0.15);
    --tp-container-foreground-color: hsla(230, 7%, 75%, 1);
    --tp-groove-foreground-color: hsla(230, 7%, 75%, 0.1);
    --tp-input-background-color: hsla(230, 7%, 75%, 0.1);
    --tp-input-background-color-active: hsla(230, 7%, 75%, 0.25);
    --tp-input-background-color-focus: hsla(230, 7%, 75%, 0.2);
    --tp-input-background-color-hover: hsla(230, 7%, 75%, 0.15);
    --tp-input-foreground-color: hsla(230, 7%, 75%, 1);
    --tp-label-foreground-color: hsla(230, 7%, 75%, 0.7);
    --tp-monitor-background-color: hsla(230, 7%, 0%, 0.2);
    --tp-monitor-foreground-color: hsla(230, 7%, 75%, 0.7);
  }
  &.jetblack{
    --tp-base-background-color: hsla(0, 0%, 0%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 70%, 1);
    --tp-button-background-color-active: hsla(0, 0%, 85%, 1);
    --tp-button-background-color-focus: hsla(0, 0%, 80%, 1);
    --tp-button-background-color-hover: hsla(0, 0%, 75%, 1);
    --tp-button-foreground-color: hsla(0, 0%, 0%, 1);
    --tp-container-background-color: hsla(0, 0%, 10%, 1);
    --tp-container-background-color-active: hsla(0, 0%, 25%, 1);
    --tp-container-background-color-focus: hsla(0, 0%, 20%, 1);
    --tp-container-background-color-hover: hsla(0, 0%, 15%, 1);
    --tp-container-foreground-color: hsla(0, 0%, 50%, 1);
    --tp-groove-foreground-color: hsla(0, 0%, 10%, 1);
    --tp-input-background-color: hsla(0, 0%, 10%, 1);
    --tp-input-background-color-active: hsla(0, 0%, 25%, 1);
    --tp-input-background-color-focus: hsla(0, 0%, 20%, 1);
    --tp-input-background-color-hover: hsla(0, 0%, 15%, 1);
    --tp-input-foreground-color: hsla(0, 0%, 70%, 1);
    --tp-label-foreground-color: hsla(0, 0%, 50%, 1);
    --tp-monitor-background-color: hsla(0, 0%, 8%, 1);
    --tp-monitor-foreground-color: hsla(0, 0%, 48%, 1);
  }
  &.iceberg{
    --tp-base-background-color: hsla(230, 20%, 11%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(230, 10%, 80%, 1);
    --tp-button-background-color-active: hsla(230, 10%, 95%, 1);
    --tp-button-background-color-focus: hsla(230, 10%, 90%, 1);
    --tp-button-background-color-hover: hsla(230, 10%, 85%, 1);
    --tp-button-foreground-color: hsla(230, 20%, 11%, 1);
    --tp-container-background-color: hsla(230, 25%, 16%, 1);
    --tp-container-background-color-active: hsla(230, 25%, 31%, 1);
    --tp-container-background-color-focus: hsla(230, 25%, 26%, 1);
    --tp-container-background-color-hover: hsla(230, 25%, 21%, 1);
    --tp-container-foreground-color: hsla(230, 10%, 80%, 1);
    --tp-groove-foreground-color: hsla(230, 20%, 8%, 1);
    --tp-input-background-color: hsla(230, 20%, 8%, 1);
    --tp-input-background-color-active: hsla(230, 28%, 23%, 1);
    --tp-input-background-color-focus: hsla(230, 28%, 18%, 1);
    --tp-input-background-color-hover: hsla(230, 20%, 13%, 1);
    --tp-input-foreground-color: hsla(230, 10%, 80%, 1);
    --tp-label-foreground-color: hsla(230, 12%, 48%, 1);
    --tp-monitor-background-color: hsla(230, 20%, 8%, 1);
    --tp-monitor-foreground-color: hsla(230, 12%, 48%, 1);
  }
  &.retro{
    --tp-base-background-color: hsla(40, 3%, 90%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.3);
    --tp-button-background-color: hsla(40, 3%, 70%, 1);
    --tp-button-background-color-active: hsla(40, 3%, 55%, 1);
    --tp-button-background-color-focus: hsla(40, 3%, 60%, 1);
    --tp-button-background-color-hover: hsla(40, 3%, 65%, 1);
    --tp-button-foreground-color: hsla(40, 3%, 20%, 1);
    --tp-container-background-color: hsla(40, 3%, 70%, 1);
    --tp-container-background-color-active: hsla(40, 3%, 55%, 1);
    --tp-container-background-color-focus: hsla(40, 3%, 60%, 1);
    --tp-container-background-color-hover: hsla(40, 3%, 65%, 1);
    --tp-container-foreground-color: hsla(40, 3%, 20%, 1);
    --tp-groove-foreground-color: hsla(40, 3%, 40%, 1);
    --tp-input-background-color: hsla(120, 3%, 20%, 1);
    --tp-input-background-color-active: hsla(120, 3%, 35%, 1);
    --tp-input-background-color-focus: hsla(120, 3%, 30%, 1);
    --tp-input-background-color-hover: hsla(120, 3%, 25%, 1);
    --tp-input-foreground-color: hsla(120, 40%, 60%, 1);
    --tp-label-foreground-color: hsla(40, 3%, 50%, 1);
    --tp-monitor-background-color: hsla(120, 3%, 20%, 1);
    --tp-monitor-foreground-color: hsla(120, 40%, 60%, 0.8);
  }
  &.translucent{
    --tp-base-background-color: hsla(0, 0%, 10%, 0.8);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 80%, 1);
    --tp-button-background-color-active: hsla(0, 0%, 100%, 1);
    --tp-button-background-color-focus: hsla(0, 0%, 95%, 1);
    --tp-button-background-color-hover: hsla(0, 0%, 85%, 1);
    --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
    --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-container-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.2);
    --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
    --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
    --tp-input-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-label-foreground-color: hsla(0, 0%, 100%, 0.5);
    --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
    --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);
  }
  &.vivid{
    --tp-base-background-color: hsla(0, 80%, 40%, 1);
    --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
    --tp-button-background-color: hsla(0, 0%, 100%, 1);
    --tp-button-background-color-active: hsla(0, 0%, 85%, 1);
    --tp-button-background-color-focus: hsla(0, 0%, 90%, 1);
    --tp-button-background-color-hover: hsla(0, 0%, 95%, 1);
    --tp-button-foreground-color: hsla(230, 20%, 11%, 1);
    --tp-container-background-color: hsla(0, 0%, 0%, 0.2);
    --tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
    --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.3);
    --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
    --tp-container-foreground-color: hsla(0, 0%, 100%, 0.9);
    --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color: hsla(0, 0%, 0%, 0.5);
    --tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
    --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
    --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
    --tp-input-foreground-color: hsla(0, 0%, 100%, 0.9);
    --tp-label-foreground-color: hsla(0, 0%, 100%, 0.9);
    --tp-monitor-background-color: hsla(0, 0%, 0%, 0.5);
    --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.5);
  }
}
</style>
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
  display: none;//flex
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
