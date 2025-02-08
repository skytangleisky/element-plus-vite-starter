<template>
  <div class="color">
    <div
      style="
        border-left: 3px solid #128aed;
        box-sizing: border-box;
        font-size: 16px;
        margin-bottom: 10px;
      "
    >
      &emsp;{{ title }}
    </div>
    <div class="w-full h-full flex justify-center">
      <div style="position: relative; width: 80px; height: 80px; overflow: hidden">
        <img src="/feathers/12.svg" class="imgClass" />
        <canvas
          v-resize="resize"
          ref="canvasRef"
          style="width: 100%; height: 100%"
        ></canvas>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isDark } from "~/composables/dark";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
watch(isDark, (isDark) => {
  draw(canvas, isDark);
});
defineProps({
  title: {
    default: "标题",
    type: String,
  },
});
const canvasRef = ref(null);
let canvas: HTMLCanvasElement;
const resize = () => {
  let rect = canvas.getBoundingClientRect();
  if (rect.width != 0 && rect.height != 0) {
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    draw(canvas, isDark.value);
  }
};
onMounted(() => {
  canvas = (canvasRef.value as unknown) as HTMLCanvasElement;
});
function draw(canvas: HTMLCanvasElement, isDark: boolean) {
  let context = canvas.getContext("2d");
  if (!context) throw Error("invalid context");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.lineWidth = 1 * devicePixelRatio;
  context.font = 10 * devicePixelRatio + "px april";
  context.translate(canvas.width / 2, canvas.height / 2);
  if (isDark) {
    context.strokeStyle = "#fff";
    context.fillStyle = "#fff";
  } else {
    context.strokeStyle = "#000";
    context.fillStyle = "#000";
  }
  context.arc(0, 0, 4 * devicePixelRatio, 0, Math.PI * 2);
  // context.fill();
  context.stroke();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("站名", 0, -20 * devicePixelRatio);

  context.textAlign = "right";
  context.textBaseline = "middle";
  context.fillText("温度", -20 * devicePixelRatio, 0);

  context.textAlign = "right";
  context.textBaseline = "top";
  context.fillText("湿度", -20 * devicePixelRatio, 20 * devicePixelRatio);

  context.restore();
}
</script>
<style scoped lang="scss">
.color {
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
.imgClass {
  filter: drop-shadow(#000 0 60px);
  width: 15px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: 0% 100%;
  transform: translateY(-100%) rotate(45deg) translateY(-60px);
  user-select: none;
  -webkit-user-drag: none;
}
.dark .imgClass {
  filter: drop-shadow(#fff 0 60px);
}
</style>
