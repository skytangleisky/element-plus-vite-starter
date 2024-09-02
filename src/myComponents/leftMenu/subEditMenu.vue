<template>
  <li
    v-for="item in json"
    :class="`dd-item ${item.children?'children':''}`"
    :key="item.name"
    :data-id="item.name"
  >
    <div style="display: flex;align-items: center;">
      <el-icon  v-if="item.children" :class="`${item.collapsed?'dd-collapsed':''}`" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;" @click="item.collapsed=!item.collapsed">
        <div class="dd-collapse cross" style="position: absolute;width: 30px;height: 30px;left: 0;display: flex;align-items: center;justify-content: center;">
        <div style="width: 10px;height: 10px;border-radius: 50%;background: white;z-index: 1;border:1px solid black;"></div>
          <svg width="200" height="200" viewBox="0 0 200 200" style="width:8px;height:8px;position:absolute;z-index:1">
              <path id="morph" fill="black" />
          </svg>
        </div>
      </el-icon>
      <div class="dd-handle w-full h-full relative" style="border-radius: 10px;display: flex;align-items: center;">
        <!-- <el-checkbox style="height: fit-content;" v-model="item.hide"></el-checkbox> -->
        <el-icon @click="item.hide=!item.hide" style="cursor:pointer;font-size: large;">
          <Hide v-if="item.hide"/>
          <View v-else/>
        </el-icon>
        <div class="b-var(--text-primary-color) b-1px p-2px" style="height: 100%;display: flex;align-items: center;border-style: solid;">
          <el-icon v-dompurify-html="format(item.svg)" style="font-size: large"></el-icon>
          {{ item.meta?.label }}
        </div>
        <div style="position: absolute;right:0">
          <el-icon v-dompurify-html="format('4258afd964d811efa464b025aa2c9ada')" style="font-size: large" @click="browse(item)"></el-icon>
          <el-icon v-dompurify-html="format('e7dc3b2e64dd11efa464b025aa2c9ada')" style="font-size: large" @click="remove(item)"</el-icon>
          <el-icon v-dompurify-html="format('486e681364e311efa464b025aa2c9ada')" style="font-size: large" </el-icon>
        </div>
      </div>
    </div>
    <VueDraggable :class="`drag-area ${item.collapsed?'dd-collapsed':''}`" :style="`interpolate-size: allow-keywords;transition:height 0.5s;transition-timing-function:ease-in-out;overflow: hidden;padding:0;height: ${item.collapsed?'0px':'auto'}`" tag="ul" v-model="item.children" group="g1">
      <subEditMenu :json="item.children" :path="path+item.path+'/'"></subEditMenu>
    </VueDraggable>
  </li>
</template>
<script lang="ts" setup>
function browse(item:Item){
  window.open(path+item.path,'_blank')
}
function remove(item:Item){
  console.log(item)
  if(json.indexOf(item)>=0){
    json.splice(json.indexOf(item),1)
  }
}

import { VueDraggable } from 'vue-draggable-plus'
import { Hide, View } from "@element-plus/icons-vue";
type Item = {
  name:string,
  children:Array<Item>,
  collapsed:boolean,
  hide:boolean,
  component:string,
  svg:string,
  path:string,
  meta?:{
    label:string
  }
}
const { json,path } = defineProps({
  json: {
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
  let res = icon.results.filter((it) => it.uuid == svg);
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
  border: 1px dashed #b6bcbf;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.dd-empty {
  border: 1px dashed #bbb;
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
