<template>
  <div
    style="
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(15px);
    "
  >
    <canvas v-resize="resize" ref="paintCanvasRef" class="paintCanvas"></canvas>
    <div
      class="radar_hover_tip"
      ref="tipRef"
      style="
        display: none;
        position: absolute;
        border: 1px solid red;
        box-sizing: border-box;
        color: black;
      "
    ></div>
  </div>
</template>
<script lang="ts" setup>
import gsap from "gsap";
import { onMounted, watch, reactive, onBeforeUnmount, ref } from "vue";
let rates = [5, 10, 20, 50, 100, 200, 500, 1000, 2000];
function windowToCanvas(
  x: number,
  y: number,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  var box = canvas.getBoundingClientRect();
  return {
    x: ((x - box.left) / box.width) * canvas.width,
    y: ((y - box.top) / box.height) * canvas.height,
  };
}
import 雷达数据 from "./RHI.js";
function verticalFlowColor(v: number) {
  const colors = [
    "#0000ff",
    "#001cff",
    "#0038ff",
    "#0054ff",
    "#0070ff",
    "#008cff",
    "#00a8ff",
    "#00c4ff",
    "#00e0ff",
    "#78ffff",
    "#ffff50",
    "#ffe600",
    "#ffbf00",
    "#ff9800",
    "#ff7100",
    "#ff4a00",
    "#ff2300",
    "#fb0000",
    "#d40000",
    "#ad0000",
  ];
  return v <= -5.4
    ? colors[0]
    : v <= -4.8
    ? colors[1]
    : v <= -4.2
    ? colors[2]
    : v <= -3.6
    ? colors[3]
    : v <= -3
    ? colors[4]
    : v <= -2.4
    ? colors[5]
    : v <= -1.8
    ? colors[6]
    : v <= -1.2
    ? colors[7]
    : v <= -0.6
    ? colors[8]
    : v <= 0
    ? colors[9]
    : v <= 0.6
    ? colors[10]
    : v <= 1.2
    ? colors[11]
    : v <= 1.8
    ? colors[12]
    : v <= 2.4
    ? colors[13]
    : v <= 3
    ? colors[14]
    : v <= 3.6
    ? colors[15]
    : v <= 4.2
    ? colors[16]
    : v <= 4.8
    ? colors[17]
    : v <= 5.4
    ? colors[18]
    : colors[19];
}
function getSNRColor(val: number) {
  let colors = [
    "#0000ff",
    "#003fff",
    "#007eff",
    "#00bdff",
    "#14d474",
    "#a6dd00",
    "#ffe600",
    "#ff8c00",
    "#ff3200",
    "#d70000",
  ];
  let values = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  for (let i = 0; i < values.length - 2; i++) {
    if (values[i] <= val && val < values[i + 1]) {
      return colors[i];
    }
  }
  if (val >= 20) {
    return colors.slice(-1)[0];
  }
  return undefined;
}
function getPKColor(val: number) {
  let colors = [
    "#0000ff",
    "#003fff",
    "#007eff",
    "#00bdff",
    "#14d474",
    "#a6dd00",
    "#ffe600",
    "#ff8c00",
    "#ff3200",
    "#d70000",
  ];
  let values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (let i = 0; i < values.length - 2; i++) {
    if (values[i] <= val && val < values[i + 1]) {
      return colors[i];
    }
  }
  if (val >= 10) {
    return colors.slice(-1)[0];
  }
  return undefined;
}
function getPKQDColor(val: number) {
  let colors = [
    "#0000ff",
    "#001cff",
    "#0038ff",
    "#0054ff",
    "#0070ff",
    "#008cff",
    "#00a8ff",
    "#00c4ff",
    "#00e0ff",
    "#14d474",
    "#a6dd00",
    "#ffe600",
    "#ffbf00",
    "#ff9800",
    "#ff7100",
    "#ff4a00",
    "#ff2300",
    "#fb0000",
    "#d40000",
    "#ad0000",
  ];
  let values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  for (let i = 0; i < values.length - 2; i++) {
    if (values[i] <= val && val < values[i + 1]) {
      return colors[i];
    }
  }
  if (val >= 20) {
    return colors.slice(-1)[0];
  }
  return undefined;
}

function getFeatherColor(speed: number) {
  return speed <= 4
    ? "#0000ff"
    : speed <= 8
    ? "#002aff"
    : speed <= 12
    ? "#0054ff"
    : speed <= 16
    ? "#007eff"
    : speed <= 20
    ? "#00a8ff"
    : speed <= 24
    ? "#00d2ff"
    : speed <= 28
    ? "#14d474"
    : speed <= 32
    ? "#a6dd00"
    : speed <= 36
    ? "#ffe600"
    : speed <= 40
    ? "#ffb300"
    : speed <= 44
    ? "#ff8000"
    : speed <= 48
    ? "#ff4d00"
    : speed <= 52
    ? "#ff1a00"
    : speed <= 56
    ? "#e60000"
    : "#b30000";
}

async function dataChange() {
  let res = 雷达数据.data;
  let dataArr = processData(res);
  options.arr = dataArr;
  hover_func(undefined);
  radar_func();
  draw();
}
function mockData() {
  let library_num = 150;
  let radial_num = 90;
  let currentRadian = -2;
  for (let j = 0; j < radial_num; j++) {
    let array = [];
    for (let i = 0; i < library_num; i++) {
      if (Math.random() > 0.1) {
        array.push({
          color: "#" + Math.random().toString(16).substr(2, 6).toUpperCase() + "88",
        });
      } else {
        array.push(undefined);
      }
    }
    let α = currentRadian,
      β = currentRadian + 4;
    currentRadian += 4;
    options.arr.push({ α, β, array });
  }
}
function processData(res: any) {
  let dataArr = new Array<any>();
  for (let k in res.data) {
    if (k !== "radar_id" && k !== "radar_name") {
      let radial = res.data[k];
      let array = [undefined];
      let HorAngel = radial["HorAngel"];
      let Time = radial["Time"];
      let VerAngel = radial["VerAngel"];
      if (props.type == "ppi") {
        options.distance = 30 * Math.cos((VerAngel / 180) * Math.PI);
      }
      for (let r in radial) {
        if (typeof radial[r] === "object") {
          let item: any = {
            HorAngel,
            Time,
            VerAngel,
            Hei: radial[r].Hei,
            Speed: radial[r].Speed,
            PK: radial[r].PK,
            SNR: radial[r].SNR,
            PKQD: radial[r].PKQD,
          };
          if (props.type == "ppi") {
            if (props.PPIval === 3) {
              if (radial[r].Speed === 999) {
                item = undefined;
              } else {
                item.color = verticalFlowColor(radial[r].Speed);
                item.distance = r;
              }
            } else if (props.PPIval === 4) {
              item.color = getPKColor(radial[r].PK);
              item.distance = r;
            } else if (props.PPIval === 5) {
              item.color = getSNRColor(radial[r].SNR);
              item.distance = r;
            } else if (props.PPIval === 6) {
              item.color = getPKQDColor(radial[r].PKQD);
              item.distance = r;
            }
          } else if (props.type == "rhi") {
            if (props.RHIval === 1) {
              if (radial[r].Speed === 999) {
                item = undefined;
              } else {
                item.color = verticalFlowColor(radial[r].Speed);
                item.distance = r;
              }
            } else if (props.RHIval === 2) {
              item.color = getPKColor(radial[r].PK);
              item.distance = r;
            } else if (props.RHIval === 3) {
              item.color = getSNRColor(radial[r].SNR);
              item.distance = r;
            } else if (props.RHIval === 4) {
              item.color = getPKQDColor(radial[r].PKQD);
              item.distance = r;
            }
          }
          array.push(item);
        }
      }
      if (props.type == "ppi") {
        dataArr.push({ Angle: HorAngel - 90, array });
      } else if (props.type == "rhi") {
        dataArr.push({ Angle: VerAngel, array });
      }
      // if(dataArr.length==10)break;
    }
  }
  if (dataArr.length >= 2) {
    for (let i = 1; i < dataArr.length - 1; i++) {
      let Angle1 = dataArr[i - 1].Angle;
      let Angle2 = dataArr[i].Angle;
      let Angle3 = dataArr[i + 1].Angle;
      let α = (Angle1 + Angle2) / 2,
        β = (Angle2 + Angle3) / 2;
      if (props.type == "rhi") {
        α = -(Angle2 + Angle3) / 2;
        β = -(Angle1 + Angle2) / 2;
      }
      dataArr.splice(i, 1, {
        α,
        Angle: dataArr[i].Angle,
        β,
        array: dataArr[i].array,
      });
    }
    let Angle1 = dataArr[0].Angle;
    let Angle2 = dataArr[1].Angle;
    let α = Angle1 - (Angle2 - Angle1) / 2,
      β = Angle1 + (Angle2 - Angle1) / 2;
    if (props.type == "rhi") {
      α = -Angle1 - (Angle2 - Angle1) / 2;
      β = -Angle1 + (Angle2 - Angle1) / 2;
    }
    dataArr.splice(0, 1, { α, Angle: dataArr[0].Angle, β, array: dataArr[0].array });

    Angle1 = dataArr.slice(-2)[0].Angle;
    Angle2 = dataArr.slice(-1)[0].Angle;
    α = Angle2 - (Angle2 - Angle1) / 2;
    β = Angle2 + (Angle2 - Angle1) / 2;
    if (props.type == "rhi") {
      α = -Angle2 - (Angle2 - Angle1) / 2;
      β = -Angle2 + (Angle2 - Angle1) / 2;
    }
    dataArr.splice(dataArr.length - 1, 1, {
      α,
      Angle: dataArr.slice(-1)[0].Angle,
      β,
      array: dataArr.slice(-1)[0].array,
    });
  } else if (dataArr.length == 1) {
    let Angle = dataArr[0].Angle;
    let α = Angle - 0.5,
      β = Angle + 0.5;
    if (props.type == "rhi") {
      α = -Angle - 0.5;
      β = -Angle + 0.5;
    }
    dataArr.splice(0, 1, { α, Angle: dataArr[0].Angle, β, array: dataArr[0].array });
  }
  return dataArr;
}
const tipRef = ref(null);
function hoverItem_change(item: any) {
  let tip = (tipRef.value as unknown) as HTMLElement;
  if (item) {
    $(tip).show();
    if (item.Time) {
      $(tip).html(
        "记录时间：" +
          item.Time.substr(0, 4) +
          "-" +
          item.Time.substr(4, 2) +
          "-" +
          item.Time.substr(6, 2) +
          " " +
          item.Time.substr(8, 2) +
          ":" +
          item.Time.substr(10, 2) +
          ":" +
          item.Time.substr(12, 2) +
          "<br/>" +
          "&emsp;&emsp;距离：" +
          Number(item.distance).toFixed() +
          "米<br/>" +
          "水平距离：" +
          (item.distance * Math.cos((item.VerAngel / 180) * Math.PI)).toFixed() +
          "米<br/>" +
          "&emsp;&emsp;高度：" +
          (item.distance * Math.sin((item.VerAngel / 180) * Math.PI)).toFixed() +
          "米<br/>" +
          "&emsp;方位角：" +
          item.HorAngel.toFixed(1) +
          "度<br/>" +
          "&emsp;俯仰角：" +
          item.VerAngel.toFixed(1) +
          "度<br/>" +
          "径向速度：" +
          item.Speed.toFixed(2) +
          "米/秒<br/>" +
          "&emsp;&emsp;谱宽：" +
          item.PK.toFixed(2) +
          "米/秒<br/>" +
          "&emsp;信噪比：" +
          item.SNR.toFixed(2) +
          "dB<br/>" +
          "频谱强度：" +
          item.PKQD.toFixed() +
          "<br/>"
      );
    } else {
      $(tip).html(JSON.stringify(item));
    }

    // $(tip).css('background-color',item.color)
    if (options.mousemove) {
      let convert = options.mousemove;
      let rect = tip.getBoundingClientRect();
      $(tip).css({ top: convert.y + 20 + "px", left: convert.x + 20 + "px" });
    }
  } else {
    $(tip).hide();
  }
}
function radar_func() {
  let cvs_radar = options.radarCanvas;
  let ctx_radar = cvs_radar.getContext("2d") as CanvasRenderingContext2D;
  ctx_radar.clearRect(0, 0, cvs_radar.width, cvs_radar.height);
  let cvs_scan = options.scanCanvas;
  let ctx_scan = cvs_scan.getContext("2d") as CanvasRenderingContext2D;
  ctx_scan.clearRect(0, 0, cvs_scan.width, cvs_scan.height);
  for (let i = 0; i < options.arr.length; i++) {
    test_radar(
      options.arr[i].α,
      options.arr[i].β,
      options.arr[i].array,
      (i + 1) / options.arr.length
    );
    test_scan(options.arr[i].α, options.arr[i].β, options.arr[i].array);
  }
}
function test_radar(α: number, β: number, arr: Array<any>, rate: number) {
  if (!arr) return;
  let Ⳡ = ((α + β) / 2 / 180) * Math.PI;
  let θ = (((α - β) / 2) * Math.PI) / 180;
  let cvs = options.radarCanvas;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;

  ctx.save();
  ctx.translate(cvs.width / 2 + options.offsetX, cvs.height / 2 + options.offsetY);
  ctx.rotate(Ⳡ);

  // 清除上次绘制的像素
  {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.lineWidth = 0;
    ctx.strokeStyle = "#fff";
    ctx.arc(
      0,
      0,
      (arr.length - 1 + 0.5) * 2 ** options.level + 2 ** options.level,
      +θ,
      -θ,
      false
    );
    ctx.arc(0, 0, (0 + 0.5) * 2 ** options.level, -θ, +θ, true);
    ctx.closePath();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill();
    // ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }
  arr.map((v, k) => {
    if (v !== undefined) {
      let point1 = { x: (k + 0.5) * 2 ** options.level, y: 0 };
      let point2 = { x: (k + 0.5) * 2 ** options.level + 2 ** options.level, y: 0 };
      function getPt(pt: { x: number; y: number }, Ⲫ: number) {
        return {
          x: pt.x * Math.cos(Ⲫ) - pt.y * Math.sin(Ⲫ) + cvs.width / 2 + options.offsetX,
          y: pt.x * Math.sin(Ⲫ) + pt.y * Math.cos(Ⲫ) + cvs.height / 2 + options.offsetY,
        };
      }
      let pt1 = getPt(point1, Ⳡ + θ);
      let pt2 = getPt(point1, Ⳡ - θ);
      let pt3 = getPt(point2, Ⳡ + θ);
      let pt4 = getPt(point2, Ⳡ - θ);
      let a = Math.sqrt((pt1.x - pt2.x) ** 2 + (pt1.y - pt2.y) ** 2);
      let b = Math.sqrt((pt2.x - pt3.x) ** 2 + (pt2.y - pt3.y) ** 2);
      let c = Math.sqrt((pt3.x - pt1.x) ** 2 + (pt3.y - pt1.y) ** 2);
      let s = (a + b + c) / 2;
      let K = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      let R = (a * b * c) / (4 * K);
      let center = {
        x: (pt1.x + pt2.x + pt3.x + pt4.x) / 4,
        y: (pt1.y + pt2.y + pt3.y + pt4.y) / 4,
      };
      //四个点围成的扇形区域的外接圆和屏幕有重叠才需要绘制扇形区域
      if (
        -R <= center.x &&
        center.x < options.cvs.width + R &&
        -R <= center.y &&
        center.y < options.cvs.height + R
      ) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // ctx.moveTo((k + 0.5) * 2 ** options.level, (k + 0.5) * 2 ** options.level * Math.tan(-θ));
        // ctx.lineTo((k + 0.5) * 2 ** options.level + 2 ** options.level, ((k + 0.5) * 2 ** options.level + 2 ** options.level) * Math.tan(-θ));
        // ctx.lineTo((k + 0.5) * 2 ** options.level + 2 ** options.level, ((k + 0.5) * 2 ** options.level + 2 ** options.level) * Math.tan(θ));
        // ctx.lineTo((k + 0.5) * 2 ** options.level, (k + 0.5) * 2 ** options.level * Math.tan(θ));

        ctx.arc(0, 0, (k + 0.5) * 2 ** options.level + 2 ** options.level, +θ, -θ, false);
        ctx.arc(0, 0, (k + 0.5) * 2 ** options.level, -θ, +θ, true);

        ctx.closePath();
        // ctx.fillStyle=v.color.substr(0,7) + Math.floor(rate*255).toString(16).padStart(2,'0');
        // ctx.strokeStyle=v.color.substr(0,7) + Math.floor(rate*255).toString(16).padStart(2,'0');
        ctx.fillStyle = v.color;
        ctx.strokeStyle = v.color;
        ctx.fill();
        ctx.stroke();
      }
    }
  });
  ctx.restore();
}
function hover_func(convert: { x: number; y: number } | undefined) {
  let ctx_hover = options.hoverCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx_hover.clearRect(0, 0, options.hoverCanvas.width, options.hoverCanvas.height);
  if (convert) {
    let radian =
      ((-Math.atan2(
        convert.x - options.hoverCanvas.width / 2 - options.offsetX,
        convert.y - options.hoverCanvas.height / 2 - options.offsetY
      ) /
        Math.PI) *
        180 +
        360 +
        90) %
      360;
    let between = false;
    for (let i = options.arr.length - 1; i >= 0; i--) {
      let α =
        options.arr[i].α >= 0
          ? options.arr[i].α % 360
          : Math.ceil(-options.arr[i].α / 360) * 360 + options.arr[i].α;
      let β =
        options.arr[i].β >= 0
          ? options.arr[i].β % 360
          : Math.ceil(-options.arr[i].β / 360) * 360 + options.arr[i].β;
      if (
        (α < β && α < radian && radian < β) ||
        (α > β && ((α < radian && radian < 360) || (0 <= radian && radian < β)))
      ) {
        let distance = Math.sqrt(
          (convert.x - options.hoverCanvas.width / 2 - options.offsetX) ** 2 +
            (convert.y - options.hoverCanvas.height / 2 - options.offsetY) ** 2
        );
        test_hover(options.arr[i].α, options.arr[i].β, options.arr[i].array, distance);
        between = true;
        break;
      }
    }
    if (!between) {
      if (options.item_hover !== undefined) {
        options.item_hover = undefined;
        hoverItem_change(options.item_hover);
      }
    }
  } else {
    let tip = (tipRef.value as unknown) as HTMLElement;
    $(tip).hide();
  }
}
//鼠标移入色块效果
function test_hover(α: number, β: number, arr: Array<any>, distance: number) {
  if (!arr) return;
  let θ = (((α - β) / 2) * Math.PI) / 180;
  let cvs = options.hoverCanvas;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.save();

  ctx.translate(cvs.width / 2 + options.offsetX, cvs.height / 2 + options.offsetY);
  ctx.rotate(((α + β) / 2 / 180) * Math.PI);

  let k = Math.floor(distance / 2 ** options.level - 0.5);
  if (arr && k >= 0 && k < arr.length) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      (arr.length - 1 + 0.5) * 2 ** options.level + 2 ** options.level,
      +θ,
      -θ,
      false
    );
    ctx.arc(0, 0, (1 + 0.5) * 2 ** options.level, -θ, +θ, true);
    ctx.closePath();
    ctx.stroke();

    if (arr[k] !== undefined) {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.0;
      ctx.beginPath();

      // ctx.moveTo((k+0.5)*2 ** options.level,((k+0.5)*2 ** options.level)*Math.tan(-θ));
      // ctx.lineTo((k+0.5)*2 ** options.level+2 ** options.level,((k+0.5)*2 ** options.level+2 ** options.level)*Math.tan(-θ));
      // ctx.lineTo((k+0.5)*2 ** options.level+2 ** options.level,((k+0.5)*2 ** options.level+2 ** options.level)*Math.tan(θ));
      // ctx.lineTo((k+0.5)*2 ** options.level,((k+0.5)*2 ** options.level)*Math.tan(θ));

      ctx.arc(0, 0, (k + 0.5) * 2 ** options.level + 2 ** options.level, +θ, -θ, false);
      ctx.arc(0, 0, (k + 0.5) * 2 ** options.level, -θ, +θ, true);
      ctx.closePath();
      ctx.stroke();
    }
  }
  if (options.item_hover !== arr[k]) {
    options.item_hover = arr[k];
    hoverItem_change(options.item_hover);
  }
  ctx.restore();
}
//绘制扫描的当前径向范围
function test_scan(α: number, β: number, arr: Array<any>) {
  if (!arr) return;
  let θ = (((α - β) / 2) * Math.PI) / 180;
  let cvs = options.scanCanvas;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.save();

  ctx.translate(cvs.width / 2 + options.offsetX, cvs.height / 2 + options.offsetY);
  ctx.rotate(((α + β) / 2 / 180) * Math.PI);

  if (arr) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      (arr.length - 1 + 0.5) * 2 ** options.level + 2 ** options.level,
      +θ,
      -θ,
      false
    );
    ctx.arc(0, 0, (1 + 0.5) * 2 ** options.level, -θ, +θ, true);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}
function draw() {
  let ctx = options.cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, options.cvs.width, options.cvs.height);

  ctx.drawImage(options.radarCanvas as HTMLCanvasElement, 0, 0);
  ctx.drawImage(options.scanCanvas as HTMLCanvasElement, 0, 0);
  ctx.drawImage(options.hoverCanvas as HTMLCanvasElement, 0, 0);

  ctx.save();
  ctx.translate(
    options.cvs.width / 2 + options.offsetX,
    options.cvs.height / 2 + options.offsetY
  );
  ctx.beginPath();
  ctx.rotate(Math.PI / 4);
  ctx.moveTo(-190.5 * 2 ** options.level, 0);
  ctx.lineTo(190.5 * 2 ** options.level, 0);
  ctx.moveTo(0, -190.5 * 2 ** options.level);
  ctx.lineTo(0, 190.5 * 2 ** options.level);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(
    options.cvs.width / 2 + options.offsetX,
    options.cvs.height / 2 + options.offsetY
  );
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#00000088";
  ctx.beginPath();
  ctx.moveTo(-190.5 * 2 ** options.level, 0);
  ctx.lineTo(190.5 * 2 ** options.level, 0);
  ctx.moveTo(0, -190.5 * 2 ** options.level);
  ctx.lineTo(0, 190.5 * 2 ** options.level);
  ctx.stroke();

  // for(let i=1;i<=189.5;i++){
  //   ctx.beginPath();
  //   ctx.arc(0,0,2 ** options.level*i,0,Math.PI*2);
  //   ctx.closePath();
  //   ctx.stroke();
  // }
  let len: number = 1;
  let rate: number = 1;
  for (let i = 0; i < rates.length; i++) {
    len = (rates[i] / options.distance) * 2 ** options.level;
    if (len > 50) {
      rate = rates[i];
      break;
    }
  }
  //距离环
  // for (let i = 1; i <= Math.floor((190.5 * options.distance) / rate); i++) {
  //   ctx.beginPath();
  //   ctx.arc(0, 0, len * i, 0, Math.PI * 2);
  //   ctx.closePath();
  //   ctx.fillStyle = "black";
  //   ctx.fillText((rate * i).toString(), len * i, 0);
  //   ctx.fillText((rate * i).toString(), 0, -len * i);
  //   ctx.fillText((rate * i).toString(), -len * i, 0);
  //   ctx.fillText((rate * i).toString(), 0, len * i);
  //   ctx.setLineDash([3, 3]);
  //   ctx.stroke();
  // }

  let distanceRunway = 600;
  let distanceWidth = 45;

  ctx.beginPath();
  ctx.moveTo((2 ** options.level * (distanceRunway - distanceWidth / 2)) / 30, 0);
  ctx.lineTo(
    (2 ** options.level * (distanceRunway - distanceWidth / 2)) / 30,
    -(options.cvs.height / 2 + options.offsetY)
  );
  ctx.setLineDash([3, 2, 8, 3]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo((2 ** options.level * distanceRunway) / 30, 0);
  ctx.lineTo(
    (2 ** options.level * distanceRunway) / 30,
    -(options.cvs.height / 2 + options.offsetY)
  );
  ctx.setLineDash([1, 5]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo((2 ** options.level * (distanceRunway + distanceWidth / 2)) / 30, 0);
  ctx.lineTo(
    (2 ** options.level * (distanceRunway + distanceWidth / 2)) / 30,
    -(options.cvs.height / 2 + options.offsetY)
  );
  ctx.setLineDash([2, 3, 8, 3]);
  ctx.stroke();
  ctx.restore();
}
const props = withDefaults(
  defineProps<{ type?: string; PPIval?: number; RHIval?: number }>(),
  {
    type: "rhi", // rhi | ppi
    PPIval: 3, // 3|4|5|6
    RHIval: 1, // 1|2|3|4
  }
);
watch(
  () => props.PPIval,
  () => {
    dataChange();
  }
);
const options = reactive({
  arr: new Array<any>(),
  cvs: document.createElement("canvas"),
  radarCanvas: document.createElement("canvas"),
  hoverCanvas: document.createElement("canvas"),
  scanCanvas: document.createElement("canvas"),
  offsetX: 0,
  offsetY: 0,
  mousedown: false,
  pos: { x: 0, y: 0 },
  rate: { x: 0, y: 0 },
  level: 2,
  targetLevel: 2,
  distance: 30,
  item_hover: undefined,
  mousemove: { x: 0, y: 0 },
});
const paintCanvasRef = ref(null);
function mousewheelFunc(e: any) {
  if (e.deltaY < 0) {
    options.targetLevel += 0.05;
  } else {
    options.targetLevel -= 0.05;
  }
  if (options.targetLevel < 0) {
    options.targetLevel = 0;
  } else if (options.targetLevel > 10) {
    options.targetLevel = 10;
  }
  gsap.killTweensOf(options);
  gsap.to(options, {
    level: options.targetLevel,
    duration: 2,
    onUpdate: () => {
      options.offsetX =
        options.mousemove.x -
        options.cvs.width / 2 -
        (options.cvs.width / 2) * 2 ** options.level * options.rate.x;
      options.offsetY =
        options.mousemove.y -
        options.cvs.height / 2 -
        (options.cvs.height / 2) * 2 ** options.level * options.rate.y;

      radar_func();
      hover_func(options.mousemove);

      draw();
    },
  });
}
function mousemoveFunc(e: any) {
  let convert = windowToCanvas(e.clientX, e.clientY, options.cvs as HTMLCanvasElement);
  options.mousemove = convert;
  let tip = (tipRef.value as unknown) as HTMLElement;
  $(tip).css({ left: convert.x + 20 + "px", top: convert.y + 20 + "px" });
  if (options.mousedown) {
    // options.offsetX += e.movementX;
    // options.offsetY += e.movementY;

    options.rate.x =
      (options.mousemove.x - options.offsetX - options.cvs.width / 2) /
      ((options.cvs.width / 2) * 2 ** options.level);
    options.rate.y =
      (options.mousemove.y - options.offsetY - options.cvs.height / 2) /
      ((options.cvs.height / 2) * 2 ** options.level);
    options.offsetX =
      options.mousemove.x -
      options.cvs.width / 2 -
      (options.cvs.width / 2) * 2 ** options.level * options.rate.x;
    options.offsetY =
      options.mousemove.y -
      options.cvs.height / 2 -
      (options.cvs.height / 2) * 2 ** options.level * options.rate.y;
    radar_func();
  }
  hover_func(convert);
  draw();
  e.stopPropagation();
  e.preventDefault();
}
function mousedownFunc(e: any) {
  options.mousedown = true;
}
function mouseupFunc(e: any) {
  options.mousedown = false;
}
onMounted(() => {
  // mockData();

  options.arr = processData(雷达数据);

  // let currentRadian = 0;
  // let radial_num = 10;
  // let library_num = 150;
  // let func = () => {
  //   let array = [];
  //   for (let i = 0; i < library_num; i++) {
  //     if (Math.random() > 0.1) {
  //       array.push({
  //         color: "#" + Math.random().toString(16).substr(2, 6).toUpperCase() + "ff",
  //       });
  //     } else {
  //       array.push(undefined);
  //     }
  //   }
  //   let α = currentRadian,
  //     β = currentRadian + 4;
  //   currentRadian += 4;
  //   options.arr.push({ α, β, array });
  //   if (options.arr.length > radial_num) options.arr.shift();
  //   radar_func();
  //   if (options.mousemove) {
  //     let convert = options.mousemove;
  //     hover_func(convert);
  //   }
  //   draw();
  //   // clearInterval(timer);
  // };
  // let timer = setInterval(func, 100);

  options.cvs = (paintCanvasRef.value as unknown) as HTMLCanvasElement;
  document.addEventListener("mousemove", mousemoveFunc, { passive: false });
  options.cvs.addEventListener("mousewheel", mousewheelFunc, { passive: false });
  options.cvs.addEventListener("mousedown", mousedownFunc, { passive: false });
  document.addEventListener("mouseup", mouseupFunc, { passive: false });
});
const resize = () => {
  options.cvs.width = options.cvs.getBoundingClientRect().width;
  options.cvs.height = options.cvs.getBoundingClientRect().height;
  if (options.cvs.width == 0 || options.cvs.height == 0) {
    return;
  }
  options.offsetX = 0;
  options.offsetY = 0;
  options.radarCanvas.width = options.cvs.width;
  options.radarCanvas.height = options.cvs.height;
  options.hoverCanvas.width = options.cvs.width;
  options.hoverCanvas.height = options.cvs.height;
  options.scanCanvas.width = options.cvs.width;
  options.scanCanvas.height = options.cvs.height;

  radar_func();
  draw();
};
onBeforeUnmount(() => {
  document.removeEventListener("mousemove", mousemoveFunc);
  options.cvs.removeEventListener("mousewheel", mousewheelFunc);
  options.cvs.removeEventListener("mousedown", mousedownFunc);
  document.removeEventListener("mouseup", mouseupFunc);
});
</script>
<style>
.paintCanvas {
  position: absolute;
  /* left:100px;
  top:100px; */
  width: 100%;
  height: 100%;
  /* border:1px solid red; */
  box-sizing: border-box;
  /* background: #2b2b2b; */
}
.radar_hover_tip {
  white-space: noWrap;
  background: lightgrey;
}
</style>
