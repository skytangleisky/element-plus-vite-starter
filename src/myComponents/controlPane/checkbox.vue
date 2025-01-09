<template>
  <span class="label">{{ modelValue.label }}</span>
  <div class="value" style="display: flex;align-items: center;">
    <input style="display: flex;justify-content: left;" :name="Math.random().toString()" type="checkbox" v-model="modelValue.value">
  </div>
</template>
<script lang="ts" setup>
  import { interfaceCheckbox } from './def';
  const modelValue = defineModel<interfaceCheckbox>('modelValue',{
    default:{}
  })
</script>