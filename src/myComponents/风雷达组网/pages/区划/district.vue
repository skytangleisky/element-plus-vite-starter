<template>
  <div style="position: absolute;top:0;left:0;height: 100%;width: 100%;pointer-events: auto;overflow:auto;">
    <el-tree class="districtTree" node-key="adcode" style="background-color: transparent;" :expand-on-click-node="false" :props="{label: 'name',children: 'zones',isLeaf: 'leaf'}" :load="loadNode" lazy highlight-current empty-text="" :default-expanded-keys="[500000]" :current-node-key="500000">
      <template #default="{ node, data }">
        <span>{{ node.label }}</span>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { onMounted,onBeforeUnmount } from 'vue';
import type Node from 'element-plus/es/components/tree/src/model/node'

interface Tree {
  name: string
  adcode: number
  leaf?: boolean
}

const customNodeClass = (data: Tree, node: Node) => {
  console.log(data)
  if (data) {
    return 'custom-tree-node'
  }
}

// const renderContent = (h: any,{node,data}: {node: Node,data: Tree}
// ) => {
//   return node.label
// };

const loadNode = (node: Node,resolve: (data: Tree[]) => void,reject: () => void) => {
  if(node.level === 0){
    resolve([{name:'重庆',adcode:500000}])
  }else if (node.level >= 1) {
    axios.get(`/backend/region/${node.data.adcode}_full.json`).then(res=>{
      let arr = new Array<any>();
      res.data.features.map((feature:any)=>{
        if(feature.properties.childrenNum==undefined||feature.properties.childrenNum===0){
          feature.properties.leaf = true
        }
        arr.push(feature.properties)
        resolve(arr)
      })
    })
  }
}
</script>
<style lang="scss">


.districtTree{
  font-weight:bolder;
  font-size:18px;
  .custom-tree-node{
    position: relative;
    line-height: 100px;
    height: 100px;
    border:1px solid red;
  }
  .el-tree-node.is-current > .el-tree-node__content{
    box-sizing:border-box;
    border:1px solid lightgray;
    color: inherit; /* 激活文字颜色 */
    border-radius:4px;
  }
  .el-tree-node:not(.is-current) > .el-tree-node__content:hover{
    box-sizing:border-box;
    border:1px solid gray;
    border-radius:4px;
  }
}
</style>