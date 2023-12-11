<template>
  <canvas
    ref="canvas"
    style="
      position: absolute;
      outline: none;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: #2b2b2b;
    "
    @mousewheel.prevent
  ></canvas>
  <canvas
    ref="webgpu"
    style="
      position: absolute;
      outline: none;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    "
  ></canvas>
  <div
    tabindex="-1"
    class="tileSelect absolute right-20px top-20px"
    style="outline: none"
  >
    <div
      :style="
        'border-radius:50%;border:1px solid grey;background-position:-0px -0px;background-repeat:no-repeat;width:58px;height:58px;' +
        'background-image:url(' +
        setting.tileUrl.replace('{x}', '105').replace('{y}', '48').replace('{z}', '7') +
        ');'
      "
      @click.native="testClick"
    ></div>
    <div class="tileList">
      <div
        v-for="(v, k) in urls"
        :key="k"
        :style="
          'border:1px solid grey;background-position:-0px -0px;background-repeat:no-repeat;width:50px;height:50px;' +
          'background-image:url(' +
          v.url.replace('{x}', '105').replace('{y}', '48').replace('{z}', '7') +
          ');'
        "
        @click.native="tileSelect(v)"
      ></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, reactive, watch } from "vue";
import {
  MapLayer,
  BorderLayer,
  PointLayer,
  RouteLayer,
  PlaneLayer,
  StationLayer,
  RadarLayer,
} from "./layers";
import { gsap, Power3, Linear } from "gsap";
import {
  windowToCanvas,
  pixel2Lng,
  pixel2Lat,
  lng2Pixel,
  lat2Pixel,
  lngLat2Pixel,
} from "./js/core";
import { wgs84togcj02 } from "./workers/mapUtil";
import { useSettingStore } from "~/stores/setting";
import run, { cancel } from "~/webgpu/imageTexture";
import Windy from "./layers/Windy";
import "./Sample_POI";
import Task from "./layers/task";
let needRedraw = false;
let aid: number;
import { eventbus } from "~/eventbus";
import { storeToRefs } from "pinia";
const setting = useSettingStore();
let mapLayer: MapLayer;
let borderLayer: BorderLayer;
let radarLayer: RadarLayer;
let pointLayer: PointLayer;
let routeLayer: RouteLayer;
let planeLayer: PlaneLayer;
let stationLayer: StationLayer;
const windy = new Windy();
let canvas = ref(null);
let webgpu = ref(null);
// let POINT = {lng:113.42165142106768,lat:23.098844381632485}
let POINT = { lng: 116.39139324235674, lat: 39.90723893689098 };
const urls = ref([
  { url: "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}" },
  { url: "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}" },
  { url: "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=p&gl=CN&x={x}&y={y}&z={z}" },
  { url: "https://tanglei.site:3210/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}" },
  { url: "https://tanglei.site:3210/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}" },
  { url: "https://tanglei.site:3210/maps/vt?lyrs=h&gl=CN&x={x}&y={y}&z={z}" },
  { url: "https://tanglei.site:3210/maps/vt?lyrs=p&gl=CN&x={x}&y={y}&z={z}" },
  { url: "https://tanglei.site:3210/maps/vt?lyrs=m&gl=CN&x={x}&y={y}&z={z}" },
  { url: "https://tanglei.site:3210/maps/vt?lyrs=t&gl=CN&x={x}&y={y}&z={z}" },
  {
    url: "/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
  },
]);
if (setting.tileUrl == "") {
  setting.tileUrl = urls.value[0].url;
}
const tileSelect = (v: any) => {
  setting.tileUrl = v.url;
  mapLayer.setSource(v);
  loadMap();
};
let cvs: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
interface Struct {
  imgX: number;
  imgY: number;
  L: number;
  targetL: number;
}
interface Pos {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}
let tileWidth = 256;
const obj: Struct = reactive({ imgX: 0, imgY: 0, L: 11, targetL: 11 });
let isMouseDown: boolean = false;
const minLevel = 0;
const maxLevel = 22;
const 限制 = true;
let mousemove: Pos = { x: 0, y: 0, targetX: 0, targetY: 0 };
let pos: Pos = { x: 0, y: 0, targetX: 0, targetY: 0 };
let posl: Pos = { x: 0, y: 0, targetX: 0, targetY: 0 };
let currentLngLat: {
  lng: number;
  lat: number;
};
const precision = 10e10;
let newPos: {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
} = { x: 0, y: 0, targetX: 0, targetY: 0 };
let task: Task;
onMounted(async () => {
  task = new Task(20);
  mapLayer = new MapLayer();
  borderLayer = new BorderLayer(task);
  radarLayer = new RadarLayer(task);
  pointLayer = new PointLayer();
  routeLayer = new RouteLayer(task);
  planeLayer = new PlaneLayer();
  stationLayer = new StationLayer();
  let has = false;
  urls.value.forEach((v, k) => {
    if (setting.tileUrl == v.url) {
      mapLayer.setSource(v);
      has = true;
    }
  });
  if (!has) {
    setting.tileUrl = urls.value[0].url;
    mapLayer.setSource(urls.value[0]);
  }
  if (canvas.value) {
    cvs = canvas.value;
  } else {
    throw new Error("invalid cvs");
  }
  let tmp = cvs.getContext("2d");
  if (tmp) {
    ctx = tmp;
  } else {
    throw new Error("invalid ctx");
  }
  // if (webgpu.value) run(webgpu.value);
  // mapLayer.setSource({url:'https://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'})
  // mapLayer.setSource({url:'https://tanglei.site:444?z={z}&y={y}&x={x}'})//nps+go
  // mapLayer.setSource({url:'http://tanglei.site:81?z={z}&y={y}&x={x}'})//nps+go
  // mapLayer.setSource({url:'http://tanglei.site:8847?z={z}&y={y}&x={x}'})//tcp
  // mapLayer.setSource({url:'http://127.0.0.1:8008/{z}/{y}/{x}.jpg'})//nginx
  // mapLayer.setSource({url:'http://127.0.0.1:8001?z={z}&y={y}&x={x}'})//nodejs
  // mapLayer.setSource({url:'https://tanglei.site?z={z}&y={y}&x={x}'})//nps->nodejs
  // mapLayer.setSource({url:'/map1?z={z}&y={y}&x={x}'})//proxy->nps->nodejs
  // mapLayer.setSource({url:'/data/google/terrain/Guangzhou/{z}/{x}/{y}.jpg'})
  init();
  lastTime = performance.now();
  loop(lastTime);
  const resizeObserver = new ResizeObserver(() => {
    let rect = cvs.getBoundingClientRect();
    if (rect.width == 0 || rect.height == 0) return;
    cvs.width = rect.width * devicePixelRatio;
    cvs.height = rect.height * devicePixelRatio;
    planeLayer.quadtree.bounds = { x: 0, y: 0, width: cvs.width, height: cvs.height };
    stationLayer.quadtree.bounds = { x: 0, y: 0, width: cvs.width, height: cvs.height };
    localStorage.L && (obj.targetL = obj.L = Number(localStorage.L));
    eventbus.emit("systemInfo", { level: obj.L.toFixed(2) });
    if (localStorage.center) {
      var center = JSON.parse(localStorage.center);
      obj.imgX = cvs.width / 2 - ((center[0] + 180) / 360) * tileWidth * 2 ** obj.L;
      obj.imgY =
        cvs.height / 2 -
        ((1 - Math.asinh(Math.tan((center[1] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** obj.L *
          tileWidth;
    } else {
      let convert = wgs84togcj02(POINT.lng, POINT.lat);
      obj.imgX = cvs.width / 2 - (tileWidth * 2 ** obj.L * (convert[0] + 180)) / 360;
      obj.imgY =
        cvs.height / 2 -
        ((1 - Math.asinh(Math.tan((convert[1] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** obj.L *
          tileWidth;
    }
    limitScale();
    limitRegion();
    loadMap();
    needRedraw = true;
    windy.start(
      [
        [0, 0],
        [cvs.width, cvs.height],
      ],
      cvs.width,
      cvs.height,
      [
        [
          pixel2Lng(0, obj.imgX, 2 ** obj.L, 256),
          pixel2Lat(cvs.height, obj.imgY, 2 ** obj.L, 256),
        ],
        [
          pixel2Lng(cvs.width, obj.imgX, 2 ** obj.L, 256),
          pixel2Lat(0, obj.imgY, 2 ** obj.L, 256),
        ],
      ]
    );
    draw();
  });
  resizeObserver.observe(cvs);
  cvs.addEventListener("mousewheel", mousewheelFunc, { passive: true });
  // document.addEventListener("mousewheel", mousewheelFunc, { passive: true });
  cvs.addEventListener("mousedown", mousedownFunc, { passive: true });
  document.addEventListener("mouseup", mouseupFunc, { passive: true });
  document.addEventListener("mousemove", mousemoveFunc, { passive: true });
  eventbus.on("move", moveFunc);
  onBeforeUnmount(() => {
    cancel();
    resizeObserver.disconnect();
  });
  1;
});
const moveFunc = (lng: number, lat: number) => {
  flyTo(lng, lat, { duration: 0 });
};
onBeforeUnmount(() => {
  cvs.removeEventListener("mousemove", mousemoveFunc);
  document.removeEventListener("mousemove", mousemoveFunc);
  cvs.removeEventListener("mousewheel", mousewheelFunc);
  // document.removeEventListener("mousewheel", mousewheelFunc);
  cancelAnimationFrame(aid);
  // cancel();
  task.destroy();
  borderLayer.off();
  radarLayer.off();
  routeLayer.off();
  eventbus.off("move");
  console.log("destroyed");
});
const init = () => {
  watch(
    // () => setting.loadmap,
    () => setting.loadmap,
    (loadmap) => {
      if (loadmap) {
        mapLayer.show();
      } else {
        mapLayer.hide();
      }
      loadMap();
    },
    { immediate: true }
  );
  watch(
    () => setting.district,
    (district) => {
      if (district) {
        borderLayer.show();
      } else {
        borderLayer.hide();
      }
      loadMap();
    },
    { immediate: true }
  );
  watch(
    () => setting.navigation,
    (navigation) => {
      if (navigation) {
        pointLayer.show();
      } else {
        pointLayer.hide();
      }
      loadMap();
    },
    { immediate: true }
  );
  watch(
    () => setting.airline,
    (airline) => {
      if (airline) {
        routeLayer.show();
      } else {
        routeLayer.hide();
      }
      loadMap();
    },
    { immediate: true }
  );
  watch(
    () => setting.radar,
    (radar) => {
      if (radar) {
        radarLayer.show();
      } else {
        radarLayer.hide();
      }
      loadMap();
    },
    { immediate: true }
  );
};
var interval = 0;
var then = 0;
let frame = 0;
let lastTime = 0;
let spend = 0;
const loop = (time: number) => {
  aid = requestAnimationFrame(loop);
  if (time - then > interval) {
    interval > 0 && (then = time - ((time - then) % interval));
    frame++;
    if (time - lastTime > 1000) {
      eventbus.emit("systemInfo", {
        fps: ((frame * 1000) / (time - lastTime)).toFixed(2),
      });
      eventbus.emit("systemInfo", { frameTime: spend.toFixed(2) + "ms" });
      eventbus.emit("systemInfo", {
        occupy: ((spend / (time - lastTime)) * frame * 100).toFixed(2) + "%",
      });
      eventbus.emit("systemInfo", {
        periodTime: ((time - lastTime) / frame).toFixed(2) + "ms",
      });
      lastTime = time;
      frame = 0;
    }
    let start = performance.now();
    draw();
    let end = performance.now();
    spend = end - start;
  }
};
const draw = () => {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  if (needRedraw) {
    // needRedraw=false
    ctx.save();
    mapLayer.render(obj, ctx);
    borderLayer.render(obj, ctx);
    radarLayer.render(obj, ctx);
    pointLayer.render(obj, ctx);
    routeLayer.render(obj, ctx);
    setting.stream && windy.render(obj, ctx);
    planeLayer.render(obj, ctx);
    // stationLayer.render(obj,ctx)
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.translate(cvs.width / 2, cvs.height / 2);
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0);
    ctx.strokeStyle = "#ff000044";
    ctx.stroke();
    ctx.restore();

    ctx.save();
    let convert = wgs84togcj02(POINT.lng, POINT.lat);
    let position = lngLat2Pixel(
      convert[0],
      convert[1],
      obj.imgX,
      obj.imgY,
      2 ** obj.L,
      tileWidth
    );
    ctx.beginPath();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.translate(position.x, position.y);
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    // if(newPos){
    //   ctx.save()
    //   let x = newPos.x*tileWidth*2**obj.L/precision+obj.imgX
    //   let y = newPos.y*tileWidth*2**obj.L/precision+obj.imgY
    //   ctx.fillStyle='yellow'
    //   ctx.beginPath()
    //   ctx.arc(x,y,3,0,Math.PI*2)
    //   ctx.fill()
    //   ctx.restore()
    // }
  }
};
const loadMap = () => {
  mapLayer.loadMap(obj, { x: 0, y: 0, w: cvs.width, h: cvs.height }, () => {
    needRedraw = true;
  });
  borderLayer.loadMap(obj, { x: 0, y: 0, w: cvs.width, h: cvs.height }, () => {
    needRedraw = true;
  });
  radarLayer.loadMap(obj, { x: 0, y: 0, w: cvs.width, h: cvs.height }, () => {
    needRedraw = true;
  });
  pointLayer.loadMap(obj, { x: 0, y: 0, w: cvs.width, h: cvs.height }, () => {
    needRedraw = true;
  });
  routeLayer.loadMap(obj, { x: 0, y: 0, w: cvs.width, h: cvs.height }, () => {
    needRedraw = true;
  });
  needRedraw = true;
};
const mousedownFunc = (event: MouseEvent) => {
  gsap.killTweensOf(mousemove);
  gsap.killTweensOf(obj);
  gsap.killTweensOf(newPos);
  obj.targetL = obj.L;
  isMouseDown = true;
  // panel&&panel.mousedownFunc(event)
  let tmp = windowToCanvas(event.clientX, event.clientY, cvs);
  Object.assign(mousemove, { x: tmp.x, y: tmp.y, targetX: tmp.x, targetY: tmp.y });
  Object.assign(posl, mousemove);
  let x = ((mousemove.x - obj.imgX) * precision) / (2 ** obj.L * tileWidth);
  let y = ((mousemove.y - obj.imgY) * precision) / (2 ** obj.L * tileWidth);
  Object.assign(newPos, { x, y, targetX: x, targetY: y });
};
const mousemoveFunc = (evt: MouseEvent) => {
  let move = windowToCanvas(evt.clientX, evt.clientY, cvs);
  currentLngLat = {
    lng: pixel2Lng(move.x, obj.imgX, 2 ** obj.L, tileWidth),
    lat: pixel2Lat(move.y, obj.imgY, 2 ** obj.L, tileWidth),
  };
  if (planeLayer && planeLayer.myCursor) {
    planeLayer.myCursor.x = move.x - planeLayer.myCursor.width / 2;
    planeLayer.myCursor.y = move.y - planeLayer.myCursor.height / 2;
  }
  if (stationLayer && stationLayer.myCursor) {
    stationLayer.myCursor.x = move.x - stationLayer.myCursor.width / 2;
    stationLayer.myCursor.y = move.y - stationLayer.myCursor.height / 2;
  }
  // drawScale(2**obj.L,cvs_scale,pixel2Lat(move.y,obj.imgY,2**obj.L,tileWidth))
  // this.drawCurrentLngLat()
  // panel&&divMask.addEventListener('mousemove',panel.mousemoveFunc,{passive:false})
  if (isMouseDown) {
    let tmp = windowToCanvas(evt.clientX, evt.clientY, cvs);
    pos = { x: tmp.x, y: tmp.y, targetX: tmp.x, targetY: tmp.y };
    var deltaX = pos.x - posl.x,
      deltaY = pos.y - posl.y;
    mousemove.targetX += deltaX;
    mousemove.targetY += deltaY;
    posl = JSON.parse(JSON.stringify(pos));
    let period = 1;
    // if(config.动画){
    //   period=1
    // }else{
    //   period=0
    // }

    gsap.killTweensOf(newPos);
    gsap.killTweensOf(mousemove);
    gsap.to(mousemove, {
      duration: period,
      x: mousemove.targetX,
      y: mousemove.targetY,
      onUpdate: () => {
        obj.imgX = mousemove.x - (newPos.x * tileWidth * 2 ** obj.L) / precision;
        obj.imgY = mousemove.y - (newPos.y * tileWidth * 2 ** obj.L) / precision;
        limitRegion();
        loadMap();
        // emitter.emit('mapChange',obj)
        // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
        // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
        localStorage.L = obj.L;
        localStorage.center = JSON.stringify([
          pixel2Lng(cvs.width / 2, obj.imgX, 2 ** obj.L, tileWidth),
          pixel2Lat(cvs.height / 2, obj.imgY, 2 ** obj.L, tileWidth),
        ]);
      },
      onComplete() {
        windy.start(
          [
            [0, 0],
            [cvs.width, cvs.height],
          ],
          cvs.width,
          cvs.height,
          [
            [
              pixel2Lng(0, obj.imgX, 2 ** obj.L, 256),
              pixel2Lat(cvs.height, obj.imgY, 2 ** obj.L, 256),
            ],
            [
              pixel2Lng(cvs.width, obj.imgX, 2 ** obj.L, 256),
              pixel2Lat(0, obj.imgY, 2 ** obj.L, 256),
            ],
          ]
        );
      },
      ease: Power3.easeOut,
    });
  }
};
const mouseupFunc = (evt: MouseEvent) => {
  if (isMouseDown) {
    loadMap();
    // windy&&windy.start(
    //     [[0,0],[canvas.width, canvas.height]],
    //     canvas.width,
    //     canvas.height,
    //     [[pixel2Lng(0,obj.imgX,2**obj.L,tileWidth), pixel2Lat(canvas.height,obj.imgY,2**obj.L,tileWidth)],[pixel2Lng(canvas.width,obj.imgX,2**obj.L,tileWidth), pixel2Lat(0,obj.imgY,2**obj.L,tileWidth)]]
    // )
    isMouseDown = false;
    // panel&&panel.mouseupFunc(evt)
  }
};
const mousewheelFunc = (event: any) => {
  gsap.killTweensOf(newPos);
  if (!isMouseDown || !mousemove) {
    let tmp = windowToCanvas(event.clientX, event.clientY, cvs);
    Object.assign(mousemove, { x: tmp.x, y: tmp.y, targetX: tmp.x, targetY: tmp.y });
  }
  if (!isMouseDown) {
    gsap.killTweensOf(mousemove);
  }
  // drawScale(2**obj.L,cvs_scale,pixel2Lat(mousemove.y,obj.imgY,2**obj.L,tileWidth))
  let x = ((mousemove.x - obj.imgX) * precision) / (2 ** obj.L * tileWidth);
  let y = ((mousemove.y - obj.imgY) * precision) / (2 ** obj.L * tileWidth);
  Object.assign(newPos, { x, y, targetX: x, targetY: y });
  // console.log(event.wheelDeltaY)
  let delta = event.wheelDeltaY / 120;
  obj.targetL += delta;

  if (boundary[1] - boundary[0] > 0) {
    let tmpL = 0;
    let minX = 0 - ((boundary[0] + 180) / 360) * tileWidth * 2 ** tmpL;
    let maxX = cvs.width - ((boundary[1] + 180) / 360) * tileWidth * 2 ** tmpL;
    while (minX - maxX < 0) {
      tmpL++;
      minX = 0 - ((boundary[0] + 180) / 360) * tileWidth * 2 ** tmpL;
      maxX = cvs.width - ((boundary[1] + 180) / 360) * tileWidth * 2 ** tmpL;
    }
    obj.targetL < tmpL && (obj.targetL = tmpL);
  }
  if (boundary[2] - boundary[3] > 0) {
    let tmpL = 0;
    let minY =
      0 -
      ((1 - Math.asinh(Math.tan((boundary[2] * Math.PI) / 180)) / Math.PI) / 2) *
        2 ** tmpL *
        tileWidth;
    let maxY =
      cvs.height -
      ((1 - Math.asinh(Math.tan((boundary[3] * Math.PI) / 180)) / Math.PI) / 2) *
        2 ** tmpL *
        tileWidth;
    while (minY - maxY < 0) {
      tmpL++;
      minY =
        0 -
        ((1 - Math.asinh(Math.tan((boundary[2] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** tmpL *
          tileWidth;
      maxY =
        cvs.height -
        ((1 - Math.asinh(Math.tan((boundary[3] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** tmpL *
          tileWidth;
    }
    obj.targetL < tmpL && (obj.targetL = tmpL);
  }
  limitScale();
  let period = 1;
  // if(config.动画){
  //   period=1
  // }else{
  //   period=0
  // }
  gsap.killTweensOf(obj);
  gsap.to(obj, {
    duration: period,
    L: obj.targetL,
    onUpdate: () => {
      obj.imgX = mousemove.x - (newPos.x * tileWidth * 2 ** obj.L) / precision;
      obj.imgY = mousemove.y - (newPos.y * tileWidth * 2 ** obj.L) / precision;
      localStorage.L = obj.L;
      localStorage.center = JSON.stringify([
        pixel2Lng(cvs.width / 2, obj.imgX, 2 ** obj.L, tileWidth),
        pixel2Lat(cvs.height / 2, obj.imgY, 2 ** obj.L, tileWidth),
      ]);
      limitRegion();
      loadMap();
      // emitter.emit('mapChange',obj)
      // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
      // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
    },
    onComplete() {
      windy.start(
        [
          [0, 0],
          [cvs.width, cvs.height],
        ],
        cvs.width,
        cvs.height,
        [
          [
            pixel2Lng(0, obj.imgX, 2 ** obj.L, 256),
            pixel2Lat(cvs.height, obj.imgY, 2 ** obj.L, 256),
          ],
          [
            pixel2Lng(cvs.width, obj.imgX, 2 ** obj.L, 256),
            pixel2Lat(0, obj.imgY, 2 ** obj.L, 256),
          ],
        ]
      );
    },
    ease: Power3.easeOut,
  });
};
const limitScale = () => {
  if (限制) {
    //下面5行代码是限制地图缩放等级
    if (obj.targetL < Math.max(0, minLevel)) {
      obj.targetL = Math.max(0, minLevel);
    } else if (obj.targetL > maxLevel) {
      obj.targetL = maxLevel;
    }
    // 下面7行代码是让地图不能缩放得太小，并且最小时地图不能因放大而模糊。
    let tmpL = Math.ceil(
      Math.log(Math.max(cvs.width, cvs.height) / tileWidth) / Math.log(2)
    );
    if (obj.targetL < tmpL) {
      obj.targetL = tmpL;
    }
    if (obj.L < tmpL) {
      obj.L = tmpL;
    }
    localStorage.L = obj.L;
    eventbus.emit("systemInfo", { level: obj.L.toFixed(2) });
  }
};
let boundary = [
  -180,
  180,
  (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI,
  (-Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI,
];
// boundary=[109,121,42,37]
boundary = [
  0,
  0,
  (Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI,
  (-Math.atan(Math.sinh(Math.PI)) * 180) / Math.PI,
];
const limitRegion = () => {
  if (限制) {
    if (boundary[1] - boundary[0] > 0) {
      let tmpL = 0;
      let minX = 0 - ((boundary[0] + 180) / 360) * tileWidth * 2 ** tmpL;
      let maxX = cvs.width - ((boundary[1] + 180) / 360) * tileWidth * 2 ** tmpL;
      while (minX - maxX < 0) {
        tmpL++;
        minX = 0 - ((boundary[0] + 180) / 360) * tileWidth * 2 ** tmpL;
        maxX = cvs.width - ((boundary[1] + 180) / 360) * tileWidth * 2 ** tmpL;
      }
      obj.L < tmpL && (localStorage.L = obj.L = tmpL);
      minX = 0 - ((boundary[0] + 180) / 360) * tileWidth * 2 ** obj.L;
      maxX = cvs.width - ((boundary[1] + 180) / 360) * tileWidth * 2 ** obj.L;
      if (obj.imgX < maxX) {
        obj.imgX = maxX;
      } else if (obj.imgX > minX) {
        obj.imgX = minX;
      }
    }
    if (boundary[2] - boundary[3] > 0) {
      let tmpL = 0;
      let minY =
        0 -
        ((1 - Math.asinh(Math.tan((boundary[2] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** tmpL *
          tileWidth;
      let maxY =
        cvs.height -
        ((1 - Math.asinh(Math.tan((boundary[3] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** tmpL *
          tileWidth;
      while (minY - maxY < 0) {
        tmpL++;
        minY =
          0 -
          ((1 - Math.asinh(Math.tan((boundary[2] * Math.PI) / 180)) / Math.PI) / 2) *
            2 ** tmpL *
            tileWidth;
        maxY =
          cvs.height -
          ((1 - Math.asinh(Math.tan((boundary[3] * Math.PI) / 180)) / Math.PI) / 2) *
            2 ** tmpL *
            tileWidth;
      }
      obj.L < tmpL && (localStorage.L = obj.L = tmpL);
      minY =
        0 -
        ((1 - Math.asinh(Math.tan((boundary[2] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** obj.L *
          tileWidth;
      maxY =
        cvs.height -
        ((1 - Math.asinh(Math.tan((boundary[3] * Math.PI) / 180)) / Math.PI) / 2) *
          2 ** obj.L *
          tileWidth;
      if (obj.imgY < maxY) {
        obj.imgY = maxY;
      } else if (obj.imgY > minY) {
        obj.imgY = minY;
      }
    }
    eventbus.emit("systemInfo", { level: obj.L.toFixed(2) });
  }
  // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
  // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
};
const flyTo = (
  lng: number,
  lat: number,
  option: { targetL?: number; duration?: number } | undefined = undefined
) => {
  Object.assign(mousemove, {
    // x:lng2Pixel(lng,cvs.width/2-(lng+180)/360*tileWidth*(2**obj.targetL),2**obj.targetL,tileWidth),
    // y:lat2Pixel(lat,cvs.height/2-(1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*(2**obj.targetL)*tileWidth,2**obj.targetL,tileWidth),
    targetX: lng2Pixel(lng, obj.imgX, 2 ** obj.L, tileWidth),
    targetY: lat2Pixel(lat, obj.imgY, 2 ** obj.L, tileWidth),
  });
  // Object.assign(newPos,{
  //   x:((cvs.width/2-obj.imgX)*precision/((2**obj.L)*tileWidth)),
  //   y:((cvs.height/2-obj.imgY)*precision/((2**obj.L)*tileWidth)),
  //   targetX:((mousemove.targetX-obj.imgX)*precision/((2**obj.L)*tileWidth)),
  //   targetY:((mousemove.targetY-obj.imgY)*precision/((2**obj.L)*tileWidth))
  // })
  Object.assign(newPos, {
    x: ((cvs.width / 2 - obj.imgX) * precision) / (2 ** obj.L * tileWidth),
    y: ((cvs.height / 2 - obj.imgY) * precision) / (2 ** obj.L * tileWidth),
    targetX: ((mousemove.targetX - obj.imgX) * precision) / (2 ** obj.L * tileWidth),
    targetY: ((mousemove.targetY - obj.imgY) * precision) / (2 ** obj.L * tileWidth),
  });
  if (option && option.targetL != undefined) {
    obj.targetL = option.targetL;
    gsap.killTweensOf(obj);
    gsap.to(obj, {
      duration: option ? (option.duration !== undefined ? option.duration : 0) : 0,
      L: obj.targetL,
      onUpdate: () => {
        obj.imgX = cvs.width / 2 - (newPos.x * tileWidth * 2 ** obj.L) / precision;
        obj.imgY = cvs.height / 2 - (newPos.y * tileWidth * 2 ** obj.L) / precision;
        limitScale();
        localStorage.L = obj.L;
        localStorage.center = JSON.stringify([
          pixel2Lng(cvs.width / 2, obj.imgX, 2 ** obj.L, tileWidth),
          pixel2Lat(cvs.height / 2, obj.imgY, 2 ** obj.L, tileWidth),
        ]);
        limitRegion();
        loadMap();
        // emitter.emit('mapChange',obj)
        // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
        // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
      },
      ease: Power3.easeOut,
    });
  }
  gsap.killTweensOf(mousemove);
  gsap.killTweensOf(newPos);
  gsap.to(newPos, {
    duration: option ? (option.duration !== undefined ? option.duration : 0) : 0,
    x: newPos.targetX,
    y: newPos.targetY,
    onUpdate: () => {
      obj.imgX = cvs.width / 2 - (newPos.x * tileWidth * 2 ** obj.L) / precision;
      obj.imgY = cvs.height / 2 - (newPos.y * tileWidth * 2 ** obj.L) / precision;
      mousemove.x = obj.imgX + (newPos.x * tileWidth * 2 ** obj.L) / precision;
      mousemove.y = obj.imgY + (newPos.y * tileWidth * 2 ** obj.L) / precision;
      localStorage.L = obj.L;
      localStorage.center = JSON.stringify([
        pixel2Lng(cvs.width / 2, obj.imgX, 2 ** obj.L, tileWidth),
        pixel2Lat(cvs.height / 2, obj.imgY, 2 ** obj.L, tileWidth),
      ]);
      limitRegion();
      loadMap();
    },
    ease: Power3.easeOut,
  });
};
const testClick = () => {
  let convert = wgs84togcj02(POINT.lng, POINT.lat);
  flyTo(convert[0], convert[1], { targetL: 10, duration: 5 });
};
</script>
<style lang="scss">
.tileSelect {
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > .tileList {
    background-color: #2b2b2b;
    padding: 4px;
    border-radius: 4px;
    display: none;
  }
  &:focus-within > .tileList {
    display: block;
  }
}
.station_details {
  border: 1px solid #df0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  background-color: #2b2b2b;
  padding: 2px;
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 6px));
  position: absolute;
  white-space: nowrap;
  ::before {
    content: "";
    position: absolute;
    display: inline-block;
    left: 50%;
    transform: translateX(-50%);
    top: 100%;
    border: 6px solid transparent;
    border-top: 6px solid #ff0;
  }
}
</style>
