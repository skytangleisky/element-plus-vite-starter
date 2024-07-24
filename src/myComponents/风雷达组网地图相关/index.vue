<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <div
      v-resize="resize"
      ref="mapRef"
      class="map dark:bg-#2b2b2b bg-white"
      style="
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 1;
        outline: none;
      "
    ></div>
    <div ref="popup" class="ol-popup" style="display: none">
      <div
        style="
          position: absolute;
          background-color: rgb(73, 208, 37);
          left: 0;
          right: 0;
          top: 0;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding-left: 10px;
          padding-right: 25px;
          align-items: center;
        "
      >
        <div class="title">{{ info.title }}</div>
        <div class="latestTime">{{ info.time }} 更新</div>
      </div>
      <div
        ref="popup_content"
        style="
          position: absolute;
          display: flex;
          flex-direction: column;
          top: 30px;
          justify-content: start;
        "
      >
        <div style="color: #e83e8c">状&emsp;态：{{ info.status }}</div>
        <div style="color: #e83e8c">速&emsp;度：{{ info.speed }}</div>
        <div style="color: #e83e8c">经&emsp;度：{{ info.longitude }}</div>
        <div style="color: #e83e8c">纬&emsp;度：{{ info.latitude }}</div>
        <div style="color: #e83e8c">方位角：{{ info.deg }}</div>
      </div>
      <div ref="popup_closer" class="ol-popup-closer"></div>
    </div>
    <Dialog class="absolute" style="left: 240px; top: 10px"></Dialog>
    <radar-statistic></radar-statistic>
    <Legend style="bottom: 10px;z-index: 1;"></Legend>
    <div
      :class="`right-drawer ${
        setting.disappear ? 'disappear' : ''
      } b-solid b-0 b-l-1px dark:b-color-#888`"
    >
      <div style="display:flex;flex-direction: column;overflow: auto; scroll-snap-type: none;height: 100%;">
        <chart-info></chart-info>
        <chart-fkx></chart-fkx>
        <chart-dom v-if="checkPermission(['admin'])"></chart-dom>
        <chartDirection v-if="checkPermission(['admin'])"></chartDirection>
        <chartSpeed v-if="checkPermission(['admin'])"></chartSpeed>
        <chartSNR v-if="checkPermission(['admin'])"></chartSNR>
        <chart-th v-if="checkPermission(['admin'])"></chart-th>
      </div>
      <el-icon
        class="left--29px z-999 bg-#eee dark:bg-#304156 dark:color-#888"
        style="
          font-size: 28px;
          position: absolute;
          border-bottom-left-radius: 50%;
          border-left: 1px solid grey;
          border-bottom: 1px solid grey;
        "
        @click="disappear"
      >
        <svg
          t="1695093760888"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5105"
          width="200"
          height="200"
        >
          <path
            d="M557.397333 167.204571l293.059048 293.059048L902.192762 512l-51.712 51.712-293.059048 293.083429-51.736381-51.712L762.148571 548.571429H121.904762v-73.142858h640.243809L505.660952 218.940952l51.736381-51.736381z"
            p-id="5106"
          ></path>
        </svg>
      </el-icon>
    </div>
    <time-line
      v-if="checkPermission(['admin'])"
      :data="data"
      :toLeft="change"
      :toRight="change"
      :toMiddle="change"
      v-model:now="setting.now"
      v-model:status="setting.status"
      v-model:level="setting.level"
      class="absolute bottom-0"
    ></time-line>
    <!-- <graph
      v-if="checkPermission(['admin'])"
      class="absolute left-0 bottom-30px"
      v-model:args="graphArgs"
    ></graph> -->
    <chromatography
      ref="chromatographyRef"
      :arr="chromatographyOption.arr"
      style="
        right: 30px;
        color: white;
        top: 50%;
        transform: translateY(-50%);
        bottom: 0;
        height: 300px;
        position: absolute;
      "
    ></chromatography>
    <div class="stationMenu" ref="stationMenuRef" @mousedown.stop>
      <ul>
        <li @click="单站数据">单站数据</li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isDark } from "~/composables/dark.ts";
import { useRouter } from "vue-router";
const router = useRouter()
const 单站数据 = ()=>{
  router.replace('/cq/device/'+$(stationMenu).data().radar_id)
}
import chromatography from "../激光测风尾涡/chromatography.vue";
import * as turf from "@turf/turf";
// import ppiDataUrl from "../组网/CDL_S10000_Lidar10HKF00631450_PPI_FrmAzm30.00_ToAzm29.00_Pth3.00_Spd6.00_Res060_StartIdx003_Start003_Stop191_LOSWind_20230515 000240.csv?url";
import ppiDataUrl from "./level1/CDL_S4000_Lidar10BQC07110410_PPI_FrmAzm0.00_ToAzm359.00_Pth30.00_Spd6.00_Res030_StartIdx002_Start002_Stop190_LOSWind_20240715 203223.csv?url";
import ppiInversionData from "./level2/CDL_S4000_Lidar10BQC07110410_PPI_FrmAzm0.00_ToAzm359.00_Pth30.00_Spd6.00_Res030_StartIdx002_VADStart002_VADStop190_VADWind_Sec_20240715 203223.csv?raw";
import { exec } from "~/api/index.js";
import { getFkxRealData,getPPIGrid,getSensorData } from "../../api/重庆.ts";
import {checkPermission,sixty2Float,addFeatherImages,addArrowImages,getFeather,View,calculateBlockPoints,calculateCirclePoints} from "~/tools";
const decoder = new TextDecoder()
const encoder = new TextEncoder()
const stationMenuRef = ref<HTMLDivElement>();
let stationMenu: HTMLDivElement;
import { destinationPoint } from "~/myComponents/map/js/core.js";
import { watch, ref, onMounted, onBeforeUnmount, reactive,nextTick } from "vue";
import { useBus } from "~/myComponents/bus";
import Dialog from "./dialog.vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { eventbus } from "~/eventbus";
//信噪比
const chromatographyOption=reactive<{arr:Array<number>}>({
  arr:[]
})
switch(setting.风雷达组网地图相关.风场数据){
  case '无':
    chromatographyOption.arr=[]
    break;
  case '径向速度':
    chromatographyOption.arr = [-60,-48,-40,-32,-24,-16,-8,-0.5,0.5,8,16,24,32,40,48,60]
    break;
  case '谱宽':
    chromatographyOption.arr = [0,1,2,3,4,5,6,7,8,9,10]
    break;
  case '信噪比':
    chromatographyOption.arr = [0,2,4,6,8,10,12,14,16,18,20]
    break;
  case '频谱强度':
    chromatographyOption.arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    break;
  default:
    console.error('unknown '+setting.风雷达组网地图相关.风场数据)
    break;
}
const chromatographyRef = ref(null);
const Marker = mapboxgl.Marker;
const bus = useBus();
const graphArgs = reactive({
  fps: { value: 0, min: 0, max: 144, strokeStyle: "#ffffff88" },
  // memory: { value: 0, min: 0, max: 120, strokeStyle: "#0f0" },
});
const data = reactive([]);
let preTime = 0;
const change = (it) => {
  // if (it.time !== preTime) {
  //   console.log("change");
  //   //删除相关站点的风羽
  //   for (let i = 0; i < points.data.features.length; i++) {
  //     if (
  //       it.radar_id == points.data.features[i].properties.radar_id &&
  //       points.data.features[i].properties.type == "风羽"
  //     ) {
  //       points.data.features.splice(i--, 1);
  //     }
  //   }
  //   for (let k in it.attributes) {
  //     let tmp2 = it.attributes[k].slice().reverse();
  //     tmp2.forEach((tmp3) => {
  //       for (let k in tmp3) {
  //         let item = tmp3[k];
  //         let ll = destinationPoint(it.lngLat[0], it.lngLat[1], item.north_a, Number(k));
  //         // item.center_h_direction_abs = Math.random() * 360;
  //         // item.center_h_speed = Math.random() * 60;
  //         if (item.center_h_direction_abs != -1000 && item.center_h_speed != -1000) {
  //           points.data.features.push({
  //             type: "Feature",
  //             properties: {
  //               type: "风羽",
  //               radar_id: it.radar_id,
  //               风速: item.center_h_speed,
  //               image: "feather" + getFeather(item.center_h_speed),
  //               风向: item.center_h_direction_abs,
  //             },
  //             geometry: {
  //               type: "Point",
  //               coordinates: [ll.lng, ll.lat],
  //             },
  //           });
  //         }
  //       }
  //       let source = map.getSource("point");
  //       source && source.setData(points.data);
  //     });
  //   }
  //   preTime = it.time;
  // }
};
const toLeft = () => {
  console.log("toLeft");
};
const toMiddle = () => {
  console.log("toMiddle");
};
const toRight = () => {
  console.log("toRight");
};
import timeLine from "~/tools/timeLine.vue";
import graph from "~/tools/graph.vue";
const info = ref({
  title: "南昌昌北国际机场(ZSCN)",
  time: "2020-09-24 16:00",
  name: "",
  status: "",
  speed: "",
  longitude: "",
  latitude: "",
  deg: "",
});

let dbsData: { [key: string]: any } = {};
let ppiData: { [key: string]: any } = {};
import { useStationStore } from "~/stores/station";
import chartTh from "~/myComponents/echarts/重庆_T_H.vue";
import chartDom from "~/myComponents/echarts/重庆_index.vue";
import chartFkx from "~/myComponents/echarts/重庆_fkx.vue";
import chartInfo from "~/myComponents/echarts/重庆_info.vue";
import chartSNR from "~/myComponents/echarts/重庆_SNR.vue";
import chartSpeed from "~/myComponents/echarts/重庆_Speed.vue";
import chartDirection from "~/myComponents/echarts/重庆_Direction.vue";
import { useRoute } from "vue-router";
const route = useRoute();
import radarStatistic from "./radarStatistic.vue";
import Legend from "./legend.vue";
import style from "./streets-v11.js";
import moment from "moment";
import { wgs84togcj02 } from "../map/workers/mapUtil.js";

let prevDate;
watch(
  () => setting.now,
  (newVal) => {
    if (newVal == undefined) {
      newVal = Date.now();
    }
    let strDate = new Date(newVal).Format("yyyyMMdd");
    if (strDate !== prevDate) {
      console.log(strDate);
      station
        .查询雷达最新的平均风数据接口({
          user_id: route.query.user_id,
        })
        .then((res) => {
          bus.avgWindData = res.data.data;
        });
      prevDate = strDate;
    }
  }
);
const station = useStationStore();
/** @type {import('ol/style/literal.js').LiteralStyle} */

const mapRef = ref(null);
const popup = ref(null);
const popup_closer = ref(null);
const disappear = (e) => {
  setting.disappear = !setting.disappear;
};
let timer, map: mapboxgl.Map;
let mock;
let speed = 20;
const points = {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          radar_id:'',
          风速: speed,
          image: "feather" + getFeather(speed),
          风向: NaN,
          高度:NaN,
          垂直气流:NaN,
          时间:NaN,
          color:isDark.value?'white':'black'
        },
        geometry: {
          type: "Point",
          coordinates: [-122.414, 37.776],
        },
      },
    ],
  },
};
const contextmenu = (e: any) => {
  if(e.features){
    const fs = map.queryRenderedFeatures(e.point, {
      layers: ["stationLayer"],
    });

    if (!fs.length) {
      return;
    }
    const feature = fs[0];
    console.log([feature.properties.lon,feature.properties.lat])
    marker.setLngLat([feature.properties.lon,feature.properties.lat])
    $('.stationMenu').css({display:'block'})
    $(stationMenu).removeData();
    $(stationMenu).data(feature.properties);
    // station.人影界面被选中的设备 = feature.properties.strID;
    // marker.setLngLat(feature.geometry.coordinates);
    // $(stationMenu).css({display:'block'});
    // $(stationMenu).removeData();
    // $(stationMenu).data(feature.properties);
  }
}
const mousedownFunc = ()=>{
  $(stationMenu).css({display:'none'})
}
const clickFunc = (e) => {
  if (e.features) {
    setting.disappear = false;
    for (let i = 0; i < bus.风雷达组网地图相关雷达站点信息.length; i++) {
      if (bus.风雷达组网地图相关雷达站点信息[i].no == e.features[0].properties.radar_id) {
        // station
        //   .查询雷达最新的径向风数据接口({
        //     radar_id: e.features[0].properties.radar_id.replaceAll("-", ""),
        //   })
        //   .then((res) => {
        //     bus.radialWindData = res.data.data;
        //   });
        station.active = bus.风雷达组网地图相关雷达站点信息[i].no;
        fetch最近风廓线数据()
        $(`#${station.active}`)[0].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
          inline: "center",
        });
      }
    }
  }
};
const zoomFunc = () => {
  setting.风雷达组网地图相关.zoom = map.getZoom();
};
const moveFunc = () => {
  let center = map.getCenter();
  setting.风雷达组网地图相关.center = [center.lng, center.lat];
};
const task = () => {
  // if (prevDate === new Date(setting.now).Format("yyyyMMdd")) {
  station
    .查询雷达最新的平均风数据接口({
      user_id: route.query.user_id,
    })
    .then((res) => {
      bus.avgWindData = res.data.data;
    });
  // }
  // station
  //   .查询瞬时风数据接口({
  //     user_id: route.query.user_id,
  //   })
  //   .then((res) => {
  //     station.secondWindData = res.data.data;
  //   });
  // if (station.active) {//会导致服务器阻塞
  //   station
  //     .查询雷达最新的径向风数据接口({
  //       radar_id: station.active.replaceAll("-", ""),
  //     })
  //     .then((res) => {
  //       bus.radialWindData = res.data.data;
  //     });
  // }
};
let polygons: any[] = [];
let inversionPPIData:{type:'FeatureCollection',features:Array<any>} = {
  type: 'FeatureCollection',
  features:[]
};
function processData(result: any, position: [number, number]) {
  //测试
  // for (let i = 0; i < 100; i++) {
  //   polygons.push({
  //     type: "Feature",
  //     geometry: {
  //       type: "Polygon",
  //       coordinates: [
  //         calculateSectorPoints(
  //           [120.477398, 36.16953],
  //           200.25 - 100.5 / 2 + 100.5 * i,
  //           200.25 - 100.5 / 2 + 100.5 * (i + 1),
  //           -1,
  //           90,
  //           360,
  //           "meters"
  //         ),
  //       ],
  //     },
  //     properties: {
  //       fillColor: "#" + Math.random().toString(16).substring(2, 8).toUpperCase(),
  //     },
  //   });
  // }
  let List = result.data.slice(0);
  if (List.length >= 2) {
    //定义始末两条径向内的径向位置
    for (let i = 1; i < List.length - 1; i++) {
      let Angle1 = Number(List[i - 1].Azimuth);
      let Angle2 = Number(List[i].Azimuth);
      let Angle3 = Number(List[i + 1].Azimuth);
      List[i].α = Math.min((Angle1 + Angle2) / 2, (Angle2 + Angle3) / 2);
      List[i].β = Math.max((Angle1 + Angle2) / 2, (Angle2 + Angle3) / 2);
    }
    //定义第一条径向位置
    let Angle1 = Number(List[0].Azimuth);
    let Angle2 = Number(List[1].Azimuth);
    List[0].α = Math.min(
      Angle1 - (Angle2 - Angle1) / 2,
      Angle1 + (Angle2 - Angle1) / 2
    );
    List[0].β = Math.max(
      Angle1 - (Angle2 - Angle1) / 2,
      Angle1 + (Angle2 - Angle1) / 2
    );
    //定义最后一条径向位置
    Angle1 = Number(List.slice(-2)[0].Azimuth);
    Angle2 = Number(List.slice(-1)[0].Azimuth);
    List[List.length - 1].α = Math.min(
      Angle2 - (Angle2 - Angle1) / 2,
      Angle2 + (Angle2 - Angle1) / 2
    );
    List[List.length - 1].β = Math.max(
      Angle2 - (Angle2 - Angle1) / 2,
      Angle2 + (Angle2 - Angle1) / 2
    );
  } else if (List.length == 1) {
    //定义只有一条径向的位置
    let Angle = Number(List[0].Azimuth);
    List[0].α = Angle - 0.5;
    List[0].β = Angle + 0.5;
  }
  for (let j = 0; j < List.length; j++) {
    let radial = List[j];
    let max = radial.list.slice(-1)[0]?.distance || 0;
    let min = radial.list.slice(0, 1)[0]?.distance || 0;
    let BinLength = (max - min) / (radial.list.length - 1);
    for (let i = 0; i < radial.list.length; i++) {
      let angle1 = radial.α;
      let angle2 = radial.β;
      if (angle2 - angle1 > 180) {
        angle1 = radial.β - (360 - ((angle2 - angle1) % 360));
        angle2 = radial.β;
      }
      // polygons.push({
      //   type: "Feature",
      //   geometry: {
      //     type: "Polygon",
      //     coordinates: [
      //       calculateBlockPoints(
      //         position,
      //         radial.list[i].distance - BinLength / 2,
      //         radial.list[i].distance + BinLength / 2,
      //         angle1,
      //         angle2,
      //         360,
      //         "meters"
      //       ),
      //     ],
      //   },
      //   properties: {
      //     fillColor:
      //       Math.abs(radial.list[i]["RadialWind(m/s)"]) == 999
      //         ? "transparent"
      //         : chromatographyRef.value.getColor(radial.list[i]["RadialWind(m/s)"]),
      //   },
      // });
      let fillColor:string|null = 'black';
      switch(setting.风雷达组网地图相关.风场数据){
        case '无':
          chromatographyOption.arr=[]
          fillColor = 'black'
          break;
        case '径向速度':
          if(Math.abs(radial.list[i]["RadialWind(m/s)"])===999){
            fillColor = null
          }else{
            fillColor = (chromatographyRef.value as any).getColor(radial.list[i]["RadialWind(m/s)"])
          }
          break;
        case '谱宽':
          fillColor = (chromatographyRef.value as any).getColor(radial.list[i]["SpectralWidth"])
          break;
        case '信噪比':
          fillColor = (chromatographyRef.value as any).getColor(radial.list[i]["SNR"])
          break;
        case '频谱强度':
          fillColor = (chromatographyRef.value as any).getColor(radial.list[i]["SpectralIntensity"])
          break;
        default:
          fillColor = 'black'
          console.error('unknown '+setting.风雷达组网地图相关.风场数据)
          break;
      }
      if(fillColor){
        console.log()
        polygons.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              calculateBlockPoints(
                position,
                (radial.list[i].distance - BinLength / 2)*Math.cos(Number(radial.Pitch)/180*Math.PI),
                (radial.list[i].distance + BinLength / 2)*Math.cos(Number(radial.Pitch)/180*Math.PI),
                angle1,
                angle2,
                360,
                "meters"
              ),
            ],
          },
          properties: {
            fillColor,
          },
        });
      }
    }
  }
  // map.addLayer({
  //   id: "雷达line",
  //   type: "line",
  //   source: "radar",
  //   paint: {
  //     "line-color": ["get", "fillColor"],
  //     "line-width": 2,
  //   },
  // });
}
const loadFunc = async () => {
  await addFeatherImages(map);
  await addArrowImages(map);
  work()
  timer = setInterval(work,60e3)
  map.addSource("radar", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: polygons,
    },
  });

  map.addLayer({
    id: "雷达",
    type: "fill",
    source: "radar",
    minzoom: 0,
    maxzoom: 22,
    paint: {
      "fill-color": ["get", "fillColor"],
      "fill-opacity": setting.风雷达组网地图相关.ppiOpacity,
      "fill-outline-color": "transparent",
    },
    layout:{
      visibility:setting.风雷达组网地图相关.风场数据=='无'?'none':'visible'
    }
  });
  map.addSource('等距环Source',{type:'geojson',data:circleDataFeatures})
  map.addLayer({
    id: "等距环",
    type: "line",
    source: '等距环Source',
    paint: {
      "line-opacity":setting.风雷达组网地图相关.等距环?0.3:0,
      "line-color": isDark.value?"#fff":'#000',
      "line-width": 2,
      "line-dasharray": [2, 2],
    },
  });
  map.addSource('等距环的单位Source',{type:'geojson',data:pointDataFeatures})
  map.addLayer({
    id: "等距环的单位",
    type: "symbol",
    source: '等距环的单位Source',
    layout: {
      "text-field": ["get", "units"],
      "text-font": ["simkai"],
      "text-size": 15,
      "text-anchor": "bottom-left",
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-rotation-alignment": "map",
      "text-pitch-alignment": "map",
    },
    paint: {
      "text-opacity":setting.风雷达组网地图相关.等距环?0.3:0,
      "text-color": isDark.value?"#fff":'#000',
      // "text-halo-color": "black",
      // "text-halo-width": 1,
    },
  });
  map.addSource("inversionPPIData",{
    type:"geojson",
    data: inversionPPIData,
  })
  let anchor = ["match", ["get", "风速"], 0, "center", "bottom-left"]
  if(setting.风雷达组网地图相关.反演风场=='风矢'){
    anchor = 'top'
  }
  map.addLayer({
    id: "inversionLayer",
    source: "inversionPPIData",
    type: "symbol",
    layout: {
      visibility: setting.风雷达组网地图相关.反演风场==='无' ? "none":"visible",
      // This icon is a part of the Mapbox Streets style.
      // To view all images available in a Mapbox style, open
      // the style in Mapbox Studio and click the "Images" tab.
      // To add a new image to the style at runtime see
      // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
      "icon-anchor": anchor,
      "icon-image": ["get", "image"],
      "icon-size": 1,
      "icon-rotate": ["get", "风向"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      // "text-field": ["get", "风速"],
      // "text-font": ["simkai"],
      // "text-size": 14,
      // "text-transform": "uppercase",
      // // "text-letter-spacing": 0.05,
      // "text-anchor": "center",
      // "text-line-height": 1,
      // // "text-justify": "center",
      // "text-offset": [0, 0],
      // "text-ignore-placement": true,
      // "text-allow-overlap": true,
      // "text-rotation-alignment": "map",
    }
  });
  map.addSource("point", points);
  map.addLayer({
    id: "stationLayer",
    source: "point",
    type: "circle",
    paint: {
      // "circle-radius": [
      //   "interpolate",
      //   ["exponential", 1.5],
      //   ["zoom"],
      //   15,
      //   4.5,
      //   16,
      //   8,
      //   18,
      //   20,
      //   22,
      //   200,
      // ],
      "circle-radius": 6,
      "circle-color": ["get", "color"],
      // "circle-stroke-width": [
      //   "interpolate",
      //   ["linear"],
      //   ["zoom"],
      //   15,
      //   0.8,
      //   16,
      //   1.2,
      //   18,
      //   2,
      // ],
      "circle-stroke-width": 1,
      // "circle-stroke-color": "hsl(220, 20%, 85%)",
      "circle-pitch-alignment": "map",
    },
    filter: ["==", ["get", "type"], "站点"],
    layout: {
      visibility: setting.station ? "visible" : "none",
    },
  });
  map.addLayer({
    id: "textLayer",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "name"],
      "text-font": ["simkai"],
      "text-size": 18,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "center",
      "text-line-height": 1,
      "text-offset": [0, -1.5],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
      "text-max-width": 400,
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.站名 ? 1 : 0,
      "text-color": isDark.value?"white":'black',
      // "text-halo-width": 1,
      // "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "idLayer",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "radar_id"],
      "text-font": ["simkai"],
      "text-size": 18,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "center",
      "text-line-height": 1,
      "text-offset": [0, -1.5],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
      "text-max-width": 400,
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.站号 ? 1 : 0,
      "text-color": isDark.value?'white':'black',
      // "text-halo-width": 1,
      // "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "temperatureLayer",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "external_temperature"],
      "text-font": ["simkai"],
      "text-size": 14,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "right",
      "text-line-height": 1,
      "text-offset": [-1, -0.2],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.factor[7].val ? 1 : 0,
      "text-color": "white",
      "text-halo-width": 1,
      "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "humidityLayer",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "external_humidity"],
      "text-font": ["simkai"],
      "text-size": 14,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "right",
      "text-line-height": 1,
      "text-offset": [-1, 1.2],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.factor[9].val ? 1 : 0,
      "text-color": "white",
      "text-halo-width": 1,
      "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "高度图层",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "高度"],
      "text-font": ["simkai"],
      "text-size": 16,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "right",
      "text-line-height": 1,
      "text-offset": [-1,0],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.高度?1:0,
      "text-color": isDark.value?"white":'black',
      // "text-halo-width": 1,
      // "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "风向图层",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "风向"],
      "text-font": ["simkai"],
      "text-size": 16,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "right",
      "text-line-height": 1,
      "text-offset": [-1, 0],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.风向?1:0,
      "text-color": isDark.value?"white":'black',
      // "text-halo-width": 1,
      // "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "风速图层",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "风速"],
      "text-font": ["simkai"],
      "text-size": 16,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "left",
      "text-line-height": 1,
      "text-offset": [1, 0],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.风速?1:0,
      "text-color": isDark.value?"white":'black',
      // "text-halo-width": 1,
      // "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "垂直气流图层",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "垂直气流"],
      "text-font": ["simkai"],
      "text-size": 14,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "left",
      "text-line-height": 1,
      "text-offset": [1, 0],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.垂直气流?1:0,
      "text-color": isDark.value?"white":'black',
      // "text-halo-width": 1,
      // "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "时间图层",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "时间"],
      "text-font": ["simkai"],
      "text-size": 14,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "center",
      "text-line-height": 1,
      "text-offset": [0, 2.2],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.时间?1:0,
      "text-color": isDark.value?"white":'black',
      // "text-halo-width": 1,
      // "text-halo-color": "black",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  map.addLayer({
    id: "featherLayer",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      // This icon is a part of the Mapbox Streets style.
      // To view all images available in a Mapbox style, open
      // the style in Mapbox Studio and click the "Images" tab.
      // To add a new image to the style at runtime see
      // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
      "icon-anchor": ["match", ["get", "风速"], 0, "center", "bottom-left"],
      "icon-image": ["get", "image"],
      "icon-size": 1,
      "icon-rotate": ["get", "风向"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      // "text-field": ["get", "风速"],
      // "text-font": ["simkai"],
      // "text-size": 14,
      // "text-transform": "uppercase",
      // // "text-letter-spacing": 0.05,
      // "text-anchor": "center",
      // "text-line-height": 1,
      // // "text-justify": "center",
      // "text-offset": [0, 0],
      // "text-ignore-placement": true,
      // "text-allow-overlap": true,
      // "text-rotation-alignment": "map",
    },
    paint: {
      "icon-opacity": setting.feather ? 1 : 0,
    },
  });
  bus.avgWindData = [];
  bus.secondWindData = [];
  bus.radialWindData = [];
  // if (import.meta.env.PROD) {
  //   timer = setInterval(() => task(), 4 * 60 * 1000);
  // } else if (import.meta.env.DEV) {
  //   timer = setInterval(() => task(), 4 * 60 * 1000);
  // }
  let frameCounter = map.painter.frameCounter;
  mock = setInterval(() => {
    graphArgs.fps.value = map.painter.frameCounter - frameCounter;
    frameCounter = map.painter.frameCounter;
    // graphArgs.memory.value = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    // graphArgs.memory.max = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
  }, 1000);
  // if (setting.风雷达组网地图相关.checks[0].select)
  //   station.查询雷达列表接口({ user_id: route.query.user_id });
  // if (setting.风雷达组网地图相关.checks[1].select)
  //   station.查询雷达在线列表接口({ user_id: route.query.user_id });
  // if (setting.风雷达组网地图相关.checks[2].select)
  //   station.查询雷达离线列表接口({ user_id: route.query.user_id });
  // if (setting.风雷达组网地图相关.checks[3].select)
  //   station.查询近期新增雷达列表接口({ user_id: route.query.user_id });
};
const flyTo = (item) => {
  try {
    map.flyTo({
      center: [item.longitude, item.latitude], // 新的中心点 [经度, 纬度]
      zoom: item.zoom || 10, // 目标缩放级别
      speed: 1, // 飞行速度，1 为默认速度
      // curve: 1, // 飞行路径的曲率, 1 是直线
      // easing: function (t) {
      //   return t;
      // }, // 自定义缓动函数
      essential: true, // 这个飞行动作对于用户交互是必要的
    });
  } catch (error) {
    console.log({ longitude: item.longitude, latitude: item.latitude });
    console.log(error);
  }
};
const resize = (entry) => {
  map && map.resize();
};
var marker:Marker;







var xhr = new XMLHttpRequest();
xhr.addEventListener("load", function () {
  /*S10000
  const d = new TextDecoder("utf8");
  let v = new View(this.response),
    result: { [key: string]: any } = {};
  let firstLine = d
    .decode(v.getLine())
    .replace(/,\r\n$/, "")
    .split(",");
  let secondLine = d
    .decode(v.getLine())
    .replace(/,\r\n$/, "")
    .split(",");
  type HeaderInfo = {
    AllGates: 200;
    Altitude: 40;
    BKGates: 9;
    FrequencyShift: 120;
    Latitude: 36.16953;
    Location: "榆林机场";
    Longitude: 120.477398;
    Model: "S10000";
    NorthOffset: 0;
    ProjectMemo: "Test";
    ProjectName: "榆林机场风切变";
    PulseWidth: 400;
    ReShotsTimes: 1;
    Resolution: 60;
    SCanMode: "Script";
    SN: "10HKF00631450";
    SNRThreshold: 8;
    SamplesPerGate: 100;
    Script: '<ppi cycles="1" interval="0" avelostimes="1" pitch="3" fromAzimuth="30" toAzimuth="29" speed="6" direction="1" vadwind="1" ScanBack="0" vadisslide="2" IsSecTick="0" shots="10000" NewFilePerCycle="1" />';
    Shots: 10000;
    SpetralEnd: 131;
    SpetralStart: 32;
    StartIndex: 3;
    TriggerDelayTime: 1000;
    Version: "1.0.1.6";
    ZeroFreq: 49.31;
  };
  let headerInfo: HeaderInfo = (result.headerInfo = {} as HeaderInfo);
  for (let i = 1; i < firstLine.length; i++) {
    let kv = firstLine[i].split(":");
    if (kv.length == 2) {
      Object.defineProperty(headerInfo, kv[0], { value: kv[1] });
    } else {
      throw Error("invalid " + firstLine[i]);
    }
  }
  let data: Array<any> = (result.data = []);

  while (!v.reachEnd()) {
    let thirdLine = d
      .decode(v.getLine())
      .replace(/,\r\n$/, "")
      .split(",");
    let item = { EarthAzimuth: 0, list: new Array<any>() };
    for (let i = 0; i < 23; i++) {
      Object.defineProperty(item, secondLine[i], { value: thirdLine[i] });
    }
    item.EarthAzimuth = Number(item.EarthAzimuth);
    //用于确保两根径向之间夹角不大于180度
    if (data.length > 0) {
      let lastItem = data[data.length - 1];
      if (Math.abs(item.EarthAzimuth - lastItem.EarthAzimuth) > 180) {
        // item.EarthAzimuth = 360 + item.EarthAzimuth;
        item.EarthAzimuth =
          lastItem.EarthAzimuth +
          (360 - (Math.abs(item.EarthAzimuth - lastItem.EarthAzimuth) % 360));
      }
    }
    for (let i = 23; i < thirdLine.length; i += 4) {
      let obj = {
        [secondLine[i + 0].split(" ")[1]]: Number(thirdLine[i + 0]),
        [secondLine[i + 1].split(" ")[1]]: Number(thirdLine[i + 1]),
        [secondLine[i + 2].split(" ")[1]]: Number(thirdLine[i + 2]),
        [secondLine[i + 3].split(" ")[1]]: Number(thirdLine[i + 3]),
        distance: Number(secondLine[i + 3].split(" ")[0].replace(/m$/, "")),
      };
      item.list.push(obj);
    }
    data.push(item);
  }*/
  /* S4000
  const d = new TextDecoder("utf8");
  let v = new View(this.response),
    result: { [key: string]: any } = {};
  let firstLine = d
    .decode(v.getLine())
    .replace(/,\r\n$/, "")
    .split(",");
  result.HeaderInfo = {};
  for (let i = 1; i < firstLine.length; i++) {
    let kv = firstLine[i].split(":");
    if (kv.length == 2) {
      result.HeaderInfo[kv[0]] = kv[1]
    }
  }
  let secondLine = d
    .decode(v.getLine())
    .replace(/,\r\n$/, "")
    .split(",");
  let data: Array<any> = (result.data = []);
  while (!v.reachEnd()) {
    let thirdLine = d
      .decode(v.getLine())
      .replace(/,\r\n$/, "")
      .split(",");
    let radial:{[key:string]:any} = { Azimuth: 0, list: new Array<any>() };
    for (let i = 0; i < 11; i++) {
      radial[secondLine[i]] = thirdLine[i]
    }
    radial.Azimuth = Number(radial.Azimuth);
    //用于确保两根径向之间夹角不大于180度
    // if (data.length > 0) {
    //   let lastItem = data[data.length - 1];
    //   if (Math.abs(item.Azimuth - lastItem.Azimuth) > 180) {
    //     // item.Azimuth = 360 + item.Azimuth;
    //     item.Azimuth =
    //       lastItem.Azimuth +
    //       (360 - (Math.abs(item.Azimuth - lastItem.Azimuth) % 360));
    //   }
    // }
    for (let i = 11; i < thirdLine.length; i += 4) {
      let obj = {
        [secondLine[i + 0].split(" ")[1]]: Number(thirdLine[i + 0]),
        [secondLine[i + 1].split(" ")[1]]: Number(thirdLine[i + 1]),
        [secondLine[i + 2].split(" ")[1]]: Number(thirdLine[i + 2]),
        [secondLine[i + 3].split(" ")[1]]: Number(thirdLine[i + 3]),
        distance: Number(secondLine[i + 3].split(" ")[0].replace(/m$/, "")),
      };
      radial.list.push(obj);
    }
    data.push(radial);
  }
  */
  // ppiData[radar_id] = {result,position}
  // processData(result, position);
});
xhr.responseType = "arraybuffer";
xhr.open("GET", ppiDataUrl);
xhr.send();
function work(){
  exec({
    database: "host=127.0.0.1&port=3306&user=root&password=tanglei&database=weatherservice",
    query: {
      sqls: ["select * from `device`"],
    },
  }).then((res) => {
    res.data[0] = res.data[0].map((v: any) => {
      let position = wgs84togcj02(sixty2Float(v.lng), sixty2Float(v.lat));
      v.longitude = position[0];
      v.latitude = position[1];
      return v;
    });
    bus.风雷达组网地图相关雷达站点信息 = res.data[0];
    points.data.features.length=0;
    circleDataFeatures.features.length=0
    pointDataFeatures.features.length=0
    inversionPPIData.features.length = 0
    res.data[0].map((item:any) => {
      if (item.hide !== "true") {
        if(item.no==station.active){
          fetch最近风廓线数据()
        }
        let position = wgs84togcj02(sixty2Float(item.lng), sixty2Float(item.lat)) as [
          number,
          number
        ];
        points.data.features.push({
          type: "Feature",
          properties: {
            lon:position[0],
            lat:position[1],
            type: "站点",
            radar_id: item.no,
            高度: NaN,
            风速: NaN,
            风向: NaN,
            垂直气流: NaN,
            时间:NaN,
            time: moment().format("YYYY-MM-DD HH:mm:ss"),
            name: item.device_short_name,
            is_online: true,
            external_temperature: 25,
            external_humidity: 0.6,
            image: "feather" + getFeather(0),
            color: item.status==1?'#0f0':item.status==2?'#f80':item.status==3?'#f00':(isDark.value?'#fff':'#000'),
          },
          geometry: {
            type: "Point",
            coordinates: position,
          },
        });
        for (let i = 1; i <= 10; i++) {
          let circle = calculateCirclePoints(position, i * 1000, 64, 'meters');
          circleDataFeatures.features.push({
            type:'Feature',
            geometry: {
              type: "Polygon",
              coordinates: [circle],
            },
          });

          if(i==1||i==5||i==10){
            let pts: any = [];
            const pt1 = turf.destination(
              turf.point(position),
              1000 * i,
              0,
              { units: "meters" }
            );
            const pt2 = turf.destination(
              turf.point(position),
              1000 * i,
              90,
              { units: "meters" }
            );
            const pt3 = turf.destination(
              turf.point(position),
              1000 * i,
              180,
              { units: "meters" }
            );
            const pt4 = turf.destination(
              turf.point(position),
              1000 * i,
              270,
              { units: "meters" }
            );
            pts.push(
              pt1.geometry?.coordinates,
              pt2.geometry?.coordinates,
              pt3.geometry?.coordinates,
              pt4.geometry?.coordinates
            );
            pointDataFeatures.features.push({
              type: "Feature",
              geometry: {
                type: "MultiPoint",
                coordinates: pts,
              },
              properties: {
                units: i + "km",
              },
            });
          }
        }
        map.getSource('等距环的单位Source').setData(pointDataFeatures)
        map.getSource('等距环Source').setData(circleDataFeatures)

        // new Marker({
        //   draggable: false,
        //   pitchAlignment: "map",
        //   rotationAlignment: "map",
        // })
        //   .setLngLat(position)
        //   .addTo(map);
        let radar_id = item.no

        // getSensorData({radar_id,dataTime:'20240716154908'}).then(res=>{
        //   if(res.data.data.sensor!==""){
        //     let result:{[key:string]:any} = {}
        //     result.list = []
        //     const view = new View(encoder.encode(res.data.data.sensor).buffer)
        //     let firstLine = decoder.decode(view.getLine()).trim().replace(/,$/g,'').split(',')
        //     while(!view.reachEnd()){
        //       let secondLine = decoder.decode(view.getLine()).trim().replace(/,$/g,'').split(',')
        //       firstLine.map((key,index)=>{
        //         // result.list.push({[key]:secondLine[index]})
        //       })
        //     }
        //     console.log(result)
        //   }
        // })
        let time = moment()
        setting.风雷达组网地图相关.请求时间 = time.format("HH:mm:ss")
        getFkxRealData({
          radar_id,
          dateTime: time.format("YYYYMMDDHHmmss"),
          num:1
        }).then((res) => {
          let view:View|null = new View(encoder.encode(res.data.data.file.file_data).buffer)
          let result:{[key:string]:any} = {HeaderInfo:{},data:[]}
          let firstLine = decoder.decode(view.getLine()).replace(/,\r\n$/,'').split(',')
          for(let i=1;i<firstLine.length;i++){
            let item = firstLine[i].split(':')
            if(item.length==2){
              result.HeaderInfo[item[0]] = item[1]
            }
          }
          let secondLine = decoder.decode(view.getLine()).replace(/,\r\n$/,'').split(',')
          while(!view.reachEnd()){
            let radial:{[key:string]:any} = {list:[]}
            let thirdLine = decoder.decode(view.getLine()).replace(/,\r\n$/g,'').split(',')
            for(let i=0;i<9;i++){
              radial[secondLine[i]] = thirdLine[i]
            }
            for(let i=9;i<secondLine.length;i+=9){
              radial.list.push({
                distance:Number(secondLine[i].split(' ')[0].substring(0,secondLine[i].split(' ')[0].length-1)),
                [secondLine[i+0].split(' ').slice(1).join(' ')]:Number(thirdLine[i+0]),
                [secondLine[i+1].split(' ').slice(1).join(' ')]:Number(thirdLine[i+1]),
                [secondLine[i+2].split(' ').slice(1).join(' ')]:Number(thirdLine[i+2]),
                [secondLine[i+3].split(' ').slice(1).join(' ')]:Number(thirdLine[i+3]),
                [secondLine[i+4].split(' ').slice(1).join(' ')]:Number(thirdLine[i+4]),
                [secondLine[i+5].split(' ').slice(1).join(' ')]:Number(thirdLine[i+5]),
                [secondLine[i+6].split(' ').slice(1).join(' ')]:Number(thirdLine[i+6]),
                [secondLine[i+7].split(' ').slice(1).join(' ')]:Number(thirdLine[i+7]),
                [secondLine[i+8].split(' ').slice(1).join(' ')]:Number(thirdLine[i+8]),
              })
            }
            result.data.push(radial)
          }
          dbsData[radar_id] = result
          result.data.map((radial:any)=>{
            let lib = radial.list[setting.风雷达组网地图相关.relativeHeight-1]
            if(lib){
              points.data.features = points.data.features.map((item) => {
                if(item.properties.color!=='#f00'){
                  if(lib['WindSpeed']!==999){
                    if (item.properties.radar_id === radar_id) {
                      item.properties.风速 = Number(lib['WindSpeed'].toFixed(2));
                      item.properties.风向 = Number(lib['WindDirection'].toFixed(2));
                      item.properties.垂直气流 = lib['ZWind']<0?`\u2193${lib['ZWind'].toFixed(2)}`:`\u2191${lib['ZWind'].toFixed(2)}`
                      item.properties.高度 = lib['distance']
                      item.properties.时间 = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                      item.properties.image = "feather" + getFeather(lib['WindSpeed']);
                    }
                  }else{
                    if (item.properties.radar_id === radar_id) {
                      item.properties.风速 = NaN;
                      item.properties.风向 = NaN;
                      item.properties.垂直气流 = NaN
                      item.properties.高度 = lib['distance']
                      item.properties.时间 = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                      item.properties.image = "feather";
                    }
                  }
                }else{
                  if (item.properties.radar_id === radar_id) {
                    item.properties.风速 = NaN;
                    item.properties.风向 = NaN;
                    item.properties.垂直气流 = NaN
                    item.properties.高度 = NaN
                    item.properties.时间 = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                    item.properties.image = "feather";
                  }
                }
                return item
              });
            }else{
              points.data.features = points.data.features.map((item) => {
                if (item.properties.radar_id === radar_id) {
                  item.properties.风速 = NaN;
                  item.properties.风向 = NaN;
                  item.properties.垂直气流 = NaN
                  item.properties.高度 = NaN
                  item.properties.时间 = NaN
                  item.properties.image = "feather";
                }
                return item;
              });
            }
            (map.getSource("point") as any).setData(points.data);
          })
        });
        /* PPI数据处理并显示
        let inversionResult:{[key:string]:any} = {HeaderInfo:{}}
        const view = new View(encoder.encode(ppiInversionData).buffer)
        let firstLine = decoder.decode(view.getLine()).replace(/,\r\n$/, "").split(",");
        for(let i=1;i<firstLine.length;i++){
          let item = firstLine[i].split(':')
          if(item.length==2){
            inversionResult.HeaderInfo[item[0]]=item[1]
          }
        }
        let secondLine = decoder.decode(view.getLine()).replace(/,\r\n$/, "").split(",");
        inversionResult.data = []
        while(!view.reachEnd()){
          let radial:{[key:string]:any} = {list:[]}
          let thirdLine = decoder.decode(view.getLine()).replace(/,\r\n$/, "").split(",");
          for(let i=0;i<12;i++){
            radial[secondLine[i]] = thirdLine[i]
          }
          for(let i=12;i<thirdLine.length;i+=4){
            radial.list.push({
              distance:Number(secondLine[i].split(' ')[0].substring(0,secondLine[i].split(' ')[0].length-1)),
              [secondLine[i+0].split(' ')[1]]:Number(thirdLine[i+0]),
              [secondLine[i+1].split(' ')[1]]:Number(thirdLine[i+1]),
              [secondLine[i+2].split(' ')[1]]:Number(thirdLine[i+2]),
              [secondLine[i+3].split(' ')[1]]:Number(thirdLine[i+3]),
            })
          }
          inversionResult.data.push(radial)
        }
        inversionResult.data.map((radial:any)=>{
          radial.list.map((lib:any)=>{
            if(lib.WindSpeed!==999){
              const pt = turf.destination(
                turf.point(position),
                lib.distance,
                Number(radial.Azimuth),
                { units: "meters" }
              );
              inversionPPIData.features.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: pt.geometry?.coordinates,
                },
                properties: {
                  风向:Number(lib.WindDirection),
                  风速:Number(lib.WindSpeed),
                  image:`${setting.风雷达组网地图相关.反演风场=='风矢'?'arrow':'feather'}${getFeather(Math.abs(lib.WindSpeed))}`
                },
              })
            }
          })
        })
        map.getSource('inversionPPIData').setData(inversionPPIData)
        */
      }
    });
    (map.getSource("radar") as any).setData({
      type: "FeatureCollection",
      features: polygons,
    });
    (map.getSource("point") as any).setData(points.data);
  });
}
let circleDataFeatures = {
  type: "FeatureCollection",
  features: []
};
let pointDataFeatures:{type:string,features:Array<any>} = {
  type: "FeatureCollection",
  features: [],
};
function fetch最近风廓线数据(){
  getFkxRealData({radar_id:station.active,dateTime:moment().format('YYYYMMDDHHmmss'),num:6}).then((res=>{
    const v = new View(encoder.encode(res.data.data.file.file_data).buffer)
    let result:{[key:string]:any} = {HeaderInfo:{},data:[]}
    let firstLine = decoder.decode(v.getLine()).replace(/,\r\n$/,'').split(',')
    for(let i=1;i<firstLine.length;i++){
      let item = firstLine[i].split(':')
      if(item.length==2){
        result.HeaderInfo[item[0]] = item[1]
      }
    }
    let secondLine = decoder.decode(v.getLine()).replace(/,\r\n$/,'').split(',')
    while(!v.reachEnd()){
      let radial:{[key:string]:any} = {list:[]}
      let thirdLine = decoder.decode(v.getLine()).replace(/,\r\n$/,'').split(',')
      for(let i=0;i<9;i++){
        radial[secondLine[i]] = thirdLine[i]
      }
      for(let i=9;i<thirdLine.length;i+=9){
        radial.list.push({
          distance:Number(secondLine[i].split(' ')[0].substring(0,secondLine[i].split(' ')[0].length-1)),
          [secondLine[i+0].split(' ').slice(1).join(' ')]:Number(thirdLine[i+0]),
          [secondLine[i+1].split(' ').slice(1).join(' ')]:Number(thirdLine[i+1]),
          [secondLine[i+2].split(' ').slice(1).join(' ')]:Number(thirdLine[i+2]),
          [secondLine[i+3].split(' ').slice(1).join(' ')]:Number(thirdLine[i+3]),
          [secondLine[i+4].split(' ').slice(1).join(' ')]:Number(thirdLine[i+4]),
          [secondLine[i+5].split(' ').slice(1).join(' ')]:Number(thirdLine[i+5]),
          [secondLine[i+6].split(' ').slice(1).join(' ')]:Number(thirdLine[i+6]),
          [secondLine[i+7].split(' ').slice(1).join(' ')]:Number(thirdLine[i+7]),
          [secondLine[i+8].split(' ').slice(1).join(' ')]:Number(thirdLine[i+8]),
        })
      }
      result.data.push(radial)
    }
    bus.avgWindData_重庆 = result
  }))
}
onMounted(() => {
  stationMenu = stationMenuRef.value as HTMLDivElement;
  map = new mapboxgl.Map({
    container: mapRef.value,
    // style: raster,
    performanceMetricsCollection: false,
    style,
    dragRotate: false,
    touchRotate: false,
    touchPitch: false,
    dragPitch: false,
    // bounds: turf.bbox(boundaries),
    // localIdeographFontFamily: "Microsoft YoHei",
    localIdeographFontFamily: "",
    antialias: true,
    renderWorldCopies: true,
    // maxZoom: 17,
    maxZoom: 18,
    // minZoom: 1,
    maxBounds: [
      [102.0, 27.5],
      [114.0, 32.7],
    ],
    // zoom: 18,
    // center: [148.9819, -35.3981],
    // pitch: 60,
    zoom: setting.风雷达组网地图相关.zoom,
    center: setting.风雷达组网地图相关.center,
    pitch: 0,
  });
  marker = new mapboxgl.Marker({
      element: stationMenu,
      draggable: true,
      // pitchAlignment: "map",
      // rotationAlignment: "map",
      anchor: "top-left",
    })
      .setLngLat([0, 0])
      .setOffset([0, 0])
      .addTo(map);
  map.repaint = false;
  map.on("zoom", zoomFunc);
  map.on("move", moveFunc);
  map.on("load", loadFunc);
  map.on("mousedown", mousedownFunc);
  map.on("click", "stationLayer", clickFunc);
  eventbus.on("将站点移动到屏幕中心", flyTo);
  const closer = popup_closer.value;
  closer.onclick = function () {
    selected = null;
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
  map.on("contextmenu", "stationLayer", contextmenu);
});
onBeforeUnmount(() => {
  eventbus.off("将站点移动到屏幕中心", flyTo);
  clearInterval(timer);
  clearInterval(mock);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("load", loadFunc);
  map.off("click", "stationLayer", clickFunc);
  map.off("contextmenu", "stationLayer", contextmenu);
  map.off('mousedown',mousedownFunc)
  map.remove();
});
watch(isDark,isDark=>{
  if(isDark){
    map.setPaintProperty('等距环','line-color','white')
    map.setPaintProperty('等距环的单位','text-color','white')
    map.setPaintProperty('textLayer','text-color','white')
    map.setPaintProperty('idLayer','text-color','white')
    map.setPaintProperty('高度图层','text-color','white')
    map.setPaintProperty('垂直气流图层','text-color','white')
    map.setPaintProperty('风向图层','text-color','white')
    map.setPaintProperty('风速图层','text-color','white')
    map.setPaintProperty('时间图层','text-color','white')
    map.setPaintProperty('stationLayer','circle-stroke-color','white')
    points.data.features.forEach(feature=>{
      feature.properties.color = 'white'
    })
  }else{
    map.setPaintProperty('等距环','line-color','black')
    map.setPaintProperty('等距环的单位','text-color','black')
    map.setPaintProperty('textLayer','text-color','black')
    map.setPaintProperty('idLayer','text-color','black')
    map.setPaintProperty('高度图层','text-color','black')
    map.setPaintProperty('垂直气流图层','text-color','black')
    map.setPaintProperty('风向图层','text-color','black')
    map.setPaintProperty('风速图层','text-color','black')
    map.setPaintProperty('时间图层','text-color','black')
    map.setPaintProperty('stationLayer','circle-stroke-color','black')
    points.data.features.forEach(feature=>{
      feature.properties.color = 'black'
    })
  }
  // bus.avgWindData_重庆={}
  // work()
})
watch(()=>setting.风雷达组网地图相关.风场数据,风场数据=>{
  switch(风场数据){
    case '无':
      map.setLayoutProperty('雷达','visibility','none')
      chromatographyOption.arr=[]
      break;
    case '径向速度':
      map.setLayoutProperty('雷达','visibility','visible')
      chromatographyOption.arr = [-60,-48,-40,-32,-24,-16,-8,-0.5,0.5,8,16,24,32,40,48,60]
      break;
    case '谱宽':
      map.setLayoutProperty('雷达','visibility','visible')
      chromatographyOption.arr = [0,1,2,3,4,5,6,7,8,9,10]
      break;
    case '信噪比':
      map.setLayoutProperty('雷达','visibility','visible')
      chromatographyOption.arr = [0,2,4,6,8,10,12,14,16,18,20]
      break;
    case '频谱强度':
      map.setLayoutProperty('雷达','visibility','visible')
      chromatographyOption.arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      break;
    default:
      console.error('unknown 风场数据 '+风场数据)
      break;
  }
  nextTick(()=>{
    polygons.length=0;
    for(let radar_id in ppiData){
      let {result,position} = ppiData[radar_id]
      processData(result,position)
    }
    map.getSource("radar").setData({
      type: "FeatureCollection",
      features: polygons,
    });
  })
})
watch(()=>setting.风雷达组网地图相关.等距环,(val=>{
  if(val){
    map.setPaintProperty("等距环", "line-opacity", 0.3);
    map.setPaintProperty("等距环的单位", "text-opacity", 0.3);
  }else{
    map.setPaintProperty("等距环", "line-opacity", 0);
    map.setPaintProperty("等距环的单位", "text-opacity", 0);
  }
}))
watch(()=>setting.风雷达组网地图相关.高度,(val)=>{
  if(val){
    map.setPaintProperty("高度图层", "text-opacity", 1);
  }else{
    map.setPaintProperty("高度图层", "text-opacity", 0);
  }
})
watch(()=>setting.风雷达组网地图相关.风向,(val)=>{
  if(val){
    map.setPaintProperty("风向图层", "text-opacity", 1);
  }else{
    map.setPaintProperty("风向图层", "text-opacity", 0);
  }
})
watch(()=>setting.风雷达组网地图相关.风速,(val)=>{
  if(val){
    map.setPaintProperty("风速图层", "text-opacity", 1);
  }else{
    map.setPaintProperty("风速图层", "text-opacity", 0);
  }
})
watch(()=>setting.风雷达组网地图相关.垂直气流,(val)=>{
  if(val){
    map.setPaintProperty("垂直气流图层", "text-opacity", 1);
  }else{
    map.setPaintProperty("垂直气流图层", "text-opacity", 0);
  }
})
watch(()=>setting.风雷达组网地图相关.时间,(val)=>{
  if(val){
    map.setPaintProperty("时间图层", "text-opacity", 1);
  }else{
    map.setPaintProperty("时间图层", "text-opacity", 0);
  }
})
watch(
  () => setting.风雷达组网地图相关.relativeHeight,
  (rHeight) => {
    points.data.features = points.data.features.map((item:any) => {
      for(let radar_id in dbsData){
        if(item.properties.radar_id == radar_id){
          dbsData[radar_id].data.map((radial:any)=>{
            let lib = radial.list[rHeight-1];
            if(lib){
              points.data.features = points.data.features.map((item) => {
                if(item.properties.color!=='#f00'){
                  if(lib['WindSpeed']!==999){
                    if (item.properties.radar_id === radar_id) {
                      item.properties.风速 = Number(lib['WindSpeed'].toFixed(2));
                      item.properties.风向 = Number(lib['WindDirection'].toFixed(2));
                      item.properties.垂直气流 = lib['ZWind']<0?`\u2193${lib['ZWind'].toFixed(2)}`:`\u2191${lib['ZWind'].toFixed(2)}`
                      item.properties.高度 = lib['distance']
                      item.properties.时间 = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                      item.properties.image = "feather" + getFeather(lib['WindSpeed']);
                    }
                  }else{
                    if (item.properties.radar_id === radar_id) {
                      item.properties.风速 = NaN;
                      item.properties.风向 = NaN;
                      item.properties.垂直气流 = NaN
                      item.properties.高度 = lib['distance']
                      item.properties.时间 = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                      item.properties.image = "feather";
                    }
                  }
                }else{
                  if (item.properties.radar_id === radar_id) {
                    item.properties.风速 = NaN;
                    item.properties.风向 = NaN;
                    item.properties.垂直气流 = NaN
                    item.properties.高度 = NaN
                    item.properties.时间 = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                    item.properties.image = "feather";
                  }
                }
                return item
              });
            }else{
              points.data.features = points.data.features.map((item) => {
                if (item.properties.radar_id === radar_id) {
                  item.properties.风速 = NaN;
                  item.properties.风向 = NaN;
                  item.properties.垂直气流 = NaN
                  item.properties.高度 = NaN
                  item.properties.时间 = NaN
                  item.properties.image = "feather";
                }
                return item;
              });
            }
          })
        }
      }
      return item;
    });
    (map.getSource("point") as any).setData(points.data);
  }
);
watch(()=>setting.风雷达组网地图相关.反演风场,(val)=>{
  if(val=='无'){
    map.setLayoutProperty('inversionLayer','visibility','none')
  }else{
    map.setLayoutProperty('inversionLayer','visibility','visible')
    inversionPPIData.features.map((item:any)=>{
      item.properties.image = `${val=='风矢'?'arrow':'feather'}${getFeather(Math.abs(item.properties.风速))}`
      return item
    })
    if(val=='风矢'){
      map.setLayoutProperty('inversionLayer','icon-anchor',"top")
    }else{
      map.setLayoutProperty('inversionLayer','icon-anchor',["match", ["get", "风速"], 0, "center", "bottom-left"])
    }
    map.getSource('inversionPPIData').setData(inversionPPIData)
  }
})
// watch(
//   () => bus.风雷达组网地图相关雷达站点信息,
//   (newVal) => {
//     const data = newVal;
//     points.data.features = [];
//     for (let i = 0; i < data.length; i++) {
//       let color = "blue";
//       if (data[i].radar.data_status == false || data[i].radar.is_online == false) {
//         color = "red";
//       } else if (
//         data[i].compass_status == false ||
//         data[i].control_plate_status == false ||
//         data[i].edfa_status == false ||
//         data[i].external_status == false ||
//         data[i].gps_status == false ||
//         data[i].grabber_status == false
//       ) {
//         color = "orange";
//       } else {
//         color = "#0f0";
//       }
//       // console.log(data[i]);
//       points.data.features.push({
//         type: "Feature",
//         properties: {
//           type: "站点",
//           radar_id: data[i].radar.radar_id,
//           风速: speed,
//           time: data[i].data_time,
//           name: data[i].radar.name,
//           is_online: data[i].is_online,
//           external_temperature: data[i].external_temperature,
//           external_humidity: data[i].external_humidity,
//           image: "feather" + getFeather(speed),
//           color,
//         },
//         geometry: {
//           type: "Point",
//           coordinates: [data[i].longitude, data[i].latitude],
//         },
//       });
//     }
//     map.getSource("point").setData(points.data);
//   }
// );
watch(
  () => bus.avgWindData,
  (avgWindData) => {
    if (avgWindData) {
      data.length = 0;
      avgWindData.map((v) => {
        for (let k in v) {
          let radar_id = k;
          let list = v[k];
          //删除相关站点的风羽
          for (let i = 0; i < points.data.features.length; i++) {
            if (
              radar_id == points.data.features[i].properties.radar_id &&
              points.data.features[i].properties.type == "风羽"
            ) {
              points.data.features.splice(i--, 1);
            }
          }
          for (let i = 0; i < list.length; i++) {
            let data_time = list[i].data_time;
            let data_list = list[i].data_list;
            if (i == 0) {
              //计算风羽的位置并添加
              for (let i = 0; i < points.data.features.length; i++) {
                if (
                  radar_id == points.data.features[i].properties.radar_id &&
                  points.data.features[i].properties.type == "站点"
                ) {
                  const lngLat = points.data.features[i].geometry.coordinates;

                  data_list.map((item, k) => {
                    let ll = destinationPoint(
                      lngLat[0],
                      lngLat[1],
                      item.north_a,
                      Number(item.distance)
                    );
                    // item.center_h_direction_abs = Math.random() * 360;
                    // item.center_h_speed = Math.random() * 60;
                    if (
                      item.center_h_direction_abs != -1000 &&
                      item.center_h_speed != -1000
                    ) {
                      // points.data.features.push({
                      //   type: "Feature",
                      //   properties: {
                      //     type: "风羽",
                      //     radar_id: radar_id,
                      //     风速: item.center_h_speed,
                      //     image: "feather" + getFeather(item.center_h_speed),
                      //     风向: item.center_h_direction_abs,
                      //   },
                      //   geometry: {
                      //     type: "Point",
                      //     coordinates: [ll.lng, ll.lat],
                      //   },
                      // });

                      points.data.features.push({
                        type: "Feature",
                        properties: {
                          type: "风羽",
                          radar_id: radar_id,
                          风速: item.center_h_speed,
                          image: "feather" + getFeather(item.center_h_speed),
                          风向: item.center_h_direction_abs,
                        },
                        geometry: {
                          type: "Point",
                          coordinates: [ll.lng, ll.lat],
                        },
                      });
                    }
                  });
                  let source = map.getSource("point");
                  source && source.setData(points.data);
                }
              }
            }
          }
        }
      });
    }
  }
);
watch(
  () => setting.station,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("idLayer", "visibility", "visible");
      map.setLayoutProperty("stationLayer", "visibility", "visible");
      map.setLayoutProperty("featherLayer", "visibility", "visible");
      map.setLayoutProperty("textLayer", "visibility", "visible");
      map.setLayoutProperty("temperatureLayer", "visibility", "visible");
      map.setLayoutProperty("humidityLayer", "visibility", "visible");
      map.setLayoutProperty("垂直气流图层", "visibility", "visible");
      map.setLayoutProperty("高度图层", "visibility", "visible");
      map.setLayoutProperty("风向图层", "visibility", "visible");
      map.setLayoutProperty("风速图层", "visibility", "visible");
      map.setLayoutProperty("垂直气流图层", "visibility", "visible");
    } else {
      map.setLayoutProperty("idLayer", "visibility", "none");
      map.setLayoutProperty("stationLayer", "visibility", "none");
      map.setLayoutProperty("featherLayer", "visibility", "none");
      map.setLayoutProperty("textLayer", "visibility", "none");
      map.setLayoutProperty("humidityLayer", "visibility", "none");
      map.setLayoutProperty("temperatureLayer", "visibility", "none");
      map.setLayoutProperty("高度图层", "visibility", "none");
      map.setLayoutProperty("风向图层", "visibility", "none");
      map.setLayoutProperty("风速图层", "visibility", "none");
      map.setLayoutProperty("垂直气流图层", "visibility", "none");
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.站名,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("textLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("textLayer", "text-opacity", 0);
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.站号,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("idLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("idLayer", "text-opacity", 0);
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.factor[7].val,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("temperatureLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("temperatureLayer", "text-opacity", 0);
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.factor[9].val,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("humidityLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("humidityLayer", "text-opacity", 0);
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.checks[0].select,
  (newVal) => {
    if (newVal) {
      station.查询雷达列表接口({ user_id: route.query.user_id });
    } else {
      bus.风雷达组网地图相关雷达站点信息 = [];
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.checks[1].select,
  (newVal) => {
    if (newVal) {
      station.查询雷达在线列表接口({ user_id: route.query.user_id });
    } else {
      bus.风雷达组网地图相关雷达站点信息 = [];
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.checks[2].select,
  (newVal) => {
    if (newVal) {
      station.查询雷达离线列表接口({ user_id: route.query.user_id });
    } else {
      bus.风雷达组网地图相关雷达站点信息 = [];
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.checks[3].select,
  (newVal) => {
    if (newVal) {
      station.查询近期新增雷达列表接口({ user_id: route.query.user_id });
    } else {
      bus.风雷达组网地图相关雷达站点信息 = [];
    }
  }
);
watch(
  () => setting.district,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("districtLine", "visibility", "visible");
      map.setLayoutProperty("districtOutline", "visibility", "visible");
    } else {
      map.setLayoutProperty("districtLine", "visibility", "none");
      map.setLayoutProperty("districtOutline", "visibility", "none");
    }
  }
);
watch(
  () => setting.风雷达组网地图相关.ppiOpacity,
  (newVal) => {
    map.setPaintProperty("雷达", "fill-opacity", newVal);
  }
);
watch(
  () => setting.风雷达组网地图相关.mapOpacity,
  (newVal) => {
    map.setPaintProperty("simple-tiles", "raster-opacity", newVal);
  }
);
watch(
  () => setting.feather,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("featherLayer", "icon-opacity", 1);
    } else {
      map.setPaintProperty("featherLayer", "icon-opacity", 0);
    }
  }
);
</script>
<style scoped lang="scss">
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

.ol-popup {
  width: 340px;
  height: 280px;
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 5px;
  border-radius: 4px;
  border: 1px solid rgb(73, 208, 37);
  top: -15px;
  left: 10px;
  color: black;
  &:after,
  &:before {
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  &:after {
    border-right-color: rgb(73, 208, 37);
    border-width: 6px;
    top: 8px;
    left: -12px;
    margin-left: -0px;
  }
  &:before {
    border-right-color: rgb(73, 208, 37);
    border-width: 8px;
    top: 6px;
    left: -16px;
  }
  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 6px;
    right: 8px;
    &:after {
      color: var(--ep-color-primary);
      content: "✖";
    }
  }
  .title {
    line-height: 30px;
    color: white;
    font-size: 16px;
  }
  .latestTime {
    line-height: 30px;
    font-size: 10px;
    color: white;
  }
}
.right-drawer {
  z-index: 1;
  position: absolute;
  right: 0;
  width: 610px;
  box-sizing: border-box;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  transition: all 250ms;
  & > div > div {
    padding: 20px 10px;
    box-sizing: border-box;
  }
  & > div > div:nth-child(odd) {
    background: #eee;
  }
}
.dark .right-drawer {
  background-color: black;
  & > div > div:nth-child(odd) {
    background: #304156;
  }
  & > div > div:nth-child(even) {
    background: #252948;
  }
}
.disappear.right-drawer {
  transform: translateX(calc(100% + 28px));
  transition: all 250ms;
}
.mapboxgl-canvas:focus-visible {
  outline: none;
}
</style>
