<template>
  <div class="range">
    <span class="label">{{modelValue.label}}</span>
    <div class="w-150px h-full flex items-center">
      <div ref="rangerRef" class="ranger" style="margin:3px 3px 3px 4px">
        <div class="track">
          <div class="progress"></div>
        </div>
        <div class="thumb" :style="`${isDragging?'transform: scale(1);':''}`"></div>
      </div>
      <input type="text" :name="Math.random().toString()" maxlength="6" style="width: 6ch;font-family: Menlo,Consolas,Monaco;margin:2px;" :value="inputValue" @change="valueChange">
    </div>
  </div>
</template>
<script lang="ts" setup>
import { interfaceRange } from './def'
let leftGap = 5
let rightGap = 5
const modelValue = defineModel<interfaceRange>('modelValue',{
  default:{
    min:0,
    max:100,
    arr:Array.from({length:101}, (_, i) => Number((0 + i * (100 - 0) / 100).toFixed(2))),
    value:4,
  }
})
import {ref,onMounted,watch,toRefs} from 'vue'
const inputValue = ref<any>(toRefs(modelValue.value).value)
const rangerRef = ref()
onMounted(()=>{
  rangerRef.value.addEventListener('mousedown',mousedown)
  requestAnimationFrame(()=>{
    setValue(modelValue.value.value)
  })
})
const isDragging = ref(false)
function mousedown(evt:MouseEvent){
  isDragging.value = true
  process(evt)
  document.addEventListener('mousemove',mousemove)
  document.addEventListener('mouseup',mouseup)
}
function mouseup(){
  document.removeEventListener('mousemove',mousemove)
  document.removeEventListener('mouseup',mouseup)
  isDragging.value = false
}
function mousemove(evt:MouseEvent){
  if(isDragging){
    process(evt)
  }
}
function process(evt:MouseEvent){
  let rect = rangerRef.value.getBoundingClientRect()
  let mouseX = evt.clientX - rect.left
  mouseX<leftGap&&(mouseX=leftGap)
  mouseX>rect.width-rightGap&&(mouseX=rect.width-rightGap)
  let value = (mouseX - leftGap)/(rect.width - leftGap - rightGap)*(modelValue.value.max-modelValue.value.min)+modelValue.value.min
  setValue(value)
}
function setValue(v:number){
  const val =  modelValue.value.arr.reduce((prev, curr) => Math.abs(curr - v) < Math.abs(prev - v) ? curr : prev);
  modelValue.value.value = val
  let rect = rangerRef.value.getBoundingClientRect()
  const mouseX = leftGap + (val- modelValue.value.min)/(modelValue.value.max-modelValue.value.min)*(rect.width - leftGap - rightGap)
  rangerRef.value.style.setProperty('--progress',mouseX+'px')
  // rangerRef.value.style.setProperty('--padding-left',leftGap+'px')
  // rangerRef.value.style.setProperty('--padding-right',rightGap+'px')
}
watch(()=>modelValue.value.value,(val)=>{
  setValue(val)
},{deep:true})
function valueChange(evt:Event){
  const target = evt.target as HTMLInputElement;
  if(/^[-+]?\d*\.?\d+$/.test(target.value)){
    modelValue.value.value = Number(target.value)
  }else{
    target.value = modelValue.value.value.toString()
  }
}
</script>
<style lang="scss" scoped>
  .range {
    height: 100%;
    width: 100%;
    padding:1 2px;
    position: relative;
    display: flex;
    align-items: center;
    .ranger{
      --padding-left:0px;
      --padding-right:0px;
      flex:1;
      margin: 2px;
      --track-height:2px;
      --progress:10%;
      padding:0 var(--padding-right) 0 var(--padding-left);
      box-sizing: border-box;
      position: relative;
      .track{
        height: var(--track-height);
        overflow: hidden;
        border-radius: calc(var(--track-height) / 2);
        width: 100%;
        background:var(--tp-input-background-color);
        position: relative;
        outline: 1px solid var(--tp-input-foreground-color);
        .progress{
          overflow: hidden;
          position: absolute;
          width: calc(var(--progress) - var(--padding-left));
          height: 100%;
          background: var(--tp-input-foreground-color);
        }
      }
      .thumb{
        --left:-6px;
        --top:-6px;
        position: absolute;
        left:calc(var(--progress) + var(--left));
        top:calc(var(--track-height)/2 + var(--top));
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background-color: var(--tp-button-background-color);
        // border:2px solid #ddd;
        box-sizing: border-box;
        &:hover{
          transform: scale(1);
        }
      }
    }
  }
</style>