import { rgb2Hsl } from "~/myComponents/map/js/core";
import palette from "../mapbox/data/温度/tempreture.xml?raw";
import plotUrl from "../mapbox/data/plot/06040802.000?url";
import { getMicapsData } from "../mapbox/data/plot/micaps";
import interpolate from "~/tools/idw.js";
import { isoLines, isoBands } from "marchingsquares";
import { area, pointInPolygon,removeLayerAndSource } from "~/tools/index.ts";
import { sixty2Float } from "~/tools/index.ts";
import { wgs84togcj02 } from "../map/workers/mapUtil";
let LAT = Math.atan(Math.sinh(Math.PI)) * 180 / Math.PI;
let interpolateCount = 10;
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
  //hsl(240,100%,50%)～hsl(180,100%,50%)hsl(60,100%,50%)～hsl(0,100%,50%)
  return percent < 0.5 ? ((0.5 - percent) / 0.5) * 60 + 180 : ((1 - percent) / 0.5) * 60;
  // hsl(240,100%,50%)～hsl(180,100%,50%)
  // return (1 - percent) * 60 + 180;
  //hsl(60,100%,50%)～hsl(0,100%,50%)
  // return (1 - percent) * 60;
};
export default function(map:mapboxgl.Map,data:any,opts:{isobands:boolean,isolines:boolean,gridValue:boolean,discrete:boolean}){
  // getMicapsData(plotUrl).then(async(result: any) => {
  //   result.data.map((item: any) => {
  //     // if(item.温度!==9999&&item.经度>70&&item.经度<140&&15<item.纬度&&item.纬度<55){
  //     if(item.温度!==9999){
  //       pts.push({
  //         lng: item.经度,
  //         lat: item.纬度,
  //         value: Math.round(item.温度),
  //       });
  //     }
  //   });
  // });

  let pts = new Array<{lng:number;lat:number;value:number}>;
  // for (let i = 0; i < 6; i++) {
  //   pts.push({
  //     lng: Math.random() * 6 + 105,
  //     lat: Math.random() * 4.5 + 28,
  //     value: Number((Math.random() * 20).toFixed(2)),
  //   });
  // }
  data.map((item:{lng:number,lat:number,speed:number,orientation:number})=>{
    pts.push({lng:item.lng,lat:item.lat,value:item.speed})
  })
  // let convert;
  // convert = wgs84togcj02(sixty2Float('106°37′39″'),sixty2Float('29°44′28″'))
  // pts.push({lng: convert[0],lat: convert[1],value:Number((Math.random() * 20).toFixed(2))});
  // convert = wgs84togcj02(sixty2Float('106°26′36″'),sixty2Float('29°50′31″'))
  // pts.push({lng: convert[0],lat: convert[1],value:Number((Math.random() * 20).toFixed(2))});
  // convert = wgs84togcj02(sixty2Float('106°29′32″'),sixty2Float('29°20′28″'))
  // pts.push({lng: convert[0],lat: convert[1],value:Number((Math.random() * 20).toFixed(2))});
  // convert = wgs84togcj02(sixty2Float('106°38′55″'),sixty2Float('29°00′36″'))
  // pts.push({lng: convert[0],lat: convert[1],value:Number((Math.random() * 20).toFixed(2))});
  // convert = wgs84togcj02(sixty2Float('108°24′50″'),sixty2Float('30°48′12″'))
  // pts.push({lng: convert[0],lat: convert[1],value:Number((Math.random() * 20).toFixed(2))});
  // convert = wgs84togcj02(sixty2Float('108°39′48″'),sixty2Float('31°56′40″'))
  // pts.push({lng: convert[0],lat: convert[1],value:Number((Math.random() * 20).toFixed(2))});

  let colors = {
    0.0: '#3288bd',
    0.1: '#66c2a5',
    0.2: '#abdda4',
    0.3: '#e6f598',
    0.4: '#fee08b',
    0.5: '#fdae61',
    0.6: '#f46d43',
    1.0: '#d53e4f',
  };
  var canvas = document.createElement('canvas') as HTMLCanvasElement;
  var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = 256;
  canvas.height = 1;
  var gradient = ctx.createLinearGradient(0, 0, 256, 0);
  for (var stop in colors) {
    gradient.addColorStop(+stop, colors[stop]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);
  let imgData = ctx.getImageData(0, 0, 256, 1);

  let breaks = new Array<number>();
  var Color: { [key: string]: any } = {};
  let xmlDoc = new DOMParser().parseFromString(palette, "text/xml");
  let collections = xmlDoc.getElementsByTagName("entry");
  for (let i = 0; i < collections.length; i++) {
    let value = parseInt(Number(collections[i].getAttribute("value")).toFixed());
    breaks.push(value)
    let strPalette = collections[i].getAttribute("rgba");
    if (strPalette) {
      let rgba: [number,number,number,number] = strPalette.split(",").map((v) => Number(v)) as unknown as [number,number,number,number];
      let hsl = rgb2Hsl(rgba[0],rgba[1],rgba[2])
      // Color[value.toFixed()] = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
      Color[value.toFixed()] = '#' + ((1 << 24) + (rgba[0] << 16) + (rgba[1] << 8) + rgba[2]).toString(16).slice(1);
    }
  }

  let strokeColors = [];
  breaks=[]
  for(let i=0;i<=40;i++){
    breaks.push(i*0.5);
  }
  for (let i = 0; i < breaks.length; i++) {
    let min = 0;
    let max = 20;
    let index = Math.round((breaks[i]-min)/(max-min)*imgData.width)
    let r = imgData.data[4*index+0]
    let g = imgData.data[4*index+1]
    let b = imgData.data[4*index+2]
    strokeColors.push(`rgb(${r},${g},${b})`)
    // strokeColors.push(`hsl(${getHue(0, breaks[i], 20)},100%,50%)`);
    // strokeColors.push(Color[breaks[i].toFixed()]);
  }

  // for (let i = 0; i < breaks.length; i++) {
  //   strokeColors.push(breaks[i]);
  //   // strokeColors.push(`hsl(${getHue(-36, breaks[i], 36)},100%,50%)`);
  //   strokeColors.push(Color[breaks[i].toFixed()]);
  // }
  let interpolateOptions = {
    sizeU: 20,
    sizeV: 20,
    boundary: {
      lng: 105,
      lat: 28,
      width: 6,
      height: 4.5,
    },
    power: 6,
  };
  // let interpolateOptions = {
  //   sizeU: 140,
  //   sizeV: 80,
  //   boundary: {
  //     lng: -180,
  //     lat: -LAT,
  //     width: 360,
  //     height: 2*LAT,
  //   },
  //   power: 6,
  // };
  let grid = interpolate(pts, interpolateOptions)
  var bandWidths = breaks.reduce(function (bw, upperBand, i, intervals) {
    if (i > 0) {
      var lowerBand = intervals[i - 1];
      bw.push(upperBand - lowerBand);
    }
    return bw;
  }, new Array<number>());
  var multiBands = isoBands(grid, breaks.slice(0, -1), bandWidths, {
    verbose: false,
    polygons: false,
    linearRing: false,
    noFrame: true,
    noQuadTree: false,
    polygons_full: false,
    interpolateCount,
    successCallback: () => {},
  });
  let isobands = {
    type: "FeatureCollection",
    features: new Array<any>(),
  };
  for (let j = 0; j < multiBands.length; j++) {
    let feature = {
      type: "Feature",
      properties: { threshold: breaks[j] + "-" + breaks[j + 1],fillColor:strokeColors[j] },
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
            interpolateOptions.boundary.lng,
          (point[1] / (interpolateOptions.sizeV - 1)) *
            interpolateOptions.boundary.height +
            interpolateOptions.boundary.lat,
        ]);
      });
      if (interpolateOptions.boundary.width * interpolateOptions.boundary.height * area(points) < 0) {
        polygons.push(points);
      } else {
        holes.push(points);
      }
    }
    for (let k = 0; k < polygons.length; k++) {
      let polygon = polygons.splice(k--, 1)[0];
      let tmp = [polygon];
      for (let m = 0; m < holes.length; m++) {
        if (
          pointInPolygon(holes[m][0], polygon) &&
          polygons.every((item: any) => !pointInPolygon(holes[m][0], item))
        ) {
          let hole = holes.splice(m--, 1)[0];
          tmp.push(hole);
        }
      }
      feature.geometry.coordinates.push(tmp);
    }
    isobands.features.push(feature);
  }
  removeLayerAndSource(map,'等值带')
  map.addLayer({
    id: "等值带",
    type: "fill",
    source: {
      type: "geojson",
      data: isobands as any,
    },
    layout: {
      visibility:opts.isobands?"visible":"none"
    },
    paint: {
      "fill-color": ["get", "fillColor"],
      "fill-opacity": 0.5,
      "fill-outline-color": 'transparent'
    },
  });

  var multiLines = isoLines(grid, breaks, {
    noFrame: true,
    polygons: false,
    polygons_full: false,
    noQuadTree: false,
    linearRing: false,
    verbose: false,
    interpolateCount,
    successCallback: (multiLines: any, threshold: number) => {},
  });
  let isolines = {
    type: "FeatureCollection",
    features: new Array<any>(),
  };
  let isolineValues = {
    type: "FeatureCollection",
    features: new Array<any>(),
  };
  for (let j = 0; j < multiLines.length; j++) {
    let feature = {
      type: "Feature",
      properties: { threshold: breaks[j],textColor:strokeColors[j]},
      geometry: {
        type: "MultiLineString",
        coordinates: new Array<any>(),
      },
    };
    let featureValue = {
      type: "Feature",
      properties: { threshold: breaks[j],textColor: strokeColors[j]},
      geometry: {
        type: "MultiPoint",
        coordinates: new Array<any>(),
      },
    };
    // console.log(multiLines[j])
    for (let i = 0; i < multiLines[j].length; i++) {
      let line = multiLines[j][i];
      let points = new Array<any>();
      for(let k=0;k<line.length;k++){
        let point = [
          (line[k][0] / (interpolateOptions.sizeU - 1)) *
            interpolateOptions.boundary.width +
            interpolateOptions.boundary.lng,
          (line[k][1] / (interpolateOptions.sizeV - 1)) *
            interpolateOptions.boundary.height +
            interpolateOptions.boundary.lat,
        ]
        points.push(point);
      }
      feature.geometry.coordinates.push(points);
      let firstPoint = points[0]
      let lastPoint = points.slice(-1)[0]
      if(JSON.stringify(firstPoint)===JSON.stringify(lastPoint)){
        featureValue.geometry.coordinates.push(firstPoint)
      }else{
        featureValue.geometry.coordinates.push(firstPoint)
        featureValue.geometry.coordinates.push(lastPoint)
      }
    }
    isolines.features.push(feature);
    isolineValues.features.push(featureValue);
  }

  removeLayerAndSource(map,'等值线')
  map.addLayer({
    id: "等值线",
    type: "line",
    source: {
      type: "geojson",
      data: isolines as any,
    },
    layout: {
      visibility:opts.isolines?'visible':'none'
    },
    paint: {
      "line-color": ['get','textColor'],
      "line-width": 1,
      "line-opacity": 1,
    },
  });

  removeLayerAndSource(map,'等值线值')
  map.addLayer({
    id: "等值线值",
    type: "symbol",
    source: {
      type: "geojson",
      data: isolineValues as any,
    },
    layout: {
      "visibility":opts.isolines?'visible':'none',
      "text-field": ["get", "threshold"],
      "text-size":16,
      "text-font": ["simkai"],
      "text-offset": [0, 0.2],
      "text-anchor": "bottom",
      "text-ignore-placement": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-color":  ['get','textColor'],
      "text-halo-width": 1,
      "text-halo-color": "black",
    },
  });

  let discretePoints = {
    type: "FeatureCollection",
    features: new Array<any>(),
  };

  pts.map(item=>{
    discretePoints.features.push({
      type: "Feature",
      properties: {
        threshold: item.value,
      },
      geometry: {
        type: "Point",
        coordinates: [item.lng, item.lat],
      },
    });
  })

  removeLayerAndSource(map,'离散值')
  map.addLayer({
    id: "离散值",
    type: "symbol",
    source: { type: "geojson", data: discretePoints as any },
    layout: {
      "visibility":opts.discrete?"visible":"none",
      "text-field": ["get", "threshold"],
      "text-size":24,
      "text-font": ["simkai"],
      "text-offset": [0, 0.2],
      "text-anchor": "bottom",
      "text-ignore-placement": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-color": "white",
      "text-halo-width": 1,
      "text-halo-color": "black",
    },
  });

  removeLayerAndSource(map,'离散点')
  map.addLayer({
    id: "离散点",
    type: "circle",
    source: { type: "geojson", data: discretePoints as any },
    layout:{
      "visibility":opts.discrete?"visible":"none",
    },
    paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1,"circle-stroke-color":'black' },
  });

  let gridPoints = {
    type: "FeatureCollection",
    features: new Array<any>(),
  };
  for (let j = 0; j < grid.length; j++) {
    for (let i = 0; i < grid[j].length; i++) {
      let x = (i / (interpolateOptions.sizeU - 1)) * interpolateOptions.boundary.width + interpolateOptions.boundary.lng;
      let y = (j / (interpolateOptions.sizeV - 1)) * interpolateOptions.boundary.height + interpolateOptions.boundary.lat;
      gridPoints.features.push({
        type: "Feature",
        properties: {
          threshold: grid[j][i].toFixed(2),
          color: "white",
        },
        geometry: {
          type: "Point",
          coordinates: [x, y],
        },
      });
    }
  }

  removeLayerAndSource(map,'网格值')
  map.addLayer({
    id: "网格值",
    type: "symbol",
    source: { type: "geojson", data: gridPoints as any },
    layout: {
      "visibility":opts.gridValue?'visible':'none',
      "text-field": ["get", "threshold"],
      "text-font": ["simkai"],
      "text-offset": [0, 0.2],
      "text-anchor": "bottom",
      "text-ignore-placement": true,
      "text-rotation-alignment": "map",
    },
    paint: {
      "text-color": ["get", "color"],
      "text-halo-width": 1,
      "text-halo-color": "black",
    },
  });

  removeLayerAndSource(map,'网格点')
  map.addLayer({
    id: "网格点",
    type: "circle",
    source: { type: "geojson", data: gridPoints as any},
    layout:{
      "visibility":opts.gridValue?'visible':'none',
    },
    paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1 },
  });

  // removeLayerAndSource(map,'等值线边界')
  // map.addLayer({
  //   id: "等值线边界",
  //   type: "fill",
  //   source: {
  //     type: "geojson",
  //     data: {
  //       type: "Feature",
  //       geometry: {
  //         type: "Polygon",
  //         coordinates: [
  //           [
  //             [-180, -50],
  //             [180, -50],
  //             [180, 50],
  //             [-180, 50],
  //             [-180, -50],
  //           ],
  //         ],
  //       },
  //     },
  //   },
  //   layout: {},
  //   paint: {
  //     "line-color": "yellow",
  //     "line-opacity": 1,
  //     "line-width": 1,
  //     "fill-color": "cyan",
  //     "fill-opacity": 0.5,
  //   },
  // });
}