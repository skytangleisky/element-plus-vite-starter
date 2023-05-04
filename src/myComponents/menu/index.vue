<template>
  <ol class="menu absolute flex items-start content-center flex-row m-0 h-full p-0" style="min-width: 100%;overflow: hidden;"><!--导航栏-->
    <my-map></my-map>
    <box tabindex="-1" class="mybox" style="position: absolute;top:100px;">{{ t("tl.Success") }}</box>
    <li tabindex="-1" v-for="(item,index) in list" :key="index" @mouseenter="mouseenter">
      {{ item.name }}
      <ol class="absolute flex-col left-0 p-0 top-100%" v-if="item.children" :style="'left:' + (item.left?'-1em':'0')"><!--一级菜单-->
        <submenu :item.sync="item"></submenu>
      </ol>
    </li>
  </ol>
</template>
<script lang="ts" setup>
  import Box from '../../myComponents/box.vue'
  import myMap from '../map/index.vue'
  import { ref, watch } from 'vue'
  import submenu from './menu.vue'
  import menusData from './menusData'
  import { Item } from './def'
  import { useLocale } from 'element-plus'
  let { t } = useLocale()
  type Props = {
    list?: Item[]
  }
  const props = withDefaults(defineProps<Props>(), {
    list: () => ref(menusData).value
  })
  watch(props.list,newVal=>{
    console.log('>>>',newVal)
  })
  const mouseenter = (e:any) => {
    if($(e.target.parentNode).is(':has(li:focus-within)')){
      e.target.focus()
    }
  }
</script>
<style lang="scss">
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