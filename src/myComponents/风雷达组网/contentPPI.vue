<template>
  <div class="h-full flex flex-col">
    <div class="flex w-full flex-row items-center justify-left p-10px box-border">
      选择日期:<el-date-picker
        v-model="date"
        type="date"
        placeholder="Pick a day"
        value-format="YYYYMMDD"
        :size="size"
      />
      <el-button type="primary" size="small" @click="query">查询</el-button>
      主显示区:
      <el-select v-model="value1" placeholder="" style="width: 120px">
        <el-option
          v-for="(v, k) in options1"
          :key="k"
          :label="v.label"
          :value="v.value"
        ></el-option>
      </el-select>
    </div>
    <div class="w-full box-border relative flex" style="height: 100%; overflow: auto">
      <div class="p-10px">
        <div
          class="w-250px bg-white dark:bg-#252948 h-full b-solid box-border b-1px b-gray"
          style="border-radius: 10px; overflow: auto"
          v-loading="loading"
        >
          <el-tree
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
      </div>
      <div class="w-full p-10px">
        <div
          class="bg-white dark:bg-#252948 box-border h-full w-full b-1px b-solid b-gray"
          style="border-radius: 10px"
        >
          <radar
            :radar_time="radar_time"
            :device="radar_id"
            type="ppi"
            :PPIval="value1"
            :isDark="isDark"
          ></radar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import radar from "./雷达.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import moment from "moment";
import { isDark } from "~/composables";
const loading = ref(true);
const radar_time = ref("");
const size = ref<"" | "large" | "small">("small");
const date = ref(moment().format("YYYYMMDD"));
const value1 = ref<3 | 4 | 5 | 6>(3);
const options1 = reactive([
  { value: 3, label: "径向速度" },
  { value: 4, label: "谱宽" },
  { value: 5, label: "信噪比" },
  { value: 6, label: "频谱强度" },
]);

interface Tree {
  label: string;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
  radar_time.value = data.name.replace(' ','')
};

import { getDataList } from "~/api/重庆";
onMounted(() => {
  // fetchDataList(moment().format("YYYYMMDD"));
});
let radar_id = location.href.substring(location.href.lastIndexOf('/')+1,location.href.length)
const query = () => {
  // fetchDataList(date.value);
};
import type Node from 'element-plus/es/components/tree/src/model/node'
const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    loading.value = true
    return getDataList({
      radar_id,
      dataType: "ppi",
      path:'',
    }).then((res) => {
      let paths = res.data.data.path.map((name:string)=>{
        return {
          id:'',
          name
        }
      })
      loading.value=false
      return resolve(paths)
    });
  }else{
    let path = node.data.id+'/'+node.data.name
    return getDataList({
      radar_id,
      dataType: "ppi",
      path,
    }).then((res) => {
      let prefix = 'CDL_S4000_Lidar10BQC07110410_PPI_FrmAzm0.00_ToAzm359.00_Pth15.00_Spd6.00_Res030_StartIdx002_VADStart002_VADStop190_VADWind_Sec_';
      let files = res.data.data.files.filter((name:string)=>name.indexOf('_PPI_')>-1).map((name:string)=>{
        return {
          id:path,
          name:name.substring(prefix.length,prefix.length+15),
          leaf:true,
        }
      })
      let paths = res.data.data.path.filter((name:string)=>name!='level1'&&name!='level3'&&name!='logs'&&name!='sensor').map((name:string)=>{
        return {
          id:path,
          name
        }
      })
      return resolve(paths.concat(files))
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
    node: Tree;
    data: Tree;
  }
) => {
  return node.label
};
const treeRef = ref(null);
</script>
