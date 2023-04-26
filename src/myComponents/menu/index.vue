<template>
  <ol class="menu flex items-center content-center flex-row m-0"><!--导航栏-->
    <li tabindex="-1" v-for="(item,index) in list" :key="index">
      {{ item.name }}
      <ol class="absolute flex-col left-0 p-0 top-100%" v-if="item.children" :style="'left:' + (item.left?'-1em':'0')"><!--一级菜单-->
        <submenu :item.sync="item"></submenu>
      </ol>
    </li>
  </ol>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import submenu from './menu.vue'
  import menusData from './menusData'
  import { Item } from './def'
  type Props = {
    list?: Item[]
  }
  const props = withDefaults(defineProps<Props>(), {
    list: () => ref(menusData).value
  })
  watch(props.list,newVal=>{
    console.log('>>>',newVal)
  })
</script>
<style lang="scss">
  ol{
    user-select: none;
    list-style: none;
    position: relative;
    display: none;
    // background: lightgrey;
    li{
      position: relative;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      line-height: 100%;
      white-space: nowrap;
      padding: 1px 4px 1px 4px;
      cursor:default;
    }
    &:focus-within li:hover>ol{
      display: flex;
    }
  }
  .menu{
    background-color: transparent;
    &>li:hover{
      background-color: rgba(150, 150, 150, .5);
      border-radius: 4px;
      li{
        align-items: center;
        justify-content: space-between;
        &:hover{
          background-color: rgba(62, 110, 197, .5);
          border-radius: 4px;
        }
        &:has(ol:hover){
          background-color: rgba(150, 150, 150, .5);
        }
        &:hover:not(:has(ol:hover)):not(:has(ol)):active{
          background-color: rgba(62, 110, 197, .9);
        }
      }
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
    &>li{
      padding:0 8px 0 8px;
    }
  }
  .dark .menu{
    background-color:transparent;
    &>li:hover{
      background-color: rgba(84, 84, 84, .5);
      li{
        &:hover{
          background-color: rgba(62, 110, 197,.5);
        }
        &:has(ol:hover){
          background-color: rgba(84, 84, 84, .5);
        }
        &:hover:not(:has(ol:hover)):not(:has(ol)):active{
          background-color: rgba(62, 110, 197, .9);
        }
      }
    }
    li>ol{
      &::before{
        content:'';
        border:1px solid #666;
        box-shadow: 0 0 4px #000;
        background-color: rgba(42, 42, 40, .5);
      }
    }
  }
</style>