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
        <color title="风速(m/s)" demo="风速"></color>
        <div class="divider-line"></div>
        <features title="要素填图"></features>

      </div>
    </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import color from "./color.vue";
import features from "./features.vue";
import {useSettingStore} from "~/stores/setting";
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";

const setting = useSettingStore();

// 控制整个模块折叠显示效果
let showBottom = ref(true)
showBottom.value = setting.风雷达组网.监控.isFoldSingle
watch(()=>setting.风雷达组网.监控.isFoldSingle,newVal=>{
  showBottom.value =newVal
})
</script>

<style lang="scss">
.module-title {
  border-left: 3px solid #128aed;
  box-sizing: border-box;
  margin-bottom: 10px;
  text-align: left;
  padding-left: 10px;
  color: var(--module-title-text-color);
}
</style>
<style scoped lang="scss">
.module-box {
  .module-content {
    display: flex;
    justify-content:space-around;
  }

  .site-status {

    .point {
      height: 14px;
      width: 14px;
      border-radius: 14px;
      background-color: var(--ep-color-info);
      border: 0.01rem solid #fff;
    }

    .item-status {
      margin-left: 8px;
      height: 24px;
      width: 24px;
      border-radius: 24px;
      background-color: var(--ep-color-info-light-7);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .status-1 {
      background-color: var(--ep-color-success-light-7);

      .point {
        background-color: var(--ep-color-success);
      }
    }

    .status-2 {
      background-color: var(--ep-color-warning-light-7);

      .point {
        background-color: var(--ep-color-warning);
      }
    }

    .status-3 {
      background-color: var(--ep-color-danger-light-7);

      .point {
        background-color: var(--ep-color-danger);
      }
    }
  }

  .item-box {
    display: flex;
    align-items: center;
    color: var(--el-text-color-primary);

    &:not(:last-child) {
      margin-right: 16px;
    }


  }

  .manufacturer-box {
    .item-status {
      margin-left: 8px;
      width: 12px;
      height: 12px;
      border:1px solid var(--border-color);
      background-color:var(--border-color);
    }

    .status-0 {

      border-radius:50%;

    }

    .status-1 {
      width: 0;
      height: 0;
      border-top:none;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 12px solid var(--border-color);
      background-color:transparent;
    }

    .status-2 {
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
    }
  }
}

.divider-line {
  border-bottom: 1px solid var(--border-color);
  margin: 10px 0;
}
</style>