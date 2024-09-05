<template>
  <div
    class="flex-col dark:bg-#2b2b2b bg-white"
    style="color: black; overflow: auto; width: 100%;height: 100%;position: relative;"
  >
    <el-button type="primary" @click="resetMenu()">reset menu</el-button>
    <VueDraggable class="drag-area dd" tag="ol" v-model="setting.routes" group="g1">
      <subEditMenu :routes="setting.routes"></subEditMenu>
    </VueDraggable>
  </div>
</template>
<script lang="ts" setup>
import { VueDraggable } from 'vue-draggable-plus'
import subEditMenu from "./subEditMenu.vue";
import { onMounted, onBeforeUnmount } from "vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import {getMenu} from '~/api/角色/role'
getMenu().then(res=>{
  // Object.assign(setting.routes,JSON.parse(res.data.results[0].menu_tree))
})

function resetMenu(){
  setting.$resetFields('routes')
}
onMounted(() => {

});
onBeforeUnmount(()=>{
})
</script>
<style lang="scss">

.dark .dd {
  .dd-handle {
    color: #fff;
    border: 1px solid #999;
    background: #bbb;
    background: -webkit-linear-gradient(top, #bbb 0%, #999 100%);
    background: -moz-linear-gradient(top, #bbb 0%, #999 100%);
    background: linear-gradient(top, #bbb 0%, #999 100%);
  }
  .dd-handle:hover {
    background: #bbb;
  }
  .dd-item > button:before {
    color: #fff;
  }
}


.dd-hover > .dd-handle {
  background: #2ea8e5 !important;
}

/**
        * Nestable Draggable Handles
        */

.dd3-content {
  display: block;
  height: 30px;
  margin: 5px 0;
  padding: 5px 10px 5px 40px;
  color: #333;
  text-decoration: none;
  font-weight: bold;
  border: 1px solid #ccc;
  background: #fafafa;
  background: -webkit-linear-gradient(top, #fafafa 0%, #eee 100%);
  background: -moz-linear-gradient(top, #fafafa 0%, #eee 100%);
  background: linear-gradient(top, #fafafa 0%, #eee 100%);
  -webkit-border-radius: 3px;
  border-radius: 3px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.dd3-content:hover {
  color: #2ea8e5;
  background: #fff;
}

.dd-dragel > .dd3-item > .dd3-content {
  margin: 0;
}

.dd3-item > button {
  margin-left: 30px;
}

.dd3-handle {
  position: absolute;
  margin: 0;
  left: 0;
  top: 0;
  cursor: pointer;
  width: 30px;
  text-indent: 30px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid #aaa;
  background: #ddd;
  background: -webkit-linear-gradient(top, #ddd 0%, #bbb 100%);
  background: -moz-linear-gradient(top, #ddd 0%, #bbb 100%);
  background: linear-gradient(top, #ddd 0%, #bbb 100%);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.dd3-handle:before {
  content: "≡";
  display: block;
  position: absolute;
  left: 0;
  top: 3px;
  width: 100%;
  text-align: center;
  text-indent: 0;
  color: #fff;
  font-size: 20px;
  font-weight: normal;
}

.dd3-handle:hover {
  background: #ddd;
}




.dd,.dd-dragel {
  position: relative;
  list-style: none;

  // ul {
  //   margin-left: 20px;
  //   padding-left: 20px;
  //   position: relative;
  // }

  li {
    position: relative;
    padding-left: 30px;

    &::before,&::after {
      content: '';
      position: absolute;
      left: 0;
      border-color: #888;
      border-style: solid;
    }

    &::before {
      top: 0;
      left: 15px;
      width: 15px;
      height: 100%;
      border-width: 0 0 0 1px;
    }

    &::after {
      top: 15px;
      left: 15px;
      width: 15px;
      height: 15px;
      border-width: 1px 0 0 0;
    }

    &:last-child::before {
      height: 15px;
    }
  }
}
</style>
