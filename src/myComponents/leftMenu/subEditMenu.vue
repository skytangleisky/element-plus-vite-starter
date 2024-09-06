<template>
  <li
    v-for="item in routes" :key="item.name"
    :class="`dd-item ${item.children?'children':''}`"
    :data-id="item.name"
  >
    <div style="display: flex;align-items: center;">
      <el-icon  v-if="item.children" :class="`${item.expand?'':'dd-collapsed'}`" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;" @click="item.expand=!item.expand">
        <div class="dd-collapse cross" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div style="width: 10px;height: 10px;border-radius: 50%;background: white;z-index: 1;border:1px solid black;"></div>
          <svg viewBox="0 0 200 200" style="width:8px;height:8px;position:absolute;z-index:1">
              <path id="morph" fill="black" />
          </svg>
        </div>
      </el-icon>
      <div class="dd-handle w-full h-full relative" :style="`border-radius: 10px;display: flex;align-items: center;opacity: ${!item.meta.roles||intersection(setting.targetRoles,item.meta.roles)?'1':'0.5'};`">
        <!-- <el-checkbox style="height: fit-content;" v-model="item.hide"></el-checkbox> -->
        <el-icon @click="item.hide=!item.hide" style="cursor:pointer;font-size: large;">
          <Hide v-if="item.hide"/>
          <View v-else/>
        </el-icon>
        <div class="b-var(--text-primary-color) b-1px p-2px " style="height: 100%;display: flex;align-items: center;border-style: solid;position:relative">
          <Icons v-model:svg="item.svg"></Icons>
          {{ item.meta?.label }}
        </div>
        {{ item.meta.roles }}
        <div style="position: absolute;right:0">
          <el-icon v-dompurify-html="format('d6a8e59f-f348-40ab-a9e5-3d80da39b23d')" style="font-size: large" @click="browse(item)"></el-icon>
          <el-icon v-dompurify-html="format('8ce6fb28-177a-4874-a77e-2917edd852b1')" style="font-size: large" @click="remove(item)"</el-icon>
          <el-icon v-dompurify-html="format('271fa7c1-e1ae-4081-9efe-fb8ae1d41f69')" style="font-size: large" </el-icon>
        </div>
      </div>
    </div>
    <VueDraggable :class="`drag-area ${item.expand?'':'dd-collapsed'}`" :style="`interpolate-size: allow-keywords;transition:height 0.5s;transition-timing-function:ease-in-out;overflow: hidden;padding:0;height: ${item.expand?'auto':'0px'}`" tag="ul" v-model="item.children" group="g1">
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
