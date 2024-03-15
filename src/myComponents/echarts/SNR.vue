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
      <div style="color: rgb(78, 129, 184); font-size: 20px">距离信噪比曲线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div v-resize="resize" ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import * as echarts from "echarts";
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
  () => bus.radialWindData,
  (radialWindData) => {
    option.series[0].data = [];
    option.series[1].data = [];
    option.series[2].data = [];
    option.series[3].data = [];
    myChart.setOption(option, false, true);
    if (radialWindData && radialWindData.length) {
      for (let k in radialWindData[0]) {
        let list = radialWindData[0][k];
        option.series[0].data = [];
        option.series[1].data = [];
        option.series[2].data = [];
        option.series[3].data = [];
        list.map((item) => {
          let beam = item.beam;
          let data_list = item.data_list;
          data_list.map((it) => {
            currentTime.value = it.timestamp;
            option.series[beam - 1].data.push([it.snr, it.distance]);
          });
        });
        myChart.setOption(option, false, true);
      }
    }
  }
);
var option = {
  animation: false,
  backgroundColor: "transparent",
  title: {
    show: false,
    text: "距离信噪比曲线图",
  },
  tooltip: {
    trigger: "axis",
    // formatter: function (params: any) {
    //   return [
    //     params[0].axisValueLabel,
    //     "温度：" + params[0].value,
    //     "湿度：" + (params[1] ? params[1].value : "-"),
    //   ].join("<br>");
    // },
  },
  xAxis: {
    // type: "category",
    type: "value",
    boundaryGap: false,
  },
  legend: {
    data: ["SNR1", "SNR2", "SNR3", "SNR4"],
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
      name: "距离（米）",
      type: "value",
    },
  ],
  series: [
    {
      name: "SNR1",
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 0,
    },
    {
      name: "SNR2",
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 0,
    },
    {
      name: "SNR3",
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 0,
    },
    {
      name: "SNR4",
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 0,
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
