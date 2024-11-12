<template>
  <li
    :class="`dd-item ${props.permission.children?'children':''}`"
  >
    <div style="display: flex;align-items: center;">
      <el-icon  v-if="props.permission.children" :class="`${props.permission.expand?'':'dd-collapsed'}`" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div class="dd-collapse cross" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div style="width: 10px;height: 10px;border-radius: 50%;background: white;z-index: 1;border:1px solid black;" @click="props.permission.expand=!props.permission.expand"></div>
          <svg viewBox="0 0 200 200" style="width:8px;height:8px;position:absolute;z-index:1;pointer-events: none;">
              <path id="morph" fill="black" />
          </svg>
        </div>
      </el-icon>
      <div class="dd-handle w-full h-full relative" :style="`border-radius: 10px;display: flex;align-items: center;opacity: ${!props.permission.meta.roles||intersection(setting.targetRoles,permission.meta.roles)?'1':'0.5'};`">
        <input type="checkbox" style="height: fit-content;" v-model="props.permission.checked" :indeterminate.prop="props.permission.indeterminate" @change="onCheckboxChange(permission)"></input>
        <!-- <el-checkbox style="height: fit-content;" v-model="permission.checked" :indeterminate="permission.indeterminate" @change="onCheckChange"></el-checkbox> -->
        <div class="b-var(--text-primary-color) b-1px p-2px " style="height: 100%;display: flex;align-items: center;border-style: solid;position:relative">
          {{ props.permission.meta?.label }}
        </div>
        {{ props.permission.meta.roles }}
      </div>
    </div>
    <VueDraggable :class="`drag-area ${props.permission.expand?'':'dd-collapsed'}`" :style="`interpolate-size: allow-keywords;transition:height 0.3s;transition-timing-function:ease-in-out;overflow: hidden;padding:0;height: ${props.permission.expand?'auto':'0px'}`" tag="ol" v-model="props.permission.children" group="gp">
      <subPermission v-for="p in props.permission.children" :permission="p" @update="emit('update')"></subPermission>
    </VueDraggable>
  </li>
</template>
<script lang="ts" setup>
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore()
import { intersection } from "~/tools";
// import { VueDraggable } from 'vue-draggable-plus'
import { VueDraggable } from '../../../packages/vue-draggable-plus/component'
type Node = {
  name:string,
  children:Array<Node>,
  expand:boolean,
  checked:boolean,
  indeterminate:boolean,
  hide:boolean,
  component:string,
  svg:string,
  path:string,
  meta:{
    label:string
    roles:Array<string>
  }
}
const props = defineProps<{permission:Node}>();
const emit = defineEmits(['update']);
const onCheckboxChange = (node:Node) => {
  // 设置节点及其所有子节点的状态
  if (node.checked !== undefined) {
    setNodeAndChildrenChecked(node, node.checked);
  }
  emit('update');
};
// 递归地设置节点及其子节点的 checked 状态
function setNodeAndChildrenChecked(node: Node, checked: boolean) {
  node.checked = checked;
  node.indeterminate = false;
  if (node.children) {
    node.children.forEach(child => setNodeAndChildrenChecked(child, checked));
  }
}
</script>
