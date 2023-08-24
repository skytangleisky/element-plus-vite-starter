<template>
  <div class="bg-white dark:bg-black"  style="border-radius:8px;overflow: hidden;margin:8px;">
    <div class="w-full h-30px left-0 box-border flex flex-row justify-between items-center p-r-10px p-l-10px" @click="click">
      <div style="font-size: 20px;color:rgb(78,129,184)">{{ title }}</div>
      <el-icon :class="`${show?'rotate-180deg':'rotate-0eg'}`" style="transition:all 300ms">
        <svg t="1692335429583" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9958" width="200" height="200"><path d="M64 320l64-64 384 384L896 256l64 64-448 448z" p-id="9959" data-spm-anchor-id="a313x.search_index.0.i4.4d423a814g60B1" class="selected"></path></svg>
      </el-icon>
    </div>
    <el-collapse-transition>
      <div v-show="show" style="display: flex;flex-direction: column;padding: 0 10px;">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script lang="ts" setup>
  const emit = defineEmits(['update:show'])
  const click = () => {
    emit("update:show",!props.show)
  }
  const props = defineProps({
    title:{
      type:String,
      default:'title',
    },
    show:{
      type:Boolean,
      default:true,
    }
  })
</script>
