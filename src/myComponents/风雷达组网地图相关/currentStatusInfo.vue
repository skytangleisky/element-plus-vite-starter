<template>
  <div class="currentStatusInfo">
    <div class="time" v-html="moment(setting.风雷达组网地图相关.currentTime,'YYYYMMDDHHmmss').format('YYYY-MM-DD[&emsp;]HH:mm:ss')"></div>
    <div class="info">
      <div class="item-box">
        <el-icon>
          <Place/>
        </el-icon>
        <span>区划：</span>
        <span class="item-value">{{ setting.风雷达组网地图相关.地区.address.slice(-1)[0] }}</span>
      </div>
      <div class="item-box">
        <el-icon><OfficeBuilding /></el-icon>
        <span>厂商：</span>
        <span class="item-value">{{ setting.风雷达组网地图相关.manufacturer }}</span>
      </div>
    </div>
    <Dialog></Dialog>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from "~/stores/setting";
import Dialog from './dialog.vue'
const setting = useSettingStore()
import {Place,OfficeBuilding} from "@element-plus/icons-vue";
import moment from "moment";
</script>

<style scoped lang="scss">
.currentStatusInfo {

  background: var(--bg-color-overlay-opacity-8);
  border:1px solid var(--border-color);
  padding: 12px;
  margin-bottom: 12px;
  color: var(--el-text-color-regular);

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
    margin-bottom: 12px;
  .ep-icon{
    font-size: 18px;
  }
    .item-value {
      margin-left: 4px;
    }
  }
}
</style>