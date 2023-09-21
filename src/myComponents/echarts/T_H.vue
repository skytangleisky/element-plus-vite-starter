<template>
  <div
    style="
      scroll-snap-align: start;
      scroll-snap-stop: always;
      width: 100%;
      min-height: 400px;
      display: flex;
      flex-direction: column;
    "
  >
    <div style="color: rgb(78, 129, 184); font-size: 20px; background-color: #eee">
      温湿度曲线
    </div>
    <div ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { useStationStore } from "~/stores/station";
const station = useStationStore();
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
  var option: any;
  option = {
    title: {
      show: false,
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

  watch(
    [
      storeToRefs(station).avgWindData,
      storeToRefs(setting).featherValue,
      storeToRefs(station).result,
      storeToRefs(station).active,
    ],
    ([avgWindData, featherValue, result, active]) => {
      option.xAxis.data = [];
      option.series[0].data = [];
      option.series[1].data = [];
      avgWindData.map((v, k) => {
        for (let key in v) {
          if (key == result[active].radar.radar_id) {
            let data = v[key];
            data.map((v, k) => {
              for (let k in v) {
                option.xAxis.data.push(k.substring(10));
                for (let key in v[k][0]) {
                  let temperature = v[k][0][key].temperature;
                  let humidity = v[k][0][key].humidity;
                  option.series[0].data.push(temperature);
                  option.series[1].data.push(humidity);
                }
              }
            });
            myChart.setOption(option);
          }
        }
      });
    },
    { immediate: true }
  );
});
</script>
