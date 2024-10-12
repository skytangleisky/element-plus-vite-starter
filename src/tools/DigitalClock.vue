<template>
  <div class="relative" style="font-family: Digital-Modern,Menlo,Consolas,Monaco;border:1px solid gray;border-radius:4px;">
    <div class="relative whitespace-nowrap" style="color:#ffffff44;">8888-88-88&emsp;88:88:88</div>
    <div class="absolute whitespace-nowrap color-#0f0 inset-0" style="text-shadow: 0 0 8px #000;" v-html="timeString"></div>
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
</style>