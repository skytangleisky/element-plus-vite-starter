<template>
  <Carousel></Carousel>
  <div class="timestep-container">
    <div ref="timeStampRef" class="timestep">
      <div :flag="key" :class="`item ${item.active?'active':''}`" v-for="(item,key) in option.arr" @click="active(item,$event)">{{ item.text }}</div>
      <div class="pointer">
        <div class="sider"></div>
      </div>
    </div>
    <el-icon class="btn" v-html="rightSvg" @click="prev" style="transform: rotate(180deg);"></el-icon>
    <el-icon class="btn" v-html="rightSvg" @click="next"></el-icon>
    <el-icon class="btn" v-html="isPlaying?pauseSvg:playSvg" style="font-size: 1.3rem;" @click="togglePlay"></el-icon>
  </div>
</template>
<script setup lang="ts">
import Carousel from "./carousel.vue";
import rightSvg from "~/assets/right.svg?raw";
import playSvg from "~/assets/play.svg?raw";
import pauseSvg from "~/assets/pause.svg?raw";
import { onMounted, reactive,ref } from 'vue'
const isPlaying = ref(false)
const option = reactive<{arr:any[]}>({arr:[]})
const interval = 60 * 1000;
for (let time = 0; time < 24 * 60 * 60 * 1000; time += interval) {
  let seconds = time/1000
  let minutes = seconds/60
  let hours = minutes/60
  let text = `${Math.floor(hours).toString().padStart(2,'0')}:${(Math.floor(minutes)%60).toString().padStart(2,'0')}`
  option.arr.push({text,active:false});
}
const timeStampRef = ref()
onMounted(()=>{
  let rect = timeStampRef.value.getBoundingClientRect()
  const n = 0
  timeStampRef.value.querySelector('.pointer').style.transform = `translateX(${rect.width/12*(n+0.5)}px)`
  requestAnimationFrame(()=>{
    timeStampRef.value.querySelector('.pointer').style.transition = 'transform 0.5s ease-in-out'
  })
})
const prev = ()=>{
  let active = timeStampRef.value.querySelector('.active')
  if(active&&active.previousElementSibling&&active.previousElementSibling.classList.contains('item')){
    let target = active.previousElementSibling
    target.scrollIntoView({
      behavior: "smooth", // 平滑滚动
      block: "nearest",   // 垂直方向不滚动
      inline: "center"    // 水平方向居中
    });

    let key = Number(active.getAttribute('flag'))
    option.arr.forEach((it,k)=>{
      it.active = false;
    })
    option.arr[key-1].active = true

    let rect = target.getBoundingClientRect()
    timeStampRef.value.querySelector('.pointer').style.transform = `translateX(${target.offsetLeft+rect.width/2}px)`
  }
}
const next = ()=>{
  let active = timeStampRef.value.querySelector('.active')
  if(active&&active.nextElementSibling&&active.nextElementSibling.classList.contains('item')){
    let target = active.nextElementSibling
    target.scrollIntoView({
      behavior: "smooth", // 平滑滚动
      block: "nearest",   // 垂直方向不滚动
      inline: "center"    // 水平方向居中
    });
    let key = Number(active.getAttribute('flag'))
    option.arr.forEach((it,k)=>{
      it.active = false;
    })
    option.arr[key+1].active = true

    let rect = target.getBoundingClientRect()
    timeStampRef.value.querySelector('.pointer').style.transform = `translateX(${target.offsetLeft+rect.width/2}px)`
  }
}
const togglePlay = ()=>{
  isPlaying.value = !isPlaying.value
}
const active = (item:any,event:MouseEvent)=>{
  option.arr.forEach((it)=>{
    if(it!=item){
      it.active = false;
    }else{
      it.active = true;
    }
  });
  const target = event.target as HTMLDivElement
  target.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center"
  });
  let rect = target.getBoundingClientRect()
  timeStampRef.value.querySelector('.pointer').style.transform = `translateX(${target.offsetLeft+rect.width/2}px)`
}
</script>
<style lang="scss">
.timestep-container{
  position: absolute;
  top:50%;
  transform: translateY(-50%);
  display: flex;
  background: #ffffff40;
  align-items:center;
  width: 80%;
  height: 38px;
  &::before{
    content: '';
    position: absolute;
    width: 10px;
    height: 100%;
    left:-10px;
    top:0;
    background: #ffffff40;
    border-radius: 10px 0 0 10px;
  }
  &::after{
    content: '';
    position: absolute;
    width: 10px;
    height: 100%;
    right:-10px;
    top:0;
    background: #ffffff40;
    border-radius: 0 10px 10px 0;
  }
  .btn{
    width: 40px;
    height: 100%;
    flex-shrink: 0;
    &:hover{
      opacity: 0.8;;
    }
    &:active{
      opacity: 0.5;
    }
  }
  .timestep {
    overflow: hidden;
    font-size: 20px;
    box-sizing: border-box;
    width: 100%;
    position: relative;
    display: flex;
    scroll-snap-type: x mandatory;
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Edge */
    }
    // &>.item:nth-child(odd) {
    //   background: #00000080;
    // }
    // &>.item:nth-child(even) {
    //   background: #55555580;
    // }
    .item{
      scroll-snap-align: center;
      scroll-snap-stop: normal;
      width: calc(100% / 12);
      flex-shrink: 0;
      padding: 7px 0;
      margin:6px 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      --color:#103f78;
      &.active{
        background:var(--color);
        &:hover{
          background: var(--color);
        }
      }
      &:hover{
        background:#103f7880;
      }
      &:active{
        background:var(--color);
      }
    }
    .pointer{
      position: absolute;
      width: 0px;
      height: 100%;
      background:red;
      left:-1px;
      .sider{
        width: 100%;
        height: 100%;
        filter: drop-shadow(0px 0px 4px #000);
        --slider-color:#ddd;
        &::before{
          content: '';
          clip-path: inset(-50px);
          position: absolute;
          width: 15px;
          height: 10px;
          left:50%;
          top:0;
          transform: translate(-50%,0%);
          background:var(--slider-color);
          clip-path: polygon(0 0,50% 100%,100% 0);
        }
        &::after{
          content: '';
          position: absolute;
          width: 15px;
          height: 10px;
          left:50%;
          bottom:0;
          transform: translate(-50%,0%);
          background:var(--slider-color);
          clip-path: polygon(0 100%,100% 100%,50% 0);
        }
      }
    }
  }
}
</style>