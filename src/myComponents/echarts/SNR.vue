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
    <div style="color: rgb(78, 129, 184); font-size: 20px">距离信噪比曲线</div>
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
    storeToRefs(station).radialWindData,
    storeToRefs(station).result,
    storeToRefs(station).active,
  ],
  ([radialWindData, result, active]) => {
    // option.series[0].data = [];
    // option.series[1].data = [];
    // option.series[2].data = [];
    // option.series[3].data = [];
    // radialWindData.map((v, k) => {
    // if (k == 0) {
    //   for (let timestamp in v) {
    //     v[timestamp].map((value: any, key: number) => {
    //       for (let index in value) {
    //         //index序号
    //         value[index].map((v: any) => {
    //           for (let k in v) {
    //             let item = v[k];
    //             option.series[Number(index) - 1].data.push([item.snr, item.distance]);
    //           }
    //         });
    //       }
    //     });
    //   }
    // }
    // myChart.setOption(option);
    // });

    radialWindData.map((v, k) => {
      option.series[0].data = [];
      option.series[1].data = [];
      option.series[2].data = [];
      option.series[3].data = [];
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
              //k为时间
              let tmp2 = v[k];
              if (tmp2) {
                for (let key in tmp2) {
                  for (let index in tmp2[key]) {
                    for (let m in tmp2[key][index]) {
                      let tmp3 = tmp2[key][index][m];
                      for (let n in tmp3) {
                        let item = tmp3[n];
                        option.series[Number(index) - 1].data.push([
                          item.snr,
                          item.distance,
                        ]);
                      }
                    }
                  }
                }
              }
            }
          }
        });
        myChart.setOption(option);
      } else {
        option.series[0].data = [];
        option.series[1].data = [];
        option.series[2].data = [];
        option.series[3].data = [];
        myChart.setOption(option);
      }
    });
  }
);
var option = {
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
