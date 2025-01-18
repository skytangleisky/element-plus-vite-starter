<script setup lang="ts">
import { useSettingStore } from '~/stores/setting';
import { Restrictor,FPS } from './tool';
const setting = useSettingStore();
import ControlPane from '~/myComponents/controlPane/index.vue'
import { ref, onMounted, watch, reactive,toRefs, onBeforeUnmount } from "vue";
const restrictor =  new Restrictor(16.67);
const fps = new FPS(1000);
const options = reactive({
  fps:'0.00',
})
const canvasRef = ref<HTMLCanvasElement>();
let cvs: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let aid:number;
class Particle {
  x:number;y:number;vx:number;vy:number;radius:number;color:string;canvas:HTMLCanvasElement;
  constructor(canvas:HTMLCanvasElement) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = Math.random() * 2 + 2;
    this.color = `hsl(${Math.random() * 360}, 80%, 50%)`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
const particles:Particle[] = [];
onMounted(() => {
  cvs = canvasRef.value!;
  const rect = cvs.getBoundingClientRect()
  cvs.width = rect.width;
  cvs.height = rect.height;
  ctx = cvs.getContext("2d")!;
  watch(()=>setting.canvas.particleCount,(val)=>{
    if(val>particles.length){
      for (let i = 0; i < val - particles.length; i++) {
        particles.push(new Particle(cvs));
      }
    }else{
      particles.splice(val,particles.length-val);
    }
  },
  {
    immediate:true
  })
  watch(()=>setting.canvas.render,(val)=>{
    if(val){
      aid = requestAnimationFrame(animate)
    }else{
      cancelAnimationFrame(aid)
      options.fps = '0.00'
    }
  },{
    immediate:true
  })
});
let offset = 0;
const draw = () => {
  const pre = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
  ctx.fillRect(0, 0, cvs.width/2, cvs.height);
  ctx.globalCompositeOperation = pre;
  particles.forEach(particle => {
    particle.update();
    particle.draw(ctx);
  });

  const gradient = ctx.createLinearGradient(0, 0, cvs.width, cvs.height);
  gradient.addColorStop(0, 'red');     // 起始颜色
  gradient.addColorStop(0.5, 'yellow'); // 中间颜色
  gradient.addColorStop(1, 'blue');    // 结束颜色

  ctx.beginPath();
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 10
  let length = Math.min(cvs.width,cvs.height)*Math.PI;
  offset++;
  ctx.lineDashOffset = offset;
  ctx.setLineDash([100,length-100])
  ctx.arc(cvs.width/2,cvs.height/2,Math.min(cvs.width,cvs.height)/2,0,Math.PI*2);
  ctx.stroke();
}

function animate(timestamp:number) {
  restrictor.process(timestamp,()=>{
    fps.measure(timestamp,(fps:number)=>{options.fps = fps.toFixed(2)})
    draw();
  })
  aid = requestAnimationFrame(animate);
}
onBeforeUnmount(()=>{
  cancelAnimationFrame(aid);
})

const resize = function(){
  const rect = cvs.getBoundingClientRect()
  cvs.width = rect.width;
  cvs.height = rect.height;
  draw();
}
const list = reactive<any>([
  {label:'devtools',type:'folder',opened:toRefs(setting.canvas).devtoolsOpen,children:[
    {label:'粒子数量',value:toRefs(setting.canvas).particleCount,type:'range',min:1,max:100000,arr:Array.from({length:100000},(_,i:number)=>i+1)},
    {label:'渲染',value:toRefs(setting.canvas).render,type:'checkbox'},
    {label:'FPS',value:toRefs(options).fps,type:'text'},
    {label:'曲线',value:{
      fps: {
        value: toRefs(options).fps,
        min: 0,
        max: 200,
        strokeStyle: "white",
      },
    },type:'curve'},
  ]}
])
</script>
<template>
  <canvas ref="canvasRef" class="canvas" v-resize="resize"></canvas>
  <ControlPane class="absolute right-10px top-10px" :list="list" theme="default"/>
</template>
<style lang="scss" scoped>
  .canvas {
    position: absolute;
    background-image: url(./background.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }
</style>