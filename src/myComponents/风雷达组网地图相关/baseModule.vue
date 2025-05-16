<template>
  <div class="map-module-box">
    <div class="map-module-top">
      <span>{{ props.title}}</span>
      <span @click="showTags = !showTags" class="map-module-top-icon">
                <el-icon v-show="showTags"><ArrowUp/></el-icon>
                <el-icon v-show="!showTags"><ArrowDown/></el-icon>
            </span>
    </div>
    <div class="map-module-bottom" v-show="showTags">
      <slot ></slot>

    </div>
  </div>
</template>

<script setup lang="ts">
import{ref} from 'vue'
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";
const props = defineProps({
  title: String,
  // 默认是否折叠
  isFold:{
    type: Boolean,
    default: false
  }
})
let showTags = ref(!props.isFold);
</script>

<style scoped lang="scss">

</style>