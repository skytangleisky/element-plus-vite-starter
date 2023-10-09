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
      <div style="position: relative; width: 80px; height: 80px">
        <img
          src="/src/assets/feathers/12.svg"
          style="
            width: 15px;
            height: 30px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform-origin: 0% 100%;
            transform: translateY(-100%) rotate(45deg);
            user-select: none;
            -webkit-user-drag: none;
          "
        />
        <canvas ref="canvasRef" style="width: 100%; height: 100%"></canvas>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
defineProps({
  title: {
    default: "标题",
    type: String,
  },
});
const canvasRef = ref(null);
onMounted(() => {
  if (canvasRef.value) {
    let canvas: HTMLCanvasElement = canvasRef.value;
    let observer = new ResizeObserver((size) => {
      let rect = canvas.getBoundingClientRect();
      if (rect.width != 0 && rect.height != 0) {
        canvas.width = rect.width * devicePixelRatio;
        canvas.height = rect.height * devicePixelRatio;
        draw(canvas);
      }
    });
    observer.observe(canvas);
    function draw(canvas: HTMLCanvasElement) {
      let context = canvas.getContext("2d");
      if (!context) throw Error("invalid context");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.strokeStyle = "#000";
      context.lineWidth = 1;
      context.translate(canvas.width / 2, canvas.height / 2);
      context.fillStyle = "#000";
      context.arc(0, 0, 4, 0, Math.PI * 2);
      // context.fill();
      context.stroke();
      context.fillStyle = "#000";

      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("站名", 0, -20);

      context.textAlign = "right";
      context.textBaseline = "middle";
      context.fillText("高度", -20, 0);

      context.textAlign = "right";
      context.textBaseline = "top";
      context.fillText("温度", -20, 20);

      context.textAlign = "left";
      context.textBaseline = "top";
      context.fillText("湿度", 20, 20);
      context.restore();
    }

    onBeforeUnmount(() => {
      observer.disconnect();
    });
  }
});
</script>
<style scoped lang="scss">
.color {
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
</style>
