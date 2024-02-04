<template>
  <div class="mainContainer">
    <div class="flex flex-row">
      <div class="listContainer" tabindex="-1">
        <el-icon v-html="listSvg" class="svg" @click="listSvgClick"></el-icon>
        <draggable
          class="draggable bg-white dark:bg-#2b2b2b"
          v-model:list="options.thData"
          style="
            position: absolute;
            left: 0;
            top: 100%;
            box-shadow: 0 0 0 1px #757575, 0 0 0 2px #010201;
            border-radius: 8px;
            overflow: hidden;
            box-sizing: border-box;
            width: fit-content;
            overflow: auto;
            position: absolute;
            z-index: 1;
            height: fit-content;
            max-height: calc(100% - 6px);
            margin: 3px;
            top: 0;
          "
        ></draggable>
      </div>
      <el-icon v-html="refreshSvg" class="svg" @click="refreshSvgClick"></el-icon>
    </div>
    <div
      style="
        display: flex;
        height: fit-content;
        flex: 1;
        box-sizing: border-box;
        overflow: auto;
      "
    >
      <template v-for="item of options.thData">
        <div v-if="item.checked" class="col">
          <div class="th dark:bg-#2b2b2b bg-white">
            {{ item.Field }}
          </div>
          <div v-for="(v, k) in options.tdData" class="cell">
            <myInput
              :k="item.Field"
              v-model:item="options.tdData[k]"
              :change="change"
            ></myInput>
          </div>
        </div>
      </template>
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
import { ElMessage } from "element-plus";
import draggable from "./draggable.vue";
import { reactive, watch } from "vue";
import myInput from "./input.vue";
import { getColumns, getAll, saveData, fetchList } from "~/api/userinfo";
const options = reactive({
  thData: new Array<any>(),
  tdData: new Array<any>(),
});

function getData() {
  return new Promise((resolve, reject) => {
    getColumns()
      .then((res) => {
        options.thData.length = 0;
        res.data[0].map((v: any) => {
          options.thData.push({ ...v, checked: true });
        });
        let currentPage = paginationOptions.currentPage;
        let pageSize = paginationOptions.pageSize;
        fetchList({
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        })
          .then((res) => {
            paginationOptions.total = res.data.total;
            options.tdData.length = 0;
            res.data.results.map((v: any) => {
              options.tdData.push(v);
            });
            resolve("得到数据");
          })
          .catch((res) => {
            ElMessage({
              message: res.response.data.sqlMessage,
              type: "error",
            });
            reject();
          });
      })
      .catch((res) => {
        ElMessage({
          message: res.response.data[0].reason.sqlMessage,
          type: "error",
        });
        reject();
      });
  });
}
getData();
const change = (item: any, k: string, oldVal: any) => {
  if (item[k] === oldVal) {
    console.log("数据未改变");
  } else {
    let tmp: { [key: string]: any } = {}; //用来存储必要的字段，减少网络传输的数据
    options.thData.map((v: any) => {
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
  pageSize: 100,
  total: 0,
});
watch(
  [() => paginationOptions.currentPage, () => paginationOptions.pageSize],
  ([currentPage, pageSize]) => {
    fetchList({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    }).then((res) => {
      if (res.status === 200) {
        paginationOptions.total = res.data.total;
        options.tdData.length = 0;
        res.data.results.map((v: any) => {
          options.tdData.push(v);
        });
      } else {
        console.log(res.data);
        ElMessage({
          message: res.data.err.sqlMessage,
          type: "error",
        });
      }
    });
  }
);

import listSvg from "~/assets/list.svg?raw";
import refreshSvg from "~/assets/refresh.svg?raw";
import { ref, h } from "vue";
const showSortList = ref(false);
const listSvgClick = () => {
  showSortList.value = true;
};
const refreshSvgClick = () => {
  getData().then(() => {
    ElMessage({
      dangerouslyUseHTMLString: true,
      message: "数据刷新完成",
      type: "success",
      showClose: true,
      center: true,
    });
  });
};
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
  .svg {
    padding: 4px;
    font-size: 1.5rem;
    color: ar(--ep-text-color-primary);
  }
  .listContainer {
    .draggable {
      display: none;
    }
    &:focus-within .draggable {
      display: block;
    }
  }
  .col {
    min-width: 160px;
    height: fit-content;
    .th {
      padding: 3px 4px;
      position: sticky;
      top: 0;
      border-top: 1px solid #444;
      border-bottom: 1px solid #444;
      border-right: 1px solid #444;
      font-weight: bolder;
      line-height: 1rem;
    }
  }
  .col {
    .cell {
      border-right: 1px solid #444;
    }
  }
  .cell:not(:nth-child(1)) {
    border-bottom: 1px solid #444;
  }
}
.dark .mainContainer {
  background-color: #282828;
}
</style>
