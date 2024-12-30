<template>
  <div class="timestep-container">
    <Carousel :percent="100/13" :keep-number="6" :startIndex="0" style="width: 100%;">
      <template #default="{data,currentIndex}">
        <div :class="`item w-full h-full flex items-center relative justify-center font-size-20px flex flex-col ${data.index==currentIndex?'currentItem':''}`">
          <div v-if="data.index == currentIndex" class="day absolute top-0px font-size-12px line-height-12px">{{ getDay(data) }}D</div>
          <!-- <div class="day absolute top-0px font-size-12px line-height-12px">{{ data.index }}</div> -->
          {{ format(data) }}
          <div v-if="data.index == currentIndex" class="absolute bottom--10px font-size-12px line-height-12px cursor-pointer">
            <el-date-picker
              :modelValue="getDate(data)"
              @update:modelValue="setDate($event,data)"
              :default-value="new Date(moment(startTime,'YYYY-MM-DD').valueOf())"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
              type="date"
              placeholder="Pick a day"
              size="small"
              trigger="click"
              class="custom-date-picker"
              :clearable="false"
              style="width: fit-content;"
            />
          </div>
        </div>
      </template>
    </Carousel>
    <div ref="timeStepRef" class="timestep">
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
import { onMounted, reactive,ref,computed,watch } from 'vue'
import moment from "moment";
const isPlaying = ref(false)
const option = reactive<{arr:any[]}>({arr:[]})
const interval = 60 * 60 * 1000;
for (let time = 0; time < 24 * 60 * 60 * 1000; time += interval) {
  let seconds = time/1000
  let minutes = seconds/60
  let hours = minutes/60
  let text = `${Math.floor(hours).toString().padStart(2,'0')}:${(Math.floor(minutes)%60).toString().padStart(2,'0')}`
  if(time==0){
    option.arr.push({text,active:true});
  }else{
    option.arr.push({text,active:false});
  }
}
const timeStepRef = ref()
onMounted(()=>{
  let rect = timeStepRef.value.getBoundingClientRect()
  const n = 0
  timeStepRef.value.querySelector('.pointer').style.transform = `translateX(${rect.width/12*(n+0.5)}px)`
  requestAnimationFrame(()=>{
    timeStepRef.value.querySelector('.pointer').style.transition = 'transform 0.5s ease-in-out'
  })
})
const prev = ()=>{
  let active = timeStepRef.value.querySelector('.active')
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
    timeStepRef.value.querySelector('.pointer').style.transform = `translateX(${target.offsetLeft+rect.width/2}px)`
  }
}
const next = ()=>{
  let active = timeStepRef.value.querySelector('.active')
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
    timeStepRef.value.querySelector('.pointer').style.transform = `translateX(${target.offsetLeft+rect.width/2}px)`
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
  timeStepRef.value.querySelector('.pointer').style.transform = `translateX(${target.offsetLeft+rect.width/2}px)`
}
const increment = 60 * 60 * 1000
function getDay(data:any){
  let now = new Date()
  let delta = moment(startTime.value,'YYYY-MM-DD').valueOf() - new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()
  let day = Math.floor((delta + data.index * increment)/1000/60/60/24)
  return day > 0 ? `+${day}` : `${day}`;
}
const startTime = ref(moment().format('YYYY-MM-DD'))
function format(data:{index:number}){
  return moment(moment(startTime.value,'YYYY-MM-DD').valueOf() + data.index * increment).format('HH:mm');
}
function getDate(data:{index:number}){
  return moment(moment(startTime.value,'YYYY-MM-DD').valueOf() + data.index * increment).format('YYYY-MM-DD')
}
function setDate(value:string,data:any){
  let days = Math.floor(data.index * increment/1000/60/60/24)
  startTime.value = moment(moment(value,'YYYY-MM-DD').valueOf()-days*24*60*60*1000).format('YYYY-MM-DD')
}
</script>
<style lang="scss">
.my-carousel{
  .item{
    border-radius: 10px;
    height: 50px;
    &.currentItem{
      background: #4c7cc8;
    }
  }
  .ep-input__wrapper{
    height: 12px;
    line-height: 12px;
    box-shadow: none;
    font-size: 12px;
    &.is-focus,&:hover{
      box-shadow: none;
    }
    .ep-input__prefix{
      display: none;
    }
    input{
      text-align: center;
    }
    .ep-input__suffix{
      display: none;
    }
  }
}
.timestep-container{
  position: absolute;
  top:400px;
  left:50%;
  transform: translateX(-50%);
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