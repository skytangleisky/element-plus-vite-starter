<template>
  <canvas v-resize="resize" ref="canvasRef" class="canvasRef"></canvas>
  <!-- <graph v-if="DEV" class="absolute left-0 bottom-0" v-model:args="graphArgs"></graph> -->
</template>
<script lang="ts" setup>
interface ExtendedCanvasRenderingContext2D extends CanvasRenderingContext2D {
  saveCount: number;
}
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import SleepController from "./SleepController";
import graph from "../../tools/graph.vue";
const graphArgs = reactive({
  fps: { value: 0, min: 0, max: 144, strokeStyle: "#ffffff88" },
  // memory: { value: 0, min: 0, max: 120, strokeStyle: "#0f0" },
});
const options = reactive({
  viewport: [0, 0, 1, 1],
  maxFps: Infinity,
});
let aid: number = 0;
const DEV = import.meta.env.DEV;
const canvasRef = ref(null);
let timer: number = 0;
let frameCount: number = 0;
let prevFrameCount: number = 0;
let cvs: HTMLCanvasElement;
let ctx: ExtendedCanvasRenderingContext2D;
let sleepController = new SleepController();
let queue: Array<any> = [];
for (let i = 0; i < 1000; i++) {
  queue.push({});
}
let rect = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};
const resize = () => {
  let box = cvs.getBoundingClientRect();
  cvs.width = box.width;
  cvs.height = box.height;
  sleepController.terminateSleep();
  cancelAnimationFrame(aid);
  lastTimestamp = performance.now();
  queue.push({});
  loop(lastTimestamp);
};
onMounted(() => {
  cvs = (canvasRef.value as unknown) as HTMLCanvasElement;
  ctx = cvs.getContext("2d") as ExtendedCanvasRenderingContext2D;
  ctx.saveCount = 0;
  let save = ctx.save;
  ctx.save = function () {
    save.call(this);
    ctx.saveCount++;
  };
  let restore = ctx.restore;
  ctx.restore = function () {
    restore.call(this);
    ctx.saveCount--;
  };
  timer = setInterval(() => {
    graphArgs.fps.value = frameCount - prevFrameCount;
    prevFrameCount = frameCount;
  }, 1000);
});
let lastTimestamp: number = 0;
function draw() {
  let beginTime = performance.now();
  ctx.save();
  ctx.translate(options.viewport[0] * cvs.width, options.viewport[1] * cvs.height);
  ctx.scale(
    options.viewport[2] - options.viewport[0],
    options.viewport[3] - options.viewport[1]
  );
  ctx.beginPath();
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.fillStyle = "#ff000088";
  ctx.rect(0, 0, cvs.width, cvs.height);
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  rect.x += 1;
  ctx.rect(rect.x, rect.y, rect.width, rect.height);
  ctx.clip();
  ctx.fillStyle = "#00ff0088";
  ctx.rect(0, 0, cvs.width, cvs.height);
  ctx.fill();
  ctx.restore();
  ctx.restore();
  if (ctx.saveCount != 0) {
    throw Error(`${ctx.saveCount},store and restore are not paired!`);
  }
  let endTime = performance.now();
  // console.log((endTime - beginTime).toFixed(2), "ms");
  frameCount++;
}
async function loop(timestamp: number) {
  if (options.maxFps == Infinity) {
    lastTimestamp = timestamp;
    if (queue.length > 0) {
      draw();
      queue.shift();
    }
  } else {
    let interval = 1000 / options.maxFps;
    if (lastTimestamp == timestamp || timestamp - lastTimestamp > interval) {
      lastTimestamp = timestamp - ((timestamp - lastTimestamp) % interval);
      if (queue.length) {
        draw();
        queue.shift();
      }
    }
  }
  await sleepController
    .sleep(0)
    .then(() => {
      if (queue.length > 0) {
        aid = requestAnimationFrame(loop);
        console.log(aid);
      } else {
        loop(performance.now());
      }
    })
    .catch((e) => {
      prevFrameCount = 0;
      frameCount = 1;
      // console.log(e);
    });
}
onBeforeUnmount(() => {
  sleepController.terminateSleep();
  cancelAnimationFrame(aid);
  clearInterval(timer);
});
</script>
<style lang="scss" scoped>
.canvasRef {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 1px solid red;
  box-sizing: border-box;
}
</style>
