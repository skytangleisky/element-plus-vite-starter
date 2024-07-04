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
            ref="treeRef"
            node-key="id"
            :data="data"
            :render-content="renderContent"
            :props="defaultProps"
            @node-click="handleNodeClick"
            style="min-width: max-content"
            highlight-current
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
            type="rhi"
            :RHIval="value1"
            :isDark="isDark"
          ></radar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isDark } from "~/composables";
import radar from "./雷达.vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import moment from "moment";
const loading = ref(true);
const radar_time = ref("");
const size = ref<"" | "large" | "small">("small");
const date = ref(moment().format("YYYYMMDD"));
const value1 = ref<1 | 2 | 3 | 4>(1);
const options1 = reactive([
  { value: 1, label: "径向速度" },
  { value: 2, label: "谱宽" },
  { value: 3, label: "信噪比" },
  { value: 4, label: "频谱强度" },
]);
interface Tree {
  label: string;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
  radar_time.value = data.label.substring(0, 14);
};

let data = ref<Tree[]>([]);
import { getDataList } from "~/api/重庆";
onMounted(() => {
  fetchDataList(moment().format("YYYYMMDD"));
});
let radar_id = ref("");
if (location.href.endsWith("deviceA")) {
  radar_id.value = "G3218";
} else if (location.href.endsWith("deviceB")) {
  radar_id.value = "G9590";
} else if (location.href.endsWith("deviceC")) {
  radar_id.value = "G1000";
}
const fetchDataList = (date: string) => {
  loading.value = true;
  getDataList({
    radar_id: radar_id.value,
    dataType: "rhi",
    date,
  }).then((res) => {
    let id = 0;
    function recur(list: Array<any>) {
      list.map((v, k) => {
        if (v.subdirectories instanceof Array) {
          recur(v.subdirectories);
          v.children = v.subdirectories;
          delete v.subdirectories;
        }
        v.label = v.name;
        v.id = id++;
        delete v.name;
      });
    }
    recur(res.data.data.files);
    data.value = res.data.data.files;
    if (res.data.data.files[0]) {
      let node =
        res.data.data.files[0].children[res.data.data.files[0].children.length - 1];
      nextTick(() => {
        (treeRef.value as any).setCurrentKey(node.id);
      });
    }
    loading.value = false;
  });
};
const query = () => {
  fetchDataList(date.value);
};
const defaultProps = {
  children: "children",
  label: "label",
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
  if (node.label.indexOf("~") > -1) {
    return (
      node.label.substring(8, 10) +
      ":" +
      node.label.substring(10, 12) +
      ":" +
      node.label.substring(12, 14) +
      "~" +
      node.label.substring(23, 25) +
      ":" +
      node.label.substring(25, 27) +
      ":" +
      node.label.substring(27, 29)
    );
  } else {
    return node.label;
  }
};
const treeRef = ref(null);
</script>
