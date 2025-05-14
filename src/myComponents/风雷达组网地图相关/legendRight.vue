<template>
  <div class="legend-right">
    <div class="module-box">
      <div class="module-title">站点状态</div>
      <div class="module-content">
        <div
            class="status-item"
            v-for="item in statusData"
            :key="item.value"
        >
          <div>{{ item.label }}</div>
          <div
              class="site-status"
              :class="`status-${item.value}`"
          >
            <div class="point"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="divider-line"></div>
    <color title="风速(m/s)" demo="风速"></color>
    <div class="divider-line"></div>
    <features title="要素填图"></features>
  </div>
</template>

<script setup lang="ts">
import color from "./color.vue";
import features from "./features.vue";

const statusData = [
  {
    value: 0,
    label: "未知"
  }, {
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
  .module-content{
    display: flex;
    justify-content: space-between;
  }
  .status-item {
    display: flex;
    align-items: center;
    color: var(--el-text-color-primary);

    &:not(:last-child) {
      margin-right: 16px;
    }

    .site-status {
      margin-left: 8px;
      height: 24px;
      width: 24px;
      border-radius: 24px;
      background-color: var(--ep-color-info-light-7);
      display: flex;
      justify-content: center;
      align-items: center;

      .point {
        height: 14px;
        width: 14px;
        border-radius: 14px;
        background-color: var(--ep-color-info);
        border: 0.01rem solid #fff;
      }
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
}

.divider-line {
  border-bottom: 1px solid var(--border-color);
  margin: 10px 0;
}
</style>