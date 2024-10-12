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
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
const bus = useBus();
import { isDark } from "~/composables";
import moment from "moment";

var thContainer = ref(null);
watch(isDark, (isDark) => {
  setChart(isDark);
});
onMounted(() => {
  setChart(isDark.value);
});
const currentTime = ref("");
watch(() => bus.avgWindData_重庆,(avgWindData:any) => {
    option.series[0].data = [];
    myChart.setOption(option, false, true);
    if (avgWindData.data&&avgWindData.data.length>0) {
      let radial = avgWindData.data[0]
      currentTime.value = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
      radial.list.map((lib:any)=>{
        if (lib['WindDirection'] != 999) {
          option.series[0].data.push([
            lib['distance'],
            lib['WindDirection'],
          ] as never);
        }
      })
      myChart.setOption(option, false, true);
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
    axisPointer:{
      type:'cross'
    },
    formatter: function (params: any) {
      return [
        `高度:${params[0].data[0]}m`,
        `方向:${params[0].data[1]}°`
      ].join("<br>");
    },
  },
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
    data: ["十分钟平均"],
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
    }
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
