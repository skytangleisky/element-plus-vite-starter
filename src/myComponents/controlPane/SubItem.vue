<template>
  <li class="control-item">
    <div class="item">
      <Checkbox v-if="item.type=='checkbox'" v-model="item"></Checkbox>
      <Color v-else-if="item.type=='color'" v-model="item"></Color>
      <Range v-else-if="item.type=='range'" v-model="item"></Range>
      <Folder v-else-if="item.type=='folder'" v-model="item"></Folder>
      <Select v-else-if="item.type=='select'" v-model="item"></Select>
      <Text v-else-if="item.type=='text'" v-model="item"></Text>
      <Curve v-else-if="item.type=='curve'" v-model="item"></Curve>
      <Button v-else-if="item.type=='button'" v-model="item"></Button>
    </div>
    <ul v-if="item.type=='folder'" class="folder" :style="`interpolate-size: allow-keywords;transition:height .2s ease-in-out,opacity .2s linear;overflow: hidden;padding:0;height: ${item.opened?'auto':'0px'};opacity: ${item.opened?'1':'0'};`">
      <SubItem v-for="(item,key) in item.children" :key="key" :item="item"></SubItem>
    </ul>
  </li>
</template>
<script setup lang="ts">
import Curve from './curve.vue'
import Text from './text.vue'
import Select from './select.vue'
import Checkbox from './checkbox.vue'
import Color from './color.vue'
import Range from './range.vue'
import Folder from './folder.vue'
import Button from './button.vue'
import type {Item} from './def'
const item = defineModel<Item>('item',{
  default:()=>{}
})
</script>