<template>
  <div v-dialogDrag class="planPanel z-1">
    <el-tabs
      type="border-card"
      style="width: 578px; padding: 7px; border-radius: 8px; box-sizing: border-box"
    >
      <el-tab-pane v-for="(v, k) in props" :label="k">
        <div
          style="
            box-sizing: margin-box;
            height: -webkit-fill-available;
            overflow: auto;
          "
        >
          <div
            class="item"
            @click="click(item)"
            v-for="(item, key) in v"
            :key="key"
            @mousedown.stop
          >
            <div
              class="h-full w-90px flex items-center justify-left"
              style="
                border: 1px solid grey;
                box-sizing: border-box;
                border-radius: 4px 0 0 4px;
              "
            >
              <div class="flex flex-col">
                <span>{{ item.strZydID }}</span
                ><span class="font-size-14px font-extrabold">{{ item.strName }}</span>
              </div>
            </div>
            <div class="flex flex-col w-full">
              <div class="flex">
                <div class="flex flex-col" style="border: 1px solid grey">
                  <div>作业状态</div>
                  <div style="font-weight: bolder; font-size: 16px">
                    {{ 工作状态格式化(item.ubyStatus) }}
                  </div>
                </div>
                <div class="flex flex-col" style="border: 1px solid grey">
                  <div>发送状态</div>
                  <div style="font-weight: bolder; font-size: 16px">
                    {{ 发送状态格式化(item.ubySendStatus) }}
                  </div>
                </div>
                <div class="flex flex-col" style="border: 1px solid grey">
                  <div>作业点代码</div>
                  <div style="font-weight: bolder; font-size: 16px">
                    {{ item.strCode }}
                  </div>
                </div>
                <div class="flex flex-col" style="border: 1px solid grey">
                  <div>申请时间</div>
                  <div style="font-weight: bolder; font-size: 16px">
                    {{ item.tmBeginApply.substring(10, 19) }}
                  </div>
                </div>
                <div class="flex flex-col" style="border: 1px solid grey">
                  <div>申请时长</div>
                  <div style="font-weight: bolder; font-size: 16px">
                    {{ item.iApplyTimeLen * 60 }}秒
                  </div>
                </div>
                <div
                  class="flex-1 flex flex-col"
                  style="
                    border: 1px solid grey;
                    white-space: nowrap;
                    border-radius: 0 4px 0 0;
                  "
                >
                  <div>上报单位</div>
                  <div style="font-weight: bolder; font-size: 16px">
                    {{ item.unitName }}
                  </div>
                </div>
              </div>
              <div class="flex h-full">
                <div
                  :class="`flex-1 flex justify-center items-center ${申请(item)}`"
                  style="border: 1px solid grey; font-weight: bolder"
                >
                  申请({{ moment(item.tmBeginApply).format("HH:mm:ss") }})
                </div>
                <div
                  :class="`flex-1 flex justify-center items-center ${批复(item)}`"
                  style="border: 1px solid grey; font-weight: bolder"
                >
                  批复
                </div>
                <div
                  :class="`flex-1 flex justify-center items-center ${开始(item)}`"
                  style="border: 1px solid grey; font-weight: bolder"
                >
                  开始
                </div>
                <div
                  :class="`flex-1 flex justify-center items-center ${结束(item)}`"
                  style="border: 1px solid grey; font-weight: bolder"
                >
                  结束
                </div>
                <div
                  :class="`flex-1 flex justify-center items-center ${完成(item)}`"
                  style="
                    border: 1px solid grey;
                    font-weight: bolder;
                    border-radius: 0 0 4px 0;
                  "
                >
                  完成
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="人影飞机"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
import moment from "moment";
const station = useStationStore();
const click = (item: planDataType) => {
  station.人影界面被选中的设备 = item.strZydID;
  eventbus.emit("人影-将站点移动到屏幕中心", { strPos: item.strCurPos });
};

export type zyddataType = {
  strWorkID: string;
  strZydID: string;
  ubyStatus: number;
  ubySendStatus: number;
  ubyProcStatus: number;
  strCode: string;
  strName: string;
  strWeapon: string;
  strCurPos: string;
  iRange: number;
  iMaxShotHei: number;
  strApplyUnit: string;
  tmBeginApply: string;
  iApplyTimeLen: number;
  tmApplyRev: null;
  tmApplySend: null;
  tmApplyCreate: string;
  strApplyMark: "";
  tmBeginAnswer: string | null;
  iAnswerTimeLen: number;
  strAnswerUnit: string;
  tmAnswerRev: string;
  tmAnswerSend: string;
  tmAnswerCreate: string;
  strAnswerMark: "";
  tmUpdate: string;
  strATCUnitID: string;
  vecProcess: ";11:47:06,本地作业申请(电话);11:47:15,电话下发批准;11:47:16,作业自动开始";
  strUpApplyUnit: string;
  tmBeginActing: string;
  iActingTimeLen: number;
  strEndUnit: string;
  tmEndRev: null;
  tmEndSend: null;
  tmEndCreate: null;
  strEndMark: "";
  iEndType: 0;
  bApplyValid: 0;
  bAnswerValid: 1;
  bEndValid: 0;
  iAngleBegin: number;
  iAngleEnd: number;
  bAnswerAccept: 1;
  tmEnd: null;
  bRevOver: null;
  ubyWorkCat: 0;
};
export type planDataType = {
  unitName: string;
} & zyddataType;
const props = withDefaults(
  defineProps<{ 当前作业进度: planDataType[]; 今日作业记录: planDataType[] }>(),
  {
    当前作业进度: () => new Array<planDataType>(),
    今日作业记录: () => new Array<planDataType>(),
  }
);
const 工作状态格式化 = (key: number) => {
  let status = [
    { key: 0, value: "空闲" },
    { key: 9, value: "作业完成" },
    { key: 70, vlaue: "作业保存" },
    { key: 72, value: "作业申请待批复" },
    { key: 73, value: "撤销申请待回执" },
    { key: 74, value: "已撤销" },
    { key: 75, value: "作业批准" },
    { key: 76, value: "作业不批准" },
    { key: 90, value: "作业开始带回执" },
    { key: 91, value: "作业开始" },
    { key: 92, value: "作业暂停待回执" },
    { key: 93, value: "作业强制终止" },
    { key: 99, value: "人工移除" },
    { key: 100, value: "作业结束" },
  ];
  return status.filter((item) => item.key == key)[0]?.value || `未知状态${key}`;
};
const 发送状态格式化 = (key: number) => {
  let status = [
    { key: 0, value: "空闲" },
    { key: 1, value: "等待发送" },
    { key: 2, value: "发送中" },
    { key: 3, value: "发送成功" },
    { key: 4, value: "发送失败" },
  ];
  return status.filter((item) => item.key == key)[0]?.value || `未知状态${key}`;
};
const 申请 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    case "作业申请待批复":
      return "bg-green-6";
    default:
      return "";
  }
};
const 批复 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    default:
      return "";
  }
};
const 开始 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    default:
      return "";
  }
};
const 结束 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    default:
      return "";
  }
};
const 完成 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    default:
      return "";
  }
};
</script>
<style lang="scss">
.ep-tabs.ep-tabs--border-card {
  --ep-border-color: gray;
  --ep-border-color-light: gray;
  margin-top: 0;
  & > .ep-tabs__header {
    border-bottom: 0;
    background-color: transparent;
  }
  & > .ep-tabs__header .ep-tabs__item {
    transition-duration: 0s;
    margin-top: 0;
    &.is-active {
      border-radius: 6px 6px 0 0;
      margin-top: 0;
      border-top: 1px solid var(--ep-border-color);
      border-left: 1px solid var(--ep-border-color);
    }
    &:first-child {
      margin-left: 0;
    }
  }
  & > .ep-tabs__content {
    border: 1px solid var(--ep-border-color);
    padding: 0;
    height: 400px;
    display: flex;
    border-radius: 0 6px 6px 6px;
    .ep-tab-pane {
      width: 100%;
    }
  }
}
.dark .ep-tabs.ep-tabs--border-card {
  .ep-tabs__item.is-active {
    background: #304156;
  }
  .ep-tab-pane {
    background: #304156;
  }
}
</style>
<style scoped lang="scss">
.planPanel {
  position: absolute;
  left: 10px;
  top: 240px;
  .item {
    &:hover {
      border: 1px solid cyan;
    }
    background: #00000022;
    border: 1px solid grey;
    height: 80px;
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    &:not(:first-child) {
      margin-top: 2px;
    }
    &:not(:last-child) {
      margin-bottom: 2px;
    }
  }
}
.dark .planPanel {
  .item {
    background: #ffffff22;
  }
}
</style>
