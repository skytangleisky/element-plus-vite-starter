<template>
  <div
    class="timeline h-auto flex flex-row absolute"
    style="background: #646464; width: 100%; bottom: 0"
    tabindex="-1"
  >
    <el-icon
      @click="prev"
      class="btn"
      style="
        overflow: hidden;
        font-size: 2rem;
        transform: rotate(180deg);
        min-width: 2rem;
      "
      v-dompurify-html="nextSvg"
    />
    <div class="relative h-30px" style="width: 100%">
      <span class="currentTime">
        <div>{{ options.currentTime }}</div></span
      >
      <canvas
        ref="timeShaft"
        class="bg-#646464 absolute"
        style="width: 100%; height: 100%"
      ></canvas>
    </div>
    <el-icon
      @click="next"
      class="btn"
      style="overflow: hidden; font-size: 2rem; min-width: 2rem"
      v-dompurify-html="nextSvg"
    />
    <el-icon
      @click="options.status == 'play' ? pause() : play()"
      class="btn"
      style="overflow: hidden; font-size: 2rem; min-width: 2rem"
      v-dompurify-html="options.status == 'play' ? pauseSvg : playSvg"
    />
    <span @click="speed" style="color: white">x{{ Math.pow(2, options.times) }}</span>
    <graph
      :args="graphArgs"
      style="position: absolute; right: 30px; bottom: 100%"
    ></graph>
  </div>
</template>
<script setup>
// <img
//   :src="options.status == 'play' ? pauseUrl : playUrl"
//   style="
//     width: inherit;
//     height: inherit;
//     transform: translateY(-60px);
//     filter: drop-shadow(rgba(255, 255, 255, 1) 0 60px);
//   "
// />
import pauseSvg from "~/assets/pause.svg?raw";
import playSvg from "~/assets/play.svg?raw";
import nextSvg from "~/assets/next.svg?raw";
import { useBus } from "~/myComponents/bus";
import graph from "./graph.vue";
const bus = useBus();
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
let now = Date.now();
let data = [];
const graphArgs = reactive({
  fps: {
    min: 0,
    max: 144,
    value: 0,
    strokeStyle: "#ffffff88",
  },
});
for (let i = 0; i < 400; i++) {
  let time = now + 1000 * i;
  data.push({
    time,
    right: time >= now,
    toLeft: (item) => {
      console.log("到了左边", item.time);
    },
    toRight: (item) => {
      console.log("到了右边", item.time);
    },
  });
}
let value = 6.75;
let options = reactive({
  frameCount: 0,
  times: 0,
  gap: 20, //文字之间的最小间隙
  middle: 3, //中刻度
  short: 1, //短刻度
  long: 5, //长刻度
  bottom: 8, //文字到底部距离
  status: "play", //play|pause
  currentTime: "",
});
const arr = ["milliseconds", "seconds", "minutes", "hours", "day", "month", "year" ];
let left = 0;
let right = 0;
let rateX = 0.5;
let timer = 0;
let timeShaft = ref(undefined);
let mousemove;
let leftMouseDown = false;
let aid;
let observer;
onMounted(() => {
  let cvs = timeShaft.value;
  mousemove = {
    offsetX: cvs.width * rateX,
    offsetY: cvs.height * rateX,
  };
  cvs.addEventListener("mousewheel", (evt) => {
    let deltaY = evt.wheelDeltaY / 120 / 10;
    value -= deltaY;
    if (value > 27.5) {
      value = 27.5;
    } else if (value < -7.5) {
      value = -7.5;
    }
    draw();
  });
  cvs.addEventListener("mousedown", (evt) => {
    if (evt.which == 1) {
      leftMouseDown = true;
      pause();
    }
  });
  document.addEventListener("mouseup", (evt) => {
    if (evt.which == 1) {
      leftMouseDown = false;
    }
  });
  document.addEventListener("mousemove", (evt) => {
    if (leftMouseDown) {
      // left += evt.movementX;
      // rateX = (mousemove.offsetX - left) / cvs.width / Math.pow(2, value);
      // if (rateX * duration + now - duration / 2 > Date.now()) {
      //   options.times = 0;
      //   left =
      //     mousemove.offsetX -
      //     ((Date.now() - now) / duration + 0.5) * cvs.width * Math.pow(2, value);
      //   rateX = (mousemove.offsetX - left) / cvs.width / Math.pow(2, value);
      //   play();
      //   leftMouseDown = false;
      //   return;
      // }
      // draw();
      now-=evt.movementX*Math.pow(2,value)
      if(now>Date.now()){
        options.times = 0
        now = Date.now()
        leftMouseDown = false;
        play();
      }else{
        draw()
      }
    }
  });
  observer = new ResizeObserver(() => {
    let box = cvs.getBoundingClientRect();
    if (box.width == 0 || box.height == 0) {
      cancelAnimationFrame(aid);
    } else {
      cvs.width = box.width;
      cvs.height = box.height;
      mousemove = {
        offsetX: cvs.width * rateX,
        offsetY: cvs.height * rateX,
      };
      left = mousemove.offsetX - rateX * cvs.width * Math.pow(2, value);
      draw();
      cancelAnimationFrame(aid);
      requestAnimationFrame(loop);
    }
  });
  observer.observe(cvs);
  timer = setInterval(() => {
    graphArgs.fps.value = options.frameCount - prevFrameCount;
    prevFrameCount = options.frameCount;
  }, 1000);
});
let time = now;
let prevFrameCount = options.frameCount;
const loop = () => {
  options.frameCount++;
  draw();
  aid = requestAnimationFrame(loop);
};
const speed = () => {
  options.times++;
  if (options.times > 3) {
    options.times = -3;
  }
};
const prev = () => {
  pause();
  console.log("prev");
};
const play = () => {
  options.status = "play";
};
const pause = () => {
  options.status = "pause";
};
const next = () => {
  bus.test = time;
  pause();
  console.log("next");
};
const drawShortLine = (cvs, time) => {
  let ctx = cvs.getContext("2d");
  ctx.save();
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, cvs.height - options.short);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.restore();
};
const drawMiddleLine = (cvs, time) => {
  let ctx = cvs.getContext("2d");
  ctx.save();
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, cvs.height - options.middle);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.restore();
};
const drawLongLine = (cvs, time) => {
  let ctx = cvs.getContext("2d");
  ctx.save();
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, cvs.height - options.long);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(
    new Date(time).Format("yyyy-MM-dd HH:mm:ss.SSS"),
    x,
    cvs.height - options.long
  );
  ctx.restore();
};
const draw = () => {
  let cvs = timeShaft.value;
  let ctx = cvs.getContext("2d");
  ctx.font = "10px Menlo,Consolas,Monaco";
  let currentTime = Date.now()
  if(options.status == 'play'){
    let 𝛿 = (currentTime - time)
    now += 𝛿*Math.pow(2,options.times)
    if(now>currentTime){
      now = currentTime
      options.times = 0
    }
  }
  time = currentTime;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.save();
  options.currentTime = new Date(now).Format("yyyy-MM-dd HH:mm:ss");
  let text_width = ctx.measureText("yyyy-MM-dd HH:mm:ss.SSS").width;
  left = now - cvs.width * Math.pow(2, value) * rateX;
  right = now + cvs.width * Math.pow(2, value) * (1 - rateX);
  drawMiddleLine(cvs, now, cvs.height);
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let x = ((item.time - left) / (right - left)) * cvs.width;;
    if (item.time < now && item.right) {
      item.toLeft(item);
      item.right = false;
    } else if (item.time > now && !item.right) {
      item.toRight(item);
      item.right = true;
    }
    ctx.strokeStyle = "#0f0";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cvs.height);
    ctx.stroke();
  }

  let leftDate = new Date(Math.round(left));
  let rightDate = new Date(Math.round(right));
  for (let index = 0; index < arr.length; index++) {
    if (arr[index] === "year") {
      let x1 =
        ((new Date(leftDate.getFullYear(), 0, 1).getTime() - left) / (right - left)) *
        cvs.width;
      let x2 =
        ((new Date(leftDate.getFullYear() + 1, 0, 1).getTime() - left) / (right - left)) *
        cvs.width;
      if (x2 - x1 >= text_width + options.gap) {
        for (let i = leftDate.getFullYear(); i <= rightDate.getFullYear() + 1; i++) {
          drawLongLine(cvs, new Date(i, 0, 1).getTime());
          for (let j = 1; j < 12; j++) {
            if (j == 6) {
              drawMiddleLine(cvs, new Date(i, j, 1).getTime());
            } else {
              drawShortLine(cvs, new Date(i, j, 1).getTime());
            }
          }
        }
        break;
      }
    } else if (arr[index] === "month") {
      let x1 =
        ((new Date(leftDate.getFullYear(), 0, 1).getTime() - left) / (right - left)) *
        cvs.width;
      let x2 =
        ((new Date(leftDate.getFullYear(), 1, 1).getTime() - left) / (right - left)) *
        cvs.width;
      if (x2 - x1 >= text_width + options.gap) {
        let totalMonth =
          (rightDate.getFullYear() - leftDate.getFullYear()) * 12 +
          rightDate.getMonth() -
          leftDate.getMonth();
        for (let i = 0; i <= totalMonth + 1; i++) {
          drawLongLine(
            cvs,
            new Date(leftDate.getFullYear(), leftDate.getMonth() + i, 1).getTime()
          );
          for (
            let j = 1;
            j <=
            new Date(leftDate.getFullYear(), leftDate.getMonth() + i + 1, 0).getDate();
            j++
          ) {
            drawShortLine(
              cvs,
              new Date(leftDate.getFullYear(), leftDate.getMonth() + i, j)
            );
          }
        }
        break;
      }
    } else if (arr[index] === "day") {
      let delta = 24 * 60 * 60 * 1000;
      if ((cvs.width / (right - left)) * delta >= text_width + options.gap) {
        for (
          let i = left - delta + 8 * 60 * 60 * 1000;
          i < right + delta + 8 * 60 * 60 * 1000;
          i += delta
        ) {
          drawLongLine(cvs, Math.round(i / delta) * delta - 8 * 60 * 60 * 1000);
          for (let j = 1; j < 24; j++) {
            if (j == 12) {
              drawMiddleLine(
                cvs,
                Math.round(i / delta) * delta - 8 * 60 * 60 * 1000 + j * 60 * 60 * 1000
              );
            } else {
              drawShortLine(
                cvs,
                Math.round(i / delta) * delta - 8 * 60 * 60 * 1000 + j * 60 * 60 * 1000
              );
            }
          }
        }
        break;
      }
    } else if (arr[index] === "hours") {
      let delta = 60 * 60 * 1000;
      if ((cvs.width / (right - left)) * delta >= text_width + options.gap) {
        for (
          let i = left - delta + 8 * 60 * 60 * 1000;
          i < right + delta + 8 * 60 * 60 * 1000;
          i += delta
        ) {
          drawLongLine(cvs, Math.round(i / delta) * delta - 8 * 60 * 60 * 1000);
          for (let j = 1; j < 60; j++) {
            if (j == 30) {
              drawMiddleLine(
                cvs,
                Math.round(i / delta) * delta - 8 * 60 * 60 * 1000 + j * 60 * 1000
              );
            } else {
              drawShortLine(
                cvs,
                Math.round(i / delta) * delta - 8 * 60 * 60 * 1000 + j * 60 * 1000
              );
            }
          }
        }
        break;
      }
    } else if (arr[index] === "minutes") {
      let delta = 60 * 1000;
      if ((cvs.width / (right - left)) * delta >= text_width + options.gap) {
        for (let i = left - delta; i < right + delta; i += delta) {
          drawLongLine(cvs, Math.round(i / delta) * delta);
          for (let j = 1; j < 60; j++) {
            if (j == 30) {
              drawMiddleLine(cvs, Math.round(i / delta) * delta + j * 1000);
            } else {
              drawShortLine(cvs, Math.round(i / delta) * delta + j * 1000);
            }
          }
        }
        break;
      }
    } else if (arr[index] === "seconds") {
      let delta = 1000;
      if ((cvs.width / (right - left)) * delta >= text_width + options.gap) {
        for (let i = left - delta; i < right + delta; i += delta) {
          drawLongLine(cvs, Math.round(i / delta) * delta);
          for (let j = 1; j < 10; j++) {
            if (j == 5) {
              drawMiddleLine(cvs, Math.round(i / delta) * delta + j * 100);
            } else {
              drawShortLine(cvs, Math.round(i / delta) * delta + j * 100);
            }
          }
        }
        break;
      }
    } else if (arr[index] === "milliseconds") {
      let delta = 1;
      if ((cvs.width / (right - left)) * delta >= text_width + options.gap) {
        for (let i = left - delta; i < right + delta; i += delta) {
          drawLongLine(cvs, Math.round(i / delta) * delta);
        }
        break;
      }
    } else {
      throw Error(arr[index]);
    }
  }
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.fillStyle = '#00000044'
  ctx.fillRect(x,0,cvs.width-x,cvs.height)

  x = ((now - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";
  ctx.stroke();
  ctx.restore();
};
onBeforeUnmount(() => {
  clearInterval(timer);
  observer.disconnect();
  cancelAnimationFrame(aid);
});
</script>
<style lang="scss" scoped>
.btn {
  color: white;
  &:active {
    color: #2b2b2b;
  }
}
.timeline:focus .currentTime {
  visibility: visible;
}
.currentTime {
  position: absolute;
  box-sizing: content-box;
  width: 100%;
  bottom: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  pointer-events: none;
  div {
    pointer-events: auto;
    text-wrap: nowrap;
    padding: 4px;
    margin: 4px;
    border-radius: 4px;
    background-color: #646464;
    color: white;
    /* visibility: hidden; */
    &::before {
      position: absolute;
      content: "";
      border-width: 4px;
      border-style: solid;
      border-color: #646464 transparent transparent transparent;
      left: calc(50% - 4px);
      top: calc(100% - 4px);
    }
  }
}
</style>
