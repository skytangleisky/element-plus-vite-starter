<template>
  <span class="label">{{ modelValue.label }}</span>
  <div class="value" style="display: flex;align-items: center;">
    <label style="display: flex;align-items: center;width: 100%;"><input style="display: flex;" :name="Math.random().toString()" type="checkbox" v-model="modelValue.value"></label>
  </div>
</template>
<script lang="ts" setup>
  import { interfaceCheckbox } from './def';
  const modelValue = defineModel<interfaceCheckbox>('modelValue',{
    default:{}
  })
</script>