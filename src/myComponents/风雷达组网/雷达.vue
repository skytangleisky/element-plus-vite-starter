<template>
  <div style="width: 100%; height: 100%; position: relative; overflow: hidden">
    <canvas ref="paintCanvas" class="paintCanvas"></canvas>
    <div
      class="radar_hover_tip"
      ref="tip"
      style="
        display: none;
        position: absolute;
        border: 1px solid red;
        box-sizing: border-box;
        color: black;
      "
    ></div>
    <div
      ref="mask"
      style="
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
<script>
let rates = [5, 10, 20, 50, 100, 200, 500, 1000, 2000];
function windowToCanvas(x, y, canvas) {
  var box = canvas.getBoundingClientRect();
  return {
    x: ((x - box.left) / box.width) * canvas.width,
    y: ((y - box.top) / box.height) * canvas.height,
  };
}
import {View} from '~/tools'
import { getPPIRadial, getRHIRadial } from "~/api/重庆.ts";
const decoder = new TextDecoder()
const encoder = new TextEncoder()
// import 雷达数据 from './雷达PPI数据.js'
// import 雷达数据 from './雷达RHI数据.js'

function verticalFlowColor(v) {
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
function getSNRColor(val) {
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
function getPKColor(val) {
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
function getPKQDColor(val) {
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

function getFeatherColor(speed) {
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
export default {
  data() {
    return {
      arr: [],
      cvs: undefined,
      radarCanvas: document.createElement("canvas"),
      hoverCanvas: document.createElement("canvas"),
      scanCanvas: document.createElement("canvas"),
      offsetX: 0,
      offsetY: 0,
      mousedown: false,
      pos: undefined,
      defaultLength: 2,
      length: 2,
      distance: 30,
      item_hover: undefined,
    };
  },
  props: {
    type: "", // rhi | ppi
    device: "", //G3218
    radar_time: {
      default: "20230327224853",
      type: String,
    },
    PPIval: {
      default: 3, // 3|4|5|6
      type: Number,
    },
    RHIval: {
      default: 1, // 1|2|3|4
      type: Number,
    },
    isDark: {
      default: true,
      type: Boolean,
    },
  },
  watch: {
    radar_time(newVal) {
      this.dataChange();
    },
    PPIval(newVal) {
      this.dataChange();
    },
    RHIval(newVal) {
      this.dataChange();
    },
    isDark() {
      this.draw();
    },
  },
  methods: {
    async dataChange() {
      console.log(this.type);
      if (this.radar_time == "") return;
      let res;
      if (this.type == "rhi") {
        res = (await getRHIRadial({ dataTime: this.radar_time, radar_id: this.device }))
          .data;
      } else if (this.type == "ppi") {
        res = (await getPPIRadial({ dataTime: this.radar_time, radar_id: this.device }))
          .data;
        console.log(">", res);
      } else {
        return;
      }
      let dataArr = this.processData(res);
      console.log(res, "->", dataArr);
      this.arr = dataArr;
      let convert = undefined;
      this.hover_func(convert);
      this.radar_func();
      this.draw();
    },
    mockData() {
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
        this.arr.push({ α, β, array });
      }
    },
    processData(res) {
      let result = {}
      const view = new View(encoder.encode(res.data.file.file_data).buffer)
      let firstLine = decoder.decode(view.getLine()).split(',')
      result.HeaderInfo = {}
      firstLine.map((str)=>{
        let item = str.split(':')
        if(item.length==2){
          result.HeaderInfo[item[0]]=item[1]
        }
      })
      let secondLine = decoder.decode(view.getLine()).trim().replace(RegExp(/,$/g),'').split(',')
      result.radials = []
      while(!view.reachEnd()){
        let item = {}
        let thirdLine = decoder.decode(view.getLine()).trim().replace(RegExp(/,$/g),'').split(',')
        for(let i=0;i<12;i++){
          item[secondLine[i]] = thirdLine[i]
        }
        item.list = []
        for(let i=12;i<thirdLine.length;i+=4){
          let distance = Number(secondLine[i+0].split(' ')[0].substring(0,secondLine[i+0].split(' ')[0].length-1))
          item.list.push({
            distance,
            [secondLine[i+0].split(' ')[1]]:Number(thirdLine[i+0]),
            [secondLine[i+1].split(' ')[1]]:Number(thirdLine[i+1]),
            [secondLine[i+2].split(' ')[1]]:Number(thirdLine[i+2]),
            [secondLine[i+3].split(' ')[1]]:Number(thirdLine[i+3]),
          })
        }
        result.radials.push(item)
      }
      console.log(result)
      let dataArr = []
      for(let i=0;i<result.radials.length;i++){
        let radial = result.radials[i]
        let array = [undefined]
        let HorAngel = radial.Azimuth
        let Time = radial.Date_time
        let VerAngel = radial.Pitch
        if (this.type == "ppi") {
          this.distance = 30 * Math.cos((VerAngel / 180) * Math.PI);
        }
        radial.list.map(lib=>{
          let item = {
                HorAngel,
                Time,
                VerAngel,
                Hei: lib.distance,
                Speed: lib.WindSpeed,
                PK: lib.PK,
                SNR: radial[r].SNR,
                PKQD: radial[r].PKQD,
              };
              if (this.type == "ppi") {
                if (this.PPIval === 3) {
                  if (radial[r].Speed === 999) {
                    item = undefined;
                  } else {
                    item.color = verticalFlowColor(radial[r].Speed);
                    item.distance = r;
                  }
                } else if (this.PPIval === 4) {
                  item.color = getPKColor(radial[r].PK);
                  item.distance = r;
                } else if (this.PPIval === 5) {
                  item.color = getSNRColor(radial[r].SNR);
                  item.distance = r;
                } else if (this.PPIval === 6) {
                  item.color = getPKQDColor(radial[r].PKQD);
                  item.distance = r;
                }
              } else if (this.type == "rhi") {
                if (this.RHIval === 1) {
                  if (radial[r].Speed === 999) {
                    item = undefined;
                  } else {
                    item.color = verticalFlowColor(radial[r].Speed);
                    item.distance = r;
                  }
                } else if (this.RHIval === 2) {
                  item.color = getPKColor(radial[r].PK);
                  item.distance = r;
                } else if (this.RHIval === 3) {
                  item.color = getSNRColor(radial[r].SNR);
                  item.distance = r;
                } else if (this.RHIval === 4) {
                  item.color = getPKQDColor(radial[r].PKQD);
                  item.distance = r;
                }
              }
              array.push(item);
        })

        if (this.type == "ppi") {
          dataArr.push({ Angle: HorAngel - 90, array });
        } else if (this.type == "rhi") {
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
          if (this.type == "ppi") {
            this.distance = 30 * Math.cos((VerAngel / 180) * Math.PI);
          }
          for (let r in radial) {
            if (typeof radial[r] === "object") {
              let item = {
                HorAngel,
                Time,
                VerAngel,
                Hei: radial[r].Hei,
                Speed: radial[r].Speed,
                PK: radial[r].PK,
                SNR: radial[r].SNR,
                PKQD: radial[r].PKQD,
              };
              if (this.type == "ppi") {
                if (this.PPIval === 3) {
                  if (radial[r].Speed === 999) {
                    item = undefined;
                  } else {
                    item.color = verticalFlowColor(radial[r].Speed);
                    item.distance = r;
                  }
                } else if (this.PPIval === 4) {
                  item.color = getPKColor(radial[r].PK);
                  item.distance = r;
                } else if (this.PPIval === 5) {
                  item.color = getSNRColor(radial[r].SNR);
                  item.distance = r;
                } else if (this.PPIval === 6) {
                  item.color = getPKQDColor(radial[r].PKQD);
                  item.distance = r;
                }
              } else if (this.type == "rhi") {
                if (this.RHIval === 1) {
                  if (radial[r].Speed === 999) {
                    item = undefined;
                  } else {
                    item.color = verticalFlowColor(radial[r].Speed);
                    item.distance = r;
                  }
                } else if (this.RHIval === 2) {
                  item.color = getPKColor(radial[r].PK);
                  item.distance = r;
                } else if (this.RHIval === 3) {
                  item.color = getSNRColor(radial[r].SNR);
                  item.distance = r;
                } else if (this.RHIval === 4) {
                  item.color = getPKQDColor(radial[r].PKQD);
                  item.distance = r;
                }
              }
              array.push(item);
            }
          }
          if (this.type == "ppi") {
            dataArr.push({ Angle: HorAngel - 90, array });
          } else if (this.type == "rhi") {
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
          if (this.type == "rhi") {
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
        if (this.type == "rhi") {
          α = -Angle1 - (Angle2 - Angle1) / 2;
          β = -Angle1 + (Angle2 - Angle1) / 2;
        }
        dataArr.splice(0, 1, { α, Angle: dataArr[0].Angle, β, array: dataArr[0].array });

        Angle1 = dataArr.slice(-2)[0].Angle;
        Angle2 = dataArr.slice(-1)[0].Angle;
        α = Angle2 - (Angle2 - Angle1) / 2;
        β = Angle2 + (Angle2 - Angle1) / 2;
        if (this.type == "rhi") {
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
        if ((this.type = "rhi")) {
          α = -Angle - 0.5;
          β = -Angle + 0.5;
        }
        dataArr.splice(0, 1, { α, Angle: dataArr[0].Angle, β, array: dataArr[0].array });
      }
      return dataArr;
    },
    hoverItem_change(item) {
      let tip = this.$refs.tip;
      if (item) {
        $(tip).show();
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
            "<br/>" +
            ""
        );
        // $(tip).css('background-color',item.color)
        if (this.mousemove) {
          let convert = this.mousemove;
          let rect = tip.getBoundingClientRect();
          $(tip).css({ top: convert.y + 20 + "px", left: convert.x + 20 + "px" });
        }
      } else {
        $(tip).hide();
      }
    },
    radar_func() {
      let cvs_radar = this.radarCanvas;
      let ctx_radar = cvs_radar.getContext("2d");
      ctx_radar.clearRect(0, 0, cvs_radar.width, cvs_radar.height);
      let cvs_scan = this.scanCanvas;
      let ctx_scan = cvs_scan.getContext("2d");
      ctx_scan.clearRect(0, 0, cvs_scan.width, cvs_scan.height);
      for (let i = 0; i < this.arr.length; i++) {
        this.test_radar(
          this.arr[i].α,
          this.arr[i].β,
          this.arr[i].array,
          (i + 1) / this.arr.length
        );
        this.test_scan(this.arr[i].α, this.arr[i].β, this.arr[i].array);
      }
    },
    test_radar(α, β, arr, rate) {
      if (!arr) return;
      let θ = (((α - β) / 2) * Math.PI) / 180;
      let cvs = this.radarCanvas;
      let ctx = cvs.getContext("2d");
      ctx.save();
      ctx.translate(cvs.width / 2 + this.offsetX, cvs.height / 2 + this.offsetY);
      ctx.rotate(((α + β) / 2 / 180) * Math.PI);

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.lineWidth = 0;
      ctx.strokeStyle = "#fff";
      ctx.arc(0, 0, (arr.length - 1 + 0.5) * this.length + this.length, +θ, -θ, false);
      ctx.arc(0, 0, (0 + 0.5) * this.length, -θ, +θ, true);
      ctx.closePath();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
      // ctx.stroke();
      ctx.globalCompositeOperation = "source-over";

      arr.map((v, k) => {
        if (v !== undefined) {
          ctx.beginPath();
          ctx.lineWidth = 1;

          // ctx.moveTo((k+0.5)*this.length,((k+0.5)*this.length)*Math.tan(-θ));
          // ctx.lineTo((k+0.5)*this.length+this.length,((k+0.5)*this.length+this.length)*Math.tan(-θ));
          // ctx.lineTo((k+0.5)*this.length+this.length,((k+0.5)*this.length+this.length)*Math.tan(θ));
          // ctx.lineTo((k+0.5)*this.length,((k+0.5)*this.length)*Math.tan(θ));

          ctx.arc(0, 0, (k + 0.5) * this.length + this.length, +θ, -θ, false);
          ctx.arc(0, 0, (k + 0.5) * this.length, -θ, +θ, true);
          ctx.closePath();
          // ctx.fillStyle=v.color.substr(0,7) + Math.floor(rate*255).toString(16).padStart(2,'0');
          // ctx.strokeStyle=v.color.substr(0,7) + Math.floor(rate*255).toString(16).padStart(2,'0');
          ctx.fillStyle = v.color;
          ctx.strokeStyle = v.color;
          ctx.fill();
          ctx.stroke();
        }
      });
      ctx.restore();
    },
    hover_func(convert) {
      let ctx_hover = this.hoverCanvas.getContext("2d");
      ctx_hover.clearRect(0, 0, this.hoverCanvas.width, this.hoverCanvas.height);
      if (convert) {
        let radian =
          ((-Math.atan2(
            convert.x - this.hoverCanvas.width / 2 - this.offsetX,
            convert.y - this.hoverCanvas.height / 2 - this.offsetY
          ) /
            Math.PI) *
            180 +
            360 +
            90) %
          360;
        let between = false;
        for (let i = this.arr.length - 1; i >= 0; i--) {
          let α =
            this.arr[i].α >= 0
              ? this.arr[i].α % 360
              : Math.ceil(-this.arr[i].α / 360) * 360 + this.arr[i].α;
          let β =
            this.arr[i].β >= 0
              ? this.arr[i].β % 360
              : Math.ceil(-this.arr[i].β / 360) * 360 + this.arr[i].β;
          if (
            (α < β && α < radian && radian < β) ||
            (α > β && ((α < radian && radian < 360) || (0 <= radian && radian < β)))
          ) {
            let distance = Math.sqrt(
              (convert.x - this.hoverCanvas.width / 2 - this.offsetX) ** 2 +
                (convert.y - this.hoverCanvas.height / 2 - this.offsetY) ** 2
            );
            this.test_hover(this.arr[i].α, this.arr[i].β, this.arr[i].array, distance);
            between = true;
            break;
          }
        }
        if (!between) {
          if (this.item_hover !== undefined) {
            this.item_hover = undefined;
            this.hoverItem_change(this.item_hover);
          }
        }
      } else {
        $(this.$refs.tip).hide();
      }
    },
    test_hover(α, β, arr, distance) {
      if (!arr) return;
      let θ = (((α - β) / 2) * Math.PI) / 180;
      let cvs = this.hoverCanvas;
      let ctx = cvs.getContext("2d");
      ctx.save();

      ctx.translate(cvs.width / 2 + this.offsetX, cvs.height / 2 + this.offsetY);
      ctx.rotate(((α + β) / 2 / 180) * Math.PI);

      let k = Math.floor(distance / this.length - 0.5);
      if (arr && k >= 0 && k < arr.length) {
        ctx.strokeStyle = this.isDark ? "white" : "black";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, (arr.length - 1 + 0.5) * this.length + this.length, +θ, -θ, false);
        ctx.arc(0, 0, (1 + 0.5) * this.length, -θ, +θ, true);
        ctx.closePath();
        ctx.stroke();

        if (arr[k] !== undefined) {
          ctx.fillStyle = "#fff";
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.0;
          ctx.beginPath();

          // ctx.moveTo((k+0.5)*this.length,((k+0.5)*this.length)*Math.tan(-θ));
          // ctx.lineTo((k+0.5)*this.length+this.length,((k+0.5)*this.length+this.length)*Math.tan(-θ));
          // ctx.lineTo((k+0.5)*this.length+this.length,((k+0.5)*this.length+this.length)*Math.tan(θ));
          // ctx.lineTo((k+0.5)*this.length,((k+0.5)*this.length)*Math.tan(θ));

          ctx.arc(0, 0, (k + 0.5) * this.length + this.length, +θ, -θ, false);
          ctx.arc(0, 0, (k + 0.5) * this.length, -θ, +θ, true);
          ctx.closePath();
          ctx.stroke();
        }
      }
      if (this.item_hover !== arr[k]) {
        this.item_hover = arr[k];
        this.hoverItem_change(this.item_hover);
      }
      ctx.restore();
    },
    test_scan(α, β, arr) {
      if (!arr) return;
      let θ = (((α - β) / 2) * Math.PI) / 180;
      let cvs = this.scanCanvas;
      let ctx = cvs.getContext("2d");
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.save();

      ctx.translate(cvs.width / 2 + this.offsetX, cvs.height / 2 + this.offsetY);
      ctx.rotate(((α + β) / 2 / 180) * Math.PI);

      if (arr) {
        ctx.strokeStyle = "#fa0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, (arr.length - 1 + 0.5) * this.length + this.length, +θ, -θ, false);
        ctx.arc(0, 0, (1 + 0.5) * this.length, -θ, +θ, true);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    },
    draw() {
      let ctx = this.cvs.getContext("2d");
      ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

      ctx.drawImage(this.radarCanvas, 0, 0);
      ctx.drawImage(this.scanCanvas, 0, 0);
      ctx.drawImage(this.hoverCanvas, 0, 0);

      ctx.save();
      ctx.translate(
        this.cvs.width / 2 + this.offsetX,
        this.cvs.height / 2 + this.offsetY
      );
      ctx.strokeStyle = this.isDark ? "white" : "black";
      ctx.fillStyle = "#00000088";
      ctx.beginPath();
      ctx.moveTo(-190.5 * this.length, 0);
      ctx.lineTo(190.5 * this.length, 0);
      ctx.moveTo(0, -190.5 * this.length);
      ctx.lineTo(0, 190.5 * this.length);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.rotate(Math.PI / 4);
      ctx.moveTo(-190.5 * this.length, 0);
      ctx.lineTo(190.5 * this.length, 0);
      ctx.moveTo(0, -190.5 * this.length);
      ctx.lineTo(0, 190.5 * this.length);
      ctx.stroke();
      ctx.restore();

      // for(let i=1;i<=189.5;i++){
      //   ctx.beginPath();
      //   ctx.arc(0,0,this.length*i,0,Math.PI*2);
      //   ctx.closePath();
      //   ctx.stroke();
      // }
      let len;
      let rate;
      for (let i = 0; i < rates.length; i++) {
        len = (rates[i] / this.distance) * this.length;
        if (len > 50) {
          rate = rates[i];
          break;
        }
      }
      for (let i = 1; i <= Math.floor((190.5 * this.distance) / rate); i++) {
        ctx.beginPath();
        ctx.arc(0, 0, len * i, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.isDark ? "white" : "black";
        ctx.fillText(rate * i, len * i, 0);
        ctx.fillText(rate * i, 0, -len * i);
        ctx.fillText(rate * i, -len * i, 0);
        ctx.fillText(rate * i, 0, len * i);
        ctx.stroke();
      }
      ctx.restore();
    },
  },
  async mounted() {
    // let res = (await getPPIRadial()).data
    // let dataArr = this.processData(res)
    // let dataArr = this.processData(雷达数据)
    // this.mockData()
    // this.arr = dataArr
    // this.arr = []

    // setInterval(()=>{
    //   let array=[]
    //   for(let i=0;i<library_num;i++){
    //     if(Math.random()>0.1){
    //       array.push({color:'#'+Math.random().toString(16).substr(2, 6).toUpperCase()+'ff'})
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

    this.cvs = this.$refs.paintCanvas;
    this.cvs.addEventListener("mousewheel", (e) => {
      let convert = windowToCanvas(e.clientX, e.clientY, this.cvs);
      let rateX =
        (convert.x - this.offsetX - this.cvs.width / 2) /
        ((this.cvs.width / 2 / this.defaultLength) * this.length);
      let rateY =
        (convert.y - this.offsetY - this.cvs.height / 2) /
        ((this.cvs.height / 2 / this.defaultLength) * this.length);
      if (e.deltaY < 0) {
        this.length += 1;
      } else {
        this.length -= 1;
      }
      if (this.length < 1) {
        this.length = 1;
      }
      this.offsetX =
        convert.x -
        this.cvs.width / 2 -
        (this.cvs.width / 2 / this.defaultLength) * this.length * rateX;
      this.offsetY =
        convert.y -
        this.cvs.height / 2 -
        (this.cvs.height / 2 / this.defaultLength) * this.length * rateY;

      this.radar_func();
      this.hover_func(convert);

      this.draw();
    });
    let mousemoveFunc = (e) => {
      let convert = windowToCanvas(e.clientX, e.clientY, this.cvs);
      this.mousemove = convert;
      if (
        (0 < convert.x &&
          convert.x < this.cvs.width &&
          0 < convert.y &&
          convert.y < this.cvs.height) ||
        this.mousedown
      ) {
        let tip = this.$refs.tip;
        let rect = tip.getBoundingClientRect();
        $(tip).css({ top: convert.y + 20 + "px", left: convert.x + 20 + "px" });
        if (this.mousedown) {
          this.offsetX += convert.x - this.pos.x;
          this.offsetY += convert.y - this.pos.y;
          this.pos = { x: convert.x, y: convert.y };
          this.radar_func();
        }
        this.hover_func(convert);
        this.draw();
        e.stopPropagation();
        e.preventDefault();
      }
    };
    document.addEventListener("mousemove", mousemoveFunc);
    this.$refs.mask.addEventListener("mousemove", mousemoveFunc);
    this.cvs.addEventListener("mousedown", (e) => {
      $(this.$refs.mask).show();
      let convert = windowToCanvas(e.clientX, e.clientY, this.cvs);
      this.mousedown = true;
      this.pos = { x: convert.x, y: convert.y };
    });
    document.addEventListener("mouseup", (e) => {
      $(this.$refs.mask).hide();
      this.mousedown = false;
    });
    new ResizeObserver((entries) => {
      this.cvs.width = this.cvs.getBoundingClientRect().width;
      this.cvs.height = this.cvs.getBoundingClientRect().height;
      if (this.cvs.width == 0 || this.height == 0) {
        return;
      }
      this.offsetX = 0;
      this.offsetY = 0;
      this.radarCanvas.width = this.cvs.width;
      this.radarCanvas.height = this.cvs.height;
      this.hoverCanvas.width = this.cvs.width;
      this.hoverCanvas.height = this.cvs.height;
      this.scanCanvas.width = this.cvs.width;
      this.scanCanvas.height = this.cvs.height;

      this.radar_func();
      this.draw();
    }).observe(this.cvs);
  },
};
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
