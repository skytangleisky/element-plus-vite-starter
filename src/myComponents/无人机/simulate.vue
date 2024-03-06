<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
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
    <Dialog class="absolute" style="left: 10px; top: 10px"></Dialog>
    <!-- <graph
      v-if="DEV"
      class="absolute left-0 bottom-30px"
      v-model:args="graphArgs"
    ></graph> -->
  </div>
</template>
<script setup>
import * as turf from "@turf/turf";
import { addFeatherImages, getFeather } from "~/tools";
import { getLngLat } from "~/myComponents/map/js/core.js";
import { watch, ref, onMounted, onBeforeUnmount, reactive, onActivated } from "vue";
import { useBus } from "~/myComponents/bus";
import Dialog from "../空域列表.vue";
import { eventbus } from "~/eventbus";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// var a = turf.sector(turf.point([-75, 40]), 100, 0, 360);
// console.log(a);
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.scss";
import { 获取净空区, saveData, deleteData } from "~/api/无人机/api";
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
import { useRoute } from "vue-router";
const route = useRoute();
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import style from "./simulate.js";
let enclosureList = [];
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
  setting.无人机.模拟.zoom = map.getZoom();
};
const moveFunc = () => {
  let center = map.getCenter();
  setting.无人机.模拟.center = [center.lng, center.lat];
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
// task();
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
    // projection: "globe",
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
    zoom: setting.无人机.模拟.zoom,
    center: setting.无人机.模拟.center,
    pitch: 0,
  });
  map.addControl(
    new mapboxgl.NavigationControl({
      showCompass: false,
      showZoom: true,
    })
  );
  // map.addControl(new mapboxgl.ScaleControl());
  map.addControl(new mapboxgl.FullscreenControl());
  var Draw = new MapboxDraw({
    userProperties: true,
    displayControlsDefault: true,
    controls: {
      point: false,
      circle: true,
      line_string: false,
      polygon: false,
      trash: true,
      combine_features: false,
      uncombine_features: false,
    },
  });
  map.addControl(Draw, "top-right");
  //添加空域
  map.on("draw.create", function (e) {
    let data = [];
    e.features.map((item) => {
      if (item.geometry.type === "Point") {
        data.push({
          id: item.id,
          enclosure_type: "06",
          line_width: 0,
          points: item.geometry.coordinates.join(",") + ";",
        });
      } else if (item.geometry.type === "LineString") {
        console.log(item);
        data.push({
          id: item.id,
          enclosure_type: "00",
          line_width: 0,
          points: item.geometry.coordinates.map((v) => v.join(",")).join(";") + ";",
        });
      } else if (item.geometry.type === "Polygon") {
        if (item.properties.isCircle) {
          data.push({
            id: item.id,
            enclosure_type: "03",
            line_width: 0,
            circle_center: item.properties.center.join(",") + ";",
            radius: item.properties.radiusInKm * 1000,
            points: item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
          });
        } else {
          data.push({
            id: item.id,
            enclosure_type: "02",
            line_width: 0,
            points: item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
          });
        }
      }
    });
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
  map.on("draw.delete", function (e) {
    let data = [];
    e.features.map((v) => {
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
  map.on("draw.update", function (e) {
    let data = [];
    e.features.map((item) => {
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
              points: item.geometry.coordinates.map((v) => v.join(",")).join(";") + ";",
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
                  item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
              })
            );
          } else {
            data.push(
              Object.assign(tmp[0], {
                id: item.id,
                points:
                  item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
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
  map.on("draw.selectionchange", function (e) {
    console.log(e);
  });
  map.on("draw.combine", function (e) {
    console.log(e);
  });
  map.on("draw.uncombine", function (e) {
    console.log(e);
  });
  获取净空区().then((res) => {
    let a = {
      type: "FeatureCollection",
      features: [],
    };
    console.log(res.data.results);
    enclosureList = res.data.results;
    for (let i = 0; i < res.data.results.length; i++) {
      let v = res.data.results[i];
      let strLngLatList = v.points.match(
        RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g)
      );
      let list = strLngLatList.map((item) => [
        Number(item.match(RegExp(/(\-|\+)?\d+(\.\d+)?(?=,)/))[0]),
        Number(item.match(RegExp(/(?<=,)(\-|\+)?\d+(\.\d+)?/))[0]),
      ]);
      if (v.enclosure_type == "06") {
        a.features.push({
          id: v.id,
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: list[0],
          },
        });
      } else if (v.enclosure_type == "00") {
        a.features.push({
          id: v.id,
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: list,
          },
        });
      } else if (v.enclosure_type == "02") {
        if (list.length > 2) {
          a.features.push({
            id: v.id,
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          });
        } else {
          console.error("v.enclosure_type == 02," + "list.length=" + list.length);
        }
      } else if (v.enclosure_type == "03") {
        if (v.circle_center) {
          let center = v.circle_center
            .match(RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g))[0]
            .split(",")
            .map((v) => Number(v));
          a.features.push({
            id: v.id,
            type: "Feature",
            properties: {
              isCircle: true,
              center,
              radiusInKm: v.radius / 1000,
            },
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          });
        } else {
          console.error("v.circle_center=" + v.circle_center);
        }
      }
    }
    Draw.add(a);
    // {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       //"id": "the most unique id in the world",
    //       properties: {
    //         class_id: 1,
    //       },
    //       geometry: {
    //         type: "Polygon",
    //         coordinates: [
    //           [
    //             [0, 0],
    //             [100, 0],
    //             [100, 60],
    //             [0, 60],
    //             [0, 0],
    //           ],
    //         ],
    //       },
    //     },
    //   ],
    // }
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
  () => setting.无人机.模拟.district,
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
  () => setting.无人机.模拟.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
  }
);
</script>
<style scoped lang="scss">
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
