<template>
  <span class="label">{{ modelValue.label }}</span>
  <div class="value" style="display: flex;align-items: center;">
    <div style="margin:3px 3px 3px 4px">{{ modelValue.value }}</div>
  </div>
</template>
<script lang="ts" setup>
  import { interfaceText } from './def';
  const modelValue = defineModel<interfaceText>('modelValue',{
    default:{}
  })
</script>