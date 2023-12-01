<template>
  <div class="canvasContainer">
    <canvas id="gradient" class="w-full h-full"></canvas>
    <div class="title">拾色器</div>
    <div class="button confirm" @click.native="confirm">确认</div>
    <div class="button cancel" @click.native="cancel">取消</div>
    <div class="button palette">添加到色板</div>
    <div class="button colorLib">颜色库</div>
  </div>
</template>
<script lang="js" setup>
import { fabric } from "fabric";
import { onMounted, onBeforeUnmount, reactive, ref, computed, watch } from "vue";
import { RGBtoHSB, HSBtoRGB, RGBtoHSL, HSLtoRGB } from "~/tools";

const presentColorRef = reactive({
  H: 360,
  S: 89,
  B: 43,
});
const presetRgb = computed(() => {
  return HSBtoRGB(presentColorRef.H, presentColorRef.S, presentColorRef.B);
});
const color = computed(() => {
  return new fabric.Color(
    `rgb(${presetRgb.value[0]},${presetRgb.value[1]},${presetRgb.value[2]})`
  ).toHex();
});
let resizeObserver, canvas;
onBeforeUnmount(() => {
  resizeObserver && resizeObserver.disconnect();
  canvas && canvas.dispose();
});


const size = 256;
let hRange = 360;
let rect = new fabric.Rect({
  top: 0,
  left: 0,
  width: size,
  height: size,
  strokeWidth: 0,
  fill: `hsl(${presentColorRef.H},100%,50%)`,
});
//调色版
let group = new fabric.Group(
  [
    rect,
    new fabric.Rect({
      top: 0,
      left: 0,
      width: size,
      height: size,
      strokeWidth: 0,
      fill: new fabric.Gradient({
        type: "linear",
        gradientUnits: "pencentage", // pixels or pencentage
        coords: { x1: 0, y1: 0, x2: size - 1, y2: 0 },
        colorStops: [
          { offset: 0, color: "white" },
          { offset: 1, color: "transparent" },
        ],
      }),
    }),
    new fabric.Rect({
      top: 0,
      left: 0,
      width: size,
      height: size,
      strokeWidth: 0,
      fill: new fabric.Gradient({
        type: "linear", // linear or radial
        gradientUnits: "pencentage", // pixels or pencentage
        coords: { x1: 0, y1: size - 1, x2: 0, y2: 0 },
        colorStops: [
          { offset: 0, color: "black" },
          { offset: 1, color: "transparent" },
        ],
      }),
    }),
  ],
  {
    hasControls: false,
    hasBorders: false,
    selectable: false,
    left: 11,
    top: 61,
    strokeWidth:0,
    moveCursor: "auto",
    hoverCursor: `auto`,
  }
);
group.clipPath = rect
let circle = new fabric.Circle({
  originX: "center",
  originY: "center",
  radius: 5,
  width: 10,
  height: 10,
  strokeWidth: 1,
  hasControls: false,
  hasBorders: false,
  selectable: true,
  perPixelTargetFind:false,
  evented: true,
  hoverCursor: `auto`,
  moveCursor: `auto`,
});
//渐变条
let gradient = new fabric.Rect({
  top: 61,
  left: 11 + size + 12,
  width: 19,
  height: size,
  hasControls: false,
  hasBorders: false,
  selectable: false,
  hoverCursor: "auto",
  strokeWidth: 0,
  fill: new fabric.Gradient({
    type: "linear", // linear or radial
    gradientUnits: "pixels", // pixels or pencentage
    coords: { x1: 0, y1: size - 1, x2: 0, y2: 0 },
    colorStops: [
      { offset: 0 / 6, color: "#f00" },
      { offset: 1 / 6, color: "#ff0" },
      { offset: 2 / 6, color: "#0f0" },
      { offset: 3 / 6, color: "#0ff" },
      { offset: 4 / 6, color: "#00f" },
      { offset: 5 / 6, color: "#f0f" },
      { offset: 6 / 6, color: "#f00" },
    ],
  }),
});
//滑块
let slider = new fabric.Group(
  [
    new fabric.Path("M -8 -4L 0 0 -8 4z", {
      originX: "right",
      originY: "center",
      fill: "#fff",
      left: 0,
      top: 0,
      shadow: new fabric.Shadow({
        color: "#000",
        offsetX: 0,
        offsetY: 0,
        blur: 4,
      }),
    }),
    new fabric.Path("M 8 -4L0 0 8 4z", {
      originX: "left",
      originY: "center",
      fill: "#fff",
      left: 18,
      top: 0,
      shadow: new fabric.Shadow({
        color: "#000",
        offsetX: 0,
        offsetY: 0,
        blur: 4,
      }),
    }),
  ],
  {
    width: gradient.width + 8 + 8,
    height: 8,
    originX: "center",
    originY: "center",
    lockMovementX:true,
    hasControls: false,
    hasBorders: false,
    strokeWidth:0,
    hoverCursor: "auto",
    moveCursor: "auto",
    perPixelTargetFind: false,
  }
);
let destination = new fabric.Rect({ // 当前
  left: 311,
  top: 112,
  width: 59,
  height: 33,
  fill: "#261717",
  hasControls: false,
  selectable: false,
  hasBorders: false,
  strokeWidth:0,
  moveCursor: "auto",
  hoverCursor: "auto",
});
let source = new fabric.Rect({ // 新的
  left: 311,
  top: 78,
  width: 59,
  height: 34,
  hasControls: false,
  selectable: false,
  hasBorders: false,
  strokeWidth:0,
  moveCursor: "auto",
  hoverCursor: "auto",
});
const confirm = () => {
  destination.set('fill',source.fill)
  canvas.renderAll()
}
const cancel = () => {
  console.log('cancel')
}
/*
let images = {bgUrl,btn1,btn2,btn3,btn4}
for(let k in images){
  images[k] = new Promise((resolve,reject)=>{
    fabric.Image.fromURL(images[k],(img)=>{
      resolve({[k]:img})
    })
  })
}
Promise.all(Object.values(images)).then((values)=>{
  for(let k in images){
    values.map(v=>{
      v[k]&&(images[k] = v[k])
    })
  }

  // let bgUrl = images.bgUrl
  // bgUrl.hasControls = false;
  // bgUrl.hasBorders = false;
  // bgUrl.selectable = false;
  // bgUrl.hoverCursor = "auto";
  // bgUrl.moveCursor = "auto";
  // canvas.add(bgUrl);
})
*/

onMounted(() => {
  canvas = new fabric.Canvas("gradient", {
    width: 300,
    height: 150,
    selection: false,
  });
  resizeObserver = new ResizeObserver(() => {
    let rect = document.querySelector(".canvasContainer").getBoundingClientRect();
    canvas.setDimensions({
      width: rect.width,
      height: rect.height,
    });
    canvas.renderAll();
  });
  resizeObserver.observe(document.querySelector(".canvasContainer"));
  canvas.add(group);
  let rgb = HSBtoRGB(presentColorRef.H, presentColorRef.S, presentColorRef.B);
  let isLight = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.5;
  circle.left = (group.width - 1) * presentColorRef.S / 100 + group.left + 0.5;
  circle.top = (group.height - 1) * (1 - presentColorRef.B/ 100) + group.top + 0.5;
  circle.fill = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  source.fill = circle.fill;
  destination.fill = circle.fill;
  destination.on("mousedown",()=>{
    let rgb = new fabric.Color(destination.fill).getSource()
    let hsb = RGBtoHSB(...rgb)
    console.log(hsb)
    presentColorRef.H = hsb[0]
    presentColorRef.S = hsb[1]
    presentColorRef.B = hsb[2]
  })
  circle.set("stroke", isLight ? "#000" : "#fff");
  group.on("mousedown", (opt) => {
    circle.left = opt.absolutePointer.x - 0.5
    circle.top = opt.absolutePointer.y - 0.5;
    if (circle.left < group.left + 0.5) {
      circle.left = group.left + 0.5;
    } else if (circle.left > group.left + group.width - 0.5) {
      circle.left = group.left + group.width - 0.5;
    }
    if (circle.top < group.top + 0.5) {
      circle.top = group.top + 0.5;
    } else if (circle.top > group.top + group.height - 0.5) {
      circle.top = group.top + group.height - 0.5;
    }
    canvas._setupCurrentTransform(opt, circle, true);
    presentColorRef.S = (circle.left - group.left - 0.5) / (group.width - 1) * 100;
    presentColorRef.B = (1 - (circle.top - group.top - 0.5) / (group.height - 1)) * 100
    // console.log(circle.left - group.left,circle.top - group.top,presentColorRef.S,presentColorRef.B)
  });
  circle.on('modified',()=>{
    circle.isMoving = false
  })
  circle.on("moving", (opt) => {
    circle.isMoving = true
    if (circle.left < group.left + 0.5) {
      circle.left = group.left + 0.5;
    } else if (circle.left > group.left + group.width - 0.5) {
      circle.left = group.left + group.width - 0.5;
    }
    if (circle.top < group.top + 0.5) {
      circle.top = group.top + 0.5;
    } else if (circle.top > group.top + group.height - 0.5) {
      circle.top = group.top + group.height - 0.5;
    };
    presentColorRef.S = (circle.left - group.left - 0.5) / (group.width - 1) * 100;
    presentColorRef.B = (1 - (circle.top - group.top - 0.5) / (group.height - 1)) * 100;
    // console.log(circle.left - group.left,circle.top - group.top,presentColorRef.S,presentColorRef.B)
  });
  canvas.add(circle);
  gradient.on("mousedown", (opt) => {
    presentColorRef.H = (1 - (opt.absolutePointer.y - gradient.top - 1) / (gradient.height - 1)) * hRange;
    slider.top = gradient.top + (1 - presentColorRef.H / hRange)*(gradient.height-1)+0.5;
    canvas.setActiveObject(slider);
    canvas._setupCurrentTransform(opt, slider, true);
    // console.log("gradient mousedown", presentColorRef.H, slider.top - gradient.top);
  });
  slider.left = gradient.left + gradient.width / 2;
  slider.top = gradient.top + (1 - presentColorRef.H / hRange)*(gradient.height-1)+0.5;
  slider.on('modified',()=>{
    slider.isMoving = false
  })
  slider.on("moving", (opt) => {
    slider.isMoving = true
    if (slider.top < gradient.top + 0.5) {
      slider.top = gradient.top + 0.5;
    } else if ( slider.top > gradient.top + gradient.height - 0.5) {
      slider.top = gradient.top + gradient.height - 0.5;
    }
    presentColorRef.H = (1 - (slider.top - 0.5 - gradient.top) / (gradient.height - 1)) * hRange
    // console.log("offsetY", slider.top - gradient.top, "H", Math.round(presentColorRef.H));
  });

  canvas.add(gradient);
  canvas.add(slider);
  // let styleU = {
  //   underline: true,
  //   fill: "red",
  // };
  // let str =
  //   "This lib is free for everyone.\nSome things are not.\nPeople behind FabricJS acknowledge that Black people have to fight for basic rights, against systemic racism, unequal opportunities and injustice across the 🌎.\nWe know this is wrong and we are 💔. 💪🏽💪🏾💪🏿!👚∞";
  // let string = "";
  // for (let i = 0; i < 1; i++) {
  //   string += str;
  // }

  canvas.add(
    HueText,
    SaturationText,
    BrightnessText,
    RedText,
    GreenText,
    BlueText,
    HexText,
    LightnessText,
    source,
    destination
  );




});

let HueText = new fabric.Textbox("360", {
  width: 32,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  fill: "#ddd",
  backgroundColor: "transparent",
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  lockMovementX: true,
  lockMovementY: true,
  textAlign: "left",
  // styles: {
  //   0: {
  //     21: {underline: true,fill: "red"},
  //     22: styleU,
  //     23: styleU,
  //     24: styleU,
  //     25: styleU,
  //     26: styleU,
  //     27: styleU,
  //     28: styleU,
  //   },
  //   1: {},
  // },
  left: 358,
  top: 202,
});
HueText.on("modified", () => {
  presentColorRef.H = Number(HueText.text);
});
let SaturationText = new fabric.Textbox("100", {
  width: 32,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  fill: "#ddd",
  backgroundColor: "transparent",
  lockMovementX: true,
  lockMovementY: true,
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  textAlign: "left",
  left: 358,
  top: 225,
});
SaturationText.on("modified", () => {
  presentColorRef.S = Number(SaturationText.text);
});
let BrightnessText = new fabric.Textbox("100", {
  width: 32,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  fill: "#ddd",
  backgroundColor: "transparent",
  lockMovementX: true,
  lockMovementY: true,
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  textAlign: "left",
  left: 358,
  top: 248,
});
BrightnessText.on("modified", () => {
  presentColorRef.B = Number(BrightnessText.text);
});
let RedText = new fabric.Textbox("255", {
  width: 32,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  fill: "#ddd",
  backgroundColor: "transparent",
  lockMovementX: true,
  lockMovementY: true,
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  textAlign: "left",
  left: 358,
  top: 275,
});
RedText.on("modified", () => {
  let rgb = HSBtoRGB(presentColorRef.H, presentColorRef.S, presentColorRef.B);
  rgb[0] = Number(RedText.text);
  let hsb = RGBtoHSB(rgb[0], rgb[1], rgb[2]);
  presentColorRef.H = hsb[0];
  presentColorRef.S = hsb[1];
  presentColorRef.B = hsb[2];
});
let GreenText = new fabric.Textbox("255", {
  width: 32,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  lockMovementX: true,
  lockMovementY: true,
  fill: "#ddd",
  backgroundColor: "transparent",
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  textAlign: "left",
  left: 358,
  top: 298,
});
GreenText.on("modified", () => {
  let rgb = HSBtoRGB(presentColorRef.H, presentColorRef.S, presentColorRef.B);
  rgb[1] = Number(GreenText.text);
  let hsb = RGBtoHSB(rgb[0], rgb[1], rgb[2]);
  presentColorRef.H = hsb[0];
  presentColorRef.S = hsb[1];
  presentColorRef.B = hsb[2];
});
let BlueText = new fabric.Textbox("255", {
  width: 32,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  lockMovementX: true,
  lockMovementY: true,
  fill: "#ddd",
  backgroundColor: "transparent",
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  textAlign: "left",
  left: 358,
  top: 321,
});
BlueText.on("modified", () => {
  let rgb = HSBtoRGB(presentColorRef.H, presentColorRef.S, presentColorRef.B);
  rgb[2] = Number(BlueText.text);
  let hsb = RGBtoHSB(rgb[0], rgb[1], rgb[2]);
  presentColorRef.H = hsb[0];
  presentColorRef.S = hsb[1];
  presentColorRef.B = hsb[2];
});
let HexText = new fabric.Textbox("FFFFFF", {
  width: 82,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  fill: "#ddd",
  backgroundColor: "transparent",
  lockMovementX: true,
  lockMovementY: true,
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  textAlign: "left",
  left: 325,
  top: 348,
});
HexText.on("modified", () => {
  let rgb = new fabric.Color("#" + HexText.text).getSource();
  let hsb = RGBtoHSB(rgb[0], rgb[1], rgb[2]);
  presentColorRef.H = hsb[0];
  presentColorRef.S = hsb[1];
  presentColorRef.B = hsb[2];
});
let LightnessText = new fabric.Textbox("50", {
  width: 41,
  height: 15,
  fontSize: 12,
  fontFamily: "Menlo,Consolas,Monaco",
  fill: "#ddd",
  backgroundColor: "transparent",
  lockMovementX: true,
  lockMovementY: true,
  selectable: true,
  hasBorders: true,
  hasControls: false,
  moveCursor: "auto",
  hoverCursor: "auto",
  textAlign: "left",
  left: 462,
  top: 202,
});
LightnessText.on("modified", () => {
  console.log(`hsl(${presentColorRef.H},${presentColorRef.S}%,${LightnessText.text})%`)
  let rgb = new fabric.Color(`hsl(${presentColorRef.H},${presentColorRef.S}%,${LightnessText.text}%)`).getSource();
  let hsb = RGBtoHSB(rgb[0], rgb[1], rgb[2]);
  presentColorRef.H = hsb[0];
  presentColorRef.S = hsb[1];
  presentColorRef.B = hsb[2];
  // presentColorRef.S = Number(SaturationText.text);
});
watch(
  () => presentColorRef.H,
  (v) => {
    HueText.text = v.toFixed();
    let color = new fabric.Color(`hsl(${Math.round(presentColorRef.H)},100%,50%)`);
    rect.set("fill", color.toRgb());
    let rgb = HSBtoRGB(presentColorRef.H, presentColorRef.S, presentColorRef.B);
    circle.set("fill", "rgb(" + rgb.join(",") + ")");
    source.set("fill", circle.fill);
    let isLight = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.5;
    circle.set("stroke", isLight ? "#000" : "#fff");
    if(!slider.isMoving){
      slider.top = gradient.top + (1 - presentColorRef.H / hRange)*(gradient.height-1)+0.5;
    }
  },
  { deep: true,immediate:true }
);
watch(
  [() => presentColorRef.S,()=>presentColorRef.B],
  ([S,B]) => {
    SaturationText.text = S.toFixed();
    BrightnessText.text = B.toFixed();
    let rgb = HSBtoRGB(presentColorRef.H, S, B);
    circle.set("fill", "rgb(" + rgb.join(",") + ")");
    source.set("fill", circle.fill);
    let isLight = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.5;
    circle.set("stroke", isLight ? "#000" : "#fff");
    if(!circle.isMoving){
      circle.left = (group.width - 1) * S / 100 + group.left + 0.5;
      circle.top = (group.height - 1) * (1 - B/100) + group.top + 0.5;
    }
  },
  { deep: true,immediate:true }
);
watch(
  presentColorRef,
  (presentColorRef) => {
    let rgb = HSBtoRGB(presentColorRef.H, presentColorRef.S, presentColorRef.B);
    RedText.text = rgb[0].toString();
    GreenText.text = rgb[1].toString();
    BlueText.text = rgb[2].toString();
    let color = new fabric.Color(`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`)
    HexText.text = color.toHex();
    let hsl = RGBtoHSL(...rgb)
    LightnessText.text = hsl[2].toFixed()
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="scss">
.canvasContainer {
  border-radius: 10px;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 0 0 1px #757575, 0 0 0 2px #010201;
  background-image: url(./colorPickerBg.png);
  width: 522px;
  height: 376px;
  position: absolute;
  left: 100px;
  top: 100px;
  .title {
    position: absolute;
    color: #f0f0f0;
    width: 100%;
    text-align: center;
    line-height: 30px;
    left: 0;
    top: 0;
  }
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
