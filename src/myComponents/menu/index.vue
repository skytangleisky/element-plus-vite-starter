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
    background: lightgrey;
    li{
      position: relative;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      white-space: nowrap;
      padding: 0 4px 0 4px;
      cursor:default;
    }
    &:focus-within li:hover>ol{
      display: flex;
    }
  }
  .dark ol{
    background-color: rgb(42, 42, 40);
  }
  .menu{
    background-color: transparent;
    &>li:hover{
      background-color: lightgrey;
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
      }
    }
    li>ol{
      border:1px solid #00000044;
      box-shadow: 1px 1px 8px #000000 outset;
      border-radius: 4px;
      padding: 4px;
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
          background-color: rgb(62, 110, 197);
        }
        &:has(ol:hover){
          background-color: rgba(84, 84, 84, .5);
        }
      }
    }
    li>ol{
      border:1px solid #ffffff44;
      box-shadow: 1px 1px 8px #000000 outset;
      border-radius: 4px;
      padding: 4px;
    }
    &>li{
      padding:0 8px 0 8px;
    }
  }
</style>