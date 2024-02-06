<template>
  <div
    style="
      display: absolute;
      width: 100%;
      height: 100%;
      background-color: aliceblue;
      overflow: auto;
    "
  >
    <div style="/*border: 1px solid red;*/ height: fit-content; width: fit-content">
      <div style="display: flex; flex-direction: column; align-items: center">
        <span class="title" style="font-size: 20px; font-weight: bold; color: black"
          >机舱标定架布局</span
        >
        <span class="subTitle" style="font-size: 14px; color: grey"
          >总位置：{{ options.jc.total }}&emsp;已占用：{{
            options.jc.used_count
          }}&emsp;空余：{{ options.jc.unused_count }}</span
        >
        <div class="engineRoom jc">
          <div
            v-for="(v, k) in options.jc.data"
            :key="k"
            style="display: flex; align-items: center; justify-content: center"
          >
            <el-popover
              placement="top-start"
              title="Title"
              :width="200"
              trigger="hover"
              content="this is content, this is content, this is content"
            >
              <template #reference
                ><div
                  class="text"
                  :style="`background:${v.color};height:min-content;`"
                  @click="click(v)"
                >
                  <div style="font-size: 12px; line-height: 12px">{{ v.hour }}h</div>
                  {{ v.text }}
                </div>
              </template>
            </el-popover>
            <el-progress
              :style="`opacity: ${v.opacity};`"
              type="dashboard"
              :percentage="v.percentage"
              :stroke-width="20"
              status="warning"
            >
              <template #default="{ percentage }">
                <span style="font-size: 10px; color: grey; margin-left: -2em"
                  >{{ percentage }}%</span
                >
              </template>
            </el-progress>
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center">
        <span class="title" style="font-size: 20px; font-weight: bold; color: black"
          >塔式标定架布局</span
        >
        <span class="subTitle" style="font-size: 14px; color: grey"
          >总位置：{{ options.ts.total }}&emsp;已占用：{{
            options.ts.used_count
          }}&emsp;空余：{{ options.ts.unused_count }}</span
        >
        <div class="engineRoom ts">
          <div v-for="(v, k) in options.ts.data" :key="k" style="display: flex">
            <el-popover
              placement="top-start"
              title="Title"
              :width="200"
              trigger="hover"
              content="this is content, this is content, this is content"
            >
              <template #reference
                ><div
                  class="text"
                  :style="`background:${v.color};height:min-content;`"
                  @click="click(v)"
                >
                  <div style="font-size: 12px; line-height: 12px">{{ v.hour }}h</div>
                  {{ v.text }}
                </div>
              </template>
            </el-popover>
            <el-progress
              :style="`opacity: ${v.opacity};`"
              type="dashboard"
              :percentage="v.percentage"
              :stroke-width="20"
              status="warning"
            >
              <template #default="{ percentage }">
                <span style="font-size: 10px; color: grey; margin-left: -2em"
                  >{{ percentage }}%</span
                >
              </template>
            </el-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { 查询标定场数据接口 } from "~/api/光恒/calibration";
import { reactive, ref } from "vue";
const options = reactive({
  jc: {
    total: 0,
    used_count: 0,
    unused_count: 0,
    data: new Array<any>(),
  },
  ts: {
    total: 0,
    used_count: 0,
    unused_count: 0,
    data: new Array<any>(),
  },
});
查询标定场数据接口({}).then((res) => {
  console.log(res.data.data);
  let { jc, ts } = res.data.data;
  options.jc.total = jc.total;
  options.jc.used_count = jc.used_count;
  options.jc.unused_count = jc.unused_count;
  jc.data.map((v: any) => {
    v.map((item: any) => {
      let percentage = 0;
      let hour = 0;
      if (item.start_time) {
        if (item.end_time) {
          hour =
            Math.floor(
              (Date.parse(item.end_time) - Date.parse(item.start_time)) / 1000 / 360
            ) / 10;
          percentage = Math.round(
            ((Date.parse(item.end_time) - Date.parse(item.start_time)) /
              item.test_time /
              1000 /
              3600) *
              100
          );
          if (percentage > 100) percentage = 100;
        } else {
          console.log(item.start_time);
          hour = Math.floor((Date.now() - Date.parse(item.start_time)) / 1000 / 360) / 10;
          percentage = Math.round(
            ((Date.now() - Date.parse(item.start_time)) / item.test_time / 1000 / 3600) *
              100
          );
          if (percentage > 100) percentage = 100;
        }
      }
      options.jc.data.push({
        text: item.name,
        color:
          item.status == 0
            ? "#f00"
            : item.status == 1
            ? "#92d050"
            : item.status == 2
            ? "#808080"
            : "#000",
        id: item.id,
        percentage,
        hour,
        opacity: item.status === 2 ? 0 : 1,
      });
    });
  });
  options.ts.total = ts.total;
  options.ts.used_count = ts.used_count;
  options.ts.unused_count = ts.unused_count;
  ts.data.map((v: any) => {
    v.map((item: any) => {
      let percentage = 0;
      let hour = 0;
      if (v.start_time) {
        if (v.end_time) {
          hour =
            Math.floor(
              (Date.parse(item.end_time) - Date.parse(item.start_time)) / 1000 / 360
            ) / 10;
          percentage = Math.round(
            ((Date.parse(item.end_time) - Date.parse(item.start_time)) /
              item.test_time /
              1000 /
              3600) *
              100
          );
          if (percentage > 100) percentage = 100;
        } else {
          hour = Math.floor((Date.now() - Date.parse(item.start_time)) / 1000 / 360) / 10;
          percentage = Math.round(
            ((Date.now() - Date.parse(item.start_time)) / item.test_time / 1000 / 3600) *
              100
          );
          if (percentage > 100) percentage = 100;
        }
      }
      options.ts.data.push({
        text: item.name,
        color:
          item.status == 0
            ? "#f00"
            : item.status == 1
            ? "#92d050"
            : item.status == 2
            ? "#808080"
            : "#000",
        id: item.id,
        percentage,
        hour,
        opacity: item.status === 2 ? 0 : 1,
      });
    });
  });
});
const click = (v: any) => {
  console.log(v.id);
  window.top?.open(
    `https://main.emgo-tech.com/admin/device/radarcalibrationfield/${v.id}/change/`,
    "_self"
  );
};
</script>
<style lang="scss">
.engineRoom {
  display: grid;
  grid-template-rows: repeat(7, 40px);
  &.jc {
    grid-template-columns: repeat(12, 80px);
  }
  &.ts {
    grid-template-columns: repeat(7, 80px);
  }
  .text {
    width: 3rem;
    padding: 4px 0;
    border-radius: 8px;
    background-color: #bbe0e3;
    border: 1px solid #7dc4c9;
    text-align: center;
    vertical-align: middle;
  }
  .ep-progress-circle {
    width: 30px !important;
    height: 30px !important;
  }
}
</style>
