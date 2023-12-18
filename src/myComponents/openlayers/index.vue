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
    <radar-statistic></radar-statistic>
    <Legend></Legend>
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
  </div>
</template>
<script setup>
import "../mapbox/mapbox-gl.css";
import "../mapbox/mapbox-gl.js";
import { getCoord, loadImage, getFeather } from "~/tools";
import imageUrl from "~/assets/feather.svg?url";
import { getLngLat } from "~/myComponents/map/js/core.js";
import {
  onMounted,
  onBeforeUnmount,
  watch,
  ref,
  computed,
  h,
  onActivated,
  onDeactivated,
} from "vue";
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
import { eventbus } from "~/eventbus";
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
import { storeToRefs } from "pinia";
import Legend from "./legend.vue";
import style from "./streets-v11.js";
import { point } from "@turf/turf";

console.log("route.query", route.query);
const station = useStationStore();
/** @type {import('ol/style/literal.js').LiteralStyle} */

const mapRef = ref(null);
const popup = ref(null);
const popup_closer = ref(null);
const disappear = (e) => {
  setting.disappear = !setting.disappear;
};
let timer;
onMounted(() => {
  let map = new mapboxgl.Map({
    container: mapRef.value,
    // style: raster,
    performanceMetricsCollection: false,
    style,
    // dragRotate: false,
    // touchRotate: false,
    // bounds: turf.bbox(boundaries),
    // localIdeographFontFamily: "Microsoft YoHei",
    localIdeographFontFamily: "",
    antialias: true,
    renderWorldCopies: true,
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
  map.on("zoom", () => {
    setting.openlayers.zoom = map.getZoom();
  });
  map.on("move", () => {
    let center = map.getCenter();
    setting.openlayers.center = [center.lng, center.lat];
  });
  map.on("load", () => {
    map.addSource("point", points);
    map.addLayer({
      id: "stationLayer",
      source: "point",
      type: "circle",
      paint: {
        "circle-radius": [
          "interpolate",
          ["exponential", 1.5],
          ["zoom"],
          15,
          4.5,
          16,
          8,
          18,
          20,
          22,
          200,
        ],
        "circle-color": ["get", "color"],
        "circle-stroke-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0.8,
          16,
          1.2,
          18,
          2,
        ],
        // "circle-stroke-color": "hsl(220, 20%, 85%)",
        "circle-pitch-alignment": "map",
      },
      filter: ["==", ["get", "type"], "站点"],
      layout: {
        visibility: setting.station ? "visible" : "none",
      },
    });
    loadImage(imageUrl, 340, 188, {
      feather0: getCoord(0, 0, 0),
      feather1: getCoord(1, 0, 1),
      feather2: getCoord(2, 0, 2),
      feather4: getCoord(3, 0, 3),
      feather6: getCoord(4, 0, 6),
      feather8: getCoord(5, 0, 8),
      feather10: getCoord(6, 0, 10),
      feather12: getCoord(7, 0, 12),
      feather14: getCoord(8, 0, 14),
      feather16: getCoord(9, 0, 16),
      feather18: getCoord(0, 1, 18),
      feather20: getCoord(1, 1, 20),
      feather22: getCoord(2, 1, 22),
      feather24: getCoord(3, 1, 24),
      feather26: getCoord(4, 1, 26),
      feather28: getCoord(5, 1, 28),
      feather30: getCoord(6, 1, 30),
      feather32: getCoord(7, 1, 32),
      feather34: getCoord(8, 1, 34),
      feather36: getCoord(9, 1, 36),
      feather38: getCoord(0, 2, 38),
      feather40: getCoord(1, 2, 40),
      feather42: getCoord(2, 2, 42),
      feather44: getCoord(3, 2, 44),
      feather46: getCoord(4, 2, 46),
      feather48: getCoord(5, 2, 48),
      feather50: getCoord(6, 2, 50),
      feather52: getCoord(7, 2, 52),
      feather54: getCoord(8, 2, 54),
      feather56: getCoord(9, 2, 56),
      feather58: getCoord(0, 3, 58),
      feather60: getCoord(1, 3, 60),
    }).then((result) => {
      for (let k in result) {
        map.addImage(k, result[k]);
      }
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
          // "text-size": 20,
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
          "text-size": 20,
          "text-transform": "uppercase",
          // "text-letter-spacing": 0.05,
          "text-anchor": "center",
          "text-line-height": 1,
          "text-offset": [0, -1.2],
          "text-ignore-placement": true,
          "text-allow-overlap": true,
          "text-rotation-alignment": "map",
        },
        paint: {
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
          "text-size": 20,
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
          "text-size": 20,
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
    });
  });
  eventbus.on("将站点移动到屏幕中心", flyTo);
  const container = popup.value;
  const closer = popup_closer.value;
  closer.onclick = function () {
    selected = null;
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
  watch(
    () => station.result,
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

        // 模拟
        // if (i == 0)
        //   points.data.features[i].properties.radar_id =
        //     "7dad08b8-2c89-47d4-9698-7e885090c3f6";
      }
      let source = map.getSource("point");
      source && source.setData(points.data);
      if (data.length) {
        station
          .查询平均风数据接口({
            user_id: route.query.user_id,
            // date: new Date().Format("yyyyMMdd"),
          })
          .then((res) => {
            station.avgWindData = res.data.data;
          });
        station
          .查询瞬时风数据接口({
            user_id: route.query.user_id,
            // date: new Date().Format("yyyyMMdd"),
          })
          .then((res) => {
            station.secondWindData = res.data.data;
          });
        station
          .查询径向风数据接口({
            user_id: route.query.user_id,
            // date: new Date().Format("yyyyMMdd"),
          })
          .then((res) => {
            station.radialWindData = res.data.data;
          });
      }
    },
    { deep: true, immediate: false }
  );
  map.on("click", "stationLayer", (e) => {
    if (e.features) {
      setting.disappear = false;
      station.active = -1;
      for (let i = 0; i < station.result.length; i++) {
        console.log(station.result[i].radar.name);
        if (station.result[i].radar.radar_id == e.features[0].properties.radar_id) {
          station.active = i;
        }
      }
    }
  });
  watch(
    [
      storeToRefs(station).avgWindData,
      storeToRefs(station).result,
      storeToRefs(station).active,
    ],
    ([avgWindData]) => {
      if (avgWindData) {
        avgWindData.forEach((v) => {
          for (let radar_id in v) {
            //删除相关站点的风羽
            for (let i = 0; i < points.data.features.length; i++) {
              if (
                radar_id == points.data.features[i].properties.radar_id &&
                points.data.features[i].properties.type == "风羽"
              ) {
                points.data.features.splice(i, 1);
              }
            }
            //计算风羽的位置并添加
            for (let i = 0; i < points.data.features.length; i++) {
              if (
                radar_id == points.data.features[i].properties.radar_id &&
                points.data.features[i].properties.type == "站点"
              ) {
                let lngLat = points.data.features[i].geometry.coordinates;
                let tmp = v[radar_id];
                for (let k in tmp[0]) {
                  let tmp2 = tmp[0][k].slice().reverse();
                  tmp2.forEach((tmp3) => {
                    for (let k in tmp3) {
                      let item = tmp3[k];
                      let ll = getLngLat(lngLat[0], lngLat[1], item.north_a, Number(k));
                      lngLat = [ll.lng, ll.lat];
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
                            coordinates: lngLat,
                          },
                        });
                      }
                    }
                    let source = map.getSource("point");
                    source.setData(points.data);
                  });
                }
              }
            }
          }
          // source3.getFeatures().forEach((feature) => {
          //   let tmp = v[feature.get("radar_id")];
          //   if (tmp) {
          //     for (let k in tmp[0]) {
          //       let tmp2 = tmp[0][k].slice().reverse()[0];
          //       if (tmp2) {
          //         for (let key in tmp2) {
          //           feature.set("distance", tmp2[key].distance.toFixed(1));
          //           feature.set("ex_temp", tmp2[key].ex_temp.toFixed(2));
          //           if (tmp2[key].ex_hum == -1) {
          //             feature.set("ex_hum", undefined);
          //           } else {
          //             feature.set("ex_hum", tmp2[key].ex_hum.toFixed(2));
          //           }
          //           if (setting.factor[10].val) {
          //             feature.getStyle()[5].getText().setText(feature.get("distance"));
          //           } else {
          //             feature.getStyle()[5].getText().setText(undefined);
          //           }
          //           if (setting.factor[7].val) {
          //             feature.getStyle()[8].getText().setText(feature.get("ex_temp"));
          //           } else {
          //             feature.getStyle()[8].getText().setText(undefined);
          //           }
          //           if (setting.factor[9].val) {
          //             feature.getStyle()[10].getText().setText(feature.get("ex_hum"));
          //           } else {
          //             feature.getStyle()[10].getText().setText(undefined);
          //           }
          //           feature.changed();
          //         }
          //       } else {
          //         for (let key in tmp2) {
          //           feature.getStyle()[5].getText().setText(undefined);
          //           feature.getStyle()[8].getText().setText(undefined);
          //           feature.getStyle()[10].getText().setText(undefined);
          //           feature.changed();
          //         }
          //       }
          //     }
          //   }
          // });
        });
      }
    }
  );
  function flyTo(v) {
    console.log(v);
    let zoom = map.getView().getZoom();
    const duration = 2000;
    // map.getView().animate({
    //   center:fromLonLat([110,30]),
    //   duration:2000
    // })
    map.getView().cancelAnimations();
    map.getView().animate({
      center: fromLonLat([v.longitude, v.latitude]),
      duration: duration,
      // easing: linear,
    });
    // map.getView().animate(
    //   {
    //     zoom: 6,
    //     duration: duration/2,
    //   },
    //   {
    //     zoom: 7,
    //     duration: duration/2,
    //   }
    // )
  }
  // map.addControl(new FullScreen());
  let selected = null;
  const pointermoveFunc = (evt) => {
    selected && selected.set("hover", 0);
    map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      if (feature.get("station")) {
        if (selected != feature) {
          console.log("enter");
          // const coordinate = evt.coordinate;
          // const hdms = toStringHDMS(toLonLat(coordinate));
          feature.set("hover", 1);
          //   const hdms = toStringHDMS(feature.get('coords'));
          info.value.time = feature.get("time");
          info.value.title = feature.get("name");
          info.value.status = feature.get("is_online");
          info.value.speed = feature.get("speed");
          info.value.longitude = feature.get("coords")[0] + "°";
          info.value.latitude = feature.get("coords")[1] + "°";
          info.value.deg = ((feature.get("rad") * 180) / Math.PI).toFixed(2);
          overlay.setPosition(fromLonLat(feature.get("coords")));
          //   const datetime = feature.get('datetime');
          //   const duration = feature.get('duration');
          //   const shape = feature.get('shape');
          //   return `On ${datetime}, lasted ${duration} seconds and had a "${shape}" shape.`;
        }
        selected = feature;
        selected.set("hover", 1);
      }
    });
  };
  const pointerdownFunc = (evt) => {
    if (map.getView().getInteracting() || map.getView().getAnimating()) {
      return;
    }
    map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      if (feature.get("station")) {
        const text = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          setting.disappear = false;
          station.active = -1;
          for (let i = 0; i < station.result.length; i++) {
            if (station.result[i].radar.name == feature.get("name")) {
              station.active = i;
            }
          }
        });
      }
    });
  };
  const moveendFunc = () => {
    let view = map.getView();
    setting.openlayers.zoom = view.getZoom();
    setting.openlayers.center = toLonLat(view.getCenter());
    // console.log(view.getZoom(), toLonLat(view.getCenter()));
  };
  watch(
    storeToRefs(setting).factor.value[0],
    (newVal) => {
      if (newVal.val) {
        // source3.getFeatures().forEach((feature) => {
        //   feature.getStyle()[0].getText().setText(feature.get("radar_id"));
        //   feature.changed();
        // });
      } else {
        // source3.getFeatures().forEach((feature) => {
        //   feature.getStyle()[0].getText().setText(undefined);
        //   feature.changed();
        // });
      }
    },
    { immediate: false, deep: true }
  );
  watch(
    // storeToRefs(setting).factor.value[5],
    storeToRefs(setting).station,
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
    storeToRefs(setting).factor.value[7],
    (newVal) => {
      if (newVal.val) {
        map.setPaintProperty("temperatureLayer", "text-opacity", 1);
      } else {
        map.setPaintProperty("temperatureLayer", "text-opacity", 0);
      }
    },
    { deep: true }
  );
  watch(
    storeToRefs(setting).factor.value[9],
    (newVal) => {
      if (newVal.val) {
        map.setPaintProperty("humidityLayer", "text-opacity", 1);
      } else {
        map.setPaintProperty("humidityLayer", "text-opacity", 0);
      }
    },
    { deep: true }
  );
  watch(
    storeToRefs(setting).factor.value[10],
    (newVal) => {
      if (newVal.val) {
        // source3.getFeatures().forEach((feature) => {
        //   feature.getStyle()[5].getText().setText(feature.get("distance"));
        //   feature.changed();
        // });
      } else {
        // source3.getFeatures().forEach((feature) => {
        //   feature.getStyle()[5].getText().setText(undefined);
        //   feature.changed();
        // });
      }
    },
    { immediate: true, deep: true }
  );
  onActivated(() => {
    removeAllFeatures();
    station.result = [];
    if (setting.checks[0].select) {
      station.查询雷达列表接口({ user_id: route.query.user_id });
    }
    if (setting.checks[1].select) {
      station.查询雷达在线列表接口({ user_id: route.query.user_id });
    }
    if (setting.checks[2].select) {
      station.查询雷达离线列表接口({ user_id: route.query.user_id });
    }
    if (setting.checks[3].select) {
      station.查询近期新增雷达列表接口({ user_id: route.query.user_id });
    }
    station
      .查询平均风数据接口({
        user_id: route.query.user_id,
        // date: new Date().Format("yyyyMMdd"),
      })
      .then((res) => {
        station.avgWindData = res.data.data;
      });
    station
      .查询瞬时风数据接口({
        user_id: route.query.user_id,
        // date: new Date().Format("yyyyMMdd"),
      })
      .then((res) => {
        station.secondWindData = res.data.data;
      });
    station
      .查询径向风数据接口({
        user_id: route.query.user_id,
        // date: new Date().Format("yyyyMMdd"),
      })
      .then((res) => {
        station.radialWindData = res.data.data;
      });
  });
  onDeactivated(() => {
    clearInterval(timer);
  });
  watch(
    storeToRefs(setting).checks.value[0],
    (newVal) => {
      removeAllFeatures();
      if (newVal.select) {
        station.查询雷达列表接口({ user_id: route.query.user_id });
      } else {
        station.result = [];
      }
    },
    { deep: true, immediate: true }
  );
  watch(
    storeToRefs(setting).checks.value[1],
    (newVal) => {
      if (newVal.select) {
        station.查询雷达在线列表接口({ user_id: route.query.user_id });
      } else {
        station.result = [];
      }
      removeAllFeatures();
    },
    { deep: true, immediate: true }
  );
  watch(
    storeToRefs(setting).checks.value[2],
    (newVal) => {
      if (newVal.select) {
        station.查询雷达离线列表接口({ user_id: route.query.user_id });
      } else {
        station.result = [];
      }
    },
    { deep: true, immediate: true }
  );
  watch(
    storeToRefs(setting).checks.value[3],
    (newVal) => {
      if (newVal.select) {
        station.查询近期新增雷达列表接口({ user_id: route.query.user_id });
      } else {
        station.result = [];
      }
    },
    { deep: true, immediate: true }
  );
  function removeAllFeatures() {
    // source.getFeatures().forEach((feature) => source.removeFeature(feature));
    // source2.getFeatures().forEach((feature) => source2.removeFeature(feature));
    // source3.getFeatures().forEach((feature) => source3.removeFeature(feature));
  }
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
    storeToRefs(setting).graticule,
    (newVal) => {
      // if (newVal) {
      //   graticule.setVisible(true);
      // } else {
      //   graticule.setVisible(false);
      // }
    },
    { immediate: true }
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
  watch(storeToRefs(setting).feather, (newVal) => {
    if (newVal) {
      map.setPaintProperty("featherLayer", "text-opacity", 1);
    } else {
      map.setPaintProperty("featherLayer", "text-opacity", 0);
    }
  });
  timer = setInterval(() => {
    //   source.getFeatures().forEach(feature=>{
    //     feature.set('rad',Math.PI/180*Math.random()*360)
    //     // let geometry = feature.get('geometry')
    //     // geometry.setCoordinates(fromLonLat([110,30]))
    //     // feature.set('geometry',geometry)
    //   })
    station
      .查询平均风数据接口({
        user_id: route.query.user_id,
        date: new Date().Format("yyyyMMdd"),
      })
      .then((res) => {
        station.avgWindData = res.data.data;
      });
    station
      .查询瞬时风数据接口({
        user_id: route.query.user_id,
        date: new Date().Format("yyyyMMdd"),
      })
      .then((res) => {
        station.secondWindData = res.data.data;
      });
    station
      .查询径向风数据接口({
        user_id: route.query.user_id,
        date: new Date().Format("yyyyMMdd"),
      })
      .then((res) => {
        //太慢
        station.radialWindData = res.data.data;
      });
  }, 4 * 60 * 1000);
  onBeforeUnmount(() => {
    eventbus.off("将站点移动到屏幕中心");
    clearInterval(timer);
  });
});
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
</style>
