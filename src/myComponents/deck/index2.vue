<template>
  <div ref="mapRef" class="w-full h-full"></div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import Tile from "ol/layer/Tile.js";
import Image from "ol/layer/Image.js";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import ImageCanvas from "ol/source/ImageCanvas";
import { Point, Polygon } from "ol/geom";
import Layer from "ol/layer/Vector";
import Source from "ol/source/Vector";
import { Feature, Map, View } from "ol";
import "ol/ol.css";
import { Style, Circle, Fill, Text, Stroke } from "ol/style.js";
import kriging from "./kriging.js";
import { fromLonLat, toLonLat, transform } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector";
var data = {
  features: [
    {
      attributes: {
        FID: 0,
        id: 1,
        name: "Beijing US Embassy",
        x: 116.468,
        y: 39.954999999999998,
        z: 46,
        xu: 454558.72859999997,
        yu: 4422898.159,
      },
      geometry: {
        x: 116.468,
        y: 39.954999999999998,
      },
    },
    {
      attributes: {
        FID: 1,
        id: 2,
        name: "Temple of Heaven",
        x: 116.407,
        y: 39.886000000000003,
        z: 36,
        xu: 449297.45990000002,
        yu: 4415272.716,
      },
      geometry: {
        x: 116.407,
        y: 39.886000000000003,
      },
    },
    {
      attributes: {
        FID: 2,
        id: 3,
        name: "Haidian Beijing Botanical Garden",
        x: 116.20699999999999,
        y: 40.002000000000002,
        z: 40,
        xu: 432311.35320000001,
        yu: 4428280.3169999998,
      },
      geometry: {
        x: 116.20699999999999,
        y: 40.002000000000002,
      },
    },
    {
      attributes: {
        FID: 3,
        id: 4,
        name: "Chaoyang Olympic Sports Center116.397",
        x: 116.39700000000001,
        y: 39.981999999999999,
        z: 43,
        xu: 448514.42090000003,
        yu: 4425933.4840000002,
      },
      geometry: {
        x: 116.39700000000001,
        y: 39.981999999999999,
      },
    },
    {
      attributes: {
        FID: 4,
        id: 5,
        name: "Chaoyang Agricultural Exhibition Hall",
        x: 116.461,
        y: 39.936999999999998,
        z: 52,
        xu: 453948.74660000001,
        yu: 4420903.926,
      },
      geometry: {
        x: 116.461,
        y: 39.936999999999998,
      },
    },
    {
      attributes: {
        FID: 5,
        id: 6,
        name: "Liangxiang",
        x: 116.136,
        y: 39.741999999999997,
        z: 123,
        xu: 425971.88909999997,
        yu: 4399479.2439999999,
      },
      geometry: {
        x: 116.136,
        y: 39.741999999999997,
      },
    },
    {
      attributes: {
        FID: 6,
        id: 7,
        name: "Fengtai Yungang",
        x: 116.146,
        y: 39.823999999999998,
        z: 85,
        xu: 426915.51539999997,
        yu: 4408572.0729999999,
      },
      geometry: {
        x: 116.146,
        y: 39.823999999999998,
      },
    },
    {
      attributes: {
        FID: 7,
        id: 8,
        name: "Shunyi New Town",
        x: 116.655,
        y: 40.127000000000002,
        z: 154,
        xu: 470605.50309999997,
        yu: 4441910.1670000004,
      },
      geometry: {
        x: 116.655,
        y: 40.127000000000002,
      },
    },
    {
      attributes: {
        FID: 8,
        id: 12,
        name: "Donggaocun Zhen",
        x: 117.12,
        y: 40.100000000000001,
        z: 172,
        xu: 510228.20750000002,
        yu: 4438863.2359999996,
      },
      geometry: {
        x: 117.12,
        y: 40.100000000000001,
      },
    },
    {
      attributes: {
        FID: 9,
        id: 13,
        name: "Tongzhou New Town",
        x: 116.663,
        y: 39.886000000000003,
        z: 216,
        xu: 471185.97159999999,
        yu: 4415158.7980000004,
      },
      geometry: {
        x: 116.663,
        y: 39.886000000000003,
      },
    },
    {
      attributes: {
        FID: 10,
        id: 14,
        name: "Huangcunzhen",
        x: 116.404,
        y: 39.718000000000004,
        z: 226,
        xu: 448916.78909999999,
        yu: 4396628.5209999997,
      },
      geometry: {
        x: 116.404,
        y: 39.718000000000004,
      },
    },
    {
      attributes: {
        FID: 11,
        id: 15,
        name: "BDA",
        x: 116.506,
        y: 39.795000000000002,
        z: 216,
        xu: 457706.38530000002,
        yu: 4405121.3250000002,
      },
      geometry: {
        x: 116.506,
        y: 39.795000000000002,
      },
    },
    {
      attributes: {
        FID: 12,
        id: 16,
        name: "Yufazhen",
        x: 116.3,
        y: 39.520000000000003,
        z: 204,
        xu: 439831.65490000002,
        yu: 4374718.0180000002,
      },
      geometry: {
        x: 116.3,
        y: 39.520000000000003,
      },
    },
    {
      attributes: {
        FID: 13,
        id: 17,
        name: "Yongledianzhen",
        x: 116.783,
        y: 39.712000000000003,
        z: 198,
        xu: 481399.35399999999,
        yu: 4395815.3370000003,
      },
      geometry: {
        x: 116.783,
        y: 39.712000000000003,
      },
    },
    {
      attributes: {
        FID: 14,
        id: 18,
        name: "Xianghe EPA",
        x: 117.009,
        y: 39.765999999999998,
        z: 204,
        xu: 500770.85320000001,
        yu: 4401786.0719999997,
      },
      geometry: {
        x: 117.009,
        y: 39.765999999999998,
      },
    },
    {
      attributes: {
        FID: 15,
        id: 19,
        name: "Badaling Northwest",
        x: 115.988,
        y: 40.365000000000002,
        z: 46,
        xu: 414076.95390000002,
        yu: 4468761.409,
      },
      geometry: {
        x: 115.988,
        y: 40.365000000000002,
      },
    },
    {
      attributes: {
        FID: 16,
        id: 20,
        name: "East Fourth Ring Road",
        x: 116.483,
        y: 39.939,
        z: 181,
        xu: 455829.68479999999,
        yu: 4421114.7860000003,
      },
      geometry: {
        x: 116.483,
        y: 39.939,
      },
    },
    {
      attributes: {
        FID: 17,
        id: 21,
        name: "Yanqing town",
        x: 115.97199999999999,
        y: 40.453000000000003,
        z: 59,
        xu: 412832.08510000003,
        yu: 4478545.159,
      },
      geometry: {
        x: 115.97199999999999,
        y: 40.453000000000003,
      },
    },
    {
      attributes: {
        FID: 18,
        id: 22,
        name: "Miyun Reservoir",
        x: 116.911,
        y: 40.499000000000002,
        z: 63,
        xu: 492458.57429999998,
        yu: 4483147.5360000003,
      },
      geometry: {
        x: 116.911,
        y: 40.499000000000002,
      },
    },
    {
      attributes: {
        FID: 19,
        id: 23,
        name: "Haidian Wanliu",
        x: 116.28700000000001,
        y: 39.987000000000002,
        z: 180,
        xu: 439126.71720000001,
        yu: 4426557.75,
      },
      geometry: {
        x: 116.28700000000001,
        y: 39.987000000000002,
      },
    },
    {
      attributes: {
        FID: 20,
        id: 24,
        name: "Yongdingmen Inner St",
        x: 116.39400000000001,
        y: 39.875999999999998,
        z: 196,
        xu: 448178.40250000003,
        yu: 4414170.284,
      },
      geometry: {
        x: 116.39400000000001,
        y: 39.875999999999998,
      },
    },
    {
      attributes: {
        FID: 21,
        id: 25,
        name: "Jianshe Road",
        x: 117.304,
        y: 39.719000000000001,
        z: 55,
        xu: 526055.42509999999,
        yu: 4396613.8959999997,
      },
      geometry: {
        x: 117.304,
        y: 39.719000000000001,
      },
    },
    {
      attributes: {
        FID: 22,
        id: 26,
        name: "Ligong, Chengde",
        x: 117.938,
        y: 41.011000000000003,
        z: 70,
        xu: 578874.61600000004,
        yu: 4540401.8559999997,
      },
      geometry: {
        x: 117.938,
        y: 41.011000000000003,
      },
    },
    {
      attributes: {
        FID: 23,
        id: 27,
        name: "Fengning County City Hall",
        x: 116.652,
        y: 41.215000000000003,
        z: 59,
        xu: 470827.95390000002,
        yu: 4562682.9199999999,
      },
      geometry: {
        x: 116.652,
        y: 41.215000000000003,
      },
    },
    {
      attributes: {
        FID: 24,
        id: 28,
        name: "Xiahuayuan EPA",
        x: 115.29600000000001,
        y: 40.508000000000003,
        z: 61,
        xu: 355627.29269999999,
        yu: 4485537.4510000004,
      },
      geometry: {
        x: 115.29600000000001,
        y: 40.508000000000003,
      },
    },
    {
      attributes: {
        FID: 25,
        id: 29,
        name: "Yuxian Secondary School",
        x: 114.596,
        y: 39.845999999999997,
        z: 61,
        xu: 294324.1188,
        yu: 4413430.4780000001,
      },
      geometry: {
        x: 114.596,
        y: 39.845999999999997,
      },
    },
    {
      attributes: {
        FID: 26,
        id: 30,
        name: "Zhouzhou Monitoring Stations",
        x: 116.03400000000001,
        y: 39.491999999999997,
        z: 80,
        xu: 416933.99089999998,
        yu: 4371822.0190000003,
      },
      geometry: {
        x: 116.03400000000001,
        y: 39.491999999999997,
      },
    },
    {
      attributes: {
        FID: 27,
        id: 31,
        name: "Guan Party School, Langfang",
        x: 116.30500000000001,
        y: 39.445,
        z: 70,
        xu: 440197.23119999998,
        yu: 4366391.0480000004,
      },
      geometry: {
        x: 116.30500000000001,
        y: 39.445,
      },
    },
    {
      attributes: {
        FID: 28,
        id: 32,
        name: "Guyuan County welfare",
        x: 115.681,
        y: 41.667999999999999,
        z: 63,
        xu: 390196.44390000001,
        yu: 4613756.0429999996,
      },
      geometry: {
        x: 115.681,
        y: 41.667999999999999,
      },
    },
  ],
};
const mapRef = ref(null);
onMounted(() => {
  let params = {
    mapCenter: fromLonLat([116.4, 39.9]),
    colors: [
      // "#006837",
      "#1a9850",
      "#66bd63",
      "#a6d96a",
      "#d9ef8b",
      "#ffffbf",
      "#fee08b",
      "#fdae61",
      "#f46d43",
      "#d73027",
      "#a50026",
    ],
    colors0: [
      "#00A600",
      "#01A600",
      "#03A700",
      "#04A700",
      "#05A800",
      "#07A800",
      "#08A900",
      "#09A900",
      "#0BAA00",
      "#0CAA00",
      "#0DAB00",
      "#0FAB00",
      "#10AC00",
      "#12AC00",
      "#13AD00",
      "#14AD00",
      "#16AE00",
      "#17AE00",
      "#19AF00",
      "#1AAF00",
      "#1CB000",
      "#1DB000",
      "#1FB100",
      "#20B100",
      "#22B200",
      "#23B200",
      "#25B300",
      "#26B300",
      "#28B400",
      "#29B400",
      "#2BB500",
      "#2CB500",
      "#2EB600",
      "#2FB600",
      "#31B700",
      "#33B700",
      "#34B800",
      "#36B800",
      "#37B900",
      "#39B900",
      "#3BBA00",
      "#3CBA00",
      "#3EBB00",
      "#3FBB00",
      "#41BC00",
      "#43BC00",
      "#44BD00",
      "#46BD00",
      "#48BE00",
      "#49BE00",
      "#4BBF00",
      "#4DBF00",
      "#4FC000",
      "#50C000",
      "#52C100",
      "#54C100",
      "#55C200",
      "#57C200",
      "#59C300",
      "#5BC300",
      "#5DC400",
      "#5EC400",
      "#60C500",
      "#62C500",
      "#64C600",
      "#66C600",
      "#67C700",
      "#69C700",
      "#6BC800",
      "#6DC800",
      "#6FC900",
      "#71C900",
      "#72CA00",
      "#74CA00",
      "#76CB00",
      "#78CB00",
      "#7ACC00",
      "#7CCC00",
      "#7ECD00",
      "#80CD00",
      "#82CE00",
      "#84CE00",
      "#86CF00",
      "#88CF00",
      "#8AD000",
      "#8BD000",
      "#8DD100",
      "#8FD100",
      "#91D200",
      "#93D200",
      "#95D300",
      "#97D300",
      "#9AD400",
      "#9CD400",
      "#9ED500",
      "#A0D500",
      "#A2D600",
      "#A4D600",
      "#A6D700",
      "#A8D700",
      "#AAD800",
      "#ACD800",
      "#AED900",
      "#B0D900",
      "#B2DA00",
      "#B5DA00",
      "#B7DB00",
      "#B9DB00",
      "#BBDC00",
      "#BDDC00",
      "#BFDD00",
      "#C2DD00",
      "#C4DE00",
      "#C6DE00",
      "#C8DF00",
      "#CADF00",
      "#CDE000",
      "#CFE000",
      "#D1E100",
      "#D3E100",
      "#D6E200",
      "#D8E200",
      "#DAE300",
      "#DCE300",
      "#DFE400",
      "#E1E400",
      "#E3E500",
      "#E6E600",
      "#E6E402",
      "#E6E204",
      "#E6E105",
      "#E6DF07",
      "#E6DD09",
      "#E6DC0B",
      "#E6DA0D",
      "#E6D90E",
      "#E6D710",
      "#E6D612",
      "#E7D414",
      "#E7D316",
      "#E7D217",
      "#E7D019",
      "#E7CF1B",
      "#E7CE1D",
      "#E7CD1F",
      "#E7CB21",
      "#E7CA22",
      "#E7C924",
      "#E8C826",
      "#E8C728",
      "#E8C62A",
      "#E8C52B",
      "#E8C42D",
      "#E8C32F",
      "#E8C231",
      "#E8C133",
      "#E8C035",
      "#E8BF36",
      "#E9BE38",
      "#E9BD3A",
      "#E9BC3C",
      "#E9BB3E",
      "#E9BB40",
      "#E9BA42",
      "#E9B943",
      "#E9B945",
      "#E9B847",
      "#E9B749",
      "#EAB74B",
      "#EAB64D",
      "#EAB64F",
      "#EAB550",
      "#EAB552",
      "#EAB454",
      "#EAB456",
      "#EAB358",
      "#EAB35A",
      "#EAB35C",
      "#EBB25D",
      "#EBB25F",
      "#EBB261",
      "#EBB263",
      "#EBB165",
      "#EBB167",
      "#EBB169",
      "#EBB16B",
      "#EBB16C",
      "#EBB16E",
      "#ECB170",
      "#ECB172",
      "#ECB174",
      "#ECB176",
      "#ECB178",
      "#ECB17A",
      "#ECB17C",
      "#ECB17E",
      "#ECB27F",
      "#ECB281",
      "#EDB283",
      "#EDB285",
      "#EDB387",
      "#EDB389",
      "#EDB38B",
      "#EDB48D",
      "#EDB48F",
      "#EDB591",
      "#EDB593",
      "#EDB694",
      "#EEB696",
      "#EEB798",
      "#EEB89A",
      "#EEB89C",
      "#EEB99E",
      "#EEBAA0",
      "#EEBAA2",
      "#EEBBA4",
      "#EEBCA6",
      "#EEBDA8",
      "#EFBEAA",
      "#EFBEAC",
      "#EFBFAD",
      "#EFC0AF",
      "#EFC1B1",
      "#EFC2B3",
      "#EFC3B5",
      "#EFC4B7",
      "#EFC5B9",
      "#EFC7BB",
      "#F0C8BD",
      "#F0C9BF",
      "#F0CAC1",
      "#F0CBC3",
      "#F0CDC5",
      "#F0CEC7",
      "#F0CFC9",
      "#F0D1CB",
      "#F0D2CD",
      "#F0D3CF",
      "#F1D5D1",
      "#F1D6D3",
      "#F1D8D5",
      "#F1D9D7",
      "#F1DBD8",
      "#F1DDDA",
      "#F1DEDC",
      "#F1E0DE",
      "#F1E2E0",
      "#F1E3E2",
      "#F2E5E4",
      "#F2E7E6",
      "#F2E9E8",
      "#F2EBEA",
      "#F2ECEC",
      "#F2EEEE",
      "#F2F0F0",
      "#F2F2F2",
    ],
  };
  let baseLayer = new Tile({
    title: "base",
    // source: new OSM(),
    source: new XYZ({
      url: "https://tanglei.site:3210/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}",
    }),
    preload: Infinity,
  });
  let map = new Map({
    target: mapRef.value,
    layers: [baseLayer],
    view: new View({
      center: params.mapCenter,
      projection: "EPSG:3857", //EPSG:4326
      zoom: 8,
    }),
  });
  let WFSVectorSource = new Source();
  let WFSVectorLayer = new Layer({
    source: WFSVectorSource,
  });
  //创建要素
  for (let i = 0; i < data.features.length; i++) {
    let feature = new Feature({
      geometry: new Point(
        fromLonLat([data.features[i].attributes.x, data.features[i].attributes.y])
      ),
      value: data.features[i].attributes.z,
    });
    feature.setStyle(
      new Style({
        image: new Circle({
          radius: 4,
          fill: new Fill({ color: "#fa0" }),
          stroke: new Stroke({
            width: 1,
            color: "black",
          }),
        }),
        text: new Text({
          text: data.features[i].attributes.z.toString(),
          font: "normal 14px 微软雅黑", //字体样式
          //font: '10px sans-serif',
          //font: 'verdana',
          textAlign: "left", //对齐方式
          textBaseline: "middle", //文本基线
          //文本填充样式（即文字颜色)
          fill: new Fill({
            color: "#00f",
          }),
          //backgroundFill: new Fill({
          //  color: "#ff0000"
          //}),
          stroke: new Stroke({
            color: "#000",
            width: 1,
          }),
          offsetX: 6,
          offsetY: 0,
          //placement: "point", //point 则自动计算面的中心k点然后标注  line 则根据面要素的边进行标注
          overflow: false, //超出面的部分不显示
        }),
      })
    );
    WFSVectorSource.addFeature(feature);
  }
  WFSVectorSource.addFeatures([
    new Feature({
      geometry: new Point(fromLonLat([113, 38])),
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: "#fa0" }),
        stroke: new Stroke({
          width: 0.5,
          color: "black",
        }),
      }),
    }),
    new Feature({
      geometry: new Point(fromLonLat([120, 38])),
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: "#fa0" }),
        stroke: new Stroke({
          width: 0.5,
          color: "black",
        }),
      }),
    }),
    new Feature({
      geometry: new Point(fromLonLat([120, 43])),
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: "#fa0" }),
        stroke: new Stroke({
          width: 0.5,
          color: "black",
        }),
      }),
    }),
    new Feature({
      geometry: new Point(fromLonLat([113, 43])),
      image: new Circle({
        radius: 4,
        fill: new Fill({ color: "#fa0" }),
        stroke: new Stroke({
          width: 0.5,
          color: "black",
        }),
      }),
    }),
  ]);
  //定义裁剪边界
  let coord = [
    [
      [117.315375, 40.181212],
      [117.367916, 40.135762],
      [116.751758, 40.002595],
      [116.754136, 39.870341],
      [116.913383, 39.804999],
      [116.901858, 39.680614],
      [116.788145, 39.56255],
      [116.535646, 39.590346],
      [116.392103, 39.491124],
      [116.4293, 39.433841],
      [116.387072, 39.417336],
      [116.237232, 39.476253],
      [116.172242, 39.578854],
      [115.728745, 39.479123],
      [115.610225, 39.588658],
      [115.508537, 39.59137],
      [115.416399, 39.733407],
      [115.416624, 39.776734],
      [115.550565, 39.772964],
      [115.408433, 40.015829],
      [115.85422, 40.144999],
      [115.922315, 40.216777],
      [115.708758, 40.499032],
      [115.89819, 40.585919],
      [116.03778, 40.577909],
      [116.208725, 40.741562],
      [116.454984, 40.739689],
      [116.297615, 40.910402],
      [116.43816, 40.870116],
      [116.405424, 40.94854],
      [116.537137, 40.9661],
      [116.621495, 41.057333],
      [116.703349, 40.853574],
      [116.93405, 40.675155],
      [117.454502, 40.647216],
      [117.387854, 40.533274],
      [117.166811, 40.503979],
      [117.164198, 40.373887],
      [117.315375, 40.181212],
      // [113, 38],
      // [120, 38],
      // [120, 43],
      // [113, 43],
      // [113, 38],
    ],
  ];
  let clipgeom = new Polygon(coord);
  //绘制kriging插值图
  let canvasLayer = null;
  let pointVectorLayer = null;
  let drawKriging = function (extent) {
    let values = [],
      lngs = [],
      lats = [];
    for (let i = 0; i < data.features.length; i++) {
      values.push(data.features[i].attributes.z);
      let pt = [data.features[i].attributes.x, data.features[i].attributes.y];
      lngs.push(pt[0]);
      lats.push(pt[1]);
    }
    if (values.length > 2) {
      let letiogram = kriging.train(
        values,
        lngs,
        lats,
        "exponential", //model可选exponential,gaussian,spherical
        0,
        100
      );
      let ex = clipgeom.getExtent();
      let grid0 = kriging.grid(coord, letiogram, (ex[2] - ex[0]) / 50);
      let grid = kriging.grid(coord, letiogram, (ex[2] - ex[0]) / 50);
      //移除已有图层
      if (canvasLayer !== null) {
        map.removeLayer(canvasLayer);
      }
      //创建新图层
      var canvas = document.createElement("canvas");
      canvasLayer = new Image({
        source: new ImageCanvas({
          canvasFunction: (extent, resolution, pixelRatio, size, projection) => {
            canvas.width = size[0];
            canvas.height = size[1];
            // 设置canvas透明度
            // canvas.getContext("2d").globalAlpha = params.canvasAlpha; //放开后有网格线，
            // canvas.getContext("2d").rect(50, 20, 200, 100);
            // canvas.getContext("2d").lineWidth = "20";
            // canvas.getContext("2d").strokeStyle = "#0000ff";
            // canvas.getContext("2d").shadowColor = "rgba(0, 0, 255, 0)";
            // canvas.getContext("2d").strokeStyle = "rgba(255,192,203)";
            // canvas.getContext("2d").fillStyle = "rgba(0,0,255,0.5)";
            // 先填充颜色
            // canvas.getContext("2d").fill();
            // 后画轮廓线
            // canvas.getContext("2d").stroke();
            //使用分层设色渲染
            kriging.plot(
              canvas,
              grid,
              [extent[0], extent[2]],
              [extent[1], extent[3]],
              params.colors
            );
            return canvas;
          },
          projection: "EPSG:4326",
        }),
      });
      //向map添加图层
      map.addLayer(canvasLayer);

      map.addLayer(WFSVectorLayer);

      //移除已有图层
      if (pointVectorLayer !== null) {
        map.removeLayer(pointVectorLayer);
      }
      //添加grid网格点图层
      let pointVectorSource = new Source();
      pointVectorLayer = new Layer({
        source: pointVectorSource,
      });
      map.addLayer(pointVectorLayer);
      //创建要素
      for (let i = 0; i < grid0.length; i++) {
        for (let j = 0; j < grid0[i].length; j++) {
          let feature = new Feature({
            geometry: new Point(
              fromLonLat([
                (i / grid0.length) * (grid0.xlim[1] - grid0.xlim[0]) + grid0.xlim[0],
                (j / grid0[i].length) * (grid0.ylim[1] - grid0.ylim[0]) + grid0.ylim[0],
              ])
            ),
            value: grid0[i][j],
          });
          // let showText = feature.getProperties().value.toFixed(2);
          let showText = (
            (feature.getProperties().value - grid0.zlim[0]) /
            (grid0.zlim[1] - grid0.zlim[0])
          ).toFixed(3);
          feature.setStyle(
            new Style({
              //fill: new Fill({
              //    color: 'rgba(0, 0, 0, 0.3)'
              //}),
              //stroke: new Stroke({
              //    color: 'blue',
              //    width: 2
              //}),
              image: new Circle({
                radius: 2,
                fill: new Fill({ color: "#FF0000" }),
                stroke: new Stroke({
                  width: 1,
                  color: "black",
                }),
              }),
              text: new Text({
                text: showText,
                font: "normal 14px 微软雅黑", //字体样式
                //font: '10px sans-serif',
                //font: 'verdana',
                textAlign: "left", //对齐方式
                textBaseline: "bottom", //文本基线
                //文本填充样式（即文字颜色)
                fill: new Fill({
                  color: "#ff0000",
                }),
                //backgroundFill: new Fill({
                //  color: "#ff0000"
                //}),
                stroke: new Stroke({
                  color: "#000",
                  width: 1,
                }),
                offsetX: 0,
                offsetY: 0,
                //placement: "point", //point 则自动计算面的中心k点然后标注  line 则根据面要素的边进行标注
                overflow: false, //超出面的部分不显示
              }),
            })
          );
          pointVectorSource.addFeature(feature);
        }
      }
    } else {
      alert("有效样点个数不足，无法插值");
    }
  };
  //首次加载，自动渲染一次差值图
  let extent = clipgeom.getExtent();
  drawKriging(extent);
});
</script>
