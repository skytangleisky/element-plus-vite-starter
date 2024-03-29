<template>
  <div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      table-layout="auto"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
      border
      style="width: 100%; margin-top: 20px; text-align: center"
    >
      <el-table-column prop="id" label="序号" />
      <el-table-column prop="duration" label="持续时间(s)" />
      <el-table-column prop="intensity" label="强度" />
      <el-table-column prop="date" label="日期(UTC)" />
      <el-table-column prop="time" label="时间(UTC)" />
      <el-table-column prop="lExtreme" label="左涡速度极值(m/s)" width="150" />
      <el-table-column prop="lSub" label="左涡速度差(m/s)" width="130" />
      <el-table-column prop="rExtreme" label="右涡速度极值(m/s)" width="150" />
      <el-table-column prop="rSub" label="右涡速度差(m/s)" width="130" />
      <el-table-column prop="vortexDistance" label="涡距(m)" />
      <el-table-column prop="offset" label="偏离(m)" />
      <el-table-column prop="height" label="高度(m)" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import type { TableColumnCtx } from "element-plus";

interface User {
  id: string;
  duration: string;
  intensity: string;
  date: string;
  time: string;
  lExtreme: string;
  lSub: string;
  rExtreme: string;
  rSub: string;
  vortexDistance: string;
  offset: string;
  height: string;
}

interface SpanMethodProps {
  row: User;
  column: TableColumnCtx<User>;
  rowIndex: number;
  columnIndex: number;
}
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      };
    } else if (rowIndex === 1) {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  } else if (columnIndex === 1) {
    if (rowIndex === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      };
    } else if (rowIndex === 1) {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

const tableData: User[] = [
  {
    id: "1",
    duration: "24",
    intensity: "中",
    date: "22/09/30",
    time: "16/01/28",
    lExtreme: "1.1,-4.3",
    lSub: "5.4",
    rExtreme: "0.9,-4.7",
    rSub: "5.6",
    vortexDistance: "18",
    offset: "43",
    height: "91",
  },
  {
    id: "2",
    duration: "24",
    intensity: "中",
    date: "22/09/30",
    time: "16/01/11",
    lExtreme: "1.2,-3.5",
    lSub: "4.7",
    rExtreme: "2.4,-6.2",
    rSub: "8.6",
    vortexDistance: "24",
    offset: "24",
    height: "104",
  },
];
</script>
