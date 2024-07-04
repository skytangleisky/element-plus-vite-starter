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
      <div style="color: rgb(78, 129, 184); font-size: 20px">风向廓线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div v-resize="resize" ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
const bus = useBus();
import { isDark } from "~/composables";

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
    option.series[0].data = [];
    myChart.setOption(option, false, true);
    if (avgWindData) {
      avgWindData.map((v, k) => {
        let data;
        for (let key in v) {
          if (key == active) {
            data = v[key][0];
          }
        }
        if (data) {
          currentTime.value = data.data_time;
          let data_list = data.data_list;
          for (let i = 0; i < data_list.length; i++) {
            if (data_list[i].center_h_direction_abs != -1000) {
              option.series[0].data.push([
                data_list[i].distance,
                data_list[i].center_h_direction_abs,
              ]);
            }
          }
          myChart.setOption(option, false, true);
        }
      });
    }
  }
);
watch(
  [() => bus.secondWindData, () => bus.result, () => station.active],
  ([avgWindData, result, active]) => {
    return;
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
    data: ["十分钟平均", "两分钟平均"],
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
      name: "两分钟平均",
      type: "line",
      data: [],
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
