<template>
  <div v-dialogDrag class="planPanel z-1">
    <div
      style="margin: 7px; overflow: auto; width: 550px; height: -webkit-fill-available"
    >
      <div
        @click="click(item)"
        class="item"
        v-for="(item, key) in props.list"
        :key="key"
        @mousedown.stop
      >
        <div
          class="h-full w-90px flex items-center justify-left"
          style="
            border: 1px solid grey;
            box-sizing: border-box;
            border-radius: 10px 0 0 10px;
          "
        >
          <div class="flex flex-col">
            <span>{{ item.strZydID }}</span
            ><span class="font-size-20px">{{ item.strName }}</span>
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
              <div style="font-weight: bolder; font-size: 16px">{{ item.strCode }}</div>
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
                border-radius: 0 10px 0 0;
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
              申请(17:50)
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
                border-radius: 0 0 10px 0;
              "
            >
              完成
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
const station = useStationStore();
const click = (item: planDataType) => {
  station.人影界面被选中的设备 = item.strZydID;
  eventbus.emit("人影-将站点移动到屏幕中心", { strPos: item.strCurPos });
};

type zyddataType = {
  strWorkID: "RW110000000202406120000000001752";
  strZydID: "110114091";
  ubyStatus: 100;
  ubySendStatus: 0;
  ubyProcStatus: 3;
  strCode: "真顺";
  strName: "真顺";
  strWeapon: "火箭";
  strCurPos: "116195600E40133600N";
  iRange: 10000;
  iMaxShotHei: 8000;
  strApplyUnit: "110114091";
  tmBeginApply: "2024-06-15 11:50:00";
  iApplyTimeLen: 3;
  tmApplyRev: "2014-12-30 11:47:06";
  tmApplySend: null;
  tmApplyCreate: "2014-12-30 11:47:06";
  strApplyMark: "";
  tmBeginAnswer: "2014-12-30 11:47:14";
  iAnswerTimeLen: 3;
  strAnswerUnit: "110000000";
  tmAnswerRev: "2014-12-30 11:47:15";
  tmAnswerSend: null;
  tmAnswerCreate: "2014-12-30 11:47:15";
  strAnswerMark: "";
  tmUpdate: "2014-12-30 11:47:16";
  strATCUnitID: "110000000";
  vecProcess: ";11:47:06,本地作业申请(电话);11:47:15,电话下发批准;11:47:16,作业自动开始";
  strUpApplyUnit: "110000000";
  tmBeginActing: "2014-12-30 11:47:16";
  iActingTimeLen: 0;
  strEndUnit: "";
  tmEndRev: null;
  tmEndSend: null;
  tmEndCreate: null;
  strEndMark: "";
  iEndType: 0;
  bApplyValid: 0;
  bAnswerValid: 1;
  bEndValid: 0;
  iAngleBegin: 0;
  iAngleEnd: 45;
  bAnswerAccept: 1;
  tmEnd: null;
  bRevOver: null;
  ubyWorkCat: 0;
};
export type planDataType = {
  unitName: string;
} & zyddataType;
const props = withDefaults(defineProps<{ list: planDataType[] }>(), {
  list: () => new Array<planDataType>(),
});
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
<style scoped lang="scss">
.planPanel {
  position: absolute;
  height: 400px;
  background-color: white;
  left: 10px;
  border-radius: 10px;
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
    border-radius: 10px;
    &:not(:first-child) {
      margin-top: 2px;
    }
    &:not(:last-child) {
      margin-bottom: 2px;
    }
  }
}
.dark .planPanel {
  background: #304156;
  .item {
    background: #ffffff22;
  }
}
</style>
