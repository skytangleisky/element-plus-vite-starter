<template>
  <div class="legend-right">
    <div class="module-box">
      <div class="module-title">厂商</div>
      <div class="module-content manufacturer-box">
        <div
            class="item-box"
            v-for="item in manufacturerData"
            :key="item.value"
        >
          <div>{{ item.label }}</div>
          <div
              class="item-status"
              :class="`status-${item.value}`"
          >
            <div class="point"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="divider-line"></div>
    <div class="module-box">
      <div class="module-title">站点状态</div>
      <div class="module-content site-status">
        <div
            class="item-box"
            v-for="item in statusData"
            :key="item.value"
        >
          <div>{{ item.label }}</div>
          <div
              class="item-status"
              :class="`status-${item.value}`"
          >
            <div class="point"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="是否显示分割线1" class="divider-line"></div>
    <color v-if="判断是否显示水平风速色标" title="水平风速(m/s)" demo="风速"></color>
    <color v-if="判断是否显示流线色标" title="流线(m/s)" demo="流线"></color>
    <color v-if="判断是否显示等值线色标" title="等值线(m/s)" demo="等值线"></color>
    <div v-if="是否显示分割线2" class="divider-line"></div>
    <features v-if="判断是否显示要素填图" title="要素填图"></features>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from '~/stores/setting';
import {computed} from 'vue'
import color from "./color.vue";
import features from "./features.vue";

const statusData = [

  {
    value: 1,
    label: "正常"
  }, {
    value: 2,
    label: "延迟"
  }, {
    value: 3,
    label: "缺失"
  },
]
const manufacturerData = [
  {
    value: 0,
    label: "华航"
  }, {
    value: 1,
    label: "西物"
  }, {
    value: 2,
    label: "镭测"
  },
]
const setting = useSettingStore();
const 判断是否显示水平风速色标 = computed(()=>setting.风雷达组网地图相关.风场||setting.风雷达组网地图相关.feather)
const 判断是否显示流线色标 = computed(()=>setting.风雷达组网地图相关.流线)
const 判断是否显示等值线色标 = computed(()=>setting.风雷达组网地图相关.等值线||setting.风雷达组网地图相关.等值带)
const 判断是否显示要素填图 = computed(()=>setting.风雷达组网地图相关.站号||setting.风雷达组网地图相关.站名||setting.风雷达组网地图相关.feather||setting.风雷达组网地图相关.垂直气流)
const 是否显示分割线1 = computed(()=>(判断是否显示水平风速色标.value||判断是否显示流线色标.value||判断是否显示等值线色标.value))
const 是否显示分割线2 = computed(()=>(判断是否显示要素填图.value))
</script>

<style lang="scss">
.module-title {
  border-left: 3px solid #128aed;
  box-sizing: border-box;
  margin-bottom: 10px;
  text-align: left;
  padding-left: 10px;
  color: var(--ep-text-color-regular);
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