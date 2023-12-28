<template>
  <div class="w-full h-full flex flex-col" style="background: #2b2b2b">
    <canvas ref="timeShaft" class="w-100% h-30px bg-#646464"></canvas>
    <div class="flex flex-row">
      <el-icon
        @click="prev"
        style="overflow: hidden; font-size: 2rem; color: white; transform: rotate(180deg)"
        v-dompurify-html="nextSvg"
      />
      <el-icon
        @click="options.status == 'play' ? pause() : play()"
        style="overflow: hidden; font-size: 2rem; color: white"
        v-dompurify-html="options.status == 'play' ? pauseSvg : playSvg"
      />
      <el-icon
        @click="next"
        style="overflow: hidden; font-size: 2rem; color: white"
        v-dompurify-html="nextSvg"
      />
    </div>
    <span @click="speed" style="color: white">x{{ Math.pow(2, options.times) }}</span>
  </div>
</template>
<script setup>
      // <img
      //   :src="options.status == 'play' ? pauseUrl : playUrl"
      //   style="
      //     width: inherit;
      //     height: inherit;
      //     transform: translateY(-60px);
      //     filter: drop-shadow(rgba(255, 255, 255, 1) 0 60px);
      //   "
      // />
import pauseSvg from '~/assets/pause.svg?raw'
import playSvg from '~/assets/play.svg?raw'
import nextSvg from '~/assets/next.svg?raw'
import { onMounted, onBeforeUnmount, ref, reactive } from "vue";
let now = Math.round(Date.now() / 1000) * 1000;
let data = []
for(let i=0;i<400;i++){
  let time = now + 1000 * i
  data.push({
    time,
    right: time >= now,
    toLeft:(item)=>{
      console.log('到了左边',item.time)
    },
    toRight:(item)=>{
      console.log('到了右边',item.time)
    }
  })
}
let value = 27.5;
let options = reactive({
  times:0,
  gap:20, //文字之间的最小间隙
  middle: 3, //中刻度
  short: 1, //短刻度
  long: 5, //长刻度
  bottom: 8, //文字到底部距离
  status: 'play',//play|pause
})
const arr = [
  360 * 24 * 60 * 60000,
  180 * 24 * 60 * 60000,
  90 * 24 * 60 * 60000,
  30 * 24 * 60 * 60000,
  7 * 24 * 60 * 60000,
  24 * 60 * 60000,
  12 * 60 * 60000,
  6 * 60 * 60000,
  2 * 60 * 60000,
  60 * 60000,
  30 * 60000,
  10 * 60000,
  6 * 60000,
  2 * 60000,
  60000,
  20000,
  10000,
  5000,
  2000,
  1000,
  500,
  200,
  100,
  50,
  20,
  10,
  5,
  2,
  1,
];
const duration = Math.round(Date.now() / 24 / 3600 / 1000) * 1000 * 3600 * 24;
let left = 0;
let rateX = 0.5;
let timer = 0;
let timeShaft = ref(undefined);
let mousemove;
let leftMouseDown = false;
let aid;
let observer;
onMounted(() => {
  let cvs = timeShaft.value;
  mousemove = {
    offsetX: cvs.width * rateX,
    offsetY: cvs.height * rateX,
  };
  cvs.addEventListener("mousewheel", (evt) => {
    let deltaY = evt.wheelDeltaY / 120 / 10;
    let ctx = cvs.getContext("2d");
    let delta,
      step,
      Num,
      tmpIndex = arr.length,
      text_width = ctx.measureText("yyyy-MM-dd HH:mm:ss.SSS").width;
    while (tmpIndex === arr.length || (delta < text_width + options.gap && arr[tmpIndex - 1])) {
      step = arr[--tmpIndex];
      Num = duration / step;
      delta = (cvs.width * Math.pow(2, value)) / Num;
    }
    if (
      (deltaY > 0 && step > arr.slice(-1)[0]) ||
      (deltaY < 0 && step < arr.slice(0)[0])
    ) {
      value += deltaY;
      left = mousemove.offsetX - rateX * cvs.width * Math.pow(2, value);
      draw();
    }
  });
  cvs.addEventListener("mousedown", (evt) => {
    if (evt.which == 1) {
      leftMouseDown = true;
      pause()
    }
  });
  document.addEventListener("mouseup", (evt) => {
    if (evt.which == 1) {
      leftMouseDown = false;
    }
  });
  document.addEventListener("mousemove", (evt) => {
    if (leftMouseDown) {
      left += evt.movementX;
      rateX = (mousemove.offsetX - left) / cvs.width / Math.pow(2, value);
      if(rateX * duration + now - duration/2>Date.now()){
        options.times = 0
        left = mousemove.offsetX - ((Date.now() - now) / duration + 0.5) * cvs.width * Math.pow(2, value)
        rateX = (mousemove.offsetX - left) / cvs.width / Math.pow(2, value);
        play()
        leftMouseDown = false
        return
      }
      draw();
    }
  });
  observer = new ResizeObserver(() => {
    let box = cvs.getBoundingClientRect();
    cvs.width = box.width;
    cvs.height = box.height;
    mousemove = {
      offsetX: cvs.width * rateX,
      offsetY: cvs.height * rateX,
    };
    draw();
    cancelAnimationFrame(aid)
    requestAnimationFrame(loop)
  })
  observer.observe(cvs);
  // timer = setInterval(() => {
  //   now = Math.round(Date.now() / 1000) * 1000;
  //   draw();
  // }, 1000);
});
let time;
const loop = () => {
  draw();
  aid = requestAnimationFrame(loop);
};
const speed = ()=>{
  options.times++
  if(options.times>3){
    options.times=-3
  }
}
const prev = ()=>{
  console.log('prev')
}
const play = ()=>{
  options.status = 'play'
}
const pause = ()=>{
  options.status = 'pause'
}
const next = ()=>{
  console.log('next')
}
/*
const input = (value) => {
      // let tmp = -(rateX * cvs.width * Math.pow(2,value) - mousemove.offsetX);
      // if (tmp > 0) {
      //   left = 0;
      //   mousemove.offsetX = rateX * cvs.width * Math.pow(2,value) + left;
      // } else if (tmp < cvs.width - cvs.width * Math.pow(2,value)) {
      //   left = cvs.width - cvs.width * Math.pow(2,value);
      //   mousemove.offsetX = rateX * cvs.width * Math.pow(2,value) + left;
      // }
      // if (mousemove.offsetX < cvs.width / 2) {
      //   let tmpLeft = 0;
      //   let tmpOffsetX = rateX * cvs.width * Math.pow(2,value) + tmpLeft;
      //   if (tmpOffsetX < cvs.width / 2) {
      //     left = tmpLeft;
      //     mousemove.offsetX = tmpOffsetX;
      //   } else {
      //     mousemove.offsetX = cvs.width / 2;
      //     left = -(rateX * cvs.width * Math.pow(2,value) - mousemove.offsetX);
      //   }
      // } else if (mousemove.offsetX > cvs.width / 2) {
      //   let tmpLeft = cvs.width - cvs.width * Math.pow(2,value);
      //   let tmpOffsetX = rateX * cvs.width * Math.pow(2,value) + tmpLeft;
      //   if (tmpOffsetX > cvs.width / 2) {
      //     left = tmpLeft;
      //     mousemove.offsetX = tmpOffsetX;
      //   } else {
      //     mousemove.offsetX = cvs.width / 2;
      //     left = -(rateX * cvs.width * Math.pow(2,value) - mousemove.offsetX);
      //   }
      // } else {
      //   left = tmp;
      // }
      left =
        mousemove.offsetX - rateX * cvs.width * Math.pow(2, value);
      draw();
    }
    */
const draw = () => {
  let cvs = timeShaft.value;
  let ctx = cvs.getContext("2d");
  let currentTime = Date.now()
  if(time==undefined){
    time = currentTime
    left = mousemove.offsetX - ((currentTime - now) / duration + 0.5) * cvs.width * Math.pow(2, value)
    rateX = (mousemove.offsetX - left) / cvs.width / Math.pow(2, value);
  }
  if(options.status == 'play'){
    let 𝛿 = (currentTime - time) * Math.pow(2,options.times);
    left -= 𝛿/duration*(cvs.width*Math.pow(2,value))
    rateX = (mousemove.offsetX - left) / cvs.width / Math.pow(2, value);
    if(rateX * duration + now - duration/2>currentTime){
      options.times = 0
      left = mousemove.offsetX - ((currentTime - now) / duration + 0.5) * cvs.width * Math.pow(2, value)
      rateX = (mousemove.offsetX - left) / cvs.width / Math.pow(2, value);
    }
  }
  time = currentTime
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  ctx.save();
  ctx.lineWidth = 2;
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    let x = ((item.time - now) / duration + 0.5) * cvs.width * Math.pow(2, value) + left;
    let middleTime = (rateX - 0.5) * duration + now // 中间刻度对应的时间
    if(item.time<middleTime&&item.right){
      item.toLeft(item)
      item.right = false
    }else if(item.time>middleTime&&!item.right){
      item.toRight(item)
      item.right = true
    }
    ctx.strokeStyle = "#0f0";
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cvs.height);
    ctx.stroke();
  }
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  // ctx.fillRect(0,0,cvs.width,cvs.height)
  // ctx.strokeRect(0,0,cvs.width,cvs.height)
  ctx.strokeStyle = "white";
  let tmpIndex = arr.length,
    step,
    Num,
    delta,
    text_width = ctx.measureText("yyyy-MM-dd HH:mm:ss.SSS").width;
  while (tmpIndex === arr.length || (delta < text_width + options.gap && arr[tmpIndex - 1])) {
    step = arr[--tmpIndex];
    // console.log(step);
    Num = duration / step;
    delta = (cvs.width * Math.pow(2, value)) / Num;
  }
  let minDelta = delta / 10;
  for (
    let i = Math.max(0, -Math.floor(left / delta + 1));
    i < Math.min(Num + 1, Math.floor((cvs.width - left) / delta) + 2);
    i++
  ) {
    ctx.font = "10px Menlo,Consolas,Monaco";
    ctx.lineWidth = 2
    ctx.fillText(new Date(now + i * step - duration / 2).Format("yyyy-MM-dd HH:mm:ss.SSS"), left + delta * i, cvs.height - options.bottom);
    ctx.beginPath();
    ctx.moveTo(left + delta * i, cvs.height);
    ctx.lineTo(left + delta * i, cvs.height - options.long);
    ctx.closePath();
    ctx.stroke();
    for (let j = 1; j < 10; j++) {
      ctx.beginPath();
      if (j === 5) {
        ctx.moveTo(left + delta * i + minDelta * j, cvs.height);
        ctx.lineTo(left + delta * i + minDelta * j, cvs.height - options.middle);
      } else {
        ctx.moveTo(left + delta * i + minDelta * j, cvs.height);
        ctx.lineTo(left + delta * i + minDelta * j, cvs.height - options.short);
      }
      ctx.stroke();
    }
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(mousemove.offsetX, 0);
  ctx.lineTo(mousemove.offsetX, cvs.height);
  ctx.stroke();


  let x = ((currentTime - now) / duration + 0.5) * cvs.width * Math.pow(2, value) + left
  ctx.fillStyle = "#00000044";
  ctx.beginPath();
  ctx.fillRect(x,0,cvs.width-x,cvs.height);

  ctx.restore();
};
onBeforeUnmount(() => {
  observer.disconnect()
  cancelAnimationFrame(aid);
});
</script>
