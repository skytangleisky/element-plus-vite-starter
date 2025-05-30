<template>
  
    <div class="legend-left map-module-box">
      <div class="map-module-top">
        <span>气象产品图例</span>
        <span @click="showBottom = !showBottom" class="map-module-top-icon">
                <el-icon v-show="showBottom"><ArrowUp/></el-icon>
                <el-icon v-show="!showBottom"><ArrowDown/></el-icon>
            </span>
      </div>
      <div class="map-module-bottom" v-show="showBottom">
        <color v-if="判断是否显示水平风速色标" title="水平风速(m/s)" demo="风速"></color>
        <color v-if="判断是否显示流线色标" title="流线(m/s)" demo="流线"></color>
        <color v-if="判断是否显示等值线色标" title="等值线(m/s)" demo="等值线"></color>
        <div v-if="是否显示分割线" class="divider-line"></div>
        <features v-if="判断是否显示要素填图" title="要素填图"></features>
      </div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch, computed } from 'vue';
import color from "./color.vue";
import features from "./features.vue";
import {useSettingStore} from "~/stores/setting";
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";
const 判断是否显示水平风速色标 = computed(()=>setting.风雷达组网地图相关.风场||setting.风雷达组网地图相关.feather)
const 判断是否显示流线色标 = computed(()=>setting.风雷达组网地图相关.流线)
const 判断是否显示等值线色标 = computed(()=>setting.风雷达组网地图相关.等值线||setting.风雷达组网地图相关.等值带)
const 判断是否显示要素填图 = computed(()=>setting.风雷达组网地图相关.站号||setting.风雷达组网地图相关.站名||setting.风雷达组网地图相关.feather||setting.风雷达组网地图相关.垂直气流)
const 是否显示分割线 = computed(()=>(判断是否显示水平风速色标.value||判断是否显示流线色标.value||判断是否显示等值线色标.value)&&判断是否显示要素填图.value)
const setting = useSettingStore();

// 控制整个模块折叠显示效果
let showBottom = ref(true)
showBottom.value = setting.风雷达组网.监控.isFoldSingle
watch(()=>setting.风雷达组网.监控.isFoldSingle,newVal=>{
  // showBottom.value =newVal
})
</script>

<style lang="scss">
.module-title {
  border-left: 3px solid #128aed;
  box-sizing: border-box;
  margin-bottom: 10px;
  text-align: left;
  padding-left: 10px;
  color: var(--el-text-color-regular);
}
</style>
<style scoped lang="scss">
// .module-box {
//   .module-content {
//     display: flex;
//     justify-content:space-around;
//   }

//   .site-status {

//     .point {
//       height: 14px;
//       width: 14px;
//       border-radius: 14px;
//       background-color: var(--el-color-info);
//       border: 0.01rem solid #fff;
//     }

//     .item-status {
//       margin-left: 8px;
//       height: 24px;
//       width: 24px;
//       border-radius: 24px;
//       background-color: var(--el-color-info-light-7);
//       display: flex;
//       justify-content: center;
//       align-items: center;
//     }

//     .status-1 {
//       background-color: var(--el-color-success-light-7);

//       .point {
//         background-color: var(--el-color-success);
//       }
//     }

//     .status-2 {
//       background-color: var(--el-color-warning-light-7);

//       .point {
//         background-color: var(--el-color-warning);
//       }
//     }

//     .status-3 {
//       background-color: var(--el-color-danger-light-7);

//       .point {
//         background-color: var(--el-color-danger);
//       }
//     }
//   }

//   .item-box {
//     display: flex;
//     align-items: center;
//     color: var(--el-text-color-primary);

//     &:not(:last-child) {
//       margin-right: 16px;
//     }


//   }

//   .manufacturer-box {
//     .item-status {
//       margin-left: 8px;
//       width: 12px;
//       height: 12px;
//       border:1px solid var(--border-color);
//       background-color:var(--border-color);
//     }

//     .status-0 {

//       border-radius:50%;

//     }

//     .status-1 {
//       width: 0;
//       height: 0;
//       border-top:none;
//       border-left: 8px solid transparent;
//       border-right: 8px solid transparent;
//       border-bottom: 12px solid var(--border-color);
//       background-color:transparent;
//     }

//     .status-2 {
//       width: 10px;
//       height: 10px;
//       transform: rotate(45deg);
//     }
//   }
// }

.divider-line {
  border-bottom: 1px solid var(--border-color);
  margin: 10px 0;
}
</style>