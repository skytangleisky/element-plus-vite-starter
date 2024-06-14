<template>
  <div
    v-dialogDrag
    class="dragDialog absolute w-550px"
    left
    style="left: calc(50% - 275px); top: calc(50% - 155px)"
    v-show="show"
  >
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          代码<input
            name="代码"
            class="operation_filter"
            style="width: 150px"
            :value="data.id"
            @mousedown.stop
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          名称<input
            name="名称"
            class="operation_filter"
            style="width: 150px"
            :value="data.name"
            @mousedown.stop
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          位置<input
            name="位置"
            class="operation_filter"
            style="width: 150px"
            :value="data.strPos"
            @mousedown.stop
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          审批单位<input
            name="审批单位"
            class="operation_filter"
            style="width: 150px"
            value="北空"
            @mousedown.stop
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          最大射程(千米)<el-input-number
            v-model="num1"
            size="default"
            @mousedown.stop
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          最大射高(米)<el-input-number
            v-model="num2"
            size="default"
            @mousedown.stop
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          射击装备<input
            name="射击装备"
            class="operation_filter"
            style="width: 150px"
            value="火箭"
            @mousedown.stop
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业目的<input
            name="作业目的"
            class="operation_filter"
            style="width: 150px"
            value="增雨"
            @mousedown.stop
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          射向开始角(度)<el-input-number
            v-model="num3"
            size="default"
            @mousedown.stop
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          射向终止角(度)<el-input-number
            v-model="num4"
            size="default"
            @mousedown.stop
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          开始时间<input
            name="开始时间"
            class="operation_filter"
            style="width: 150px"
            value="17:11"
            @mousedown.stop
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业时长<input
            name="作业时长"
            class="operation_filter"
            style="width: 150px"
            value="1分钟"
            @mousedown.stop
          /></div
      ></el-col>
    </el-row>
    <div class="flex flex-row justify-between items-center pl-10px mt-0.5rem mb-0.5rem">
      <el-button type="default" @mousedown.stop>网络上报</el-button>
      <el-button type="default" @mousedown.stop>电话上报</el-button>
      <el-button @click="cancel" type="default" @mousedown.stop>取消</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const num1 = ref(10);
const num2 = ref(8000);
const num3 = ref(290);
const num4 = ref(40);
withDefaults(
  defineProps<{
    show?: boolean;
    data?: { id: string; strPos?: string; name?: string };
  }>(),
  {
    show: true,
    data: () => ({
      id: "",
      strPos: "",
      name: "",
    }),
  }
);
const emit = defineEmits(["update:show"]);
const cancel = () => {
  emit("update:show", false);
};
</script>
<style lang="scss">
.dragDialog {
  .ep-row {
    padding: 5px;
  }
}
</style>
