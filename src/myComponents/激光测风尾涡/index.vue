<template>
  <div class="mainContainer">
    <div class="effect"></div>
    <div
      class="absolute left-0 top-0 bg-white w-full h-full p-40px"
      style="
        display: flex;
        min-height: 100%;
        height: fit-content;
        width: fit-content;
        min-width: 100%;
        box-sizing: border-box;
      "
    >
      <catalogue></catalogue>
      <div
        style="
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          border-radius: 8px;
          box-sizing: border-box;
          padding: 4px;
          border: 1px solid #ddd;
        "
      >
        <div style="display: flex; padding: 0 20px"><schedule></schedule></div>
        <div
          style="display: flex; white-space: nowrap; align-items: center; padding: 0 20px"
        >
          主显示区：
          <el-select class="select1" v-model="select1" placeholder="">
            <el-option
              v-for="(v, k) in options1"
              :key="k"
              :label="v.label"
              :value="v.value"
            ></el-option>
          </el-select>
          <el-select class="select2" v-model="select2" placeholder="">
            <el-option
              v-for="(v, k) in options2"
              :key="k"
              :label="v.label"
              :value="v.value"
            ></el-option>
          </el-select>
        </div>
        <div class="radarRhi">
          <radar-rhi :type="select1" class="radarRhi1"></radar-rhi>
          <radar-rhi :type="select2" class="radarRhi2"></radar-rhi>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              padding: 10px;
            "
          >
            <div v-html="infos.join('<br/>')"></div>
          </div>
        </div>
        <data-table class="dataTable"></data-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import radarRhi from "../radar/index.vue";
import dataTable from "./table.vue";
import catalogue from "./catalogue.vue";
import schedule from "./schedule.vue";
const infos = reactive([
  "开始时间：",
  "UTC 2022-09-30",
  "16:00:00",
  "观测模式：RHI",
  "方位角：100",
  "俯仰角1.5-20",
  "俯仰步长：1.5",
  "扫描波束数：0",
  "探测范围：43-691",
  "距离门长度：12",
  "<br/>",
  "距离库数：55",
  "最大正速度：2.06m/s",
  "时间：UTC 16:01:26",
  "俯仰角度；11.7度",
  "距离475m",
]);
const options1 = reactive([
  {
    label: "径向速度",
    value: "Speed",
  },
  {
    label: "谱宽",
    value: "PK",
  },
  {
    label: "信噪比",
    value: "SNR",
  },
  {
    label: "频谱强度",
    value: "PKQD",
  },
]);
const select1 = ref("Speed");
const options2 = reactive([
  {
    label: "径向速度",
    value: "Speed",
  },
  {
    label: "谱宽",
    value: "PK",
  },
  {
    label: "信噪比",
    value: "SNR",
  },
  {
    label: "频谱强度",
    value: "PKQD",
  },
]);
const select2 = ref("PKQD");
</script>
<style scoped lang="scss">
.mainContainer {
  width: 100%;
  height: 100%;
  background: url(/src/assets/rhi.jpg) no-repeat;
  .select1 {
    width: 200px;
    color: black;
    -webkit-text-fill-color: #000;
  }
  .select2 {
    width: 200px;
    color: black;
    -webkit-text-fill-color: #000;
  }
  .effect {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(0px);
  }
  .radarRhi {
    width: 100%;
    height: 554px;
    display: flex;
    padding: 10px;
    .radarRhi1 {
      height: 100%;
      border: 1px solid #ddd;
      padding: 40px;
      margin: 10px;
      border-radius: 8px;
      box-sizing: border-box;
    }
    .radarRhi2 {
      margin-left: 40px;
      height: 100%;
      border: 1px solid #ddd;
      padding: 40px;
      margin: 10px;
      border-radius: 8px;
      box-sizing: border-box;
    }
  }
  .dataTable {
    border-radius: 8px;
    padding: 10px;
    margin: 10px;
    box-sizing: border-box;
  }
}
</style>
