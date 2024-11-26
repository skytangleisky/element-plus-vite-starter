<template>
  <div
    class="timeline"
    style="width: 100%"
    tabindex="-1"
  >
    <el-icon
      @click="prev"
      class="btn"
      style="overflow: hidden;font-size: 2rem;transform: rotate(180deg);min-width: 2rem;"
      v-dompurify-html="nextSvg"
    />
    <div class="relative h-30px" style="width: 100%">
      <span class="currentTime">
        <div
          style="display: flex; align-items: center; font-family: Menlo, Consolas, Monaco;;"
        >
          <el-icon
            class="active:color-#2b2b2b"
            style="overflow: hidden; transform: rotate(180deg)"
            v-dompurify-html="rightSvg"
            @click="leftClick"
          />
          <span v-html="options.leftText"></span>
          <span style="text-decoration: underline">{{ options.underlineText }}</span>
          <span v-html="options.rightText"></span>
          <el-icon
            class="active:color-#2b2b2b"
            style="overflow: hidden"
            v-dompurify-html="rightSvg"
            @click="rightClick"
          />
        </div>
      </span>
      <canvas
        v-resize="resize"
        ref="timeShaft"
        class="dark:bg-#64646490 bg-#eeeeee90 absolute"
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
      @click="local_status == 'play' ? pause() : play()"
      class="btn"
      style="overflow: hidden; font-size: 2rem; min-width: 2rem"
      v-dompurify-html="local_status == 'play' ? stopSvg : playSvg"
    />
    <span @click="speed">x{{ Math.pow(2, options.times) }}</span>
    <!-- <graph
      v-if="checkPermission(['admin'])"
      :args="graphArgs"
      style="position: absolute; right: 30px; bottom: 100%"
    ></graph> -->
  </div>
</template>
<script lang="ts" setup>
import { checkPermission } from "./index.js";
import { gsap } from "gsap";
import stopSvg from "~/assets/stop.svg?raw";
import playSvg from "~/assets/play.svg?raw";
import nextSvg from "~/assets/next.svg?raw";
import rightSvg from "~/assets/right.svg?raw";
import moment from "moment";
import graph from "./graph.vue";
import { onMounted, onBeforeUnmount, ref, reactive, watch } from "vue";
import { isDark } from "~/composables";
const emit = defineEmits(["update:now", "update:status", "update:level", "toLeft","toMiddle","toRight"]);
const props = withDefaults(
  defineProps<{
    data?: Array<{ time: number; position: "left" | "right" | "middle" }>;
    now?: number | undefined;
    level?: number | undefined;
  }>(),
  {
    data: () => new Array<{ time: number; position: "left" }>(),
    now: undefined,
    level: undefined,
  }
);
const local_status = defineModel<"play"|"pause">('status',{
  default:'play'
})
const graphArgs = reactive({
  fps: {
    min: 0,
    max: 144,
    value: 0,
    strokeStyle: "#ffffff88",
  },
});
let options = reactive({
  frameCount: 0,
  times: 0,
  gap: 20, //文字之间的最小间隙
  middle: 4, //中刻度
  short: 2, //短刻度
  long: 8, //长刻度
  bottom: 8, //文字到底部距离
  strScaleType: "milliseconds",
  leftText: "L",
  underlineText: "M",
  rightText: "R",
  now: props.now,
  targetNow: props.now,
  value: props.level,
  targetValue: props.level,
  devicePixelRatio,
  color: isDark.value ? "white" : "black",
});
watch(isDark, (v) => {
  if (v) {
    options.color = "white";
  } else {
    options.color = "black";
  }
});
const arr = ["milliseconds", "seconds", "minutes", "hours", "day", "month", "year"];
let left = 0;
let right = 0;
let rateX = 0.5;
let timer = 0;
let timeShaft = ref(undefined);
let leftMouseDown = false;
let aid: number;
const resize = () => {
  if(cvs){
    let box = cvs.getBoundingClientRect();
    if (box.width == 0 || box.height == 0) {
      cancelAnimationFrame(aid);
    } else {
      cvs.width = box.width * options.devicePixelRatio;
      cvs.height = box.height * options.devicePixelRatio;
      draw();
      cancelAnimationFrame(aid);
      aid = requestAnimationFrame(loop);
    }
  }
};
const mousewheelFunc = (evt: any) => {
  let deltaY = evt.wheelDeltaY / 120 / 10;
  options.targetValue -= deltaY;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  let text_width = ctx.measureText("yyyy-MM-dd HH:mm:ss.SSS").width;
  let min = Math.log2(1000 / (text_width + options.gap * devicePixelRatio) / 1.5);
  let max = Math.log2(
    (365 * 24 * 60 * 60 * 1000) / (text_width + options.gap * devicePixelRatio) / 1.5
  );
  if (options.targetValue > max) {
    options.targetValue = max;
  } else if (options.targetValue < min) {
    options.targetValue = min;
  }
  gsap.killTweensOf(options);
  gsap.to(options, {
    duration: 1,
    value: options.targetValue,
  });
};
const mousedownFunc = (evt: any) => {
  if (evt.which == 1) {
    pause();
    leftMouseDown = true;
  }
};
const mouseupFunc = (evt: any) => {
  if (evt.which == 1) {
    leftMouseDown = false;
  }
};
const mousemoveFunc = (evt: any) => {
  if (leftMouseDown) {
    options.targetNow -= evt.movementX * Math.pow(2, options.value);
    gsap.killTweensOf(options);
    gsap.to(options, {
      duration: 1,
      now: options.targetNow,
      onUpdate: () => {
        if (options.now > Date.now()) {
          leftMouseDown = false;
          gsap.killTweensOf(options);
          options.targetNow = Date.now();
          play();
        }
      },
    });
  }
};
let cvs: HTMLCanvasElement;
onMounted(() => {
  cvs = (timeShaft.value as unknown) as HTMLCanvasElement;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.font = `${14 * options.devicePixelRatio}px Menlo,Consolas,Monaco`;
  if (options.value === undefined) {
    let text_width = ctx.measureText("yyyy-MM-dd HH:mm:ss.SSS").width;
    options.value = Math.log2(
      (60 * 60 * 1000) / (text_width + options.gap * devicePixelRatio) / 1.5
    );
    let min = Math.log2(1000 / (text_width + options.gap * devicePixelRatio) / 1.5);
    let max = Math.log2(
      (365 * 24 * 60 * 60 * 1000) / (text_width + options.gap * devicePixelRatio) / 1.5
    );
    if (options.value < min) {
      options.value = min;
    }
    if (options.value > max) {
      options.value = max;
    }
    options.targetValue = options.value;
  }
  cvs.addEventListener("mousewheel", mousewheelFunc, { passive: true });
  cvs.addEventListener("mousedown", mousedownFunc, {
    passive: true,
  });
  document.addEventListener("mouseup", mouseupFunc, {
    passive: true,
  });
  document.addEventListener("mousemove", mousemoveFunc, {
    passive: true,
  });
  // for (let i = 0; i < 400; i++) {
  //   let time = options.now + 1000 * i;
  //   props.data.push({
  //     time,
  //     right: time >= options.now
  //   });
  // }
  timer = setInterval(() => {
    graphArgs.fps.value = options.frameCount - prevFrameCount;
    prevFrameCount = options.frameCount;
  }, 1000);
  watch(
    () => options.now,
    (newVal) => {
      if (time === newVal) {
        //当前时间为系统时间
        emit("update:now", undefined);
      } else {
        emit("update:now", newVal);
      }
    }
  );
  watch(
    () => options.value,
    (newVal) => {
      emit("update:level", newVal);
    }
  );
});
let time: number;
if (options.now == undefined) {
  time = options.now = options.targetNow = Date.now();
} else {
  time = Date.now();
}
let prevFrameCount = options.frameCount;
const loop = () => {
  options.frameCount++;
  draw();
  aid = requestAnimationFrame(loop);
};
const speed = () => {
  options.times++;
  if (options.times > 16) {
    options.times = -3;
  }
};
const play = () => {
  time = Date.now();
  local_status.value = "play";
};
const pause = () => {
  local_status.value = "pause"
};
const leftClick = () => {
  pause();
  let date = new Date(options.now);
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  if (options.strScaleType == "milliseconds") {
    if (options.targetNow > Math.floor(options.targetNow)) {
      options.targetNow = Math.floor(options.targetNow);
    } else {
      options.targetNow = Math.floor(options.targetNow) - 1;
    }
  } else if (options.strScaleType == "seconds") {
    if (options.targetNow > Math.floor(options.targetNow / 100) * 100) {
      options.targetNow = Math.floor(options.targetNow / 100) * 100;
    } else {
      options.targetNow = Math.floor(options.targetNow / 100) * 100 - 100;
    }
  } else if (options.strScaleType == "minutes") {
    if (
      options.targetNow > new Date(year, month, day, hours, minutes, seconds).getTime()
    ) {
      options.targetNow = new Date(year, month, day, hours, minutes, seconds).getTime();
    } else {
      options.targetNow = new Date(
        year,
        month,
        day,
        hours,
        minutes,
        seconds - 1
      ).getTime();
    }
  } else if (options.strScaleType == "hours") {
    if (options.targetNow > new Date(year, month, day, hours, minutes, 0).getTime()) {
      options.targetNow = new Date(year, month, day, hours, minutes, 0).getTime();
    } else {
      options.targetNow = new Date(year, month, day, hours, minutes - 1, 0).getTime();
    }
  } else if (options.strScaleType == "day") {
    if (options.targetNow > new Date(year, month, day, hours, 0, 0).getTime()) {
      options.targetNow = new Date(year, month, day, hours, 0, 0).getTime();
    } else {
      options.targetNow = new Date(year, month, day, hours - 1, 0, 0).getTime();
    }
  } else if (options.strScaleType == "month") {
    if (options.targetNow > new Date(year, month, day).getTime()) {
      options.targetNow = new Date(year, month, day).getTime();
    } else {
      options.targetNow = new Date(year, month, day - 1).getTime();
    }
  } else if (options.strScaleType == "year") {
    if (options.targetNow > new Date(year, month, 1).getTime()) {
      options.targetNow = new Date(year, month, 1).getTime();
    } else {
      options.targetNow = new Date(year, month - 1, 1).getTime();
    }
  }
  gsap.killTweensOf(options);
  gsap.to(options, {
    now: options.targetNow,
    duration: 1,
  });
};
const rightClick = () => {
  pause();
  let date = new Date(options.targetNow);
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  if (options.strScaleType == "milliseconds") {
    options.targetNow = Math.floor(options.targetNow) + 1;
  } else if (options.strScaleType == "seconds") {
    options.targetNow = Math.floor((options.targetNow + 100) / 100) * 100;
  } else if (options.strScaleType == "minutes") {
    options.targetNow = new Date(year, month, day, hours, minutes, seconds + 1).getTime();
  } else if (options.strScaleType == "hours") {
    options.targetNow = new Date(year, month, day, hours, minutes + 1, 0).getTime();
  } else if (options.strScaleType == "day") {
    options.targetNow = new Date(year, month, day, hours + 1, 0, 0).getTime();
  } else if (options.strScaleType == "month") {
    options.targetNow = new Date(year, month, day + 1).getTime();
  } else if (options.strScaleType == "year") {
    options.targetNow = new Date(year, month + 1, 1).getTime();
  }
  gsap.killTweensOf(options);
  gsap.to(options, {
    now: options.targetNow,
    duration: 1,
    onUpdate: () => {
      if (options.now > Date.now()) {
        gsap.killTweensOf(options);
        options.targetNow = Date.now();
        play();
      }
    },
  });
};
const prev = () => {
  pause();
  for (let i = props.data.length - 1; i >= 0; i--) {
    if (props.data[i].time < options.targetNow) {
      options.targetNow = props.data[i].time;
      break;
    }
  }
  gsap.killTweensOf(options);
  gsap.to(options, {
    now: options.targetNow,
    duration: 1,
  });
};
const next = () => {
  pause();
  for (let i = 0; i < props.data.length; i++) {
    if (props.data[i].time > options.targetNow) {
      options.targetNow = props.data[i].time;
      break;
    }
  }
  gsap.killTweensOf(options);
  gsap.to(options, {
    now: options.targetNow,
    duration: 1,
    onUpdate: () => {
      if (options.now > Date.now()) {
        gsap.killTweensOf(options);
        options.targetNow = Date.now();
        play();
      }
    },
  });
};
const drawShortLine = (cvs, time) => {
  let ctx = cvs.getContext("2d");
  ctx.save();
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, cvs.height - options.short * options.devicePixelRatio);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2 * options.devicePixelRatio;
  ctx.strokeStyle = options.color;
  ctx.stroke();
  ctx.restore();
};
const drawMiddleLine = (cvs, time) => {
  let ctx = cvs.getContext("2d");
  ctx.save();
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, cvs.height - options.middle * options.devicePixelRatio);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2 * options.devicePixelRatio;
  ctx.strokeStyle = options.color;
  ctx.stroke();
  ctx.restore();
};
const drawLongLine = (cvs, time) => {
  let ctx = cvs.getContext("2d");
  ctx.save();
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, cvs.height - options.long * options.devicePixelRatio);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2 * options.devicePixelRatio;
  ctx.strokeStyle = options.color;
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = options.color;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText(
    moment(time).format("YYYY-MM-DD HH:mm:ss.SSS"),
    x,
    cvs.height - options.long * options.devicePixelRatio
  );
  ctx.restore();
};
const draw = () => {
  let cvs = timeShaft.value;
  if (options.devicePixelRatio !== devicePixelRatio) {
    options.devicePixelRatio = devicePixelRatio;
    let box = cvs.getBoundingClientRect();
    cvs.width = box.width * options.devicePixelRatio;
    cvs.height = box.height * options.devicePixelRatio;
  }
  let ctx = cvs.getContext("2d");
  ctx.font = `${14 * options.devicePixelRatio}px Menlo,Consolas,Monaco`;
  let currentTime = Date.now();
  if (local_status.value == "play") {
    let 𝛿 = currentTime - time;
    options.now += 𝛿 * Math.pow(2, options.times);
    options.targetNow = options.now;
    if (options.now > currentTime) {
      options.now = currentTime;
      options.times = 0;
    }
  }
  time = currentTime;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.save();
  let text_width = ctx.measureText("yyyy-MM-dd HH:mm:ss.SSS").width;
  left = options.now - cvs.width * Math.pow(2, options.value) * rateX;
  right = options.now + cvs.width * Math.pow(2, options.value) * (1 - rateX);
  for (let i = 0; i < props.data.length; i++) {
    let item = props.data[i];
    let x = ((item.time - left) / (right - left)) * cvs.width;
    if (item.time < options.now && item.position !== "left") {
      emit('toLeft',item)
      item.position = "left";
    }
    if (item.time > options.now && item.position !== "right") {
      emit('toRight',item)
      item.position = "right";
    }
    if (item.time === options.now && item.position !== "middle") {
      emit('toMiddle',item)
      item.position = "middle";
    }
    ctx.lineWidth = 2 * options.devicePixelRatio;
    ctx.strokeStyle = "#0f0";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cvs.height);
    ctx.stroke();
  }
  let leftDate = new Date(Math.round(left));
  let rightDate = new Date(Math.round(right));
  ctx.restore();
  for (let index = 0; index < arr.length; index++) {
    if (arr[index] === "year") {
      options.strScaleType = "year";
      let time = moment(options.now)
      options.leftText = time.format('YYYY-');
      options.underlineText = time.format("MM");
      options.rightText = time.format("-DD HH:mm:ss.SSS");
      let x1 =
        ((new Date(leftDate.getFullYear(), 0, 1).getTime() - left) / (right - left)) *
        cvs.width;
      let x2 =
        ((new Date(leftDate.getFullYear() + 1, 0, 1).getTime() - left) / (right - left)) *
        cvs.width;
      if (x2 - x1 >= text_width + options.gap * options.devicePixelRatio) {
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
      options.strScaleType = "month";
      let time = moment(options.now)
      options.leftText = time.format("yyyy-MM-");
      options.underlineText = time.format("DD");
      options.rightText = '&nbsp;' + time.format("HH:mm:ss.SSS");
      let x1 =
        ((new Date(leftDate.getFullYear(), 0, 1).getTime() - left) / (right - left)) *
        cvs.width;
      let x2 =
        ((new Date(leftDate.getFullYear(), 1, 1).getTime() - left) / (right - left)) *
        cvs.width;
      if (x2 - x1 >= text_width + options.gap * options.devicePixelRatio) {
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
      options.strScaleType = "day";
      let time = moment(options.now)
      options.leftText = time.format("YYYY-MM-DD") + "&nbsp;";
      options.underlineText = time.format('HH');
      options.rightText = time.format(':mm:ss.SSS');
      let delta = 24 * 60 * 60 * 1000;
      if (
        (cvs.width / (right - left)) * delta >=
        text_width + options.gap * options.devicePixelRatio
      ) {
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
      options.strScaleType = "hours";
      let time = moment(options.now)
      options.leftText = time.format("YYYY-MM-DD HH:");
      options.underlineText = time.format("MM");
      options.rightText = time.format(":ss.SSS");
      let delta = 60 * 60 * 1000;
      if (
        (cvs.width / (right - left)) * delta >=
        text_width + options.gap * options.devicePixelRatio
      ) {
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
      options.strScaleType = "minutes";
      let time = moment(options.now)
      options.leftText = time.format("YYYY-MM-DD HH:mm:");
      options.underlineText = time.format("ss");
      options.rightText = time.format(".SSS");
      let delta = 60 * 1000;
      if (
        (cvs.width / (right - left)) * delta >=
        text_width + options.gap * options.devicePixelRatio
      ) {
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
      options.strScaleType = "seconds";
      let time = moment(options.now)
      options.leftText = time.format("YYYY-MM-DD HH:mm:");
      options.underlineText = time.format("ss");
      options.rightText = time.format(".SSS");
      let delta = 1000;
      if (
        (cvs.width / (right - left)) * delta >=
        text_width + options.gap * options.devicePixelRatio
      ) {
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
      options.strScaleType = "milliseconds";
      let time = moment(options.now)
      options.leftText = time.format("YYYY-MM-DD HH:mm:");
      options.underlineText = time.format("ss");
      options.rightText = time.format(".SSS");
      let delta = 1;
      if (
        (cvs.width / (right - left)) * delta >=
        text_width + options.gap * options.devicePixelRatio
      ) {
        for (let i = left - delta; i < right + delta; i += delta) {
          drawLongLine(cvs, Math.round(i / delta) * delta);
        }
        break;
      }
    } else {
      throw Error(arr[index]);
    }
  }
  ctx.save()
  let x = ((time - left) / (right - left)) * cvs.width;
  ctx.fillStyle = "#00000044";
  ctx.fillRect(x, 0, cvs.width - x, cvs.height);
  x = ((options.now - left) / (right - left)) * cvs.width;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, cvs.height);
  ctx.lineWidth = 2 * options.devicePixelRatio;
  ctx.strokeStyle = "red";
  ctx.stroke();
  ctx.restore()
};
onBeforeUnmount(() => {
  cvs.removeEventListener("mousewheel", mousewheelFunc);
  cvs.addEventListener("mousedown", mousedownFunc);
  document.removeEventListener("mouseup", mouseupFunc);
  document.removeEventListener("mousemove", mousemoveFunc);
  clearInterval(timer);
  cancelAnimationFrame(aid);
});
</script>
<style lang="scss" scoped>
.dark .timeline{
  background: #646464;
}
.timeline{
  height: auto;
  display:flex;
  position: absolute;
  bottom:0;
  background:#ffffff;
}
.btn {
  &:active {
    color: gray;
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
    border:1px solid #000000a0;
    pointer-events: auto;
    text-wrap: nowrap;
    padding: 4px;
    margin: 4px;
    border-radius: 4px;
    background-color: #ffffff;
    color: black;
    /* visibility: hidden; */
    &::before {
      position: absolute;
      content: "";
      border-width: 5px;
      border-style: solid;
      border-color: #000000a0 transparent transparent transparent;
      left: calc(50% - 5px);
      top: calc(100% - 5px);
    }
    &::after {
      position: absolute;
      content: "";
      border-width: 4px;
      border-style: solid;
      border-color: #eee transparent transparent transparent;
      left: calc(50% - 4px);
      top: calc(100% - 5px);
    }
  }
}
.dark {
  .btn {
    &:active {
      color: #2b2b2b;
    }
  }
  .currentTime {
    div {
      background-color: #646464;
      color: white;
      &::before {
        border-color: black transparent transparent transparent;
      }
      &::after {
        border-color: #646464 transparent transparent transparent;
      }
    }
  }
}
</style>
