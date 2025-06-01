<template>
  <li
    v-for="item in routes" :key="item.name"
    :class="`dd-item ${item.children?'children':''}`"
    :data-id="item.name"
  >
    <div style="display: flex;align-items: center;">
      <el-icon  v-if="item.children" :class="`${item.expand?'':'dd-collapsed'}`" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div class="dd-collapse cross" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div style="width: 10px;height: 10px;border-radius: 50%;background: white;z-index: 1;border:1px solid black;" @click="item.expand=!item.expand"></div>
          <svg viewBox="0 0 200 200" style="width:8px;height:8px;position:absolute;z-index:1;pointer-events: none;">
              <path id="morph" fill="black" />
          </svg>
        </div>
      </el-icon>
      <div class="dd-handle" :style="`border-radius: 10px;display: flex;align-items: center;opacity: ${!item.meta.roles||intersection(setting.targetRoles,item.meta.roles)?'1':'0.5'};width:100%;height:100%;position:relative`">
        <!-- <el-checkbox style="height: fit-content;" v-model="item.hide"></el-checkbox> -->
        <el-icon @click="item.hide=!item.hide" style="cursor:pointer;font-size: large;">
          <Hide v-if="item.hide"/>
          <View v-else/>
        </el-icon>
        <div style="height: 100%;display: flex;align-items: center;border-style: solid;position:relative;border:1px solid var(--text-primary-color);padding:2px;">
          <Icons v-model:svg="item.svg"></Icons>
          {{ item.meta?.label }}
        </div>
        {{ item.meta.roles }}
        <div style="position: absolute;right:0">
          <el-icon v-dompurify-html="format('d6a8e59f-f348-40ab-a9e5-3d80da39b23d')" style="font-size: large" @click="browse(item)"/>
          <el-icon v-dompurify-html="format('8ce6fb28-177a-4874-a77e-2917edd852b1')" style="font-size: large" @click="remove(item)"/>
          <el-icon v-dompurify-html="format('271fa7c1-e1ae-4081-9efe-fb8ae1d41f69')" style="font-size: large"/>
        </div>
      </div>
    </div>
    <VueDraggable :class="`drag-area ${item.expand?'':'dd-collapsed'}`" :style="`interpolate-size: allow-keywords;transition:height 0.3s;transition-timing-function:ease-in-out;overflow: hidden;padding:0;height: ${item.expand?'auto':'0px'}`" tag="ul" v-model="item.children" group="g1">
      <subEditMenu :routes="item.children" :path="path+item.path+'/'"></subEditMenu>
    </VueDraggable>
  </li>
</template>
<script lang="ts" setup>
import Icons from "./Icons.vue"
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore()
function browse(item:Item){
  window.open(path+item.path,'_blank')
}
function remove(item:Item){
  console.log(item)
  if(routes.indexOf(item)>=0){
    routes.splice(routes.indexOf(item),1)
  }
}
import { checkPermission,intersection } from "~/tools";
// import { VueDraggable } from 'vue-draggable-plus'
import { VueDraggable } from '../../../packages/vue-draggable-plus/component'
import { Hide, View } from "@element-plus/icons-vue";
type Item = {
  name:string,
  children:Array<Item>,
  expand:boolean,
  hide:boolean,
  component:string,
  svg:string,
  path:string,
  meta:{
    label:string
    roles:Array<string>
  }
}
const { routes,path } = defineProps({
  routes: {
    type: Array<Item>,
    default: [],
  },
  path:{
    type: String,
    default:'/'
  }
});
import { useIconStore } from "~/stores/icon";
const icon = useIconStore();
const format = (svg: string) => {
  let res = icon.row.icon_tree.filter((it) => it.uuid == svg);
  if (res.length <= 0) {
    return "";
  } else if (res.length == 1) {
    return res[0].svg;
  } else {
    throw Error("uuid duplication!");
  }
};
</script>
