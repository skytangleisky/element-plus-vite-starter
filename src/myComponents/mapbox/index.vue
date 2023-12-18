<template>
  <div ref="mapRef" class="w-full h-full bg-white"></div>
  <el-select
    v-model="setting.projection"
    placeholder="projection"
    size="small"
    style="position: absolute; left: 20px; top: 20px"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>
<script lang="ts" setup>
import "./mapbox-gl.css";
import "./mapbox-gl.js";
import plotUrl from "./data/plot/06040802.000?url";
import irUrl1 from "./data/ir/m/0604091200.000?url";
import irUrl2 from "./data/ir/m/0604091300.000?url";
import irUrl3 from "./data/ir/m/0604091400.000?url";
import irUrl4 from "./data/ir/m/0604091500.000?url";
import irUrl5 from "./data/ir/m/0604091600.000?url";
import irUrl6 from "./data/ir/m/0604091700.000?url";
import irUrl7 from "./data/ir/m/0604091800.000?url";
import irUrl8 from "./data/ir/m/0604091900.000?url";
import irUrl9 from "./data/ir/m/0604092000.000?url";
import irUrl10 from "./data/ir/m/0604092100.000?url";
import irUrl11 from "./data/ir/m/0604092200.000?url";
import irUrl12 from "./data/ir/m/0604092300.000?url";
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import * as turf from "@turf/turf";
import raster from "./raster.js";
// import style from "./streets-v11.js";
import style from "./streets-v11.js";
import palette from "./data/红外/I-01.xml?raw";
import { lngLat2XY, XY2LngLat } from "../map/js/core";
// let style = "mapbox://styles/mapbox/streets-v11";
// import style from "./satellite-v9.js";
// let style = "mapbox://styles/mapbox/satellite-v9";
// let style = "mapbox://styles/tanglei201314/clons7b5v00dm01prgrblhncs";
import imageUrl from "~/assets/feather.svg?url";
import { getMicapsData } from "./data/plot/micaps";
import CustomLayer from "./WindGL/CustomLayer";
import { useSettingStore } from "~/stores/setting";
import { storeToRefs } from "pinia";
import { getFeather, getColor, getCoord, loadImage } from "~/tools";
const setting = useSettingStore();
const options = ref([
  // { value: "albers", label: "albers" },
  // { value: "equalEarth", label: "equalEarth" },
  // { value: "equirectangular", label: "equirectangular" },
  // { value: "lambertConformalConic", label: "lambertConformalConic" },
  { value: "mercator", label: "mercator" },
  // { value: "naturalEarth", label: "naturalEarth" },
  // { value: "winkelTripel", label: "winkelTripel" },
  { value: "globe", label: "globe" },
]);
watch(storeToRefs(setting).projection, (projection) => {
  map && map.setProjection(projection);
});
let boundaries = {
  type: "FeatureCollection",
  name: "boundaries",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [110.763, 41.376],
              [110.823, 41.381],
              [110.815, 41.357],
              [110.944, 41.317],
              [110.978, 41.346],
              [111.026, 41.299],
              [111.085, 41.285],
              [111.096, 41.306],
              [111.232, 41.238],
              [111.273, 41.289],
              [111.439, 41.327],
              [111.724, 41.309],
              [111.833, 41.252],
              [111.822, 41.216],
              [111.862, 41.204],
              [111.874, 41.129],
              [112.027, 41.046],
              [112.011, 41.003],
              [112.035, 40.968],
              [112.138, 40.938],
              [112.178, 40.818],
              [112.144, 40.761],
              [112.086, 40.738],
              [112.124, 40.697],
              [112.108, 40.657],
              [112.038, 40.654],
              [112.092, 40.587],
              [112.046, 40.559],
              [112.218, 40.448],
              [112.259, 40.391],
              [112.229, 40.354],
              [112.264, 40.356],
              [112.305, 40.253],
              [111.964, 39.795],
              [111.925, 39.611],
              [111.829, 39.619],
              [111.777, 39.588],
              [111.64, 39.643],
              [111.511, 39.663],
              [111.43, 39.642],
              [111.435, 39.67],
              [111.358, 39.721],
              [111.366, 39.789],
              [111.439, 39.896],
              [111.405, 40.044],
              [111.308, 40.151],
              [111.039, 40.27],
              [111.024, 40.31],
              [111.108, 40.33],
              [111.121, 40.382],
              [110.953, 40.495],
              [110.895, 40.483],
              [110.837, 40.534],
              [110.874, 40.585],
              [110.796, 40.611],
              [110.78, 40.79],
              [110.705, 40.805],
              [110.739, 40.917],
              [110.623, 40.941],
              [110.672, 41.053],
              [110.639, 41.1],
              [110.65, 41.164],
              [110.554, 41.224],
              [110.559, 41.261],
              [110.512, 41.291],
              [110.547, 41.288],
              [110.569, 41.331],
              [110.629, 41.31],
              [110.719, 41.385],
              [110.763, 41.376],
            ],
          ],
        ],
      },
    },
  ],
};

let points = turf.randomPoint(30, { bbox: turf.bbox(boundaries) });

turf.featureEach(points, function (currentFeature, featureIndex) {
  currentFeature.properties = { value: (Math.random() * 100).toFixed(2) };
});
console.log(points);

var interpolate_options = {
  gridType: "points",
  property: "value",
  units: "degrees",
  weight: 10,
};
let grid = turf.interpolate(points, 0.02, interpolate_options);
grid.features.map((i) => (i.properties.value = i.properties.value.toFixed(2)));

var isobands_options = {
  zProperty: "value",
  commonProperties: {
    "fill-opacity": 0.8,
  },
  breaksProperties: [
    // { fill: "#e3e3ff" },
    // { fill: "#c6c6ff" },
    // { fill: "#a9aaff" },
    // { fill: "#8e8eff" },
    // { fill: "#7171ff" },
    // { fill: "#5554ff" },
    // { fill: "#3939ff" },
    // { fill: "#1b1cff" },
    // { fill: "#1500ff" },
    { fill: "#66bd63" },
    { fill: "#a6d96a" },
    { fill: "#d9ef8b" },
    { fill: "#ffffbf" },
    { fill: "#fee08b" },
    { fill: "#fdae61" },
    { fill: "#f46d43" },
    { fill: "#d73027" },
    { fill: "#a50026" },
  ],
};
//name_zh-hans
//name_zh-hant
// "sources": {
// 			"composite": {
// 					"url_origin": "mapbox://mapbox.mapbox-streets-v8,mapbox.mapbox-terrain-v2,mapbox.mapbox-bathymetry-v2",
// 					"tiles": [
// 						"https://tanglei.site:3220?lyrs=v&x={x}&y={y}&z={z}"
// 					],
// 					"type": "vector"
// 			}
// 	},
// 	"sprite": "https://tanglei.top/mapboxgl/sprite",
// 	"glyphs": "https://tanglei.top/mapboxgl/resources/glyphs/{fontstack}/{range}.pbf",
// {
//   'id': '3d-buildings',
//   'source': 'composite',
//   'source-layer': 'building',
//   'filter': ['==', 'extrude', 'true'],
//   'type': 'fill-extrusion',
//   'minzoom': 1,
//   'paint': {
//       'fill-extrusion-color': '#aaa',
//       // 地图放大的时候，使用插值的方式，添加更细节的建筑物，这种方式，视觉过渡更平滑
//       'fill-extrusion-height': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           15,
//           0,
//           15.05,
//           ['get', 'height']
//       ],
//       'fill-extrusion-base': [
//           'interpolate',
//           ['linear'],
//           ['zoom'],
//           15,
//           0,
//           15.05,
//           ['get', 'min_height']
//       ],
//       'fill-extrusion-opacity': 1
//   }
// }
let isobands = turf.isobands(grid, [1, 10, 20, 30, 50, 70, 90], isobands_options);
let isolines = turf.isolines(grid, [1, 10, 20, 30, 50, 70, 90], isobands_options);

boundaries = turf.flatten(boundaries);
isobands = turf.flatten(isobands);

let features = [];

isobands.features.forEach(function (layer1) {
  boundaries.features.forEach(function (layer2) {
    let intersection = null;
    try {
      intersection = turf.intersect(layer1, layer2);
    } catch (e) {
      layer1 = turf.buffer(layer1, 0);
      intersection = turf.intersect(layer1, layer2);
    }
    if (intersection != null) {
      intersection.properties = layer1.properties;
      intersection.id = Math.random() * 100000;
      features.push(intersection);
    }
  });
});
let intersection = turf.featureCollection(features);
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hldmF3ZW4iLCJhIjoiY2lwZXN2OGlvMDAwMXR1bmh0aG5vbDFteiJ9.2fsD37adZ1hC2MUU-2xByA";
const mapRef = ref(null);
var map: mapboxgl.Map;
// 可视化及交互部分
onMounted(() => {
  if (!mapRef.value) throw Error("invalid mapRef!");
  console.log("new Map");
  map = new mapboxgl.Map({
    container: mapRef.value,
    // style: raster,
    performanceMetricsCollection: false,
    style,
    projection: setting.projection,
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
    zoom: 4,
    center: [0, 0],
    pitch: 0,
  });
  // map.repaint = true;
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.ScaleControl());
  map.addControl(new mapboxgl.FullscreenControl());
  // map.setStyle(raster as mapboxgl.Style);
  map.on("load", function () {
    // 逐个添加过程中的数据
    map.addSource("boundaries", {
      type: "geojson",
      data: boundaries,
    });
    map.addSource("points", {
      type: "geojson",
      data: points,
    });
    map.addSource("grid", {
      type: "geojson",
      data: grid,
    });
    map.addSource("isobands", {
      type: "geojson",
      data: isobands,
    });
    map.addSource("intersection", {
      type: "geojson",
      data: intersection,
    });
    map.addSource("isolines", {
      type: "geojson",
      data: isolines,
    });
    // 逐个添加过程中形成的图层
    // map.addLayer({
    //   id: "tilelayer",
    //   type: "raster",
    //   source: {
    //     type: "raster",
    //     tiles: ["https://tanglei.site:3210/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}"],
    //     //zoomOffset:-1,
    //     tileSize: 256,
    //   },
    //   paint: {},
    //   layout: {},
    // });
    /*
    map.addLayer({
      id: "points",
      type: "symbol",
      source: "points",
      layout: {
        "text-field": ["get", "value"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top",
        "text-justify": "center",
      },
    });
    map.addLayer({
      id: "circles",
      type: "circle",
      source: "points",
      paint: {
        "circle-radius": 2,
        "circle-color": "#007cbf",
      },
    });
    map.addLayer({
      id: "grid",
      type: "symbol",
      source: "grid",
      layout: {
        "text-field": ["get", "value"],
        visibility: "visible",
      },
      paint: {
        "text-color": "#f00",
      },
    });

    map.addLayer({
      id: "isobands",
      type: "fill",
      source: "isobands",
      layout: {
        visibility: "none",
      },
      paint: {
        "fill-color": ["get", "fill"],
        "fill-opacity": 0.8,
      },
    });
    map.addLayer({
      id: "isolines",
      type: "line",
      source: "isobands",
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": ["get", "fill"],
        "line-width": 2,
        "line-opacity": 0.8,
      },
    });
    map.addLayer({
      id: "boundaries",
      type: "line",
      source: "boundaries",
      layout: {},
      paint: {
        "line-width": 2,
        "line-color": "#4264fb",
      },
    });
    map.addLayer({
      id: "intersection",
      type: "fill",
      source: "intersection",
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": ["get", "fill"],
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.8,
          0.5,
        ],
        "fill-outline-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "#000",
          "#fff",
        ],
      },
    });
*/
    // var toggleableLayerIds = ["points", "grid", "isobands", "intersection"];
    // toggleableLayerIds.map((v,k)=>{
    //   let visibility = map.getLayoutProperty(v,"visibility");
    //   map.setLayoutProperty(v,"visibility","visible")
    //   map.setLayoutProperty(v,"visibility","none")
    // }
  });
  var hoveredStateId: boolean = false;
  map.on("mousemove", "intersection", function (e: any) {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState(
          { source: "intersection", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        { source: "intersection", id: hoveredStateId },
        { hover: true }
      );
    }
  });
  map.on("load", () => {
    getMicapsData(plotUrl).then((result: any) => {
      let points = {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [-122.414, 37.776],
              },
            },
          ],
        },
      };
      points.data.features = [];
      result.data.forEach((v: any) => {
        if (v.风速 != 9999) {
          points.data.features.push({
            type: "Feature",
            properties: Object.assign({ image: "feather" + getFeather(v.风速) }, v),
            geometry: {
              type: "Point",
              coordinates: [v.经度, v.纬度],
            },
          });
        }
      });
      map.addSource("point", points);
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
          id: "plane",
          source: "point",
          type: "symbol",
          layout: {
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
            "text-field": ["get", "风速"],
            "text-font": ["simkai"],
            "text-size": 20,
            "text-transform": "uppercase",
            // "text-letter-spacing": 0.05,
            "text-anchor": "center",
            "text-line-height": 1,
            // "text-justify": "center",
            "text-offset": [0, 0],
            "text-ignore-placement": true,
            "text-allow-overlap": true,
            "text-rotation-alignment": "map",
          },
        });
      });
    });

    // map.addLayer({
    //   id: "park-volcanoes",
    //   type: "circle",
    //   source: "point",
    //   paint: {
    //     "circle-rotation-alignment": "map",
    //     "circle-radius": {
    //       base: 3,
    //       stops: [
    //         [12, 5],
    //         [22, 180],
    //       ],
    //     },
    //     "circle-color": [
    //       "match",
    //       ["get", "color"],
    //       "white",
    //       "#fff",
    //       "green",
    //       "#0f0",
    //       "#00f",
    //     ],
    //   },
    //   filter: ["==", "$type", "Point"],
    // });
    map.addLayer(new CustomLayer());
    let irCvs = document.createElement("canvas") as HTMLCanvasElement;
    let urls = [
      irUrl1,
      irUrl2,
      irUrl3,
      irUrl4,
      irUrl5,
      irUrl6,
      irUrl7,
      irUrl8,
      irUrl9,
      irUrl10,
      irUrl11,
      irUrl12,
    ];
    let INDEX = 0;
    let url = urls[INDEX++ % urls.length];

    getMicapsData(url).then((result: any) => {
      let minLng = result.minLng;
      let minLat = result.minLat;
      let cenPos = lngLat2XY(result.cenLng, result.cenLat);
      let minPos = lngLat2XY(minLng, minLat);
      let maxPos = { x: 2 * cenPos.x - minPos.x, y: 2 * cenPos.y - minPos.y };
      let maxLngLat = XY2LngLat(maxPos.x, maxPos.y);
      let maxLng = maxLngLat.lng;
      let maxLat = maxLngLat.lat;
      let array = new Uint8ClampedArray(4 * result.xCount * result.yCount);
      for (let j = 0; j < result.xCount; j++) {
        for (let i = 0; i < result.yCount; i++) {
          let value = result.pixelData[(result.yCount - j - 1) * result.xCount + i];
          // let color = getColor(value / 255);
          let color = Color[value];
          color[3] = value;
          if (color?.length) {
            array[4 * (j * result.xCount + i) + 0] = color[0];
            array[4 * (j * result.xCount + i) + 1] = color[1];
            array[4 * (j * result.xCount + i) + 2] = color[2];
            array[4 * (j * result.xCount + i) + 3] = color[3]; // color[3]
          }
        }
      }
      let imgData = new ImageData(array, result.xCount, result.yCount);
      irCvs.width = result.xCount;
      irCvs.height = result.yCount;
      let ctx = irCvs.getContext("2d");
      console.log(maxLng, minLng, maxLat, minLat);
      if (ctx) {
        ctx.putImageData(imgData, 0, 0);
        map.addSource("irSource", {
          type: "image",
          url: irCvs.toDataURL(),
          coordinates: [
            [minLng, maxLat],
            [maxLng, maxLat],
            [maxLng, minLat],
            [minLng, minLat],
          ],
        });
        map.addLayer({
          id: "irLayer",
          type: "raster",
          source: "irSource",
          paint: {
            "raster-fade-duration": 0,
            "raster-opacity": 0.8,
            "raster-resampling": "nearest",
          },
          layout: {
            visibility: "visible",
          },
        });
        // timer = setInterval(() => {
        //   let url = urls[INDEX++ % urls.length];
        //   getMicapsData(url).then((result: any) => {
        //     let minLng = result.minLng;
        //     let minLat = result.minLat;
        //     let cenPos = lngLat2XY(result.cenLng, result.cenLat);
        //     let minPos = lngLat2XY(minLng, minLat);
        //     let maxPos = { x: 2 * cenPos.x - minPos.x, y: 2 * cenPos.y - minPos.y };
        //     let maxLngLat = XY2LngLat(maxPos.x, maxPos.y);
        //     let maxLng = maxLngLat.lng;
        //     let maxLat = maxLngLat.lat;
        //     let array = new Uint8ClampedArray(4 * result.xCount * result.yCount);
        //     for (let j = 0; j < result.xCount; j++) {
        //       for (let i = 0; i < result.yCount; i++) {
        //         let value = result.pixelData[(result.yCount - j - 1) * result.xCount + i];
        //         // let color = getColor(value / 255);
        //         let color = Color[value];
        //         color[3] = value;
        //         if (color?.length) {
        //           array[4 * (j * result.xCount + i) + 0] = color[0];
        //           array[4 * (j * result.xCount + i) + 1] = color[1];
        //           array[4 * (j * result.xCount + i) + 2] = color[2];
        //           array[4 * (j * result.xCount + i) + 3] = color[3]; // color[3]
        //         }
        //       }
        //     }
        //     let imgData = new ImageData(array, result.xCount, result.yCount);
        //     irCvs.width = result.xCount;
        //     irCvs.height = result.yCount;
        //     let ctx = irCvs.getContext("2d");
        //     if (ctx) {
        //       ctx.putImageData(imgData, 0, 0);
        //       map.getSource("irSource").updateImage({
        //         url: irCvs.toDataURL(),
        //         coordinates: [
        //           [minLng, maxLat],
        //           [maxLng, maxLat],
        //           [maxLng, minLat],
        //           [minLng, minLat],
        //         ],
        //       });
        //     }
        //   });
        // }, 1000);
      }
    });
  });
  let timer: number;
  var Color: { [key: string]: any } = {};
  let xmlDoc = new DOMParser().parseFromString(palette, "text/xml");
  let collections = xmlDoc.getElementsByTagName("entry");
  for (let i = 0; i < collections.length; i++) {
    let value = Number(collections[i].getAttribute("value"));
    let strPalette = collections[i].getAttribute("rgba");
    if (strPalette) {
      let rgba = strPalette.split(",");
      rgba.map((v) => Number(v));
      Color[value.toFixed()] = rgba;
    }
  }
  onBeforeUnmount(() => {
    timer && clearInterval(timer);
  });
});
</script>
<style lang="scss"></style>
