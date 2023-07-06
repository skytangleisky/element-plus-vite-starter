<template>
  <ol class="menu relative flex items-start content-center flex-row h-full m-0 pl-1em" style="overflow: hidden;"><!--导航栏-->
    <my-map></my-map>
    <slot></slot>
    <box class="info-box" right bottom>
      <span>Level<span>{{ data.level }}</span></span>
      <span>Tiles<span>{{ data.tiles }}</span></span>
      <span>Framerate(FPS)<span>{{ data.fps }}</span></span>
      <span>Draw call<span>{{ data.drawCall }}</span></span>
      <span>Frame time(ms)<span>{{ data.frameTime }}</span></span>
      <span>Period time(ms)<span>{{ data.periodTime }}</span></span>
      <span>Occupy(%)<span>{{ data.occupy }}</span></span>
      <span>Instance Count<span>{{ data.instanceCount }}</span></span>
      <span>Triangle <span>{{ data.triangle }}</span></span>
      <span>Game Logic(ms)<span>{{ data.gameLogic }}</span></span>
      <span>Physics(ms)<span>{{ data.physics }}</span></span>
      <span>Renderer(ms)<span>{{ data.renderer }}</span></span>
      <span>GFX Texture Mem (M)<span>{{ data.texture }}</span></span>
      <span>GFX Buffer Mem (M)<span>{{ data.buffer }}</span></span>
      <span>Thead<span>{{ data.thead }}</span></span>
    </box>
    <my-dialog></my-dialog>
    <dialog-plan-request class="z-1" v-model:show="planShow"></dialog-plan-request>
    <dialog-prev-request class="z-2" v-model:show="prevShow"></dialog-prev-request>
    <li tabindex="-1" v-for="(item,index) in list" :key="index" @mouseenter="mouseenter">
      {{ item.name }}
      <ol class="absolute flex-col left-0 p-0 top-100% z-99999" v-if="item.children" :style="'left:' + (item.left?'-1em':'0')"><!--一级菜单-->
        <submenu :item.sync="item"></submenu>
      </ol>
    </li>
  </ol>
</template>
<script lang="ts" setup>
  import { eventbus } from '~/eventbus'
  import Box from '../../myComponents/box.vue'
  import myMap from '../map/index.vue'
  import { ref, watch, onMounted, onBeforeUnmount, reactive } from 'vue'
  import submenu from './menu.vue'
  import menusData from './menusData'
  import { Item } from './def'
  import { useLocale } from 'element-plus'
  import myDialog from '../dialog.vue'
  import DialogPlanRequest from '../dialog_plan_request.vue'
  import DialogPrevRequest from '../dialog_prev_request.vue'
  let { t } = useLocale()
  type Props = {
    list?: Item[]
  }
  const props = withDefaults(defineProps<Props>(), {
    list: () => ref(menusData).value
  })
  watch(props.list,newVal=>{
    // console.log('>>>',newVal)
  })
  const mouseenter = (e:any) => {
    if($(e.target.parentNode).is(':has(li:focus-within)')){
      e.target.focus()
    }
  }
  const data = reactive({
    level:'X',
    fps:'X',
    drawCall:'X',
    frameTime:'X',
    periodTime:'X',
    occupy:'X',
    instanceCount:'X',
    triangle:'X',
    gameLogic:'X',
    physics:'X',
    renderer:'X',
    texture:'X',
    buffer:'X',
    tiles:'X',
    thead:'X',
  })
  const planShow = ref(false)
  const prevShow = ref(false)
  let procInfo = (info:any)=>{
    Object.assign(data,info)
  }
  const procStationMenu = (currentStation:any,target:string)=>{
    if(target=='作业申请'){
      prevShow.value = false
      planShow.value = true
    }else if(target=='作业预报'){
      planShow.value = false
      prevShow.value = true
    }
    console.log(currentStation,target)
  }
  onMounted(()=>{
    eventbus.on('systemInfo',procInfo)
    eventbus.on('站点列表菜单点击',procStationMenu)
  })
  onBeforeUnmount(()=>{
    eventbus.off('systemInfo',procInfo)
    eventbus.off('站点列表菜单点击',procStationMenu)
  })
</script>
<style lang="scss">
  .info-box{
    position: absolute;right:0;bottom:0;
  }
  ol{
    user-select: none;
    list-style: none;
    position: relative;
    display: none;
    // background: lightgrey;
    li{
      outline: none;
      position: relative;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      line-height: 100%;
      white-space: nowrap;
      padding: 1px 4px 1px 4px;
      cursor:default;
    }
    li:focus-within>ol{
      display: flex;
    }
  }
  .menu{
    background-color: transparent;
    &>li{
      padding:0 8px 0 8px;
    }
    li>ol{
      padding: 4px;
      &::before{
        content:'';
        border:1px solid #222;
        box-shadow: 0 0 4px #000;
        box-sizing: border-box;
        border-radius: 4px;
        left:0;
        top:0;
        height: 100%;
        width: 100%;
        position: absolute;
        background-color: rgba(128, 128, 128, .5);
        backdrop-filter: blur(4px);
      }
    }
    &>li:focus-within{
      background-color: rgba(150, 150, 150, .5);
      border-radius: 4px;
      li{
        align-items: center;
        justify-content: space-between;
        &:focus-within:has(ol){
          background-color: rgba(150, 150, 150, .5);
        }
        &:focus-within:not(:has(ol:hover)):hover{
          background-color: rgba(62, 110, 197, 1);
          border-radius: 4px;
        }
        // &:focus-within:not(:has(ol:hover)):not(:has(ol)):active{
        //   background-color: rgba(62, 110, 197, .5);
        // }
        // &:not(:has(ol)).play{
        //   animation: identifier 1000ms;
        // }
        // @keyframes identifier {
        //   0% {opacity: 0;}
        //   100% {opacity: 0;}
        // }
      }
    }
  }
</style>