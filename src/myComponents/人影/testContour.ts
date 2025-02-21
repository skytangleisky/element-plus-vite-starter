import { getMicapsData } from "../mapbox/data/plot/micaps";
import palette2 from "../mapbox/data/highTemperature/850hPaTemp.xml?raw";
import plotUrl2 from "../mapbox/data/highTemperature/06040808.000?url";
import { rgb2Hsl } from "~/myComponents/map/js/core";
import { isoLines, isoBands } from "marchingsquares";
import { area, pointInPolygon } from "~/tools/index.ts";
export default function(map:mapboxgl.Map,opts:{isobands:boolean,isolines:boolean,gridPoint:boolean,gridValue:boolean}){
  getMicapsData(plotUrl2).then(async (result: any) => {
    let breaks = new Array<number>();
    var Color: { [key: string]: any } = {};
    let xmlDoc = new DOMParser().parseFromString(palette2, "text/xml");
    let collections = xmlDoc.getElementsByTagName("entry");
    for (let i = 0; i < collections.length; i++) {
      let value = parseInt(Number(collections[i].getAttribute("value")).toFixed());
      breaks.push(value);
      let strPalette = collections[i].getAttribute("rgba");
      if (strPalette) {
        let rgba: [number, number, number, number] = (strPalette
          .split(",")
          .map((v) => Number(v)) as unknown) as [number, number, number, number];
        let hsl = rgb2Hsl(rgba[0], rgba[1], rgba[2]);
        // Color[value.toFixed()] = `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
        Color[value.toFixed()] =
          "#" +
          ((1 << 24) + (rgba[0] << 16) + (rgba[1] << 8) + rgba[2])
            .toString(16)
            .slice(1);
      }
    }
    let strokeColors = [];
    for (let i = 0; i < breaks.length; i++) {
      // strokeColors.push(`hsl(${getHue(-36, breaks[i], 36)},100%,50%)`);
      strokeColors.push(Color[breaks[i].toFixed()]);
    }
    let interpolateOptions = {
      sizeU: 33,
      sizeV: 18,
      boundary: {
        lng: result.beginLng,
        lat: result.beginLat,
        width: result.endLng - result.beginLng,
        height: result.endLat - result.beginLat,
      },
      power: 6,
    };
    let grid = result.data;
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
        if (
          interpolateOptions.boundary.width *
            interpolateOptions.boundary.height *
            area(points) <
          0
        ) {
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
    map.addLayer({
      id: "等值带",
      type: "fill",
      source: {
        type: "geojson",
        data: isobands as any,
      },
      layout: {
        visibility: opts.isobands ? "visible" : "none",
      },
      paint: {
        "fill-color": ["get", "fillColor"],
        "fill-opacity": 0.5,
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
    let isolineValues = {
      type: "FeatureCollection",
      features: new Array<any>(),
    };
    for (let j = 0; j < multiLines.length; j++) {
      let feature = {
        type: "Feature",
        properties: { threshold: breaks[j],textColor:strokeColors[j] },
        geometry: {
          type: "MultiLineString",
          coordinates: new Array<any>(),
        },
      };
      let featureValue = {
        type: "Feature",
        properties: { threshold: breaks[j],textColor:strokeColors[j] },
        geometry: {
          type: "MultiPoint",
          coordinates: new Array<any>(),
        },
      };
      // console.log(multiLines[j])
      for (let i = 0; i < multiLines[j].length; i++) {
        let line = multiLines[j][i];
        let points = new Array<any>();
        for (let k = 0; k < line.length; k++) {
          let point = [
            (line[k][0] / (interpolateOptions.sizeU - 1)) *
              interpolateOptions.boundary.width +
              interpolateOptions.boundary.lng,
            (line[k][1] / (interpolateOptions.sizeV - 1)) *
              interpolateOptions.boundary.height +
              interpolateOptions.boundary.lat,
          ];
          points.push(point);
        }
        feature.geometry.coordinates.push(points);
        let firstPoint = points[0];
        let lastPoint = points.slice(-1)[0];
        if (JSON.stringify(firstPoint) === JSON.stringify(lastPoint)) {
          featureValue.geometry.coordinates.push(firstPoint);
        } else {
          featureValue.geometry.coordinates.push(firstPoint);
          featureValue.geometry.coordinates.push(lastPoint);
        }
      }
      isolines.features.push(feature);
      isolineValues.features.push(featureValue);
    }
    map.addLayer({
      id: "等值线",
      type: "line",
      source: {
        type: "geojson",
        data: isolines as any,
      },
      layout: {
        visibility: opts.isolines ? "visible" : "none",
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": ["get", "textColor"],
        "line-width": 2,
        "line-opacity": 1,
      },
    });
    map.addLayer({
      id: "等值线值",
      type: "symbol",
      source: {
        type: "geojson",
        data: isolineValues as any,
      },
      layout: {
        visibility: opts.isolines ? "visible" : "none",
        "text-field": ["get", "threshold"],
        "text-size": 16,
        "text-font": ["simkai"],
        "text-offset": [0, 0.2],
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-rotation-alignment": "map",
      },
      paint: {
        "text-color": ['get','textColor'],
        "text-halo-width": 1,
        "text-halo-color": "black",
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
          interpolateOptions.boundary.lng;
        let y =
          (j / (interpolateOptions.sizeV - 1)) * interpolateOptions.boundary.height +
          interpolateOptions.boundary.lat;
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
    map.addLayer({
      id: "网格值",
      type: "symbol",
      source: { type: "geojson", data: gridPoints as any },
      layout: {
        visibility: opts.gridValue ? "visible" : "none",
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
    map.addLayer({
      id: "网格点",
      type: "circle",
      source: { type: "geojson", data: gridPoints as any },
      layout: {
        visibility: opts.gridPoint ? "visible" : "none",
      },
      paint: { "circle-radius": 3, "circle-color": "white", "circle-stroke-width": 1 },
    });
    /*
    map.addLayer({
      id: "等值线边界填充",
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
      } as any,
      layout: {},
      paint: {
        "fill-color": "cyan",
        "fill-opacity": 0.5,
        "fill-outline-color":'transparent'
      },
    });
    map.addLayer({
      id: "等值线边界轮廓",
      type: "line",
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
        } as any,
      },
      layout: {},
      paint: {
        "line-color": "yellow",
        "line-opacity": 1,
        "line-width": 1,
      },
    });
    */
  });
}