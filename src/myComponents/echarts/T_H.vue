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
    <div style="color: rgb(78, 129, 184); font-size: 20px">温湿度曲线</div>
    <div ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import * as echarts from "echarts";
import { isDark } from "~/composables";

var thContainer = ref(null);
watch(isDark, (isDark) => {
  setChart(isDark);
});
onMounted(() => {
  setChart(isDark.value);
});
watch(
  [() => station.avgWindData, () => station.result, () => station.active],
  ([avgWindData, result, active]) => {
    option.xAxis.data = [];
    option.series[0].data = [];
    option.series[1].data = [];
    myChart.setOption(option);
    if (avgWindData.length) {
      avgWindData.map((v, k) => {
        let data;
        for (let key in v) {
          if (result[active] && key == result[active].radar.radar_id) {
            data = v[key];
          }
        }
        if (data) {
          data.map((v, k) => {
            for (let k in v) {
              option.xAxis.data.push(k.substring(10));
              let tmp2 = v[k].slice().reverse()[0];
              if (tmp2) {
                for (let key in tmp2) {
                  let temperature = tmp2[key].ex_temp;
                  let humidity = tmp2[key].ex_hum;
                  option.series[0].data.push(temperature);
                  option.series[1].data.push(humidity);
                }
              }
            }
          });
          myChart.setOption(option);
        }
      });
    }
  }
);
var option = {
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
    data: ["15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
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
let resizeObserver: ResizeObserver;
const setChart = (isDark: boolean) => {
  if (myChart) {
    myChart && echarts.dispose(myChart);
    resizeObserver && resizeObserver.disconnect();
  }
  if (!thContainer.value) throw Error("invalid thContainer!");
  if (isDark) {
    myChart = echarts.init(thContainer.value, "dark");
  } else {
    myChart = echarts.init(thContainer.value);
  }
  resizeObserver = new ResizeObserver((entries) => {
    myChart.resize();
  });
  resizeObserver.observe(thContainer.value);

  myChart.setOption(option);
};
// onBeforeUnmount(() => {
//   resizeObserver.disconnect();
// });
</script>
