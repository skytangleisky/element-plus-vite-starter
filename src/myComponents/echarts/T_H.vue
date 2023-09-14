<template>
  <div
    ref="thContainer"
    class="thContainer grid grid-cols-3 grid-rows-4 w-full h-full"
  ></div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

var thContainer = ref(null);
onMounted(() => {
  if (!thContainer.value) throw Error("invalid thContainer!");
  var myChart = echarts.init(thContainer.value);
  const resizeObserver = new ResizeObserver((entries) => {
    myChart.resize();
  });
  resizeObserver.observe(thContainer.value);
  onBeforeUnmount(() => {
    resizeObserver.disconnect();
  });
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
        name: "温度(℃)",
        type: "value",
        stack: "Total",
      },
      {
        name: "湿度(%)",
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
