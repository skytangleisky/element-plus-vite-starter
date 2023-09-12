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
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="295"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          名称<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="千家店作业点"
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          位置<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="116192700E40413500N"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          审批单位<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="北空"
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          最大射程(千米)<el-input-number v-model="num1" size="default" /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          最大射高(米)<el-input-number v-model="num2" size="default" /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          射击装备<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="火箭"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业目的<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="增雨"
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          射向开始角(度)<el-input-number v-model="num3" size="default" /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          射向终止角(度)<el-input-number v-model="num4" size="default" /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          开始时间<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="17:11"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业时长<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="1分钟"
          /></div
      ></el-col>
    </el-row>
    <div class="flex flex-row justify-between items-center pl-10px mt-0.5rem mb-0.5rem">
      <el-button @mousedown.stop type="default">网络上报</el-button>
      <el-button @mousedown.stop type="default">电话上报</el-button>
      <el-button @mousedown.stop @click="cancel" type="default">取消</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const num1 = ref(10);
const num2 = ref(8000);
const num3 = ref(290);
const num4 = ref(40);
withDefaults(defineProps<{ show?: boolean }>(), { show: true });
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
