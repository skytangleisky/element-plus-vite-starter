<template>
  <el-tree
    style="
      width: 300px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      padding: 4px;
      border-radius: 10px;
    "
    :data="data"
    :props="defaultProps"
    @node-click="handleNodeClick"
  />
</template>

<script lang="ts" setup>
import { watch, reactive, onMounted } from "vue";
import { useBus } from "../bus";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
const bus = useBus();
interface Tree {
  label: string;
  children?: Tree[];
}
onMounted(() => {
  watch(
    () => bus.wsData,
    (wsData: any) => {
      if (wsData.type == "目录信息") {
        setting.catalogue = wsData;
      }
    }
  );
  watch(
    () => setting.catalogue,
    (catalogue: any) => {
      data.length = 0;
      catalogue.dirs.map((v: string) => {
        data.push({ label: v, children: [{ label: "test" }] });
      });
      catalogue.files.map((v: string) => {
        data.push({ label: v });
      });
    },
    { immediate: true }
  );
});

const handleNodeClick = (data: Tree) => {
  console.log(data);
};

const data = reactive<Tree[]>([]);

const defaultProps = {
  children: "children",
  label: "label",
};
</script>
