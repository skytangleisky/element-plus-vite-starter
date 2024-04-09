<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <div
      v-resize="resize"
      ref="mapRef"
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
    <Dialog
      class="absolute"
      v-model:menus="dialogOptions.menus"
      style="left: 350px; top: 10px"
    ></Dialog>
    <el-select
      class="select"
      style="position: absolute; width: 100px; left: 200px; top: 10px"
      size="small"
      v-model="color"
      placeholder="请选择颜色"
    >
      <el-option
        v-for="(v, k) in options"
        :label="v.label"
        :value="v.value"
        :key="k"
      ></el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { wgs84togcj02 } from "~/myComponents/map/workers/mapUtil";
import { watch, ref, onMounted, onBeforeUnmount, reactive } from "vue";
import Dialog from "./dialog.vue";
const dialogOptions = reactive({ menus: [] });
const color = ref("red");
const options = ref([
  { label: "红色", value: "red" },
  { label: "绿色", value: "green" },
  { label: "蓝色", value: "blue" },
]);
import airstrip from "./airstrip.js";
import { useBus } from "~/myComponents/bus";
import { eventbus } from "~/eventbus";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.scss";
import { 获取净空区, saveData, deleteData } from "~/api/无人机/api";
import { getDevice } from "~/api/组网/device.js";
const bus = useBus();
import theme from "./drawTheme/inactive.js";
const props = withDefaults(
  defineProps<{
    loadmap?: boolean;
    district?: boolean;
    tile?: string;
    center?: object;
    zoom?: number;
  }>(),
  {
    loadmap: true,
    district: true,
    tile: "街道地图",
    center: [0, 0],
    zoom: 4,
  }
);
import style from "./editMap.js";
style.layers.map((v: any) => {
  if (v.id == "simple-tiles") {
    v.layout.visibility = props.loadmap ? "visible" : "none";
  } else if (v.id == "districtLayer" || v.id == "districtOutline") {
    v.layout.visibility = props.district ? "visible" : "none";
  }
});
import street from "./street.js";
let streetUrl = URL.createObjectURL(
  new File([JSON.stringify(street)], "street.json", { type: "application/json" })
);
import satellite from "./satellite.js";
let satelliteUrl = URL.createObjectURL(
  new File([JSON.stringify(satellite)], "satellite.json", { type: "application/json" })
);
const emit = defineEmits(["update:center", "update:zoom"]);
let map: any;
watch(
  () => props.tile,
  (tile) => {
    let s = map ? map.getStyle() : style;
    if (tile == "街道地图") {
      s.sources["raster-tiles"].url = streetUrl;
    } else if (tile == "卫星地图") {
      s.sources["raster-tiles"].url = satelliteUrl;
    }
    s.layers.map((v) => {
      if (v.id == "simple-tiles") {
        v.layout.visibility = props.loadmap ? "visible" : "none";
      } else if (v.id == "districtLayer" || v.id == "districtOutline") {
        v.layout.visibility = props.district ? "visible" : "none";
      }
    });
    map && map.setStyle(s);
  },
  {
    immediate: true,
  }
);
watch(
  () => props.district,
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
  () => props.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
  }
);
watch([() => props.zoom, () => props.center], ([zoom, center]) => {
  //无法通过监听变量的变化实时设置地图的视角
});
import { useStationStore } from "~/stores/station";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
let enclosureList = new Array<any>();
const station = useStationStore();
const mapRef = ref(null);
const clickFunc = (e: any) => {
  if (e.features) {
    setting.disappear = false;
    for (let i = 0; i < bus.result.length; i++) {
      if (bus.result[i].radar.radar_id == e.features[0].properties.radar_id) {
        station
          .查询雷达最新的径向风数据接口({
            radar_id: e.features[0].properties.radar_id.replaceAll("-", ""),
          })
          .then((res: any) => {
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
  emit("update:zoom", map.getZoom());
};
const moveFunc = () => {
  emit("update:center", map.getCenter());
};
const flyTo = (item: any) => {
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
const resize = () => {
  map && map.resize();
};
onMounted(() => {
  map = new mapboxgl.Map({
    container: (mapRef.value as unknown) as HTMLCanvasElement,
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
    maxZoom: 21, //mapbox最高支持21,瓦片等级最高到22级
    // minZoom: 1,
    // maxBounds: [
    //   [60.0, 0],
    //   [160.0, 60],
    // ],
    // zoom: 18,
    // center: [148.9819, -35.3981],
    // pitch: 60,
    zoom: props.zoom,
    center: props.center,
    pitch: 0,
  });
  map.on("load", () => {
    map.addLayer({
      id: "maine",
      type: "fill",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: airstrip,
          },
        },
      },
      layout: {},
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.8,
      },
    });
    getDevice().then((res) => {
      dialogOptions.menus = res.data;
      console.log("设备数据", res.data);
      let features: any = [];
      dialogOptions.menus.map((item: any) => {
        let v = item.lngLat;
        let lng = v.substring(0, v.indexOf("E"));
        let lat = v.substring(v.indexOf("E") + 1, v.indexOf("N"));
        let pt = {
          lng:
            Number(lng.substring(0, 3)) +
            Number(lng.substring(3, 5)) / 60 +
            Number(lng.substring(5, 9)) / 100 / 3600,
          lat:
            Number(lat.substring(0, 2)) +
            Number(lat.substring(2, 4)) / 60 +
            Number(lat.substring(4, 8)) / 100 / 3600,
        };
        let position: [number, number] = (wgs84togcj02(pt.lng, pt.lat) as unknown) as [
          number,
          number
        ];
        features.push({
          type: "Feature",
          properties: {
            type: "站点",
            name: item.name,
            color: item.color,
          },
          geometry: {
            type: "Point",
            coordinates: position,
          },
        });
        let offset: [number, number] = [
          100 * Math.random() - 50,
          100 * Math.random() - 50,
        ];
        let div = document.createElement("div");
        div.id = "组网" + item.id;
        div.className = "deviceStation";
        div.style.position = "absolute";
        $(div).append(
          $(
            `<div class="station" style="z-index:-1;background: ${
              item.color
            };left:50%;top:50%;transform:translate(-50%,-50%) translate(${-offset[0]}px,${-offset[1]}px)"></div>`
          )
        );
        $(div).append(
          $(
            `<div class="connectingLine" style="pointer-events:none;background:${
              item.color
            };position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) translate(${
              -offset[0] / 2
            }px,${-offset[1] / 2}px) rotate(${Math.atan2(
              offset[1],
              offset[0]
            )}rad);width:${Math.sqrt(offset[0] ** 2 + offset[1] ** 2)}px"></div>`
          )
        );
        $(div).append($(`<div class="label">${item.name}</div>`));
        var marker = new mapboxgl.Marker(div, {
          draggable: true,
          pitchAlignment: "map",
          rotationAlignment: "map",
          anchor: "center",
        })
          .setLngLat(position) // 设置标记的经纬度坐标
          .addTo(map)
          .setOffset(offset);
        let dragStartOffset: { x: number; y: number };
        marker.on("dragstart", () => {
          dragStartOffset = marker.getOffset() as { x: number; y: number };
        });
        marker.on("drag", (e: any) => {
          let dragEndPoint = marker.getLngLat();
          let pt1 = map.project({ lng: position[0], lat: position[1] });
          let pt2 = map.project(dragEndPoint);
          let x = dragStartOffset.x + pt2.x - pt1.x;
          let y = dragStartOffset.y + pt2.y - pt1.y;
          marker.setOffset([x, y]);
          let line = $("#组网" + item.id).find(".connectingLine")[0];
          line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
            -y / 2
          }px) rotate(${Math.atan2(y, x)}rad)`;
          line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
          let station = $("#组网" + item.id).find(".station")[0];
          station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
          marker.setLngLat(position);
        });
        marker.on("dragend", (e: any) => {
          let dragEndPoint = e.target.getLngLat();
          let pt1 = map.project({ lng: position[0], lat: position[1] });
          let pt2 = map.project(dragEndPoint);
          let offset = marker.getOffset() as { x: number; y: number };
          let x = offset.x + pt2.x - pt1.x;
          let y = offset.y + pt2.y - pt1.y;
          marker.setOffset([x, y]);
          let line = $("#组网" + item.id).find(".connectingLine")[0];
          line.style.transform = `translate(-50%,-50%) translate(${-x / 2}px,${
            -y / 2
          }px) rotate(${Math.atan2(y, x)}rad)`;
          line.style.width = `${Math.sqrt(x ** 2 + y ** 2)}px`;
          let station = $("#组网" + item.id).find(".station")[0];
          station.style.transform = `translate(-50%,-50%) translate(${-x}px,${-y}px)`;
          marker.setLngLat(position);
        });
      });
      // map.addSource("stationSource", {
      //   type: "geojson",
      //   data: {
      //     type: "FeatureCollection",
      //     features,
      //   },
      // });
      // map.addLayer({
      //   id: "geojson-layer",
      //   type: "circle",
      //   source: "stationSource",
      //   paint: {
      //     "circle-radius": 6,
      //     "circle-color": ["get", "color"],
      //     "circle-stroke-width": 1,
      //     "circle-stroke-color": "black",
      //   },
      // });
      // map.addLayer({
      //   id: "textLayer",
      //   source: "stationSource",
      //   type: "symbol",
      //   layout: {
      //     visibility: "visible",
      //     "text-field": ["get", "name"],
      //     "text-font": ["simkai"],
      //     "text-size": 14,
      //     "text-transform": "uppercase",
      //     // "text-letter-spacing": 0.05,
      //     "text-anchor": "center",
      //     "text-line-height": 1,
      //     "text-offset": [0, -1.2],
      //     "text-ignore-placement": true,
      //     "text-allow-overlap": true,
      //     "text-rotation-alignment": "map",
      //     "text-max-width": 400,
      //   },
      //   paint: {
      //     "text-opacity": 1,
      //     "text-color": "white",
      //     "text-halo-color": "black", // 描边颜色
      //     "text-halo-width": 1, // 描边宽度
      //   },
      //   filter: ["==", ["get", "type"], "站点"],
      // });
    });
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
    defaultMode: "simple_select",
    controls: {
      point: true,
      circle: true,
      line_string: true,
      polygon: true,
      trash: true,
      combine_features: false,
      uncombine_features: false,
    },
    styles: theme,
  });
  map.addControl(Draw, "top-right");
  //添加空域
  map.on("draw.create", function (e: any) {
    let a = {
      type: "FeatureCollection",
      features: new Array<any>(),
    };
    let standby2 = color.value;
    let data = new Array<any>();
    e.features.map((item: any) => {
      item.properties.color = standby2;
      a.features.push(item);
      if (item.geometry.type === "Point") {
        data.push({
          standby2,
          id: item.id,
          enclosure_type: "06",
          line_width: 0,
          points: item.geometry.coordinates.join(",") + ";",
        });
      } else if (item.geometry.type === "LineString") {
        console.log(item);
        data.push({
          standby2,
          id: item.id,
          enclosure_type: "00",
          line_width: 0,
          points: item.geometry.coordinates.map((v: any) => v.join(",")).join(";") + ";",
        });
      } else if (item.geometry.type === "Polygon") {
        if (item.properties.isCircle) {
          data.push({
            standby2,
            id: item.id,
            enclosure_type: "03",
            line_width: 0,
            circle_center: item.properties.center.join(",") + ";",
            radius: item.properties.radiusInKm * 1000,
            points:
              item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") + ";",
          });
        } else {
          data.push({
            standby2,
            id: item.id,
            enclosure_type: "02",
            line_width: 0,
            points:
              item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") + ";",
          });
        }
      }
    });
    Draw.add(a as never);
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
  map.on("draw.delete", function (e: any) {
    let data = new Array<any>();
    e.features.map((v: any) => {
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
  map.on("draw.update", function (e: any) {
    let data = new Array<any>();
    e.features.map((item: any) => {
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
              points:
                item.geometry.coordinates.map((v: any) => v.join(",")).join(";") + ";",
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
                  item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") +
                  ";",
              })
            );
          } else {
            data.push(
              Object.assign(tmp[0], {
                id: item.id,
                points:
                  item.geometry.coordinates[0].map((v: any) => v.join(",")).join(";") +
                  ";",
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
  map.on("draw.selectionchange", function (e: any) {
    console.log(e);
  });
  map.on("draw.combine", function (e: any) {
    console.log(e);
  });
  map.on("draw.uncombine", function (e: any) {
    console.log(e);
  });
  获取净空区().then((res) => {
    let a = {
      type: "FeatureCollection",
      features: [],
    };
    enclosureList = res.data.results;
    for (let i = 0; i < res.data.results.length; i++) {
      let v = res.data.results[i];
      let strLngLatList = v.points.match(
        RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g)
      );
      let list = strLngLatList.map((item: any) => [
        Number(item.match(RegExp(/(\-|\+)?\d+(\.\d+)?(?=,)/))[0]),
        Number(item.match(RegExp(/(?<=,)(\-|\+)?\d+(\.\d+)?/))[0]),
      ]);
      console.log(JSON.stringify(list));
      if (v.enclosure_type == "06") {
        a.features.push({
          id: v.id,
          type: "Feature",
          properties: {
            color: v.standby2,
          },
          geometry: {
            type: "Point",
            coordinates: list[0],
          },
        } as never);
      } else if (v.enclosure_type == "00") {
        a.features.push({
          id: v.id,
          type: "Feature",
          properties: {
            color: v.standby2,
          },
          geometry: {
            type: "LineString",
            coordinates: list,
          },
        } as never);
      } else if (v.enclosure_type == "02") {
        if (list.length > 2) {
          a.features.push({
            id: v.id,
            type: "Feature",
            properties: {
              color: v.standby2,
            },
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          } as never);
        } else {
          console.error("v.enclosure_type == 02," + "list.length=" + list.length);
        }
      } else if (v.enclosure_type == "03") {
        if (v.circle_center) {
          let center = v.circle_center
            .match(RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g))[0]
            .split(",")
            .map((v: any) => Number(v));
          a.features.push({
            id: v.id,
            type: "Feature",
            properties: {
              isCircle: true,
              center,
              radiusInKm: v.radius / 1000,
              color: v.standby2,
            },
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          } as never);
        } else {
          console.error("v.circle_center=" + v.circle_center);
        }
      }
    }
    Draw.add(a as never);
  });

  map.repaint = false;
  map.on("zoom", zoomFunc);
  map.on("move", moveFunc);
  eventbus.on("将站点移动到屏幕中心", flyTo);
});
onBeforeUnmount(() => {
  eventbus.off("将站点移动到屏幕中心", flyTo);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.remove();
});
watch(
  () => props.district,
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
  () => props.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
  }
);
</script>
<style lang="scss">
.mapboxgl-ctrl-bottom-left {
  bottom: 10px !important;
  left: auto !important;
  right: 10px !important;
}
.dark .select .ep-select__wrapper {
  background-color: #2b2b2b;
}
.deviceStation {
  position: absolute;
  font-size: 14px;
  .connectingLine {
    height: 2px;
    z-index: -1;
  }
  .label {
    text-shadow: 0 0 2px #fff;
    box-shadow: 0 0 0 1px #757575, 0 0 0 2px #010201;
    color: black;
    padding: 4px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  .station {
    pointer-events: none;
    width: 8px;
    height: 8px;
    position: absolute;
    border-radius: 50%;
    border: 1px solid black;
  }
}
</style>
<style scoped lang="scss">
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
