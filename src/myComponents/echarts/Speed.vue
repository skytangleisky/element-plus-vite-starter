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
    <div style="color: rgb(78, 129, 184); font-size: 20px">距离风速曲线</div>
    <div ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
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
  [() => station.secondWindData, () => station.result, () => station.active],
  ([windData, result, active]) => {
    option.series[1].data = [];
    myChart.setOption(option, false, true);
    if (windData.length) {
      windData.map((v, k) => {
        let data;
        for (let key in v) {
          if (result[active] && key == result[active].radar.radar_id) {
            data = v[key];
          }
        }
        if (data) {
          data.map((v, k) => {
            if (k == 0) {
              for (let k in v) {
                let tmp2 = v[k].slice().reverse();
                for (let i = 0; i < tmp2.length; i++) {
                  for (let k in tmp2[i]) {
                    let item = tmp2[i][k];
                    if (item.center_h_speed != -1000)
                      option.series[1].data.push([item.center_h_speed, item.distance]);
                  }
                }
              }
            }
          });
          myChart.setOption(option, false, true);
        }
      });
    }
  }
);

watch(
  [() => station.avgWindData, () => station.result, () => station.active],
  ([avgWindData, result, active]) => {
    option.series[0].data = [];
    myChart.setOption(option, false, true);
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
            if (k == 0) {
              for (let k in v) {
                let tmp2 = v[k].slice().reverse();
                for (let i = 0; i < tmp2.length; i++) {
                  for (let k in tmp2[i]) {
                    let item = tmp2[i][k];
                    if (item.center_h_speed != -1000)
                      option.series[0].data.push([item.center_h_speed, item.distance]);
                  }
                }
              }
            }
          });
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
    text: "距离风速曲线图",
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
    name: "风速 (m/s)",
    type: "value",
    boundaryGap: false,
  },
  legend: {
    data: ["十分钟平均", "两分钟平均"],
  },
  grid: {
    top: 60,
    right: 80,
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
      name: "十分钟平均",
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 0,
    },
    {
      name: "两分钟平均",
      data: new Array<number>(),
      type: "line",
      smooth: true,
      yAxisIndex: 0,
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
  myChart.setOption(option, false, true);
};
onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>
