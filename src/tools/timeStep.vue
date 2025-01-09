<template>
  <div class="timestep-container">
    <Carousel :percent="100/13" :keep-number="6" v-model:currentIndex="currentIndex" style="width: 100%" @change="change">
      <template #default="{data,currentIndex}">
        <div :class="`item w-full h-full flex items-center relative justify-center font-size-20px flex flex-col ${data.index==currentIndex?'currentItem':''}`">
          <div v-if="data.index == currentIndex" class="day absolute top-2px font-size-12px line-height-12px">{{ getDay(data) }}D</div>
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
            ></el-date-picker>
          </div>
        </div>
      </template>
    </Carousel>
    <el-icon class="btn" v-html="playState?pauseSvg:playSvg" @click="playState = !playState"></el-icon>
  </div>
</template>
<script setup lang="ts">
import Carousel from "./carousel.vue";
import rightSvg from "~/assets/right.svg?raw";
import playSvg from "~/assets/play.svg?raw";
import pauseSvg from "~/assets/pause.svg?raw";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import moment from "moment";

const increment = 10 * 60 * 1000
const playState = ref(true)
let now = new Date();
const currentIndex = ref(Math.floor((now.getTime() - new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime())/increment))
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
  playState.value = false
  let days = Math.floor(data.index * increment/1000/60/60/24)
  startTime.value = moment(moment(value,'YYYY-MM-DD').valueOf()-days*24*60*60*1000).format('YYYY-MM-DD')
}
watch(startTime,(newValue)=>{
  emit('change',moment(moment(newValue,'YYYY-MM-DD').valueOf()+currentIndex.value*increment).format('YYYY-MM-DD HH:mm:ss'))
})
const emit = defineEmits(['change'])
function change(newVal:number,oldValue:number,changeType:string){
  if(changeType == 'click'){
    playState.value = false
  }
  emit('change',moment(moment(startTime.value,'YYYY-MM-DD').valueOf()+newVal * increment).format('YYYY-MM-DD HH:mm:ss'))
}
let timer = 0
onMounted(()=>{
  let now = new Date()
  currentIndex.value = Math.floor((now.getTime() - new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime())/increment)
  timer = setInterval(()=>{
    if(playState.value){
      let now = new Date()
      currentIndex.value = Math.floor((now.getTime() - new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime())/increment)
    }  
  },10e3)
})
watch(playState,(newVal)=>{
  if(newVal){
    startTime.value = moment().format('YYYY-MM-DD')
    let now = new Date()
    currentIndex.value = Math.floor((now.getTime() - new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime())/increment)
  }
})
onBeforeUnmount(()=>{
  clearInterval(timer)
})
</script>
<style lang="scss">
.dark .my-carousel{
  .item{
    &.currentItem{
      background: #4c7cc8;
    }
  }
}
.my-carousel{
  .item{
    border-radius: 10px;
    height: 50px;
    &.currentItem{
      background: #adc6ee;
      border:1px solid black;
    }
  }
  .ep-input__wrapper{
    height: 12px;
    line-height: 12px;
    box-shadow: none;
    font-size: 12px;
    background-color:transparent;
    .ep-input__inner{
      color:inherit;
    }
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
.dark .timestep-container .btn{
  background: #80808080;
  border:1px solid black;
}
.timestep-container{
  position: absolute;
  display: flex;
  bottom:100px;
  left:50%;
  transform: translateX(-50%);
  align-items:center;
  justify-content: space-between;
  width: 80%;
  height: 38px;
  .btn{
    border:1px solid black;
    position: absolute;
    right:0;
    transform: translateX(calc(100% + 10px));
    flex-shrink: 0;
    border-radius: 50%;
    background:#ffffff80;
    width: 30px;
    height: 30px;
    &:hover{
      opacity: 0.8;;
    }
    &:active{
      opacity: 0.5;
    }
  }
}
</style>