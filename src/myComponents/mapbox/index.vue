<template>
  <div ref="mapRef" class="w-full h-full bg-white"></div>
  <control-pane style="position: absolute;top:100px" :list="list"></control-pane>
</template>
<script lang="ts" setup>
import {layer,windParticles} from "./windRaster";
import { isDark } from "~/composables/dark.js";
import { onMounted, ref, onBeforeUnmount, watch, toRefs,reactive } from "vue";
import ControlPane from '../controlPane/index.vue'
import uvUrl from "./data/06040808.000?url";
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
import CustomRasterSource from './customRasterSource.js'
import { useSettingStore } from "~/stores/setting";
import { getFeather, getColor, getCoord, addFeatherImages } from "~/tools";
const setting = useSettingStore();
const list = reactive([{label:'devtools',type:'folder',opened:true,children:[
  {label:'投影方式',value:toRefs(setting.mapbox).projection,type:'select',options:[
    { value: "mercator", label: "mercator" },
    { value: "globe", label: "globe" },
    { value: "equirectangular", label: "equirectangular" },
    { value: "naturalEarth", label: "naturalEarth" },
    { value: "lambertConformalConic", label: "lambertConformalConic" },
    { value: "albers", label: "albers" },
    { value: "equalEarth", label: "equalEarth" },
    { value: "winkelTripel", label: "winkelTripel" },
  ]},
  {label:'卫星云图',value:toRefs(setting.mapbox).satellite,type:'checkbox'},
  {label:'流线',value:toRefs(setting.mapbox).showStream,type:'checkbox'},
  {label:'自动站',value:toRefs(setting.mapbox).showStation,type:'checkbox'},
  {label:'windRaster',value:toRefs(setting.mapbox).windRaster,type:'checkbox'},
]}])
watch(()=>setting.mapbox.projection, (projection) => {
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
// 						"https://vector.tanglei.site?lyrs=v&x={x}&y={y}&z={z}"
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
  "pk.eyJ1IjoidGFuZ2xlaTIwMTMxNCIsImEiOiJjbGtmOTdyNWoxY2F1M3Jqczk4cGllYXp3In0.9N-H_79ehy4dJeuykZa0xA";
const mapRef = ref(null);
var map: mapboxgl.Map;
// 可视化及交互部分
onMounted(() => {
  if (!mapRef.value) throw Error("invalid mapRef!");
  console.log("new Map");
  map = new mapboxgl.Map({
    container: mapRef.value,
    // style: raster,
    style:style as any,
    projection: setting.mapbox.projection as any,
    // bounds: turf.bbox(boundaries),
    localIdeographFontFamily: "",
    antialias: true,
    renderWorldCopies: true,
    // minZoom: 1,
    // maxBounds: [
    //   [60.0, 0],
    //   [160.0, 60],
    // ],
    zoom: setting.mapbox.zoom,
    center: setting.mapbox.center as any,
    maxZoom:21,
    // pitch: 60,
    pitch: 0,
  });
  map.repaint = false;
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.ScaleControl());
  map.addControl(new mapboxgl.FullscreenControl());
  // map.setStyle(raster as mapboxgl.Style);
  watch(()=>setting.mapbox.windRaster,(val)=>{
    if(val){
      // map.addLayer(layer)
      map.addLayer(windParticles)
    }else{
      // map.removeLayer('wind')
      map.removeLayer('wind-particles')
    }
  })
  map.on("load", function () {
    if(setting.mapbox.windRaster){
      // map.addLayer(layer)
      map.addLayer(windParticles)
    }
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
    //     tiles: ["https://tile.tanglei.site/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}"],
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
        "fill-outline-color":"transparent"
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
  map.on("move", () => {
    let center = map.getCenter();
    setting.mapbox.center = [center.lng, center.lat];
  });
  map.on("zoom", () => {
    setting.mapbox.zoom = map.getZoom();
  });
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
  map.on('click', (e) => {
    console.log(e.lngLat)
  })
  map.on("load", () => {
    // map.addLayer({
    //   id: 'customRasterLayer',
    //   type: 'raster',
    //   source: new CustomRasterSource() as any,
    //   paint: {
    //     'raster-opacity': 1,
    //   }
    // });
    map.addSource('flight-path', {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [104.06337515944892, 30.65995447500198, 300], // 起点（经度, 纬度, 高度）
            [104.06338515944892, 30.65985447500198, 500], // 中间点
            [104.06337515944892, 30.65985447500198, 700]  // 终点
          ]
        }
      }
    });
    map.addLayer({
      "id": "flight-route",
      "type": "line",
      "source": "flight-path",
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#ff8800",
        "line-width": 4,
        "line-opacity": 0.8
      }
    });
    watch(
      () => setting.mapbox.showStation,
      (v) => {
        if (v) {
          getMicapsData(plotUrl).then(async (result: any) => {
            console.log(result);
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
                  properties: Object.assign(v, { image: "feather" + getFeather(v.风速) }),
                  geometry: {
                    type: "Point",
                    coordinates: [v.经度, v.纬度],
                  },
                });
              }
            });
            map.addSource("point", points);
            await addFeatherImages(map,isDark.value?'#fff':'#000');
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
        } else {
          map.getLayer("plane") && map.removeLayer("plane");
          map.getSource("point") && map.removeSource("point");
        }
      },
      { immediate: true }
    );

    watch(()=>setting.mapbox.showStream,val=>{
      if(val){
        getMicapsData(uvUrl).then(async(result:any)=>{
          console.log("===>",result)
          let cvs = document.createElement('canvas')
          cvs.width = result.lngCount
          cvs.height = result.latCount
          let ctx = cvs.getContext('2d')!
          let imgData = ctx.getImageData(0,0,cvs.width,cvs.height)
          let us = result.data.slice(0,result.data.length/2)
          let vs = result.data.slice(result.data.length/2)
          const uMin = Math.min(...us);
          const uMax = Math.max(...us);
          const vMin = Math.min(...vs);
          const vMax = Math.max(...vs);
          for(let y = 0; y < imgData.height; y++){
            for(let x = 0; x < imgData.width; x++){
              let i = (y * 4) * imgData.width + x * 4
              imgData.data[i + 0] = (us[imgData.width*y+x]-uMin)/(uMax-uMin)*255
              imgData.data[i + 1] = (vs[imgData.width*y+x]-vMin)/(vMax-vMin)*255
              imgData.data[i + 2] = 0
              imgData.data[i + 3] = 255
            }
          }
          ctx.putImageData(imgData,0,0)
          let json = {
            "source": "http://nomads.ncep.noaa.gov",
            "date": "2016-11-20T00:00Z",
            "width": cvs.width,
            "height": cvs.height,
            "uMin": uMin,
            "uMax": uMax,
            "vMin": vMin,
            "vMax": vMax
          }
          let url = cvs.toDataURL()
          map.addLayer(new CustomLayer(json,url) as any)
        })
      }else{
        map.getLayer("null-island") && map.removeLayer("null-island");
      }
    },{immediate:true})

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
    watch(
      () => setting.mapbox.satellite,
      (v: boolean) => {
        if (v) {

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
              timer = setInterval(() => {
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
                  if (ctx) {
                    ctx.putImageData(imgData, 0, 0);
                    map.getSource("irSource").updateImage({
                      url: irCvs.toDataURL(),
                      coordinates: [
                        [minLng, maxLat],
                        [maxLng, maxLat],
                        [maxLng, minLat],
                        [minLng, minLat],
                      ],
                    });
                  }
                });
              }, 1000);
            }
          });
        } else {
          clearInterval(timer)
          map.getLayer("irLayer") && map.removeLayer("irLayer");
          map.getSource("irSource") && map.removeSource("irSource");
        }
      },
      { immediate: true }
    );
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
    map.remove();
    timer && clearInterval(timer);
  });
});
</script>
<style lang="scss"></style>
