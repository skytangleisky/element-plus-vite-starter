<template>
  <div @click="modelValue.opened=!modelValue.opened" class="folder" tabindex="-1">
    <span class="label">{{ modelValue.label }}</span>
    <div class="value" style="flex:1;display: flex;align-items: center;justify-content: right;">
      <div class="logo_symbol" :style="`transform: rotate(${modelValue.opened?'0deg':'90deg'});transition:transform 0.2s linear;`"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import type {interfaceFolder} from './def'
  const modelValue = defineModel<interfaceFolder>('modelValue',{
    default:{}
  })
</script>
<style lang="scss">
  .logo_symbol{
    --fg-color: var(--tp-container-foreground-color);
    display: block;
    --size:6px;
    height: var(--size);
    width: var(--size);
    background: linear-gradient(to left, var(--fg-color), var(--fg-color) calc(var(--size) / 3), transparent calc(var(--size) / 3), transparent calc(var(--size) / 3 * 2), var(--fg-color) calc(var(--size) / 3 * 2), var(--fg-color));
    border-radius: 4px;
    // animation: auto linear 0s 1 normal none running rotateAnimation normal normal;
  }
</style>