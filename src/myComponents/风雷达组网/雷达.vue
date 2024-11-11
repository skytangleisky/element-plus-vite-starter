<template>
  <div style="width: 100%; height: 100%; position: relative; overflow: hidden">
    <Chromatography
      ref="chromatographyRef"
      :arr="chromatographyOption.arr"
      style="
        right: 30px;
        color: white;
        top: 50%;
        transform: translateY(-50%);
        bottom: 0;
        height: 300px;
        position: absolute;
      "
    ></Chromatography>
    <canvas ref="paintCanvasRef" class="paintCanvas"></canvas>
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
    <div
      ref="maskRef"
      style="
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: transparent;
        z-index: 9999;
      "
    ></div>
  </div>
</template>
<script lang="ts" setup>
import {reactive,ref,onMounted,watch} from 'vue'
import Chromatography from '../激光测风尾涡/chromatography.vue';
const tipRef = ref()
const maskRef = ref()
const chromatographyOption=reactive<{arr:Array<number>}>({
  arr: [-20,-18,-16,-14,-12,-10,-8,-6,-4,-2,-1,-0.5,0.5,1,2,4,6,8,10,12,14,16,18,20]
})
const chromatographyRef = ref()
const paintCanvasRef = ref()
import {getPPIRadial} from '~/api/重庆'
import ppiData from '../风雷达组网地图相关/level1/CDL_S4000_Lidar10BQC07110410_PPI_FrmAzm0.00_ToAzm359.00_Pth30.00_Spd6.00_Res030_StartIdx002_Start002_Stop190_LOSWind_20240715 203223.csv?raw'//测试数据
let rates = [5, 10, 20, 50, 100, 200, 500, 1000, 2000];
function windowToCanvas(x:number, y:number, canvas:HTMLCanvasElement) {
  var box = canvas.getBoundingClientRect();
  return {
    x: ((x - box.left) / box.width) * canvas.width,
    y: ((y - box.top) / box.height) * canvas.height,
  };
}
import {View} from '~/tools'
import { getRHIRadial } from "~/api/重庆.ts";
const decoder = new TextDecoder()
const encoder = new TextEncoder()

function verticalFlowColor(v:number) {
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
function getSNRColor(val:number) {
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
function getPKColor(val:number) {
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
function getPKQDColor(val:number) {
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

function getFeatherColor(speed:number) {
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





let radarCanvas = document.createElement("canvas"),
hoverCanvas = document.createElement("canvas"),
scanCanvas = document.createElement("canvas"),
offsetX = 0,
offsetY = 0,
mousedown = false,
defaultLength = 2,
length = 2,
distance = 30
const props = withDefaults(defineProps<{type:string,device:string,radar_time:string,PPIval:number,RHIval?:number,isDark:boolean}>(),{type: "", // rhi | ppi
device: "", //G3218
radar_time: '',
PPIval: 3,
RHIval: 1,
isDark: true});
let cvs:any;
let mousemove:any;
let pos:any;
let height:any;
let item_hover:any;
let arr = <any>[];
watch(()=>props.radar_time,(newVal)=>{
  dataChange();
})
watch(()=>props.PPIval,(newVal)=>{
  dataChange();
  if(newVal==3){
    chromatographyOption.arr = [-20,-18,-16,-14,-12,-10,-8,-6,-4,-2,-1,-0.5,0.5,1,2,4,6,8,10,12,14,16,18,20]
  }else if(newVal==4){
    chromatographyOption.arr = [0,1,2,3,4,5,6,7,8,9,10]
  }else if(newVal==5){
    chromatographyOption.arr = [0,2,4,6,8,10,12,14,16,18,20]
  }else{
    chromatographyOption.arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  }

})
watch(()=>props.RHIval,(newVal)=>{
  dataChange();
})
watch(()=>props.isDark,(newVal)=>{
  draw();
})


async function dataChange() {
  if (props.radar_time == "") return;
  let res;
  if (props.type == "rhi") {
    res = (await getRHIRadial({ dataTime: props.radar_time, radar_id: props.device }))
      .data;
  } else if (props.type == "ppi") {
    let strs = props.radar_time.split('/');
    let path = strs.slice(0,-1).join('/')
    let date_time = strs.slice(-1)[0]
    console.log(path,date_time)
    res = (await getPPIRadial({ date_time,path, radar_id: props.device,data_type:1 }))
      .data;
  } else {
    return;
  }
  if(!res.data){
    console.log('无file数据')
    return;
  }
  let dataArr = processData(res);
  arr = dataArr;
  let convert = undefined;
  hover_func(convert);
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
          color: "#" + Math.random().toString(16).substring(2, 8).toUpperCase() + "88",
        });
      } else {
        array.push(undefined);
      }
    }
    let α = currentRadian,
      β = currentRadian + 4;
    currentRadian += 4;
    arr.push({ α, β, array });
  }
}
function processData(res:any) {
  /* S4000 */
  const d = new TextDecoder("utf8");
  let v = new View(encoder.encode(res.data.file.file_data).buffer),
  // let v = new View(encoder.encode(ppiData).buffer),//测试
    result: { [key: string]: any } = {};
  let firstLine = d.decode(v.getLine()).trim().replace(/,$/, "").split(",");
  result.HeaderInfo = {};
  for (let i = 1; i < firstLine.length; i++) {
    let kv = firstLine[i].split(":");
    if (kv.length == 2) {
      result.HeaderInfo[kv[0]] = kv[1]
    }
  }
  let secondLine = d.decode(v.getLine()).trim().replace(/,$/, "").split(",");
  let data: Array<any> = (result.data = []);
  let Azimuth = undefined
  while (!v.reachEnd()) {
    let thirdLine = d.decode(v.getLine()).trim().replace(/,$/, "").split(",");
    let radial:{[key:string]:any} = { Azimuth: 0, list: new Array<any>() };
    for (let i = 0; i < 11; i++) {
      radial[secondLine[i]] = thirdLine[i]
    }
    radial.Azimuth = Number(radial.Azimuth);
    //用于确保两根径向之间夹角不大于180度
    if (data.length > 0) {
      let lastItem = data[data.length - 1];
      if (Azimuth!=undefined&&Math.abs(Azimuth - lastItem.Azimuth) > 180) {
        // item.Azimuth = 360 + item.Azimuth;
        Azimuth =
          lastItem.Azimuth +
          (360 - (Math.abs(Azimuth - lastItem.Azimuth) % 360));
      }
    }
    for (let i = 11; i < thirdLine.length; i += 4) {
      let obj = {
        [secondLine[i + 0].split(" ")[1]]: Number(thirdLine[i + 0]),
        [secondLine[i + 1].split(" ")[1]]: Number(thirdLine[i + 1]),
        [secondLine[i + 2].split(" ")[1]]: Number(thirdLine[i + 2]),
        [secondLine[i + 3].split(" ")[1]]: Number(thirdLine[i + 3]),
        distance: Number(secondLine[i + 3].split(" ")[0].replace(/m$/, "")),
      };
      radial.list.push(obj);
    }
    data.push(radial);
  }
  result.data = result.data.slice(1)//由于第一条径向和第二条径向之间方位角跨度太大，鼠标选取会出现异常（所以删除第一条径向）
  let dataArr = []
  for(let i=0;i<result.data.length;i++){
    let radial = result.data[i]
    let array = [undefined]
    let HorAngel = Number(radial.Azimuth)
    let Time = radial.Date_time
    let VerAngel = Number(radial.Pitch)
    if (props.type == "ppi") {
      distance = 30 * Math.cos((VerAngel / 180) * Math.PI);
    }
    radial.list.map((lib:any)=>{
      let item = {
            HorAngel,
            Time,
            VerAngel,
            distance: lib.distance,
            Speed: lib['RadialWind(m/s)'],
            PK: lib['SpectralWidth'],
            SNR: lib['SNR'],
            PKQD: lib['SpectralIntensity'],
          };
          if (props.type == "ppi") {
            if (props.PPIval === 3) {
              if (item.Speed === 999) {
                item = undefined;
              } else {
                item.color = chromatographyRef.value.getColor(item.Speed);
              }
            } else if (props.PPIval === 4) {
              item.color = chromatographyRef.value.getColor(item.PK)
            } else if (props.PPIval === 5) {
              item.color = chromatographyRef.value.getColor(item.SNR)
            } else if (props.PPIval === 6) {
              item.color = chromatographyRef.value.getColor(item.PKQD)
            }
          } else if (props.type == "rhi") {
            if (props.RHIval === 1) {
              if (item.Speed === 999) {
                item = undefined;
              } else {
                item.color = verticalFlowColor(item.Speed);
              }
            } else if (props.RHIval === 2) {
              item.color = getPKColor(item.PK);
            } else if (props.RHIval === 3) {
              item.color = getSNRColor(item.SNR);
            } else if (props.RHIval === 4) {
              item.color = getPKQDColor(item.PKQD);
            }
          }
          array.push(item);
    })

    if (props.type == "ppi") {
      dataArr.push({ Angle: HorAngel - 90, array });
    } else if (props.type == "rhi") {
      dataArr.push({ Angle: VerAngel, array });
    }
  }
  // let dataArr = [];
  for (let k in res.data) {
    if (k !== "radar_id" && k !== "radar_name") {
      let radial = res.data[k];
      let array = [undefined];
      let HorAngel = radial["HorAngel"];
      let Time = radial["Time"];
      let VerAngel = radial["VerAngel"];
      if (props.type == "ppi") {
        distance = 30 * Math.cos((VerAngel / 180) * Math.PI);
      }
      for (let r in radial) {
        if (typeof radial[r] === "object") {
          let item = {
            HorAngel,
            timestamp:props.radar_time,
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
    if ((props.type = "rhi")) {
      α = -Angle - 0.5;
      β = -Angle + 0.5;
    }
    dataArr.splice(0, 1, { α, Angle: dataArr[0].Angle, β, array: dataArr[0].array });
  }
  return dataArr;
}
function hoverItem_change(item) {
  let tip = tipRef.value;
  let date = props.radar_time.split('/').slice(-2)[0]
  let time = props.radar_time.split('/').slice(-1)[0]
  if (item) {
    $(tip).show();
    $(tip).html(
      "文件时间："+
      date.substring(0, 4) +
      "-" + date.substring(4, 6) +
      "-" + date.substring(6, 8) +
      " " + time.substring(0, 2) +
      ":" + time.substring(2, 4) +
      ":" + time.substring(4, 6) +
      "<br/>"+
      "径向时间：" +
        item.Time.substring(0, 4) +
        "-" +
        item.Time.substring(4, 6) +
        "-" +
        item.Time.substring(6, 8) +
        " " +
        item.Time.substring(9, 11) +
        ":" +
        item.Time.substring(12, 14) +
        ":" +
        item.Time.substring(15, 17) +
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
        "<br/>" +
        ""
    );
    // $(tip).css('background-color',item.color)
    if (mousemove) {
      let convert = mousemove;
      let rect = tip.getBoundingClientRect();
      $(tip).css({ top: convert.y + 20 + "px", left: convert.x + 20 + "px" });
    }
  } else {
    $(tip).hide();
  }
}
function radar_func() {
  let cvs_radar = radarCanvas;
  let ctx_radar = cvs_radar.getContext("2d") as CanvasRenderingContext2D;
  ctx_radar.clearRect(0, 0, cvs_radar.width, cvs_radar.height);
  let cvs_scan = scanCanvas;
  let ctx_scan = cvs_scan.getContext("2d") as CanvasRenderingContext2D;
  ctx_scan.clearRect(0, 0, cvs_scan.width, cvs_scan.height);
  for (let i = 0; i < arr.length; i++) {
    test_radar(
      arr[i].α,
      arr[i].β,
      arr[i].array,
      (i + 1) / arr.length
    );
    test_scan(arr[i].α, arr[i].β, arr[i].array);
  }
}
function test_radar(α:number, β:number, arr:any[], rate:number) {
  if (!arr) return;
  let θ = (((α - β) / 2) * Math.PI) / 180;
  let cvs = radarCanvas;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.save();
  ctx.translate(cvs.width / 2 + offsetX, cvs.height / 2 + offsetY);
  ctx.rotate(((α + β) / 2 / 180) * Math.PI);

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.lineWidth = 0;
  ctx.strokeStyle = "#fff";
  ctx.arc(0, 0, (arr.length - 1 + 0.5) * length + length, +θ, -θ, false);
  ctx.arc(0, 0, (0 + 0.5) * length, -θ, +θ, true);
  ctx.closePath();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fill();
  // ctx.stroke();
  ctx.globalCompositeOperation = "source-over";

  arr.map((v:any, k:number) => {
    if (v !== undefined) {
      ctx.beginPath();
      ctx.lineWidth = 1;

      // ctx.moveTo((k+0.5)*length,((k+0.5)*length)*Math.tan(-θ));
      // ctx.lineTo((k+0.5)*length+length,((k+0.5)*length+length)*Math.tan(-θ));
      // ctx.lineTo((k+0.5)*length+length,((k+0.5)*length+length)*Math.tan(θ));
      // ctx.lineTo((k+0.5)*length,((k+0.5)*length)*Math.tan(θ));

      ctx.arc(0, 0, (k + 0.5) * length + length, +θ, -θ, false);
      ctx.arc(0, 0, (k + 0.5) * length, -θ, +θ, true);
      ctx.closePath();
      // ctx.fillStyle=v.color.substring(0,7) + Math.floor(rate*255).toString(16).padStart(2,'0');
      // ctx.strokeStyle=v.color.substring(0,7) + Math.floor(rate*255).toString(16).padStart(2,'0');
      ctx.fillStyle = v.color;
      ctx.strokeStyle = v.color;
      ctx.fill();
      ctx.stroke();
    }
  });
  ctx.restore();
}
function hover_func(convert:any) {
  let ctx_hover = hoverCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx_hover.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
  if (convert) {
    let radian =
      ((-Math.atan2(
        convert.x - hoverCanvas.width / 2 - offsetX,
        convert.y - hoverCanvas.height / 2 - offsetY
      ) /
        Math.PI) *
        180 +
        360 +
        90) %
      360;
    let between = false;
    for (let i = arr.length - 1; i >= 0; i--) {
      let α =
        arr[i].α >= 0
          ? arr[i].α % 360
          : Math.ceil(-arr[i].α / 360) * 360 + arr[i].α;
      let β =
        arr[i].β >= 0
          ? arr[i].β % 360
          : Math.ceil(-arr[i].β / 360) * 360 + arr[i].β;
      if (
        (α < β && α < radian && radian < β) ||
        (α > β && ((α < radian && radian < 360) || (0 <= radian && radian < β)))
      ) {
        let distance = Math.sqrt(
          (convert.x - hoverCanvas.width / 2 - offsetX) ** 2 +
            (convert.y - hoverCanvas.height / 2 - offsetY) ** 2
        );
        test_hover(arr[i].α, arr[i].β, arr[i].array, distance);
        between = true;
        break;
      }
    }
    if (!between) {
      if (item_hover !== undefined) {
        item_hover = undefined;
        hoverItem_change(item_hover);
      }
    }
  } else {
    $(tipRef.value).hide();
  }
}
function test_hover(α:any, β:any, arr:any[], distance:number) {
  if (!arr) return;
  let θ = (((α - β) / 2) * Math.PI) / 180;
  let cvs = hoverCanvas;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.save();

  ctx.translate(cvs.width / 2 + offsetX, cvs.height / 2 + offsetY);
  ctx.rotate(((α + β) / 2 / 180) * Math.PI);

  let k = Math.floor(distance / length - 0.5);
  if (arr && k >= 0 && k < arr.length) {
    ctx.strokeStyle = props.isDark ? "white" : "black";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, (arr.length - 1 + 0.5) * length + length, +θ, -θ, false);
    ctx.arc(0, 0, (1 + 0.5) * length, -θ, +θ, true);
    ctx.closePath();
    ctx.stroke();

    if (arr[k] !== undefined) {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1.0;
      ctx.beginPath();

      // ctx.moveTo((k+0.5)*length,((k+0.5)*length)*Math.tan(-θ));
      // ctx.lineTo((k+0.5)*length+length,((k+0.5)*length+length)*Math.tan(-θ));
      // ctx.lineTo((k+0.5)*length+length,((k+0.5)*length+length)*Math.tan(θ));
      // ctx.lineTo((k+0.5)*length,((k+0.5)*length)*Math.tan(θ));

      ctx.arc(0, 0, (k + 0.5) * length + length, +θ, -θ, false);
      ctx.arc(0, 0, (k + 0.5) * length, -θ, +θ, true);
      ctx.closePath();
      ctx.stroke();
    }
  }
  if (item_hover !== arr[k]) {
    item_hover = arr[k];
    hoverItem_change(item_hover);
  }
  ctx.restore();
}
function test_scan(α:number, β:number, arr:any[]) {
  if (!arr) return;
  let θ = (((α - β) / 2) * Math.PI) / 180;
  let cvs = scanCanvas;
  let ctx = cvs.getContext("2d") as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.save();

  ctx.translate(cvs.width / 2 + offsetX, cvs.height / 2 + offsetY);
  ctx.rotate(((α + β) / 2 / 180) * Math.PI);

  if (arr) {
    ctx.strokeStyle = "#fa0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, (arr.length - 1 + 0.5) * length + length, +θ, -θ, false);
    ctx.arc(0, 0, (1 + 0.5) * length, -θ, +θ, true);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();
}
function draw() {
  let ctx = cvs.getContext("2d");
  ctx.clearRect(0, 0, cvs.width, cvs.height);

  ctx.drawImage(radarCanvas, 0, 0);
  ctx.drawImage(scanCanvas, 0, 0);
  ctx.drawImage(hoverCanvas, 0, 0);

  ctx.save();
  ctx.translate(
    cvs.width / 2 + offsetX,
    cvs.height / 2 + offsetY
  );
  ctx.strokeStyle = props.isDark ? "white" : "black";
  ctx.fillStyle = "#00000088";
  ctx.beginPath();
  ctx.moveTo(-190.5 * length, 0);
  ctx.lineTo(190.5 * length, 0);
  ctx.moveTo(0, -190.5 * length);
  ctx.lineTo(0, 190.5 * length);
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.rotate(Math.PI / 4);
  ctx.moveTo(-190.5 * length, 0);
  ctx.lineTo(190.5 * length, 0);
  ctx.moveTo(0, -190.5 * length);
  ctx.lineTo(0, 190.5 * length);
  ctx.stroke();
  ctx.restore();

  // for(let i=1;i<=189.5;i++){
  //   ctx.beginPath();
  //   ctx.arc(0,0,this.length*i,0,Math.PI*2);
  //   ctx.closePath();
  //   ctx.stroke();
  // }
  let len;
  let rate = 1;
  for (let i = 0; i < rates.length; i++) {
    len = (rates[i] / distance) * length;
    if (len > 50) {
      rate = rates[i];
      break;
    }
  }
  for (let i = 1; i <= Math.floor((190.5 * distance) / rate); i++) {
    ctx.beginPath();
    ctx.arc(0, 0, len * i, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = props.isDark ? "white" : "black";
    ctx.fillText(rate * i, len * i, 0);
    ctx.fillText(rate * i, 0, -len * i);
    ctx.fillText(rate * i, -len * i, 0);
    ctx.fillText(rate * i, 0, len * i);
    ctx.stroke();
  }
  ctx.restore();
}
onMounted(()=>{
  // let res = (await getPPIRadial()).data
  // let dataArr = this.processData(res)
  // let dataArr = this.processData(雷达数据)
  // this.mockData()
  // this.arr = dataArr
  // this.arr = []


  // let library_num = 150;
  // let radial_num = 90;
  // let currentRadian = -2;
  // setInterval(()=>{
  //   let array=[]
  //   for(let i=0;i<library_num;i++){
  //     if(Math.random()>0.1){
  //       array.push({color:'#'+Math.random().toString(16).substring(2, 8).toUpperCase()+'ff'})
  //     }else{
  //       array.push(undefined)
  //     }
  //   }
  //   let α=currentRadian,β=currentRadian+4;
  //   currentRadian+=4;
  //   this.arr.push({α,β,array})
  //   if(this.arr.length>radial_num)this.arr.shift();
  //   this.radar_func()
  //   if(this.mousemove){
  //     let convert=this.mousemove
  //     this.hover_func(convert)
  //   }
  //   this.draw()
  // },1000)

  cvs = paintCanvasRef.value;
  cvs.addEventListener("mousewheel", (e:any) => {
    let convert = windowToCanvas(e.clientX, e.clientY, cvs);
    let rateX =
      (convert.x - offsetX - cvs.width / 2) /
      ((cvs.width / 2 / defaultLength) * length);
    let rateY =
      (convert.y - offsetY - cvs.height / 2) /
      ((cvs.height / 2 / defaultLength) * length);
    if (e.deltaY < 0) {
      length += 1;
    } else {
      length -= 1;
    }
    if (length < 1) {
      length = 1;
    }
    offsetX =
      convert.x -
      cvs.width / 2 -
      (cvs.width / 2 / defaultLength) * length * rateX;
    offsetY =
      convert.y -
      cvs.height / 2 -
      (cvs.height / 2 / defaultLength) * length * rateY;

    radar_func();
    hover_func(convert);

    draw();
  });
  let mousemoveFunc = (e:any) => {
    let convert = windowToCanvas(e.clientX, e.clientY,cvs);
    mousemove = convert;
    if ((0 < convert.x && convert.x < cvs.width && 0 < convert.y && convert.y < cvs.height) || mousedown ) {
      let tip = tipRef.value;
      let rect = tip.getBoundingClientRect();
      $(tip).css({ top: convert.y + 20 + "px", left: convert.x + 20 + "px" });
      if (mousedown) {
        offsetX += convert.x - pos.x;
        offsetY += convert.y - pos.y;
        pos = { x: convert.x, y: convert.y };
        radar_func();
      }
      hover_func(convert);
      draw();
      e.stopPropagation();
      e.preventDefault();
    }
  };
  document.addEventListener("mousemove", mousemoveFunc);
  maskRef.value.addEventListener("mousemove", mousemoveFunc);
  cvs.addEventListener("mousedown", (e:any) => {
    $(maskRef.value).show();
    let convert = windowToCanvas(e.clientX, e.clientY, cvs);
    mousedown = true;
    pos = { x: convert.x, y: convert.y };
  });
  document.addEventListener("mouseup", (e) => {
    $(maskRef.value).hide();
    mousedown = false;
  });
  new ResizeObserver((entries) => {
    cvs.width = cvs.getBoundingClientRect().width;
    cvs.height = cvs.getBoundingClientRect().height;
    if (cvs.width == 0 || height == 0) {
      return;
    }
    offsetX = 0;
    offsetY = 0;
    radarCanvas.width = cvs.width;
    radarCanvas.height = cvs.height;
    hoverCanvas.width = cvs.width;
    hoverCanvas.height = cvs.height;
    scanCanvas.width = cvs.width;
    scanCanvas.height = cvs.height;

    radar_func();
    draw();
  }).observe(cvs);
})
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
