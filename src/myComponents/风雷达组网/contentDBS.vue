<template>
  <div class="h-full flex flex-col">
    <div class="w-full box-border relative flex" style="height: 100%; overflow: auto">
      <div class="p-10px">
        <div
          class="w-250px bg-white dark:bg-#252948 h-full b-solid box-border b-1px b-gray"
          style="border-radius: 10px; overflow: auto"
          v-loading="loading"
        >
          <el-tree
            :default-expand-all="true"
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
          class="bg-white dark:bg-#252948 box-border h-full w-full b-1px b-solid b-gray relative"
          style="border-radius: 10px;display: flex;flex-direction: column;"
        >
          <div class="flex p-10px">
            <el-select v-model="value1" placeholder="" style="width: 120px">
              <el-option
                v-for="(v, k) in options1"
                :key="k"
                :label="v.label"
                :value="v.value"
              ></el-option>
            </el-select>
            <el-checkbox
              label="叠加"
              v-model="check"
            ></el-checkbox>
            <el-select v-model="value2" placeholder="" style="width: 120px">
              <el-option
                v-for="(v, k) in options2"
                :key="k"
                :label="v.label"
                :value="v.value"
              ></el-option>
            </el-select>
          </div>
          <chart-fkx class="w-full h-full p-10px box-border"></chart-fkx>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
let radar_id = location.href.substring(location.href.lastIndexOf('/')+1,location.href.length)
import { eventbus } from "~/eventbus";
import chartFkx from "./fkxV.vue";
import { ref, reactive, onMounted, watch } from "vue";
import moment from "moment";
const loading = ref(false);
const value1 = ref<"水平风" | "垂直气流">("水平风");
const options1 = reactive([
  { value: "水平风", label: "水平风" },
  { value: "垂直气流", label: "垂直气流" },
]);
const value2 = ref<"风羽" | "风矢">("风羽");
const options2 = reactive([
  { value: "风羽", label: "风羽" },
  { value: "风矢", label: "风矢" },
]);
const check = ref(false);
interface Tree {
  name: string
  leaf?: boolean
}

const handleNodeClick = (data: Tree) => {
  if(data.leaf){
    fetchFkxHisData(data.name);
  }
};
import { getDataList, getFkxHisData,getFkxRealData } from "~/api/重庆";
onMounted(() => {
  // fetchDataList(moment().format("YYYYMMDD"));
});
let 风廓线数据: any = [];

const fetchFkxHisData = (dateTime: string) => {
  console.log(dateTime)
  getFkxRealData({ radar_id, dateTime:moment(dateTime+' 23:59:59','YYYYMMDD HH:mm:ss').format("YYYYMMDDHHmmss"),num:144 }).then((res) => {
    风廓线数据 = res.data.data.file.file_data;
    eventbus.emit("处理风廓线数据"+radar_id, 风廓线数据, value1.value, check.value, value2.value);
  });
};
watch([value1, check, value2], ([v1, check, v2]) => {
  console.log(v1, check, v2);
  eventbus.emit("处理风廓线数据"+radar_id, 风廓线数据, v1, check, v2);
});

import type Node from 'element-plus/es/components/tree/src/model/node'
const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    loading.value = true
    return getDataList({
      radar_id,
      path:'',
    }).then((res) => {
      let paths = res.data.data.path.map((name:string)=>{
        return {
          id:'',
          name
        }
      })
      loading.value=false
      resolve(paths)
    });
  }else if(node.level === 1){
    let path = node.data.id+'/'+node.data.name
    return getDataList({
      radar_id,
      path,
    }).then((res) => {
      // let files = res.data.data.files.map((name:string)=>{
      //   return {
      //     id:path,
      //     name:name,
      //     leaf:true,
      //   }
      // })
      let paths = res.data.data.path.map((name:string)=>{
        return {
          id:path,
          name
        }
      })
      resolve(paths)
    });
  }else if(node.level === 2){
    let path = node.data.id+'/'+node.data.name
    return getDataList({
      radar_id,
      path,
    }).then((res) => {
      // let files = res.data.data.files.map((name:string)=>{
      //   return {
      //     id:path,
      //     name:name,
      //     leaf:true,
      //   }
      // })
      let paths = res.data.data.path.map((name:string)=>{
        return {
          id:path,
          name,
          leaf:true
        }
      })
      resolve(paths)
    });
  }else{
    resolve([])
  }
}
const query = () => {
  // fetchDataList(date.value);
};
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
<style lang="scss"></style>
