<template>
  <ol class="menu flex items-center content-center flex-row m-0"><!--导航栏-->
    <li tabindex="-1" v-for="(item,index) in list" :key="index">
      {{ item.name }}
      <ol class="absolute flex-col p-0 left-0 top-100%" v-if="item.children"><!--一级菜单-->
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
    background-color: rgb(42, 42, 40);
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
  .menu{
    background-color: transparent;
    &>li:hover{
      background-color: rgb(53, 54, 51);
      border-radius: 4px;
      li{
        align-items: center;
        justify-content: space-between;
        &:hover{
          background-color: rgb(62, 110, 197);
          border-radius: 4px;
        }
        &:has(ol:hover){
          background-color: rgb(64, 64, 62);
        }
      }
    }
    li>ol{
      border:1px solid #fff;
      border-style:inset;
      border-radius: 4px;
      padding: 4px;
    }
    &>li{
      padding:0 8px 0 8px;
    }
  }
</style>