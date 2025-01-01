<template>
  <div
    class="transport"
    style="
      box-sizing: border-box;
      margin: 10px;
      height: -webkit-fill-available;
      overflow: auto;
    "
  >
    <table class="w-full">
      <thead>
        <tr
          class="bg-blue z-1"
          style="box-sizing: border-box; top: 0px; position: sticky"
        >
          <th>站点名称</th>
          <th>站点ID</th>
          <th>申请上报单位</th>
          <th>批复单位</th>
          <th>流转信息</th>
        </tr>
      </thead>
      <tbody style="position: relative">
        <tr v-for="(item, key) in data" :key="key">
          <td>{{item.strName}}</td>
          <td>{{ item.strZydID }}</td>
          <td>北京人影指挥中心</td>
          <td>北空</td>
          <td style="width:300px">{{ item.vecProcess }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
function beginText(item: planDataType) {
  if (工作状态格式化(item.ubyStatus)=='作业批准') {
    let seconds = moment(item.tmBeginAnswer).diff(moment(), 'seconds')
    return '('+Math.floor(seconds/60)+':'+seconds%60+')开始';
  }
  return "开始"+(item.tmBeginAnswer?'('+moment(item.tmBeginAnswer,'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')+')':'')
}
function endSeconds(item:planDataType){
  return moment(item.tmBeginAnswer).add(item.iAnswerTimeLen,'s').diff(moment(),'seconds')
}
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
  tmBeginAnswer: string;
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
const data = defineModel<Array<planDataType>>('data',{
  default:()=>[]
})

function 获取空域状态(item: planDataType) {
  if(item.ubyStatus==91) {
    return '地面作业使用中'
  }else if(item.ubyStatus==75) {
    return '未使用'
  }{
    return ''
  }
}
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
      return "bg-#0f0";
    case "作业不批准":
      return "bg-gray-4";
    case "作业批准":
      return "bg-#0f0";
    case "作业开始":
      return "bg-#0f0"
    default:
      return "";
  }
};
const 批复 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    case "作业不批准":
      return "bg-gray-4";
    case "作业批准":
      return "bg-#0f0";
    case "作业开始":
      return "bg-#0f0";
    default:
      return "";
  }
};
const 开始 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    case "作业不批准":
      return "bg-red";
    case "作业开始":
      return "bg-#0f0";
    default:
      return "";
  }
};
const 结束 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    case "作业不批准":
      return "bg-red";
    default:
      return "";
  }
};
const 完成 = (item: planDataType) => {
  switch (工作状态格式化(item.ubyStatus)) {
    case "作业结束":
      return "bg-gray-4";
    case "作业不批准":
      return "bg-red";
    default:
      return "";
  }
};
</script>
<style lang="scss">
.transport{
  table {
    border-collapse: collapse;
    overflow: auto;
    min-width: 100%;
    tr {
      line-height: 1rem;
    }
    thead {
      tr {
        th {
          border-top: none;
        }
        th:first-child {
          border-left: none;
        }
        th:last-child {
          border-right: none;
        }
      }
    }
    tbody {
      tr {
        &:hover {
          background: #00000022;
        }
        cursor: pointer;
      }
      tr.selected {
        background: #00000066;
      }
      td:first-child {
        border-left: none;
      }
      td:last-child {
        border-right: none;
      }
      tr:last-child td {
        border-bottom: none;
      }
    }
    th,
    td {
      text-align: left;
      border: 1px solid #ccc;
    }
  }
}
.dark .transport{
  table {
    tbody{
      tr {
        &:hover {
          background: #ffffff22;
        }
        cursor: pointer;
      }
      tr.selected {
        background: #ffffff66;
      }
    }
    th,td {
      border: 1px solid #2b2b2b;
    }
    td {
      border-top: 0;
    }
  }
}
</style>