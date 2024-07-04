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
      <div style="color: rgb(78, 129, 184); font-size: 20px">距离风速曲线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div>
    <div v-resize="resize" ref="thContainer" class="w-full h-full flex-1"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
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
watch(
  [() => bus.secondWindData, () => bus.result, () => station.active],
  ([windData, result, active]) => {
    return;
    option.series[1].data = [];
    myChart.setOption(option, false, true);
    if (windData.length) {
      windData.map((v, k) => {
        let data;
        for (let key in v) {
          if (key === active) {
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
          if (key === active) {
            data = v[key][0];
          }
        }
        if (data) {
          currentTime.value = data.data_time;
          let data_list = data.data_list;
          for (let i = 0; i < data_list.length; i++) {
            let item = data_list[i];
            if (item.center_h_speed != -1000) {
              option.series[0].data.push([item.center_h_speed, item.distance]);
            }
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
