<template>
  <div class="baseLayer">
    <div class="layer-top">
      <div
          v-for="(x, xi) in dataList"
          class="btn map-btn"
          :class="{ active: activeIndex == xi }"
          @click="changeTab(xi)"
      >
        <img :src="x.icon" alt=""/>
        <div class="btn-title">{{ x.title }}</div>
      </div>

    </div>
    <div class="layer-bottom" v-if="hasPermission(['f46f5690-75ab-40a4-a578-da2b61c3ed95'])">
      <div class="charts-box" v-if="activeIndex==0">
        <base-echarts :key="1" title="雷达状态分布" height="240px" :options="basePie"></base-echarts>
        <base-echarts :key="2" title="各厂商雷达状态" height="240px" :options="baseBar"></base-echarts>
      </div>
      <radar-statistic v-if="activeIndex==1"></radar-statistic>

    </div>

  </div>
</template>

<script setup lang="ts">
import { hasPermission } from '~/tools';
import {ref, reactive, watch} from 'vue';
import radarStatistic from "./radarStatistic.vue";
import baseEcharts from "./baseEcharts.vue";
// 导入图标
import iconChart from "~/assets/layerIcon/icon-chart.png";
import iconLayer from "~/assets/layerIcon/icon-layer.png";
import {queryRadarStatus, queryRadarFactStatus} from '~/api/重庆'
import {useSettingStore} from "~/stores/setting"
let settingStore = useSettingStore();
let activeIndex = ref(0);
let adcode = ref("140100")
const dataList = [
  {
    icon: iconChart,
    title: "统计图表",
  }, {
    icon: iconLayer,
    title: "综合控制",
  }
]
// 基础扇形图数据
let basePie = reactive({
  backgroundColor: "transparent",
  // 弹窗
  tooltip: {
    trigger: "item",
  },
  // 图例
  legend: {
    // 可以设置 left、right、top、bottom 来调整图例位置
    top: "0",
    left: "center",
    textStyle: {
      color: "inherit",
      fontSize: 12,
    },
  },
  // 图形数据
  series: [
    {
      name: "雷达状态分布",
      type: "pie", //pie 扇形图
      radius: ["40%", "60%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: false,
      padAngle: 2,
      itemStyle: {
        borderRadius: 2,
      },

      //高亮
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: "bold",
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      // 数据标签
      label: {
        show: true, // 显示标签
        position: "outside", // 标签的位置，'inside'、'outside'、'left'、'right'、'top'、'bottom'
        formatter: "{b}{d}%", // 标签的格式化，{b}是名称，{c}是值，{d}%是百分比
        avoidLabelOverlap: true, // 防止标签重叠
        color: "inherit",
      },
      //数据项
      data: [
        {value: 0, name: "未知"},
        {value: 0, name: "正常"},
        {value: 0, name: "延迟"},
        {value: 0, name: "缺失"},
      ],
      // 全局调色盘。
      color: [
        "#909399",
        "#3AC8A5",
        "#e8cb1a",
        "#F56c6c",
        "#975CE4",
        "#55B8F7",
        "#FF8E59",

      ],
    },
  ],
})
// 基础条形图
let baseBar = reactive({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  // 图例
  legend: {
    // 可以设置 left、right、top、bottom 来调整图例位置
    top: "0",
    left: "center",
    textStyle: {
      color: "inherit",
      fontSize: 12,
    },
  },
  grid: {
    left: "4%",
    right: "4%",
    top: "16%",
    bottom: "0%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: [],
      color: "inherit",
      axisTick: {
        // alignWithLabel: true,
        show: false,
      },
      axisLabel: {
        rotate: 45,
        // interval:0,
      },
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "未知",
      type: "bar",
      data: [],
      barWidth: "15%",
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
      label: {
        show: true,
        color: "inherit",
        position: "top",
      },
      color: "#909399",
    }, {
      name: "正常",
      type: "bar",
      data: [],
      barWidth: "15%",
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
      label: {
        show: true,
        color: "inherit",
        position: "top",
      },
      color: "#3AC8A5",
    },
    {
      name: "延迟",
      type: "bar",
      data: [],
      barWidth: "15%",
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
      label: {
        show: true,
        color: "inherit",
        position: "top",
      },
      color: "#e8cb1a",
    },
    {
      name: "缺失",
      type: "bar",
      data: [],
      barWidth: "15%",
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
      },
      label: {
        show: true,
        color: "inherit",
        position: "top",
      },
      color: "#F56c6c",
    },
  ],
});

const getRadarStatus = () => {
  // 雷达状态分布数据
  queryRadarStatus(adcode.value).then((res) => {
    if (res.data.code == 200) {
      const data = res.data.data
      data.forEach(item => {
        basePie.series[0].data[item.status].value = item.cnt
      })
    }
  })
  // 各厂商雷达状态
  queryRadarFactStatus(adcode.value).then((res) => {
    if (res.data.code == 200) {
      const data = res.data.data
      baseBar.xAxis[0].data = data.manufacturers
      baseBar.series[0].data = data.status_0
      baseBar.series[1].data = data.status_1
      baseBar.series[2].data = data.status_2
      baseBar.series[3].data = data.status_3
    }
  })
}
const initFun = () => {
  getRadarStatus()
}
initFun()
/**
 * @author yhl 2025-05-14 17:33:04
 * @description 切换模块
 * @param index-序号
 */
const changeTab = (index: number) => {
  activeIndex.value = index

}
watch(()=>settingStore.风雷达组网地图相关.地区,newVal=>{
  adcode.value=newVal.adcodes[newVal.adcodes.length-1]
  getRadarStatus()
})
watch(activeIndex, (newVal, oldVal) => {
  if(newVal == 1){
    settingStore.风雷达组网.监控.isFoldSingle = false
  }else{
    settingStore.风雷达组网.监控.isFoldSingle = true
  }
},{immediate:true})
</script>

<style scoped lang="scss">
$tab-height: 56px;
$layer-box-max-width: 250px;
.baseLayer {

  .layer-top {
    display: flex;
    font-size: 14px;
    display: flex;
    margin-bottom: 10px;
    height: $tab-height;

    .btn {
      width: 52px;
      height: 52px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      border-radius: 4px;

      img {
        height: 28px;
        margin-bottom: 2px;
      }

      &:not(:last-child) {
        margin-right: 8px;
      }

      .btn-title {
        font-size: 10px;
      }
    }

    .map-btn {
      border-radius: 4px;
      background-color: var(--bg-color-overlay-opacity-8);
      border: 1px solid transparent;
      color: var(--module-title-text-color);

      &:hover {
        border-color: var(--ep-color-primary);
      }
    }

    .map-btn.active {
      background-color: var(--ep-color-primary-light-7);
      border-color: var(--ep-color-primary);
      color: var(--ep-text-color-primary);
    }
  }
}
</style>