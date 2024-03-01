<template>
  <div
    style="
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: absolute;
      background: grey;
    "
  >
    <div
      ref="mapRef"
      class="map"
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
    <Legend style="bottom: 40px"></Legend>
    <div
      :class="`right-drawer ${
        setting.disappear ? 'disappear' : ''
      } b-solid b-0 b-l-1px dark:b-color-#888`"
    >
      <div style="overflow: auto; scroll-snap-type: none">
        <chart-info></chart-info>
        <chart-fkx></chart-fkx>
        <chart-dom></chart-dom>
        <chartDirection></chartDirection>
        <chartSpeed></chartSpeed>
        <chartSNR></chartSNR>
        <chart-th></chart-th>
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
      :data="data"
      :toLeft="change"
      :toRight="change"
      :toMiddle="change"
      v-model:now="setting.now"
      v-model:status="setting.status"
      v-model:level="setting.level"
      class="absolute bottom-0"
    ></time-line>
    <graph
      v-if="DEV"
      class="absolute left-0 bottom-30px"
      v-model:args="graphArgs"
    ></graph>
  </div>
</template>
<script setup>
import { addFeatherImages, getFeather } from "~/tools";
import { getLngLat } from "~/myComponents/map/js/core.js";
import { watch, ref, onMounted, onBeforeUnmount, reactive, onActivated } from "vue";
import { useBus } from "~/myComponents/bus";
import Dialog from "../dialog.vue";
import { eventbus } from "~/eventbus";
const bus = useBus();
const DEV = import.meta.env.DEV;
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
  //         let ll = getLngLat(it.lngLat[0], it.lngLat[1], item.north_a, Number(k));
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

watch(
  () => bus.test,
  (val) => {
    console.log(val);
  }
);
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

import { useStationStore } from "~/stores/station";
import chartTh from "~/myComponents/echarts/T_H.vue";
import chartDom from "~/myComponents/echarts/index.vue";
import chartFkx from "~/myComponents/echarts/fkx.vue";
import chartInfo from "~/myComponents/echarts/info.vue";
import chartSNR from "~/myComponents/echarts/SNR.vue";
import chartSpeed from "~/myComponents/echarts/Speed.vue";
import chartDirection from "~/myComponents/echarts/Direction.vue";
import { useRoute } from "vue-router";
const route = useRoute();
import radarStatistic from "./radarStatistic.vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import Legend from "./legend.vue";
import style from "./streets-v11.js";

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

console.log("route.query", route.query);
const station = useStationStore();
/** @type {import('ol/style/literal.js').LiteralStyle} */

const mapRef = ref(null);
const popup = ref(null);
const popup_closer = ref(null);
const disappear = (e) => {
  setting.disappear = !setting.disappear;
};
let timer, map;
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
          风速: speed,
          image: "feather" + getFeather(speed),
          风向: 0,
        },
        geometry: {
          type: "Point",
          coordinates: [-122.414, 37.776],
        },
      },
    ],
  },
};
const clickFunc = (e) => {
  if (e.features) {
    setting.disappear = false;
    for (let i = 0; i < bus.result.length; i++) {
      if (bus.result[i].radar.radar_id == e.features[0].properties.radar_id) {
        station
          .查询雷达最新的径向风数据接口({
            radar_id: e.features[0].properties.radar_id.replaceAll("-", ""),
          })
          .then((res) => {
            bus.radialWindData = res.data.data;
          });
        station.active = bus.result[i].radar.radar_id;
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
  setting.openlayers.zoom = map.getZoom();
};
const moveFunc = () => {
  let center = map.getCenter();
  setting.openlayers.center = [center.lng, center.lat];
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
task();
const loadFunc = () => {
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
      "circle-radius": 5,
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
    filter: ["==", ["get", "type"], "风羽"],
  });
  map.addLayer({
    id: "textLayer",
    source: "point",
    type: "symbol",
    layout: {
      visibility: setting.station ? "visible" : "none",
      "text-field": ["get", "name"],
      "text-font": ["simkai"],
      "text-size": 14,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "center",
      "text-line-height": 1,
      "text-offset": [0, -1.2],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
      "text-max-width": 400,
    },
    paint: {
      "text-opacity": setting.factor[1].val ? 1 : 0,
      "text-color": "white",
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
      "text-opacity": setting.factor[7].val ? 1 : 0,
      "text-color": "white",
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
      "text-opacity": setting.factor[9].val ? 1 : 0,
      "text-color": "white",
    },
    filter: ["==", ["get", "type"], "站点"],
  });
  bus.avgWindData = [];
  bus.secondWindData = [];
  bus.radialWindData = [];
  if (import.meta.env.PROD) {
    timer = setInterval(() => task(), 4 * 60 * 1000);
  } else if (import.meta.env.DEV) {
    timer = setInterval(() => task(), 4 * 60 * 1000);
  }
  let frameCounter = map.painter.frameCounter;
  mock = setInterval(() => {
    graphArgs.fps.value = map.painter.frameCounter - frameCounter;
    frameCounter = map.painter.frameCounter;
    // graphArgs.memory.value = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    // graphArgs.memory.max = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
  }, 1000);
  if (setting.checks[0].select)
    station.查询雷达列表接口({ user_id: route.query.user_id });
  if (setting.checks[1].select)
    station.查询雷达在线列表接口({ user_id: route.query.user_id });
  if (setting.checks[2].select)
    station.查询雷达离线列表接口({ user_id: route.query.user_id });
  if (setting.checks[3].select)
    station.查询近期新增雷达列表接口({ user_id: route.query.user_id });
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
onActivated(() => {
  map && map.resize();
});
onMounted(() => {
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
    // maxBounds: [
    //   [60.0, 0],
    //   [160.0, 60],
    // ],
    // zoom: 18,
    // center: [148.9819, -35.3981],
    // pitch: 60,
    zoom: setting.openlayers.zoom,
    center: setting.openlayers.center,
    pitch: 0,
  });
  map.repaint = false;
  addFeatherImages(map);
  map.on("zoom", zoomFunc);
  map.on("move", moveFunc);
  map.on("load", loadFunc);
  map.on("click", "stationLayer", clickFunc);
  eventbus.on("将站点移动到屏幕中心", flyTo);
  const closer = popup_closer.value;
  closer.onclick = function () {
    selected = null;
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
});
onBeforeUnmount(() => {
  eventbus.off("将站点移动到屏幕中心", flyTo);
  clearInterval(timer);
  clearInterval(mock);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("load", loadFunc);
  map.off("click", "stationLayer", clickFunc);
  map.remove();
});
watch(
  () => bus.result,
  (newVal) => {
    const data = newVal;
    points.data = {
      type: "FeatureCollection",
      features: [],
    };
    for (let i = 0; i < data.length; i++) {
      let color = "blue";
      if (data[i].radar.data_status == false || data[i].radar.is_online == false) {
        color = "red";
      } else if (
        data[i].compass_status == false ||
        data[i].control_plate_status == false ||
        data[i].edfa_status == false ||
        data[i].external_status == false ||
        data[i].gps_status == false ||
        data[i].grabber_status == false
      ) {
        color = "orange";
      } else {
        color = "#0f0";
      }
      // console.log(data[i]);
      points.data.features.push({
        type: "Feature",
        properties: {
          type: "站点",
          radar_id: data[i].radar.radar_id,
          风速: speed,
          time: data[i].data_time,
          name: data[i].radar.name,
          is_online: data[i].is_online,
          external_temperature: data[i].external_temperature,
          external_humidity: data[i].external_humidity,
          image: "feather" + getFeather(speed),
          color,
        },
        geometry: {
          type: "Point",
          coordinates: [data[i].longitude, data[i].latitude],
        },
      });
    }
    map.getSource("point").setData(points.data);
  }
);
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

                  data_list.map((item) => {
                    let ll = getLngLat(
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
      map.setLayoutProperty("stationLayer", "visibility", "visible");
      map.setLayoutProperty("featherLayer", "visibility", "visible");
      map.setLayoutProperty("textLayer", "visibility", "visible");
      map.setLayoutProperty("temperatureLayer", "visibility", "visible");
      map.setLayoutProperty("humidityLayer", "visibility", "visible");
    } else {
      map.setLayoutProperty("stationLayer", "visibility", "none");
      map.setLayoutProperty("featherLayer", "visibility", "none");
      map.setLayoutProperty("textLayer", "visibility", "none");
      map.setLayoutProperty("humidityLayer", "visibility", "none");
      map.setLayoutProperty("temperatureLayer", "visibility", "none");
    }
  }
);
watch(
  () => setting.factor[1].val,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("textLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("textLayer", "text-opacity", 0);
    }
  }
);
watch(
  () => setting.factor[7].val,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("temperatureLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("temperatureLayer", "text-opacity", 0);
    }
  }
);
watch(
  () => setting.factor[9].val,
  (newVal) => {
    if (newVal) {
      map.setPaintProperty("humidityLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("humidityLayer", "text-opacity", 0);
    }
  }
);
watch(
  () => setting.checks[0].select,
  (newVal) => {
    if (newVal) {
      station.查询雷达列表接口({ user_id: route.query.user_id });
    } else {
      bus.result = [];
    }
  }
);
watch(
  () => setting.checks[1].select,
  (newVal) => {
    if (newVal) {
      station.查询雷达在线列表接口({ user_id: route.query.user_id });
    } else {
      bus.result = [];
    }
  }
);
watch(
  () => setting.checks[2].select,
  (newVal) => {
    if (newVal) {
      station.查询雷达离线列表接口({ user_id: route.query.user_id });
    } else {
      bus.result = [];
    }
  }
);
watch(
  () => setting.checks[3].select,
  (newVal) => {
    if (newVal) {
      station.查询近期新增雷达列表接口({ user_id: route.query.user_id });
    } else {
      bus.result = [];
    }
  }
);
watch(
  () => setting.district,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("districtLayer", "visibility", "visible");
      map.setLayoutProperty("districtOutline", "visibility", "visible");
    } else {
      map.setLayoutProperty("districtLayer", "visibility", "none");
      map.setLayoutProperty("districtOutline", "visibility", "none");
    }
  }
);
watch(
  () => setting.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
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
<style lang="scss">
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
  width: 600px;
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
