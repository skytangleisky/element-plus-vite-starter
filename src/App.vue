<template>
  <el-config-provider namespace="ep" :locale="locale">
    <container v-model:value.sync="locale"></container>
  </el-config-provider>
</template>
<script setup>
import Container from './container.vue'
import { useLocale } from 'element-plus'
import { ref } from 'vue'
import zhCn from './languages/zh-cn.mjs'
import en from './languages/en.mjs'
let locale = ref(zhCn)
if(localStorage.getItem('language')==='en'){
  locale = ref(en)
}else{
  localStorage.setItem('language','zh-cn')
}


</script>