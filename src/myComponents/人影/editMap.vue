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
  </div>
</template>
<script setup lang="ts">
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
  // //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  // return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
  //hsl(240,100%,50%)～hsl(180,100%,50%)
  // return (1 - percent) * 60 + 180;
  //hsl(60,100%,50%)～hsl(0,100%,50%)
  return (1 - percent) * 60;
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
  }>(),
  {
    routeLine: true,
    zyd: true,
    loadmap: true,
    district: true,
    tile: "街道地图",
    center: [0, 0],
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
    performanceMetricsCollection: false,
    style,
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
    center: props.center,
    pitch: props.pitch,
  });
  map.on("load", async () => {
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
    let breaks = [];
    for (let i = 1; i < 20; i++) {
      breaks.push(i * 5);
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

    let row1 = [
      { x: 100, y: 35, value: 100 },
      { x: 101, y: 35, value: 100 },
      { x: 102, y: 35, value: 100 },
      { x: 103, y: 35, value: 100 },
      { x: 104, y: 35, value: 100 },
      { x: 105, y: 35, value: 100 },
      { x: 106, y: 35, value: 100 },
      { x: 107, y: 35, value: 100 },
    ];
    let row2 = [
      { x: 100, y: 36, value: 100 },
      { x: 101, y: 36, value: 0 },
      { x: 102, y: 36, value: 0 },
      { x: 103, y: 36, value: 0 },
      { x: 104, y: 36, value: 0 },
      { x: 105, y: 36, value: 0 },
      { x: 106, y: 36, value: 0 },
      { x: 107, y: 36, value: 100 },
    ];
    let row3 = [
      { x: 100, y: 37, value: 100 },
      { x: 101, y: 37, value: 0 },
      { x: 102, y: 37, value: 100 },
      { x: 103, y: 37, value: 100 },
      { x: 104, y: 37, value: 100 },
      { x: 105, y: 37, value: 100 },
      { x: 106, y: 37, value: 0 },
      { x: 107, y: 37, value: 100 },
    ];
    let row4 = [
      { x: 100, y: 38, value: 100 },
      { x: 101, y: 38, value: 0 },
      { x: 102, y: 38, value: 100 },
      { x: 103, y: 38, value: 0 },
      { x: 104, y: 38, value: 0 },
      { x: 105, y: 38, value: 100 },
      { x: 106, y: 38, value: 0 },
      { x: 107, y: 38, value: 100 },
    ];
    let row5 = [
      { x: 100, y: 39, value: 100 },
      { x: 101, y: 39, value: 0 },
      { x: 102, y: 39, value: 100 },
      { x: 103, y: 39, value: 0 },
      { x: 104, y: 39, value: 0 },
      { x: 105, y: 39, value: 100 },
      { x: 106, y: 39, value: 0 },
      { x: 107, y: 39, value: 100 },
    ];
    let row6 = [
      { x: 100, y: 40, value: 100 },
      { x: 101, y: 40, value: 0 },
      { x: 102, y: 40, value: 100 },
      { x: 103, y: 40, value: 100 },
      { x: 104, y: 40, value: 100 },
      { x: 105, y: 40, value: 100 },
      { x: 106, y: 40, value: 0 },
      { x: 107, y: 40, value: 100 },
    ];
    let row7 = [
      { x: 100, y: 41, value: 100 },
      { x: 101, y: 41, value: 0 },
      { x: 102, y: 41, value: 0 },
      { x: 103, y: 41, value: 0 },
      { x: 104, y: 41, value: 0 },
      { x: 105, y: 41, value: 0 },
      { x: 106, y: 41, value: 0 },
      { x: 107, y: 41, value: 100 },
    ];
    let row8 = [
      { x: 100, y: 42, value: 100 },
      { x: 101, y: 42, value: 100 },
      { x: 102, y: 42, value: 100 },
      { x: 103, y: 42, value: 100 },
      { x: 104, y: 42, value: 100 },
      { x: 105, y: 42, value: 100 },
      { x: 106, y: 42, value: 100 },
      { x: 107, y: 42, value: 100 },
    ];
    let pts = [
      // ...row1,
      // ...row2,
      // ...row3,
      // ...row4,
      // ...row4,
      // ...row5,
      // ...row6,
      // ...row7,
      // ...row8,
    ];
    for (let i = 0; i < 100; i++) {
      pts.push({
        lng: Math.random() * 360 - 180,
        lat: Math.random() * LAT * 2 - LAT,
        value: Math.random() * 100,
      });
    }
    // console.log(pts);
    pts = [
      {
        lng: -106.22893899999623,
        lat: -16.98618671050494,
        value: 89.69403167866226,
      },
      {
        lng: 94.96209748323668,
        lat: -36.98899464045559,
        value: 60.13130034510361,
      },
      {
        lng: -165.2909434905032,
        lat: -69.3306560115242,
        value: 77.29267887835638,
      },
      {
        lng: -23.311497458857673,
        lat: 39.49829762186698,
        value: 18.19616530711594,
      },
      {
        lng: 144.0332701765493,
        lat: -12.281319241625212,
        value: 13.946779461601766,
      },
      {
        lng: 13.697795942133126,
        lat: -83.48561082560369,
        value: 95.42971251833721,
      },
      {
        lng: -117.1974769099329,
        lat: 45.05183187085788,
        value: 24.21870020227148,
      },
      {
        lng: -99.5257139319269,
        lat: 66.55141324309511,
        value: 68.8523701075753,
      },
      {
        lng: -90.89480986962874,
        lat: 17.957831839420365,
        value: 28.194474264182045,
      },
      {
        lng: -91.49019545444648,
        lat: 36.29772919307162,
        value: 88.48126432048143,
      },
      {
        lng: -147.7565748757747,
        lat: 69.90112301435255,
        value: 34.907491808213905,
      },
      {
        lng: -13.328571352523795,
        lat: -36.58877287063224,
        value: 68.07691530196766,
      },
      {
        lng: 147.1244454370932,
        lat: 50.43692697872507,
        value: 77.97103994165812,
      },
      {
        lng: 40.7484869066723,
        lat: 46.32299482342859,
        value: 48.36124342458474,
      },
      {
        lng: 156.62720132346772,
        lat: -15.47023493308518,
        value: 1.2685480021358053,
      },
      {
        lng: 2.064997013133592,
        lat: -8.607549224578648,
        value: 11.83035281520317,
      },
      {
        lng: 135.37999609977294,
        lat: 83.67842549672673,
        value: 5.680895742450653,
      },
      {
        lng: 64.40762199376661,
        lat: 78.60870571779577,
        value: 84.6926511878187,
      },
      {
        lng: 73.1179024371321,
        lat: 2.6360473385639267,
        value: 95.544299698461,
      },
      {
        lng: -94.36477825640985,
        lat: -82.03314874213203,
        value: 18.48554910223241,
      },
      {
        lng: 20.49291997440031,
        lat: -4.39476349742246,
        value: 56.01502026368899,
      },
      {
        lng: -46.44763497847728,
        lat: -3.704755104233655,
        value: 67.01389025456257,
      },
      {
        lng: 159.63457173852686,
        lat: -46.58222560622812,
        value: 69.8472795394965,
      },
      {
        lng: 29.608974741412112,
        lat: 26.52850319541713,
        value: 71.99204613829511,
      },
      {
        lng: -35.004953172172065,
        lat: 25.332114262106188,
        value: 66.89285534571529,
      },
      {
        lng: 120.72210134539102,
        lat: -61.34620633030423,
        value: 31.200167241878262,
      },
      {
        lng: -3.281432974443476,
        lat: 42.99020814767604,
        value: 29.66619687721743,
      },
      {
        lng: -164.0576147879493,
        lat: -45.087447898134315,
        value: 3.5744219240443353,
      },
      {
        lng: -66.11707885233015,
        lat: 35.92174254442362,
        value: 43.615884024643,
      },
      {
        lng: 58.3308552163015,
        lat: 28.45395690086201,
        value: 43.72418430999196,
      },
      {
        lng: 91.81021288211093,
        lat: -7.313748248898563,
        value: 14.091772662650005,
      },
      {
        lng: 164.79143060436132,
        lat: 71.84728443515866,
        value: 61.29434732254886,
      },
      {
        lng: -29.515409578241076,
        lat: -66.74817245348478,
        value: 49.15714326177585,
      },
      {
        lng: -131.98831840911845,
        lat: -39.47004711051624,
        value: 36.766913190302475,
      },
      {
        lng: 32.32420415280396,
        lat: -45.47336498103094,
        value: 62.524223951105526,
      },
      {
        lng: 65.2319331074784,
        lat: 76.98015059419055,
        value: 81.8746751232797,
      },
      {
        lng: -70.10245413409723,
        lat: -17.107178302262597,
        value: 34.97602278053043,
      },
      {
        lng: -122.07921596710861,
        lat: -45.46163748174102,
        value: 56.238444026623455,
      },
      {
        lng: 178.425620179225,
        lat: 62.89942365182324,
        value: 10.83659212839596,
      },
      {
        lng: 13.470281073847161,
        lat: -49.42080376941178,
        value: 25.845873268785713,
      },
      {
        lng: -118.66696243331155,
        lat: 13.477984189693586,
        value: 59.50422221122693,
      },
      {
        lng: 35.72939220303502,
        lat: 75.10447614615887,
        value: 14.401224846791049,
      },
      {
        lng: 32.82110853024045,
        lat: 42.39657847143394,
        value: 6.0908812591184525,
      },
      {
        lng: 32.18200856034903,
        lat: 82.62275225670919,
        value: 56.13492601810759,
      },
      {
        lng: 90.22778186854828,
        lat: -52.326915527050645,
        value: 38.40298146697181,
      },
      {
        lng: 80.0659526998814,
        lat: 63.13262480645406,
        value: 14.414397023663096,
      },
      {
        lng: 160.15431572179875,
        lat: 73.46936391118061,
        value: 79.05913391565653,
      },
      {
        lng: -66.13866291798638,
        lat: 59.012288288468255,
        value: 2.399427355706041,
      },
      {
        lng: -169.8511282959964,
        lat: -22.705943687485927,
        value: 66.5375106361122,
      },
      {
        lng: -22.695110530347193,
        lat: 13.205437690002142,
        value: 98.93183714017064,
      },
      {
        lng: -36.62669944275194,
        lat: -31.65901636442804,
        value: 52.91331647232917,
      },
      {
        lng: 42.57417955846515,
        lat: -63.52823909644481,
        value: 48.55879258492484,
      },
      {
        lng: -85.0321573626497,
        lat: -45.6761007663245,
        value: 75.35090112064265,
      },
      {
        lng: -134.7001565973385,
        lat: -47.931093699671045,
        value: 91.32105103414297,
      },
      {
        lng: -116.40911794083976,
        lat: -35.88569905673929,
        value: 79.41956145625953,
      },
      {
        lng: -118.46232911910705,
        lat: 28.005308619166314,
        value: 0.894147329121675,
      },
      {
        lng: -47.73735684461869,
        lat: -84.3520858504268,
        value: 77.62813091877652,
      },
      {
        lng: 82.24843703510186,
        lat: -35.18344610517943,
        value: 15.73897419633392,
      },
      {
        lng: 152.97417186195122,
        lat: 28.25766825396471,
        value: 40.12679015135527,
      },
      {
        lng: -66.82611706786571,
        lat: 68.38036531491224,
        value: 67.99873227728301,
      },
      {
        lng: -176.57396973590727,
        lat: 84.9497668365949,
        value: 78.95159980589932,
      },
      {
        lng: 173.03105483284628,
        lat: 17.944521226043918,
        value: 42.16096456592948,
      },
      {
        lng: 12.646791548045456,
        lat: 47.51683191312344,
        value: 61.095402534211374,
      },
      {
        lng: -21.36149159605239,
        lat: 4.683747395754196,
        value: 44.90758800913872,
      },
      {
        lng: -46.24794956100183,
        lat: 62.03508888706125,
        value: 53.43629170894366,
      },
      {
        lng: -72.02580503899458,
        lat: 67.49954602097276,
        value: 95.95646099107593,
      },
      {
        lng: 106.44446714929944,
        lat: 41.43771278607147,
        value: 66.14056661431236,
      },
      {
        lng: -65.3827167500025,
        lat: -1.873837767103069,
        value: 8.400359432229521,
      },
      {
        lng: -75.27518165128451,
        lat: 50.772565120309395,
        value: 97.96023950160775,
      },
      {
        lng: -115.81434750218236,
        lat: 18.049654029595544,
        value: 3.781351406504063,
      },
      {
        lng: 147.22909115082155,
        lat: -80.95944190418385,
        value: 92.08441996712683,
      },
      {
        lng: 20.467460079104114,
        lat: 35.56331022971865,
        value: 45.65819874022758,
      },
      {
        lng: -128.14264741258026,
        lat: -71.14679887261606,
        value: 78.53140798522608,
      },
      {
        lng: 26.106575935315874,
        lat: 19.17704690977726,
        value: 55.11356011772581,
      },
      {
        lng: -18.873593837855424,
        lat: -51.94866798445725,
        value: 44.22508713084068,
      },
      {
        lng: -73.6287384229719,
        lat: 46.61924019182817,
        value: 29.52280967023495,
      },
      {
        lng: 101.68405751744035,
        lat: 80.82827275331263,
        value: 26.915698733761207,
      },
      {
        lng: 6.700811489835019,
        lat: -67.21565752682332,
        value: 91.61472863574724,
      },
      {
        lng: 178.32394367311161,
        lat: 71.51308167104631,
        value: 31.532755766151777,
      },
      {
        lng: 99.40457543264432,
        lat: 37.40161909117252,
        value: 63.97862272293955,
      },
      {
        lng: -178.61460224930397,
        lat: -72.77890738184259,
        value: 33.242801186513724,
      },
      {
        lng: 49.59103593953657,
        lat: -13.705691259313468,
        value: 77.09289851040279,
      },
      {
        lng: 82.02637536114821,
        lat: 17.100768047459027,
        value: 27.677564565031055,
      },
      {
        lng: -113.43757417405548,
        lat: 25.32069931655343,
        value: 30.909656380170514,
      },
      {
        lng: 35.04250050215259,
        lat: -9.076235298034348,
        value: 76.50121643305334,
      },
      {
        lng: 12.132263223327385,
        lat: 63.93930786816233,
        value: 86.69308076890461,
      },
      {
        lng: 91.60087057696268,
        lat: 19.55305206870868,
        value: 50.090680851536185,
      },
      {
        lng: 15.432597792917534,
        lat: 83.53141068467104,
        value: 74.28252442749026,
      },
      {
        lng: 90.8861380295262,
        lat: 31.29808430942498,
        value: 68.84133664442153,
      },
      {
        lng: -92.53491800893843,
        lat: -51.501382365091054,
        value: 10.27973993327096,
      },
      {
        lng: 61.079071114361966,
        lat: 4.994256685560217,
        value: 11.588778405342271,
      },
      {
        lng: 40.421963838282295,
        lat: -70.18588969594086,
        value: 8.947439306603687,
      },
      {
        lng: -92.58975887524466,
        lat: -6.533408632452179,
        value: 96.69667182194077,
      },
      {
        lng: 141.46984843509154,
        lat: -26.226206348882755,
        value: 13.009483987809368,
      },
      {
        lng: -42.701836309117056,
        lat: 29.342032006702027,
        value: 84.07560711226209,
      },
      {
        lng: -124.16999694608076,
        lat: 72.00901736653532,
        value: 70.70183153628,
      },
      {
        lng: 37.96753803965345,
        lat: 35.335525807562675,
        value: 72.22706783590407,
      },
      {
        lng: -100.12462203815049,
        lat: -30.974357100869895,
        value: 64.12772897241763,
      },
      {
        lng: 169.03800713619603,
        lat: -14.081851975436948,
        value: 69.07998482397866,
      },
      {
        lng: 156.68354454307416,
        lat: 58.80746799399353,
        value: 67.15899240351433,
      },
    ];
    let interpolateOptions = {
      sizeU: 10,
      sizeV: 10,
      boundary: {
        x: -180,
        y: -LAT,
        width: 360,
        height: LAT * 2,
      },
      power: 2,
    };
    let grid = interpolate(pts, interpolateOptions);
    function area(vertices: Array<[number, number]>) {
      let area = 0;
      for (let i = 0; i < vertices.length; i++) {
        let current = vertices[i];
        let next = vertices[(i + 1) % vertices.length];
        area += next[0] * current[1] - current[0] * next[1];
      }
      return area / 2;
    }
    function pointInPolygon(point: [number, number], polygon: Array<[number, number]>) {
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0],
          yi = polygon[i][1];
        let xj = polygon[j][0],
          yj = polygon[j][1];
        let intersect =
          yi > point[1] != yj > point[1] &&
          point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }

    var bandWidths = breaks.reduce(function (bw, upperBand, i, intervals) {
      if (i > 0) {
        var lowerBand = intervals[i - 1];
        bw.push(upperBand - lowerBand);
      }
      return bw;
    }, new Array<number>());
    var multiBands = isoBands(grid, breaks.slice(0, -1), bandWidths);
    let isobands = {
      type: "FeatureCollection",
      features: new Array<any>(),
    };
    for (let j = 0; j < multiBands.length; j++) {
      if (9 < j && j < 11) {
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
                interpolateOptions.boundary.x,
              (point[1] / (interpolateOptions.sizeV - 1)) *
                interpolateOptions.boundary.height +
                interpolateOptions.boundary.y,
            ]);
          });
          if (area(points) > 0) {
            polygons.push(points);
          } else {
            holes.push(points);
          }
        }
        // for (let k = 0; k < polygons.length; k++) {
        //   let polygon = polygons.splice(k--, 1)[0];
        //   let tmp = [polygon];
        //   for (let m = 0; m < holes.length; m++) {
        //     if (
        //       pointInPolygon(holes[m][0], polygon) &&
        //       polygons.every((item: any) => !pointInPolygon(holes[m][0], item))
        //     ) {
        //       let hole = holes.splice(m--, 1)[0];
        //       tmp.push(hole);
        //     }
        //   }
        //   feature.geometry.coordinates.push(tmp);
        // };
        for (let i = 0; i < polygons.length; i++) {
          if (i == 0) {
            let polygon = polygons[i];
            polygon.splice(32, 1);
            console.log(polygon[0], polygon.slice(-1)[0]);
            feature.geometry.coordinates.push([polygon]);
          }
        }
        isobands.features.push(feature);
      }
    }
    console.log(isobands);
    map.addLayer({
      id: "isobands-layer",
      type: "fill",
      source: {
        type: "geojson",
        data: isobands,
      },
      layout: {},
      paint: {
        "fill-color": ["match", ["get", "threshold"], ...fillColors, "transparent"],
        "fill-opacity": 0.2,
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
    for (let j = 0; j < multiLines.length; j++) {
      let feature = {
        type: "Feature",
        properties: { threshold: breaks[j] },
        geometry: {
          type: "MultiLineString",
          coordinates: new Array<any>(),
        },
      };
      for (let i = 0; i < multiLines[j].length; i++) {
        let lines = new Array<any>();
        multiLines[j][i].map((point: [number, number]) => {
          lines.push([
            (point[0] / (interpolateOptions.sizeU - 1)) *
              interpolateOptions.boundary.width +
              interpolateOptions.boundary.x,
            (point[1] / (interpolateOptions.sizeV - 1)) *
              interpolateOptions.boundary.height +
              interpolateOptions.boundary.y,
          ]);
        });
        feature.geometry.coordinates.push(lines);
      }
      isolines.features.push(feature);
    }
    map.addLayer({
      id: "isolines-layer",
      type: "line",
      source: {
        type: "geojson",
        data: isolines,
      },
      layout: {},
      paint: {
        "line-color": ["match", ["get", "threshold"], ...strokeColors, "transparent"],
        "line-width": 1,
        "line-opacity": 1,
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
          interpolateOptions.boundary.x;
        let y =
          (j / (interpolateOptions.sizeV - 1)) * interpolateOptions.boundary.height +
          interpolateOptions.boundary.y;
        gridPoints.features.push({
          type: "Feature",
          properties: {
            threshold: grid[j][i].toFixed(2),
            color: "white" || `hsl(${getHue(min, grid[j][i].toFixed(2), max)},100%,50%)`,
          },
          geometry: {
            type: "Point",
            coordinates: [x, y],
          },
        });
      }
    }
    map.addLayer({
      id: "格点值",
      type: "symbol",
      source: { type: "geojson", data: gridPoints },
      layout: {
        "text-field": ["get", "threshold"],
        "text-font": ["simkai"],
        "text-offset": [0, 0.2],
        "text-anchor": "top",
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
      console.log(JSON.stringify(list));
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
