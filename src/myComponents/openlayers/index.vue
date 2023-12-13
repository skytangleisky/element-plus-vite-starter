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
      ref="mapContainer"
      class="map"
      style="position: absolute; left: 0; top: 0; width: 100%; height: 100%"
    ></div>
    <div ref="popup" class="ol-popup">
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
      <div href="#" ref="popup_closer" class="ol-popup-closer"></div>
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
import { getLngLat } from "~/myComponents/map/js/core.js";
import FullScreen from "ol/control/FullScreen";
import Graticule from "ol/layer/Graticule.js";
const graticule = new Graticule({
  // the style to use for the lines, optional.
  strokeStyle: new Stroke({
    color: "rgba(255,120,0,0.9)",
    width: 2,
    lineDash: [0.5, 4],
  }),
  showLabels: true,
  visible: true,
  wrapX: true,
});
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
import VectorLayer from "ol/layer/Vector";
import GeoJSON from "ol/format/GeoJSON.js";
import Layer from "ol/layer/Layer.js";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
// import TileLayer from 'ol/layer/WebGLTile.js';
import XYZ from "ol/source/XYZ.js";
import VectorSource from "ol/source/Vector.js";
import View from "ol/View.js";
import WebGLVectorLayerRenderer from "ol/renderer/webgl/VectorLayer.js";
import "ol/ol.css";
import WebGLPointsLayer from "ol/layer/WebGLPoints.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { format, toStringHDMS } from "ol/coordinate";
import { fromLonLat, toLonLat } from "ol/proj";
import Overlay from "ol/Overlay";
// import ufo_shapes from './data/ufo_shapes.png?url'
import ufo_shapes from "~/assets/feather.svg?url";
// import ufo_shapes from '~/assets/feather.png?url'
import circle from "~/assets/circle.svg?url";
import { Circle, Fill, Stroke, Style, Text } from "ol/style.js";
import { eventbus } from "~/eventbus";
import { useStationStore } from "~/stores/station";
import { ScaleLine, defaults as defaultControls } from "ol/control";
import chartTh from "~/myComponents/echarts/T_H.vue";
import chartDom from "~/myComponents/echarts/index.vue";
import chartFkx from "~/myComponents/echarts/fkx.vue";
import chartInfo from "~/myComponents/echarts/info.vue";
import chartSNR from "~/myComponents/echarts/SNR.vue";
import chartSpeed from "~/myComponents/echarts/Speed.vue";
import chartDirection from "~/myComponents/echarts/Direction.vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { linear, inAndOut } from "ol/easing";
import radarStatistic from "./radarStatistic.vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
console.log(">>>>", setting);
import { storeToRefs } from "pinia";
import Legend from "./legend.vue";
import { windArrowLayer } from "./windArrowLayer";

console.log("route.query", route.query);
const station = useStationStore();
/** @type {import('ol/style/literal.js').LiteralStyle} */

class WebGLLayer extends Layer {
  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      style: {
        "stroke-color": ["*", ["get", "COLOR"], [220, 220, 220]],
        "stroke-width": 1,
        "fill-color": ["*", ["get", "COLOR"], [0, 0, 0, 0.2]],
      },
    });
  }
}
const webglLayer = new WebGLLayer({
  id: "districtLayer",
  source: new VectorSource({
    // url: 'https://openlayers.org/data/vector/ecoregions.json',
    url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
    format: new GeoJSON(),
  }),
});
const osm = new TileLayer({
  id: "tileLayer",
  preload: Infinity,
  source: new XYZ({
    // url: "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}",
    url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    // url: "https://tanglei.site:3210/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}",
    // url: "http://tanglei.site:3211/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}",
    // url: "https://tanglei.site/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}",
  }),
});
const vectorLayer = new VectorLayer({
  id: "factor",
});

const mapContainer = ref(null);
const popup = ref(null);
const popup_closer = ref(null);
const disappear = (e) => {
  setting.disappear = !setting.disappear;
};
let timer;
const getCoord = (i, j) => [
  (i * (16 + 20)) / (16 * 10 + 20 * (10 - 1)),
  (j * (32 + 20)) / (32 * 4 + 20 * (4 - 1)),
  (i * (16 + 20)) / (16 * 10 + 20 * (10 - 1)) + 16 / (16 * 10 + 20 * (10 - 1)),
  (j * (32 + 20)) / (32 * 4 + 20 * (4 - 1)) + 32 / (32 * 4 + 20 * (4 - 1)),
];
const getFeather = (v) =>
  v <= 0
    ? 0
    : v <= 1
    ? 1
    : v <= 2
    ? 2
    : v <= 4
    ? 4
    : v <= 6
    ? 6
    : v <= 8
    ? 8
    : v <= 10
    ? 10
    : v <= 12
    ? 12
    : v <= 14
    ? 14
    : v <= 16
    ? 16
    : v <= 18
    ? 18
    : v <= 20
    ? 20
    : v <= 22
    ? 22
    : v <= 24
    ? 24
    : v <= 26
    ? 26
    : v <= 28
    ? 28
    : v <= 30
    ? 30
    : v <= 32
    ? 32
    : v <= 34
    ? 34
    : v <= 36
    ? 36
    : v <= 38
    ? 38
    : v <= 40
    ? 40
    : v <= 42
    ? 42
    : v <= 44
    ? 44
    : v <= 46
    ? 46
    : v <= 48
    ? 48
    : v <= 50
    ? 50
    : v <= 52
    ? 52
    : v <= 54
    ? 54
    : v <= 56
    ? 56
    : v <= 58
    ? 58
    : 60;
const style = {
  symbol: {
    symbolType: "image",
    src: ufo_shapes,
    size: [16, 32],
    rotation: ["get", "rad", "number"],
    color: [
      "interpolate",
      ["linear"],
      ["get", "flag"],
      0,
      "#0000ff",
      4,
      "#002aff",
      8,
      "#0054ff",
      12,
      "#007eff",
      16,
      "#00a8ff",
      20,
      "#00d2ff",
      24,
      "#14d474",
      28,
      "#a6dd00",
      32,
      "#ffe600",
      36,
      "#ffb300",
      40,
      "#ff8000",
      44,
      "#ff4d00",
      48,
      "#ff1a00",
      52,
      "#e60000",
      56,
      "#b30000",
      58,
      "#b30000",
      60,
      "#b30000",
    ],
    opacity: ["get", "opacity", "number"],
    rotateWithView: true,
    offset: ["match", ["get", "flag"], 0, [0, 0], [8, 16]],
    textureCoord: [
      "match",
      ["get", "flag"],
      0,
      // getCoord(0, 0),
      getCoord(2, 3), //不显示
      1,
      getCoord(1, 0),
      2,
      getCoord(2, 0),
      4,
      getCoord(3, 0),
      6,
      getCoord(4, 0),
      8,
      getCoord(5, 0),
      10,
      getCoord(6, 0),
      12,
      getCoord(7, 0),
      14,
      getCoord(8, 0),
      16,
      getCoord(9, 0),
      18,
      getCoord(0, 1),
      20,
      getCoord(1, 1),
      22,
      getCoord(2, 1),
      24,
      getCoord(3, 1),
      26,
      getCoord(4, 1),
      28,
      getCoord(5, 1),
      30,
      getCoord(6, 1),
      32,
      getCoord(7, 1),
      34,
      getCoord(8, 1),
      36,
      getCoord(9, 1),
      38,
      getCoord(0, 2),
      40,
      getCoord(1, 2),
      42,
      getCoord(2, 2),
      44,
      getCoord(3, 2),
      46,
      getCoord(4, 2),
      48,
      getCoord(5, 2),
      50,
      getCoord(6, 2),
      52,
      getCoord(7, 2),
      54,
      getCoord(8, 2),
      56,
      getCoord(9, 2),
      58,
      getCoord(0, 3),
      getCoord(1, 3),
    ],
  },
};
const style2 = {
  symbol: {
    symbolType: "circle",
    size: 10,
    color: ["match", ["get", "hover"], 1, "#ff3f3f", "#006688"],
    rotateWithView: false,
    offset: [0, 0],
    opacity: 1,
  },
};
const stationLayer = new WebGLPointsLayer({
  id: "station",
  style: style2,
});
const featherLayer = new WebGLPointsLayer({
  id: "feather",
  style,
});
onMounted(() => {
  eventbus.on("将站点移动到屏幕中心", flyTo);
  const container = popup.value;
  const closer = popup_closer.value;
  const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 0,
      },
    },
  });
  closer.onclick = function () {
    selected = null;
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };
  const map = new Map({
    overlays: [],
    layers: [
      osm,
      webglLayer,
      stationLayer,
      featherLayer,
      vectorLayer,
      //  windArrowLayer,
      graticule,
    ],
    target: mapContainer.value,
    view: new View({
      // center: fromLonLat([105,30]),
      // zoom:8,
      center: fromLonLat(setting.openlayers.center),
      zoom: setting.openlayers.zoom,
      projection: "EPSG:3857",
    }),
    //加载控件到地图容器中
    controls: defaultControls({
      zoom: false,
      rotate: false,
      attribution: false,
    }).extend([
      // new ScaleLine({bar: true, text: true, minWidth: 125})
    ]),
  });
  watch(
    () => setting.openlayers.zoom,
    (newZoom) => map.getView().setZoom(newZoom)
  );
  watch(
    () => setting.openlayers.center,
    (newCenter) => map.getView().setCenter(fromLonLat(newCenter))
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
  map.on("pointermove", pointermoveFunc);
  map.on("pointerdown", pointerdownFunc);
  map.on("moveend", moveendFunc);
  const source = new VectorSource();
  const source2 = new VectorSource();
  const source3 = new VectorSource();
  vectorLayer.setSource(source3);
  stationLayer.setSource(source2);
  featherLayer.setSource(source);
  watch(
    storeToRefs(setting).factor.value[0],
    (newVal) => {
      if (newVal.val) {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[0].getText().setText(feature.get("radar_id"));
          feature.changed();
        });
      } else {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[0].getText().setText(undefined);
          feature.changed();
        });
      }
    },
    { immediate: false, deep: true }
  );
  watch(
    // storeToRefs(setting).factor.value[5],
    storeToRefs(setting).station,
    (newVal) => {
      if (newVal) {
        map
          .getLayers()
          .getArray()
          .find(function (layer) {
            return layer.get("id") === "station";
          })
          .setVisible(true);
        vectorLayer.setOpacity(1.0);
        featherLayer.setVisible(true);
        // source3.getFeatures().forEach((feature) => {
        //   feature.getStyle()[3].getText().setText(feature.get("name"));
        //   feature.changed();
        // });
      } else {
        map
          .getLayers()
          .getArray()
          .find(function (layer) {
            return layer.get("id") === "station";
          })
          .setVisible(false);
        vectorLayer.setOpacity(0);
        featherLayer.setVisible(false);
        // source3.getFeatures().forEach((feature) => {
        //   feature.getStyle()[3].getText().setText(undefined);
        //   feature.changed();
        // });
      }
    },
    { immediate: false }
  );
  watch(
    [
      storeToRefs(station).avgWindData,
      storeToRefs(station).result,
      storeToRefs(station).active,
    ],
    ([avgWindData]) => {
      if (avgWindData) {
        avgWindData.forEach((v) => {
          source2.getFeatures().forEach((feature) => {
            // let tmp = v[feature.get("radar_id")];
            // if (tmp) {
            //   for (let k in tmp[0]) {
            //     let tmp2 = tmp[0][k].slice().reverse()[0];
            //     if (tmp2) {
            //       for (let key in tmp2) {
            //         feature.set("rad", (tmp2[key].center_h_direction_abs / 180) * Math.PI);
            //         feature.set("speed", tmp2[key].center_h_speed + "m/s");
            //         feature.set("time", k);
            //       }
            //     } else {
            //       for (let key in tmp2) {
            //         feature.set("rad", NaN);
            //         feature.set("speed", NaN);
            //         feature.set("time", k);
            //       }
            //     }
            //   }
            // }
            let tmp = v[feature.get("radar_id")];
            if (tmp) {
              source.forEachFeature((f) => {
                if (f.get("radar_id") == feature.get("radar_id")) {
                  source.removeFeature(f);
                }
              });
              for (let k in tmp[0]) {
                let tmp2 = tmp[0][k].slice().reverse();
                let lngLat = [feature.get("lng"), feature.get("lat")];
                tmp2.forEach((tmp3) => {
                  for (let k in tmp3) {
                    let item = tmp3[k];
                    let ll = getLngLat(lngLat[0], lngLat[1], item.north_a, Number(k));
                    lngLat = [ll.lng, ll.lat];
                    source.addFeature(
                      new Feature({
                        radar_id: feature.get("radar_id"),
                        rad: (item.center_h_direction_abs / 180) * Math.PI,
                        flag: getFeather(item.center_h_speed),
                        geometry: new Point(fromLonLat(lngLat)),
                        opacity: 1.0,
                      })
                    );
                  }
                });
                // if (tmp2) {
                //    for (let key in tmp2) {
                //      feature.set("rad", (tmp2[key].center_h_direction_abs / 180) * Math.PI);
                //      feature.set("flag", getFeather(tmp2[key].center_h_speed));
                //    }
                // } else {
                //   for (let key in tmp2) {
                //     feature.set("rad", 0);
                //     feature.set("flag", 0);
                //   }
                // }
              }
            }
          });
          source3.getFeatures().forEach((feature) => {
            let tmp = v[feature.get("radar_id")];
            if (tmp) {
              for (let k in tmp[0]) {
                let tmp2 = tmp[0][k].slice().reverse()[0];
                if (tmp2) {
                  for (let key in tmp2) {
                    feature.set("distance", tmp2[key].distance.toFixed(1));
                    feature.set("ex_temp", tmp2[key].ex_temp.toFixed(2));
                    if (tmp2[key].ex_hum == -1) {
                      feature.set("ex_hum", undefined);
                    } else {
                      feature.set("ex_hum", tmp2[key].ex_hum.toFixed(2));
                    }
                    if (setting.factor[10].val) {
                      feature.getStyle()[5].getText().setText(feature.get("distance"));
                    } else {
                      feature.getStyle()[5].getText().setText(undefined);
                    }
                    if (setting.factor[7].val) {
                      feature.getStyle()[8].getText().setText(feature.get("ex_temp"));
                    } else {
                      feature.getStyle()[8].getText().setText(undefined);
                    }
                    if (setting.factor[9].val) {
                      feature.getStyle()[10].getText().setText(feature.get("ex_hum"));
                    } else {
                      feature.getStyle()[10].getText().setText(undefined);
                    }
                    feature.changed();
                  }
                } else {
                  for (let key in tmp2) {
                    feature.getStyle()[5].getText().setText(undefined);
                    feature.getStyle()[8].getText().setText(undefined);
                    feature.getStyle()[10].getText().setText(undefined);
                    feature.changed();
                  }
                }
              }
            }
          });
        });
      }
    }
  );
  watch(
    storeToRefs(station).result,
    (newVal) => {
      const data = newVal;
      removeAllFeatures();
      for (let i = 0; i < data.length; i++) {
        const speed = 0; // Math.random() * 60;
        const rad = (Math.PI / 180) * Math.random() * 360;
        let lngLat = [data[i].longitude, data[i].latitude];
        source2.addFeature(
          new Feature({
            radar_id: data[i].radar.radar_id,
            time: "-",
            name: data[i].radar.name,
            station: true,
            is_online: data[i].is_online ? "在线" : "离线",
            speed,
            rad,
            coords: lngLat,
            geometry: new Point(fromLonLat(lngLat)),
            opacity: 1.0,
            lng: data[i].longitude,
            lat: data[i].latitude,
          })
        );
        let feature = new Feature({
          radar_id: data[i].radar.radar_id,
          time: data[i].data_time,
          name: data[i].radar.name,
          is_online: data[i].is_online ? "在线" : "离线",
          speed,
          rad,
          coords: lngLat,
          geometry: new Point(fromLonLat(lngLat)),
          opacity: 1.0,
          T: "温度",
          RH: "湿度",
        });
        const gap = 30;
        feature.setStyle([
          new Style({
            //0
            text: new Text({
              font: "14px Menlo",
              textBaseline: "middle",
              textAlign: "middle",
              justify: "center",
              text: undefined, //ZH-站号
              offsetX: 0,
              offsetY: -2 * gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //1
            text: new Text({
              font: "14px Menlo",
              textBaseline: "middle",
              textAlign: "middle",
              justify: "center",
              text: undefined, //FY-风羽
              offsetX: 2 * gap,
              offsetY: -2 * gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //2
            text: new Text({
              font: "14px Menlo",
              textBaseline: "middle",
              textAlign: "middle",
              justify: "center",
              text: undefined, //SNR-信噪比
              offsetX: -gap,
              offsetY: -gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //3
            text: new Text({
              font: "14px Menlo",
              textAlign: "middle",
              textBaseline: "middle",
              justify: "center",
              text: data[i].radar.name, //ZM-站名
              offsetX: 0,
              offsetY: -gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //4
            text: new Text({
              font: "14px Menlo",
              textAlign: "middle",
              textBaseline: "middle",
              justify: "center",
              text: undefined, //W-垂直气流
              offsetX: gap,
              offsetY: -gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //5
            text: new Text({
              font: "14px Menlo",
              textAlign: "right",
              textBaseline: "middle",
              justify: "center",
              text: undefined, //H-高度
              offsetX: -gap,
              offsetY: 0,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //6
            text: new Text({
              font: "14px Menlo",
              textAlign: "middle",
              textBaseline: "middle",
              justify: "center",
              text: undefined, //N-站点
              offsetX: 0,
              offsetY: 0,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //7
            text: new Text({
              font: "14px Menlo",
              textAlign: "middle",
              textBaseline: "middle",
              justify: "center",
              text: undefined, //SW-谱宽
              offsetX: gap,
              offsetY: 0,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //8
            text: new Text({
              font: "14px Menlo",
              textAlign: "right",
              textBaseline: "middle",
              justify: "center",
              text: undefined, //T-温度
              offsetX: -gap,
              offsetY: gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //9
            text: new Text({
              font: "14px Menlo",
              textAlign: "middle",
              textBaseline: "middle",
              justify: "center",
              text: undefined, //Td-露点
              offsetX: 0,
              offsetY: gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
          new Style({
            //10
            text: new Text({
              font: "14px Menlo",
              textAlign: "left",
              textBaseline: "middle",
              justify: "center",
              text: undefined, //RH-相对湿度
              offsetX: gap,
              offsetY: gap,
              fill: new Fill({
                color: [255, 255, 255, 1],
              }),
              stroke: new Stroke({ color: "black", width: 1 }),
              backgroundFill: new Fill({
                color: [168, 50, 153, 0],
              }),
              padding: [0, 0, 0, 0],
            }),
          }),
        ]);
        source3.addFeature(feature);
      }
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
  watch(
    storeToRefs(setting).factor.value[7],
    (newVal) => {
      if (newVal.val) {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[8].getText().setText(feature.get("ex_temp"));
          feature.changed();
        });
        // source.getFeatures().forEach((feature) => {
        //   feature.set("rad", feature.get("rad"));
        //   feature.set("flag", getFeather(feature.get("speed")));
        // });
        // source2.getFeatures().forEach((feature) => {
        //   feature.set("rad", feature.get("rad"));
        //   feature.set("speed", feature.get("speed"));
        //   feature.set("time", feature.get("time"));
        // });
      } else {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[8].getText().setText(undefined);
          feature.changed();
        });
      }
    },
    { immediate: true, deep: true }
  );
  watch(
    storeToRefs(setting).factor.value[9],
    (newVal) => {
      if (newVal.val) {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[10].getText().setText(feature.get("ex_hum"));
          feature.changed();
        });
      } else {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[10].getText().setText(undefined);
          feature.changed();
        });
      }
    },
    { immediate: true, deep: true }
  );
  watch(
    storeToRefs(setting).factor.value[10],
    (newVal) => {
      if (newVal.val) {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[5].getText().setText(feature.get("distance"));
          feature.changed();
        });
      } else {
        source3.getFeatures().forEach((feature) => {
          feature.getStyle()[5].getText().setText(undefined);
          feature.changed();
        });
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
    source.getFeatures().forEach((feature) => source.removeFeature(feature));
    source2.getFeatures().forEach((feature) => source2.removeFeature(feature));
    source3.getFeatures().forEach((feature) => source3.removeFeature(feature));
  }
  watch(
    storeToRefs(setting).district,
    (newVal) => {
      if (newVal) {
        map
          .getLayers()
          .getArray()
          .find(function (layer) {
            return layer.get("id") === "districtLayer";
          })
          .setVisible(true);
      } else {
        map
          .getLayers()
          .getArray()
          .find(function (layer) {
            return layer.get("id") === "districtLayer";
          })
          .setVisible(false);
      }
    },
    { immediate: true }
  );
  watch(
    storeToRefs(setting).graticule,
    (newVal) => {
      if (newVal) {
        graticule.setVisible(true);
      } else {
        graticule.setVisible(false);
      }
    },
    { immediate: true }
  );
  watch(
    storeToRefs(setting).loadmap,
    (newVal) => {
      if (newVal) {
        map
          .getLayers()
          .getArray()
          .find(function (layer) {
            return layer.get("id") === "tileLayer";
          })
          .setVisible(true);
      } else {
        map
          .getLayers()
          .getArray()
          .find(function (layer) {
            return layer.get("id") === "tileLayer";
          })
          .setVisible(false);
      }
    },
    { immediate: true }
  );
  watch(
    storeToRefs(setting).feather,
    (newVal) => {
      if (newVal) {
        source.getFeatures().forEach((item) => {
          item.set("opacity", 1.0);
        });
      } else {
        source.getFeatures().forEach((item) => {
          item.set("opacity", 0);
        });
      }
    },
    { immediate: true }
  );
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
    map.un("pointermove", pointermoveFunc);
    map.un("pointerdown", pointerdownFunc);
    map.un("moveend", moveendFunc);
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
