<template>
  <div
    style="
      display: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: aliceblue;
      overflow: auto;
    "
  >
    <div>
      <div style="display: flex; flex-direction: column; align-items: center">
        <span class="title" style="font-size: 20px; font-weight: bold; color: black"
          >机舱标定架布局</span
        >
        <span class="subTitle" style="font-size: 14px; color: grey"
          >总位置：###&emsp;已占用：###&emsp;空余：###</span
        >
        <div class="engineRoom jc">
          <div
            v-for="(v, k) in options.jc"
            :key="k"
            style="display: flex; align-items: center; justify-content: center"
          >
            <div
              class="text"
              :style="`background:${v.color};height:min-content;`"
              @click="click(v)"
            >
              {{ v.text }}
            </div>
            <el-progress
              :style="`opacity: ${v.opacity};`"
              type="dashboard"
              :percentage="v.percentage"
              :stroke-width="20"
              status="warning"
            >
              <template #default="{ percentage }">
                <span style="margin-left: -40%; color: black">{{ percentage }}</span>
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
          >总位置：###&emsp;已占用：###&emsp;空余：###</span
        >
        <div class="engineRoom ts">
          <div v-for="(v, k) in options.ts" :key="k" style="display: flex">
            <div
              class="text"
              :style="`background:${v.color};height:min-content`"
              @click="click(v)"
            >
              {{ v.text }}
            </div>
            <el-progress
              :style="`opacity: ${v.opacity};`"
              type="dashboard"
              :percentage="v.percentage"
              :stroke-width="20"
              status="warning"
            >
              <template #default="{ percentage }">
                <span style="margin-left: -40%; color: black">{{ percentage }}</span>
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
  jc: new Array<any>(),
  ts: new Array<any>(),
});
查询标定场数据接口({}).then((res) => {
  let { jc, ts } = res.data.data;
  jc.map((v: any) => {
    v.map((item: any) => {
      let percentage = 0;
      if (item.start_time) {
        if (item.end_time) {
          percentage = Math.round(
            ((Date.parse(item.end_time) - Date.parse(item.start_time)) /
              item.test_time /
              1000 /
              3600) *
              100
          );
        } else {
          console.log(item.start_time);
          percentage = Math.round(
            ((Date.now() - Date.parse(item.start_time)) / item.test_time / 1000 / 3600) *
              100
          );
        }
      }
      options.jc.push({
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
        opacity: item.status === 2 ? 0 : 1,
      });
    });
  });
  ts.map((v: any) => {
    v.map((item: any) => {
      let percentage = 0;
      if (v.start_time) {
        if (v.end_time) {
          percentage = Math.round(
            ((Date.parse(item.end_time) - Date.parse(item.start_time)) /
              item.test_time /
              1000 /
              3600) *
              100
          );
        } else {
          percentage = Math.round(
            ((Date.now() - Date.parse(item.start_time)) / item.test_time / 1000 / 3600) *
              100
          );
        }
      }
      // options.ts.push({
      //   text: item.name,
      //   color:
      //     item.status == 0
      //       ? "#f00"
      //       : item.status == 1
      //       ? "#92d050"
      //       : item.status == 2
      //       ? "#808080"
      //       : "#000",
      //   id: item.id,
      //   percentage,
      //   opacity: item.status === 2 ? 0 : 1,
      // });
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
  grid-template-rows: repeat(7, 30px);
  &.jc {
    grid-template-columns: repeat(12, 100px);
  }
  &.ts {
    grid-template-columns: repeat(7, 100px);
  }
  .text {
    width: 4rem;
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
