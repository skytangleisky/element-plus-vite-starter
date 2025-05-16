<template>
  <div class="echarts-container" v-resize="resize">
    <div ref="chartDom" style="width:100%;height:100%"></div>
  </div>
</template>
<script setup lang="ts">
  import * as echarts from "echarts";
  import { ref, watch, reactive, onMounted, onBeforeUnmount } from "vue";
  import { useBus } from "../bus";
  const bus = useBus();
  const chartDom = ref<HTMLElement>();
  const colors = ['#5470C6', '#EE6666'];
  let option = {
    animation:false,
    color: colors,
    tooltip: {
      trigger: 'none',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {},
    grid: {
      top:'50px',
      bottom: '20px',
      left: '50px',
      right: '40px'
    },
    xAxis: [
      {
        type: 'value',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[0]
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return (
                '水平风速  ' +
                params.value.toFixed(2) + 'm/s' +
                (params.seriesData.length ? '：' + params.seriesData[0].data : '')
              );
            }
          }
        }
      },
      {
        type: 'value',
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          onZero: false,
          lineStyle: {
            color: colors[1]
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return (
                '垂直气流  ' +
                params.value.toFixed(2) + 'm/s' +
                (params.seriesData.length ? '：' + params.seriesData[0].data : '')
              );
            }
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        position:'left',
        axisLine: {
          onZero: true,
          lineStyle: {
            color: colors[0]
          }
        },
        axisLabel:{
          show:true
        }
      },
      {
        type: 'value',
        position:'right',
        axisLine: {
          onZero: true,
          lineStyle: {
            color: colors[1]
          }
        },
        axisLabel:{
          show:true,
        }
      }
    ],
    series: [
      {
        name: '水平风速(m/s)',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex:0,
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: []
      },
      {
        name: '垂直气流(m/s)',
        type: 'line',
        xAxisIndex:1,
        yAxisIndex:0,
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: []
      }
    ],
    dataZoom: [
      // {
      // type: 'inside',
      // xAxisIndex: 0,
      // minSpan: 5
      // },
      // {
      // 	type: 'slider',
      // 	xAxisIndex: 0,
      // 	minSpan: 5,
      // 	height: 20,
      // 	bottom: 50,
      // 	handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      // 	handleSize: '120%'
      // },
      {
        type: 'inside',
        xAxisIndex: 0,
        minSpan: 1,
        zoomOnMouseWheel:'ctrl',
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        show:false,
      },
      {
        type: 'inside',
        yAxisIndex: [0, 1],
        minSpan: 1,
        zoomOnMouseWheel:'shift'
      },
      {
        type: 'slider',
        right: 10,
        yAxisIndex: [0, 1],
        show:true,
      }
    ]
  };
  let myChart:any;
  onMounted(()=>{
    myChart = echarts.init(chartDom.value!);
    myChart.setOption(option)
  })
  let globalData:any;
  watch(()=>bus.avgWindData_重庆,()=>{
    globalData = bus.avgWindData_重庆;
    const radial = (bus.avgWindData_重庆 as any).data.slice(-1)[0]
    option.series[0].data = radial.list.map((item:any)=>{
      if(item.WindSpeed==999){
        return undefined
      }else{
        return [item.WindSpeed,item.distance]
      }
    })
    option.series[1].data = radial.list.map((item:any)=>{
      if(item.WindSpeed==999){
        return undefined
      }else{
        return [item.ZWind,item.distance]
      }
    })
    myChart&&myChart.setOption(option)
  })
  function resize(){
    myChart && myChart.resize()
  }
</script>
<style scoped>
.echarts-container{
  position: relative;
  overflow: auto;
  width:29%;
  height: 100%;
}
</style>