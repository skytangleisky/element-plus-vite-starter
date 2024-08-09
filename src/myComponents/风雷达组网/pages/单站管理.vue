<template>
  <datatable
    style="padding: 10px"
    :database="databaseRaw"
    table="device"
    :headerOption="headerOption"
  ></datatable>
</template>
<script lang="ts" setup>
import { databaseRaw } from "~/api/重庆";
import { reactive } from "vue";
import datatable from "~/myComponents/datatable/index.vue";
const headerOption = reactive({
  id: {
    label: "主键",
    hide: true,
  },
  uuid: {
    label: "唯一标识",
  },
  no: {
    label: "编号",
  },
  device_name: {
    label: "设备名称",
  },
  device_short_name: {
    label: "设备简称",
  },
  device_type: {
    label: "设备类型",
  },
  device_no: {
    label: "设备编号",
  },
  device_model: {
    label: "设备型号",
  },
  address: {
    label: "地址",
  },
  manufacturer: {
    label: "厂商",
  },
  lng: {
    label: "经度",
  },
  lat: {
    label: "纬度",
  },
  altitude: {
    label: "海拔高度",
  },
  height: {
    label: "气压海拔高度",
  },
  data_path: {
    label: "数据路径",
  },
  color: {
    label: "颜色",
  },
  status: {
    label: "设备状态",
  },
  speed: {
    label: "风速",
  },
  hide: {
    label: "是否隐藏",
  },
  orientation: {
    label: "风向",
  },
  cratetime: {
    label: "创建时间",
  },
  updatetime: {
    label: "更新时间",
  },
});
</script>
