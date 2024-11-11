<template>
  <div
    class="h-100% box-border"
    style="border-radius: 10px; overflow: auto"
    v-loading="loading"
  >
    <el-tree
      class="myTree"
      :default-expand-all="false"
      ref="treeRef"
      node-key="id"
      lazy
      :load="loadNode"
      :render-content="renderContent"
      :props="defaultProps"
      @node-click="handleNodeClick"
      style="min-width: max-content"
      highlight-current
      empty-text=""
    />
  </div>
</template>
<script lang="ts" setup>

// :default-expanded-keys="['2024','2024/202411','2024/202411/20241104']"
// :current-node-key="'2024/202411/20241104/185140'"
const props = withDefaults(defineProps<{type:string;radar_time:string}>(),{type:'DBS',radar_time:''})
import {ref,onMounted} from 'vue'
import { getDataList } from "~/api/重庆";
const loading = ref(false);
interface Tree {
  id:string;
  leaf:boolean;
  name:string;
  children?: Tree[];
}

onMounted(() => {
  // handleNodeClick({
  //   id:'2024/202411/20241104',
  //   name:'001510',
  //   leaf:true
  // })
});

const emits = defineEmits(['handleNodeClick','update:radar_time'])

const handleNodeClick = (data: Tree) => {
  if(data.leaf){
    emits('update:radar_time',data.id)
  }
};
let radar_id = location.href.substring(location.href.lastIndexOf('/')+1,location.href.length)
import type Node from 'element-plus/es/components/tree/src/model/node'
import { isLeaf } from "element-plus/es/utils";
const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    // loading.value = true
    return getDataList({
      radar_id,
      path:'',
      type:props.type,
    }).then((res:any) => {
      let paths = res.data.data.path.map((name:string)=>{
        return {
          id:name,
          name
        }
      })
      loading.value=false
      return resolve(paths)
    });
  }else{
    let path = node.data.id.replaceAll(/\/$/g,'')
    return getDataList({
      radar_id,
      path,
      type:props.type,
    }).then((res:any) => {
      let leaf = node.level>=3
      if(props.type=="DBS"){
        leaf = node.level>=2
      }
      let paths = res.data.data.path.map((name:string)=>{
        return {
          id:path+'/'+name,
          name,
          leaf
        }
      })
      return resolve(paths)
    });
  }
}
const defaultProps = {
  label: 'name',
  children: 'zones',
  isLeaf: 'leaf',
};
const renderContent = (
  h: any,
  {
    node,
    data,
  }: {
    node: Node;
    data: Tree;
  }
) => {
  return node.label
};
const treeRef = ref(null);

</script>