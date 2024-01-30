<template>
  <div class="mainContainer">
    <div
      style="
        display: flex;
        border: 1px solid #444;
        border-top: 0;
        height: fit-content;
        flex: 1;
        box-sizing: border-box;
        overflow: auto;
      "
    >
      <div v-for="item of thData" class="col">
        <div class="th dark:bg-#2b2b2b bg-white">
          {{ item.Field }}
        </div>
        <div v-for="(v, k) in tableData" class="cell">
          <myInput :k="item.Field" v-model:item="tableData[k]" :change="change"></myInput>
        </div>
      </div>
    </div>
    <div style="width: 100%; display: flex; justify-content: flex-end">
      <el-pagination
        style="padding: 10px"
        :hide-on-single-page="false"
        v-model:current-page="paginationOptions.currentPage"
        v-model:page-size="paginationOptions.pageSize"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
        :small="true"
        :disabled="false"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationOptions.total"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import myInput from "./input.vue";
import { getColumns, getAll, saveData, fetchList } from "~/api/userinfo";
const thData = reactive(new Array<any>());
getColumns().then((res) => {
  res.data[0].map((v: any) => {
    thData.push(v);
  });
});

const tableData = reactive(new Array<any>());
// getAll().then((res) => {
//   res.data[0].map((value: any) => {
//     let item: { [key: string]: any } = {};
//     for (let key in value) {
//       item[key] = value[key];
//     }
//     tableData.push(item);
//   });
// });
const change = (item: any, k: string, oldVal: any) => {
  if (item[k] === oldVal) {
    console.log("数据未改变");
  } else {
    let tmp: { [key: string]: any } = {}; //用来存储必要的字段，减少网络传输的数据
    thData.map((v: any) => {
      // 找出必要的字段
      if (v.Key === "PRI" || v.Key == "UNI") {
        tmp[v.Field] = item[v.Field];
      }
    });
    tmp[k] = item[k]; //改变数据
    saveData([tmp])
      .then((res) => {
        if (res.data.code == 50014) {
          console.log(res.data.err[0].reason.sqlMessage);
          item[k] = oldVal; //还原数据
        } else {
          console.log(res.data);
        }
      })
      .catch(() => {
        item[k] = oldVal; //还原数据
      });
  }
};
const paginationOptions = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});
watch(
  [() => paginationOptions.currentPage, () => paginationOptions.pageSize],
  ([currentPage, pageSize]) => {
    fetchList({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    }).then((res) => {
      paginationOptions.total = res.data.total;
      tableData.length = 0;
      res.data.results.map((v: any) => {
        tableData.push(v);
      });
    });
  },
  {
    immediate: true,
  }
);
</script>
<style scoped lang="scss">
.mainContainer {
  position: absolute;
  overflow: auto;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .col {
    height: fit-content;
    .th {
      padding: 3px 4px;
      position: sticky;
      top: 0;
      border-top: 1px solid #444;
      border-bottom: 1px solid #444;
      font-weight: bolder;
    }
  }
  .col:not(:last-child) {
    .th {
      border-right: 1px solid #444;
    }
    .cell {
      border-right: 1px solid #444;
    }
  }
  .cell:not(:nth-child(1), :nth-child(2)) {
    border-top: 1px solid #444;
  }
}
.dark .mainContainer {
  background-color: #282828;
}
</style>
