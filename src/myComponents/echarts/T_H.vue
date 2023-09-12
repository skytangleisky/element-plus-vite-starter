<template>
  <div ref="thContainer" class="thContainer grid grid-cols-3 grid-rows-4"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import * as echarts from "echarts";

var thContainer = ref(null);
onMounted(() => {
  var myChart = echarts.init(thContainer.value);
  var option;
  option = {
    title: {
      text: "温湿度曲线图",
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
    },
    legend: {
      data: ["温度(℃)", "湿度(%)"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    yAxis: [
      {
        type: "value",
        stack: "Total",
      },
      {
        type: "value",
        position: "right",
      },
    ],
    series: [
      {
        name: "温度(℃)",
        data: [10, 12, 15, 20, 25, 18, 14],
        type: "line",
        smooth: true,
        yAxisIndex: 0,
      },
      {
        name: "湿度(%)",
        data: [40, 45, 30, 20, 25, 30, 20],
        type: "line",
        smooth: true,
        yAxisIndex: 1,
      },
    ],
  };
  option && myChart.setOption(option);
});
</script>
<style>
.thContainer {
  scroll-snap-align: start;
  scroll-snap-stop: always;
  width: 100%;
  min-height: 400px;
}
</style>
