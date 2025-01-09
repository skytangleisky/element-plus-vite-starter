<template>
  <div class="control-pane">
    <ul>
      <SubItem v-for="(item,key) in list" :key="key" :item="item"></SubItem>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import type { Item } from './def'
import SubItem from './SubItem.vue'
import { reactive } from 'vue';
const list = defineModel<Item[]>('list',{
  default:()=>reactive([])
})
</script>
<style lang="scss">
.control-pane{
  --tp-base-background-color: hsla(230, 7%, 17%, 1);
  --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
  --tp-button-background-color: hsla(230, 7%, 70%, 1);
  --tp-button-background-color-active: hsla(230, 7%, 85%, 1);
  --tp-button-background-color-focus: hsla(230, 7%, 80%, 1);
  --tp-button-background-color-hover: hsla(230, 7%, 75%, 1);
  --tp-button-foreground-color: hsla(230, 7%, 17%, 1);
  --tp-container-background-color: hsla(230, 7%, 75%, 0.1);
  --tp-container-background-color-active: hsla(230, 7%, 75%, 0.25);
  --tp-container-background-color-focus: hsla(230, 7%, 75%, 0.2);
  --tp-container-background-color-hover: hsla(230, 7%, 75%, 0.15);
  --tp-container-foreground-color: hsla(230, 7%, 75%, 1);
  --tp-groove-foreground-color: hsla(230, 7%, 75%, 0.1);
  --tp-input-background-color: hsla(230, 7%, 75%, 0.1);
  --tp-input-background-color-active: hsla(230, 7%, 75%, 0.25);
  --tp-input-background-color-focus: hsla(230, 7%, 75%, 0.2);
  --tp-input-background-color-hover: hsla(230, 7%, 75%, 0.15);
  --tp-input-foreground-color: hsla(230, 7%, 75%, 1);
  --tp-label-foreground-color: hsla(230, 7%, 75%, 0.7);
  --tp-monitor-background-color: hsla(230, 7%, 0%, 0.2);
  --tp-monitor-foreground-color: hsla(230, 7%, 75%, 0.7);
  position: absolute;
  background:var(--tp-base-background-color);
  box-shadow: 0 2px 4px var(--tp-base-shadow-color);
  border-radius: 6px;
  font-size: 11px;
  font-family: Roboto Mono, Source Code Pro, Menlo, Courier, monospace;
  --border-width:4px;
  --padding-left:4px;
  ul,li{
    list-style: none;
    margin:0;
    padding:0;
  }
  .control-item{
    &:has(.folder):has(>.item){
      border-left: var(--border-width) solid var(--tp-container-background-color);
    }
    &:has(.folder):has(>.item:hover){
      border-left: var(--border-width) solid var(--tp-container-background-color-hover);
    }
    &:has(.folder):has(>.item:active),&:has(.folder):has(>.item:active:hover){
      border-left: var(--border-width) solid var(--tp-container-background-color-active);
    }
    &:has(.folder):has(>.item:focus-within){
      border-left: var(--border-width) solid var(--tp-container-background-color-focus);
    }
    .control-item{
      margin-left: var(--padding-left);
    }
  }
  .control-item{
    display: flex;
    flex-direction: column;
    .item{
      flex:1;
      display: flex;
      flex-direction: row;
      position: relative;
      .label{
        flex:1;
        padding:4px 0 4px 6px;
        width: auto;
        color:var(--tp-label-foreground-color);
      }
      &:has(.folder) .label{
        color:var(--tp-container-foreground-color);
      }
      .value{
        width:150px;
      }
      .folder{
        display: flex;
        flex:1;
        background-color: var(--tp-container-background-color);
        padding-right: 6px;
        &:hover{
          background-color: var(--tp-container-background-color-hover);
        }
        &:active,&:active:hover{
          background-color: var(--tp-container-background-color-active);
        }
        &:focus-within{
          background-color: var(--tp-container-background-color-focus);
        }
      }
    }
  }
}

</style>