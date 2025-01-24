<template>
  <div class="graph h-auto flex flex-row justify-center" tabindex="-1">
    <div class="relative h-60px" style="background: hsl(230deg 7% 17%); width: 160px">
      <canvas
        v-resize="resize"
        ref="timeShaft"
        style="
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.2);
        "
      ></canvas>
      <template v-for="(v, k) in data" :key="k">
        <span
          class="tp-grlv_t_temp tp-ttv_temp"
          :style="`left: ${data[k].left}px;top:${data[k].top}px`"
          >{{ data[k].value }}</span
        >
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
type Item = {
  value?: number;
  max?: number;
  min?: number;
  strokeStyle?: string;
};
type propsType = {
  args?: { [key: string]: Item };
};
const props = withDefaults(defineProps<propsType>(), {
  args: () => ({
    fps: {
      value: 0,
      min: 0,
      max: 120,
      strokeStyle: "white",
    },
  }),
});
const count = 100;
let timer = 0;
let timeShaft = ref(undefined);
let leftMouseDown = false;
let aid: number;
let data: any = reactive({});
let offsetX: any;
const interval = 200;
let cvs: HTMLCanvasElement;
const resize = () => {
  let box = cvs.getBoundingClientRect();
  if (box.width == 0 || box.height == 0) {
    cancelAnimationFrame(aid);
  } else {
    cvs.width = box.width;
    cvs.height = box.height;
    draw();
    cancelAnimationFrame(aid);
    aid = requestAnimationFrame(loop);
  }
};
onMounted(() => {
  cvs = (timeShaft.value as unknown) as HTMLCanvasElement;
  cvs.addEventListener("mousedown", (evt) => {
    if (evt.which == 1 && cvs) {
      leftMouseDown = true;
      var rect = cvs.getBoundingClientRect(); // 获取 Canvas 相对于视口的位置信息
      offsetX = evt.clientX - rect.left;
      aid = requestAnimationFrame(loop);
    }
  });
  document.addEventListener("mouseup", (evt) => {
    if (evt.which == 1) {
      leftMouseDown = false;
    }
  });
  document.addEventListener("mousemove", (evt: any) => {
    if (cvs && leftMouseDown) {
      var rect = cvs.getBoundingClientRect(); // 获取 Canvas 相对于视口的位置信息
      offsetX = evt.clientX - rect.left;
      aid = requestAnimationFrame(loop);
    }
  });
  timer = setInterval(() => {
    if (cvs) {
      for (let k in props.args) {
        if (data[k] == undefined)
          data[k] = {
            left: 0,
            top: cvs.height - 4,
            value: 0,
            "padding-top": 4,
            "padding-bottom": 4,
            items: [],
          };
        data[k].items.push(Object.assign({}, props.args[k]));
        while (data[k].items.length > count) {
          data[k].items.shift();
        }
      }
      aid = requestAnimationFrame(loop);
    }
  }, interval);
});
const loop = () => {
  let currentTime = Date.now();
  if (time == undefined) {
    time = currentTime;
  }
  // if (currentTime - time > interval) {
  time = currentTime;
  draw();
  // }
  // aid = requestAnimationFrame(loop);
};
let time: any;
const draw = () => {
  if (cvs) {
    let ctx: CanvasRenderingContext2D | null = cvs.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.save();
      for (let k in data) {
        let list = data[k].items;
        data[k].flag = true;
        ctx.beginPath();
        for (let i = 0; i < list.length; i++) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = list[i].strokeStyle;
          let x = (i / (count - 1)) * cvs.width;
          let y =
            (1 - (list[i].value - list[i].min) / (list[i].max - list[i].min)) *
              (cvs.height - data[k]["padding-top"] - data[k]["padding-bottom"]) +
            data[k]["padding-top"];
          if (data[k].flag && x >= offsetX) {
            data[k].left = x;
            data[k].top = y;
            data[k].value = list[i].value;
            data[k].flag = false;
          }
          if (i == 0) {
            ctx.moveTo(x, y);
          } else if (i == list.length - 1) {
            ctx.lineTo(x, y);
            ctx.stroke();
            if (offsetX == undefined || x < offsetX) {
              data[k].left = x;
              data[k].top = y;
              data[k].value = list[i].value;
            }
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.restore();
    }
  }
};
onBeforeUnmount(() => {
  clearInterval(timer);
  cancelAnimationFrame(aid);
});
</script>
<style lang="scss" scoped>
.graph {
  .tp-grlv_t_temp {
    margin-top: -4px;
    transition: left 0.05s, top 0.05s;
    /* visibility: hidden; */
    .tp-ttv_temp {
      background-color: #bbbcc4b3;
      &::before {
        border-top-color: rgba(0, 0, 0, 0.2);
      }
    }
  }
  .tp-ttv_temp {
    left: 0px;
    top: 100%;
    background-color: #bbbcc4;
    border-radius: 2px;
    color: #28292e;
    padding: 2px 4px;
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, -100%);
    border: 1px solid gray;
    &::before {
      border-color: gray transparent transparent transparent;
      border-style: solid;
      border-width: 4px;
      box-sizing: border-box;
      content: "";
      top: 100%;
      left: calc(50% - 4px);
      position: absolute;
    }
    &::after {
      border-color: #bbbcc4 transparent transparent transparent;
      border-style: solid;
      border-width: 4px;
      box-sizing: border-box;
      content: "";
      top: calc(100% - 1px);
      left: calc(50% - 4px);
      position: absolute;
    }
  }
}
</style>
