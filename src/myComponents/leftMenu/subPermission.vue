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
<style lang="scss">
.dd {
  position: relative;
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  line-height: 20px;
}
.dd-item,
.dd-empty,
.dd-placeholder {
  display: block;
  position: relative;
  margin: 0;
  padding: 0;
  min-height: 0px;
  font-size: 13px;
  line-height: 20px;
  .menu-icon{
    cursor: pointer;
    box-sizing: border-box;
    border:1px solid transparent;
  }
  .menu-icon:hover{
    box-sizing: border-box;
    border:1px solid cyan;
  }
}

.dd-handle {
  display: block;
  height: 30px;
  // margin: 5px 0;
  padding: 5px 10px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
  border: 1px solid #ccc;
  background: #fafafa;
  // border-radius: 3px;
  box-sizing: border-box;

  &:hover {
    color: #2ea8e5;
    background: #fff;
  }
}
.cross{
  cursor: pointer;
  z-index: 1;
  #morph {
    d: path("M0,75 L200,75 200,125 0,125z");
  }
}
.dd-collapsed>.cross{
  #morph {
    d: path("M75,0 L125,0 125,75 200,75 200,125 125,125 125,200 75,200 75,125 0,125 0,75 75,75z");
  }
}
.dd-empty,
.dd-placeholder {
  // margin: 5px 0;
  padding: 0;
  min-height: 30px;
  background: #f2fbff;
  border: 1px dashed red;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.dd-empty {
  border: 1px dashed red;
  min-height: 100px;
  background-color: #e5e5e5;
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
}

.dd-dragel {
  position: absolute;
  pointer-events: none;
  z-index: 9999;

  &> .dd-item .dd-handle {
    margin-top: 0;
  }

  .dd-handle {
    box-shadow: 2px 4px 6px 0 rgba(0,0,0,.1);
  }
}

.dd-nochildren .dd-placeholder {
  display: none;
}
</style>
