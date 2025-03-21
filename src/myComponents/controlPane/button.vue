<template>
  <div class="control-button" style="margin:4px 2px 4px 6px" @click="modelValue.click($event)">{{ modelValue.label }}</div>
</template>
<script lang="ts" setup>
  import { interfaceButton } from './def';
  const modelValue = defineModel<interfaceButton>('modelValue',{
    default:{}
  })
</script>
<style scoped lang="scss">
.control-button{
  width:100%;
  border-radius: 2px;
  text-align: center;
  background: var(--tp-button-background-color);
  &:hover{
    background: var(--tp-button-background-color-hover);
  }
  &:active{
    background: var(--tp-button-background-color-active);
  }
  color: var(--tp-button-foreground-color)
}
</style>