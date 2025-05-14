<template>
  <div class="currentStatusInfo">
    <div class="time">2025-05-14 13:44:12</div>
    <div class="info">
      <div class="item-box">
        <el-icon>
          <Place/>
        </el-icon>
        <span>区县：</span>
        <span class="item-value">{{ statusInfo.locationName }}</span>
      </div>
      <div class="item-box">
        <el-icon><OfficeBuilding /></el-icon>
        <span>厂商：</span>
        <span class="item-value">{{ statusInfo.manufacturer }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {Place,OfficeBuilding} from "@element-plus/icons-vue";
import {reactive} from "vue";

let statusInfo = reactive({
  locationName: "太原市",
  manufacturer:'全部'
})
</script>

<style scoped lang="scss">
.currentStatusInfo {
  //background: url("~/assets/theme-img/map-module-bg.png") no-repeat;
  //background-size: 100% 100%;
  background: var(--bg-color-overlay-opacity-8);
  border:1px solid #B5D5E5;
  padding: 12px;
  margin-bottom: 12px;
  color: var(--module-title-text-color);

  .time {
    font-size: 20px;
    font-family: Digital-Classic, Menlo, Consolas, Monaco;
  }
  .info{
    display: flex;
    margin-top:8px;
  }
  .item-box {
    width: 50%;
    display: flex;
    align-items: center;
    font-size: 16px;
  .ep-icon{
    font-size: 18px;
  }
    .item-value {
      margin-left: 4px;
    }
  }
}
</style>