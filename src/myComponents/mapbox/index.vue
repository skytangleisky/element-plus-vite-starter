<template>
  <div ref="mapRef" class="w-full h-full"></div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
let grid = turf.interpolate(points, 0.05, interpolate_options);
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
let isobands = turf.isobands(grid, [1, 10, 20, 30, 50, 70, 100], isobands_options);

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
// 可视化及交互部分
onMounted(() => {
  if (!mapRef) throw Error("invalid mapRef!");
  var map = new mapboxgl.Map({
    container: mapRef.value,
    style: "mapbox://styles/mapbox/streets-v11",
    bounds: turf.bbox(boundaries),
  });

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
    // 逐个添加过程中形成的图层
    map.addLayer({
      id: "tilelayer",
      type: "raster",
      source: {
        type: "raster",
        tiles: ["https://tanglei.site:3210/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}"],
        //zoomOffset:-1,
        tileSize: 256,
      },
      paint: {},
      layout: {},
    });
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
      layout: {},
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

    // var toggleableLayerIds = ["points", "grid", "isobands", "intersection"];
    // toggleableLayerIds.map((v,k)=>{
    //   let visibility = map.getLayoutProperty(v,"visibility");
    //   map.setLayoutProperty(v,"visibility","visible")
    //   map.setLayoutProperty(v,"visibility","none")
    // }
  });
  var hoveredStateId = null;
  map.on("mousemove", "intersection", function (e) {
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
});
</script>
<style lang="scss"></style>
