<template>
  <div
    style="
      scroll-snap-align: start;
      scroll-snap-stop: always;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
    "
  >
    <!-- <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="color: rgb(78, 129, 184); font-size: 20px">温湿度曲线</div>
      <div style="color: grey">{{ currentTime }}</div>
    </div> -->
    <div v-resize="resize" ref="thContainer" class="w-full h-full flex-1" style="overflow: hidden;"></div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { isDark } from "~/composables";
import { eventbus } from "~/eventbus";
import moment from "moment";

var thContainer = ref(null);
watch(isDark, (isDark) => {
  setChart(isDark);
});
let aid:number;
let loop = ()=>{
  date.push(moment().format('HH:mm:ss.SSS'));
  data.push(tcpCount);
  if(date.length>1000){
    date.shift()
    data.shift()
  }
  myChart.setOption(option, false, true);
  cancelAnimationFrame(aid)
  aid = requestAnimationFrame(loop)
}
let tcpCount = 0;
onMounted(() => {
  setChart(isDark.value);
  eventbus.emit("获取nps数据")
});
const currentTime = ref("");
let date:any[] = [];
let data:any[] = [];
var option = {
  animation:false,
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%'];
    }
  },
  title: {
    left: 'center',
    text: 'Large Area Chart'
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: date
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  // dataZoom: [
  //   {
  //     type: 'inside',
  //     start: 0,
  //     end: 10
  //   },
  //   {
  //     start: 0,
  //     end: 10
  //   }
  // ],
  series: [
    {
      name: 'Connections',
      type: 'line',
      symbol: 'none',
      sampling: 'lttb',
      smooth:false,
      itemStyle: {
        color: 'rgb(255, 70, 131)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(255, 158, 68)'
          },
          {
            offset: 1,
            color: 'rgb(255, 70, 131)'
          }
        ])
      },
      data: data
    }
  ]
};
function process(item:{
    "cpu": 20,
    "io_recv": 3672,
    "io_send": 6618,
    "load1": 9.064453125,
    "load15": 6.357421875,
    "load5": 7.38916015625,
    "swap_mem": 0,
    "tcp": 0,
    "time": "17:17:53",
    "virtual_mem": 48
}){
  tcpCount = item.tcp
  cancelAnimationFrame(aid)
  aid = requestAnimationFrame(loop)
}
eventbus.on('nps数据',process)

onBeforeUnmount(()=>{
  eventbus.off('nps数据',process)
  myChart.dispose()
  cancelAnimationFrame(aid)
})
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
