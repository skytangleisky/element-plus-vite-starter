<template>
  <div class="modal absolute w-full h-full left-0 top-0" v-show="show">
    <div
      v-dialogDrag
      class="dragDialog absolute w-550px"
      left
      style="left: calc(50% - 275px); top: calc(50% - 155px)"
    >
      <el-row>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            代码<input
              disabled
              name="代码"
              class="operation_filter"
              style="width: 150px"
              :value="data.strCode"
              @mousedown.stop
            /></div
        ></el-col>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            名称<input
              disabled
              name="名称"
              class="operation_filter"
              style="width: 150px"
              :value="data.strName"
              @mousedown.stop
            /></div
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            位置<input
              disabled
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
              disabled
              name="审批单位"
              class="operation_filter"
              style="width: 150px"
              :value="data.unitName"
              @mousedown.stop
            /></div
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            最大射程(米)<el-input-number
              :min="0"
              :max="10000"
              v-model="data.iMaxShotRange"
              size="default"
              @mousedown.stop
            /></div
        ></el-col>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            最大射高(米)<el-input-number
              :min="0"
              :max="10000"
              v-model="data.iMaxShotHei"
              size="default"
              @mousedown.stop
            /></div
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="flex justify-between items-center pl-10px">
            射击装备<el-select
              v-model="data.iWeapon"
              placeholder="射击装备"
              style="width: 150px"
            >
              <el-option
                v-for="(item, k) in weaponOptions"
                :key="k"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select></div
        ></el-col>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            作业目的<el-select
              v-model="data.iWorkType"
              placeholder="作业目的"
              style="width: 150px"
            >
              <el-option
                v-for="(item, k) in workOptions"
                :key="k"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select></div
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            射向开始角(度)<el-input-number
              :min="0"
              :max="360"
              v-model="data.iShotRangeBegin"
              size="default"
              @mousedown.stop
            /></div
        ></el-col>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            射向终止角(度)<el-input-number
              :min="0"
              :max="360"
              v-model="data.iShotRangeEnd"
              size="default"
              @mousedown.stop
            /></div
        ></el-col>
      </el-row>
      <el-row>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            开始时间<el-time-picker
              value-format="HH:mm:ss"
              v-model="data.beginTime"
              placeholder="请输入开始时间"
              style="width: 150px"
            /></div
        ></el-col>
        <el-col :span="12"
          ><div class="flex justify-between items-center pl-10px">
            作业时长(分钟)<el-input-number
              :min="0"
              :max="120"
              v-model="data.duration"
              size="default"
              @mousedown.stop
            /></div
        ></el-col>
      </el-row>
      <div class="flex flex-row justify-between items-center pl-10px mt-0.5rem mb-0.5rem">
        <el-button type="default" @mousedown.stop @click="click(data)"
          >网络上报</el-button
        >
        <el-button type="default" style="display: none" @mousedown.stop
          >电话上报</el-button
        >
        <el-button @click="cancel" type="default" @mousedown.stop>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
const weaponOptions = reactive([
  { value: 0, label: "火箭" },
  { value: 1, label: "高炮" },
  { value: 2, label: "火箭+高炮" },
  { value: 3, label: "烟炉" },
  { value: 4, label: "火箭+烟炉" },
  { value: 5, label: "高炮+烟炉" },
  { value: 6, label: "火箭+高炮+烟炉" },
]);
const workOptions = reactive([
  { value: 1, label: "增雨" },
  { value: 2, label: "防雹" },
  { value: 3, label: "大气治理" },
  { value: 4, label: "其他" },
]);
const click = (data: prevRequestDataType) => {
  emit("click", data);
};
type zyddataType = {
  strID: string;
  strCode: string;
  strName: string;
  strPos: string;
  iMaxShotRange: number;
  iMaxShotHei: number;
  iWeapon: number;
  iWorkType: number;
  iShotRangeBegin: number;
  iShotRangeEnd: number;
  beginTime: string;
  duration: number;
};
export type prevRequestDataType = {
  unitName: string;
} & zyddataType;
withDefaults(
  defineProps<{
    show?: boolean;
    data?: prevRequestDataType;
  }>(),
  {
    show: true,
    data: () => ({
      strID: "",
      strCode: "",
      strName: "",
      strPos: "",
      iMaxShotRange: 10,
      iMaxShotHei: 8000,
      iWeapon: 0,
      iWorkType: 1,
      iShotRangeBegin: 0,
      iShotRangeEnd: 1000,
      beginTime: "",
      duration: 1,
      unitName: "",
    }),
  }
);
const emit = defineEmits(["update:show", "click"]);
const cancel = () => {
  emit("update:show", false);
};
</script>
<style lang="scss">
.modal {
  z-index: 4;
  background: #00000088;
  .dragDialog {
    box-shadow: 0 0 0 1px #757575, 0 0 0 2px #010201;
    .ep-row {
      padding: 5px;
    }
  }
}
</style>
