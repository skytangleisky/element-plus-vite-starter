<template>
  <div class="ColorSelector bg-white dark:bg-#535353" v-dialogDrag>
    <div class="relative w-full h-30px bg-white dark:bg-#333 box-border b-solid b-#000 b-0px b-b-1px flex justify-center items-center font-size-18px">调色板</div>
    <div class="relative w-full h-full" tabindex="-1" @mousedown.stop>
      <div id="cssquareselector"><canvas id="cssquare" width="256" height="256"></canvas><svg id="cssquarecursor" height="268" width="268"><circle cx="7" cy="7" r="5" stroke="black" stroke-width="1" fill="none" /></svg></div>
      <label class="absolute left-10px top-300px flex items-center"><input type="checkbox" name="cspalette1" value="0">只有Web颜色</label>
      <div class="absolute top-315px left-120px hidden">
        <input id="csall" type="radio" name="cspalette" value="0" checked><label for="csall">All Colors</label><br>
        <input id="csweb" type="radio" name="cspalette" value="1"><label for="csweb">Only Web Colors (216)</label><br>
        <input id="cshtml" type="radio" name="cspalette" value="2"><label for="cshtml">Only HTML Colors (138)</label>
      </div>

      <div id="csbarselector"><canvas id="csbar" width="19" height="256"></canvas>
        <div id="csbarcursor"><div id="csbarcursorimage">
          <div class="absolute left--10px top--5px" style="fill:white;stroke:black;stroke-width: 1px;width:10px;height: 10px;line-height:0;">
            <svg viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L0 10 10 5Z "></path></svg>
          </div>
          <div class="absolute right--10px rotate-180 top--5px" style="fill:white;stroke:black;stroke-width: 1px;width:10px;height: 10px;line-height:0;">
            <svg viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M0,0 L0 10 10 5Z "></path></svg>
          </div>
        </div></div>
      </div>
      <div class="absolute left-310px top-155px grid cols-3 rows-3 gap-row-1" style="grid-template-columns: 35px auto auto">
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="3" v-model="setting.channel">H:</label><input autocomplete="off" class="w-32px h-15px" id="inHSB_H" type="text" maxlength="3" size="3">度
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="4" v-model="setting.channel">S:</label><input autocomplete="off" class="w-32px h-15px" id="inHSB_S" type="text" maxlength="3" size="3">%
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="5" v-model="setting.channel">V:</label><input autocomplete="off" class="w-32px h-15px" id="inHSB_B" type="text" maxlength="3" size="3">%
      </div>
      <div class="absolute left-410px top-155px grid cols-2 rows-3 gap-row-1" style="grid-template-columns: 35px auto;">
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="6" v-model="setting.channel">L:</label><input autocomplete="off" class="w-32px h-15px" id="inLab_L" type="text" maxlength="3" size="4">
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="7" v-model="setting.channel">a:</label><input autocomplete="off" class="w-32px h-15px" id="inLab_a" type="text" maxlength="4" size="4">
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="8" v-model="setting.channel">b:</label><input autocomplete="off" class="w-32px h-15px" id="inLab_b" type="text" maxlength="4" size="4">
      </div>
      <div class="absolute left-310px top-235px grid cols-2 rows-3 gap-row-1" style="grid-template-columns: 35px auto;">
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="0" v-model="setting.channel">R:</label><input autocomplete="off" class="w-32px h-15px" id="inRGB_R" type="text" maxlength="3" size="3">
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="1" v-model="setting.channel">G:</label><input autocomplete="off" class="w-32px h-15px" id="inRGB_G" type="text" maxlength="3" size="3">
        <label class="first-col flex justify-between items-center"><input type="radio" name="channel" value="2" v-model="setting.channel">B:</label><input autocomplete="off" class="w-32px h-15px" id="inRGB_B" type="text" maxlength="3" size="3">
      </div>
      <div class="absolute left-430px top-235px grid cols-2 rows-3 gap-row-1" style="grid-template-columns: 55px auto;place-items: center;justify-items: end;">
        <label class="flex justify-between items-center">C:<input autocomplete="off" class="w-32px h-15px" id="inCMYK_C" type="text" maxlength="3" size="3"></label>%
        <label class="flex justify-between items-center">M:<input autocomplete="off" class="w-32px h-15px" id="inCMYK_M" type="text" maxlength="3" size="3"></label>%
        <label class="flex justify-between items-center">Y:<input autocomplete="off" class="w-32px h-15px" id="inCMYK_Y" type="text" maxlength="3" size="3"></label>%
        <label class="flex justify-between items-center">K:<input autocomplete="off" class="w-32px h-15px" id="inCMYK_K" type="text" maxlength="3" size="3"></label>%
      </div>
      <div id="cscolorzone">
        <div id="cscolor"><div style="position:absolute;top:-50%;transform: translateX(-50%);left:50%">新的</div></div>
        <div id="csactive"><div style="position:absolute;bottom:-50%;left:50%;transform: translateX(-50%);">当前</div></div>
        <div id="cshtmlcolor" class="hidden"></div>
      </div>
      <div class="absolute left-310px top-310px"><label for="inHEX"># </label><input autocomplete="off" class="w-82px h-15px" style="font-family: menlo;" id="inHEX" type="text" maxlength="7" size="7"></div>
      <div class="absolute top-0 hidden"><label for="outHTML">HTML Color Name: </label><input id="outHTML" type="text" maxlength="20" size="15"></div>

      <div class="button confirm" @click.native="confirm">确认</div>
      <div class="button cancel" @click.native="cancel">取消</div>
      <div class="button palette">添加到色板</div>
      <div class="button colorLib">颜色库</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// import './color.js'
import {ColorSelector} from './colorselector.js'
import { onBeforeUnmount, onMounted,watch } from 'vue';
import { useSettingStore } from '~/stores/setting';
const setting = useSettingStore()
const props = withDefaults(defineProps<{
  selectorColor?:string,
}>(),{
  selectorColor:'#ffffff',
});
const emit = defineEmits(['update:selectorColor','cancel'])
let colorSelector:ColorSelector;
onMounted(()=>{
  $('#csactive').css('background-color',props.selectorColor)
  colorSelector = new ColorSelector();
})
const confirm = ()=>{
  let targetColor = $('#cscolor').css('background-color')
  $('#csactive').css('background-color',targetColor)
  emit('update:selectorColor',targetColor)
  emit('cancel')
}
const cancel = ()=>{
  emit('cancel')
}
onBeforeUnmount(()=>{
  colorSelector.discard()
})
</script>
<style lang="scss">
.ColorSelector {
  --width:522px;
  --height:376px;
  width:var(--width);
  height:var(--height);
  left:calc(50% - var(--width) / 2);
  top:calc(50% - var(--height) / 2);
  position: absolute;
  // background-image: url(./colorSelectorBg.png);
  font-family:Chicago, sans-serif;
  font-size:12px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #757575, 0 0 0 2px #010201;
  overflow: hidden;
  canvas {
    border:1px solid black;
  }
  .first-col{
    display: flex;
    align-items: center;
    input{
      margin:0;
    }
    label{
      margin-left:10px;
    }
  }
  #cssquareselector {
    position:absolute;
    width:268px;
    height:268px;
    top:31px;
    left:11px;
    #cssquare {
      position:absolute;
      border:none;
      box-shadow: 0 0 1px #00000088;
    }
    #cssquarecursor {
      position:absolute;
      top:-7px;
      left:-7px;
      width:268px;
      height:268px;
      // cursor:crosshair;
    }
  }
  #csbarselector {
    position:absolute;
    left:279px;
    top:31px;
    width:19px;
    height:266px;
    #csbar {
      width: 100%;
      height: 256px;
      position:absolute;
      box-sizing: border-box;
      border:0;
      box-shadow: 0 0 1px #00000088;
    }
    #csbarcursor {
      position:absolute;
      top:0px;
      left:0px;
      height:256px;
      width: 100%;
      box-sizing: border-box;
      cursor:pointer;
      #csbarcursorimage {
        width:100%;
        background: blue;
        position: absolute;
        // &:before{
        //   content:'';
        //   position: absolute;
        //   left:-6px;
        //   border:6px solid transparent;
        //   border-left:6px solid black;
        //   transform: translateY(-50%);
        //   filter:drop-shadow(0 0 1px #000);
        // }
        // &:after{
        //   content:'';
        //   position: absolute;
        //   right:-6px;
        //   border:6px solid transparent;
        //   border-right:6px solid black;
        //   transform: translateY(-50%);
        //   filter:drop-shadow(0 0 1px #000);
        // }
      }
    }
  }
  #cscolorzone {
    position: absolute;
    left:311px;
    top:48px;
    width:59px;
    height:67px;
    display: flex;
    flex-direction: column;
    border:1px solid black;
    #cscolor {
      width:59px;
      height:35px;
      position:absolute;
      top:0;
      left:0;
    }
    #cshtmlcolor {
      width:24px;
      height:24px;
      position:absolute;
      top:11px;
      left:34px;
    }
    #csactive {
      width:59px;
      height:32px;
      position:absolute;
      top:35px;
      left:0;
    }
  }
}
.button {
  position: absolute;
  left: 419px;
  width: 91px;
  height: 25px;
  background-color: transparent;
  border-radius: 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  &.confirm {
    border: 1px solid #dadada;
    top: 10px;
    &:active {
      background-color: #dadada;
      color: #393939;
    }
  }
  &.cancel {
    border: 1px solid #686868;
    top: 45px;
    &:active {
      background-color: #686868;
      color: #393939;
    }
  }
  &.palette {
    border: 1px solid #686868;
    top: 77px;
    &:active {
      background-color: #686868;
      color: #393939;
    }
  }
  &.colorLib {
    border: 1px solid #686868;
    top: 119px;
    &:active {
      background-color: #686868;
      color: #393939;
    }
  }
}

.hex, .html {
  margin-left:5px;
}
</style>