<template>
  <div class="main-container" style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <div class="center"></div>
    <div
        v-resize="resize"
        ref="mapRef"
        class="map"
        style="
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      line-height: 1;
      outline: none;">
    </div>
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

    <el-scrollbar class="page-left">
      <baseLayer></baseLayer>
    </el-scrollbar>
    <el-scrollbar class="page-right">
      <currentStatusInfo></currentStatusInfo>
      <baseModule title="雷达图例">
        <legend-right></legend-right>
      </baseModule>
      <radar-info></radar-info>


      <div style="display: none">
        <!--      <div style="display:flex;flex-direction: column;overflow: auto; scroll-snap-type: none;height: 100%;">-->
        <!--        <chart-info></chart-info>-->
        <!--        <FKX></FKX>-->
        <!--        <chart-fkx v-if="hasPermission(['2353f2f5-b27b-473c-b281-4aa76858ff51'])"></chart-fkx>-->
        <!--        <chart-dom v-if="hasPermission(['aa0f5674-ca38-4987-9964-f232024f0992'])"></chart-dom>-->
        <!--        <chartDirection v-if="hasPermission(['ecd5d757-94eb-4b5e-9275-0ffb25a7cbc9'])"></chartDirection>-->
        <!--        <chartSpeed v-if="hasPermission(['d16bc38f-4b41-4294-b8e6-6230f7633120'])"></chartSpeed>-->
        <!--        <chartSNR v-if="hasPermission(['fc040225-820d-42f0-8e1a-239c9a76058a'])"></chartSNR>-->
        <!--        <chart-th v-if="hasPermission(['31aba6cc-6da7-432a-87a3-576e4d5f59f2'])"></chart-th>-->
        <!--      </div>-->
        <!--      <el-icon-->
        <!--        class="left&#45;&#45;29px z-999 bg-#eee dark:bg-#304156 dark:color-#888"-->
        <!--        style="-->
        <!--          font-size: 28px;-->
        <!--          position: absolute;-->
        <!--          border-bottom-left-radius: 50%;-->
        <!--          border-left: 1px solid grey;-->
        <!--          border-bottom: 1px solid grey;-->
        <!--        "-->
        <!--        @click="disappear"-->
        <!--      >-->
        <!--        <svg-->
        <!--          t="1695093760888"-->
        <!--          class="icon"-->
        <!--          viewBox="0 0 1024 1024"-->
        <!--          version="1.1"-->
        <!--          xmlns="http://www.w3.org/2000/svg"-->
        <!--          p-id="5105"-->
        <!--        >-->
        <!--          <path-->
        <!--            d="M557.397333 167.204571l293.059048 293.059048L902.192762 512l-51.712 51.712-293.059048 293.083429-51.736381-51.712L762.148571 548.571429H121.904762v-73.142858h640.243809L505.660952 218.940952l51.736381-51.736381z"-->
        <!--            p-id="5106"-->
        <!--          ></path>-->
        <!--        </svg>-->
        <!--      </el-icon>-->
      </div>

    </el-scrollbar>
    <div class="page-center-top">
      <Dialog></Dialog>
      <legend-left style="width:320px;"></legend-left>

    </div>
    <div class="page-center-bottom">
      <fkx-info></fkx-info>
      <TimeStep @change="TimeStepChange"></TimeStep>
    </div>

    <time-line
        v-if="hasPermission(['e44f37e1-f642-4dbf-83ca-052313b217f5'])"
        :data="data"
        @toLeft="change"
        @toRight="change"
        @toMiddle="change"
        v-model:now="setting.now"
        v-model:status="setting.status"
        v-model:level="setting.level"
        class="timeline absolute bottom-0"
    ></time-line>
    <!-- <graph
      v-if="checkPermission(['admin'])"
      class="absolute left-0 bottom-30px"
      v-model:args="graphArgs"
    ></graph> -->
    <!--  色标  -->
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
        <li @click="单站数据">单站历史数据</li>
      </ul>
    </div>
    <A0000 v-model="showHistory"></A0000>
  </div>
</template>
<script setup lang="ts">
import aimSvg from '~/assets/aim.svg?url'
import 镭测SVG from '~/assets/镭测.svg?url'
import 华航SVG from '~/assets/华航.svg?url'
import 西物SVG from '~/assets/西物.svg?url'
import 未知SVG from '~/assets/unknown.svg?url'
import {getMicapsData} from '../mapbox/data/plot/micaps.ts'
import plotUrl
  from '/CDL_S4000_Lidar10BQC07110410_PPI_FrmAzm0.00_ToAzm359.00_Pth15.00_Spd6.00_Res030_StartIdx002_VADStart002_VADStop190_VADWind_Sec_20250113 000000.000?url'
import TimeStep from '~/tools/timeStep.vue';
import A0000 from '../风雷达组网/pages/A0000.vue';
import FKX from './风廓线.vue';
import fkxInfo from './fkxInfo.vue'
import radarInfo from './radarInfo.vue'
import baseModule from './baseModule.vue'
import legendRight from './legendRight.vue'
import legendLeft from './legendLeft.vue'
import currentStatusInfo from './currentStatusInfo.vue'
import uvUrl from "../mapbox/data/06040808.000?url";
import CustomLayer from './CustomLayer.js'//绘制流线
import discreteContour from "./discreteContour.ts";//绘制等值线
import {isDark} from "~/theme"
import {useRouter} from "vue-router";

const router = useRouter()
const 单站数据 = () => {
  showHistory.value = true
  // router.replace('/cq/device/'+$(stationMenu).data().radar_id)
}
import chromatography from "../激光测风尾涡/chromatography.vue";
import * as turf from "@turf/turf";
// import ppiDataRaw from "../组网/CDL_S10000_Lidar10HKF00631450_PPI_FrmAzm30.00_ToAzm29.00_Pth3.00_Spd6.00_Res060_StartIdx003_Start003_Stop191_LOSWind_20230515 000240.csv?raw";//S10000
// import ppiDataRaw from "./level1/CDL_S4000_Lidar10BQC07110410_PPI_FrmAzm0.00_ToAzm359.00_Pth30.00_Spd6.00_Res030_StartIdx002_Start002_Stop190_LOSWind_20240715 203223.csv?raw";//S4000
// import ppiInversionData from "./level2/CDL_S4000_Lidar10BQC07110410_PPI_FrmAzm0.00_ToAzm359.00_Pth30.00_Spd6.00_Res030_StartIdx002_VADStart002_VADStop190_VADWind_Sec_20240715 203223.csv?raw";
import {exec} from "~/api/index.js";
import {getFkxRealData, getFkxData} from "../../api/重庆.ts";
import {
  hasPermission,
  sixty2Float,
  addFeatherImages,
  loadImage2Map,
  addArrowImages,
  getFeather,
  View,
  calculateBlockPoints,
  calculateCirclePoints,
  removeLayerAndSource
} from "~/tools";

const decoder = new TextDecoder('utf-8')
const encoder = new TextEncoder()
const stationMenuRef = ref<HTMLDivElement>();
let stationMenu: HTMLDivElement;
import {destinationPoint} from "~/myComponents/map/js/core.js";
import {watch, ref, onMounted, onBeforeUnmount, reactive, nextTick} from "vue";

const showHistory = ref(false)
import {useBus} from "~/myComponents/bus";
import Dialog from "./dialog.vue";
import {useSettingStore} from "~/stores/setting";

const setting = useSettingStore();
import {eventbus} from "~/eventbus";
//信噪比
const chromatographyOption = reactive<{ arr: Array<number> }>({
  arr: []
})
switch (setting.风雷达组网地图相关.风场数据) {
  case '不显示':
    chromatographyOption.arr = []
    break;
  case '径向速度':
    // chromatographyOption.arr = [-60,-48,-40,-32,-24,-16,-8,-0.5,0.5,8,16,24,32,40,48,60]
    chromatographyOption.arr = [-20, -18, -16, -14, -12, -10, -8, -6, -4, -2, -1, -0.5, 0.5, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    break;
  case '谱宽':
    chromatographyOption.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    break;
  case '信噪比':
    chromatographyOption.arr = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    break;
  case '频谱强度':
    chromatographyOption.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    break;
  default:
    console.error('unknown ' + setting.风雷达组网地图相关.风场数据)
    break;
}
const chromatographyRef = ref(null);
const Marker = mapboxgl.Marker;
const bus = useBus();
const graphArgs = reactive({
  fps: {value: 0, min: 0, max: 144, strokeStyle: "#ffffff88"},
  // memory: { value: 0, min: 0, max: 120, strokeStyle: "#0f0" },
});
const data = reactive([]);
let preTime = 0;
const change = (it: any) => {
  console.log(it)
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

let ppiData: { [key: string]: any } = {};
import {useStationStore} from "~/stores/station";
import chartTh from "~/myComponents/echarts/重庆_T_H.vue";
import chartDom from "~/myComponents/echarts/重庆_index.vue";
import chartFkx from "~/myComponents/echarts/重庆_fkx.vue";
import chartInfo from "~/myComponents/echarts/重庆_info.vue";
import chartSNR from "~/myComponents/echarts/重庆_SNR.vue";
import chartSpeed from "~/myComponents/echarts/重庆_Speed.vue";
import chartDirection from "~/myComponents/echarts/重庆_Direction.vue";
import {useRoute} from "vue-router";

const route = useRoute();
import baseLayer from "./baseLayer.vue"
import Legend from "./legend.vue";
import style from "./streets-v11.js";
import moment from "moment";
import {wgs84togcj02} from "../map/workers/mapUtil.js";

watch(() => setting.风雷达组网地图相关.particlesSize, () => {
  customLayer.setPointSize(setting.风雷达组网地图相关.particlesSize)
})
watch(() => setting.风雷达组网地图相关.particles, () => {
  customLayer.setParticles(setting.风雷达组网地图相关.particles)
})
let prevDate: any;
watch(
    () => setting.now,
    (newVal: any) => {
      if (newVal == undefined) {
        newVal = Date.now();
      }
      let strDate = moment(newVal).format('YYYYMMDD');
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
let map: mapboxgl.Map;
let mock;
let speed = 20;
const points = {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: new Array<any>(),
  },
};
const 风场数据 = {
  type: "geojson",
  data: {
    type: "FeatureCollection",
    features: new Array<any>(),
  },
};
const contextmenu = (e: any) => {
  if (e.features) {
    const fs = map.queryRenderedFeatures(e.point, {
      layers: ["stationLayer"],
    });

    if (!fs.length) {
      return;
    }
    const feature = fs[0];
    console.log([feature.properties.lon, feature.properties.lat])
    marker.setLngLat([feature.properties.lon, feature.properties.lat])
    $('.stationMenu').css({display: 'block'})
    $(stationMenu).removeData();
    $(stationMenu).data(feature.properties);
    // station.人影界面被选中的设备 = feature.properties.strID;
    // marker.setLngLat(feature.geometry.coordinates);
    // $(stationMenu).css({display:'block'});
    // $(stationMenu).removeData();
    // $(stationMenu).data(feature.properties);
  }
}
const mousedownFunc = () => {
  $(stationMenu).css({display: 'none'})
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
        station.currentStation = bus.风雷达组网地图相关雷达站点信息[i];
        points.data.features.forEach(item => {
          if (item.properties.radar_id == station.active) {
            item.properties.activedOpacity = 1.0
          } else {
            item.properties.activedOpacity = 0.0
          }
        })
        map.getSource("point").setData(points.data)
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
let inversionPPIData: { type: 'FeatureCollection', features: Array<any> } = {
  type: 'FeatureCollection',
  features: []
};

function processData(result: any, position: [number, number]) {
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
      let fillColor: string | null = 'black';
      switch (setting.风雷达组网地图相关.风场数据) {
        case '不显示':
          chromatographyOption.arr = []
          fillColor = 'black'
          break;
        case '径向速度':
          if (Math.abs(radial.list[i]["RadialWind(m/s)"]) === 999) {
            fillColor = null
          } else {
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
          console.error('unknown ' + setting.风雷达组网地图相关.风场数据)
          break;
      }
      if (fillColor) {
        polygons.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              calculateBlockPoints(
                  position,
                  (radial.list[i].distance - BinLength / 2) * Math.cos(Number(radial.Pitch) / 180 * Math.PI),
                  (radial.list[i].distance + BinLength / 2) * Math.cos(Number(radial.Pitch) / 180 * Math.PI),
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

let customLayer: any;
const loadFunc = async () => {
  await addFeatherImages(map, isDark.value ? '#fff' : '#000');
  await addArrowImages(map, isDark.value ? "#fff" : "#000");
  await loadImage2Map(map, aimSvg, 20, 20, {
    aim: {
      style: 'stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;',
    }
  })

  await loadImage2Map(map, 未知SVG, 12, 12, {
    未知SVG: {
      style: 'fill:#f00;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 镭测SVG, 14, 14, {
    镭测SVG_缺失: {
      style: 'fill:#F56C6C;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 镭测SVG, 14, 14, {
    镭测SVG_延迟: {
      style: 'fill:#E8CB1A;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 镭测SVG, 14, 14, {
    镭测SVG_正常: {
      style: 'fill:#3AC8A5;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 镭测SVG, 14, 14, {
    镭测SVG_未知: {
      style: 'fill:#909399;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 华航SVG, 12, 12, {
    华航SVG_缺失: {
      style: 'fill:#F56C6C;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 华航SVG, 12, 12, {
    华航SVG_延迟: {
      style: 'fill:#E8CB1A;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 华航SVG, 12, 12, {
    华航SVG_正常: {
      style: 'fill:#3AC8A5;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 华航SVG, 12, 12, {
    华航SVG_未知: {
      style: 'fill:#909399;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 西物SVG, 13, 13, {
    西物SVG_缺失: {
      style: 'fill:#F56C6C;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 西物SVG, 13, 13, {
    西物SVG_延迟: {
      style: 'fill:#E8CB1A;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 西物SVG, 13, 13, {
    西物SVG_正常: {
      style: 'fill:#3AC8A5;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
  await loadImage2Map(map, 西物SVG, 13, 13, {
    西物SVG_未知: {
      style: 'fill:#909399;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;stroke:black;stroke-width:1px;',
    }
  })
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
    layout: {
      visibility: setting.风雷达组网地图相关.风场数据 == '不显示' ? 'none' : 'visible'
    }
  });
  map.addSource('等距环Source', {type: 'geojson', data: circleDataFeatures})
  map.addLayer({
    id: "等距环",
    type: "line",
    source: '等距环Source',
    paint: {
      "line-opacity": setting.风雷达组网地图相关.等距环 ? 0.8 : 0,
      "line-color": isDark.value ? "#fff" : '#000',
      "line-width": 2,
      "line-dasharray": [2, 2],
    },
  });
  map.addSource('等距环的单位Source', {type: 'geojson', data: pointDataFeatures})
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
      "text-opacity": setting.风雷达组网地图相关.等距环 ? 0.8 : 0,
      "text-color": isDark.value ? "#fff" : '#000',
      // "text-halo-color": "black",
      // "text-halo-width": 1,
    },
  });
  map.addSource("inversionPPIData", {
    type: "geojson",
    data: inversionPPIData,
  })
  let anchor = ["match", ["get", "风速"], 0, "center", "bottom-left"]
  if (setting.风雷达组网地图相关.反演风场 == '风矢') {
    anchor = 'top'
  }
  map.addLayer({
    id: "inversionLayer",
    source: "inversionPPIData",
    type: "symbol",
    layout: {
      visibility: setting.风雷达组网地图相关.反演风场 === '不显示' ? "none" : "visible",
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
  map.addSource('风场数据', 风场数据)
  map.addLayer({
    id: "stationLayer",
    source: "point",
    type: "symbol",
    paint: {},
    filter: ["==", ["get", "type"], "站点"],
    layout: {
      "icon-image": ['get', '状态图标'],
      "icon-allow-overlap": true,
      visibility: setting.station ? "visible" : "none",
    },
  });
  map.addLayer({
    id: "actived",
    type: "symbol",
    source: 'point',
    filter: ["==", ["get", "type"], "站点"],
    layout: {
      "icon-image": 'aim',
      "icon-anchor": "bottom",
      "icon-allow-overlap": true,
      "icon-offset": [0, 3],
    },
    paint: {
      "icon-opacity": ['get', 'activedOpacity'],
    }
  });
  map.addLayer({
    id: "textLayer",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "name"],
      "text-font": ["simkai"],
      "text-size": 16,
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
      "text-color": isDark.value ? 'white' : '#23516d',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-size": 16,
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
      "text-color": isDark.value ? 'white' : '#23516d',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-color": isDark.value ? 'white' : 'black',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-color": isDark.value ? 'white' : 'black',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-offset": [-1, 0],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-opacity": setting.风雷达组网地图相关.高度 ? 1 : 0,
      "text-color": isDark.value ? 'white' : 'black',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-opacity": setting.风雷达组网地图相关.风向 ? 1 : 0,
      "text-color": isDark.value ? 'white' : 'black',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-opacity": setting.风雷达组网地图相关.风速 ? 1 : 0,
      "text-color": isDark.value ? 'white' : 'black',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-opacity": setting.风雷达组网地图相关.垂直气流 ? 1 : 0,
      "text-color": isDark.value ? 'white' : 'black',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "text-opacity": setting.风雷达组网地图相关.时间 ? 1 : 0,
      "text-color": isDark.value ? 'white' : 'black',
      "text-halo-width": 0.5,
      "text-halo-color": isDark.value ? 'black' : 'white',
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
      "icon-size": 0.7,
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
  map.addLayer({
    id: "风场图层",
    source: "风场数据",
    type: "symbol",
    layout: {
      visibility: setting.风雷达组网地图相关.风场 ? "visible" : "none",
      // This icon is a part of the Mapbox Streets style.
      // To view all images available in a Mapbox style, open
      // the style in Mapbox Studio and click the "Images" tab.
      // To add a new image to the style at runtime see
      // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
      "icon-anchor": ["match", ["get", "风速"], 0, "center", "bottom-left"],
      "icon-image": ["get", "image"],
      "icon-size": 0.5,
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
  bus.avgWindData = [];
  bus.secondWindData = [];
  bus.radialWindData = [];
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
    for (let i = 0; i < bus.风雷达组网地图相关雷达站点信息.length; i++) {
      if (bus.风雷达组网地图相关雷达站点信息[i].no == item.no) {
        station.active = bus.风雷达组网地图相关雷达站点信息[i].no;
        points.data.features.forEach(item => {
          if (item.properties.radar_id == station.active) {
            item.properties.activedOpacity = 1.0
          } else {
            item.properties.activedOpacity = 0.0
          }
        })
        map.getSource("point").setData(points.data)
        station.currentStation = bus.风雷达组网地图相关雷达站点信息[i];
        fetch最近风廓线数据()
      }
    }
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
    console.log({longitude: item.longitude, latitude: item.latitude});
    console.log(error);
  }
};
const resize = (entry) => {
  map && map.resize();
};
var marker: Marker;
import {databaseRaw, getPPIData, databaseRaw2} from '~/api/重庆'
import interpolate from "~/tools/idw.js";

let res: any
//得到雷达设备数据
const 雷达数据 = (data: any) => {
  res = data
  setting.风雷达组网地图相关.currentTime = moment(Math.floor(Date.now() / (1000 * 60 * 10)) * 1000 * 60 * 10).format('YYYYMMDDHHmmss')
  updateData(setting.风雷达组网地图相关.altitudeHeight)
}

function work() {
  updateData(setting.风雷达组网地图相关.altitudeHeight)
}

function TimeStepChange(timeString: string) {
  setting.风雷达组网地图相关.currentTime = moment(timeString, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDDHHmmss')
  work()
}

async function updateData(altitude: number) {
  //20240729054058
  await getFkxData({dataTime: setting.风雷达组网地图相关.currentTime, altitude}).then(result => {
    res.data[0].map((device: any, k: number) => {
      for (let key in result.data.data) {
        if (device.no === result.data.data[key].radar_id) {
          let timeStr = result.data.data[key].dataTime
          if (timeStr) {
            device.time = moment(timeStr, 'YYYY-MM-DD HH:mm:ss').format('HH:mm')
          } else {
            device.time = ''
          }
          res.data[0][k].wind = result.data.data[key]
        }
      }
    })
  })
  /*真实数据*/
  let data: Array<any> = []
  res.data[0].map((item: any) => {
    let convert = wgs84togcj02(sixty2Float(item.lng), sixty2Float(item.lat))
    //模拟开始
    // item.wind = {}
    // item.status = 1
    // item.wind.WindSpeed = 5*Math.random()
    // item.wind.WindDirection=360*Math.random()
    // item.wind.ZWind=(Math.random()-0.5)*4
    //模拟结束
    if (item.wind && item.wind.WindSpeed != null && item.wind.WindSpeed != 999) {
      data.push({
        lng: convert[0],
        lat: convert[1],
        speed: item.wind.WindSpeed,
        orientation: item.wind.WindDirection,
        ZWind: item.wind.ZWind,
      })
    }
  })
  /*模拟数据
  let convert1 = wgs84togcj02(sixty2Float('106°37′39″'),sixty2Float('29°44′28″'))
  let convert2 = wgs84togcj02(sixty2Float('106°26′36″'),sixty2Float('29°50′31″'))
  let convert3 = wgs84togcj02(sixty2Float('106°29′32″'),sixty2Float('29°20′28″'))
  let convert4 = wgs84togcj02(sixty2Float('106°38′55″'),sixty2Float('29°00′36″'))
  let convert5 = wgs84togcj02(sixty2Float('108°24′50″'),sixty2Float('30°48′12″'))
  let convert6 = wgs84togcj02(sixty2Float('108°39′48″'),sixty2Float('31°56′40″'))
  let data = [
    {lng:convert1[0],lat:convert1[1],speed:Number((20*Math.random()).toFixed(2)),orientation:360*Math.random()},
    {lng:convert2[0],lat:convert2[1],speed:Number((20*Math.random()).toFixed(2)),orientation:360*Math.random()},
    {lng:convert3[0],lat:convert3[1],speed:Number((20*Math.random()).toFixed(2)),orientation:360*Math.random()},
    {lng:convert4[0],lat:convert4[1],speed:Number((20*Math.random()).toFixed(2)),orientation:360*Math.random()},
    {lng:convert5[0],lat:convert5[1],speed:Number((20*Math.random()).toFixed(2)),orientation:360*Math.random()},
    {lng:convert6[0],lat:convert6[1],speed:Number((20*Math.random()).toFixed(2)),orientation:360*Math.random()},

    // {lng:convert1[0],lat:convert1[1],speed:4.18,orientation:259},
    // {lng:convert2[0],lat:convert2[1],speed:2.985,orientation:209},
    // {lng:convert3[0],lat:convert3[1],speed:4.234,orientation:235.83},
    // {lng:convert4[0],lat:convert4[1],speed:1.312,orientation:349},
    // {lng:convert5[0],lat:convert5[1],speed:4.706,orientation:200.173},
    // {lng:convert6[0],lat:convert6[1],speed:5,orientation:0},
  ];*/
  discreteContour(map, data, {
    isobands: setting.风雷达组网地图相关.等值带,
    isolines: setting.风雷达组网地图相关.等值线,
    gridValue: setting.风雷达组网地图相关.格点,
    discrete: false
  })
  /*let source = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: Array<any>(),
    },
  };
  data.map((item:any)=>{
    source.data.features.push({
      type: "Feature",
      properties: {
        altitude:NaN,
        radar_id:'',
        风速: item.speed,
        image: "feather" + getFeather(item.speed),
        风向: item.orientation,
        高度:NaN,
        垂直气流:NaN,
        时间:NaN,
        color:isDark.value?'#fff':'#000'
      },
      geometry: {
        type: "Point",
        coordinates: [item.lng, item.lat],
      },
    })
  })
  map.addLayer({
    id: "tmpLayer",
    source: source as any,
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
  });*/
  let interpolateOptions = {
    sizeU: 80,
    sizeV: 80,
    boundary: {
      lng: 110,
      lat: 34.48,
      width: 114.75 - 110,
      height: 40.83 - 34.48,
    },
    power: 6,
  };
  let data1 = data.map((item: any) => {
    return {lng: item.lng, lat: item.lat, value: -item.speed * Math.sin(item.orientation / 180 * Math.PI)}
  })
  let grid1 = interpolate(data1, interpolateOptions)
  let us: number[] = []
  for (let j = 0; j < interpolateOptions.sizeV; j++) {
    for (let i = 0; i < interpolateOptions.sizeU; i++) {
      us.push(grid1[j][i])
    }
  }

  let data2 = data.map((item: any) => {
    return {lng: item.lng, lat: item.lat, value: -item.speed * Math.cos(item.orientation / 180 * Math.PI)}
  })
  let grid2 = interpolate(data2, interpolateOptions)
  let vs: number[] = []
  for (let j = 0; j < interpolateOptions.sizeV; j++) {
    for (let i = 0; i < interpolateOptions.sizeU; i++) {
      vs.push(grid2[j][i])
    }
  }

  风场数据.data.features.length = 0;
  for (let j = 0; j < grid1.length; j++) {
    for (let i = 0; i < grid1[j].length; i++) {
      const position = [
        interpolateOptions.boundary.lng + i * interpolateOptions.boundary.width / (interpolateOptions.sizeU - 1),
        interpolateOptions.boundary.lat + j * interpolateOptions.boundary.height / (interpolateOptions.sizeV - 1),
      ]
      const 风速 = Math.sqrt(grid1[j][i] ** 2 + grid2[j][i] ** 2)
      风场数据.data.features.push({
        type: "Feature",
        properties: {
          风速,
          风向: -Math.atan2(grid1[j][i], -grid2[j][i]) * 180 / Math.PI,
          image: "feather" + getFeather(风速),
          color: isDark.value ? '#fff' : '#000',
        },
        geometry: {
          type: "Point",
          coordinates: position,
        },
      })
    }
  }
  (map.getSource('风场数据') as any)?.setData(风场数据.data)

  const uMin = Math.min(...us);
  let uMax = Math.max(...us);
  const vMin = Math.min(...vs);
  let vMax = Math.max(...vs);
  let maxSpeed = 20
  vMax = Math.sqrt(Math.pow(maxSpeed, 2) / 2)
  uMax = Math.sqrt(Math.pow(maxSpeed, 2) / 2)
  let cvs = document.createElement('canvas')
  cvs.width = interpolateOptions.sizeU
  cvs.height = interpolateOptions.sizeV
  let ctx = cvs.getContext('2d')!
  let imgData = ctx.getImageData(0, 0, cvs.width, cvs.height)
  for (let y = 0; y < imgData.height; y++) {
    for (let x = 0; x < imgData.width; x++) {
      let i = 4 * (y * imgData.width + x)
      imgData.data[i + 0] = (us[imgData.width * (imgData.height - y - 1) + x] - uMin) / (uMax - uMin) * 255
      imgData.data[i + 1] = (vs[imgData.width * (imgData.height - y - 1) + x] - vMin) / (vMax - vMin) * 255
      imgData.data[i + 2] = 0
      imgData.data[i + 3] = 255
    }
  }
  ctx.putImageData(imgData, 0, 0)
  let json = {
    "source": "http://nomads.ncep.noaa.gov",
    "date": "2016-11-20T00:00Z",
    "width": cvs.width,
    "height": cvs.height,
    "uMin": uMin,
    "uMax": uMax,
    "vMin": vMin,
    "vMax": vMax,
    "boundaries": [interpolateOptions.boundary.lng, interpolateOptions.boundary.lng + interpolateOptions.boundary.width, interpolateOptions.boundary.lat, interpolateOptions.boundary.lat + interpolateOptions.boundary.height],
    // "boundaries":[105,111,28,32.5]
  }
  // mapboxgl.clearStorage();
  removeLayerAndSource(map, 'null-island')
  customLayer = new CustomLayer(json, cvs.toDataURL(), setting.风雷达组网地图相关.流线, setting.风雷达组网地图相关.particles)
  customLayer.setPointSize(setting.风雷达组网地图相关.particlesSize)
  map.addLayer(customLayer as any)

  bus.风雷达组网地图相关雷达站点信息 = res.data[0].map((item: any) => {
    let pos = wgs84togcj02(sixty2Float(item.lng), sixty2Float(item.lat)) as [number, number]
    return Object.assign(item, {longitude: pos[0], latitude: pos[1]})
  });
  points.data.features.length = 0;
  circleDataFeatures.features.length = 0
  pointDataFeatures.features.length = 0
  inversionPPIData.features.length = 0
  polygons.length = 0;
  res.data[0].map((Item: any) => {
    if (Item.hide !== 'true') {
      let radar_id = Item.no
      //如果之前有设备被选中，应该获取一次最近风廓线数据
      if (Item.no == station.active) {
        fetch最近风廓线数据()
      }
      let position = [Item.longitude, Item.latitude]
      const getStatusImage = (status: number) => {
        if (Item.manufacturer.includes('华航')) {
          return status == 1 ? '华航SVG_正常' : status == 2 ? '华航SVG_延迟' : status == 3 ? '华航SVG_缺失' : '华航SVG_未知'
        } else if (Item.manufacturer.includes('镭测')) {
          return status == 1 ? '镭测SVG_正常' : status == 2 ? '镭测SVG_延迟' : status == 3 ? '镭测SVG_缺失' : '镭测SVG_未知'
        } else if (Item.manufacturer.includes('西物')) {
          return status == 1 ? '西物SVG_正常' : status == 2 ? '西物SVG_延迟' : status == 3 ? '西物SVG_缺失' : '西物SVG_未知'
        }
        return '未知SVG'
      }
      //初始状态
      points.data.features.push({
        type: "Feature",
        properties: {
          altitude: Number(Item.altitude),
          lon: position[0],
          lat: position[1],
          type: "站点",
          radar_id: Item.no,
          高度: "",
          风速: NaN,
          风向: 0,
          垂直气流: "",
          时间: NaN,
          time: moment().format("YYYY-MM-DD HH:mm:ss"),
          name: Item.device_name.replace('国家基本气象站', '').replace('国家气象观测站', '').replace('国家基准气候站', ''),
          is_online: true,
          external_temperature: 25,
          external_humidity: 0.6,
          image: "feather" + getFeather(0),
          状态图标: getStatusImage(Item.status),
          activedOpacity: Item.no == station.active ? 1.0 : 0.0,
        },
        geometry: {
          type: "Point",
          coordinates: position,
        },
      });
      //绘制等距环
      for (let i = 1; i <= 6; i++) {
        let circle = calculateCirclePoints(position, i * 1000, 64, 'meters');
        circleDataFeatures.features.push({
          type: 'Feature',
          geometry: {
            type: "Polygon",
            coordinates: [circle],
          },
        });

        if (i == 1 || i == 3 || i == 6) {
          let pts: any = [];
          const pt1 = turf.destination(
              turf.point(position),
              1000 * i,
              0,
              {units: "meters"}
          );
          const pt2 = turf.destination(
              turf.point(position),
              1000 * i,
              90,
              {units: "meters"}
          );
          const pt3 = turf.destination(
              turf.point(position),
              1000 * i,
              180,
              {units: "meters"}
          );
          const pt4 = turf.destination(
              turf.point(position),
              1000 * i,
              270,
              {units: "meters"}
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
      getPPIData({radar_id: Item.no, dataTime: setting.风雷达组网地图相关.currentTime}, 1).then(res => {
        // getPPIData({radar_id:Item.no,dataTime:'20240716105055'},1).then(res=>{
        if (res.data.code == 200) {
          //绘制PPI
          /*S10000
          const d = new TextDecoder("utf8");
          let v = new View(this.response),
            result: { [key: string]: any } = {};
          let firstLine = d
            .decode(v.getLine())
            .trim()
            .replace(/,$/, "")
            .split(",");
          let secondLine = d
            .decode(v.getLine())
            .trim()
            .replace(/,$/, "")
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
              .trim()
              .replace(/,$/, "")
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
          /* S4000 */
          const d = new TextDecoder("utf8");
          // let v = new View(encoder.encode(ppiDataRaw).buffer)
          let v = new View(encoder.encode(res.data.data.file.file_data).buffer);
          let result: { [key: string]: any } = {};
          let firstLine = d.decode(v.getLine()).trim().replace(/,$/, "").split(",");
          result.HeaderInfo = {};
          for (let i = 1; i < firstLine.length; i++) {
            let kv = firstLine[i].split(":");
            if (kv.length == 2) {
              result.HeaderInfo[kv[0]] = kv[1]
            }
          }
          let secondLine = d.decode(v.getLine()).trim().replace(/,$/, "").split(",");
          let data: Array<any> = (result.data = []);
          while (!v.reachEnd()) {
            let thirdLine = d.decode(v.getLine()).trim().replace(/,$/, "").split(",");
            let radial: { [key: string]: any } = {Azimuth: 0, list: new Array<any>()};
            for (let i = 0; i < 11; i++) {
              radial[secondLine[i]] = thirdLine[i]
            }
            radial.Azimuth = Number(radial.Azimuth);
            //用于确保两根径向之间夹角不大于180度
            if (data.length > 0) {
              let lastItem = data[data.length - 1];
              if (Math.abs(Item.Azimuth - lastItem.Azimuth) > 180) {
                // item.Azimuth = 360 + item.Azimuth;
                Item.Azimuth =
                    lastItem.Azimuth +
                    (360 - (Math.abs(Item.Azimuth - lastItem.Azimuth) % 360));
              }
            }
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
          ppiData[radar_id] = {result, position}
          result.data = result.data.slice(1)//由于第一条径向和第二条径向之间方位角跨度太大，鼠标选取会出现异常（所以删除第一条径向）
          processData(result, position);
          // let tmp = {
          //   type: "geojson",
          //   data: {
          //     type: "FeatureCollection",
          //     features: polygons,
          //   },
          // };
          // console.log(tmp);
          (map.getSource("radar") as any).setData({
            type: "FeatureCollection",
            features: polygons,
          });
        }
      })
      getPPIData({radar_id: Item.no, dataTime: setting.风雷达组网地图相关.currentTime}, 2).then(res => {
        // getPPIData({radar_id:Item.no,dataTime:'20240716105055'},2).then(res=>{
        if (res.data.code == 200) {
          /* PPI反演风场 */
          let inversionResult: { [key: string]: any } = {HeaderInfo: {}}
          const view = new View(encoder.encode(res.data.data.file.file_data).buffer)
          let firstLine = decoder.decode(view.getLine()).trim().replace(/,$/, "").split(",");
          for (let i = 1; i < firstLine.length; i++) {
            let item = firstLine[i].split(':')
            if (item.length == 2) {
              inversionResult.HeaderInfo[item[0]] = item[1]
            }
          }
          let secondLine = decoder.decode(view.getLine()).trim().replace(/,$/, "").split(",");
          inversionResult.data = []
          while (!view.reachEnd()) {
            let radial: { [key: string]: any } = {list: []}
            let thirdLine = decoder.decode(view.getLine()).trim().replace(/,$/, "").split(",");
            for (let i = 0; i < 12; i++) {
              radial[secondLine[i]] = thirdLine[i]
            }
            for (let i = 12; i < thirdLine.length; i += 4) {
              radial.list.push({
                distance: Number(secondLine[i].split(' ')[0].substring(0, secondLine[i].split(' ')[0].length - 1)),
                [secondLine[i + 0].split(' ')[1]]: Number(thirdLine[i + 0]),
                [secondLine[i + 1].split(' ')[1]]: Number(thirdLine[i + 1]),
                [secondLine[i + 2].split(' ')[1]]: Number(thirdLine[i + 2]),
                [secondLine[i + 3].split(' ')[1]]: Number(thirdLine[i + 3]),
              })
            }
            inversionResult.data.push(radial)
          }
          inversionResult.data.map((radial: any) => {
            radial.list.map((lib: any) => {
              if (lib.WindSpeed !== 999) {
                const pt = turf.destination(
                    turf.point(position),
                    lib.distance / Math.tan(Number(radial.Pitch) / 180 * Math.PI),
                    Number(radial.Azimuth),
                    {units: "meters"}
                );
                inversionPPIData.features.push({
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: pt.geometry?.coordinates,
                  },
                  properties: {
                    风向: Number(lib.WindDirection),
                    风速: Number(lib.WindSpeed),
                    image: `${setting.风雷达组网地图相关.反演风场 == '风矢' ? 'arrow' : 'feather'}${getFeather(Math.abs(lib.WindSpeed))}`
                  },
                })
              }
            })
          })
          map.getSource('inversionPPIData').setData(inversionPPIData)
        }
      })
      let time = moment()
      setting.风雷达组网地图相关.请求时间 = time.format("HH:mm:ss")
      let lib = Item.wind
      if (lib) {
        points.data.features = points.data.features.map((item) => {
          if (item.properties.radar_id === radar_id) {
            if (lib['WindSpeed'] !== 999 && lib['WindSpeed'] != null) {
              item.properties.风速 = Number(lib['WindSpeed'].toFixed(2));
              item.properties.风向 = Number(lib['WindDirection'].toFixed(2));
              item.properties.垂直气流 = lib['ZWind'] < 0 ? `\u2193${lib['ZWind'].toFixed(2)}` : `\u2191${lib['ZWind'].toFixed(2)}`
              item.properties.高度 = (Number(lib['altitude'])).toFixed(2)
              item.properties.时间 = lib['dataTime']
              item.properties.image = "feather" + getFeather(lib['WindSpeed']);
            } else {
              item.properties.风速 = NaN;
              item.properties.风向 = 0;
              item.properties.垂直气流 = ""
              item.properties.高度 = (Number(lib['altitude'])).toFixed(2)
              item.properties.时间 = lib['dataTime']
              item.properties.image = "feather";
            }
          }
          return item
        });
      } else {
        points.data.features = points.data.features.map((item) => {
          if (item.properties.radar_id === radar_id) {
            item.properties.风速 = NaN;
            item.properties.风向 = 0;
            item.properties.垂直气流 = ""
            item.properties.高度 = ""
            item.properties.时间 = NaN
            item.properties.image = "feather";
          }
          return item;
        });
      }
    }
  });
  (map.getSource('等距环的单位Source') as any)?.setData(pointDataFeatures);
  (map.getSource('等距环Source') as any)?.setData(circleDataFeatures);
  (map.getSource("point") as any)?.setData(points.data);

  // getMicapsData(plotUrl).then((result:any)=>{
  //   const beginLng = result.beginLng
  //   const beginLat = result.beginLat
  //   const endLng = result.endLng
  //   const endLat = result.endLat
  //   const lngCount = result.lngCount
  //   const latCount = result.latCount
  //   let dLng = (endLng-beginLng)/(lngCount-1)
  //   let dLat = (endLat-beginLat)/(latCount-1)
  //   for(let j=0;j<latCount;j++){
  //     for(let i=0;i<lngCount;i++){
  //       let index = j*lngCount+i
  //       let u = result.data.slice(0,result.data.length/2)
  //       let v = result.data.slice(result.data.length/2,result.data.length)
  //       let value = [u[index],v[index]]
  //       let speed = Math.sqrt(Math.pow(value[0],2)+Math.pow(value[1],2))
  //       let pt = wgs84togcj02(beginLng+i*dLng,beginLat+j*dLat)
  //       inversionPPIData.features.push({
  //         type: "Feature",
  //         geometry: {
  //           type: "Point",
  //           coordinates: pt,
  //         },
  //         properties: {
  //           风向:Math.atan2(value[0],value[1])*180/Math.PI,
  //           风速:Number(speed),
  //           image:`${setting.风雷达组网地图相关.反演风场=='风矢'?'arrow':'feather'}${getFeather(speed)}`
  //         },
  //       })
  //     }
  //   }
  //   map.getSource('inversionPPIData').setData(inversionPPIData)
  //   console.log(result)
  // })
}

let circleDataFeatures = {
  type: "FeatureCollection",
  features: []
};
let pointDataFeatures: { type: string, features: Array<any> } = {
  type: "FeatureCollection",
  features: [],
};

function fetch最近风廓线数据() {
  getFkxRealData({radar_id: station.active, dateTime: setting.风雷达组网地图相关.currentTime, num: 6}).then((res => {
    const v = new View(encoder.encode(res.data.data.file.file_data).buffer)
    let result: { [key: string]: any } = {HeaderInfo: {}, data: []}
    let firstLine = decoder.decode(v.getLine()).trim().replace(/,$/, '').split(',')
    for (let i = 1; i < firstLine.length; i++) {
      let item = firstLine[i].split(':')
      if (item.length == 2) {
        result.HeaderInfo[item[0]] = item[1]
      }
    }
    let secondLine = decoder.decode(v.getLine()).trim().replace(/,$/, '').split(',')
    while (!v.reachEnd()) {
      let radial: { [key: string]: any } = {list: []}
      let thirdLine = decoder.decode(v.getLine()).trim().replace(/,$/, '').split(',')
      for (let i = 0; i < 9; i++) {
        radial[secondLine[i]] = thirdLine[i]
      }
      for (let i = 9; i < secondLine.length; i += 9) {
        radial.list.push({
          distance: Number(secondLine[i].split(' ')[0].substring(0, secondLine[i].split(' ')[0].length - 1)),
          [secondLine[i + 0].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 0]),
          [secondLine[i + 1].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 1]),
          [secondLine[i + 2].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 2]),
          [secondLine[i + 3].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 3]),
          [secondLine[i + 4].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 4]),
          [secondLine[i + 5].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 5]),
          [secondLine[i + 6].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 6]),
          [secondLine[i + 7].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 7]),
          [secondLine[i + 8].split(' ').slice(1).join(' ')]: Number(thirdLine[i + 8]),
        })
      }
      result.data.push(radial)
    }
    bus.avgWindData_重庆 = result
    eventbus.emit('处理实时风廓线数据', {radar_id: station.active, 风廓线数据: res.data.data.file.file_data})
  })).catch((err) => {
    eventbus.emit('清除风廓线数据')
    bus.avgWindData_重庆 = {data:[{list:[]}]}
  })
}

onMounted(() => {
  stationMenu = stationMenuRef.value as HTMLDivElement;
  map = new mapboxgl.Map({
    container: mapRef.value as any,
    // style: raster,
    style: style as any,
    // dragRotate: false,
    // touchRotate: false,
    // touchPitch: false,
    // dragPitch: false,
    projection: 'mercator', // globe
    // bounds: turf.bbox(boundaries),
    // localIdeographFontFamily: "Microsoft YoHei",
    localIdeographFontFamily: "",
    antialias: true,
    renderWorldCopies: true,
    maxZoom: 17,
    // minZoom: 1,
    // maxBounds: [
    //   [104.0, 32.5],
    //   [121.0, 42.7],
    // ],
    // zoom: 18,
    // center: [148.9819, -35.3981],
    // pitch: 60,
    zoom: setting.风雷达组网地图相关.zoom,
    center: setting.风雷达组网地图相关.center as any,
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
  eventbus.on("风雷达组网-将站点移动到屏幕中心", flyTo);
  eventbus.on("风雷达组网-设备数据", 雷达数据)
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
  eventbus.off("风雷达组网-设备数据", 雷达数据)
  clearInterval(mock);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("load", loadFunc);
  map.off("click", "stationLayer", clickFunc);
  map.off("contextmenu", "stationLayer", contextmenu);
  map.off('mousedown', mousedownFunc)
  removeLayerAndSource(map, 'null-island')
  map.remove();
  mapboxgl.clearStorage();
});
watch(isDark, () => {
  addFeatherImages(map, isDark.value ? '#fff' : '#000');
  if (isDark.value) {
    map.setPaintProperty('等距环', 'line-color', 'white')
    map.setPaintProperty('等距环的单位', 'text-color', 'white')
    map.setPaintProperty('textLayer', 'text-color', 'white')
    map.setPaintProperty('textLayer', 'text-halo-color', 'black')
    map.setPaintProperty('idLayer', 'text-color', 'white')
    map.setPaintProperty('idLayer', 'text-halo-color', 'black')
    map.setPaintProperty('高度图层', 'text-color', 'white')
    map.setPaintProperty('高度图层', 'text-halo-color', 'black')
    map.setPaintProperty('垂直气流图层', 'text-color', 'white')
    map.setPaintProperty('垂直气流图层', 'text-halo-color', 'black')
    map.setPaintProperty('风向图层', 'text-color', 'white')
    map.setPaintProperty('风向图层', 'text-halo-color', 'black')
    map.setPaintProperty('风速图层', 'text-color', 'white')
    map.setPaintProperty('风速图层', 'text-halo-color', 'black')
    map.setPaintProperty('时间图层', 'text-color', 'white')
    map.setPaintProperty('时间图层', 'text-halo-color', 'black')
    map.setPaintProperty('districtLineBase', 'line-color', '#fff')
    map.setPaintProperty('districtOutlineBase', 'line-color', '#fff')
    points.data.features.forEach(feature => {
      if (feature.properties.color == '#000') {
        feature.properties.color = '#fff'
      }
    })
  } else {
    map.setPaintProperty('等距环', 'line-color', 'black')
    map.setPaintProperty('等距环的单位', 'text-color', 'black')
    map.setPaintProperty('textLayer', 'text-color', 'black')
    map.setPaintProperty('textLayer', 'text-halo-color', 'white')
    map.setPaintProperty('idLayer', 'text-color', 'black')
    map.setPaintProperty('idLayer', 'text-halo-color', 'white')
    map.setPaintProperty('textLayer', 'text-halo-color', 'white')
    map.setPaintProperty('高度图层', 'text-color', 'black')
    map.setPaintProperty('高度图层', 'text-halo-color', 'white')
    map.setPaintProperty('垂直气流图层', 'text-color', 'black')
    map.setPaintProperty('垂直气流图层', 'text-halo-color', 'white')
    map.setPaintProperty('风向图层', 'text-color', 'black')
    map.setPaintProperty('风向图层', 'text-halo-color', 'white')
    map.setPaintProperty('风速图层', 'text-color', 'black')
    map.setPaintProperty('风速图层', 'text-halo-color', 'white')
    map.setPaintProperty('时间图层', 'text-color', 'black')
    map.setPaintProperty('时间图层', 'text-halo-color', 'white')
    map.setPaintProperty('districtLineBase', 'line-color', '#000')
    map.setPaintProperty('districtOutlineBase', 'line-color', '#000')
    points.data.features.forEach(feature => {
      if (feature.properties.color == '#fff') {
        feature.properties.color = '#000'
      }
    })
  }
  (map.getSource("point") as any).setData(points.data);
  // bus.avgWindData_重庆={}
  // work()
})
watch(() => setting.风雷达组网地图相关.风场数据, 风场数据 => {
  switch (风场数据) {
    case '不显示':
      map.setLayoutProperty('雷达', 'visibility', 'none')
      chromatographyOption.arr = []
      break;
    case '径向速度':
      map.setLayoutProperty('雷达', 'visibility', 'visible')
      // chromatographyOption.arr = [-60,-48,-40,-32,-24,-16,-8,-0.5,0.5,8,16,24,32,40,48,60]
      chromatographyOption.arr = [-20, -18, -16, -14, -12, -10, -8, -6, -4, -2, -1, -0.5, 0.5, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
      break;
    case '谱宽':
      map.setLayoutProperty('雷达', 'visibility', 'visible')
      chromatographyOption.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      break;
    case '信噪比':
      map.setLayoutProperty('雷达', 'visibility', 'visible')
      chromatographyOption.arr = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
      break;
    case '频谱强度':
      map.setLayoutProperty('雷达', 'visibility', 'visible')
      chromatographyOption.arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      break;
    default:
      console.error('unknown 风场数据 ' + 风场数据)
      break;
  }
  nextTick(() => {
    polygons.length = 0;
    for (let radar_id in ppiData) {
      let {result, position} = ppiData[radar_id]
      processData(result, position)
    }
    map.getSource("radar").setData({
      type: "FeatureCollection",
      features: polygons,
    });
  })
})
watch(() => setting.风雷达组网地图相关.等距环, (val => {
  if (val) {
    map.setPaintProperty("等距环", "line-opacity", 0.8);
    map.setPaintProperty("等距环的单位", "text-opacity", 0.8);
  } else {
    map.setPaintProperty("等距环", "line-opacity", 0);
    map.setPaintProperty("等距环的单位", "text-opacity", 0);
  }
}))
watch(() => setting.风雷达组网地图相关.等值线, (val) => {
  if (val) {
    map.setLayoutProperty("等值线", "visibility", 'visible');
    map.setLayoutProperty("等值线值", "visibility", 'visible');
  } else {
    map.setLayoutProperty("等值线", "visibility", 'none');
    map.setLayoutProperty("等值线值", "visibility", 'none');
  }
})
watch(() => setting.风雷达组网地图相关.等值带, (val) => {
  if (val) {
    map.setLayoutProperty("等值带", "visibility", 'visible');
  } else {
    map.setLayoutProperty("等值带", "visibility", 'none');
  }
})
watch(() => setting.风雷达组网地图相关.格点, (val) => {
  if (val) {
    map.setLayoutProperty("网格点", "visibility", 'visible');
    map.setLayoutProperty("网格值", "visibility", 'visible');
  } else {
    map.setLayoutProperty("网格点", "visibility", 'none');
    map.setLayoutProperty("网格值", "visibility", 'none');
  }
})
watch(() => setting.风雷达组网地图相关.风场, (val) => {
  if (val) {
    map.setLayoutProperty("风场图层", "visibility", 'visible');
  } else {
    map.setLayoutProperty("风场图层", "visibility", 'none');
  }
})
watch(() => setting.风雷达组网地图相关.流线, (val) => {
  if (val) {
    customLayer.show = true
    map.triggerRepaint()
  } else {
    customLayer.show = false
  }
})
watch(() => setting.风雷达组网地图相关.高度, (val) => {
  if (val) {
    map.setPaintProperty("高度图层", "text-opacity", 1);
  } else {
    map.setPaintProperty("高度图层", "text-opacity", 0);
  }
})
watch(() => setting.风雷达组网地图相关.风向, (val) => {
  if (val) {
    map.setPaintProperty("风向图层", "text-opacity", 1);
  } else {
    map.setPaintProperty("风向图层", "text-opacity", 0);
  }
})
watch(() => setting.风雷达组网地图相关.风速, (val) => {
  if (val) {
    map.setPaintProperty("风速图层", "text-opacity", 1);
  } else {
    map.setPaintProperty("风速图层", "text-opacity", 0);
  }
})
watch(() => setting.风雷达组网地图相关.垂直气流, (val) => {
  if (val) {
    map.setPaintProperty("垂直气流图层", "text-opacity", 1);
  } else {
    map.setPaintProperty("垂直气流图层", "text-opacity", 0);
  }
})
watch(() => setting.风雷达组网地图相关.时间, (val) => {
  if (val) {
    map.setPaintProperty("时间图层", "text-opacity", 1);
  } else {
    map.setPaintProperty("时间图层", "text-opacity", 0);
  }
})
watch(
    () => setting.风雷达组网地图相关.altitudeHeight,
    (rHeight) => {
      updateData(rHeight)
    }
);
watch(() => setting.风雷达组网地图相关.反演风场, (val) => {
  if (val == '不显示') {
    map.setLayoutProperty('inversionLayer', 'visibility', 'none')
  } else {
    map.setLayoutProperty('inversionLayer', 'visibility', 'visible')
    inversionPPIData.features.map((item: any) => {
      item.properties.image = `${val == '风矢' ? 'arrow' : 'feather'}${getFeather(Math.abs(item.properties.风速))}`
      return item
    })
    if (val == '风矢') {
      map.setLayoutProperty('inversionLayer', 'icon-anchor', "top")
    } else {
      map.setLayoutProperty('inversionLayer', 'icon-anchor', ["match", ["get", "风速"], 0, "center", "bottom-left"])
    }
    (map.getSource('inversionPPIData') as any).setData(inversionPPIData)
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
        station.查询雷达列表接口({user_id: route.query.user_id});
      } else {
        bus.风雷达组网地图相关雷达站点信息 = [];
      }
    }
);
watch(
    () => setting.风雷达组网地图相关.checks[1].select,
    (newVal) => {
      if (newVal) {
        station.查询雷达在线列表接口({user_id: route.query.user_id});
      } else {
        bus.风雷达组网地图相关雷达站点信息 = [];
      }
    }
);
watch(
    () => setting.风雷达组网地图相关.checks[2].select,
    (newVal) => {
      if (newVal) {
        station.查询雷达离线列表接口({user_id: route.query.user_id});
      } else {
        bus.风雷达组网地图相关雷达站点信息 = [];
      }
    }
);
watch(
    () => setting.风雷达组网地图相关.checks[3].select,
    (newVal) => {
      if (newVal) {
        station.查询近期新增雷达列表接口({user_id: route.query.user_id});
      } else {
        bus.风雷达组网地图相关雷达站点信息 = [];
      }
    }
);
watch(
    () => setting.district,
    (newVal) => {
      if (newVal) {
        map.setLayoutProperty("districtLineBase", "visibility", "visible");
        map.setLayoutProperty("districtOutlineBase", "visibility", "visible");
      } else {
        map.setLayoutProperty("districtLineBase", "visibility", "none");
        map.setLayoutProperty("districtOutlineBase", "visibility", "none");
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
    () => setting.风雷达组网地图相关.feather,
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
  background: var(--bg-color-overlay-opacity-8);
  border-radius: 4px;
  border-top-left-radius: 4px;
  border: 1px solid var(--border-color);

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
      border-radius: 2px;
      position: relative;
      font-size: 16px;
      list-style: none;
      padding: 2px;

      &:hover {
        color: var(--ep-color-primary);
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
  top: 20px;
  right: 20px;
  width: 500px;
  box-sizing: border-box;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  transition: all 250ms;

  & > div > div {
    padding: 20px 10px;
    box-sizing: border-box;
  }

  & > div > div:nth-child(odd) {
    //background: #eee;
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

.map {
  background-color: #F4FBFF;
}

.dark .map {
  background-color: #2b2b2b;
}

$page-grid: 20px;
$page-left-width: 300px;
$page-right-width: 350px;
$page-center-width: calc(100% - $page-left-width - $page-right-width - 4 * $page-grid);
$page-left-right-height: calc(100% - 2 * $page-grid);
.page-left {
  position: absolute;
  top: $page-grid;
  left: $page-grid;
  width: $page-left-width;
  max-height: $page-left-right-height;
  overflow-y: auto;
  overflow-x: hidden;
  //background-color: #ff00fa;
}

.page-right {
  position: absolute;
  top: $page-grid;
  right: $page-grid;
  width: $page-right-width;
  max-height: $page-left-right-height;
  overflow-y: auto;
  overflow-x: hidden;
  //background-color: blue;
}

.page-center-top {
  position: absolute;
  top: $page-grid;
  left: calc($page-left-width + 2 * $page-grid);
  max-width: $page-center-width;

}

.page-center-bottom {
  position: absolute;
  bottom: $page-grid;
  left: calc($page-left-width + 2 * $page-grid);
  width: $page-center-width;

}

</style>
