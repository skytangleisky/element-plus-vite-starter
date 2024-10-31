<template>
  <div class="absolute top-0px left-0 h-full w-full pointer-events-auto overflow-auto">
    <el-tree class="districtTree" node-key="adcode" style="background-color: transparent;" :expand-on-click-node="false" :props="props" :load="loadNode" lazy highlight-current empty-text="" :default-expanded-keys="['500000']" current-node-key="500000">
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
        </span>
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
  adcode: string
  leaf?: boolean
}

const props = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf',
}

// const renderContent = (h: any,{node,data}: {node: Node,data: Tree}
// ) => {
//   return node.label
// };

const loadNode = (node: Node,resolve: (data: Tree[]) => void,reject: () => void) => {
  if(node.level === 0){
    resolve([{name:'重庆市',adcode:'500000'}])
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
  .ep-tree-node.is-current > .ep-tree-node__content{
    box-sizing:border-box;
    border:1px solid lightgray;
    color: inherit; /* 激活文字颜色 */
    border-radius:4px;
  }
  .ep-tree-node:not(.is-current) > .ep-tree-node__content:hover{
    box-sizing:border-box;
    border:1px solid gray;
    border-radius:4px;
  }
}
</style>