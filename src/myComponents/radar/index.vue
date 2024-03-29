<template>
  <div class="radarContainer">
    <canvas v-resize="resize" ref="paintCanvasRef" class="paintCanvas"></canvas>
    <div class="radar_hover_tip" ref="tipRef"></div>
  </div>
</template>
<script lang="ts" setup name="radar">
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
const tipRef = ref((null as unknown) as HTMLDivElement);
function hoverItem_change(item: any) {
  if (item) {
    $(tipRef.value).show();
    if (item.Time) {
      $(tipRef.value).html(
        "序号:" +
          item.j +
          "<br/>" +
          "进度:" +
          item.percent +
          "<br/>" +
          "库数量:" +
          item.BinNum +
          "<br/>" +
          "ScanNo:" +
          item.ScanNo +
          "<br/>" +
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
          Number(item.Distance).toFixed() +
          "米<br/>" +
          "水平距离：" +
          (item.Distance * Math.cos((item.VerAngel / 180) * Math.PI)).toFixed() +
          "米<br/>" +
          "&emsp;&emsp;高度：" +
          (item.Distance * Math.sin((item.VerAngel / 180) * Math.PI)).toFixed() +
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
      $(tipRef.value).html(JSON.stringify(item));
    }
    $(tipRef.value).css({
      top: options.pos.y + "px",
      left: options.pos.x + "px",
    });
  } else {
    $(tipRef.value).hide();
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
    test_radar(options.arr[i].α, options.arr[i].β, options.arr[i].array);
    test_scan(options.arr[i].α, options.arr[i].β, options.arr[i].array);
  }
}
function test_radar(α: number, β: number, arr: Array<any>) {
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
    let min = arr[0].Distance / options.distance - 0.5;
    let max = arr[arr.length - 1].Distance / options.distance - 0.5;
    ctx.arc(0, 0, max * 2 ** options.level + 2 ** options.level, +θ, -θ, false);
    ctx.arc(0, 0, min * 2 ** options.level, -θ, +θ, true);
    ctx.closePath();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill();
    // ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  }
  for (let i = 0; i < arr.length; i++) {
    let v = arr[i];
    if (
      v !== undefined &&
      v.color &&
      options.distanceMin <= v.Distance &&
      v.Distance <= options.distanceMax
    ) {
      let k = v.Distance / options.distance - 0.5;
      let point1 = { x: k * 2 ** options.level, y: 0 };
      let point2 = { x: (k + 1) * 2 ** options.level, y: 0 };
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
      //注意当k==0时,pt1和pt2会重合，下面abc的计算只能用pt2,pt3,pt4
      let a = Math.sqrt((pt2.x - pt3.x) ** 2 + (pt2.y - pt3.y) ** 2);
      let b = Math.sqrt((pt2.x - pt4.x) ** 2 + (pt2.y - pt4.y) ** 2);
      let c = Math.sqrt((pt3.x - pt4.x) ** 2 + (pt3.y - pt4.y) ** 2);
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
        // ctx.lineWidth = 1;

        // ctx.moveTo(k * 2 ** options.level, k * 2 ** options.level * Math.tan(-θ));
        // ctx.lineTo((k+1) * 2 ** options.level, (k+1) * 2 ** options.level * Math.tan(-θ));
        // ctx.lineTo((k+1) * 2 ** options.level, (k+1) * 2 ** options.level * Math.tan(θ));
        // ctx.lineTo(k * 2 ** options.level, k * 2 ** options.level * Math.tan(θ));

        ctx.arc(0, 0, k * 2 ** options.level, -θ, +θ, true);
        ctx.arc(0, 0, (k + 1) * 2 ** options.level, +θ, -θ, false);

        ctx.closePath();
        ctx.fillStyle = v.color;
        ctx.strokeStyle = v.color;
        ctx.fill();
        ctx.stroke();
      }
    }
  }
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
    $(tipRef.value).hide();
  }
}
//鼠标移入色块效果
function test_hover(α: number, β: number, arr: Array<any>, distance: number) {
  if (!arr.length) return;
  let θ = (((α - β) / 2) * Math.PI) / 180;
  let cvs = options.hoverCanvas;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.save();

  ctx.translate(cvs.width / 2 + options.offsetX, cvs.height / 2 + options.offsetY);
  ctx.rotate(((α + β) / 2 / 180) * Math.PI);
  let index = Math.ceil(
    ((distance / 2 ** options.level) * options.distance - arr[0].Distance) /
      options.distance -
      0.5
  );
  if (
    arr &&
    index >= 0 &&
    index < arr.length &&
    options.distanceMin <= arr[index].Distance &&
    arr[index].Distance <= options.distanceMax
  ) {
    let k = arr[index].Distance / options.distance - 0.5;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    let min = arr[0].Distance / options.distance - 0.5;
    let max = arr[arr.length - 1].Distance / options.distance - 0.5;
    ctx.arc(0, 0, max * 2 ** options.level + 2 ** options.level, +θ, -θ, false);
    ctx.arc(0, 0, min * 2 ** options.level, -θ, +θ, true);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.0;
    ctx.beginPath();

    // ctx.moveTo(k*2 ** options.level,k*2 ** options.level*Math.tan(-θ));
    // ctx.lineTo((k+1)*2 ** options.level,(k+1)*2 ** options.level*Math.tan(-θ));
    // ctx.lineTo((k+1)*2 ** options.level,(k+1)*2 ** options.level*Math.tan(θ));
    // ctx.lineTo(k*2 ** options.level,k*2 ** options.level*Math.tan(θ));

    ctx.arc(0, 0, k * 2 ** options.level, -θ, +θ, true);
    ctx.arc(0, 0, (k + 1) * 2 ** options.level, +θ, -θ, false);
    ctx.closePath();
    ctx.stroke();
  }
  if (options.item_hover !== arr[index]) {
    options.item_hover = arr[index];
    hoverItem_change(options.item_hover);
  }
  if (
    arr[index] &&
    (arr[index].Distance < options.distanceMin ||
      arr[index].Distance > options.distanceMax)
  ) {
    options.item_hover = undefined;
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
  if (arr.length) {
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 2;
    ctx.beginPath();
    let min = arr[0].Distance / options.distance - 0.5;
    let max = arr[arr.length - 1].Distance / options.distance - 0.5;
    ctx.arc(0, 0, max * 2 ** options.level + 2 ** options.level, +θ, -θ, false);
    ctx.arc(0, 0, min * 2 ** options.level, -θ, +θ, true);
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

  //绘制X
  // ctx.save();
  // ctx.translate(
  //   options.cvs.width / 2 + options.offsetX,
  //   options.cvs.height / 2 + options.offsetY
  // );
  // ctx.beginPath();
  // ctx.rotate(Math.PI / 4);
  // ctx.moveTo((-options.range / options.distance) * 2 ** options.level, 0);
  // ctx.lineTo((options.range / options.distance) * 2 ** options.level, 0);
  // ctx.moveTo(0, (-options.range / options.distance) * 2 ** options.level);
  // ctx.lineTo(0, (options.range / options.distance) * 2 ** options.level);
  // ctx.stroke();
  // ctx.restore();

  //小白点
  // ctx.beginPath();
  // ctx.arc(options.pos.x, options.pos.y, 2, 0, Math.PI * 2);
  // ctx.fillStyle = "#fff";
  // ctx.strokeStyle = "#000";
  // ctx.stroke();
  // ctx.fill();

  //绘制十
  // ctx.save();
  // ctx.translate(
  //   options.cvs.width / 2 + options.offsetX,
  //   options.cvs.height / 2 + options.offsetY
  // );
  // ctx.strokeStyle = "#000";
  // ctx.fillStyle = "#00000088";
  // ctx.beginPath();
  // ctx.moveTo(0, 0);
  // ctx.lineTo((options.range / options.distance) * 2 ** options.level, 0);
  // ctx.moveTo(0, (-options.range / options.distance) * 2 ** options.level);
  // ctx.lineTo(0, 0);
  // ctx.stroke();
  // ctx.restore();

  ctx.save();
  ctx.translate(
    options.cvs.width / 2 + options.offsetX,
    options.cvs.height / 2 + options.offsetY
  );

  ctx.strokeStyle = "#00000088";
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
    if (len > 100) {
      rate = rates[i];
      break;
    }
  }

  //距离环
  let center = {
    x: options.cvs.width / 2 + options.offsetX,
    y: options.cvs.height / 2 + options.offsetY,
  };
  let middle = { x: options.cvs.width / 2, y: options.cvs.height / 2 };
  let distance = Math.sqrt((middle.x - center.x) ** 2 + (middle.y - center.y) ** 2);
  let radius = Math.sqrt(options.cvs.width ** 2 + options.cvs.height ** 2) / 2;
  for (let i = 1; i <= Math.floor(options.range / rate); i++) {
    let r = len * (i - 1);
    let R = len * i;
    if (distance > R - 2 * radius && distance < R + 2 * radius) {
      ctx.beginPath();
      ctx.rotate((options.deg1 / 180) * Math.PI);
      ctx.moveTo(r, 0);
      ctx.rotate(-(options.deg1 / 180) * Math.PI);
      ctx.arc(0, 0, R, (options.deg1 / 180) * Math.PI, (options.deg2 / 180) * Math.PI);
      ctx.rotate((options.deg2 / 180) * Math.PI);
      ctx.lineTo(r, 0);
      ctx.rotate(-(options.deg2 / 180) * Math.PI);
      ctx.strokeStyle = "#00000088";
      ctx.setLineDash([3, 3]);
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.fillText((rate * i).toString(), len * i, 0); //+x
      // ctx.fillText((rate * i).toString(), -len * i, 0);//-x
      // ctx.fillText((rate * i).toString(), 0, -len * i); //+y
      // ctx.fillText((rate * i).toString(), 0, len * i);//-y
    }
  }

  //绘制跑道门
  ctx.strokeStyle = "#000";
  let distanceRunway = 500;
  let distanceWidth = 45;
  ctx.beginPath();
  ctx.moveTo(
    (2 ** options.level * (distanceRunway - distanceWidth / 2)) / options.distance,
    0
  );
  ctx.lineTo(
    (2 ** options.level * (distanceRunway - distanceWidth / 2)) / options.distance,
    -(options.cvs.height / 2 + options.offsetY)
  );
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 2, 8, 2]);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo((2 ** options.level * distanceRunway) / options.distance, 0);
  ctx.lineTo(
    (2 ** options.level * distanceRunway) / options.distance,
    -(options.cvs.height / 2 + options.offsetY)
  );
  ctx.setLineDash([2, 5]);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(
    (2 ** options.level * (distanceRunway + distanceWidth / 2)) / options.distance,
    0
  );
  ctx.lineTo(
    (2 ** options.level * (distanceRunway + distanceWidth / 2)) / options.distance,
    -(options.cvs.height / 2 + options.offsetY)
  );
  ctx.setLineDash([4, 2, 8, 2]);
  ctx.stroke();
  ctx.restore();
}
const props = withDefaults(defineProps<{ type?: string }>(), {
  type: "Speed",
});
import { useBus } from "../bus";
const bus = useBus();
let List: any = [];
watch(
  () => props.type,
  () => {
    options.arr.length = 0;
  }
);
watch(
  () => bus.wsData,
  (wsData: any) => {
    if (wsData.data) {
      let { BeamEl: deg, RadVrData: list, BeamAz, BeamEl, ScanNo } = wsData.data;
      // console.log(ScanNo, BeamEl, wsData.data.j);
      let radial_num = 60;
      let array = [];
      for (let i = 0; i < list.length; i++) {
        //显示径向速度
        let item: any = {
          HorAngel: BeamAz,
          Time: "20220326144106",
          VerAngel: BeamEl,
          Distance: list[i].距离,
          Speed: list[i].径向速度,
          PK: list[i].谱宽,
          SNR: list[i].信噪比,
          PKQD: list[i].频谱强度,
          ScanNo: ScanNo,
          j: wsData.data.j + 1 + "/" + wsData.data.n,
          percent: ((wsData.data.j + 1) / wsData.data.n).toFixed(2) + "%",
          BinNum: wsData.data.BinNum,
        };
        if (props.type == "Speed") {
          item.color =
            Math.abs(list[i].径向速度) !== 999
              ? verticalFlowColor(list[i].径向速度)
              : undefined;
        } else if (props.type == "PK") {
          item.color = getPKColor(list[i].谱宽);
        } else if (props.type == "SNR") {
          item.color = getSNRColor(list[i].信噪比);
        } else if (props.type == "PKQD") {
          item.color = getPKQDColor(Math.log10(list[i].频谱强度));
        }
        array.push(item);
      }
      List.push({ Angle: -deg, array });
      while (List.length > radial_num) List.shift();
      if (List.length >= 2) {
        //定义始末两条径向内的径向位置
        for (let i = 1; i < List.length - 1; i++) {
          let Angle1 = List[i - 1].Angle;
          let Angle2 = List[i].Angle;
          let Angle3 = List[i + 1].Angle;
          let α = Math.min((Angle1 + Angle2) / 2, (Angle2 + Angle3) / 2);
          let β = Math.max((Angle1 + Angle2) / 2, (Angle2 + Angle3) / 2);
          List.splice(i, 1, {
            α,
            Angle: List[i].Angle,
            β,
            array: List[i].array,
          });
        }
        //定义第一条径向位置
        let Angle1 = List[0].Angle;
        let Angle2 = List[1].Angle;
        let α = Math.min(Angle1 - (Angle2 - Angle1) / 2, Angle1 + (Angle2 - Angle1) / 2);
        let β = Math.max(Angle1 - (Angle2 - Angle1) / 2, Angle1 + (Angle2 - Angle1) / 2);
        List.splice(0, 1, { α, Angle: List[0].Angle, β, array: List[0].array });
        //定义最后一条径向位置
        Angle1 = List.slice(-2)[0].Angle;
        Angle2 = List.slice(-1)[0].Angle;
        α = Math.min(Angle2 - (Angle2 - Angle1) / 2, Angle2 + (Angle2 - Angle1) / 2);
        β = Math.max(Angle2 - (Angle2 - Angle1) / 2, Angle2 + (Angle2 - Angle1) / 2);
        List.splice(List.length - 1, 1, {
          α,
          Angle: List.slice(-1)[0].Angle,
          β,
          array: List.slice(-1)[0].array,
        });
      } else if (List.length == 1) {
        //定义只有一条径向的位置
        let Angle = List[0].Angle;
        let α = Angle - 0.5;
        let β = Angle + 0.5;
        List.splice(0, 1, { α, Angle: List[0].Angle, β, array: List[0].array });
      }
      options.arr = List;
      radar_func();
      if (options.pos) {
        hover_func(options.pos);
      }
      draw();
    }
  }
);
const options = reactive({
  arr: new Array<any>(),
  cvs: document.createElement("canvas"),
  radarCanvas: document.createElement("canvas"),
  hoverCanvas: document.createElement("canvas"),
  scanCanvas: document.createElement("canvas"),
  offsetX: -650,
  offsetY: 150,
  mousedown: false,
  pos: { x: 0, y: 0, targetX: 0, targetY: 0 }, //记录canvas中图形的真实位置
  rate: { x: 0, y: 0 },
  level: 4,
  distanceMin: 400,
  distanceMax: 600,
  range: 52 * 12 + 43 - 6, //52 * 12 | 62 * 15
  deg1: -20,
  deg2: 0,
  targetLevel: 4,
  distance: 12, // 12 | 15  //一个像素代表一个库长,一个库长代表distance米
  item_hover: undefined,
  mousemove: { x: 0, y: 0 }, //记录实时鼠标位置
  duration: 0,
});
const paintCanvasRef = ref(null);
function mousewheelFunc(e: any) {
  let convert = windowToCanvas(e.clientX, e.clientY, options.cvs as HTMLCanvasElement);
  options.pos = { ...convert, targetX: convert.x, targetY: convert.y };
  options.rate.x =
    (options.pos.x - options.offsetX - options.cvs.width / 2) /
    ((options.cvs.width / 2) * 2 ** options.level);
  options.rate.y =
    (options.pos.y - options.offsetY - options.cvs.height / 2) /
    ((options.cvs.height / 2) * 2 ** options.level);
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
    duration: options.duration,
    onUpdate: () => {
      options.offsetX =
        options.pos.x -
        options.cvs.width / 2 -
        (options.cvs.width / 2) * 2 ** options.level * options.rate.x;
      options.offsetY =
        options.pos.y -
        options.cvs.height / 2 -
        (options.cvs.height / 2) * 2 ** options.level * options.rate.y;

      radar_func();
      hover_func(options.pos);

      draw();
    },
  });
  e.preventDefault();
}
let touchPosition = { clientX: 0, clientY: 0 };
function mousemoveFunc(evt: MouseEvent | TouchEvent) {
  if (evt instanceof MouseEvent) {
    let convert = windowToCanvas(
      evt.clientX,
      evt.clientY,
      options.cvs as HTMLCanvasElement
    );
    options.mousemove = convert;
    if (options.mousedown) {
      options.pos.targetX += evt.movementX;
      options.pos.targetY += evt.movementY;
      gsap.killTweensOf(options.pos);
      gsap.to(options.pos, {
        x: options.pos.targetX,
        y: options.pos.targetY,
        duration: options.duration,
        onUpdate: () => {
          $(tipRef.value).css({
            top: options.pos.y + "px",
            left: options.pos.x + "px",
          });
          options.offsetX =
            options.pos.x -
            options.cvs.width / 2 -
            (options.cvs.width / 2) * 2 ** options.level * options.rate.x;
          options.offsetY =
            options.pos.y -
            options.cvs.height / 2 -
            (options.cvs.height / 2) * 2 ** options.level * options.rate.y;
          radar_func();
          hover_func(options.pos);
          draw();
          if (
            options.pos.x < 0 ||
            options.pos.x > options.cvs.width ||
            options.pos.y < 0 ||
            options.pos.y > options.cvs.height
          ) {
            $(tipRef.value).css({ opacity: 0 });
          } else {
            $(tipRef.value).css({ opacity: 1 });
          }
        },
      });
    }
  } else if (evt instanceof TouchEvent) {
    let convert = windowToCanvas(
      evt.touches[0].clientX,
      evt.touches[0].clientY,
      options.cvs as HTMLCanvasElement
    );
    options.mousemove = convert;
    if (options.mousedown) {
      options.pos.targetX += evt.touches[0].clientX - touchPosition.clientX;
      options.pos.targetY += evt.touches[0].clientY - touchPosition.clientY;
      touchPosition = {
        clientX: evt.touches[0].clientX,
        clientY: evt.touches[0].clientY,
      };
      gsap.killTweensOf(options.pos);
      gsap.to(options.pos, {
        x: options.pos.targetX,
        y: options.pos.targetY,
        duration: options.duration,
        onUpdate: () => {
          $(tipRef.value).css({
            top: options.pos.y + "px",
            left: options.pos.x + "px",
          });
          options.offsetX =
            options.pos.x -
            options.cvs.width / 2 -
            (options.cvs.width / 2) * 2 ** options.level * options.rate.x;
          options.offsetY =
            options.pos.y -
            options.cvs.height / 2 -
            (options.cvs.height / 2) * 2 ** options.level * options.rate.y;
          radar_func();
          hover_func(options.pos);
          draw();
        },
      });
    }
  }
  evt.stopPropagation();
  evt.preventDefault();
}
function mousedownFunc(evt: MouseEvent | TouchEvent) {
  if (evt instanceof MouseEvent) {
    let convert = windowToCanvas(
      evt.clientX,
      evt.clientY,
      options.cvs as HTMLCanvasElement
    );
    options.pos = { ...convert, targetX: convert.x, targetY: convert.y };
    $(tipRef.value).css({
      left: options.pos.x + "px",
      top: options.pos.y + "px",
    });
    options.rate.x =
      (options.pos.x - options.offsetX - options.cvs.width / 2) /
      ((options.cvs.width / 2) * 2 ** options.level);
    options.rate.y =
      (options.pos.y - options.offsetY - options.cvs.height / 2) /
      ((options.cvs.height / 2) * 2 ** options.level);
    hover_func(options.pos);
    draw();
    options.mousedown = true;
  } else if (evt instanceof TouchEvent) {
    let convert = windowToCanvas(
      evt.touches[0].clientX,
      evt.touches[0].clientY,
      options.cvs as HTMLCanvasElement
    );
    touchPosition = { clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY };
    options.pos = { ...convert, targetX: convert.x, targetY: convert.y };
    $(tipRef.value).css({
      left: options.pos.x + "px",
      top: options.pos.y + "px",
    });
    options.rate.x =
      (options.pos.x - options.offsetX - options.cvs.width / 2) /
      ((options.cvs.width / 2) * 2 ** options.level);
    options.rate.y =
      (options.pos.y - options.offsetY - options.cvs.height / 2) /
      ((options.cvs.height / 2) * 2 ** options.level);
    hover_func(options.pos);
    draw();
    options.mousedown = true;
  }
}
function mouseupFunc(e: any) {
  options.mousedown = false;
}
onMounted(() => {
  // mockData();
  // options.arr = processData(雷达数据);//废弃

  let currentRadian = -3;
  let radial_num = 45;
  let library_num = 150;
  let direction = "clockwise";
  let func = () => {
    let array = [];
    for (let i = 0; i < library_num; i++) {
      if (Math.random() > 0.1) {
        array.push({
          color: "#" + Math.random().toString(16).substr(2, 6).toUpperCase() + "ff",
        });
      } else {
        array.push(undefined);
      }
    }
    let α = currentRadian,
      β = currentRadian + 4;

    if (currentRadian >= -3) {
      direction = "anticlockwise";
    } else if (currentRadian < -90) {
      direction = "clockwise";
    }
    if (direction == "clockwise") {
      currentRadian += 4;
    } else if (direction == "anticlockwise") {
      currentRadian -= 4;
    }

    options.arr.push({ α, β, array });
    while (options.arr.length > radial_num) options.arr.shift();
    radar_func();
    if (options.pos) {
      hover_func(options.pos);
    }
    draw();
    // clearInterval(timer);
  };
  // let timer = setInterval(func, 100);

  options.cvs = (paintCanvasRef.value as unknown) as HTMLCanvasElement;
  options.pos.targetX = options.pos.x = options.cvs.width / 2 + options.offsetX;
  options.pos.targetY = options.pos.y = options.cvs.height / 2 + options.offsetY;
  document.addEventListener("mousemove", mousemoveFunc, { passive: false });
  document.addEventListener("touchmove", mousemoveFunc, { passive: false });
  options.cvs.addEventListener("mousewheel", mousewheelFunc, { passive: false });
  options.cvs.addEventListener("mousedown", mousedownFunc, { passive: false });
  options.cvs.addEventListener("touchstart", mousedownFunc, { passive: false });
  document.addEventListener("mouseup", mouseupFunc, { passive: false });
  document.addEventListener("touchend", mouseupFunc, { passive: false });
});
const resize = () => {
  let targetWidth = options.cvs.getBoundingClientRect().width;
  let targetHeight = options.cvs.getBoundingClientRect().height;
  if (targetWidth == 0 || targetHeight == 0) {
    return;
  }
  let X = options.cvs.width / 2 + options.offsetX;
  let Y = options.cvs.height / 2 + options.offsetY;
  let x = options.pos.x - X;
  let y = options.pos.y - Y;
  options.cvs.width = targetWidth;
  options.cvs.height = targetHeight;
  X = options.cvs.width / 2 + options.offsetX;
  Y = options.cvs.height / 2 + options.offsetY;
  options.pos.targetX = options.pos.x = x + X;
  options.pos.targetY = options.pos.y = y + Y;
  $(tipRef.value).css({
    top: options.pos.y + "px",
    left: options.pos.x + "px",
  });
  options.radarCanvas.width = options.cvs.width;
  options.radarCanvas.height = options.cvs.height;
  options.hoverCanvas.width = options.cvs.width;
  options.hoverCanvas.height = options.cvs.height;
  options.scanCanvas.width = options.cvs.width;
  options.scanCanvas.height = options.cvs.height;

  radar_func();
  hover_func(options.pos);
  draw();
};
onBeforeUnmount(() => {
  document.removeEventListener("mousemove", mousemoveFunc);
  document.removeEventListener("touchmove", mousemoveFunc);
  options.cvs.removeEventListener("mousewheel", mousewheelFunc);
  options.cvs.removeEventListener("mousedown", mousedownFunc);
  options.cvs.removeEventListener("touchstart", mousedownFunc);
  document.removeEventListener("mouseup", mouseupFunc);
  document.removeEventListener("touchend", mouseupFunc);
});
</script>
<style scoped lang="scss">
.radarContainer {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .paintCanvas {
    // backdrop-filter: blur(25px);
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .radar_hover_tip {
    pointer-events: none;
    border-radius: 8px;
    white-space: noWrap;
    background: lightgrey;
    display: none;
    position: absolute;
    border: 1px solid gray;
    box-sizing: border-box;
    padding: 4px;
    color: black;
    z-index: 4;
    &::before {
      content: "";
      pointer-events: none;
      position: absolute;
      background: #fff;
      border: 1px solid gray;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      left: 0;
      top: 0;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
