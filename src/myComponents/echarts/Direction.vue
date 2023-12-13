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
    <div style="color: rgb(78, 129, 184); font-size: 20px">风向廓线</div>
    <div ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
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
  [
    storeToRefs(station).avgWindData,
    storeToRefs(station).result,
    storeToRefs(station).active,
  ],
  ([avgWindData, result, active]) => {
    option.series[0].data = [];
    if (avgWindData) {
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
                    if (item.center_h_direction_abs != -1000) {
                      option.series[0].data.push([
                        item.distance,
                        item.center_h_direction_abs,
                      ]);
                    }
                  }
                }
              }
            }
          });
          myChart.setOption(option);
        } else {
          option.series[0].data = [];
          myChart.setOption(option);
        }
      });
    }
  }
);
watch(
  [
    storeToRefs(station).secondWindData,
    storeToRefs(station).result,
    storeToRefs(station).active,
  ],
  ([avgWindData, result, active]) => {
    if (avgWindData) {
      option.series[1].data = [];
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
                    if (item.center_h_direction_abs != -1000) {
                      option.series[1].data.push([
                        item.distance,
                        item.center_h_direction_abs,
                      ]);
                    }
                  }
                }
              }
            }
          });
          myChart.setOption(option);
        } else {
          option.series[1].data = [];
          myChart.setOption(option);
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
    text: "风向廓线",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  // tooltip: {
  //   trigger: "axis",
  //   formatter: function (params: any) {
  //     return [
  //       params[0].axisValueLabel,
  //       "温度：" + params[0].value,
  //       "湿度：" + (params[1] ? params[1].value : "-"),
  //     ].join("<br>");
  //   },
  // },
  polar: {},
  angleAxis: {
    type: "value",
    startAngle: 90,
    min: 0,
    max: 360,
  },
  radiusAxis: {
    // name: "米",
  },
  legend: {
    data: ["十分钟平均", "秒级"],
    orient: "vertical",
    right: 0,
  },
  // grid: {
  //   top: 80,
  //   right: 80,
  //   bottom: 20,
  // },
  // grid: {
  //   left: "3%",
  //   right: "4%",
  //   bottom: "3%",
  //   containLabel: true,
  // },
  series: [
    {
      coordinateSystem: "polar",
      name: "十分钟平均",
      type: "line",
      data: [],
    },
    {
      coordinateSystem: "polar",
      name: "秒级",
      type: "line",
      data: [],
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
onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>
