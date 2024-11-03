<template>
  <li
    :class="`dd-item ${permission.children?'children':''}`"
  >
    <div style="display: flex;align-items: center;">
      <el-icon  v-if="permission.children" :class="`${permission.expand?'':'dd-collapsed'}`" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div class="dd-collapse cross" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div style="width: 10px;height: 10px;border-radius: 50%;background: white;z-index: 1;border:1px solid black;" @click="permission.expand=!permission.expand"></div>
          <svg viewBox="0 0 200 200" style="width:8px;height:8px;position:absolute;z-index:1;pointer-events: none;">
              <path id="morph" fill="black" />
          </svg>
        </div>
      </el-icon>
      <div class="dd-handle w-full h-full relative" :style="`border-radius: 10px;display: flex;align-items: center;opacity: ${!permission.meta.roles||intersection(setting.targetRoles,permission.meta.roles)?'1':'0.5'};`">
        <input type="checkbox" style="height: fit-content;" v-model="permission.checked" :indeterminate.prop="permission.indeterminate" @change="onCheckChange(($event as any).target.checked)"></input>
        <!-- <el-checkbox style="height: fit-content;" v-model="permission.checked" :indeterminate="permission.indeterminate" @change="onCheckChange"></el-checkbox> -->
        <div class="b-var(--text-primary-color) b-1px p-2px " style="height: 100%;display: flex;align-items: center;border-style: solid;position:relative">
          {{ permission.meta?.label }}
        </div>
        {{ permission.meta.roles }}
      </div>
    </div>
    <VueDraggable :class="`drag-area ${permission.expand?'':'dd-collapsed'}`" :style="`interpolate-size: allow-keywords;transition:height 0.3s;transition-timing-function:ease-in-out;overflow: hidden;padding:0;height: ${permission.expand?'auto':'0px'}`" tag="ul" v-model="permission.children" group="gp">
      <subPermission v-for="permission in permission.children" :permission="permission" @update:checked="updateChildChecked"></subPermission>
    </VueDraggable>
  </li>
</template>
<script lang="ts" setup>
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore()
import { intersection } from "~/tools";
// import { VueDraggable } from 'vue-draggable-plus'
import { VueDraggable } from '../../../packages/vue-draggable-plus/component'
type Permission = {
  name:string,
  children:Array<Permission>,
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
const { permission } = defineProps<{permission:Permission}>();
const emit = defineEmits(['update:checked']);

const onCheckChange = (checked:boolean) => {
  permission.checked = checked;
  permission.indeterminate = false;
  if (permission.children && permission.children.length) {
    permission.children.forEach((child) => {
      setChildChecked(child, checked);
    });
  }
  emit('update:checked', permission.name, permission.checked);
};

const setChildChecked = (child:Permission, checked:boolean) => {
  child.checked = checked;
  child.indeterminate = false;
  if (child.children && child.children.length) {
    child.children.forEach((subChild) => {
      setChildChecked(subChild, checked);
    });
  }
};

const updateChildChecked = () => {
  if (!permission.children || !permission.children.length) return;

  const allChecked = permission.children.every((child) => child.checked);
  const noneChecked = permission.children.every((child) => !child.checked && !child.indeterminate);

  if (allChecked) {
    permission.checked = true;
    permission.indeterminate = false;
  } else if (noneChecked) {
    permission.checked = false;
    permission.indeterminate = false;
  } else {
    permission.checked = false;
    permission.indeterminate = true;
  }

  emit('update:checked', permission.name, permission.checked);
};
</script>
