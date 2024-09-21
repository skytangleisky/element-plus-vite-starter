<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <div
      v-resize="resize"
      ref="mapRef"
      style="
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 1;
        outline: none;
        background: #2b2b2b;
      "
    ></div>
    <Dialog
      v-dialogDrag
      class="stationDialog"
      v-model:menus="dialogOptions.menus"
    ></Dialog>
    <plan-panel
      :当前作业进度="planProps.当前作业进度"
      :今日作业记录="planProps.今日作业记录"
    ></plan-panel>
    <el-select
      class="select"
      style="position: absolute; width: 100px; left: 588px; top: 10px"
      size="small"
      v-model="color"
      placeholder="请选择颜色"
    >
      <el-option
        v-for="(v, k) in options"
        :label="v.label"
        :value="v.value"
        :key="k"
      ></el-option>
    </el-select>
    <graph
      v-if="checkPermission(['admin'])"
      class="absolute left-0 bottom-50px"
      v-model:args="graphArgs"
    ></graph>
    <div class="stationMenu" ref="stationMenuRef" @mousedown.stop>
      <ul>
        <li @click="作业申请()">地面作业申请</li>
        <li>查看作业点信息</li>
        <li>人工批复</li>
        <li>人工移除</li>
        <li>手动发结束报</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import planeUrl from "~/assets/飞机.svg?url";
import projectileUrl from "~/assets/projectile.svg?url";
import 导航台图标 from '~/assets/navigationStation.svg?url'
import 火箭弹图标 from '~/assets/火箭弹.svg?url'
import 高炮图标 from '~/assets/高炮.svg?url'
import axios from 'axios'
import { eventbus } from "~/eventbus";
import { reactive, onMounted, onBeforeUnmount, ref, watch } from "vue";
import PlanPanel, { planDataType,zyddataType } from "./planPanel.vue";
import Dialog from "./dialog.vue";
import graph from "~/tools/graph.vue";
import { addFeatherImages, getFeather,View,getLngLat } from "~/tools";
import CustomLayer from "./webglLayer/CustomLayer.js";
import airstrip from "./airstrip.js";
import { exec } from "~/api/index.js";
import interpolate from "./idw.js";
import { isoLines, isoBands } from "marchingsquares";
import { area, pointInPolygon,loadImage2Map } from "~/tools/index.ts";
import moment from "moment";
import { rgb2Hsl } from "~/myComponents/map/js/core";
import palette from "../mapbox/data/温度/tempreture.xml?raw";
import plotUrl from "../mapbox/data/plot/06040802.000?url";
import palette2 from "../mapbox/data/highTemperature/850hPaTemp.xml?raw";
import plotUrl2 from "../mapbox/data/highTemperature/06040808.000?url";
import { getMicapsData } from "../mapbox/data/plot/micaps";
import { wgs84togcj02 } from "~/myComponents/map/workers/mapUtil";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useSettingStore } from "~/stores/setting.js";
const setting = useSettingStore();
import * as turf from "@turf/turf";
const dialogOptions = reactive({ menus: [] });
const stationMenuRef = ref<HTMLDivElement>();
let stationMenu: HTMLDivElement;
let circleFeatures: any = [];
const emits = defineEmits([
  "update:center",
  "update:zoom",
  "update:pitch",
  "update:bearing",
  "update:prevRequestShow",
  "update:prevRequestData",
]);
let 作业申请 = () => {
  let properties = $(stationMenu).data();
  $(stationMenu).css({display:'none'})
  emits("update:prevRequestShow", true);
  properties.beginTime = moment().format('HH:mm:ss')
  emits("update:prevRequestData", properties);
};
import {
  checkPermission,
  calculateSectorPoints,
  calculateCirclePoints,
} from "~/tools/index.ts";
import { prevRequestDataType } from "../dialog_plan_request.vue";
let graphArgs = reactive({
  fps: { value: 0, min: 0, max: 144, strokeStyle: "#ffffff88" },
  // memory: { value: 0, min: 0, max: 120, strokeStyle: "#0f0" },
});
const getHue = (min: number, v: number, max: number) => {
  let value;
  if (v < min) {
    value = min;
  } else if (v > max) {
    value = max;
  } else {
    value = v;
  }
  let percent = (value - min) / (max - min);
  //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
  // hsl(240,100%,50%)～hsl(180,100%,50%)
  // return (1 - percent) * 60 + 180;
  //hsl(60,100%,50%)～hsl(0,100%,50%)
  // return (1 - percent) * 60;
};
mapboxgl.accessToken = "pk.eyJ1IjoidGFuZ2xlaTIwMTMxNCIsImEiOiJjbGtmOTdyNWoxY2F1M3Jqczk4cGllYXp3In0.9N-H_79ehy4dJeuykZa0xA";
const Map = mapboxgl.Map;
const Marker = mapboxgl.Marker;
const Popup = mapboxgl.Popup;
const NavigationControl = mapboxgl.NavigationControl;
const FullscreenControl = mapboxgl.FullscreenControl;
let timer = 0;
let graphTimer = 0;
let frameCounter = 0;
const mapRef = ref<HTMLCanvasElement>();
const color = ref("red");
const options = ref([
  { label: "红色", value: "red" },
  { label: "绿色", value: "green" },
  { label: "蓝色", value: "blue" },
]);
type zydparaType = {
  strID: "110108082";
  strCode: "110108082";
  strName: "北马场作业站烟炉";
  strRelayUnit: "110108000";
  strMgrUnit: "990201000";
  strPos: "116090001E39584800N";
  strWeapon: 3;
  iMaxShotHei: 8000;
  iMaxShotRange: 10000;
  strShotSector: "360";
  strShotAngle: "90";
  strIP: "NULL";
  strSimNo: "NULL";
  bAutoUpSend: 1;
  bAutoDownSend: 1;
  iVersion: 2;
  listenPort: 15;
  iShortAngelBegin: number;
  iShortAngelEnd: 360;
  iType: null;
  connectType: 0;
  dataver: 50;
  iAltitude: 0;
  unitName: string;
};
type stationData = {
  unitName: string;
} & zydparaType;
let map: any;
const resize = () => {
  map && map.resize();
};
const planProps = reactive({
  当前作业进度: new Array<planDataType>(),
  今日作业记录: new Array<planDataType>(),
});
const props = withDefaults(
  defineProps<{
    prevRequestShow?: boolean;
    prevRequestData?: prevRequestDataType;
    routeLine?: boolean;
    loadmap?: boolean;
    district?: boolean;
    zyd?: boolean;
    tile?: { index: number; tileData: Array<string> };
    center?: object;
    zoom?: number;
    pitch?: number;
    bearing?: number;
    zdz?: boolean;
    plane?: boolean;
    isolines?: boolean;
    isobands?: boolean;
    gridPoint?: boolean;
    gridValue?: boolean;
    feather?: boolean;
    equidistantRing?: boolean;
    districtLineColor?:string;
  }>(),
  {
    routeLine: true,
    zyd: true,
    loadmap: true,
    district: true,
    tile: () => ({ index: 0, tileData: new Array<string>() }),
    center: () => [0, 0],
    zoom: 4,
    pitch: 0,
    bearing: 0,
    zdz: true,
    plane: true,
    isolines: true,
    isobands: true,
    gridPoint: true,
    gridValue: true,
    feather: false,
    equidistantRing: false,
    districtLineColor:'#ffffff',
  }
);
import style from "./editMap.js";
style.layers.map((v: any) => {
  if (v.id == "simple-tiles") {
    v.layout.visibility = props.loadmap ? "visible" : "none";
  } else if (v.id == "districtLineOver" || v.id == "districtLineBase") {
    v.layout.visibility = props.district ? "visible" : "none";
  }
});
let active = () => {};
const zoomFunc = () => {
  emits("update:zoom", map.getZoom());
};
const pitchFunc = () => {
  emits("update:pitch", map.getPitch());
};
const bearingFunc = () => {
  console.log(map.getBearing());
  emits("update:bearing", map.getBearing());
};
const moveFunc = () => {
  emits("update:center", map.getCenter());
};
function 网络上报(data:prevRequestDataType){
  dialogOptions.menus.map((item: stationData) => {
    if(item.strID == data.strID){
      let zyddata:zyddataType = {
        strWorkID: `RW${data.strID}${moment().format('YYYY-MM-DD-')}${data.beginTime.replace(/:/g,'-')}`,
        strZydID: data.strID,
        ubyStatus: 72,
        ubySendStatus: 3,
        ubyProcStatus: 3,
        strCode: data.strCode,
        strName: data.strName,
        strWeapon: data.iWeapon.toFixed(),
        strCurPos: item.strPos,
        iRange: data.iMaxShotRange,
        iMaxShotHei: item.iMaxShotHei,
        strApplyUnit: item.strMgrUnit,
        tmBeginApply: moment().format("YYYY-MM-DD HH:mm:ss"),
        iApplyTimeLen: data.duration,
        tmApplyRev: null,
        tmApplySend: null,
        tmApplyCreate: moment().format('YYYY-MM-DD HH:mm:ss'),
        strApplyMark: "",
        tmBeginAnswer: null,
        iAnswerTimeLen: 3,
        strAnswerUnit: item.strMgrUnit,
        tmAnswerRev: moment().format('YYYY-MM-DD HH:mm:ss'),
        tmAnswerSend: moment().format('YYYY-MM-DD HH:mm:ss'),
        tmAnswerCreate: moment().format('YYYY-MM-DD HH:mm:ss'),
        strAnswerMark: "",
        tmUpdate: moment().format('YYYY-MM-DD HH:mm:ss'),
        strATCUnitID: item.strMgrUnit,
        vecProcess: ";11:47:06,本地作业申请(电话);11:47:15,电话下发批准;11:47:16,作业自动开始",
        strUpApplyUnit: item.strMgrUnit,
        tmBeginActing: moment().format('YYYY-MM-DD HH:mm:ss'),
        iActingTimeLen: 0,
        strEndUnit: "",
        tmEndRev: null,
        tmEndSend: null,
        tmEndCreate: null,
        strEndMark: "",
        iEndType: 0,
        bApplyValid: 0,
        bAnswerValid: 1,
        bEndValid: 0,
        iAngleBegin: data.iShotRangeBegin,
        iAngleEnd: data.iShotRangeEnd,
        bAnswerAccept: 1,
        tmEnd: null,
        bRevOver: null,
        ubyWorkCat: 0,
      }
      let one:planDataType = {
        ...zyddata,
        unitName: data.unitName,
      }
      planProps.当前作业进度.push(one)
      let vals = []
      let key: keyof(zyddataType)
      for(key in zyddata){
        let v = zyddata[key]
        if(v===null){
          vals.push('NULL')
        }else if(typeof v == 'string'){
          vals.push(`'${v}'`)
        }else {
          vals.push(v)
        }
      }
      exec({
        database:"host=tanglei.top&port=3308&user=root&password=mysql&database=ryplat_bjry",
        query:{sqls:["INSERT INTO `ryplat_bjry`.`zyddata` ("+Object.keys(zyddata).join(',')+") VALUES ("+vals.join(',')+")"]}
      }).then(res=>{
        console.log(res.data)
      })
    }
    emits('update:prevRequestShow',false)

    let v = data.strPos;
    let lng = v.substring(0, v.indexOf("E"));
    let lat = v.substring(v.indexOf("E") + 1, v.indexOf("N"));
    let pt = {
      lng:
        Number(lng.substring(0, 3)) +
        Number(lng.substring(3, 5)) / 60 +
        Number(lng.substring(5, 9)) / 100 / 3600,
      lat:
        Number(lat.substring(0, 2)) +
        Number(lat.substring(2, 4)) / 60 +
        Number(lat.substring(4, 8)) / 100 / 3600,
    };
    if (data.iShotRangeEnd - data.iShotRangeBegin >= 360) {
      const center: [number, number] = wgs84togcj02(pt.lng, pt.lat) as [
        number,
        number
      ]; // 圆心点的经纬度
      const radius: number = data.iMaxShotRange; // 半径（单位：米
      const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
      const units: turf.Units = "meters"; // 半径的单位
      const sectorPoints: [number, number][] = calculateCirclePoints(
        center,
        radius,
        steps,
        units
      );
      const sectorPolygon = turf.polygon([sectorPoints], {
        strID: item.strID,
        color: "transparent",
        fillColor: "transparent",
      });
      for(let i=0;i<circleFeatures.length;i++){
        if(circleFeatures[i].properties.strID == data.strID){
          circleFeatures[i].geometry.coordinates = sectorPolygon.geometry?.coordinates
          circleFeatures[i].properties.color = '#0f0'
        }
      }
    } else {
      const center: [number, number] = wgs84togcj02(pt.lng, pt.lat) as [
        number,
        number
      ]; // 圆心点的经纬度
      const radius: number = data.iMaxShotRange; // 半径（单位：米
      const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
      const startAngle: number = data.iShotRangeBegin; // 起始角度（单位：度）
      const endAngle: number =
        data.iShotRangeEnd > startAngle
          ? data.iShotRangeEnd
          : data.iShotRangeEnd + 360; // 终止角度（单位：度）
      const units: turf.Units = "meters"; // 半径的单位
      const sectorPoints: [number, number][] = calculateSectorPoints(
        center,
        radius,
        startAngle,
        endAngle,
        steps,
        units
      );
      const sectorPolygon = turf.polygon([sectorPoints], {
        strID: item.strID,
        color: "transparent",
        fillColor: "transparent",
      });
      for(let i=0;i<circleFeatures.length;i++){
        if(circleFeatures[i].properties.strID == data.strID){
          circleFeatures[i].geometry.coordinates = sectorPolygon.geometry?.coordinates
          circleFeatures[i].properties.color = '#0f0'
        }
      }
    }
    let source = map.getSource("最大射程source");
    source.setData({
      type: "FeatureCollection",
      features: circleFeatures,
    });
  })
}
const flyTo = (item: any) => {
  try {
    active();
    let v = item.strPos;
    let lng = v.substring(0, v.indexOf("E"));
    let lat = v.substring(v.indexOf("E") + 1, v.indexOf("N"));
    let pt = {
      lng:
        Number(lng.substring(0, 3)) +
        Number(lng.substring(3, 5)) / 60 +
        Number(lng.substring(5, 9)) / 100 / 3600,
      lat:
        Number(lat.substring(0, 2)) +
        Number(lat.substring(2, 4)) / 60 +
        Number(lat.substring(4, 8)) / 100 / 3600,
    };
    let position = wgs84togcj02(pt.lng, pt.lat);
    map.flyTo({
      center: position, // 新的中心点 [经度, 纬度]
      zoom: item.zoom || 12, // 目标缩放级别
      speed: 1, // 飞行速度，1 为默认速度
      // curve: 1, // 飞行路径的曲率, 1 是直线
      // easing: function (t) {
      //   return t;
      // }, // 自定义缓动函数
      essential: true, // 这个飞行动作对于用户交互是必要的
    });
  } catch (error) {
    console.log({ longitude: item.lng, latitude: item.lat });
    console.log(error);
  }
};
onMounted(() => {
  graphTimer = setInterval(() => {
    graphArgs.fps.value = map.painter.frameCounter - frameCounter;
    frameCounter = map.painter.frameCounter;
    // graphArgs.memory.value = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    // graphArgs.memory.max = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
  }, 1000);
  map = new Map({
    container: (mapRef.value as unknown) as HTMLCanvasElement,
    // projection: "globe",
    // style: raster,
    // performanceMetricsCollection: false,
    style: style as mapboxgl.Style,
    // fadeDuration: 0,
    // dragRotate: false,
    // touchRotate: false,
    // touchPitch: false,
    // dragPitch: false,
    // bounds: turf.bbox(boundaries),
    // localIdeographFontFamily: "Microsoft YoHei",
    localIdeographFontFamily: "Menlo,Consolas,Monaco",
    antialias: true,
    renderWorldCopies: true,
    // maxZoom: 17,
    maxZoom: 21, //mapbox最高支持21,瓦片等级最高到22级
    // minZoom: 1,
    // maxBounds: [
    //   [60.0, 0],
    //   [160.0, 60],
    // ],
    // zoom: 18,
    // center: [148.9819, -35.3981],
    zoom: props.zoom,
    center: props.center as mapboxgl.LngLatLike,
    pitch: props.pitch,
  });
  const d = new TextDecoder('gbk')
  const GISTYPE={
    GIS_POINT: 1,
    GIS_LINE: 2,
    GIS_REGION: 3,
    GIS_POINT2: 11,
    GIS_LINE2 : 12,
    GIS_REGION2: 13,
    GIS_AIRLINE: 20,//航线
    GIS_AIRMAPPOINT: 21,//新的点数据文件
    GIS_AIRMAPLINE: 22,//新的点数据文件
    GIS_AIRMAPREGION: 23,//新的点数据文件
    GIS_AIRLINE2: 30,//新定义的航线，增加航段长，航向信息
    GIS_DATA_POINT: 31,//新的面图元数据
    GIS_DATA_LINE: 32,//新的面图元数据
    GIS_DATA_REGION: 33,//新的面图元数据
  }
  map.on("load", async () => {
    await loadImage2Map(map,planeUrl,32,32,{
      airplane:{
        style: 'fill:yellow;stroke:black;stroke-width:30px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
      }
    })
    await loadImage2Map(map,projectileUrl,12,24,{
      'projectile-white':{
        style:"fill:white;stroke:black;stroke-width:1px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
      'projectile-red':{
        style:"fill:red;stroke:black;stroke-width:1px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      }
    })
    await loadImage2Map(map,导航台图标,18,18,{
      导航台图标:{
        style:'fill:white;stroke:black;stroke-width:1px',
      }
    })
    await loadImage2Map(map,火箭弹图标,32,32,{
      火箭弹图标:{
        style:"fill:white;stroke:black;stroke-width:30px;",
      }
    })
    await loadImage2Map(map,高炮图标,32,32,{
      高炮图标:{style:"fill:white;stroke:black;stroke-width:20px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;"}
    })
    axios({
      method:'get',
      url:'/resources/导航台.map',
      responseType: 'arraybuffer',
    }).then(async(res)=>{
      let view = new View(res.data,true);
      let result = {
        filehead:{
          iLayerNum: view.getInt32(), //文件中包含的图层数。（建议一个图层一个文件，iLayerNum=1）/*int*/
          szReserved: view.getBytes(512), //保留字段。/*char[]*/
        },
        tagLayerPara:{
          iLayerID: view.getInt32(), //图层ID。/*int*/
          szLayerName: view.getBytes(128), //图层名称。/*char[]*/
          sLayerType: view.getInt16(),  //图层类型。（1-点、2-线、3-面、其他）/*short*/
          iLayerNotesLen: view.getInt32(),		//图层附加属性长度。/*int*/
          iUnitCount: view.getInt32(),  //图元个数。/*int*/
          iUnitNotesLen: view.getInt32(),	//图元附加属性长度。/*int*/
          iMapLevel: view.getInt32(),  //本图层所属层数。/*int*/
          dMaximumScale: view.getFloat64(),  // /*double*/
          dMinimumScale: view.getFloat64(),  //当Map Scale介于dMinimumScale和dMaximumScale之间时，才显示本图层。/*double*/
          bScaleSymbols: view.getUint8(),  //图层中的Symbol是否随图层放大而放大、随图层缩小而缩小。/*bool*/
          bVisible: view.getInt16(),  //图层是否显示。（1-全显示、2-部分显示、3-不显示）/*bool*/
          bShowLable: view.getInt16(),  //图元标注显示与否。（1-全显示、2-部分显示、3-不显示）/*bool*/
          layerTips:{ //图层标注（预留）。
            x:view.getFloat64(),/*double*/
            y:view.getFloat64(), //(x,y)指定标注位置。/*double*/
            szTips:view.getBytes(128), //标注文本 /*char[]*/
            bShowTips: view.getUint8() //是否显示图层标注 /*bool*/
          },
          spatialReference:{ //投影方式（预留）。
            iProjectMethod: view.getInt32(), //投影方式（1－正圆锥投影、）/*int*/
            dOrgLong: view.getFloat64(),		//投影坐标系坐标原点经度。/度 /*double*/
            dOrgLat: view.getFloat64(),			//投影坐标系坐标原点纬度。/度 /*double*/
            iOrgHeight: view.getInt32(),		//投影坐标系坐标原点高度。/米 /*int*/
            szReserved:view.getBytes(512),	//预留。 /*char[]*/
          },
          layerSource:{ //图层数据源，（预留）。
            sDataType:view.getInt16(),  //数据源类型（0―无源(可能是动态创建的)，1―文件，2―数据库）/*short*/
            DataSource:view.getBytes(128), //数据源。（*.gis）/*char[]*/
            szReserved:view.getBytes(128), //保留 /*char[]*/
            iReserved:view.getInt32()  //保留 /*int*/
          },
          layerEffects:{ //图层显示效果，（预留）。
            Brightness: view.getUint8(),  //明亮度（0～100）/*unsigned char*/
            Constrast: view.getUint8(),  //对比度（0～100）/*unsigned char*/
            Tranceparency: view.getUint8(),  //透明度（0～100）/*unsigned char*/
            bSupportsBrightnessChange: view.getUint8(),  //是否支持明亮度变化 /*bool*/
            bSupportsConstrastChange: view.getUint8(),  //是否支持对比度变化 /*bool*/
            bSupportsTranceparency: view.getUint8(),  //是否支持透明度 /*bool*/
            bSupportsInteractive: view.getUint8(),    //Indicates if the layer supports interactive effects changes /*bool*/
          }
        },
      }
      switch (result.tagLayerPara.sLayerType){
        // case GISTYPE.GIS_POINT:
        // case GISTYPE.GIS_POINT2:
        //   layerPara.m_cLayerType = GIS_POINT;
        //   bReadUnitOK = ReadPointLayer(rfile, pLayer, layerPara);
        //   break;
        // case GISTYPE.GIS_LINE:
        case GISTYPE.GIS_LINE2://如岛屿
          // layerPara.m_cLayerType = GIS_LINE;
          // bReadUnitOK = ReadLineLayer(rfile, pLayer, layerPara);
          console.log(view.getInt32())
          break;
        // case GISTYPE.GIS_REGION:
        // case GISTYPE.GIS_REGION2:
        //   layerPara.m_cLayerType = GIS_REGION;
        //   bReadUnitOK = ReadRegionLayer(rfile, pLayer, layerPara);
        //   break;
        case GISTYPE.GIS_AIRLINE:
          // layerPara.m_cLayerType = GIS_AIRLINE;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          console.log(view.getBytes(view.getInt32()))
          break;
        case GISTYPE.GIS_AIRMAPPOINT:
          // layerPara.m_cLayerType = GIS_AIRMAPPOINT;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          let iDataLen = view.getInt32()
          if(iDataLen<=0){
            return;
          }
          let utf8Decoder = new TextDecoder('utf8')
          let tagPara = {
            m_clearType:view.getInt16(),
            m_strLayerName:utf8Decoder.decode(view.getBytes(view.getUint16())),
            iUnitNum:view.getInt32(),
          }
          let vecUnit = []
          for(let i=0;i<tagPara.iUnitNum;i++){//tagPara.iUnitNum
            let pUnit = {
              iID: view.getInt32(),//图元ID
              strCode: utf8Decoder.decode(view.getBytes(view.getUint16())),//图元名称
              tagRGB:{///图元颜色
                sBlue: view.getUint8(),
                sGreen: view.getUint8(),
                sRed: view.getUint8(),
              },
              tagText:{///标注信息
                strText:utf8Decoder.decode(view.getBytes(view.getUint16())),//标注内容
                tagPos:{//标注位置
                  dLong:view.getFloat64(),//Longitude 经度
                  dLat:view.getFloat64(),//Latitude	纬度
                  dHeight:view.getFloat64(),//Height 海拔高度 米
                },
              },
              ubyType:view.getUint8(),///类型，0未知，1点，2线，3面
              ubyShow:view.getUint8(),///是否显示
              ubyLevel:view.getUint8(),///图元等级
              tagPos:{//点的空间属性
                dLong:view.getFloat64(),//Longitude 经度
                dLat:view.getFloat64(),//Latitude	纬度
                dHeight:view.getFloat64(),//Height 海拔高度 米
              },
              ubyPointStyle:view.getUint8(),///点的形状
              ubyDataType:view.getUint8(),///地标类型，
              ubyAirLinePt:view.getUint8(),///航线航路过点
            }
            vecUnit.push(pUnit)
          }
          let features = []
          for(let i=0;i<vecUnit.length;i++){
            features.push({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': wgs84togcj02(vecUnit[i].tagPos.dLong,vecUnit[i].tagPos.dLat)
              },
              'properties': {
                'name': vecUnit[i].tagText.strText,
              }
            })
          }
          map.addLayer({
            id: "导航台图层",
            type: "symbol",
            source:  {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features':features
              }
            },
            layout: {
              visibility: props.zyd ? "visible" : "none",
              // This icon is a part of the Mapbox Streets style.
              // To view all images available in a Mapbox style, open
              // the style in Mapbox Studio and click the "Images" tab.
              // To add a new image to the style at runtime see
              // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
              "icon-image":'导航台图标',
              // "icon-allow-overlap": true,
              // "icon-ignore-placement": true,
              "icon-pitch-alignment": "map",
              "icon-rotation-alignment":"map",
              "text-field": ["get", "name"],
              "text-font": ["simkai"],
              "text-size": 12,
              "text-transform": "uppercase",
              // "text-letter-spacing": 0.05,】,
              "text-line-height": 1,
              'text-anchor': 'bottom', // 水平垂直居中
              'text-offset': [0, -1], // 调整文本偏移量
              'text-justify': 'center', // 水平居中对齐
              "text-ignore-placement": false,
              "text-allow-overlap": false,
              "text-pitch-alignment": "map",
              "text-rotation-alignment": "map",
              // "text-max-width": 400,
            },
            paint: {
              "icon-opacity": 1,
              "text-color": "white",
              "text-halo-color": "black",
              "text-halo-width": 1,
            }
          });


          break;
        case GISTYPE.GIS_DATA_POINT:
        case GISTYPE.GIS_DATA_LINE://如飞行管制分区
        case GISTYPE.GIS_DATA_REGION://如禁区
        //   layerPara.m_cLayerType = tagLayerPara.sLayerType;
        //   bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          break;
        default:
          throw new Error('Unknow GISTYPE: '+result.tagLayerPara.sLayerType)
      }
    })
    /*
    axios({
      method: 'get',
      url: 'https://data.tanglei.top/人影飞行区域.map',
      responseType: 'arraybuffer',
    }).then(res=>{
      let view = new View(res.data,true);
      type S_SimpleRegionSymbol = {
        Line:S_SimpleLineSymbol,//面边线
        FillColor:S_Color,//面填充颜色
        iStyle:number,//1字节，0不填充，1填充
      }
      type S_RegionUnit = {
        iID:number,//4字节
        UnitName:string,//10字节,图元名称
        LinePos:S_LinePos,
        RegionSymbol:S_SimpleRegionSymbol,
        TextSymbol:S_TextSymbol,
        sShow:number,//1字节，0都不显示，1仅显示图元，2仅显示标注，3都显示
      }
      type S_LinePoint = {
        PointPos:S_PointPos,
        sPointType:number,//1字节,(1-普通线，2-圆弧（后续四点在pLinePoint中依次存放:圆弧外包矩形的左上角点，右下角点；圆弧的起始点，终止点）)
        TextSymbol:S_TextSymbol,
      }
      type S_PointPos={
        dLong:number,//8字节
        dLat:number,//8字节
        x:number,//4字节
        y:number,//4字节
      }
      type S_Color={
        sRed:number,//1字节
        sGreen:number,//1字节
        sBlue:number,//1字节
        sTransperancy:number,//1字节,透明度
      }
      type S_Font = {
        szFontName:string//32字节，字体名称
        sFontSize:number//2字节,字体大小
        sFontBold:number//2字节,字体磅值
        sStyle:number//1字节,[1-1-000000]表示[斜体-下划线-000000]
      }
      type S_SimplePointSymbol={
        sSymbolType:number,//1字节，点符号类型（如Truetype字体,位图等）
        Angle:number,//2字节,角度
        Color:S_Color,
        Font:S_Font,
        iFontIndex:number,//2字节,字号
        szBitMap:string,//128字节，位图文件名
        iBitMapX:number,//2字节
        iBitMapY:number,//2字节
      }
      type S_TextSymbol = {
        Angle:number,//2字节
        Color:S_Color,
        Font:S_Font,
        AlignmentStyle:number,//1字节，文字横排风格，文字竖排风格，文字是否从右写到左
        iTextSize:number,//2字节，文本长度
        szText:string,//128字节，文本
        sTextPos:number,//1字节，标注位置
        fLong:number,//4字节，文本显示位置经度
        fLat:number,//4字节，文本显示位置纬度
      }
      type S_PointUnit ={
        iID:number,//4字节
        unitName:string,//10字节，图元名称
        Pos:S_PointPos,
        PointSymbol:S_SimplePointSymbol,
        TextSymbol:S_TextSymbol,
        sShow:number,//1字节，0都不显示，1仅显示图元，2仅显示标注，3都显示
      }
      type S_LinePos = {
        iPointNum:number,//4字节，点数目
        reserve:number,//4字节,保留，取代原S_LinePoint指针,指针在64位时长度变为8，导致程序编译为64位时无法正常读取地图文件
      }
      type S_SimpleLineSymbol = {
        Color:S_Color,
        sStyle:number,//1字节，线型[0000000-1|0]表示[0000000-虚线|实线]
        iWidth:number,//2字节
      }
      type S_LineUnit = {
        iID:number,//4字节，图元ID
        UnitName:string,//10字节,图元名称
        LinePos:S_LinePos,//线的空间属性
        LineSymbol:S_SimpleLineSymbol,//线符号
        TextSymbol:S_TextSymbol,//线标注
        sShow:number,//1字节，0都不显示，1仅显示图元，2仅显示标注，3都显示
      }


      let result = {
        filehead:{
          iLayerNum: view.getInt32(), //文件中包含的图层数。（建议一个图层一个文件，iLayerNum=1）int
          szReserved: view.getBytes(512), //保留字段。char[]
        },
        tagLayerPara:{
          iLayerID: view.getInt32(), //图层ID。int
          szLayerName: view.getBytes(128), //图层名称。char[]
          sLayerType: view.getUint16(),  //图层类型。（1-点、2-线、3-面、其他）short
          iLayerNotesLen: view.getInt32(),		//图层附加属性长度。int
          iUnitCount: view.getInt32(),  //图元个数。int
          iUnitNotesLen: view.getInt32(),	//图元附加属性长度。int
          iMapLevel: view.getInt32(),  //本图层所属层数。int
          dMaximumScale: view.getFloat64(),  // double
          dMinimumScale: view.getFloat64(),  //当Map Scale介于dMinimumScale和dMaximumScale之间时，才显示本图层。double
          bScaleSymbols: view.getUint8(),  //图层中的Symbol是否随图层放大而放大、随图层缩小而缩小。bool
          bVisible: view.getUint16(),  //图层是否显示。（1-全显示、2-部分显示、3-不显示）bool
          bShowLable: view.getUint16(),  //图元标注显示与否。（1-全显示、2-部分显示、3-不显示）bool
          layerTips:{ //图层标注（预留）。
            x:view.getFloat64(),double
            y:view.getFloat64(), //(x,y)指定标注位置。double
            szTips:view.getBytes(128), //标注文本 char[]
            bShowTips: view.getUint8() //是否显示图层标注 bool
          },
          spatialReference:{ //投影方式（预留）。
            iProjectMethod: view.getInt32(), //投影方式（1－正圆锥投影、）int
            dOrgLong: view.getFloat64(),		//投影坐标系坐标原点经度。/度 double
            dOrgLat: view.getFloat64(),			//投影坐标系坐标原点纬度。/度 double
            iOrgHeight: view.getInt32(),		//投影坐标系坐标原点高度。/米 int
            szReserved:view.getBytes(512),	//预留。 char[]
          },
          layerSource:{ //图层数据源，（预留）。
            sDataType:view.getUint16(),  //数据源类型（0―无源(可能是动态创建的)，1―文件，2―数据库）short
            DataSource:view.getBytes(128), //数据源。（*.gis）char[]
            szReserved:view.getBytes(128), //保留 char[]
            iReserved:view.getInt32()  //保留 int
          },
          layerEffects:{ //图层显示效果，（预留）。
            Brightness: view.getUint8(),  //明亮度（0～100）unsigned char
            Constrast: view.getUint8(),  //对比度（0～100）unsigned char
            Tranceparency: view.getUint8(),  //透明度（0～100）unsigned char
            bSupportsBrightnessChange: view.getUint8(),  //是否支持明亮度变化 bool
            bSupportsConstrastChange: view.getUint8(),  //是否支持对比度变化 bool
            bSupportsTranceparency: view.getUint8(),  //是否支持透明度 bool
            bSupportsInteractive: view.getUint8(),    //Indicates if the layer supports interactive effects changes bool
          }
        },
      }
      switch (result.tagLayerPara.sLayerType){
        // case GISTYPE.GIS_POINT:
        // case GISTYPE.GIS_POINT2:
        //   layerPara.m_cLayerType = GIS_POINT;
        //   bReadUnitOK = ReadPointLayer(rfile, pLayer, layerPara);
        //   break;
        // case GISTYPE.GIS_LINE:
        case GISTYPE.GIS_LINE2://如岛屿
          // layerPara.m_cLayerType = GIS_LINE;
          // bReadUnitOK = ReadLineLayer(rfile, pLayer, layerPara);
          console.log(view.getInt32())
          break;
        case GISTYPE.GIS_REGION:
        case GISTYPE.GIS_REGION2:
        //   layerPara.m_cLayerType = GIS_REGION;
        //   bReadUnitOK = ReadRegionLayer(rfile, pLayer, layerPara);
          const line:S_LineUnit = {
            iID:view.getInt32(),
            UnitName: d.decode(view.getBytes(10)),
            LinePos:{
              iPointNum:view.getInt32(),
              reserve:view.getInt32(),
            },
            LineSymbol:{
              Color:{
                sRed:view.getUint8(),//1字节
                sGreen:view.getUint8(),//1字节
                sBlue:view.getUint8(),//1字节
                sTransperancy:view.getUint8(),//1字节,透明度
              },
              sStyle:view.getUint8(),
              iWidth:view.getUint16(),//2字节
            },
            TextSymbol:{
              Angle:view.getInt32(),//2字节
              Color:{
                sRed:view.getUint8(),//1字节
                sGreen:view.getUint8(),//1字节
                sBlue:view.getUint8(),//1字节
                sTransperancy:view.getUint8(),//1字节,透明度
              },
              Font:{
                szFontName:d.decode(view.getBytes(32)),//32字节，字体名称
                sFontSize:view.getUint16(),//2字节,字体大小
                sFontBold:view.getUint16(),//2字节,字体磅值
                sStyle:view.getUint8()//1字节,[1-1-000000]表示[斜体-下划线-000000]
              },
              AlignmentStyle:view.getUint8(),//1字节，文字横排风格，文字竖排风格，文字是否从右写到左
              iTextSize:view.getUint16(),//2字节，文本长度
              szText:d.decode(view.getBytes(128)),//128字节，文本
              sTextPos:view.getUint8(),//1字节，标注位置
              fLong:view.getFloat32(),//4字节，文本显示位置经度
              fLat:view.getFloat32(),//4字节，文本显示位置纬度
            },
            sShow:view.getUint8()
          }
          console.log(line)
          // for(let i=0;i<result.tagLayerPara.iUnitCount;i++){
          //   let plane:S_RegionUnit = {
          //     iID:view.getInt32(),
          //     UnitName:d.decode(view.getBytes(10)),
          //     LinePos:{
          //       iPointNum:view.getInt32(),
          //       reserve:view.getInt32(),
          //     },
          //     RegionSymbol:{
          //       Line:{
          //         Color:{
          //           sRed:view.getUint8(),//1字节
          //           sGreen:view.getUint8(),//1字节
          //           sBlue:view.getUint8(),//1字节
          //           sTransperancy:view.getUint8(),//1字节,透明度
          //         },
          //         sStyle:view.getUint8(),//1字节，线型[0000000-1|0]表示[0000000-虚线|实线]
          //         iWidth:view.getInt32(),//2字节
          //       },//面边线
          //       FillColor:{
          //         sRed:view.getUint8(),//1字节
          //         sGreen:view.getUint8(),//1字节
          //         sBlue:view.getUint8(),//1字节
          //         sTransperancy:view.getUint8(),//1字节,透明度
          //       },//面填充颜色
          //       iStyle:view.getUint8(),//1字节，0不填充，1填充
          //     },
          //     TextSymbol:{
          //       Angle:view.getInt32(),//2字节
          //       Color:{
          //         sRed:view.getUint8(),//1字节
          //         sGreen:view.getUint8(),//1字节
          //         sBlue:view.getUint8(),//1字节
          //         sTransperancy:view.getUint8(),//1字节,透明度
          //       },
          //       Font:{
          //         szFontName:d.decode(view.getBytes(32)),//32字节，字体名称
          //         sFontSize:view.getUint16(),//2字节,字体大小
          //         sFontBold:view.getUint16(),//2字节,字体磅值
          //         sStyle:view.getUint8(),//1字节,[1-1-000000]表示[斜体-下划线-000000]
          //       },
          //       AlignmentStyle:view.getUint8(),//1字节，文字横排风格，文字竖排风格，文字是否从右写到左
          //       iTextSize:view.getUint16(),//2字节，文本长度
          //       szText:d.decode(view.getBytes(128)),//128字节，文本
          //       sTextPos:view.getUint8(),//1字节，标注位置
          //       fLong:view.getFloat32(),//4字节，文本显示位置经度
          //       fLat:view.getFloat32(),//4字节，文本显示位置纬度
          //     },
          //     sShow:view.getUint8()
          //   }
          //   console.log(plane)
          //   break;
          // }
          break;
        case GISTYPE.GIS_AIRLINE:
          // layerPara.m_cLayerType = GIS_AIRLINE;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          console.log(view.getBytes(view.getInt32()))
          break;
        case GISTYPE.GIS_AIRMAPPOINT:
          // layerPara.m_cLayerType = GIS_AIRMAPPOINT;
          // bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          let iDataLen = view.getInt32()
          if(iDataLen<=0){
            return;
          }
          let utf8Decoder = new TextDecoder('utf8')
          let tagPara = {
            m_clearType:view.getUint16(),
            m_strLayerName:utf8Decoder.decode(view.getBytes(view.getUint16())),
            iUnitNum:view.getInt32(),
          }
          let vecUnit = []
          for(let i=0;i<tagPara.iUnitNum;i++){//tagPara.iUnitNum
            let pUnit = {
              iID: view.getInt32(),//图元ID
              strCode: utf8Decoder.decode(view.getBytes(view.getUint16())),//图元名称
              tagRGB:{///图元颜色
                sBlue: view.getUint8(),
                sGreen: view.getUint8(),
                sRed: view.getUint8(),
              },
              tagText:{///标注信息
                strText:utf8Decoder.decode(view.getBytes(view.getUint16())),//标注内容
                tagPos:{//标注位置
                  dLong:view.getFloat64(),//Longitude 经度
                  dLat:view.getFloat64(),//Latitude	纬度
                  dHeight:view.getFloat64(),//Height 海拔高度 米
                },
              },
              ubyType:view.getUint8(),///类型，0未知，1点，2线，3面
              ubyShow:view.getUint8(),///是否显示
              ubyLevel:view.getUint8(),///图元等级
              tagPos:{//点的空间属性
                dLong:view.getFloat64(),//Longitude 经度
                dLat:view.getFloat64(),//Latitude	纬度
                dHeight:view.getFloat64(),//Height 海拔高度 米
              },
              ubyPointStyle:view.getUint8(),///点的形状
              ubyDataType:view.getUint8(),///地标类型，
              ubyAirLinePt:view.getUint8(),///航线航路过点
            }
            // MinLng = MinLng<pUnit.tagPos.dLong?MinLng:pUnit.tagPos.dLong
            // MinLat = MinLat<pUnit.tagPos.dLat?MinLat:pUnit.tagPos.dLat
            // MaxLng = MinLng<pUnit.tagPos.dLong?MinLng:pUnit.tagPos.dLong
            // MaxLat = MinLat<pUnit.tagPos.dLat?MinLng:pUnit.tagPos.dLat
            vecUnit.push(pUnit)
          }
          // UNITS = vecUnit
          // loadStatus = 'loaded'
          // test(args);//第一次使用后台返回的数据
          // for(let i=0;i<queue.length;i++){
          //   let args = queue.splice(i--,1)[0]
          //   test(args)
          // }
          break;
        case GISTYPE.GIS_DATA_POINT:
        case GISTYPE.GIS_DATA_LINE://如飞行管制分区
        case GISTYPE.GIS_DATA_REGION://如禁区
        //   layerPara.m_cLayerType = tagLayerPara.sLayerType;
        //   bReadUnitOK = ReadAirmapLayer(rfile, pLayer, layerPara);
          break;
        default:
          throw new Error('Unknow GISTYPE: '+result.tagLayerPara.sLayerType)
      }
    })
    */
    function calculatePolygonCentroid(vertices:Array<[number,number]>) {
      let area = 0;
      let Cx = 0;
      let Cy = 0;
      const n = vertices.length;
      for (let i = 0; i < n; i++) {
        const x1 = vertices[i][0];
        const y1 = vertices[i][1];
        const x2 = vertices[(i + 1) % n][0];
        const y2 = vertices[(i + 1) % n][1];

        const crossProduct = (x1 * y2) - (x2 * y1);
        area += crossProduct;
        Cx += (x1 + x2) * crossProduct;
        Cy += (y1 + y2) * crossProduct;
      }

      area /= 2;
      Cx = Cx / (6 * area);
      Cy = Cy / (6 * area);
      return { x: Cx, y: Cy };
    }
    exec({
      database:"host=127.0.0.1&port=3306&user=root&password=tanglei&database=union",
      query:{sqls:["select * from `华北飞行区域`"]}
    }).then(res=>{
      let areas = []
      let features = []
      for(let i=0;i<res.data[0].length;i++){
        let item = res.data[0][i]
        let strPoints = d.decode(Uint8Array.from(item.points.data).buffer)
        let points = strPoints.split(' ').map(item=>{
          let lngLat = getLngLat(item)
          return wgs84togcj02(lngLat[0],lngLat[1])
        }) as Array<[number,number]>
        let centroid = calculatePolygonCentroid(points)
        features.push({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [centroid.x,centroid.y]
          },
          'properties': {
            'label': item.name,
          }
        })
        areas.push([points])
      }

      map.addLayer({
        id: "华北飞行区域area",
        type: "fill",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: areas
            },
          },
        },
        layout: {
          visibility: setting.人影.监控.人影飞行区 ? "visible" : "none",
        },
        paint: {
          "fill-color": "#000",
          "fill-opacity": 0.5,
        },
      });
      map.addLayer({
        id: "华北飞行区域baseLine",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: areas
            },
          },
        },
        layout: {
          visibility: setting.人影.监控.人影飞行区 ? "visible" : "none",
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          "line-color": "#000",
          "line-width": 3,
          "line-opacity": 1,
        },
      });
      map.addLayer({
        id: "华北飞行区域line",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "MultiPolygon",
              coordinates: areas
            },
          },
        },
        layout: {
          visibility: setting.人影.监控.人影飞行区 ? "visible" : "none",
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          "line-color": "white",
          "line-width": 1,
          "line-opacity": 1,
        },
      });
      map.addLayer({
        id: "华北飞行区域标签",
        type: "symbol",
        source:  {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features':features
          }
        },
        layout: {
          visibility: setting.人影.监控.人影飞行区 ? "visible" : "none",
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          "text-pitch-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-field": ["get", "label"],
          "text-font": ["simkai"],
          "text-size": 25,
          "text-transform": "uppercase",
          // "text-letter-spacing": 0.05,
          "text-anchor": "center",
          "text-line-height": 1,
          "text-justify": "center",
          "text-offset": [0, 0],
          "text-ignore-placement": false,
          "text-allow-overlap": false,
          "text-rotation-alignment": "map",
          "text-max-width": 400,
        },
        paint: {
          "icon-opacity": 1,
          "text-color": "#ffaa00",
          "text-halo-color": "black",
          "text-halo-width": 1,
        }
      });
    })
    await addFeatherImages(map);
    // map.addLayer(new CustomLayer());
    map.addLayer(CustomLayer);
    map.addLayer({
      id: "maine",
      type: "fill",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: airstrip,
          },
        },
      },
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.4,
      },
    });
    stationMenu = stationMenuRef.value as HTMLDivElement;
    var marker = new Marker({
      element: stationMenu,
      draggable: false,
      // pitchAlignment: "map",
      // rotationAlignment: "map",
      anchor: "top-left",
    })
      .setLngLat([0, 0])
      .setOffset([0, 0])
      .addTo(map);
    exec({
      database:
        "host=tanglei.top&port=3308&user=root&password=mysql&database=ryplat_bjry",
      query: {
        sqls: [
          "select z.*,u.strName as unitName FROM `zydpara` z left join `units` u on z.strMgrUnit = u.strID",
          "SELECT z.*,u.strName as unitName FROM `zyddata` z left join `units` u on z.strATCUnitID = u.strID",
          "SELECT z.*,u.strName as unitName FROM `zydhisdata` z left join `units` u on z.strATCUnitID=u.strID where DATE_FORMAT(z.tmBeginApply,'%Y-%m-%d') = CURDATE()",
          // "SELECT z.*,u.strName as unitName FROM `zydhisdata` z left join `units` u on z.strATCUnitID=u.strID where DATE_FORMAT(z.tmBeginApply,'%Y-%m-%d') = DATE_FORMAT((select MAX(DATE(tmBeginApply)) from zydhisdata),'%Y-%m-%d')",//最后一天的数据
        ],
      },
    }).then((res) => {
      dialogOptions.menus = res.data[0];
      let features: any = [];
      dialogOptions.menus.map((item: stationData) => {
        let v = item.strPos;
        if (v) {
          let lng = v.substring(0, v.indexOf("E"));
          let lat = v.substring(v.indexOf("E") + 1, v.indexOf("N"));
          let pt = {
            lng:
              Number(lng.substring(0, 3)) +
              Number(lng.substring(3, 5)) / 60 +
              Number(lng.substring(5, 9)) / 100 / 3600,
            lat:
              Number(lat.substring(0, 2)) +
              Number(lat.substring(2, 4)) / 60 +
              Number(lat.substring(4, 8)) / 100 / 3600,
          };
          let position: [number, number] = (wgs84togcj02(pt.lng, pt.lat) as unknown) as [
            number,
            number
          ];
          features.push({
            type: "Feature",
            properties: {
              strID: item.strID,
              type: "站点",
              strCode: item.strCode,
              strName: item.strName,
              strPos: v,
              iMaxShotRange: item.iMaxShotRange,
              iMaxShotHei: item.iMaxShotHei,
              iWeapon: Number(item.strWeapon),
              iWorkType: 1,
              iShotRangeBegin: item.iShortAngelBegin,
              iShotRangeEnd: item.iShortAngelEnd,
              beginTime: moment().format("HH:mm:ss"),
              unitName: item.unitName,
              duration: 1,
              // "icon-image": "projectile-white",
              "icon-image": "火箭弹图标",
            },
            geometry: {
              type: "Point",
              coordinates: position,
            },
          });
          // 有问题
          // let circle: any = Circle([pt.lng, pt.lat], item.iMaxShotRange, {
          //   steps: 360,
          //   units: "meters",
          //   properties: {
          //     id: item.strID,
          //     color: "white",
          //   },
          // });
          // circleFeatures.push(circle);

          if (item.iShortAngelEnd - item.iShortAngelBegin >= 360) {
            const center: [number, number] = wgs84togcj02(pt.lng, pt.lat) as [
              number,
              number
            ]; // 圆心点的经纬度
            const radius: number = item.iMaxShotRange; // 半径（单位：米
            const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
            const units: turf.Units = "meters"; // 半径的单位
            const sectorPoints: [number, number][] = calculateCirclePoints(
              center,
              radius,
              steps,
              units
            );
            const sectorPolygon = turf.polygon([sectorPoints], {
              strID: item.strID,
              color: "transparent",
              fillColor: "transparent",
            });
            circleFeatures.push(sectorPolygon);
          } else {
            const center: [number, number] = wgs84togcj02(pt.lng, pt.lat) as [
              number,
              number
            ]; // 圆心点的经纬度
            const radius: number = item.iMaxShotRange; // 半径（单位：米
            const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
            const startAngle: number = item.iShortAngelBegin; // 起始角度（单位：度）
            const endAngle: number =
              item.iShortAngelEnd > startAngle
                ? item.iShortAngelEnd
                : item.iShortAngelEnd + 360; // 终止角度（单位：度）
            const units: turf.Units = "meters"; // 半径的单位
            const sectorPoints: [number, number][] = calculateSectorPoints(
              center,
              radius,
              startAngle,
              endAngle,
              steps,
              units
            );
            const sectorPolygon = turf.polygon([sectorPoints], {
              strID: item.strID,
              color: "transparent",
              fillColor: "transparent",
            });
            circleFeatures.push(sectorPolygon);
          }
        }
      });
      map.addSource("zydSource", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
      });
      map.addLayer({
        id: "zydLayer",
        type: "symbol",
        source: "zydSource",
        layout: {
          visibility: props.zyd ? "visible" : "none",
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          "icon-anchor": "center",
          "icon-image": ["get", "icon-image"],
          // "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
          "icon-rotate": 0,
          // "icon-offset": [10, 0],
          "icon-rotation-alignment": "map",
          "text-pitch-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-field": ["get", "strName"],
          "text-font": ["simkai"],
          "text-size": 16,
          "text-transform": "uppercase",
          // "text-letter-spacing": 0.05,
          "text-anchor": "bottom",
          "text-line-height": 1,
          "text-justify": "center",
          "text-offset": [0, -1],
          "text-ignore-placement": true,
          "text-allow-overlap": true,
          "text-rotation-alignment": "map",
          "text-max-width": 400,
        },
        paint: {
          "icon-opacity": 1,
          "text-color": "white",
          "text-halo-color": "black",
          "text-halo-width": 1,
        },
        filter: ["==", ["get", "type"], "站点"],
      });
      map.addSource("最大射程source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: circleFeatures,
        },
      });
      map.addLayer({
        id: "最大射程-fill",
        type: "fill",
        source: "最大射程source",
        layout: {
          visibility: props.zyd ? "visible" : "none",
        },
        paint: {
          "fill-color": ["get", "fillColor"],
          "fill-opacity": 0.5,
        },
      });
      map.addLayer({
        id: "最大射程-line",
        type: "line",
        source: "最大射程source",
        layout: {
          visibility: props.zyd ? "visible" : "none",
        },
        paint: {
          "line-color": ["get", "color"],
          "line-width": 1,
          // "line-dasharray": [1, 1],
        },
      });
      map.on("contextmenu", "zydLayer", (e: any) => {
        e.preventDefault();
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["zydLayer"],
        });

        if (!fs.length) {
          return;
        }

        const feature = fs[0];
        station.人影界面被选中的设备 = feature.properties.strID;
        marker.setLngLat(feature.geometry.coordinates);
        $(stationMenu).css({display:'block'});
        $(stationMenu).removeData();
        $(stationMenu).data(feature.properties);
      });
      map.on("click", "zydLayer", (e: any) => {
        const fs = map.queryRenderedFeatures(e.point, {
          layers: ["zydLayer"],
        });

        if (!fs.length) {
          return;
        }

        const feature = fs[0];
        station.人影界面被选中的设备 = feature.properties.strID;
      });
      map.on("mousedown", () => {
        $(stationMenu).css({display:'none'});
      });
      active = () => {
        features = features.map((item: any) => {
          if (item.properties.id == station.人影界面被选中的设备) {
            item.properties["icon-image"] = "projectile-white";
          } else {
            item.properties["icon-image"] = "projectile-white";
          }
          return item;
        });
        let source = map.getSource("zydSource");
        source.setData({
          type: "FeatureCollection",
          features: features,
        });

        circleFeatures = circleFeatures.map((item: any) => {
          if (item.properties.strID == station.人影界面被选中的设备) {
            item.properties.color = "white";
            item.properties.fillColor = "#000";
          } else {
            item.properties.color = "transparent";
            item.properties.fillColor = "transparent";
          }
          return item;
        });
        source = map.getSource("最大射程source");
        source.setData({
          type: "FeatureCollection",
          features: circleFeatures,
        });
      };

      planProps.当前作业进度 = res.data[1];
      planProps.当前作业进度.map((item: planDataType) => {
        for (let i = 0; i < circleFeatures.length; i++) {
          if (circleFeatures[i].properties.strID == item.strZydID) {
            let v = item.strCurPos;
            let lng = v.substring(0, v.indexOf("E"));
            let lat = v.substring(v.indexOf("E") + 1, v.indexOf("N"));
            let pt = {
              lng:
                Number(lng.substring(0, 3)) +
                Number(lng.substring(3, 5)) / 60 +
                Number(lng.substring(5, 9)) / 100 / 3600,
              lat:
                Number(lat.substring(0, 2)) +
                Number(lat.substring(2, 4)) / 60 +
                Number(lat.substring(4, 8)) / 100 / 3600,
            };
            const center: [number, number] = wgs84togcj02(pt.lng, pt.lat) as [
              number,
              number
            ]; // 圆心点的经纬度
            const radius: number = item.iRange; // 半径（单位：米）
            const startAngle: number = item.iAngleBegin; // 起始角度（单位：度）
            const endAngle: number = item.iAngleEnd; // 终止角度（单位：度）
            const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
            const units: turf.Units = "meters"; // 半径的单位
            if (endAngle - startAngle >= 360) {
              const center: [number, number] = wgs84togcj02(pt.lng, pt.lat) as [
                number,
                number
              ]; // 圆心点的经纬度
              const radius: number = item.iRange; // 半径（单位：米
              const steps: number = 360; // 用于生成圆弧的步数，越大越平滑
              const units: turf.Units = "meters"; // 半径的单位
              const sectorPoints: [number, number][] = calculateCirclePoints(
                center,
                radius,
                steps,
                units
              );
              const sectorPolygon = turf.polygon([sectorPoints], {
                strID: item.strZydID,
                color: "transparent",
                fillColor: "transparent",
              });
              circleFeatures[i].geometry.coordinates =
                sectorPolygon.geometry?.coordinates;
            } else {
              const sectorPoints: [number, number][] = calculateSectorPoints(
                center,
                radius,
                startAngle,
                endAngle,
                steps,
                units
              );
              const sectorPolygon = turf.polygon([sectorPoints], {
                strID: item.strZydID,
                color: "transparent",
                fillColor: "transparent",
              });
              circleFeatures[i].geometry.coordinates =
                sectorPolygon.geometry?.coordinates;
            }
          }
        }
      });
      let source = map.getSource("最大射程source");
      source.setData({
        type: "FeatureCollection",
        features: circleFeatures,
      });

      planProps.今日作业记录 = res.data[2];
    });
    // getDevice().then((res) => {
    //   dialogOptions.menus = res.data;
    //   let features: any = [];
    //   dialogOptions.menus.map((item: any) => {
    //     let v = item.lngLat;
    //     let lng = v.substring(0, v.indexOf("E"));
    //     let lat = v.substring(v.indexOf("E") + 1, v.indexOf("N"));
    //     let pt = {
    //       lng:
    //         Number(lng.substring(0, 3)) +
    //         Number(lng.substring(3, 5)) / 60 +
    //         Number(lng.substring(5, 9)) / 100 / 3600,
    //       lat:
    //         Number(lat.substring(0, 2)) +
    //         Number(lat.substring(2, 4)) / 60 +
    //         Number(lat.substring(4, 8)) / 100 / 3600,
    //     };
    //     let position: [number, number] = (wgs84togcj02(pt.lng, pt.lat) as unknown) as [
    //       number,
    //       number
    //     ];
    //     features.push({
    //       type: "Feature",
    //       properties: {
    //         type: "站点",
    //         name: item.name,
    //         color: item.color,
    //       },
    //       geometry: {
    //         type: "Point",
    //         coordinates: position,
    //       },
    //     });
    //     // let offset = (getRandomPointBetweenR1R2(50, 100) as unknown) as [number, number];
    //     // let div = document.createElement("div");
    //     // div.id = "人影" + item.id;
    //     // div.className = "deviceStation_人影";
    //     // div.style.position = "absolute";
    //     // $(div).data("id", item.id);
    //     // let device = $(
    //     //   `<div class="station" style="z-index:-1;left:50%;top:50%;transform:translate(-50%,-50%) translate(${-offset[0]}px,${-offset[1]}px)"><div class="projectile" style="filter: drop-shadow(${
    //     //     item.color
    //     //   } 0 -60px);transform:translateY(60px)"/></div>`
    //     // );
    //     // $(div).append(device);
    //     // $(div).append(
    //     //   $(
    //     //     `<div class="connectingLine" style="pointer-events:none;background:white;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) translate(${
    //     //       -offset[0] / 2
    //     //     }px,${-offset[1] / 2}px) rotate(${Math.atan2(
    //     //       offset[1],
    //     //       offset[0]
    //     //     )}rad);width:${Math.sqrt(offset[0] ** 2 + offset[1] ** 2)}px"></div>`
    //     //   )
    //     // );
    //     // let label = $(`<div class="label">${item.name}</div>`);
    //     // $(div).append(label);

    //     // device.on("click", function click() {
    //     //   station.人影界面被选中的设备 = $(this).parent().data("id");
    //     //   $(`#人影-${station.人影界面被选中的设备}`)[0].scrollIntoView({
    //     //     block: "nearest",
    //     //     behavior: "smooth",
    //     //     inline: "center",
    //     //   });
    //     // });
    //     // device.on("mousedown", (evt) => {
    //     //   evt.preventDefault();
    //     //   evt.stopPropagation();
    //     // });
    //     // var marker = new Marker(div, {
    //     //   draggable: true,
    //     //   pitchAlignment: "map",
    //     //   rotationAlignment: "map",
    //     //   anchor: "center",
    //     // })
    //     //   .setLngLat(position) // 设置标记的经纬度坐标
    //     //   .addTo(map)
    //     //   .setOffset(offset);
    //     // let dragStartOffset: { x: number; y: number };
    //     // marker.on("dragstart", () => {
    //     //   dragStartOffset = marker.getOffset() as { x: number; y: number };
    //     // });
    //     // marker.on("drag", (e: any) => {
    //     //   let dragEndPoint = marker.getLngLat();
    //     //   let pt1 = map.project({ lng: position[0], lat: position[1] });
    //     //   let pt2 = map.project(dragEndPoint);
    //     //   let x = dragStartOffset.x + pt2.x - pt1.x;
    //     //   let y = dragStartOffset.y + pt2.y - pt1.y;
    //     //   marker.setOffset([x, y]);
    //     //   let line = $("#人影" + item.id).find(".connectingLine")[0];
    //     //   line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
    //     //     -y / 2
    //     //   }px) rotate(${Math.atan2(y, x)}rad)`;
    //     //   line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
    //     //   let station = $("#人影" + item.id).find(".station")[0];
    //     //   station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
    //     //   marker.setLngLat(position);
    //     // });
    //     // marker.on("dragend", (e: any) => {
    //     //   let dragEndPoint = e.target.getLngLat();
    //     //   let pt1 = map.project({ lng: position[0], lat: position[1] });
    //     //   let pt2 = map.project(dragEndPoint);
    //     //   let offset = marker.getOffset() as { x: number; y: number };
    //     //   let x = offset.x + pt2.x - pt1.x;
    //     //   let y = offset.y + pt2.y - pt1.y;
    //     //   marker.setOffset([x, y]);
    //     //   let line = $("#人影" + item.id).find(".connectingLine")[0];
    //     //   line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
    //     //     -y / 2
    //     //   }px) rotate(${Math.atan2(y, x)}rad)`;
    //     //   line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
    //     //   let station = $("#人影" + item.id).find(".station")[0];
    //     //   station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
    //     //   marker.setLngLat(position);
    //     // });
    //   });
    //   map.addLayer({
    //     id: "zydLayer",
    //     type: "symbol",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: features,
    //       },
    //     },
    //     layout: {
    //       visibility: props.zyd ? "visible" : "none",
    //       // This icon is a part of the Mapbox Streets style.
    //       // To view all images available in a Mapbox style, open
    //       // the style in Mapbox Studio and click the "Images" tab.
    //       // To add a new image to the style at runtime see
    //       // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
    //       "icon-anchor": "left",
    //       "icon-image": "projectile",
    //       "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
    //       "icon-rotate": 0,
    //       "icon-rotation-alignment": "map",
    //       "icon-allow-overlap": true,
    //       "icon-ignore-placement": true,
    //       "text-field": ["get", "name"],
    //       "text-font": ["simkai"],
    //       "text-size": 16,
    //       "text-transform": "uppercase",
    //       // "text-letter-spacing": 0.05,
    //       "text-anchor": "center",
    //       "text-line-height": 1,
    //       "text-justify": "center",
    //       "text-offset": [0, -1],
    //       "text-ignore-placement": true,
    //       "text-allow-overlap": true,
    //       "text-rotation-alignment": "map",
    //       "text-max-width": 400,
    //     },
    //     paint: {
    //       "icon-opacity": 1,
    //       "text-color": "white",
    //       "text-halo-color": "black",
    //       "text-halo-width": 1,
    //     },
    //     filter: ["==", ["get", "type"], "站点"],
    //   });

    //   let feathers = [];
    //   for (let j = 0; j < 30; j++) {
    //     for (let i = 0; i < 20; i++) {
    //       const pt = turf.destination(
    //         turf.point([101.91223724839354, 36.548604620850995]),
    //         45 + 1000 * i,
    //         j * 10,
    //         {
    //           units: "meters",
    //         }
    //       );
    //       let speed = Math.random() * 60;
    //       feathers.push({
    //         type: "Feature",
    //         geometry: {
    //           type: "Point",
    //           coordinates: pt.geometry?.coordinates,
    //         },
    //         properties: {
    //           type: "风羽",
    //           风速: speed,
    //           image: "feather" + getFeather(speed),
    //           风向: 45,
    //         },
    //       });
    //     }
    //   }
    //   map.addLayer({
    //     id: "绘制风羽",
    //     type: "symbol",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: feathers,
    //       },
    //     },
    //     layout: {
    //       visibility: props.feather ? "visible" : "none",
    //       // This icon is a part of the Mapbox Streets style.
    //       // To view all images available in a Mapbox style, open
    //       // the style in Mapbox Studio and click the "Images" tab.
    //       // To add a new image to the style at runtime see
    //       // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
    //       "icon-anchor": ["match", ["get", "风速"], 0, "center", "bottom-left"],
    //       "icon-image": ["get", "image"],
    //       "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
    //       "icon-rotate": ["get", "风向"],
    //       "icon-rotation-alignment": "map",
    //       "icon-allow-overlap": true,
    //       "icon-ignore-placement": true,
    //       // "text-field": ["get", "风速"],
    //       // "text-font": ["simkai"],
    //       // "text-size": 14,
    //       // "text-transform": "uppercase",
    //       // // "text-letter-spacing": 0.05,
    //       // "text-anchor": "center",
    //       // "text-line-height": 1,
    //       // // "text-justify": "center",
    //       // "text-offset": [0, 0],
    //       // "text-ignore-placement": true,
    //       // "text-allow-overlap": true,
    //       // "text-rotation-alignment": "map",
    //     },
    //     paint: {
    //       "icon-opacity": setting.feather ? 1 : 0,
    //     },
    //     filter: ["==", ["get", "type"], "风羽"],
    //   });

    //   let circleFeatures = [];
    //   let pointFeatures = [];
    //   for (let i = 1; i <= 10; i++) {
    //     let circle = Circle([102.04150296221326, 36.530313361869744], i * 1000, {
    //       steps: 360,
    //       units: "meters",
    //     });
    //     circleFeatures.push(circle);

    //     let pts: any = [];
    //     const pt1 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       0,
    //       { units: "meters" }
    //     );
    //     const pt2 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       90,
    //       { units: "meters" }
    //     );
    //     const pt3 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       180,
    //       { units: "meters" }
    //     );
    //     const pt4 = turf.destination(
    //       turf.point([102.04150296221326, 36.530313361869744]),
    //       1000 * i,
    //       270,
    //       { units: "meters" }
    //     );
    //     pts.push(
    //       pt1.geometry?.coordinates,
    //       pt2.geometry?.coordinates,
    //       pt3.geometry?.coordinates,
    //       pt4.geometry?.coordinates
    //     );
    //     pointFeatures.push({
    //       type: "Feature",
    //       geometry: {
    //         type: "MultiPoint",
    //         coordinates: pts,
    //       },
    //       properties: {
    //         units: i + "km",
    //       },
    //     });
    //   }
    //   let marker = new Marker({
    //     draggable: false,
    //     pitchAlignment: "map",
    //     rotationAlignment: "map",
    //   }).setLngLat([102.04150296221326, 36.530313361869744]);
    //   marker.addTo(map);
    //   marker.remove();
    //   map.addLayer({
    //     id: "等距环",
    //     type: "line",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: circleFeatures,
    //       },
    //     },
    //     layout: {
    //       visibility: props.equidistantRing ? "visible" : "none",
    //     },
    //     paint: {
    //       "line-color": "#000",
    //       "line-width": 2,
    //       "line-dasharray": [2, 2],
    //     },
    //   });
    //   map.addLayer({
    //     id: "等距环的单位",
    //     type: "symbol",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "FeatureCollection",
    //         features: pointFeatures,
    //       },
    //     },
    //     layout: {
    //       visibility: props.equidistantRing ? "visible" : "none",
    //       "text-field": ["get", "units"],
    //       "text-font": ["simkai"],
    //       "text-size": 14,
    //       "text-anchor": "bottom-left",
    //       "text-allow-overlap": true,
    //       "text-ignore-placement": true,
    //       "text-rotation-alignment": "map",
    //       "text-pitch-alignment": "map",
    //     },
    //     paint: {
    //       "text-color": "white",
    //       "text-halo-color": "black",
    //       "text-halo-width": 1,
    //     },
    //   });
    //   map.addLayer({
    //     id: "绘制空域",
    //     type: "line",
    //     source: {
    //       type: "geojson",
    //       data: {
    //         type: "Feature",
    //         properties: {},
    //         geometry: {
    //           type: "LineString",
    //           coordinates: [
    //             [-122.48369693756104, 37.83381888486939],
    //             [-122.48348236083984, 37.83317489144141],
    //             [-122.48339653015138, 37.83270036637107],
    //             [-122.48356819152832, 37.832056363179625],
    //             [-122.48404026031496, 37.83114119107971],
    //             [-122.48404026031496, 37.83049717427869],
    //             [-122.48348236083984, 37.829920943955045],
    //             [-122.48356819152832, 37.82954808664175],
    //           ],
    //         },
    //       },
    //     },
    //     layout: {
    //       "line-cap": "round",
    //       "line-join": "round",
    //     },
    //     paint: {
    //       "line-color": "#f00",
    //       "line-width": {
    //         base: 2,
    //         stops: [
    //           [4, 2], // 线宽为2像素
    //           [22, 1000], // 线宽为10像素
    //         ],
    //       },
    //     },
    //   });
    // });
    let airplanes = [];
    for (let i = 0; i < 60; i++) {
      airplanes.push({
        type: "Feature",
        properties: {
          name: "Example Point",
          deg: 360 * Math.random(),
          speed: ((800 + 200 * Math.random()) / 3.6 / 1000) * 33,
        },
        geometry: {
          type: "Point",
          coordinates: [100 + 3 * Math.random(), 35 + 3 * Math.random()],
          // coordinates: [0, 0],
        },
      });
    }
    map.addSource("飞机原数据", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: airplanes,
      },
    });
    map.addLayer({
      id: "飞机",
      type: "symbol",
      source: "飞机原数据",
      layout: {
        "icon-image": "airplane",
        // "icon-size": {
        //   base: 1,
        //   stops: [
        //     [0, 0.5],
        //     [22, 1],
        //   ],
        // },
        "icon-rotate": ["get", "deg"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        visibility: props.plane ? "visible" : "none",
      },
    });
    // const points = turf.randomPoint(50, { bbox: [100, 35, 103, 38] });
    // points.features.forEach(
    //   (pt: any) => (pt.properties.elevation = Math.random() * 1000)
    // );
    // const grid = turf.interpolate(points, 0.04, {
    //   gridType: "point", // 以点为基础进行插值
    //   property: "elevation", // 从点的属性中提取值
    //   units: "degrees", // 单位
    //   weight: 5, // 使用反距离加权进行插值
    // });
    // const isobands = turf.isobands(grid, [NaN, ...breaks], {
    //   zProperty: "elevation",
    // });
    // map.addLayer({
    //   id: "isobands-layer",
    //   type: "fill",
    //   source: {
    //     type: "geojson",
    //     data: isobands,
    //   },
    //   layout: {},
    //   paint: {
    //     "fill-color": ["match", ["get", "elevation"], ...fillColors, "transparent"],
    //     "fill-opacity": 0.5,
    //   },
    // });
    // console.log(isobands);
    // const isolines = turf.isolines(grid, [NaN, ...breaks], {
    //   zProperty: "elevation",
    // });
    // map.addLayer({
    //   id: "isolines-layer",
    //   type: "line",
    //   source: {
    //     type: "geojson",
    //     data: isolines,
    //   },
    //   layout: {},
    //   paint: {
    //     "line-color": ["match", ["get", "elevation"], ...strokeColors, "transparent"],
    //     "line-width": 1,
    //     "line-opacity": 1,
    //   },
    // });

    // timer = setInterval(() => {
    //   let source = map.getSource("飞机原数据");
    //   if (source) {
    //     let data = source.serialize().data;
    //     data.features.map((item: any) => {
    //       let coordinates = item.geometry.coordinates;
    //       let deg = item.properties.deg;
    //       let speed = item.properties.speed;
    //       const pt = turf.destination(turf.point(coordinates), speed, deg, {
    //         units: "meters",
    //       });
    //       item.geometry.coordinates = pt.geometry?.coordinates;
    //     });
    //     source.setData(data);
    //   }
    // }, 1000);
if(false){

  getMicapsData(plotUrl).then(async(result: any) => {
      let pts = new Array<{lng:number;lat:number;value:number}>;
      // for (let i = 0; i < 100; i++) {
      //   pts.push({
      //     lng: Math.random() * 70 + 70,
      //     lat: Math.random() * 40 + 15,
      //     value: Number((Math.random() * 72-36).toFixed(2)),
      //   });
      // }

      result.data.map((item: any) => {
        // if(item.温度!==9999&&item.经度>70&&item.经度<140&&15<item.纬度&&item.纬度<55){
        if(item.温度!==9999){
          pts.push({
            lng: item.经度,
            lat: item.纬度,
            value: Math.round(item.温度),
          });
        }
      });

      let breaks = new Array<number>();
      var Color: { [key: string]: any } = {};
      let xmlDoc = new DOMParser().parseFromString(palette, "text/xml");
      let collections = xmlDoc.getElementsByTagName("entry");
      for (let i = 0; i < collections.length; i++) {
        let value = parseInt(Number(collections[i].getAttribute("value")).toFixed());
        breaks.push(value)
        let strPalette = collections[i].getAttribute("rgba");
        if (strPalette) {
          let rgba: [number,number,number,number] = strPalette.split(",").map((v) => Number(v)) as unknown as [number,number,number,number];
          let hsl = rgb2Hsl(rgba[0],rgba[1],rgba[2])
          // Color[value.toFixed()] = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
          Color[value.toFixed()] = '#' + ((1 << 24) + (rgba[0] << 16) + (rgba[1] << 8) + rgba[2]).toString(16).slice(1);
        }
      }

      let fillColors = [];
      let strokeColors = [];
      breaks=[]
      for(let i=-36;i<36;i++){
        breaks.push(i);
      }
      for (let i = 0; i < breaks.length; i++) {
        strokeColors.push(breaks[i]);
        strokeColors.push(`hsl(${getHue(-36, breaks[i], 36)},100%,50%)`);
        // strokeColors.push(Color[breaks[i].toFixed()]);
      }

      // for (let i = 0; i < breaks.length; i++) {
      //   strokeColors.push(breaks[i]);
      //   // strokeColors.push(`hsl(${getHue(-36, breaks[i], 36)},100%,50%)`);
      //   strokeColors.push(Color[breaks[i].toFixed()]);
      // }
      for (let i = 0; i < breaks.length - 1; i++) {
        fillColors.push(`${breaks[i]}-${breaks[i + 1]}`);
        fillColors.push(strokeColors[2*i+1]);
        // fillColors.push(strokeColors[2*(i+1)+1]);
      }
      // let interpolateOptions = {
      //   sizeU: 140,
      //   sizeV: 80,
      //   boundary: {
      //     lng: 70,
      //     lat: 15,
      //     width: 70,
      //     height: 40,
      //   },
      //   power: 6,
      // };
      let interpolateOptions = {
        sizeU: 140,
        sizeV: 80,
        boundary: {
          lng: -180,
          lat: -LAT,
          width: 360,
          height: 2*LAT,
        },
        power: 6,
      };
      console.time()
      let grid = interpolate(pts, interpolateOptions)
      console.timeEnd()
        var bandWidths = breaks.reduce(function (bw, upperBand, i, intervals) {
          if (i > 0) {
            var lowerBand = intervals[i - 1];
            bw.push(upperBand - lowerBand);
          }
          return bw;
        }, new Array<number>());
        var multiBands = isoBands(grid, breaks.slice(0, -1), bandWidths, {
          verbose: false,
          polygons: false,
          linearRing: false,
          noFrame: true,
          noQuadTree: false,
          polygons_full: false,
          successCallback: () => {},
        });
        let isobands = {
          type: "FeatureCollection",
          features: new Array<any>(),
        };
        for (let j = 0; j < multiBands.length; j++) {
          let feature = {
            type: "Feature",
            properties: { threshold: breaks[j] + "-" + breaks[j + 1] },
            geometry: {
              type: "MultiPolygon",
              coordinates: new Array<any>(),
            },
          };
          let polygons = [];
          let holes = [];
          for (let i = 0; i < multiBands[j].length; i++) {
            let points = new Array<[number, number]>();
            multiBands[j][i].map((point: [number, number]) => {
              points.push([
                (point[0] / (interpolateOptions.sizeU - 1)) *
                  interpolateOptions.boundary.width +
                  interpolateOptions.boundary.lng,
                (point[1] / (interpolateOptions.sizeV - 1)) *
                  interpolateOptions.boundary.height +
                  interpolateOptions.boundary.lat,
              ]);
            });
            if (interpolateOptions.boundary.width * interpolateOptions.boundary.height * area(points) < 0) {
              polygons.push(points);
            } else {
              holes.push(points);
            }
          }
          for (let k = 0; k < polygons.length; k++) {
            let polygon = polygons.splice(k--, 1)[0];
            let tmp = [polygon];
            for (let m = 0; m < holes.length; m++) {
              if (
                pointInPolygon(holes[m][0], polygon) &&
                polygons.every((item: any) => !pointInPolygon(holes[m][0], item))
              ) {
                let hole = holes.splice(m--, 1)[0];
                tmp.push(hole);
              }
            }
            feature.geometry.coordinates.push(tmp);
          }
          isobands.features.push(feature);
        }
        map.addLayer({
          id: "等值带",
          type: "fill",
          source: {
            type: "geojson",
            data: isobands,
          },
          layout: {
            visibility:props.isobands?"visible":"none"
          },
          paint: {
            "fill-color": ["match", ["get", "threshold"], ...fillColors, "transparent"],
            "fill-opacity": 0.5,
            "fill-outline-color": 'transparent'
          },
        });

        var multiLines = isoLines(grid, breaks, {
          noFrame: true,
          polygons: false,
          polygons_full: false,
          noQuadTree: false,
          linearRing: false,
          verbose: false,
          successCallback: (multiLines: any, threshold: number) => {},
        });
        let isolines = {
          type: "FeatureCollection",
          features: new Array<any>(),
        };
        let isolineValues = {
          type: "FeatureCollection",
          features: new Array<any>(),
        };
        for (let j = 0; j < multiLines.length; j++) {
          let feature = {
            type: "Feature",
            properties: { threshold: breaks[j] },
            geometry: {
              type: "MultiLineString",
              coordinates: new Array<any>(),
            },
          };
          let featureValue = {
            type: "Feature",
            properties: { threshold: breaks[j] },
            geometry: {
              type: "MultiPoint",
              coordinates: new Array<any>(),
            },
          };
          // console.log(multiLines[j])
          for (let i = 0; i < multiLines[j].length; i++) {
            let line = multiLines[j][i];
            let points = new Array<any>();
            for(let k=0;k<line.length;k++){
              let point = [
                (line[k][0] / (interpolateOptions.sizeU - 1)) *
                  interpolateOptions.boundary.width +
                  interpolateOptions.boundary.lng,
                (line[k][1] / (interpolateOptions.sizeV - 1)) *
                  interpolateOptions.boundary.height +
                  interpolateOptions.boundary.lat,
              ]
              points.push(point);
            }
            feature.geometry.coordinates.push(points);
            let firstPoint = points[0]
            let lastPoint = points.slice(-1)[0]
            if(JSON.stringify(firstPoint)===JSON.stringify(lastPoint)){
              featureValue.geometry.coordinates.push(firstPoint)
            }else{
              featureValue.geometry.coordinates.push(firstPoint)
              featureValue.geometry.coordinates.push(lastPoint)
            }
          }
          isolines.features.push(feature);
          isolineValues.features.push(featureValue);
        }
        map.addLayer({
          id: "等值线",
          type: "line",
          source: {
            type: "geojson",
            data: isolines,
          },
          layout: {
            visibility:props.isolines?'visible':'none'
          },
          paint: {
            "line-color": ["match", ["get", "threshold"], ...strokeColors, "transparent"],
            "line-width": 1,
            "line-opacity": 1,
          },
        });
        map.addLayer({
          id: "等值线值",
          type: "symbol",
          source: {
            type: "geojson",
            data: isolineValues,
          },
          layout: {
            "visibility":props.isolines?'visible':'none',
            "text-field": ["get", "threshold"],
            "text-size":16,
            "text-font": ["simkai"],
            "text-offset": [0, 0.2],
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-rotation-alignment": "map",
          },
          paint: {
            "text-color":  ["match", ["get", "threshold"], ...strokeColors, "transparent"],
            "text-halo-width": 1,
            "text-halo-color": "black",
          },
        });

        let discretePoints = {
          type: "FeatureCollection",
          features: new Array<any>(),
        };

        pts.map(item=>{
          discretePoints.features.push({
            type: "Feature",
            properties: {
              threshold: item.value,
              color: "red" ,
            },
            geometry: {
              type: "Point",
              coordinates: [item.lng, item.lat],
            },
          });
        })
        map.addLayer({
          id: "离散值",
          type: "symbol",
          source: { type: "geojson", data: discretePoints },
          layout: {
            "visibility":props.zdz?"visible":"none",
            "text-field": ["get", "threshold"],
            "text-size":24,
            "text-font": ["simkai"],
            "text-offset": [0, 0.2],
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-rotation-alignment": "map",
          },
          paint: {
            "text-color": ["get", "color"],
            "text-halo-width": 1,
            "text-halo-color": "black",
          },
        });
        map.addLayer({
          id: "离散点",
          type: "circle",
          source: { type: "geojson", data: discretePoints },
          layout:{
            "visibility":props.zdz?"visible":"none",
          },
          paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1,"circle-stroke-color":'black' },
        });

        let gridPoints = {
          type: "FeatureCollection",
          features: new Array<any>(),
        };
        for (let j = 0; j < grid.length; j++) {
          for (let i = 0; i < grid[j].length; i++) {
            let x =
              (i / (interpolateOptions.sizeU - 1)) * interpolateOptions.boundary.width +
              interpolateOptions.boundary.lng;
            let y =
              (j / (interpolateOptions.sizeV - 1)) * interpolateOptions.boundary.height +
              interpolateOptions.boundary.lat;
            gridPoints.features.push({
              type: "Feature",
              properties: {
                threshold: grid[j][i].toFixed(2),
                color: "white",
              },
              geometry: {
                type: "Point",
                coordinates: [x, y],
              },
            });
          }
        }
        map.addLayer({
          id: "网格值",
          type: "symbol",
          source: { type: "geojson", data: gridPoints },
          layout: {
            "visibility":props.gridValue?'visible':'none',
            "text-field": ["get", "threshold"],
            "text-font": ["simkai"],
            "text-offset": [0, 0.2],
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-rotation-alignment": "map",
          },
          paint: {
            "text-color": ["get", "color"],
            "text-halo-width": 1,
            "text-halo-color": "black",
          },
        });
        map.addLayer({
          id: "网格点",
          type: "circle",
          source: { type: "geojson", data: gridPoints },
          layout:{
            "visibility":props.gridPoint?'visible':'none',
          },
          paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1 },
        });
      // map.addLayer({
      //   id: "等值线边界",
      //   type: "fill",
      //   source: {
      //     type: "geojson",
      //     data: {
      //       type: "Feature",
      //       geometry: {
      //         type: "Polygon",
      //         coordinates: [
      //           [
      //             [-180, -50],
      //             [180, -50],
      //             [180, 50],
      //             [-180, 50],
      //             [-180, -50],
      //           ],
      //         ],
      //       },
      //     },
      //   },
      //   layout: {},
      //   paint: {
      //     "line-color": "yellow",
      //     "line-opacity": 1,
      //     "line-width": 1,
      //     "fill-color": "cyan",
      //     "fill-opacity": 0.5,
      //   },
      // });

    });
}else{

    getMicapsData(plotUrl2).then(async (result: any) => {
      let breaks = new Array<number>();
      var Color: { [key: string]: any } = {};
      let xmlDoc = new DOMParser().parseFromString(palette2, "text/xml");
      let collections = xmlDoc.getElementsByTagName("entry");
      for (let i = 0; i < collections.length; i++) {
        let value = parseInt(Number(collections[i].getAttribute("value")).toFixed());
        breaks.push(value);
        let strPalette = collections[i].getAttribute("rgba");
        if (strPalette) {
          let rgba: [number, number, number, number] = (strPalette
            .split(",")
            .map((v) => Number(v)) as unknown) as [number, number, number, number];
          let hsl = rgb2Hsl(rgba[0], rgba[1], rgba[2]);
          // Color[value.toFixed()] = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
          Color[value.toFixed()] =
            "#" +
            ((1 << 24) + (rgba[0] << 16) + (rgba[1] << 8) + rgba[2])
              .toString(16)
              .slice(1);
        }
      }

      let fillColors = [];
      let strokeColors = [];
      for (let i = 0; i < breaks.length; i++) {
        strokeColors.push(breaks[i]);
        // strokeColors.push(`hsl(${getHue(-36, breaks[i], 36)},100%,50%)`);
        strokeColors.push(Color[breaks[i].toFixed()]);
      }
      for (let i = 0; i < breaks.length - 1; i++) {
        fillColors.push(`${breaks[i]}-${breaks[i + 1]}`);
        fillColors.push(strokeColors[2 * i + 1]);
        // fillColors.push(strokeColors[2*(i+1)+1]);
      }
      let interpolateOptions = {
        sizeU: 33,
        sizeV: 18,
        boundary: {
          lng: result.beginLng,
          lat: result.beginLat,
          width: result.endLng - result.beginLng,
          height: result.endLat - result.beginLat,
        },
        power: 6,
      };
      let grid = result.data;
      var bandWidths = breaks.reduce(function (bw, upperBand, i, intervals) {
        if (i > 0) {
          var lowerBand = intervals[i - 1];
          bw.push(upperBand - lowerBand);
        }
        return bw;
      }, new Array<number>());
      var multiBands = isoBands(grid, breaks.slice(0, -1), bandWidths, {
        verbose: false,
        polygons: false,
        linearRing: false,
        noFrame: true,
        noQuadTree: false,
        polygons_full: false,
        successCallback: () => {},
      });
      let isobands = {
        type: "FeatureCollection",
        features: new Array<any>(),
      };
      for (let j = 0; j < multiBands.length; j++) {
        let feature = {
          type: "Feature",
          properties: { threshold: breaks[j] + "-" + breaks[j + 1] },
          geometry: {
            type: "MultiPolygon",
            coordinates: new Array<any>(),
          },
        };
        let polygons = [];
        let holes = [];
        for (let i = 0; i < multiBands[j].length; i++) {
          let points = new Array<[number, number]>();
          multiBands[j][i].map((point: [number, number]) => {
            points.push([
              (point[0] / (interpolateOptions.sizeU - 1)) *
                interpolateOptions.boundary.width +
                interpolateOptions.boundary.lng,
              (point[1] / (interpolateOptions.sizeV - 1)) *
                interpolateOptions.boundary.height +
                interpolateOptions.boundary.lat,
            ]);
          });
          if (
            interpolateOptions.boundary.width *
              interpolateOptions.boundary.height *
              area(points) <
            0
          ) {
            polygons.push(points);
          } else {
            holes.push(points);
          }
        }
        for (let k = 0; k < polygons.length; k++) {
          let polygon = polygons.splice(k--, 1)[0];
          let tmp = [polygon];
          for (let m = 0; m < holes.length; m++) {
            if (
              pointInPolygon(holes[m][0], polygon) &&
              polygons.every((item: any) => !pointInPolygon(holes[m][0], item))
            ) {
              let hole = holes.splice(m--, 1)[0];
              tmp.push(hole);
            }
          }
          feature.geometry.coordinates.push(tmp);
        }
        isobands.features.push(feature);
      }
      map.addLayer({
        id: "等值带",
        type: "fill",
        source: {
          type: "geojson",
          data: isobands,
        },
        layout: {
          visibility: props.isobands ? "visible" : "none",
        },
        paint: {
          "fill-color": ["match", ["get", "threshold"], ...fillColors, "transparent"],
          "fill-opacity": 0.5,
        },
      });

      var multiLines = isoLines(grid, breaks, {
        noFrame: true,
        polygons: false,
        polygons_full: false,
        noQuadTree: false,
        linearRing: false,
        verbose: false,
        successCallback: (multiLines: any, threshold: number) => {},
      });
      let isolines = {
        type: "FeatureCollection",
        features: new Array<any>(),
      };
      let isolineValues = {
        type: "FeatureCollection",
        features: new Array<any>(),
      };
      for (let j = 0; j < multiLines.length; j++) {
        let feature = {
          type: "Feature",
          properties: { threshold: breaks[j] },
          geometry: {
            type: "MultiLineString",
            coordinates: new Array<any>(),
          },
        };
        let featureValue = {
          type: "Feature",
          properties: { threshold: breaks[j] },
          geometry: {
            type: "MultiPoint",
            coordinates: new Array<any>(),
          },
        };
        // console.log(multiLines[j])
        for (let i = 0; i < multiLines[j].length; i++) {
          let line = multiLines[j][i];
          let points = new Array<any>();
          for (let k = 0; k < line.length; k++) {
            let point = [
              (line[k][0] / (interpolateOptions.sizeU - 1)) *
                interpolateOptions.boundary.width +
                interpolateOptions.boundary.lng,
              (line[k][1] / (interpolateOptions.sizeV - 1)) *
                interpolateOptions.boundary.height +
                interpolateOptions.boundary.lat,
            ];
            points.push(point);
          }
          feature.geometry.coordinates.push(points);
          let firstPoint = points[0];
          let lastPoint = points.slice(-1)[0];
          if (JSON.stringify(firstPoint) === JSON.stringify(lastPoint)) {
            featureValue.geometry.coordinates.push(firstPoint);
          } else {
            featureValue.geometry.coordinates.push(firstPoint);
            featureValue.geometry.coordinates.push(lastPoint);
          }
        }
        isolines.features.push(feature);
        isolineValues.features.push(featureValue);
      }
      map.addLayer({
        id: "等值线",
        type: "line",
        source: {
          type: "geojson",
          data: isolines,
        },
        layout: {
          visibility: props.isolines ? "visible" : "none",
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": ["match", ["get", "threshold"], ...strokeColors, "transparent"],
          "line-width": 2,
          "line-opacity": 1,
        },
      });
      map.addLayer({
        id: "等值线值",
        type: "symbol",
        source: {
          type: "geojson",
          data: isolineValues,
        },
        layout: {
          visibility: props.isolines ? "visible" : "none",
          "text-field": ["get", "threshold"],
          "text-size": 16,
          "text-font": ["simkai"],
          "text-offset": [0, 0.2],
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-rotation-alignment": "map",
        },
        paint: {
          "text-color": "yellow",
          "text-halo-width": 1,
          "text-halo-color": "black",
        },
      });
      let gridPoints = {
        type: "FeatureCollection",
        features: new Array<any>(),
      };
      for (let j = 0; j < grid.length; j++) {
        for (let i = 0; i < grid[j].length; i++) {
          let x =
            (i / (interpolateOptions.sizeU - 1)) * interpolateOptions.boundary.width +
            interpolateOptions.boundary.lng;
          let y =
            (j / (interpolateOptions.sizeV - 1)) * interpolateOptions.boundary.height +
            interpolateOptions.boundary.lat;
          gridPoints.features.push({
            type: "Feature",
            properties: {
              threshold: grid[j][i].toFixed(2),
              color: "white",
            },
            geometry: {
              type: "Point",
              coordinates: [x, y],
            },
          });
        }
      }
      map.addLayer({
        id: "网格值",
        type: "symbol",
        source: { type: "geojson", data: gridPoints },
        layout: {
          visibility: props.gridValue ? "visible" : "none",
          "text-field": ["get", "threshold"],
          "text-font": ["simkai"],
          "text-offset": [0, 0.2],
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-rotation-alignment": "map",
        },
        paint: {
          "text-color": ["get", "color"],
          "text-halo-width": 1,
          "text-halo-color": "black",
        },
      });
      map.addLayer({
        id: "网格点",
        type: "circle",
        source: { type: "geojson", data: gridPoints },
        layout: {
          visibility: props.gridPoint ? "visible" : "none",
        },
        paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1 },
      });
      // map.addLayer({
      //   id: "等值线边界",
      //   type: "fill",
      //   source: {
      //     type: "geojson",
      //     data: {
      //       type: "Feature",
      //       geometry: {
      //         type: "Polygon",
      //         coordinates: [
      //           [
      //             [-180, -50],
      //             [180, -50],
      //             [180, 50],
      //             [-180, 50],
      //             [-180, -50],
      //           ],
      //         ],
      //       },
      //     },
      //   },
      //   layout: {},
      //   paint: {
      //     "line-color": "yellow",
      //     "line-opacity": 1,
      //     "line-width": 1,
      //     "fill-color": "cyan",
      //     "fill-opacity": 0.5,
      //   },
      // });
    });

}
  });

  map.on("zoom", zoomFunc);
  map.on("pitch", pitchFunc);
  map.on("move", moveFunc);
  map.on("bearing", bearingFunc);
  eventbus.on("人影-将站点移动到屏幕中心", flyTo);
  eventbus.on("人影-地面作业申请-网络上报", 网络上报);
});
onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  clearInterval(timer);
  clearInterval(graphTimer);
  eventbus.off("人影-将站点移动到屏幕中心", flyTo);
  eventbus.off("人影-地面作业申请-网络上报", 网络上报);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("pitch", pitchFunc);
  map.off("bearing", bearingFunc);
  map.remove();
});
let LAT = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI;
const baseTileData = {
  attribution: null,
  attribution2:
    '<a href="https://www.mapbox.com/about/maps/" target="_blank" title="Mapbox" aria-label="Mapbox">&copy; Mapbox</a> <a href="https://www.openstreetmap.org/about/" target="_blank" title="OpenStreetMap" aria-label="OpenStreetMap">&copy; OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/contribute/" target="_blank" title="Improve this map" aria-label="Improve this map">Improve this map</a> <a href="https://www.maxar.com/" target="_blank" title="Maxar" aria-label="Maxar">&copy; Maxar</a>',
  autoscale: true,
  bounds: [-180, -LAT, 180, LAT],
  cacheControl: "max-age=43200,s-maxage=2592000",
  center: [0, 0, 3],
  created: 1358310600000,
  id: "mapbox.satellite",
  mapbox_logo: false,
  maxzoom: 22,
  minzoom: 0,
  modified: 1614877124000,
  name: "Mapbox Satellite",
  private: false,
  scheme: "xyz",
  tilejson: "2.2.0",
  tiles: new Array<string>(),
  webpage: "https://dev-studio.tilestream.net/tilesets/mapbox.satellite",
};
function processTileData(tiles = new Array<string>()) {
  baseTileData.tiles = tiles;
  return URL.createObjectURL(
    new File([JSON.stringify(baseTileData)], Math.random() + ".json", {
      type: "application/json",
    })
  );
}
watch(
  () => props.tile,
  (tile) => {
    let s = map ? map.getStyle() : style;
    s.sources["raster-tiles"].url = processTileData(tile.tileData);
    s.layers.map((v: any) => {
      if (v.id == "simple-tiles") {
        v.layout.visibility = props.loadmap ? "visible" : "none";
      } else if (v.id == "districtLineBase" || v.id == "districtLineOver") {
        v.layout.visibility = props.district ? "visible" : "none";
      }
    });
    map && map.setStyle(s);
  },
  { deep: true, immediate: true }
);
watch(
  () => props.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
  }
);
watch([() => props.zoom, () => props.center], ([zoom, center]) => {
  //无法通过监听变量的变化实时设置地图的视角
});
watch(
  () => station.人影界面被选中的设备,
  (strID) => {
    $(`#人影-${strID}`)[0].scrollIntoView({
      block: "nearest",
      behavior: "smooth",
      inline: "center",
    });
    active();
  }
);
watch(
  () => props.gridValue,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("网格值", "visibility", "visible");
    } else {
      map.setLayoutProperty("网格值", "visibility", "none");
    }
  }
);
watch(
  () => props.gridPoint,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("网格点", "visibility", "visible");
    } else {
      map.setLayoutProperty("网格点", "visibility", "none");
    }
  }
);
watch(
  () => props.isobands,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("等值带", "visibility", "visible");
    } else {
      map.setLayoutProperty("等值带", "visibility", "none");
    }
  }
);
watch(
  () => props.isolines,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("等值线", "visibility", "visible");
      map.setLayoutProperty("等值线值", "visibility", "visible");
    } else {
      map.setLayoutProperty("等值线", "visibility", "none");
      map.setLayoutProperty("等值线值", "visibility", "none");
    }
  }
);
watch(
  () => props.zdz,
  (newVal) => {
    if (newVal) {
      map.getLayer("离散值") && map.setLayoutProperty("离散值", "visibility", "visible");
      map.getLayer("离散点") && map.setLayoutProperty("离散点", "visibility", "visible");
    } else {
      map.getLayer("离散值") && map.setLayoutProperty("离散值", "visibility", "none");
      map.getLayer("离散点") && map.setLayoutProperty("离散点", "visibility", "none");
    }
  }
);
watch(
  () => props.zyd,
  (newVal) => {
    if (map.getLayer("zydLayer")) {
      newVal
        ? map.setLayoutProperty("zydLayer", "visibility", "visible")
        : map.setLayoutProperty("zydLayer", "visibility", "none");
    }
    if (map.getLayer("最大射程-line")) {
      newVal
        ? map.setLayoutProperty("最大射程-line", "visibility", "visible")
        : map.setLayoutProperty("最大射程-line", "visibility", "none");
    }
    if (map.getLayer("最大射程-fill")) {
      newVal
        ? map.setLayoutProperty("最大射程-fill", "visibility", "visible")
        : map.setLayoutProperty("最大射程-fill", "visibility", "none");
    }
  }
);
watch(
  () => props.plane,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("飞机", "visibility", "visible");
    } else {
      map.setLayoutProperty("飞机", "visibility", "none");
    }
  }
);
watch(
  () => props.routeLine,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("routeLineLayer", "visibility", "visible");
    } else {
      map.setLayoutProperty("routeLineLayer", "visibility", "none");
    }
  }
);
watch(
  () => props.district,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("districtLineBase", "visibility", "visible");
      map.setLayoutProperty("districtLineOver", "visibility", "visible");
      map.setLayoutProperty("districtLayer", "visibility", "visible");
    } else {
      map.setLayoutProperty("districtLineBase", "visibility", "none");
      map.setLayoutProperty("districtLineOver", "visibility", "none");
      map.setLayoutProperty("districtLayer", "visibility", "none");
    }
  }
);
watch(
  () => props.districtLineColor,
  (newVal) => {
    map.setPaintProperty("districtLineOver","line-color",newVal)
  }
);
watch(
  () => setting.人影.监控.districtFillColor,
  (newVal) => {
    map.setPaintProperty("districtLayer","fill-color",newVal)
  }
);
watch(
  () => props.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
  }
);
watch(()=>setting.人影.监控.人影飞行区,(newVal)=>{
  if(newVal){
    map.setLayoutProperty("华北飞行区域baseLine","visibility","visible")
    map.setLayoutProperty("华北飞行区域line","visibility","visible")
    map.setLayoutProperty("华北飞行区域标签","visibility","visible")
    map.setLayoutProperty("华北飞行区域area","visibility","visible")
  }else{
    map.setLayoutProperty("华北飞行区域baseLine","visibility","none")
    map.setLayoutProperty("华北飞行区域line","visibility","none")
    map.setLayoutProperty("华北飞行区域标签","visibility","none")
    map.setLayoutProperty("华北飞行区域area","visibility","none")
  }
})
</script>

<style lang="scss">
.stationMenu {
  display: none;
  background: #ffffff88;
  border-radius: 10px;
  border-top-left-radius: 4px;
  border: 1px solid var(--ep-border-color);
  opacity: 1 !important;
  ul {
    cursor: default;
    display: flex;
    position: relative;
    flex-direction: column;
    padding: 5px;
    box-sizing: border-box;
    margin-top: 0;
    margin-bottom: 0;
    li {
      cursor: pointer;
      border-radius: 4px;
      position: relative;
      font-size: 16px;
      list-style: none;
      padding: 2px;
      &:hover {
        background: rgba(62, 110, 197, 1);
      }
      &:active {
        background: inherit;
      }
      &:not(:first-child) {
        margin-top: 2px;
      }
    }
  }
}

.dark .stationMenu {
  background: #00000088;
  ul {
    cursor: default;
    display: flex;
    position: relative;
    flex-direction: column;
    padding: 5px;
    box-sizing: border-box;
    margin-top: 0;
    margin-bottom: 0;
    li:hover {
      background: rgba(62, 110, 197, 1);
    }
  }
}

.mapboxgl-ctrl-bottom-left {
  bottom: 10px !important;
  left: auto !important;
  right: 10px !important;
}
.dark .select .ep-select__wrapper {
  background-color: #2b2b2b;
}
.deviceStation_人影 {
  box-sizing: border-box;
  position: absolute;
  font-size: 14px;
  filter: drop-shadow(#00000088 0 0 1px);
  &:hover,
  &:active {
    filter: drop-shadow(#000000 4px 4px);
  }
  .connectingLine {
    position: absolute;
    height: 4px;
    z-index: -1;
    clip-path: polygon(0% 50%, 100% 100%, 100% 0%, 0% 50%);
  }
  .label {
    position: relative;
    text-shadow: 0 0 2px #fff;
    &:hover {
      cursor: pointer;
    }
    color: black;
    padding: 4px;
    background-color: #ffffff;
    border-radius: 4px;
  }
  .station {
    cursor: pointer;
    width: 32px;
    height: 32px;
    position: absolute;
    overflow: hidden;
    border: none;
    .projectile {
      width: 100%;
      height: 100%;
      background: url("/src/assets/projectile.svg") no-repeat center center;
    }
  }
}
</style>
<style scoped lang="scss">
.stationDialog{
  position: absolute;
  left:10px;
  top:10px;
}
.mapboxgl-canvas:focus-visible {
  outline: none;
}
</style>
