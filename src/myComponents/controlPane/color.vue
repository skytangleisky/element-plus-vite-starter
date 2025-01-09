<template>
  <span class="label">{{modelValue.label}}</span>
  <div class="value" style="display: flex;align-items: center;">
    <div :style="`background:${color};width:13px;height:13px;position:relative;margin:2px;border-radius:2px;margin:3px 3px 3px 4px;`">
      <input class="absolute" style="opacity: 0;width:100%;height: 100%;position: absolute;" :name="Math.random().toString()" type="color" v-model="color">
    </div>
    <input type="text" :name="Math.random().toString()" maxlength="7" style="width: 7ch;font-family: Menlo,Consolas,Monaco;margin:2px;" :value="inputColor" @change="colorChange">
  </div>
</template>
<script lang="ts" setup>
  import { interfaceColor } from './def'
  import { computed,ref } from 'vue'
  const modelValue = defineModel<interfaceColor>('modelValue',{
    default:{}
  })
  const color = computed({
    set(val:string){
      modelValue.value.value = hexToRgba(val)
    },
    get(){
      return rgbToHex(modelValue.value.value.r,modelValue.value.value.g,modelValue.value.value.b)
    }
  })
  const inputColor = ref(color)
  function colorChange($evt:Event){
    const target = $evt.target as HTMLInputElement
    //检测颜色是否合法
    if(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(target.value)){
      color.value = target.value//更新颜色
    }else{
      inputColor.value = color.value//颜色还原
    }
  }
  function hexToRgba(hex:string, a = 1) {
    // 如果是3位HEX颜色，扩展为6位HEX
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    // 提取RGB的十六进制值
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // 返回rgba值
    return {r,g,b,a};
  }
  function rgbToHex(r:number, g:number, b:number) {
    // 将RGB值转换为两位的十六进制数
    const toHex = (x:number) => {
      const hex = Math.round(x).toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    }
    // 转换RGB为HEX
    const hexR = toHex(r);
    const hexG = toHex(g);
    const hexB = toHex(b);
    return `#${hexR}${hexG}${hexB}`;
  }
</script>