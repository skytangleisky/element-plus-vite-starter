<template>
  <div style="display: absolute; width: 100%; height: 100%">
    <div style="display: flex; flex-direction: column; align-items: center">
      <span class="title" style="font-size: 20px; font-weight: bold; color: black"
        >机舱标定架布局</span
      >
      <span class="subTitle" style="font-size: 14px; color: grey"
        >总位置：###&emsp;已占用：###&emsp;空余：###</span
      >
      <div class="engineRoom">
        <div v-for="(v, k) in options.arr" :key="k" style="display: flex">
          <div class="text" :style="`color:${v.color}`">{{ v.text }}</div>
          <el-progress
            type="dashboard"
            :percentage="80"
            :stroke-width="20"
            status="warning"
          >
            <template #default="{ percentage }">
              <span style="margin-left: -40%; color: black">{{ percentage }}</span>
            </template>
          </el-progress>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center">
      <span class="title" style="font-size: 20px; font-weight: bold; color: black"
        >塔式标定架布局</span
      >
      <span class="subTitle" style="font-size: 14px; color: grey"
        >总位置：###&emsp;已占用：###&emsp;空余：###</span
      >
      <div class="engineRoom">
        <div v-for="(v, k) in options.arr" :key="k">
          <div class="text" :style="`color:${v.color}`">{{ v.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
const options = reactive({
  arr: new Array<any>(),
});
for (let i = 0; i < 18; i++) {
  options.arr.push({ text: "A01", color: "#ff0000" });
  options.arr.push({ text: "A01", color: "#808080" });
  options.arr.push({ text: "A01", color: "#92d050" });
}
</script>
<style lang="scss">
.engineRoom {
  display: grid;
  grid-template-rows: repeat(7, 30px);
  grid-template-columns: repeat(8, 100px);
  .text {
    width: 4rem;
    padding: 4px 0;
    border-radius: 8px;
    color: black;
    background-color: #bbe0e3;
    border: 1px solid #7dc4c9;
    text-align: center;
    vertical-align: middle;
  }
  .ep-progress-circle {
    width: 30px !important;
    height: 30px !important;
  }
}
</style>
