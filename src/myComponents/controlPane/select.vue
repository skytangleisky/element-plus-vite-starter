<template>
  <span class="label">{{ modelValue.label }}</span>
  <div class="value" style="display: flex;align-items: center;">
    <el-select style="margin:3px 3px 3px 4px;" v-model="modelValue.value" filterable :placeholder="modelValue.placeholder" size="small">
      <el-option
        v-for="item in modelValue.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>
<script lang="ts" setup>
  import { interfaceSelect } from './def';
  const modelValue = defineModel<interfaceSelect>('modelValue',{
    default:{}
  })
</script>