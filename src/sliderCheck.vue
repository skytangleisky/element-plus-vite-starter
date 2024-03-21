<template>
  <div
    class="flex items-center justify-center w-full bg-#aaaaaa44"
    style="color: white; border-radius: 4px"
  >
    <div ref="maskRef" class="mask">
      {{ props.sliderStatus }}
    </div>
    <div
      ref="handlerRef"
      class="handler"
      @mousedown.left="leftMousedown"
      @touchstart.stop="leftMousedown"
    >
      <el-icon
        style="color: gray; width: 1rem; height: 1rem; pointer-events: none"
        v-html="rightSvg"
      ></el-icon>
    </div>
    按住滑块拖到最右边
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    sliderStatus: "验证中" | "验证通过";
  }>(),
  {
    sliderStatus: "验证中",
  }
);
const emit = defineEmits(["update:sliderStatus"]);
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
const rightSvg = ref(
  '<svg viewBox="0 0 1209 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M683.343 998.997l497.14-426.691a77.053 77.053 0 0 0 0-120.622L683.342 25.006a111.293 111.293 0 0 0-140.573 0 77.013 77.013 0 0 0 0 120.622l327.37 281.064c54.621 57.439 99.484 96.222 0 170.7l-327.37 280.97a77.053 77.053 0 0 0 0 120.635 111.293 111.293 0 0 0 140.573 0z"></path><path d="M169.676 998.997l497.14-426.691a77.053 77.053 0 0 0 0-120.622L169.676 25.006a111.293 111.293 0 0 0-140.572 0 77.053 77.053 0 0 0 0 120.622l327.369 281.064c54.622 57.439 99.484 96.222 0 170.7l-327.37 280.97a77.094 77.094 0 0 0 0 120.635 111.293 111.293 0 0 0 140.573 0z"></path></svg>'
);
import gsap from "gsap";
let mousedown = false;
let target: HTMLDivElement;
let offset = { x: 0, y: 0 };
const leftMousedown = (evt: MouseEvent | TouchEvent) => {
  if (evt instanceof MouseEvent) {
    dataX.length = 0;
    dataY.length = 0;
    target = (evt.target as unknown) as HTMLDivElement;
    let targetBox = target.getBoundingClientRect();
    offset.x = evt.clientX - targetBox.x;
    offset.y = evt.clientY - targetBox.y;
    mousedown = true;
  } else if (evt instanceof TouchEvent) {
    dataX.length = 0;
    dataY.length = 0;
    target = (evt.target as unknown) as HTMLDivElement;
    let targetBox = target.getBoundingClientRect();
    offset.x = evt.touches[0].clientX - targetBox.x;
    offset.y = evt.touches[0].clientY - targetBox.y;
    mousedown = true;
  }
};
const mouseup = (evt: MouseEvent | TouchEvent) => {
  if (props.sliderStatus !== "验证通过") {
    options.targetLeft = 0;
    gsap.killTweensOf(options);
    gsap.to(options, {
      left: options.targetLeft,
      duration: 0.5,
      onUpdate: () => {
        handlerRef.value.style.left = options.left + "px";
        maskRef.value.style.width = options.left + 20 + "px";
      },
    });
  }
  mousedown = false;
};
const options = {
  left: 0,
  targetLeft: 0,
};
const handlerRef = ref<HTMLElement>((null as unknown) as HTMLElement);
const maskRef = ref<HTMLElement>((null as unknown) as HTMLElement);
const mousemoveFunc = (evt: MouseEvent | TouchEvent) => {
  if (evt instanceof MouseEvent) {
    dataX.push(evt.clientX);
    dataY.push(evt.clientY);
    if (mousedown && props.sliderStatus !== "验证通过") {
      emit("update:sliderStatus", "验证中");
      let targetBox = target.getBoundingClientRect();
      let parent = (target.parentElement as unknown) as HTMLDivElement;
      let parentBox = parent.getBoundingClientRect();
      let width = parentBox.width;
      options.targetLeft = evt.clientX - parentBox.x - offset.x;
      if (options.targetLeft < 0) {
        options.targetLeft = 0;
      } else if (options.targetLeft > width - targetBox.width) {
        let avgX =
          dataX.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + curr;
          }) / dataX.length;
        let avgY =
          dataY.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + curr;
          }) / dataY.length;
        let ⳜX =
          dataX.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + (curr - avgX) ** 2;
          }, (dataX[0] - avgX) ** 2) / dataX.length;
        let ⳜY =
          dataY.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + (curr - avgY) ** 2;
          }, (dataY[0] - avgY) ** 2) / dataY.length;
        options.targetLeft = width - targetBox.width;

        // console.log(ⳜX + ⳜY);
        if (3000 < ⳜX + ⳜY && ⳜX + ⳜY < 4000) {
          emit("update:sliderStatus", "验证通过");
          target.style.cursor = "default";
        } else {
          mousedown = false;
          dataX.length = 0;
          dataY.length = 0;
          emit("update:sliderStatus", "验证失败");
        }
      }
      gsap.killTweensOf(options);
      gsap.to(options, {
        left: options.targetLeft,
        duration: 0,
        onUpdate: () => {
          handlerRef.value.style.left = options.left + "px";
          maskRef.value.style.width = options.left + 20 + "px";
        },
      });
    }
  } else if (evt instanceof TouchEvent) {
    dataX.push(evt.touches[0].clientX);
    dataY.push(evt.touches[0].clientY);
    if (mousedown && props.sliderStatus !== "验证通过") {
      emit("update:sliderStatus", "验证中");
      let targetBox = target.getBoundingClientRect();
      let parent = (target.parentElement as unknown) as HTMLDivElement;
      let parentBox = parent.getBoundingClientRect();
      let width = parentBox.width;
      options.targetLeft = evt.touches[0].clientX - parentBox.x - offset.x;
      if (options.targetLeft < 0) {
        options.targetLeft = 0;
      } else if (options.targetLeft > width - targetBox.width) {
        let avgX =
          dataX.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + curr;
          }) / dataX.length;
        let avgY =
          dataY.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + curr;
          }) / dataY.length;
        let ⳜX =
          dataX.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + (curr - avgX) ** 2;
          }, (dataX[0] - avgX) ** 2) / dataX.length;
        let ⳜY =
          dataY.reduce(function (prev: any, curr: any, idx: number, arr: any) {
            return prev + (curr - avgY) ** 2;
          }, (dataY[0] - avgY) ** 2) / dataY.length;
        options.targetLeft = width - targetBox.width;

        // console.log(ⳜX + ⳜY);
        if (3000 < ⳜX + ⳜY && ⳜX + ⳜY < 4000) {
          emit("update:sliderStatus", "验证通过");
          target.style.cursor = "default";
        } else {
          mousedown = false;
          dataX.length = 0;
          dataY.length = 0;
          emit("update:sliderStatus", "验证失败");
        }
      }
      gsap.killTweensOf(options);
      gsap.to(options, {
        left: options.targetLeft,
        duration: 0,
        onUpdate: () => {
          handlerRef.value.style.left = options.left + "px";
          maskRef.value.style.width = options.left + 20 + "px";
        },
      });
      evt.preventDefault();
    }
  }
};
let dataX = new Array<number>();
let dataY = new Array<number>();
onMounted(() => {
  document.addEventListener("mousemove", mousemoveFunc, { passive: false });
  document.addEventListener("touchmove", mousemoveFunc, { passive: false });
  document.addEventListener("mouseup", mouseup, { passive: false });
  document.addEventListener("touchend", mouseup, { passive: false });
  watch(
    () => props.sliderStatus,
    (sliderStatus) => {
      if (props.sliderStatus == "验证中") {
        maskRef.value.style.background = "#3bb2d0";
      } else if (props.sliderStatus == "验证通过") {
        maskRef.value.style.background = "#080";
      } else if (props.sliderStatus == "验证失败") {
        maskRef.value.style.background = "#fbb03b";
      }
    },
    { immediate: true }
  );
});
onBeforeUnmount(() => {
  document.removeEventListener("mousemove", mousemoveFunc);
  document.removeEventListener("touchmove", mousemoveFunc);
  document.removeEventListener("mouseup", mouseup);
  document.removeEventListener("touchend", mouseup);
});
const reset = () => {
  dataX.length = 0;
  dataY.length = 0;
  emit("update:sliderStatus", "验证中");
  handlerRef.value.style.left = "0px";
  maskRef.value.style.width = "20px";
  options.targetLeft = 0;
  options.left = 0;
};
defineExpose({
  reset,
});
</script>
<style lang="scss">
.mask {
  position: absolute;
  border-radius: 4px;
  left: 0;
  width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
}
.handler {
  cursor: pointer;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  left: 0px;
  border-radius: 4px;
  width: 40px;
  height: 100%;
}
</style>
