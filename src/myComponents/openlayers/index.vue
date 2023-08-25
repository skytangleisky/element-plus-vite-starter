<template>
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
      <div class="latestTime">{{ info.time }}更新</div>
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
      <div style="color: #e83e8c">维&emsp;度：{{ info.latitude }}</div>
      <div style="color: #e83e8c">方位角：{{ info.deg }}</div>
    </div>
    <div href="#" ref="popup_closer" class="ol-popup-closer"></div>
  </div>
  <radar-statistic></radar-statistic>
  <div class="right-drawer disapper b-solid b-0 b-l-coolGray b-l-1px">
    <el-icon
      class="m-20px right-10px top-10px z-999"
      style="font-size: 2em; position: absolute"
      @click="disapper"
    >
      <svg
        class="icon color-blue hover:color-orange"
        t="1692175718614"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="7426"
      >
        <path
          d="M861.012317 164.091494C765.809507 68.885661 639.229448 16.455901 504.590713 16.455901S243.372927 68.885661 148.170117 164.091494C52.965291 259.293296 0.534525 385.874363 0.534525 520.51209c0 134.639743 52.430767 261.217786 147.635592 356.422612 95.20281 95.20281 221.782869 147.633577 356.420596 147.633577s261.217786-52.430767 356.420596-147.633577c95.204825-95.204825 147.635592-221.783877 147.635592-356.422612C1008.646902 385.874363 956.217143 259.293296 861.012317 164.091494zM791.219829 810.54584c-4.394084 4.393077-10.152441 6.590623-15.910797 6.590623-5.759364 0-11.518728-2.197546-15.911805-6.590623L504.590713 555.740334 249.785207 810.54584c-4.394084 4.393077-10.152441 6.590623-15.911805 6.590623-5.758356 0-11.516713-2.197546-15.910797-6.590623-8.788169-8.788169-8.788169-23.036448 0-31.824617L472.767104 523.916725 219.336953 270.485566c-8.788169-8.788169-8.788169-23.036448 0-31.824617 8.788169-8.785146 23.035441-8.785146 31.823609 0l253.431158 253.431158 253.431158-253.431158c8.788169-8.785146 23.035441-8.785146 31.823609 0 8.788169 8.788169 8.788169 23.036448 0 31.824617L536.41533 523.916725l254.804499 254.805506C800.007998 787.509392 800.007998 801.757672 791.219829 810.54584z"
          p-id="7427"
        ></path>
      </svg>
    </el-icon>
    <chart-dom></chart-dom>
  </div>
</template>
<script setup>
import FullScreen from "ol/control/FullScreen";
import { onMounted, onBeforeUnmount, watch, ref } from "vue";
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
import { toStringHDMS } from "ol/coordinate";
import { fromLonLat, toLonLat } from "ol/proj";
import Overlay from "ol/Overlay";
// import ufo_shapes from './data/ufo_shapes.png?url'
import ufo_shapes from "~/assets/feather.svg?url";
// import ufo_shapes from '~/assets/feather.png?url'
import circle from "~/assets/circle.svg?url";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style.js";
import { eventbus } from "~/eventbus";
import { useStationStore } from "~/stores/station";
import { ScaleLine, defaults as defaultControls } from "ol/control";
import chartDom from "~/myComponents/echarts/index.vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { linear, inAndOut } from "ol/easing";
import radarStatistic from "./radarStatistic.vue";
console.log(route.query);
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
const mapContainer = ref(null);
const popup = ref(null);
const popup_content = ref(null);
const popup_closer = ref(null);
const osm = new TileLayer({
  preload: Infinity,
  source: new XYZ({
    // url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}',
    url: "https://wprd0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
  }),
});

const vectorLayer = new WebGLLayer({
  source: new VectorSource({
    // url: 'https://openlayers.org/data/vector/ecoregions.json',
    url: "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
    format: new GeoJSON(),
  }),
});
const disapper = (e) => {
  $(e.currentTarget).closest(".right-drawer").addClass("disapper");
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
    rotateWithView: true,
    offset: ["match", ["get", "flag"], 0, [0, 0], [8, 16]],
    textureCoord: [
      "match",
      ["get", "flag"],
      0,
      getCoord(0, 0),
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
onMounted(() => {
  eventbus.on("将站点移动到屏幕中心", flyTo);
  const container = popup.value;
  const content = popup_content.value;
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
    overlays: [overlay],
    layers: [osm, vectorLayer],
    target: mapContainer.value,
    view: new View({
      // center: fromLonLat([105,30]),
      // zoom:8,
      center: fromLonLat([115.43123283436979, 39.56864128657364]),
      zoom: 12,
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
  // map.addControl(new FullScreen())
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
          info.value.speed = feature.get("speed").toFixed(2) + "m/s";
          info.value.longitude = feature.get("coords")[0] + "°";
          info.value.latitude = feature.get("coords")[1] + "°";
          info.value.deg = ((feature.get("rad") * 180) / Math.PI).toFixed(2) + "°";
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
    const text = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      $(".right-drawer").removeClass("disapper");
    });
  };
  const moveendFunc = () => {
    let view = map.getView();
    // console.log(view.getZoom(),toLonLat(view.getCenter()))
  };
  map.on("pointermove", pointermoveFunc);
  map.on("pointerdown", pointerdownFunc);
  map.on("moveend", moveendFunc);
  watch(
    station,
    (newValue) => {
      console.log(newValue.result);
      const data = newValue.result;
      source.getFeatures().forEach((feature) => source.removeFeature(feature));
      source2.getFeatures().forEach((feature) => source2.removeFeature(feature));
      for (let i = 0; i < data.length; i++) {
        const speed = Math.random() * 60;
        const rad = (Math.PI / 180) * Math.random() * 360;
        let lngLat = [data[i].longitude, data[i].latitude];
        source.addFeature(
          new Feature({
            rad,
            flag: getFeather(speed),
            geometry: new Point(fromLonLat(lngLat)),
          })
        );
        source2.addFeature(
          new Feature({
            time: data[i].data_time,
            station: true,
            name: data[i].radar.name,
            is_online: data[i].is_online ? "在线" : "离线",
            speed,
            rad,
            coords: lngLat,
            geometry: new Point(fromLonLat(lngLat)),
          })
        );
      }
    },
    { deep: true }
  );
  station.FetchList();
  const source = new VectorSource();
  const source2 = new VectorSource();
  map.addLayer(
    new WebGLPointsLayer({
      source: source2,
      style: style2,
    })
  );
  map.addLayer(
    new WebGLPointsLayer({
      source,
      style,
    })
  );
  // timer = setInterval(()=>{
  //   source.getFeatures().forEach(feature=>{
  //     feature.set('rad',Math.PI/180*Math.random()*360)
  //     // let geometry = feature.get('geometry')
  //     // geometry.setCoordinates(fromLonLat([110,30]))
  //     // feature.set('geometry',geometry)
  //   })
  // },1000)

  function processData(data) {
    for (let i = 0; i < data.length; i++) {
      let lngLat = [data[i].longitude, data[i].latitude];
      const rad = (Math.PI / 180) * Math.random() * 360;
      source.addFeature(
        new Feature({
          rad,
          flag: getFeather(Math.random() * 60),
          geometry: new Point(fromLonLat(lngLat)),
        })
      );
      source2.addFeature(
        new Feature({
          coords: lngLat,
          geometry: new Point(fromLonLat(lngLat)),
        })
      );
    }
  }
  processData(station.result);

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
}
.disapper.right-drawer {
  transform: translateX(100%);
  transition: all 250ms;
}
</style>
