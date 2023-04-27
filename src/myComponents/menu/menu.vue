<template>
  <li v-for="(v,k) in item?.children" @click.native="(e:Event)=>v.onClick&&v.onClick(e,item,k)" :key="k" :style="'pointer-events:'+(v.name?'auto':'none')">
    <template v-if="v.name">
      <el-icon v-if="item?.left" style="overflow: hidden;">
        <img v-if="v.leftImgSrc" :src="v.leftImgSrc" class="leftImg w-full h-full">
      </el-icon>
      <span style="flex-grow: 1;display:flex;justify-content: left;">{{ v.name }}</span>
      <el-icon v-if="item?.right" style="overflow: hidden;">
        <img v-if="v.children" src="/src/assets/caretRight.svg" class="rightImg w-full h-full">
      </el-icon>
      <ol class="absolute flex-col hidden p-0 left-100% top--4px" v-if="v.children"><!--二、三、...级菜单-->
        <submenu :item.sync="v"></submenu>
      </ol>
    </template>
    <div v-else class="devide"/>
  </li>
</template>
<script lang="ts" setup>
  import { Item } from './def'
  type Props = {
    item?: Item
  }
  const { item } = defineProps<Props>()
</script>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'submenu'
  })
</script>
<style>
  .leftImg{
    filter:drop-shadow(var(--ep-text-color-primary) 0 60px);
    transform: translateY(-60px);
  }
  .rightImg{
    filter:drop-shadow(var(--ep-text-color-primary) 0 60px);
    transform: translateY(-60px);
  }
  .devide{
    height: 1px;
    background-color:#00000044;
    width:100%;
  }
  .dark .devide{
    background-color:#ffffff44;
  }
</style>