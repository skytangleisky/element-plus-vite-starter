<template>
  <div
    style="overflow: auto; width: 100%;height: 100%;position: relative;background-color: white;display: flex;flex-direction: column;"
  >
    <div>
      <el-button type="primary" @click="resetMenu()">reset menu</el-button><el-button type="primary" @click="expandAll()">expandAll</el-button><el-button type="primary" @click="collapseAll()">collapseAll</el-button>
    </div>
    <div>
      <el-checkbox v-for="(v,k) in roles" v-model="v.val" :key="k" :label="v.key" size="large"/>
    </div>
    <div class="flex flex-row items-start">
      <VueDraggable class="drag-area dd w-50%" tag="ol" v-model="setting.routes" group="g1">
        <subEditMenu :routes="(setting.routes as any)"></subEditMenu>
      </VueDraggable>
      <Permission class="w-50%" :treeData="permissions"></Permission>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Permission from './permission.vue'
import {reactive,computed} from 'vue'
const roles = reactive([{key:'admin',val:true},{key:'device',val:false},{key:'zh',val:true},{key:'ry',val:true},{key:'jx',val:true},{key:'cq',val:true}])
import { VueDraggable } from 'vue-draggable-plus'
import subEditMenu from "./subEditMenu.vue"
import { onMounted, onBeforeUnmount } from "vue"
import { useSettingStore } from "~/stores/setting"
function updateNodeStatus(node:any) {
  // 如果节点没有子节点，直接返回节点的状态
  if (!node.children || node.children.length === 0) {
    return { checked: node.checked || false, indeterminate: false };
  }

  // 遍历子节点的状态
  let allChecked = true;
  let anyChecked = false;

  node.children.forEach(child => {
    const { checked, indeterminate } = updateNodeStatus(child);
    // 如果子节点有一个没有选中，那么父节点不能全选
    if (!checked || indeterminate) {
      allChecked = false;
    }
    // 如果子节点有一个被选中，那么父节点至少会是 indeterminate
    if (checked || indeterminate) {
      anyChecked = true;
    }
  });

  // 设置当前节点的 checked 和 indeterminate 状态
  node.checked = allChecked;
  node.indeterminate = !allChecked && anyChecked;

  return { checked: node.checked, indeterminate: node.indeterminate };
}

//下面这个目的是补齐权限配置中父节点中indeterminate状态
const permissions = computed({
  set:(permissions)=>{
    Object.assign(setting.permissions,permissions)
  },
  get:()=>{
    setting.permissions.map(node=>{
      updateNodeStatus(node)
    })
    
    return setting.permissions
  }
})
const setting = useSettingStore();
setting.targetRoles = computed(()=>{
  let arr:any = []
  roles.map(item=>{
    if(item.val){
      arr.push(item.key)
    }
  })
  return arr
}) as any
import {getMenu} from '~/api/角色/role'
getMenu().then(res=>{
  // Object.assign(setting.routes,JSON.parse(res.data.results[0].menu_tree))
})
function collapseAll(){
  let recurse = (list:Array<any>)=>{
    list.map((item:any)=>{
      if(Array.isArray(item.children)){
        recurse(item.children)
      }
      item.expand = false
    })
  }
  recurse(setting.routes)
}
function expandAll(){
  let recurse = (list:Array<any>)=>{
    list.map((item:any)=>{
      if(Array.isArray(item.children)){
        recurse(item.children)
      }
      item.expand = true
    })
  }
  recurse(setting.routes)
}

function resetMenu(){
  setting.$resetFields('routes')
}
onMounted(() => {

});
onBeforeUnmount(()=>{
})
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

  li {
    position: relative;
    padding-left: 30px;
    box-sizing: border-box;
    width: 100%;
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
.dark .dd {
  .dd-handle {
    color: #fff;
    border: 1px solid #999;
    background: #bbb;
    background: -webkit-linear-gradient(top, #bbb 0%, #999 100%);
    background: -moz-linear-gradient(top, #bbb 0%, #999 100%);
    background: linear-gradient(top, #bbb 0%, #999 100%);
    &:hover {
      background: #bbb;
    }
  }
}
</style>
