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
    <chromatography
      ref="chromatographyRef"
      :arr="chromatographyArr"
      style="
        left: 0;
        color: white;
        top: 50%;
        transform: translateY(-50%);
        bottom: 0;
        height: 300px;
        position: absolute;
      "
    ></chromatography>
  </div>
</template>
<script setup lang="ts">
import ppiData from "./CDL_S10000_Lidar10HKF00631450_PPI_FrmAzm30.00_ToAzm29.00_Pth3.00_Spd6.00_Res060_StartIdx003_Start003_Stop191_LOSWind_20230515 000240.csv?url";
import chromatography from "../激光测风尾涡/chromatography.vue";
import { View } from "~/tools/index.js";
const getHue = (min: number, v: number, max: number) => {
  let value;
  if (v < min) {
    value = min;
  } else if (v > max) {
    value = max;
  } else {
    value = v;
  }
  let percent = (v - min) / (max - min);
  // //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  // return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
  //hsl(240,100%,50%)～hsl(180,100%,50%)
  // return (1 - percent) * 60 + 180;
  //hsl(60,100%,50%)～hsl(0,100%,50%)
  return percent * 60;
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
const chromatographyRef = ref<any>();
const chromatographyArr = [
  -20,
  -14,
  -12,
  -10,
  -8,
  -6,
  -4,
  -2,
  2,
  4,
  6,
  8,
  10,
  12,
  16,
  20,
];
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
import { 获取净空区, saveData, deleteData } from "~/api/enclosure.js";
import { getDevice } from "~/api/组网/device.js";
import { addFeatherImages, getFeather } from "~/tools";
const bus = useBus();
import theme from "./drawTheme/inactive.js";
let timer = 0;
const props = withDefaults(
  defineProps<{
    radar?: boolean;
    loadmap?: boolean;
    district?: boolean;
    tile?: string;
    center?: object;
    zoom?: number;
    pitch?: number;
  }>(),
  {
    radar: true,
    loadmap: true,
    district: true,
    tile: "街道地图",
    center: () => [0, 0],
    zoom: 4,
    pitch: 0,
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
const emit = defineEmits(["update:center", "update:zoom", "update:pitch"]);
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
  () => props.district,
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
  () => props.radar,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("irLayer", "visibility", "visible");
    } else {
      map.setLayoutProperty("irLayer", "visibility", "none");
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
    // performanceMetricsCollection: false,
    style: style as mapboxgl.Style,
    // fadeDuration: 0,
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
    center: props.center as mapboxgl.LngLatLike,
    pitch: props.pitch,
  });
  map.on("load", async () => {
    //用于确定天气雷达位置是否正确
    new Marker({
      draggable: false,
      pitchAlignment: "map",
      rotationAlignment: "map",
    })
      .setLngLat([120.95777893066406, 31.075000762939453])
      .addTo(map);
    //用于确定PPI位置是否正确
    new Marker({
      draggable: false,
      pitchAlignment: "map",
      rotationAlignment: "map",
    })
      .setLngLat(wgs84togcj02(...[120.477398, 36.16953]) as [number, number])
      .addTo(map);
    await addFeatherImages(map);
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
      layout: {},
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

        let offset = (getRandomPointBetweenR1R2(50, 100) as unknown) as [number, number];
        let div = document.createElement("div");
        div.id = "组网" + item.id;
        div.className = "deviceStation_组网";
        div.style.position = "absolute";
        $(div).data("id", item.id);
        let device = $(
          `<div class="station" style="z-index:-1;background: ${
            item.color
          };left:50%;top:50%;transform:translate(-50%,-50%) translate(${-offset[0]}px,${-offset[1]}px)"></div>`
        );
        $(div).append(device);
        $(div).append(
          $(
            `<div class="connectingLine" style="pointer-events:none;background:white;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) translate(${
              -offset[0] / 2
            }px,${-offset[1] / 2}px) rotate(${Math.atan2(
              offset[1],
              offset[0]
            )}rad);width:${Math.sqrt(offset[0] ** 2 + offset[1] ** 2)}px"></div>`
          )
        );
        let label = $(`<div class="label">${item.name}</div>`);
        $(div).append(label);

        device.on("click", function click() {
          station.组网界面被选中的设备 = $(this).parent().data("id");
          $(`#组网-tr-${station.组网界面被选中的设备}`)[0].scrollIntoView({
            block: "nearest",
            behavior: "smooth",
            inline: "center",
          });
        });
        device.on("mousedown", (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
        });
        var marker = new Marker(div, {
          draggable: true,
          pitchAlignment: "map",
          rotationAlignment: "map",
          anchor: "center",
        })
          .setLngLat(position) // 设置标记的经纬度坐标
          .addTo(map)
          .setOffset(offset);
        let dragStartOffset: { x: number; y: number };
        marker.on("dragstart", () => {
          dragStartOffset = marker.getOffset() as { x: number; y: number };
        });
        marker.on("drag", (e: any) => {
          let dragEndPoint = marker.getLngLat();
          let pt1 = map.project({ lng: position[0], lat: position[1] });
          let pt2 = map.project(dragEndPoint);
          let x = dragStartOffset.x + pt2.x - pt1.x;
          let y = dragStartOffset.y + pt2.y - pt1.y;
          marker.setOffset([x, y]);
          let line = $("#组网" + item.id).find(".connectingLine")[0];
          line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
            -y / 2
          }px) rotate(${Math.atan2(y, x)}rad)`;
          line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
          let station = $("#组网" + item.id).find(".station")[0];
          station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
          marker.setLngLat(position);
        });
        marker.on("dragend", (e: any) => {
          let dragEndPoint = e.target.getLngLat();
          let pt1 = map.project({ lng: position[0], lat: position[1] });
          let pt2 = map.project(dragEndPoint);
          let offset = marker.getOffset() as { x: number; y: number };
          let x = offset.x + pt2.x - pt1.x;
          let y = offset.y + pt2.y - pt1.y;
          marker.setOffset([x, y]);
          let line = $("#组网" + item.id).find(".connectingLine")[0];
          line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
            -y / 2
          }px) rotate(${Math.atan2(y, x)}rad)`;
          line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
          let station = $("#组网" + item.id).find(".station")[0];
          station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
          marker.setLngLat(position);
        });
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
          visibility: "visible",
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
      new Marker({
        draggable: false,
        pitchAlignment: "map",
        rotationAlignment: "map",
      })
        .setLngLat([102.04150296221326, 36.530313361869744])
        .addTo(map);
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
    for (let i = 0; i < 20; i++) {
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

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
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
      }
      processData(result);
    });
    xhr.responseType = "arraybuffer";
    xhr.open("GET", ppiData);
    xhr.send();
    function processData(result: any) {
      let polygons: any[] = [];
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
          let Angle1 = Number(List[i - 1].EarthAzimuth);
          let Angle2 = Number(List[i].EarthAzimuth);
          let Angle3 = Number(List[i + 1].EarthAzimuth);
          List[i].α = Math.min((Angle1 + Angle2) / 2, (Angle2 + Angle3) / 2);
          List[i].β = Math.max((Angle1 + Angle2) / 2, (Angle2 + Angle3) / 2);
        }
        //定义第一条径向位置
        let Angle1 = Number(List[0].EarthAzimuth);
        let Angle2 = Number(List[1].EarthAzimuth);
        List[0].α = Math.min(
          Angle1 - (Angle2 - Angle1) / 2,
          Angle1 + (Angle2 - Angle1) / 2
        );
        List[0].β = Math.max(
          Angle1 - (Angle2 - Angle1) / 2,
          Angle1 + (Angle2 - Angle1) / 2
        );
        //定义最后一条径向位置
        Angle1 = Number(List.slice(-2)[0].EarthAzimuth);
        Angle2 = Number(List.slice(-1)[0].EarthAzimuth);
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
        let Angle = Number(List[0].EarthAzimuth);
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
          polygons.push({
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                calculateSectorPoints(
                  wgs84togcj02(...[120.477398, 36.16953]) as [number, number],
                  radial.list[i].distance - BinLength / 2,
                  radial.list[i].distance + BinLength / 2,
                  angle1,
                  angle2,
                  360,
                  "meters"
                ),
              ],
            },
            properties: {
              fillColor:
                Math.abs(radial.list[i]["RadialWind(m/s)"]) == 999
                  ? "transparent"
                  : chromatographyRef.value.getColor(radial.list[i]["RadialWind(m/s)"]),
            },
          });
        }
      }
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
        paint: {
          "fill-color": ["get", "fillColor"],
          "fill-opacity": 0.8,
          "fill-outline-color": "transparent",
        },
      });
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
    function calculateSectorPoints(
      center: [number, number],
      radius1: number,
      radius2: number,
      startAngle: number,
      endAngle: number,
      steps: number,
      units: turf.Units
    ): [number, number][] {
      const points: [number, number][] = [];
      const angleStep = 360 / steps;
      let angle = startAngle;
      for (; angle < endAngle; angle += angleStep) {
        const point1 = turf.destination(center, radius1, angle, {
          units: units,
        }) as any;
        points.push(point1.geometry.coordinates);
      }
      const point1 = turf.destination(center, radius1, endAngle, {
        units: units,
      }) as any;
      points.push(point1.geometry.coordinates);

      angle = endAngle;
      for (; angle > startAngle; angle -= angleStep) {
        const point2 = turf.destination(center, radius2, angle, {
          units: units,
        }) as any;
        points.push(point2.geometry.coordinates);
      }
      const point2 = turf.destination(center, radius2, startAngle, {
        units: units,
      }) as any;
      points.push(point2.geometry.coordinates);

      points.push(points[0]);
      return points;
    }
    /*
    let breaks = [];
    for (let i = 1; i < 20; i++) {
      breaks.push(i * 50);
    }
    let fillColors = [];
    let strokeColors = [];
    let min = Math.min(...breaks);
    let max = Math.max(...breaks);
    for (let i = 0; i < breaks.length; i++) {
      strokeColors.push(breaks[i]);
      strokeColors.push(`hsl(${getHue(min, breaks[i], max)},100%,50%)`);
    }
    for (let i = 1; i < breaks.length; i++) {
      let h1 = getHue(min, breaks[i - 1], max);
      let h2 = getHue(min, breaks[i], max);
      fillColors.push(`${breaks[i - 1]}-${breaks[i]}`);
      fillColors.push(`hsl(${h2},100%,50%)`);
    }
    const points = turf.randomPoint(50, { bbox: [100, 35, 103, 38] });
    points.features.forEach(
      (pt: any) => (pt.properties.elevation = Math.random() * 1000)
    );
    const grid = turf.interpolate(points, 0.1, {
      gridType: "point", // 以点为基础进行插值
      property: "elevation", // 从点的属性中提取值
      units: "degrees", // 单位
      weight: 5, // 使用反距离加权进行插值
    });
    const isobands = turf.isobands(grid, [NaN, ...breaks], {
      zProperty: "elevation",
    });
    map.addLayer({
      id: "isobands-layer",
      type: "fill",
      source: {
        type: "geojson",
        data: isobands,
      },
      layout: {},
      paint: {
        "fill-color": ["match", ["get", "elevation"], ...fillColors, "transparent"],
        "fill-opacity": 0.5,
      },
    });
    const isolines = turf.isolines(grid, [NaN, ...breaks], {
      zProperty: "elevation",
    });
    map.addLayer({
      id: "isolines-layer",
      type: "line",
      source: {
        type: "geojson",
        data: isolines,
      },
      layout: {},
      paint: {
        "line-color": ["match", ["get", "elevation"], ...strokeColors, "transparent"],
        "line-width": 1,
        "line-opacity": 1,
      },
    });
    */
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
  });
  map.addControl(
    new NavigationControl({
      showCompass: true,
      showZoom: true,
    })
  );
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
  /*
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
  */
  map.repaint = false;
  map.on("zoom", zoomFunc);
  map.on("pitch", pitchFunc);
  map.on("move", moveFunc);
  eventbus.on("组网-将站点移动到屏幕中心", flyTo);
});

onBeforeUnmount(() => {
  clearInterval(timer);
  eventbus.off("组网-将站点移动到屏幕中心", flyTo);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("pitch", pitchFunc);
  map.remove();
});
watch(
  () => props.district,
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
.deviceStation_组网 {
  box-sizing: border-box;
  position: absolute;
  font-size: 14px;
  filter: drop-shadow(#00000088 0 0 1px);
  &:hover,
  &:active {
    filter: drop-shadow(#000000 2px 2px);
  }
  .connectingLine {
    position: absolute;
    height: 4px;
    z-index: -1;
    clip-path: polygon(0% 50%, 100% 100%, 100% 0%, 0% 50%);
  }
  .label {
    position: relative;
    color: black;
    padding: 4px;
    background-color: #ffffff;
    border-radius: 4px;
  }
  .station {
    width: 8px;
    height: 8px;
    position: absolute;
    border-radius: 50%;
    border: 1px solid black;
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
