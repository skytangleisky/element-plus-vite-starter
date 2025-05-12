<template>
    <div class="map-module-box" v-if="!props.onlyChart">
        <div class="map-module-top">
            <span>{{ props.title }}</span>
            <span @click="showTags = !showTags" class="map-module-top-icon">
                <el-icon v-show="showTags"><ArrowUp /></el-icon>
                <el-icon v-show="!showTags"><ArrowDown /></el-icon>
            </span>
        </div>
        <div class="map-module-bottom" v-show="showTags">
            <div
                class="base-echart"
                ref="echartRef"
                :style="{ width: props.width, height: props.height }"
            ></div>
        </div>
    </div>
    <div v-else
        class="base-echart"
        ref="echartRef"
        :style="{ width: props.width, height: props.height }"
    ></div>
</template>

<script setup>
import {ArrowUp, ArrowDown} from '@element-plus/icons-vue'
import * as echarts from "echarts";
import { ref, onMounted, onBeforeUnmount, watch ,nextTick} from "vue";

let showTags = ref(true);

const props = defineProps({
    height: {
        type: String,
        default: "400px",
    },
    width: {
        type: String,
        default: "100%",
    },
    options: {
        type: Object,
        default: {},
    },
    title: {
        type: String,
    },
    // 是否仅仅只有图表容器
    onlyChart: {
        type: Boolean,
        default: false,
    },
});
const echartRef = ref(null);
let myChart;
function resizeHandle (){
    if(myChart){
        myChart.resize();
    }
}
onMounted(async() => {
    await nextTick() // 等待 DOM 更新完成
    if (echartRef.value) {
        const el = document.documentElement;
        if (el.className.indexOf("dark") != -1) {
            myChart = echarts.init(echartRef.value, "dark");
        } else {
            myChart = echarts.init(echartRef.value);
        }
        myChart.setOption(props.options);
        window.addEventListener("resize", resizeHandle);
    }
});

watch(
    () => props.options,
    (newVal, oldVal) => {
        if (myChart) {
            myChart.setOption(newVal);
        }
    },
    { deep: true }
);
onBeforeUnmount(() => {
    if (myChart) {
        window.removeEventListener('resize',resizeHandle)
        myChart.dispose(); //销毁
        myChart = null;
    }
});
</script>

<style lang="scss" scoped></style>
