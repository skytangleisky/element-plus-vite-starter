<template>
  <li v-for="(item,index) in list" :key="index">
    <el-icon v-if="item.left"></el-icon>
    <span style="flex-grow: 1;display:flex;justify-content: left;">{{ item.name }}</span>
    <el-icon v-if="item.children"><CaretRight></CaretRight></el-icon>
    <ol class="absolute flex-col hidden p-0 left-100% top-0" v-if="item.children"><!--二、三、...级菜单-->
      <submenu :list="item.children"></submenu>
    </ol>
  </li>
</template>
<script lang="ts" setup>
  import { CaretRight, Select } from '@element-plus/icons-vue'
  interface Item{
    name:String;
    children?:Array<Item>;
    left?:Boolean;
  }
  type Props = {
    list?: Item[]
  }
  withDefaults(defineProps<Props>(), {
    list: () => []
  })
</script>
<script lang="ts">
  export default{
    name: 'submenu'
  }
</script>