<template>
  <li v-for="(v,k) in item.children" :key="k">
    <el-icon v-if="item.left">
      <img src="/src/assets/g.jpg" class="w-full h-full">
    </el-icon>
    <span style="flex-grow: 1;display:flex;justify-content: left;">{{ v.name }}</span>
    <el-icon v-if="v.children"><CaretRight></CaretRight></el-icon>
    <ol class="absolute flex-col hidden p-0 left-100% top-0" v-if="v.children"><!--二、三、...级菜单-->
      <submenu :item="v"></submenu>
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
    item?: Item
  }
  const { item } = defineProps<Props>()
</script>
<script lang="ts">
  export default{
    name: 'submenu'
  }
</script>