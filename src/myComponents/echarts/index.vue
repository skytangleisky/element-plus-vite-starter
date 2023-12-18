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
    <div
      style="
        color: rgb(78, 129, 184);
        font-size: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      "
    >
      风速风向
      <el-select
        v-model="layerIndex"
        placeholder="Select"
        size="small"
        style="width: 100px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div ref="chartDom" class="w-full flex-1"></div>
  </div>
</template>
<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import Showers from "./data/showers_128.png?url";
import Sunny from "./data/sunny_128.png?url";
import Cloudy from "./data/cloudy_128.png?url";
import url from "./data/wind-barb-hobart.json?url";
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore();
import { useStationStore } from "~/stores/station";
const station = useStationStore();
import { storeToRefs } from "pinia";
import { Fdata } from "~/tools/fkx";
import { isDark } from "~/composables";
const chartDom = ref(null);
const layerIndex = ref(null);
const options = ref([]);
onMounted(() => {
  setEcharts(isDark.value);
});
watch(isDark, (isDark) => {
  setEcharts(isDark);
});
var myChart;
let resizeObserver;
let setEcharts = (isDark) => {
  if (myChart) {
    echarts.dispose(myChart);
    myChart = undefined;
  }
  if (isDark) {
    myChart = echarts.init(chartDom.value, "dark");
  } else {
    myChart = echarts.init(chartDom.value);
  }
  resizeObserver = new ResizeObserver((entries) => {
    myChart.resize();
  });
  resizeObserver.observe(chartDom.value);
  const dims = {
    time: 0,
    windSpeed: 1,
    R: 2,
    waveHeight: 3,
    weatherIcon: 2,
    minTemp: 3,
    maxTemp: 4,
  };
  const weatherIcons = {
    Showers,
    Sunny,
    Cloudy,
  };
  const directionMap = {};
  // prettier-ignore
  ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'].forEach(function (name, index) {
      directionMap[name] = Math.PI / 8 * index;
    });
  const arrowSize = 18;
  const weatherIconSize = 45;
  const renderArrow = function (param, api) {
    const point = api.coord([api.value(dims.time), api.value(dims.windSpeed)]);
    return {
      type: "path",
      shape: {
        pathData: "M31 16l-15-15v9h-26v12h26v9z",
        x: -arrowSize / 2,
        y: -arrowSize / 2,
        width: arrowSize,
        height: arrowSize,
      },
      // rotation: directionMap[api.value(dims.R)],
      rotation: -Number(api.value(dims.R) / 180) * Math.PI - Math.PI / 2,
      position: point,
      style: {
        lineWidth: 1,
        fill: api.visual("color"),
      },
    };
  };
  const renderWeather = function (param, api) {
    const point = api.coord([api.value(dims.time) + (3600 * 24 * 1000) / 2, 0]);
    return {
      type: "group",
      children: [
        {
          type: "image",
          style: {
            image: api.value(dims.weatherIcon),
            x: -weatherIconSize / 2,
            y: -weatherIconSize / 2,
            width: weatherIconSize,
            height: weatherIconSize,
          },
          position: [point[0], 110],
        },
        {
          type: "text",
          style: {
            text: api.value(dims.minTemp) + " - " + api.value(dims.maxTemp) + "°",
            textFont: api.font({ fontSize: 14 }),
            textAlign: "center",
            textVerticalAlign: "bottom",
          },
          position: [point[0], 80],
        },
      ],
    };
  };
  var option = {
    backgroundColor: "transparent",
    title: {
      text: "风速风向",
      subtext: "",
      left: "center",
      show: false,
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return [
          echarts.time.format("yyyy-MM-dd", params[0].value[dims.time]) +
            " " +
            echarts.time.format("hh:mm", params[0].value[dims.time]),
          "风速：" + params[0].value[dims.windSpeed],
          "风向：" + params[0].value[dims.R],
          "距离：" + params[0].value[dims.waveHeight],
        ].join("<br>");
      },
    },
    grid: {
      top: 40,
      bottom: 125,
    },
    xAxis: {
      // type: "category",
      type: "time",
      inverse: true,
      boundaryGap: 0.15,
      // type: 'time',
      // boundaryGap:true,
      // minInterval:5000,
      // maxInterval:5000,
      // interval:5000,
      // inverse:true,
      // min: function(value) {
      // 	return value.min - 1000;
      // },
      // max: function(value) {
      // 	return value.max + 1000;
      // },
      // splitLine: {
      // 	show: true,
      // 	lineStyle: {
      // 		color: '#ddd'
      // 	},
      // 	interval:'5000'
      // },
      // data: hours,
      axisLabel: {
        rotate: 360,
        // formatter: function(value, index){
        // 	return echarts.format.formatTime('hh:mm:ss', new Date(value));
        // }
      },
      splitLine: {
        show: true,
      },
      splitArea: {
        show: false,
      },
    },
    yAxis: [
      {
        name: "风速（m/s）",
        nameLocation: "middle",
        nameGap: 35,
      },
      {
        name: "高度（米）",
        nameLocation: "middle",
        nameGap: 35,
        max: 6,
        show: false,
        splitLine: { show: false },
      },
      {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
    ],
    visualMap: {
      type: "piecewise",
      // show: false,
      orient: "horizontal",
      left: "center",
      bottom: 10,
      pieces: [
        {
          gte: 7.9,
          color: "#D33C3E",
          label: "大风（>= 7.9 m/s）",
        },
        {
          gte: 5.4,
          lt: 7.9,
          color: "#f4e9a3",
          label: "中风（5.4  ~ 7.9 m/s）",
        },
        {
          lt: 5.4,
          color: "#18BF12",
          label: "微风（小于 5.4 m/s）",
        },
      ],
      seriesIndex: 1,
      dimension: 1,
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        minSpan: 5,
      },
      {
        type: "slider",
        xAxisIndex: 0,
        minSpan: 5,
        bottom: 50,
      },
    ],
    series: [
      {
        type: "line",
        yAxisIndex: 1,
        showSymbol: false,
        emphasis: {
          scale: false,
        },
        symbolSize: 10,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            global: false,
            colorStops: [
              {
                offset: 0,
                color: "rgba(88,160,253,1)",
              },
              {
                offset: 0.5,
                color: "rgba(88,160,253,0.7)",
              },
              {
                offset: 1,
                color: "rgba(88,160,253,0)",
              },
            ],
          },
        },
        lineStyle: {
          color: "rgba(88,160,253,1)",
        },
        itemStyle: {
          color: "rgba(88,160,253,1)",
        },
        encode: {
          x: dims.time,
          y: dims.waveHeight,
        },
        data: [],
        z: 2,
      },
      {
        type: "custom",
        renderItem: renderArrow,
        encode: {
          x: dims.time,
          y: dims.windSpeed,
        },
        data: [],
        z: 10,
      },
      {
        type: "line",
        symbol: "none",
        encode: {
          x: dims.time,
          y: dims.windSpeed,
        },
        lineStyle: {
          color: "#aaa",
          type: "dotted",
        },
        data: [],
        z: 1,
      },
      {
        type: "custom",
        renderItem: renderWeather,
        // data: weatherData,
        tooltip: {
          trigger: "item",
          formatter: function (param) {
            return (
              param.value[dims.time] +
              ": " +
              param.value[dims.minTemp] +
              " - " +
              param.value[dims.maxTemp] +
              "°"
            );
          },
        },
        yAxisIndex: 2,
        z: 11,
      },
    ],
  };
  // $.getJSON(url, function (rawData) {
  //   console.log(rawData);
  //   const weatherData = rawData.forecast.map(function (entry) {
  //     return [
  //       entry.localDate,
  //       0,
  //       weatherIcons[entry.skyIcon],
  //       entry.minTemp,
  //       entry.maxTemp,
  //     ];
  //   });
  //   const data = rawData.data.map(function (entry) {
  //     return [entry.time, entry.windSpeed, entry.R, entry.waveHeight];
  //   });
  //   option.series[0].data = data;
  //   option.series[1].data = data;
  //   option.series[2].data = data;
  //   // option.series[3].data = weatherData;
  //   myChart.setOption(option);
  // });
  watch(
    [
      storeToRefs(station).avgWindData,
      layerIndex,
      storeToRefs(station).result,
      storeToRefs(station).active,
    ],
    ([avgWindData, layerIdx, result, active]) => {
      if (avgWindData) {
        avgWindData.map((v, k) => {
          let data;
          for (let key in v) {
            if (result[active] && key == result[active].radar.radar_id) {
              data = v[key];
            }
          }
          if (data) {
            options.value = [];
            for (let K in data[0]) {
              for (let i = 0; i < data[0][K].length; i++) {
                for (let key in data[0][K][i]) {
                  options.value.push({
                    value: i,
                    label: `${key}米`,
                  });
                }
              }
              if (layerIndex.value == null) {
                layerIndex.value = data[0][K].length - 1;
              }
            }
            let Fdatas = [];
            data.map((v, k) => {
              for (let k in v) {
                let fData = [];
                fData[0] = k;
                let tmp2 = v[k][layerIdx];
                if (tmp2) {
                  for (let key in tmp2) {
                    fData[1] = tmp2[key].center_h_speed;
                    fData[2] = tmp2[key].center_h_direction_abs;
                    fData[3] = tmp2[key].distance;
                  }
                  if (fData[1] === -1000) {
                  } else {
                    Fdatas.unshift(fData);
                  }
                }
              }
            });
            // option.series[0].data = Fdatas;
            option.series[1].data = Fdatas;
            option.series[2].data = Fdatas;
            myChart.setOption(option);
          } else {
            option.series[1].data = [];
            option.series[2].data = [];
            myChart.setOption(option);
          }
        });
      }
    },
    { immediate: true }
  );

  option && myChart.setOption(option);
};
onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>
