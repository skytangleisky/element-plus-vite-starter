<template>
  <div class="mainContainer">
    <div class="effect"></div>
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
    <radar-rhi :type="select1" class="radarRhi"></radar-rhi>
    <radar-rhi :type="select2" class="radarRhi2"></radar-rhi>
    <data-table class="dataTable"></data-table>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import radarRhi from "../radar/index.vue";
import dataTable from "./table.vue";
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
const select2 = ref("SNR");
</script>
<style scoped lang="scss">
.mainContainer {
  width: 100%;
  height: 100%;
  // background: url(/src/assets/rhi.jpg) no-repeat;
  .select1 {
    position: absolute;
    width: 100px;
    left: 330px;
    top: 180px;
    color: black;
    -webkit-text-fill-color: #000;
  }
  .select2 {
    position: absolute;
    left: 450px;
    width: 100px;
    top: 180px;
    color: black;
    -webkit-text-fill-color: #000;
  }
  .effect {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(0px);
  }
  .radarRhi {
    border: 1px solid red;
    position: absolute;
    left: 260px;
    top: 300px;
    width: 490px;
    height: 400px;
  }
  .radarRhi2 {
    border: 1px solid red;
    position: absolute;
    left: 830px;
    top: 300px;
    width: 560px;
    height: 400px;
  }
  .dataTable {
    position: absolute;
    left: 250px;
    top: 800px;
    width: 1360px;
    height: 300px;
  }
}
</style>
