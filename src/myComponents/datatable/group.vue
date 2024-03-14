<template>
  <div class="flex items-center justify-center h-full w-full bg-#666">
    <el-transfer
      v-model="value"
      :titles="['可用的 组', '选中的 组']"
      filterable
      filter-placeholder="请输入过滤条件"
      :data="data"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Option {
  key: number;
  label: string;
  initial: string;
}

const generateData = () => {
  const data: Option[] = [];
  const states = ["企业用户组", "企业管理组", "光恒管理组", "标定场用户组"];
  const initials = ["CA", "IL", "MD", "TX", "FL", "CO", "CT"];
  states.forEach((city, index) => {
    data.push({
      label: city,
      key: index,
      initial: initials[index],
    });
  });
  return data;
};

const data = ref<Option[]>(generateData());
const value = ref([]);
</script>
<style lang="scss">
.ep-transfer-panel__filter .ep-input__inner {
  padding: 0 2px;
}
</style>
