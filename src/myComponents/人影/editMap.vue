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
      class="absolute"
      v-model:menus="dialogOptions.menus"
      style="left: 10px; top: 10px"
    ></Dialog>
    <el-select
      class="select"
      style="position: absolute; width: 100px; left: 530px; top: 10px"
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
      v-if="DEV"
      class="absolute left-0 bottom-50px"
      v-model:args="graphArgs"
    ></graph>
  </div>
</template>
<script setup lang="ts">
import CustomLayer from "./webglLayer/CustomLayer.js";
import graph from "~/tools/graph.vue";
const DEV = import.meta.env.DEV;
const graphArgs = reactive({
  fps: { value: 0, min: 0, max: 144, strokeStyle: "#ffffff88" },
  // memory: { value: 0, min: 0, max: 120, strokeStyle: "#0f0" },
});
import { area, pointInPolygon } from "~/tools/index.ts";
import { rgb2Hsl } from "~/myComponents/map/js/core";
import palette from "../mapbox/data/温度/tempreture.xml?raw";
import plotUrl from "../mapbox/data/plot/06040802.000?url";
import palette2 from "../mapbox/data/highTemperature/850hPaTemp.xml?raw";
import plotUrl2 from "../mapbox/data/highTemperature/06040808.000?url";
import { getMicapsData } from "../mapbox/data/plot/micaps";
let LAT = (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI;
import interpolate from "./idw.js";
import { isoLines, isoBands } from "marchingsquares";
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
import Map = mapboxgl.Map;
import Marker = mapboxgl.Marker;
import NavigationControl = mapboxgl.NavigationControl;
import FullscreenControl = mapboxgl.FullscreenControl;
import { getRandomPointBetweenR1R2 } from "~/tools/index.js";
import * as turf from "@turf/turf";
import Circle from "@turf/circle";
import { wgs84togcj02 } from "~/myComponents/map/workers/mapUtil";
import { watch, ref, onMounted, onBeforeUnmount, reactive } from "vue";
import Dialog from "./dialog.vue";
const dialogOptions = reactive({ menus: [] });
const color = ref("red");
const options = ref([
  { label: "红色", value: "red" },
  { label: "绿色", value: "green" },
  { label: "蓝色", value: "blue" },
]);
import airstrip from "./airstrip.js";
import { useBus } from "~/myComponents/bus";
import { eventbus } from "~/eventbus";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.scss";
import { 获取净空区, saveData, deleteData } from "~/api/无人机/api";
import { getDevice } from "~/api/人影/device.js";
import { addFeatherImages, getFeather } from "~/tools";
const bus = useBus();
import theme from "./drawTheme/inactive.js";
let timer = 0;
let graphTimer = 0;
const props = withDefaults(
  defineProps<{
    routeLine?: boolean;
    loadmap?: boolean;
    district?: boolean;
    zyd?: boolean;
    tile?: string;
    center?: object;
    zoom?: number;
    pitch?: number;
    bearing?: number;
    zdz?: boolean;
    isolines?: boolean;
    isobands?: boolean;
    gridPoint?: boolean;
    gridValue?: boolean;
    feather?: boolean;
    equidistantRing?: boolean;
  }>(),
  {
    routeLine: true,
    zyd: true,
    loadmap: true,
    district: true,
    tile: "街道地图",
    center: () => [0, 0],
    zoom: 4,
    pitch: 0,
    bearing: 0,
    zdz: true,
    isolines: true,
    isobands: true,
    gridPoint: true,
    gridValue: true,
    feather: false,
    equidistantRing: false,
  }
);
import style from "./editMap.js";
style.layers.map((v: any) => {
  if (v.id == "simple-tiles") {
    v.layout.visibility = props.loadmap ? "visible" : "none";
  } else if (v.id == "districtLayer" || v.id == "districtOutline") {
    v.layout.visibility = props.district ? "visible" : "none";
  }
});
import street from "./street.js";
let streetUrl = URL.createObjectURL(
  new File([JSON.stringify(street)], "street.json", { type: "application/json" })
);
import satellite from "./satellite.js";
let satelliteUrl = URL.createObjectURL(
  new File([JSON.stringify(satellite)], "satellite.json", { type: "application/json" })
);
const emit = defineEmits([
  "update:center",
  "update:zoom",
  "update:pitch",
  "update:bearing",
]);
let map: any;
watch(
  () => props.tile,
  (tile) => {
    let s = map ? map.getStyle() : style;
    if (tile == "街道地图") {
      s.sources["raster-tiles"].url = streetUrl;
    } else if (tile == "卫星地图") {
      s.sources["raster-tiles"].url = satelliteUrl;
    }
    s.layers.map((v: any) => {
      if (v.id == "simple-tiles") {
        v.layout.visibility = props.loadmap ? "visible" : "none";
      } else if (v.id == "districtLayer" || v.id == "districtOutline") {
        v.layout.visibility = props.district ? "visible" : "none";
      }
    });
    map && map.setStyle(s);
  },
  {
    immediate: true,
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
watch([() => props.zoom, () => props.center], ([zoom, center]) => {
  //无法通过监听变量的变化实时设置地图的视角
});
import { useStationStore } from "~/stores/station";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
let enclosureList = new Array<any>();
const station = useStationStore();
const mapRef = ref(null);
const zoomFunc = () => {
  emit("update:zoom", map.getZoom());
};
const pitchFunc = () => {
  emit("update:pitch", map.getPitch());
};
const bearingFunc = () => {
  console.log(map.getBearing());
  emit("update:bearing", map.getBearing());
};
const moveFunc = () => {
  emit("update:center", map.getCenter());
};
const flyTo = (item: any) => {
  try {
    let v = item.lngLat;
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
      zoom: item.zoom || 16, // 目标缩放级别
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
const resize = () => {
  map && map.resize();
};
onMounted(() => {
  map = new Map({
    container: (mapRef.value as unknown) as HTMLCanvasElement,
    // projection: "globe",
    // style: raster,
    performanceMetricsCollection: false,
    style,
    fadeDuration: 0,
    // dragRotate: false,
    // touchRotate: false,
    // touchPitch: false,
    // dragPitch: false,
    // bounds: turf.bbox(boundaries),
    // localIdeographFontFamily: "Microsoft YoHei",
    localIdeographFontFamily: "",
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
    center: props.center,
    pitch: props.pitch,
  });
  map.on("load", async () => {
    await addFeatherImages(map);
    map.addLayer(new CustomLayer());
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
    getDevice().then((res) => {
      dialogOptions.menus = res.data;
      let features: any = [];
      dialogOptions.menus.map((item: any) => {
        let v = item.lngLat;
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
            type: "站点",
            name: item.name,
            color: item.color,
          },
          geometry: {
            type: "Point",
            coordinates: position,
          },
        });
        // let offset = (getRandomPointBetweenR1R2(50, 100) as unknown) as [number, number];
        // let div = document.createElement("div");
        // div.id = "组网" + item.id;
        // div.className = "deviceStation_人影";
        // div.style.position = "absolute";
        // $(div).data("id", item.id);
        // let device = $(
        //   `<div class="station" style="z-index:-1;left:50%;top:50%;transform:translate(-50%,-50%) translate(${-offset[0]}px,${-offset[1]}px)"><div class="projectile" style="filter: drop-shadow(${
        //     item.color
        //   } 0 -60px);transform:translateY(60px)"/></div>`
        // );
        // $(div).append(device);
        // $(div).append(
        //   $(
        //     `<div class="connectingLine" style="pointer-events:none;background:white;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) translate(${
        //       -offset[0] / 2
        //     }px,${-offset[1] / 2}px) rotate(${Math.atan2(
        //       offset[1],
        //       offset[0]
        //     )}rad);width:${Math.sqrt(offset[0] ** 2 + offset[1] ** 2)}px"></div>`
        //   )
        // );
        // let label = $(`<div class="label">${item.name}</div>`);
        // $(div).append(label);

        // device.on("click", function click() {
        //   station.组网界面被选中的设备 = $(this).parent().data("id");
        //   $(`#组网-tr-${station.组网界面被选中的设备}`)[0].scrollIntoView({
        //     block: "nearest",
        //     behavior: "smooth",
        //     inline: "center",
        //   });
        // });
        // device.on("mousedown", (evt) => {
        //   evt.preventDefault();
        //   evt.stopPropagation();
        // });
        // var marker = new Marker(div, {
        //   draggable: true,
        //   pitchAlignment: "map",
        //   rotationAlignment: "map",
        //   anchor: "center",
        // })
        //   .setLngLat(position) // 设置标记的经纬度坐标
        //   .addTo(map)
        //   .setOffset(offset);
        // let dragStartOffset: { x: number; y: number };
        // marker.on("dragstart", () => {
        //   dragStartOffset = marker.getOffset() as { x: number; y: number };
        // });
        // marker.on("drag", (e: any) => {
        //   let dragEndPoint = marker.getLngLat();
        //   let pt1 = map.project({ lng: position[0], lat: position[1] });
        //   let pt2 = map.project(dragEndPoint);
        //   let x = dragStartOffset.x + pt2.x - pt1.x;
        //   let y = dragStartOffset.y + pt2.y - pt1.y;
        //   marker.setOffset([x, y]);
        //   let line = $("#组网" + item.id).find(".connectingLine")[0];
        //   line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
        //     -y / 2
        //   }px) rotate(${Math.atan2(y, x)}rad)`;
        //   line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
        //   let station = $("#组网" + item.id).find(".station")[0];
        //   station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
        //   marker.setLngLat(position);
        // });
        // marker.on("dragend", (e: any) => {
        //   let dragEndPoint = e.target.getLngLat();
        //   let pt1 = map.project({ lng: position[0], lat: position[1] });
        //   let pt2 = map.project(dragEndPoint);
        //   let offset = marker.getOffset() as { x: number; y: number };
        //   let x = offset.x + pt2.x - pt1.x;
        //   let y = offset.y + pt2.y - pt1.y;
        //   marker.setOffset([x, y]);
        //   let line = $("#组网" + item.id).find(".connectingLine")[0];
        //   line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
        //     -y / 2
        //   }px) rotate(${Math.atan2(y, x)}rad)`;
        //   line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
        //   let station = $("#组网" + item.id).find(".station")[0];
        //   station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
        //   marker.setLngLat(position);
        // });
      });
      map.addLayer({
        id: "zydLayer",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features,
          },
        },
        layout: {
          visibility: props.zyd ? "visible" : "none",
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          "icon-anchor": "left",
          "icon-image": "projectile",
          "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
          "icon-rotate": 0,
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-field": ["get", "name"],
          "text-font": ["simkai"],
          "text-size": 16,
          "text-transform": "uppercase",
          // "text-letter-spacing": 0.05,
          "text-anchor": "center",
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

      let feathers = [];
      for (let j = 0; j < 30; j++) {
        for (let i = 0; i < 20; i++) {
          const pt = turf.destination(
            turf.point([101.91223724839354, 36.548604620850995]),
            45 + 1000 * i,
            j * 10,
            {
              units: "meters",
            }
          );
          let speed = Math.random() * 60;
          feathers.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: pt.geometry?.coordinates,
            },
            properties: {
              type: "风羽",
              风速: speed,
              image: "feather" + getFeather(speed),
              风向: 45,
            },
          });
        }
      }
      map.addLayer({
        id: "绘制风羽",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: feathers,
          },
        },
        layout: {
          visibility: props.feather ? "visible" : "none",
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          "icon-anchor": ["match", ["get", "风速"], 0, "center", "bottom-left"],
          "icon-image": ["get", "image"],
          "icon-size": ["interpolate", ["linear"], ["zoom"], 5, 0.5, 20, 1],
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

      let circleFeatures = [];
      let pointFeatures = [];
      for (let i = 1; i <= 10; i++) {
        let circle = Circle([102.04150296221326, 36.530313361869744], i * 1000, {
          steps: 64,
          units: "meters",
        });
        circleFeatures.push(circle);

        let pts: any = [];
        const pt1 = turf.destination(
          turf.point([102.04150296221326, 36.530313361869744]),
          1000 * i,
          0,
          { units: "meters" }
        );
        const pt2 = turf.destination(
          turf.point([102.04150296221326, 36.530313361869744]),
          1000 * i,
          90,
          { units: "meters" }
        );
        const pt3 = turf.destination(
          turf.point([102.04150296221326, 36.530313361869744]),
          1000 * i,
          180,
          { units: "meters" }
        );
        const pt4 = turf.destination(
          turf.point([102.04150296221326, 36.530313361869744]),
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
        pointFeatures.push({
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
      let marker = new Marker({
        draggable: false,
        pitchAlignment: "map",
        rotationAlignment: "map",
      }).setLngLat([102.04150296221326, 36.530313361869744]);
      marker.addTo(map);
      marker.remove();
      map.addLayer({
        id: "等距环",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: circleFeatures,
          },
        },
        layout: {
          visibility: props.equidistantRing ? "visible" : "none",
        },
        paint: {
          "line-color": "#000",
          "line-width": 2,
          "line-dasharray": [2, 2],
        },
      });
      map.addLayer({
        id: "等距环的单位",
        type: "symbol",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: pointFeatures,
          },
        },
        layout: {
          visibility: props.equidistantRing ? "visible" : "none",
          "text-field": ["get", "units"],
          "text-font": ["simkai"],
          "text-size": 14,
          "text-anchor": "bottom-left",
          "text-allow-overlap": true,
          "text-ignore-placement": true,
          "text-rotation-alignment": "map",
          "text-pitch-alignment": "map",
        },
        paint: {
          "text-color": "white",
          "text-halo-color": "black",
          "text-halo-width": 1,
        },
      });
      map.addLayer({
        id: "绘制空域",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [-122.48369693756104, 37.83381888486939],
                [-122.48348236083984, 37.83317489144141],
                [-122.48339653015138, 37.83270036637107],
                [-122.48356819152832, 37.832056363179625],
                [-122.48404026031496, 37.83114119107971],
                [-122.48404026031496, 37.83049717427869],
                [-122.48348236083984, 37.829920943955045],
                [-122.48356819152832, 37.82954808664175],
              ],
            },
          },
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#f00",
          "line-width": {
            base: 2,
            stops: [
              [4, 2], // 线宽为2像素
              [22, 1000], // 线宽为10像素
            ],
          },
        },
      });
    });
    let airplanes = [];
    for (let i = 0; i < 2; i++) {
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
        "icon-size": {
          base: 1,
          stops: [
            [0, 0.5],
            [22, 1],
          ],
        },
        "icon-rotate": ["get", "deg"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
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
    // }, 33);

    // getMicapsData(plotUrl).then(async(result: any) => {
    //   let pts = new Array<{lng:number;lat:number;value:number}>;
    //   // for (let i = 0; i < 100; i++) {
    //   //   pts.push({
    //   //     lng: Math.random() * 70 + 70,
    //   //     lat: Math.random() * 40 + 15,
    //   //     value: Number((Math.random() * 72-36).toFixed(2)),
    //   //   });
    //   // }

    //   result.data.map((item: any) => {
    //     // if(item.温度!==9999&&item.经度>70&&item.经度<140&&15<item.纬度&&item.纬度<55){
    //     if(item.温度!==9999){
    //       pts.push({
    //         lng: item.经度,
    //         lat: item.纬度,
    //         value: Math.round(item.温度),
    //       });
    //     }
    //   });

    //   let breaks = new Array<number>();
    //   var Color: { [key: string]: any } = {};
    //   let xmlDoc = new DOMParser().parseFromString(palette, "text/xml");
    //   let collections = xmlDoc.getElementsByTagName("entry");
    //   for (let i = 0; i < collections.length; i++) {
    //     let value = parseInt(Number(collections[i].getAttribute("value")).toFixed());
    //     breaks.push(value)
    //     let strPalette = collections[i].getAttribute("rgba");
    //     if (strPalette) {
    //       let rgba: [number,number,number,number] = strPalette.split(",").map((v) => Number(v)) as unknown as [number,number,number,number];
    //       let hsl = rgb2Hsl(rgba[0],rgba[1],rgba[2])
    //       // Color[value.toFixed()] = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
    //       Color[value.toFixed()] = '#' + ((1 << 24) + (rgba[0] << 16) + (rgba[1] << 8) + rgba[2]).toString(16).slice(1);
    //     }
    //   }

    //   let fillColors = [];
    //   let strokeColors = [];
    //   breaks=[]
    //   for(let i=-36;i<36;i++){
    //     breaks.push(i);
    //   }
    //   for (let i = 0; i < breaks.length; i++) {
    //     strokeColors.push(breaks[i]);
    //     strokeColors.push(`hsl(${getHue(-36, breaks[i], 36)},100%,50%)`);
    //     // strokeColors.push(Color[breaks[i].toFixed()]);
    //   }

    //   // for (let i = 0; i < breaks.length; i++) {
    //   //   strokeColors.push(breaks[i]);
    //   //   // strokeColors.push(`hsl(${getHue(-36, breaks[i], 36)},100%,50%)`);
    //   //   strokeColors.push(Color[breaks[i].toFixed()]);
    //   // }
    //   for (let i = 0; i < breaks.length - 1; i++) {
    //     fillColors.push(`${breaks[i]}-${breaks[i + 1]}`);
    //     fillColors.push(strokeColors[2*i+1]);
    //     // fillColors.push(strokeColors[2*(i+1)+1]);
    //   }
    //   let interpolateOptions = {
    //     sizeU: 140,
    //     sizeV: 80,
    //     boundary: {
    //       lng: 70,
    //       lat: 15,
    //       width: 70,
    //       height: 40,
    //     },
    //     power: 6,
    //   };
    //   console.time()
    //   let grid = interpolate(pts, interpolateOptions)
    //   console.timeEnd()
    //     var bandWidths = breaks.reduce(function (bw, upperBand, i, intervals) {
    //       if (i > 0) {
    //         var lowerBand = intervals[i - 1];
    //         bw.push(upperBand - lowerBand);
    //       }
    //       return bw;
    //     }, new Array<number>());
    //     var multiBands = isoBands(grid, breaks.slice(0, -1), bandWidths, {
    //       verbose: false,
    //       polygons: false,
    //       linearRing: false,
    //       noFrame: true,
    //       noQuadTree: false,
    //       polygons_full: false,
    //       successCallback: () => {},
    //     });
    //     let isobands = {
    //       type: "FeatureCollection",
    //       features: new Array<any>(),
    //     };
    //     for (let j = 0; j < multiBands.length; j++) {
    //       let feature = {
    //         type: "Feature",
    //         properties: { threshold: breaks[j] + "-" + breaks[j + 1] },
    //         geometry: {
    //           type: "MultiPolygon",
    //           coordinates: new Array<any>(),
    //         },
    //       };
    //       let polygons = [];
    //       let holes = [];
    //       for (let i = 0; i < multiBands[j].length; i++) {
    //         let points = new Array<[number, number]>();
    //         multiBands[j][i].map((point: [number, number]) => {
    //           points.push([
    //             (point[0] / (interpolateOptions.sizeU - 1)) *
    //               interpolateOptions.boundary.width +
    //               interpolateOptions.boundary.lng,
    //             (point[1] / (interpolateOptions.sizeV - 1)) *
    //               interpolateOptions.boundary.height +
    //               interpolateOptions.boundary.lat,
    //           ]);
    //         });
    //         if (interpolateOptions.boundary.width * interpolateOptions.boundary.height * area(points) < 0) {
    //           polygons.push(points);
    //         } else {
    //           holes.push(points);
    //         }
    //       }
    //       for (let k = 0; k < polygons.length; k++) {
    //         let polygon = polygons.splice(k--, 1)[0];
    //         let tmp = [polygon];
    //         for (let m = 0; m < holes.length; m++) {
    //           if (
    //             pointInPolygon(holes[m][0], polygon) &&
    //             polygons.every((item: any) => !pointInPolygon(holes[m][0], item))
    //           ) {
    //             let hole = holes.splice(m--, 1)[0];
    //             tmp.push(hole);
    //           }
    //         }
    //         feature.geometry.coordinates.push(tmp);
    //       }
    //       isobands.features.push(feature);
    //     }
    //     map.addLayer({
    //       id: "等值带",
    //       type: "fill",
    //       source: {
    //         type: "geojson",
    //         data: isobands,
    //       },
    //       layout: {
    //         visibility:props.isobands?"visible":"none"
    //       },
    //       paint: {
    //         "fill-color": ["match", ["get", "threshold"], ...fillColors, "transparent"],
    //         "fill-opacity": 0.5,
    //       },
    //     });

    //     var multiLines = isoLines(grid, breaks, {
    //       noFrame: true,
    //       polygons: false,
    //       polygons_full: false,
    //       noQuadTree: false,
    //       linearRing: false,
    //       verbose: false,
    //       successCallback: (multiLines: any, threshold: number) => {},
    //     });
    //     let isolines = {
    //       type: "FeatureCollection",
    //       features: new Array<any>(),
    //     };
    //     let isolineValues = {
    //       type: "FeatureCollection",
    //       features: new Array<any>(),
    //     };
    //     for (let j = 0; j < multiLines.length; j++) {
    //       let feature = {
    //         type: "Feature",
    //         properties: { threshold: breaks[j] },
    //         geometry: {
    //           type: "MultiLineString",
    //           coordinates: new Array<any>(),
    //         },
    //       };
    //       let featureValue = {
    //         type: "Feature",
    //         properties: { threshold: breaks[j] },
    //         geometry: {
    //           type: "MultiPoint",
    //           coordinates: new Array<any>(),
    //         },
    //       };
    //       // console.log(multiLines[j])
    //       for (let i = 0; i < multiLines[j].length; i++) {
    //         let line = multiLines[j][i];
    //         let points = new Array<any>();
    //         for(let k=0;k<line.length;k++){
    //           let point = [
    //             (line[k][0] / (interpolateOptions.sizeU - 1)) *
    //               interpolateOptions.boundary.width +
    //               interpolateOptions.boundary.lng,
    //             (line[k][1] / (interpolateOptions.sizeV - 1)) *
    //               interpolateOptions.boundary.height +
    //               interpolateOptions.boundary.lat,
    //           ]
    //           points.push(point);
    //         }
    //         feature.geometry.coordinates.push(points);
    //         let firstPoint = points[0]
    //         let lastPoint = points.slice(-1)[0]
    //         if(JSON.stringify(firstPoint)===JSON.stringify(lastPoint)){
    //           featureValue.geometry.coordinates.push(firstPoint)
    //         }else{
    //           featureValue.geometry.coordinates.push(firstPoint)
    //           featureValue.geometry.coordinates.push(lastPoint)
    //         }
    //       }
    //       isolines.features.push(feature);
    //       isolineValues.features.push(featureValue);
    //     }
    //     map.addLayer({
    //       id: "等值线",
    //       type: "line",
    //       source: {
    //         type: "geojson",
    //         data: isolines,
    //       },
    //       layout: {
    //         visibility:props.isolines?'visible':'none'
    //       },
    //       paint: {
    //         "line-color": ["match", ["get", "threshold"], ...strokeColors, "transparent"],
    //         "line-width": 1,
    //         "line-opacity": 1,
    //       },
    //     });
    //     map.addLayer({
    //       id: "等值线值",
    //       type: "symbol",
    //       source: {
    //         type: "geojson",
    //         data: isolineValues,
    //       },
    //       layout: {
    //         "visibility":props.isolines?'visible':'none',
    //         "text-field": ["get", "threshold"],
    //         "text-size":16,
    //         "text-font": ["simkai"],
    //         "text-offset": [0, 0.2],
    //         "text-anchor": "bottom",
    //         "text-ignore-placement": true,
    //         "text-rotation-alignment": "map",
    //       },
    //       paint: {
    //         "text-color":  ["match", ["get", "threshold"], ...strokeColors, "transparent"],
    //         "text-halo-width": 1,
    //         "text-halo-color": "black",
    //       },
    //     });

    //     let discretePoints = {
    //       type: "FeatureCollection",
    //       features: new Array<any>(),
    //     };

    //     pts.map(item=>{
    //       discretePoints.features.push({
    //         type: "Feature",
    //         properties: {
    //           threshold: item.value,
    //           color: "red" ,
    //         },
    //         geometry: {
    //           type: "Point",
    //           coordinates: [item.lng, item.lat],
    //         },
    //       });
    //     })
    //     map.addLayer({
    //       id: "离散值",
    //       type: "symbol",
    //       source: { type: "geojson", data: discretePoints },
    //       layout: {
    //         "visibility":props.zdz?"visible":"none",
    //         "text-field": ["get", "threshold"],
    //         "text-size":24,
    //         "text-font": ["simkai"],
    //         "text-offset": [0, 0.2],
    //         "text-anchor": "bottom",
    //         "text-ignore-placement": true,
    //         "text-rotation-alignment": "map",
    //       },
    //       paint: {
    //         "text-color": ["get", "color"],
    //         "text-halo-width": 1,
    //         "text-halo-color": "black",
    //       },
    //     });
    //     map.addLayer({
    //       id: "离散点",
    //       type: "circle",
    //       source: { type: "geojson", data: discretePoints },
    //       layout:{
    //         "visibility":props.zdz?"visible":"none",
    //       },
    //       paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1,"circle-stroke-color":'black' },
    //     });

    //     let gridPoints = {
    //       type: "FeatureCollection",
    //       features: new Array<any>(),
    //     };
    //     for (let j = 0; j < grid.length; j++) {
    //       for (let i = 0; i < grid[j].length; i++) {
    //         let x =
    //           (i / (interpolateOptions.sizeU - 1)) * interpolateOptions.boundary.width +
    //           interpolateOptions.boundary.lng;
    //         let y =
    //           (j / (interpolateOptions.sizeV - 1)) * interpolateOptions.boundary.height +
    //           interpolateOptions.boundary.lat;
    //         gridPoints.features.push({
    //           type: "Feature",
    //           properties: {
    //             threshold: grid[j][i].toFixed(2),
    //             color: "white",
    //           },
    //           geometry: {
    //             type: "Point",
    //             coordinates: [x, y],
    //           },
    //         });
    //       }
    //     }
    //     map.addLayer({
    //       id: "网格值",
    //       type: "symbol",
    //       source: { type: "geojson", data: gridPoints },
    //       layout: {
    //         "visibility":props.gridValue?'visible':'none',
    //         "text-field": ["get", "threshold"],
    //         "text-font": ["simkai"],
    //         "text-offset": [0, 0.2],
    //         "text-anchor": "bottom",
    //         "text-ignore-placement": true,
    //         "text-rotation-alignment": "map",
    //       },
    //       paint: {
    //         "text-color": ["get", "color"],
    //         "text-halo-width": 1,
    //         "text-halo-color": "black",
    //       },
    //     });
    //     map.addLayer({
    //       id: "网格点",
    //       type: "circle",
    //       source: { type: "geojson", data: gridPoints },
    //       layout:{
    //         "visibility":props.gridPoint?'visible':'none',
    //       },
    //       paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1 },
    //     });

    //   /*
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
    // });*/

    // });

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
      /*
      map.addLayer({
        id: "等值线边界",
        type: "fill",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-180, -50],
                  [180, -50],
                  [180, 50],
                  [-180, 50],
                  [-180, -50],
                ],
              ],
            },
          },
        },
        layout: {},
        paint: {
          "line-color": "yellow",
          "line-opacity": 1,
          "line-width": 1,
          "fill-color": "cyan",
          "fill-opacity": 0.5,
        },
      });*/
    });
  });
  map.addControl(
    new NavigationControl({
      showCompass: true,
      showZoom: true,
    })
  );
  let frameCounter = 0;
  graphTimer = setInterval(() => {
    graphArgs.fps.value = map.painter.frameCounter - frameCounter;
    frameCounter = map.painter.frameCounter;
    // graphArgs.memory.value = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    // graphArgs.memory.max = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
  }, 1000);
  // map.addControl(new ScaleControl());
  map.addControl(new FullscreenControl());
  var Draw = new MapboxDraw({
    userProperties: true,
    displayControlsDefault: true,
    defaultMode: "simple_select",
    controls: {
      point: true,
      circle: true,
      line_string: true,
      polygon: true,
      trash: true,
      combine_features: false,
      uncombine_features: false,
    },
    styles: theme,
  });
  map.addControl(Draw, "top-right");
  //添加空域
  map.on("draw.create", function (e: any) {
    let a = {
      type: "FeatureCollection",
      features: new Array<any>(),
    };
    let standby2 = color.value;
    let data = new Array<any>();
    e.features.map((item: any) => {
      item.properties.color = standby2;
      a.features.push(item);
      if (item.geometry.type === "Point") {
        data.push({
          standby2,
          id: item.id,
          enclosure_type: "06",
          line_width: 0,
          points: item.geometry.coordinates.join(",") + ";",
        });
      } else if (item.geometry.type === "LineString") {
        console.log(item);
        data.push({
          standby2,
          id: item.id,
          enclosure_type: "00",
          line_width: 0,
          points: item.geometry.coordinates.map((v: any) => v.join(",")).join(";") + ";",
        });
      } else if (item.geometry.type === "Polygon") {
        if (item.properties.isCircle) {
          data.push({
            standby2,
            id: item.id,
            enclosure_type: "03",
            line_width: 0,
            circle_center: item.properties.center.join(",") + ";",
            radius: item.properties.radiusInKm * 1000,
            points:
              item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") + ";",
          });
        } else {
          data.push({
            standby2,
            id: item.id,
            enclosure_type: "02",
            line_width: 0,
            points:
              item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") + ";",
          });
        }
      }
    });
    Draw.add(a as never);
    saveData(data)
      .then((res) => {
        console.log(res);
        data.map((item) => {
          enclosureList.push(item);
        });
      })
      .catch((e) => {
        console.log("添加空域失败");
      });
  });
  //删除空域
  map.on("draw.delete", function (e: any) {
    let data = new Array<any>();
    e.features.map((v: any) => {
      data.push({ id: v.id });
    });
    if (data.length > 0) {
      deleteData(data)
        .then((res) => {
          data.map((item) => {
            for (let i = 0; i < enclosureList.length; i++) {
              if (enclosureList[i].id == item.id) {
                enclosureList.splice(i--, 1);
              }
            }
          });
          console.log("删除空域完成");
        })
        .catch((e) => {
          throw Error("删除空域失败");
        });
    }
  });
  //修改空域
  map.on("draw.update", function (e: any) {
    let data = new Array<any>();
    e.features.map((item: any) => {
      let tmp = enclosureList.filter((v) => v.id === item.id);
      if (tmp.length === 1) {
        console.log(tmp[0]);
        let enclosure_type = tmp[0].enclosure_type;
        if (enclosure_type == "06") {
          data.push(
            Object.assign(tmp[0], {
              id: item.id,
              points: item.geometry.coordinates.join(",") + ";",
            })
          );
        } else if (enclosure_type == "00") {
          data.push(
            Object.assign(tmp[0], {
              id: item.id,
              points:
                item.geometry.coordinates.map((v: any) => v.join(",")).join(";") + ";",
            })
          );
        } else {
          if (item.properties.isCircle) {
            data.push(
              Object.assign(tmp[0], {
                id: item.id,
                circle_center: item.properties.center.join(",") + ";",
                radius: item.properties.radiusInKm * 1000,
                points:
                  item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") +
                  ";",
              })
            );
          } else {
            data.push(
              Object.assign(tmp[0], {
                id: item.id,
                points:
                  item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") +
                  ";",
              })
            );
          }
        }
      } else {
        throw Error("符合条件的数据应该仅有一条！");
      }
    });
    saveData(data)
      .then((res) => {
        console.log("空域修改完成");
      })
      .catch((e) => {
        console.log(e);
      });
  });
  map.on("draw.selectionchange", function (e: any) {
    console.log(e);
  });
  map.on("draw.combine", function (e: any) {
    console.log(e);
  });
  map.on("draw.uncombine", function (e: any) {
    console.log(e);
  });
  获取净空区().then((res) => {
    let a = {
      type: "FeatureCollection",
      features: [],
    };
    enclosureList = res.data.results;
    for (let i = 0; i < res.data.results.length; i++) {
      let v = res.data.results[i];
      let strLngLatList = v.points.match(
        RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g)
      );
      let list = strLngLatList.map((item: any) => [
        Number(item.match(RegExp(/(\-|\+)?\d+(\.\d+)?(?=,)/))[0]),
        Number(item.match(RegExp(/(?<=,)(\-|\+)?\d+(\.\d+)?/))[0]),
      ]);
      // console.log(JSON.stringify(list));
      if (v.enclosure_type == "06") {
        a.features.push({
          id: v.id,
          type: "Feature",
          properties: {
            color: v.standby2,
          },
          geometry: {
            type: "Point",
            coordinates: list[0],
          },
        } as never);
      } else if (v.enclosure_type == "00") {
        a.features.push({
          id: v.id,
          type: "Feature",
          properties: {
            color: v.standby2,
          },
          geometry: {
            type: "LineString",
            coordinates: list,
          },
        } as never);
      } else if (v.enclosure_type == "02") {
        if (list.length > 2) {
          a.features.push({
            id: v.id,
            type: "Feature",
            properties: {
              color: v.standby2,
            },
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          } as never);
        } else {
          console.error("v.enclosure_type == 02," + "list.length=" + list.length);
        }
      } else if (v.enclosure_type == "03") {
        if (v.circle_center) {
          let center = v.circle_center
            .match(RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g))[0]
            .split(",")
            .map((v: any) => Number(v));
          a.features.push({
            id: v.id,
            type: "Feature",
            properties: {
              isCircle: true,
              center,
              radiusInKm: v.radius / 1000,
              color: v.standby2,
            },
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          } as never);
        } else {
          console.error("v.circle_center=" + v.circle_center);
        }
      }
    }
    Draw.add(a as never);
  });

  map.repaint = false;
  map.on("zoom", zoomFunc);
  map.on("pitch", pitchFunc);
  map.on("move", moveFunc);
  map.on("bearing", bearingFunc);
  eventbus.on("组网-将站点移动到屏幕中心", flyTo);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(graphTimer);
  eventbus.off("组网-将站点移动到屏幕中心", flyTo);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("pitch", pitchFunc);
  map.off("bearing", bearingFunc);
  map.remove();
});
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
    if (newVal) {
      map.setLayoutProperty("zydLayer", "visibility", "visible");
    } else {
      map.setLayoutProperty("zydLayer", "visibility", "none");
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
      map.getLayer("districtLayer") &&
        map.setLayoutProperty("districtLayer", "visibility", "visible");
      map.setLayoutProperty("districtOutline", "visibility", "visible");
    } else {
      map.getLayer("districtLayer") &&
        map.setLayoutProperty("districtLayer", "visibility", "none");
      map.setLayoutProperty("districtOutline", "visibility", "none");
    }
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
</script>
<style lang="scss">
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
