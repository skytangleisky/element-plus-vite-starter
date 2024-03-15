<template>
  <div v-resize="resize" ref="canvasContainer" class="canvasContainer bg-#2b2b2b">
    <canvas id="gradient" class="w-full h-full"></canvas>
    <div class="button confirm" @click.native="confirm">确认</div>
    <div class="button cancel" @click.native="cancel">取消</div>
    <div class="button palette">添加到色板</div>
    <div class="button colorLib">颜色库</div>
  </div>
</template>
<script lang="ts" setup>
import { fabric } from "fabric";
import palette from "../mapbox/data/红外/I-01.xml?raw";
var Color: { [key: string]: any } = {};
let xmlDoc = new DOMParser().parseFromString(palette, "text/xml");
let collections = xmlDoc.getElementsByTagName("entry");
for (let i = 0; i < collections.length; i++) {
  let value = Number(collections[i].getAttribute("value"));
  let strPalette = collections[i].getAttribute("rgba");
  if (strPalette) {
    let rgba = strPalette.split(",");
    rgba.map((v) => Number(v));
    Color[value.toFixed()] = rgba;
  }
}
import { onMounted, onBeforeUnmount, reactive, ref, Ref } from "vue";
const canvasContainer = ref(null);
let canvas: fabric.Canvas;
const resize = () => {
  if (canvasContainer.value) {
    let rect = (canvasContainer.value as HTMLCanvasElement).getBoundingClientRect();
    canvas.setDimensions({
      width: rect.width,
      height: rect.height,
    });
    canvas.renderAll();
  }
};
onBeforeUnmount(() => {
  canvas && canvas.dispose();
});
const confirm = () => {
  console.log("confirm");
};
const cancel = () => {
  console.log("cancel");
};
onMounted(() => {
  canvas = new fabric.Canvas("gradient", {
    width: 300,
    height: 150,
    selection: true,
  });

  for (let k in Color) {
    let color = Color[k];
    console.log(`rgb(${color[0]},${color[1]},${color[2]}))`);
    canvas.add(
      new fabric.Rect({
        strokeWidth: 0,
        left: 4 * Number(k),
        top: 10,
        width: 4,
        height: 20,
        fill: `rgb(${color[0]},${color[1]},${color[2]})`,
        hasControls: false,
        hasBorders: false,
        selectable: true,
        lockMovementX: true,
        lockMovementY: true,
      })
    );
  }
});
</script>
<style scoped lang="scss">
.canvasContainer {
  // border-radius: 0px;
  overflow: hidden;
  box-sizing: border-box;
  // box-shadow: 0 0 0 1px #757575, 0 0 0 2px #010201;
  // background-image: url(./colorPickerBg.png);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .button {
    position: absolute;
    left: 419px;
    width: 91px;
    height: 25px;
    background-color: transparent;
    border-radius: 12px;
    box-sizing: border-box;
    color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    &.confirm {
      border: 1px solid #dadada;
      top: 40px;
      &:active {
        background-color: #dadada;
        color: #393939;
      }
    }
    &.cancel {
      border: 1px solid #686868;
      top: 75px;
      &:active {
        background-color: #686868;
        color: #393939;
      }
    }
    &.palette {
      border: 1px solid #686868;
      top: 117px;
      &:active {
        background-color: #686868;
        color: #393939;
      }
    }
    &.colorLib {
      border: 1px solid #686868;
      top: 159px;
      &:active {
        background-color: #686868;
        color: #393939;
      }
    }
  }
}
</style>
