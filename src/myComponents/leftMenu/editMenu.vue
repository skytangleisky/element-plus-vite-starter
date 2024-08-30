<template>
  <VueDraggable class="drag-area dd" tag="ol" v-model="list" group="g1">
    <subEditMenu :json="modelValue"></subEditMenu>
  </VueDraggable>
</template>
<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { computed,ref,reactive } from 'vue'
import subEditMenu from "./subEditMenu.vue";

interface IList {
  name: string
  children: IList[]
}

interface Props {
  modelValue?: IList[]
}

const props = withDefaults(defineProps<Props>(),{
  modelValue:()=>reactive([])
})

interface Emits {
  (e: 'update:modelValue', value: IList[]): void
}

const emits = defineEmits<Emits>()
const list = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value)
})
</script>
<style scoped>
.drag-area {
  min-height: 50px;
  outline: 1px dashed;
}
</style>