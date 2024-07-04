<template><div class="graph" ref="graphRef" v-resize="resize"></div></template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
const graphRef = ref<HTMLDivElement>();
import data from "./les-miserables.json";
const resize = () => {
  myChart.resize();
};
var myChart: any;
onMounted(() => {
  var ROOT_PATH = "https://echarts.apache.org/examples";
  myChart = echarts.init(graphRef.value);
  var option;

  myChart.showLoading();
  myChart.hideLoading();
  data.nodes.forEach(function (node) {
    node.label = {
      show: node.symbolSize > 30,
    };
  });
  option = {
    title: {
      text: "Les Miserables",
      subtext: "Default layout",
      top: "bottom",
      left: "right",
    },
    tooltip: {},
    legend: [
      {
        // selectedMode: 'single',
        data: data.categories.map(function (a) {
          return a.name;
        }),
      },
    ],
    animationDuration: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        name: "Les Miserables",
        type: "graph",
        layout: "none",
        data: data.nodes,
        links: data.links,
        categories: data.categories,
        roam: true,
        label: {
          position: "right",
          formatter: "{b}",
        },
        lineStyle: {
          color: "source",
          curveness: 0.3,
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: {
            width: 10,
          },
        },
      },
    ],
  };
  myChart.setOption(option);

  option && myChart.setOption(option);
});
onBeforeUnmount(() => {
  myChart.dispose();
});
</script>
<style scoped lang="scss">
.graph {
  position: absolute;
  inset: 0;
  background-color: #fff;
  border: 1px solid red;
}
</style>
