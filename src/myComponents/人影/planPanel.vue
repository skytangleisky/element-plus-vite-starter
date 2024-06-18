<template>
  <div v-dialogDrag class="planPanel z-1">
    <div class="item m-t-4px m-b-4px" v-for="(item, key) in props.list" :key="key">
      <div
        class="h-full w-90px flex items-center justify-left"
        style="border: 1px solid grey; box-sizing: border-box"
      >
        <div class="flex flex-col">
          <span>13073009</span><span class="font-size-20px">狼山</span>
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
            <div style="font-weight: bolder; font-size: 16px">发送成功</div>
          </div>
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>作业点代码</div>
            <div style="font-weight: bolder; font-size: 16px">915</div>
          </div>
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>申请时间</div>
            <div style="font-weight: bolder; font-size: 16px">17:59</div>
          </div>
          <div class="flex flex-col" style="border: 1px solid grey">
            <div>申请时长</div>
            <div style="font-weight: bolder; font-size: 16px">60秒</div>
          </div>
          <div
            class="flex-1 flex flex-col"
            style="border: 1px solid grey; white-space: nowrap"
          >
            <div>上报单位</div>
            <div style="font-weight: bolder; font-size: 16px">北京气象局</div>
          </div>
        </div>
        <div class="flex h-full">
          <div
            class="flex-1 flex justify-center items-center bg-green-7"
            style="border: 1px solid grey; font-weight: bolder"
          >
            申请(17:50)
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            批复
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            开始
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            结束
          </div>
          <div
            class="flex-1 flex justify-center items-center"
            style="border: 1px solid grey; font-weight: bolder"
          >
            完成
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface Item {
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
  tmApplyRev: string;
  tmApplySend: string;
  tmApplyCreate: string;
  strApplyMark: string;
  tmBeginAnswer: string;
  iAnswerTimeLen: number;
  strAnswerUnit: string;
  tmAnswerRev: string;
  tmAnswerSend: string;
  tmAnswerCreate: string;
  strAnswerMark: string;
  tmUpdate: string;
  strATCUnitID: string;
  vecProcess: string;
  strUpApplyUnit: string;
  tmBeginActing: string;
  iActingTimeLen: number;
  strEndUnit: string;
  tmEndRev: string;
  tmEndSend: string;
  tmEndCreate: string;
  strEndMark: string;
  iEndType: number;
  bApplyValid: number;
  bAnswerValid: number;
  bEndValid: number;
  iAngleBegin: number;
  iAngleEnd: number;
  bAnswerAccept: number;
  tmEnd: string;
  bRevOver: number;
  ubyWorkCat: number;
}
const props = withDefaults(defineProps<{ list: Item[] }>(), {
  list: () => new Array<Item>(),
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
</script>
<style scoped lang="scss">
.planPanel {
  overflow: auto;
  position: absolute;
  width: 530px;
  height: 400px;
  background-color: white;
  left: 10px;
  border-radius: 10px;
  padding: 7px;
  top: 240px;
  .item {
    border: 1px solid grey;
    height: 80px;
    display: flex;
    flex-direction: row;
  }
}
.dark .planPanel {
  background: #304156;
}
</style>
