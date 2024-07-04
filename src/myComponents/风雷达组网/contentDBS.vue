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
      <el-checkbox
        v-show="value1 == '垂直气流'"
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
    <div class="w-full box-border relative flex" style="height: 100%; overflow: auto">
      <div class="p-10px">
        <div
          class="w-250px bg-white dark:bg-#252948 h-full b-solid box-border b-1px b-gray"
          style="border-radius: 10px; overflow: auto"
          v-loading="loading"
        >
          <el-tree
            default-expand-all
            ref="treeRef"
            node-key="id"
            :data="data"
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
          <chart-fkx class="w-full h-full p-10px box-border"></chart-fkx>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { eventbus } from "~/eventbus";
import chartFkx from "./fkxV.vue";
import { ref, reactive, onMounted, watch } from "vue";
import moment from "moment";
const loading = ref(true);
const size = ref<"" | "large" | "small">("small");
const date = ref(moment().format("YYYYMMDD"));
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
  label: string;
  children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
  fetchFkxHisData(data.label);
};

let data = ref<Tree[]>([]);
import { getDataList, getFkxHisData } from "~/api/重庆";
onMounted(() => {
  fetchDataList(moment().format("YYYYMMDD"));
});
let radar_id = "";
if (location.href.endsWith("deviceA")) {
  radar_id = "G3218";
} else if (location.href.endsWith("deviceB")) {
  radar_id = "G9590";
} else if (location.href.endsWith("deviceC")) {
  radar_id = "G1000";
}
let 风廓线数据: any = [];
const fetchFkxHisData = (dateTime: string) => {
  getFkxHisData({ radar_id, dateTime }).then((res) => {
    风廓线数据 = res.data.data.files;
    eventbus.emit("处理风廓线数据", 风廓线数据, value1.value, check.value, value2.value);
  });
};
watch([value1, check, value2], ([v1, check, v2]) => {
  console.log(v1, check, v2);
  eventbus.emit("处理风廓线数据", 风廓线数据, v1, check, v2);
});
const fetchDataList = (date: string) => {
  loading.value = true;
  getDataList({
    radar_id,
    dataType: "fkx",
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
  if (node.label.length > 10) {
    return (
      node.label.substring(8, 10) +
      ":" +
      node.label.substring(10, 12) +
      ":" +
      node.label.substring(12, 14)
    );
  } else {
    return node.label;
  }
};
const treeRef = ref(null);
</script>
<style lang="scss"></style>
