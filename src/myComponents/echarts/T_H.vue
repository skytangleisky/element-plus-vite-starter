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
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="color: rgb(78, 129, 184); font-size: 20px">温湿度曲线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div v-resize="resize" ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, onMounted, watch } from "vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { isDark } from "~/composables";
import { useBus } from "~/myComponents/bus";
const bus = useBus();

var thContainer = ref(null);
watch(isDark, (isDark) => {
  setChart(isDark);
});
onMounted(() => {
  setChart(isDark.value);
});
const currentTime = ref("");
watch(
  [() => bus.avgWindData, () => bus.result, () => station.active],
  ([avgWindData, result, active]) => {
    option.xAxis.data = [];
    option.series[0].data = [];
    option.series[1].data = [];
    myChart.setOption(option, false, true);
    if (avgWindData) {
      avgWindData.map((v, k) => {
        let data;
        for (let key in v) {
          if (key == active) {
            data = v[key];
          }
        }
        if (data) {
          for (let i = 0; i < data.length; i++) {
            if (i == 0) {
              currentTime.value = data[i].data_time;
            }
            let data_time = data[i].data_time;
            let data_list = data[i].data_list;
            option.xAxis.data.push(data_time.substring(11, 19));
            option.series[0].data.push(data_list[0].ex_temp);
            option.series[1].data.push(data_list[0].ex_hum);
          }
          myChart.setOption(option, false, true);
        }
      });
    }
  }
);
var option = {
  animation: false,
  backgroundColor: "transparent",
  title: {
    show: false,
    text: "温湿度曲线图",
  },
  tooltip: {
    trigger: "axis",
    formatter: function (params: any) {
      return [
        params[0].axisValueLabel,
        "温度：" + params[0].value,
        "湿度：" + (params[1] ? params[1].value : "-"),
      ].join("<br>");
    },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [], //["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
  },
  legend: {
    data: ["温度(℃)", "湿度(%)"],
  },
  grid: {
    top: 60,
    bottom: 20,
  },
  // grid: {
  //   left: "3%",
  //   right: "4%",
  //   bottom: "3%",
  //   containLabel: true,
  // },
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
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 0,
    },
    {
      name: "湿度(%)",
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 1,
    },
  ],
};
var myChart: any;
const resize = () => {
  myChart && myChart.resize();
};
const setChart = (isDark: boolean) => {
  if (myChart) {
    myChart && echarts.dispose(myChart);
  }
  if (!thContainer.value) throw Error("invalid thContainer!");
  if (isDark) {
    myChart = echarts.init(thContainer.value, "dark");
  } else {
    myChart = echarts.init(thContainer.value);
  }
  myChart.setOption(option, false, true);
};
</script>
