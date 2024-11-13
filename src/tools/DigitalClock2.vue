<template>
  <div class="DigitalClock">
    <div class="back">8888-88-88&emsp;88:88:88</div>
    <div class="front" v-html="timeString"></div>
  </div>
</template>
<script lang="ts" setup>
import {ref,onMounted,onBeforeUnmount} from 'vue'
import moment from 'moment';
let timeString = ref(moment().format('YYYY-MM-DD')+'&emsp;'+moment().format('HH:mm:ss'))
let timer:number
onMounted(()=>{
  timer = setInterval(()=>{
    timeString.value = moment().format('YYYY-MM-DD')+'&emsp;'+moment().format('HH:mm:ss')
  },1000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>
<style lang="scss">
  .DigitalClock{
    white-space:nowrap;
    position: relative;
    line-height: 20px;
    font-size: 20px;
    .back{
      position: relative;
      color:#ffffff10;
    }
    position: relative;
    font-family: Digital-Classic,Menlo,Consolas,Monaco;
    border:1px solid gray;border-radius:4px;
    .front{
      left:0;
      top:0;
      position: absolute;
      white-space:nowrap;
      color:#0f0;
    }
  }
  // .dark .DigitalClock{
  //   .back{
  //     color:#ffffff10;
  //   }
  //   .front{
  //     color:#0f0;
  //   }
  // }
</style>