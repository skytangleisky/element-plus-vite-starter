<template>
  <div
    v-dialogDrag
    class="dragDialog absolute w-550px"
    style="left: calc(50% - 275px); top: calc(50% - 155px)"
    v-show="show"
    @mousedown.stop
  >
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业ID<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            :value="data.id"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业点位置<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            :value="data.strPos"
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业时间<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="2023/05/19 16:15"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业时长<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="3分钟"
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业类型<el-input-number v-model="num1" size="default" @mousedown.stop /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          作业工具<el-input-number v-model="num2" size="default" @mousedown.stop /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          炮弹用量<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="0发"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          火箭用量<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="0发"
          /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          烟条用量<el-input-number v-model="num3" size="default" @mousedown.stop /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          其它用量<el-input-number v-model="num4" size="default" @mousedown.stop /></div
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          水平角<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="0～10"
          /></div
      ></el-col>
      <el-col :span="12"
        ><div class="flex justify-between items-center pl-10px">
          俯仰角<input
            @mousedown.stop
            class="operation_filter"
            style="width: 150px"
            value="0～30"
          /></div
      ></el-col>
    </el-row>
    <div class="flex flex-row justify-between items-center pl-10px mt-0.5rem mb-0.5rem">
      <el-button @mousedown.stop type="default">发送</el-button>
      <el-button @mousedown.stop @click="cancel" type="default">取消</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
const num1 = ref(10);
const num2 = ref(8000);
const num3 = ref(290);
const num4 = ref(40);
withDefaults(defineProps<{ show?: boolean; data?: { id: string; strPos?: string } }>(), {
  show: true,
  data: () => ({
    id: "",
    strPos: "",
  }),
});
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
