<template>
  <div style="width: 100%; height: 100%; overflow: hidden; position: absolute">
    <div
      ref="mapRef"
      class="map"
      style="
        position: absolute;
        backdrop-filter: blur(25px);
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        line-height: 1;
        outline: none;
      "
    ></div>
    <div
      class="absolute left-10px top-10px b-solid b-1px dark:b-gray-5 b-gray dark:bg-#2b2b2b bg-white dark:color-white color-black w-150px h-80px flex flex-col justify-between p-10px"
      style="border-radius: 8px; font-size: 16px"
    >
      <span>反制设备 10台</span>
      <span>合作无人机 0架</span>
      <span>黑飞无人机 0架</span>
    </div>
    <div
      :class="`bottom-drawer ${setting.无人机.监控.bottom_disappear ? 'disappear' : ''}`"
    >
      <div class="handle z-1" @click="setting.无人机.监控.bottom_disappear = false">
        <el-badge :value="12" type="primary"
          ><el-icon v-html="warnSvg"></el-icon
        ></el-badge>
        <el-badge :value="12" type="success"
          ><el-icon v-html="uavSvg"></el-icon
        ></el-badge>
        <el-badge :value="12" type="warning"
          ><el-icon v-html="deviceSvg"></el-icon
        ></el-badge>
        <el-badge type="danger" :value="12"
          ><el-icon v-html="recordSvg"></el-icon
        ></el-badge>
        <el-badge type="info" :value="12"
          ><el-icon v-html="whitelistSvg"></el-icon
        ></el-badge>
        <el-badge :value="0" :show-zero="false"
          ><el-icon v-html="statisticSvg"></el-icon
        ></el-badge>
      </div>
      <el-icon
        class="cursor-pointer z-1"
        style="position: absolute; top: 0; right: 0; font-size: 1.5rem"
        v-html="forkSvg"
        @click.stop="setting.无人机.监控.bottom_disappear = true"
      ></el-icon>
      <datatable></datatable>
    </div>
    <div :class="`right-drawer ${setting.无人机.监控.disappear ? 'disappear' : ''}`">
      <div
        class="handle"
        @click.native="setting.无人机.监控.disappear = !setting.无人机.监控.disappear"
      >
        <el-icon v-html="rightSvg"></el-icon>
      </div>
      <selectTile v-model:list="tileList"></selectTile>
      <span style="font-size: 20px; margin-top: 20px">图层设置</span>
      <div style="padding-left: 4px">
        <div class="flex items-center">
          <el-checkbox label="反制设备图层"></el-checkbox>
        </div>
        <div class="flex items-center">
          <el-checkbox label="探测目标图层"></el-checkbox>
        </div>
        <div class="flex items-center">
          <el-checkbox label="禁飞区图层"></el-checkbox>
        </div>
        <div class="flex items-center">
          <el-checkbox label="备案空域图层"></el-checkbox>
        </div>
      </div>
    </div>
    <!-- <graph
      v-if="DEV"
      class="absolute left-0 bottom-30px"
      v-model:args="graphArgs"
    ></graph> -->
  </div>
</template>
<script setup>
import forkSvg from "~/assets/fork.svg?raw";
import rightSvg from "~/assets/right.svg?raw";
import warnSvg from "~/assets/warn.svg?raw";
import uavSvg from "~/assets/uav.svg?raw";
import deviceSvg from "~/assets/device.svg?raw";
import recordSvg from "~/assets/record.svg?raw";
import whitelistSvg from "~/assets/whitelist.svg?raw";
import statisticSvg from "~/assets/statistic.svg?raw";
import selectTile from "./selectTile.vue";
import { addFeatherImages, getFeather } from "~/tools";
import { getLngLat } from "~/myComponents/map/js/core.js";
import { watch, ref, onMounted, onBeforeUnmount, reactive, onActivated } from "vue";
import { useBus } from "~/myComponents/bus";
import { eventbus } from "~/eventbus";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
// var a = turf.sector(turf.point([-75, 40]), 100, 0, 360);
// console.log(a);
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { 获取净空区, saveData, deleteData } from "~/api/无人机/api";
const bus = useBus();
import { useStationStore } from "~/stores/station";
import { useRoute } from "vue-router";
const route = useRoute();
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import style1 from "./index.js";
import style2 from "./index2.js";
import url2 from "~/assets/street.png?url";
import url1 from "~/assets/satellite.png?url";
import datatable from "~/myComponents/datatable/index.vue";
let enclosureList = [];
console.log("route.query", route.query);
const station = useStationStore();
const tileList = ref([
  { style: style2, name: "街道地图", url: url2 },
  { style: style1, name: "卫星地图", url: url1 },
]);
let style = {};
tileList.value.map((item, k) => {
  if (item.name == setting.无人机.监控.tile) {
    item.selected = true;
    style = item.style;
  }
});

watch(
  tileList,
  (list) => {
    list.map((item) => {
      if (item.selected) {
        map.setStyle(item.style);
        setting.无人机.监控.tile = item.name;
      }
    });
  },
  { deep: true }
);
const mapRef = ref(null);
let timer, map;
let mock;
const clickFunc = (e) => {
  if (e.features) {
    for (let i = 0; i < bus.result.length; i++) {
      if (bus.result[i].radar.radar_id == e.features[0].properties.radar_id) {
        station
          .查询雷达最新的径向风数据接口({
            radar_id: e.features[0].properties.radar_id.replaceAll("-", ""),
          })
          .then((res) => {
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
  setting.无人机.监控.zoom = map.getZoom();
};
const moveFunc = () => {
  let center = map.getCenter();
  setting.无人机.监控.center = [center.lng, center.lat];
};
const flyTo = (item) => {
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
onActivated(() => {
  map && map.resize();
});
onMounted(() => {
  map = new mapboxgl.Map({
    container: mapRef.value,
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
    maxZoom: 18,
    // minZoom: 1,
    // maxBounds: [
    //   [60.0, 0],
    //   [160.0, 60],
    // ],
    // zoom: 18,
    // center: [148.9819, -35.3981],
    // pitch: 60,
    zoom: setting.无人机.监控.zoom,
    center: setting.无人机.监控.center,
    pitch: 0,
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
    defaultMode: "static_select",
    controls: {
      point: false,
      circle: false,
      line_string: false,
      polygon: false,
      trash: false,
      combine_features: false,
      uncombine_features: false,
    },
  });
  map.addControl(Draw, "top-right");
  //添加空域
  map.on("draw.create", function (e) {
    let data = [];
    e.features.map((item) => {
      if (item.geometry.type === "Point") {
        data.push({
          id: item.id,
          enclosure_type: "06",
          line_width: 0,
          points: item.geometry.coordinates.join(",") + ";",
        });
      } else if (item.geometry.type === "LineString") {
        console.log(item);
        data.push({
          id: item.id,
          enclosure_type: "00",
          line_width: 0,
          points: item.geometry.coordinates.map((v) => v.join(",")).join(";") + ";",
        });
      } else if (item.geometry.type === "Polygon") {
        if (item.properties.isCircle) {
          data.push({
            id: item.id,
            enclosure_type: "03",
            line_width: 0,
            circle_center: item.properties.center.join(",") + ";",
            radius: item.properties.radiusInKm * 1000,
            points: item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
          });
        } else {
          data.push({
            id: item.id,
            enclosure_type: "02",
            line_width: 0,
            points: item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
          });
        }
      }
    });
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
  map.on("draw.delete", function (e) {
    let data = [];
    e.features.map((v) => {
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
  map.on("draw.update", function (e) {
    let data = [];
    e.features.map((item) => {
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
              points: item.geometry.coordinates.map((v) => v.join(",")).join(";") + ";",
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
                  item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
              })
            );
          } else {
            data.push(
              Object.assign(tmp[0], {
                id: item.id,
                points:
                  item.geometry.coordinates[0].map((v) => v.join(",")).join(";") + ";",
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
  map.on("draw.selectionchange", function (e) {
    console.log(e);
  });
  map.on("draw.combine", function (e) {
    console.log(e);
  });
  map.on("draw.uncombine", function (e) {
    console.log(e);
  });
  获取净空区().then((res) => {
    let a = {
      type: "FeatureCollection",
      features: [],
    };
    console.log(res.data.results);
    enclosureList = res.data.results;
    for (let i = 0; i < res.data.results.length; i++) {
      let v = res.data.results[i];
      let strLngLatList = v.points.match(
        RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g)
      );
      let list = strLngLatList.map((item) => [
        Number(item.match(RegExp(/(\-|\+)?\d+(\.\d+)?(?=,)/))[0]),
        Number(item.match(RegExp(/(?<=,)(\-|\+)?\d+(\.\d+)?/))[0]),
      ]);
      if (v.enclosure_type == "06") {
        a.features.push({
          id: v.id,
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: list[0],
          },
        });
      } else if (v.enclosure_type == "00") {
        a.features.push({
          id: v.id,
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: list,
          },
        });
      } else if (v.enclosure_type == "02") {
        if (list.length > 2) {
          a.features.push({
            id: v.id,
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          });
        } else {
          console.error("v.enclosure_type == 02," + "list.length=" + list.length);
        }
      } else if (v.enclosure_type == "03") {
        if (v.circle_center) {
          let center = v.circle_center
            .match(RegExp(/(\-|\+)?\d+(\.\d+)?,(\-|\+)?\d+(\.\d+)?/g))[0]
            .split(",")
            .map((v) => Number(v));
          a.features.push({
            id: v.id,
            type: "Feature",
            properties: {
              isCircle: true,
              center,
              radiusInKm: v.radius / 1000,
            },
            geometry: {
              type: "Polygon",
              coordinates: [list],
            },
          });
        } else {
          console.error("v.circle_center=" + v.circle_center);
        }
      }
    }
    Draw.add(a);
    // {
    //   type: "FeatureCollection",
    //   features: [
    //     {
    //       type: "Feature",
    //       //"id": "the most unique id in the world",
    //       properties: {
    //         class_id: 1,
    //       },
    //       geometry: {
    //         type: "Polygon",
    //         coordinates: [
    //           [
    //             [0, 0],
    //             [100, 0],
    //             [100, 60],
    //             [0, 60],
    //             [0, 0],
    //           ],
    //         ],
    //       },
    //     },
    //   ],
    // }
  });

  map.repaint = false;
  addFeatherImages(map);
  map.on("zoom", zoomFunc);
  map.on("move", moveFunc);
  map.on("click", "stationLayer", clickFunc);
  eventbus.on("将站点移动到屏幕中心", flyTo);
});
onBeforeUnmount(() => {
  eventbus.off("将站点移动到屏幕中心", flyTo);
  clearInterval(timer);
  clearInterval(mock);
  map.off("zoom", zoomFunc);
  map.off("move", moveFunc);
  map.off("click", "stationLayer", clickFunc);
  map.remove();
});
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
  () => setting.loadmap,
  (newVal) => {
    if (newVal) {
      map.setLayoutProperty("simple-tiles", "visibility", "visible");
    } else {
      map.setLayoutProperty("simple-tiles", "visibility", "none");
    }
  }
);
</script>
<style scoped lang="scss">
$time: 1s;
.bottom-drawer {
  position: absolute;
  height: 240px;
  background-color: #fff;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  border-top: 1px solid #ddd;
  transition: transform $time;
  & > .handle {
    position: absolute;
    transform: translateY(-100%);
    .ep-badge {
      margin: 0 20px;
      .ep-icon {
        cursor: pointer;
        filter: drop-shadow(0 0 8px #000);
        font-size: 2rem;
        color: #fff;
      }
    }
  }
  &.disappear {
    transform: translateY(100%);
  }
}
.dark .bottom-drawer {
  border-top: 1px solid gray;
  background-color: #2b2b2b;
  & > .handle {
    .ep-badge {
      .ep-icon {
        color: #2b2b2b;
        filter: drop-shadow(0 0 8px #fff);
      }
    }
  }
}
.right-drawer {
  z-index: 2;
  position: absolute;
  right: 0;
  width: 240px;
  box-sizing: border-box;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  transition: transform $time;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
  & > .handle {
    display: flex;
    justify-content: start;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    left: -16px;
    background-color: #fff;
    width: 16px;
    height: 30px;
    border: 1px solid #ddd;
    border-right: none;
    & > .ep-icon {
      transition: transform $time;
      color: #bbb;
    }
  }
  &.disappear {
    transform: translateX(calc(100%));
    & > .handle > .ep-icon {
      transform: rotateY(180deg);
    }
  }
}
.dark .right-drawer {
  background-color: #2b2b2b;
  border-left: 1px solid gray;
  & > .handle {
    background-color: #2b2b2b;
    border: 1px solid grey;
    border-right: none;
    & > .ep-icon {
      color: #ddd;
    }
  }
}
</style>
