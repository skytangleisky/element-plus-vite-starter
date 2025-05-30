<template>
  <div class="mainContainer">
    <div class="dark:bg-#212121" style="padding:8px 10px;">
      <el-input v-model="condition" style="width: 300px" placeholder="请输入过滤条件">
        <template #prefix><el-icon><Search /></el-icon></template><template #append>
          <el-button type="primary" size="small" @click="getData()"
            >搜索</el-button
          ></template
        ></el-input
      >
    </div>
    <div class="flex flex-col relative" style="flex-grow: 1; overflow: auto">
      <div class="flex flex-row z-11 p-10px">
        <div class="listContainer z-1" tabindex="-1">
          <el-icon v-html="listSvg" class="svg" @click="listSvgClick"></el-icon>
          <draggable
            class="draggable bg-white dark:bg-#2b2b2b"
            v-model:list="options.thData"
            style="
              position: absolute;
              left: 0;
              top: 100%;
              width: fit-content;
              overflow: auto;
              position: absolute;
              max-height: 100%;
              border: 1px solid grey;
              box-sizing: border-box;
              top: 0;
            "
          ></draggable>
        </div>
        <el-icon
          v-html="addSvg"
          class="svg"
          :style="`opacity: ${addRow ? 0.5 : 1.0}`"
          @click="addSvgClick"
        ></el-icon>
        <el-icon
          v-html="subtractSvg"
          :style="`opacity: ${addRow ? 0.5 : 1.0}`"
          class="svg"
          @click="subtractSvgClick"
        ></el-icon>
        <el-icon
          v-html="tickSvg"
          :style="`opacity: ${!addRow ? 0.5 : 1.0}`"
          class="svg"
          @click="tickSvgClick"
        ></el-icon>
        <el-icon
          v-html="forkSvg"
          :style="`opacity: ${!addRow ? 0.5 : 1.0}`"
          class="svg"
          @click="forkSvgClick"
        ></el-icon>
        <el-icon
          v-html="refreshSvg"
          :style="`opacity: ${addRow ? 0.5 : 1.0}`"
          class="svg"
          @click="refreshSvgClick"
        ></el-icon>
      </div>
      <!-- <div
      style="
        display: flex;
        height: fit-content;
        flex: 1;
        box-sizing: border-box;
        overflow: auto;
        scroll-padding-top: 1rem;
      "
    >
      <table>
        <thead class="sticky top-0 bg-#2b2b2b">
          <tr>
            <template v-for="item of options.thData">
              <th v-if="item.checked">
                <div style="display: flex; flex-direction: column">
                  <span>{{ item.Field }}</span>
                  <span style="font-size: 10px">{{ item.Comment }} </span>
                </div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="(_, k) in options.tdData">
            <tr>
              <template v-for="item in options.thData">
                <td v-if="item.checked">
                  <myInput
                    :k="item.Field"
                    v-model:item="options.tdData[k]"
                    :change="change"
                  ></myInput>
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div> -->
      <div
        class="b-solid b-1px dark:b-black b-grey"
        style="
          box-sizing: border-box;
          display: flex;
          height: fit-content;
          flex: 1;
          box-sizing: border-box;
          overflow: auto;
          scroll-padding-top: 1rem;
        "
      >
        <template v-for="(item, key) of options.thData">
          <div
            v-if="item.checked"
            :class="`col ${
              item.Key === 'PRI' ? 'color-#fa0' : item.Key === 'UNI' ? 'color-red-3' : ''
            }`"
          >
            <div
              :class="`th dark:bg-#222 bg-#aaa flex flex-col ${
                addRow ? 'justify-between' : 'justify-end'
              }`"
              style="overflow: hidden;"
            >
              <div
                @keydown.stop
                v-if="addRow"
                class="dark:bg-#3b3b3b bg-#ddd"
                style="
                  border-right: 0;
                  border-bottom: 1px solid #444;
                  display: flex;
                  align-items: center;
                "
              >
                <el-checkbox
                  v-if="key == checkBoxIndex"
                  style="margin: 0 4px; height: min-content; visibility: hidden"
                ></el-checkbox>
                <myInput
                  k="Value"
                  v-model:item="options.thData[key]"
                  :change="addDataChange"
                ></myInput>
              </div>
              <div style="display: flex; flex-direction: row; align-items: center;position: relative;">
                <el-checkbox
                  v-if="key == checkBoxIndex"
                  style="margin: 0 4px; height: min-content"
                  v-model="checkAll"
                  :indeterminate="isIndeterminate"
                  @change="allChange"
                ></el-checkbox>
                <div style="display: flex; flex-direction: column; padding: 2px 6px;white-space: nowrap;">
                  {{ props.headerOption[item.Field]?.label || item.Field }}
                  <span
                    style="
                      font-size: 10px;
                      min-height: 1rem;
                      opacity: 0.5;
                      white-space: nowrap;
                      display: none;
                    "
                    >{{ item.Comment }}</span
                  >
                </div>
                <div class="resizer w-4px bg-red h-full absolute right-0 cursor-col-resize z-1"></div>
              </div>
            </div>
            <div
              v-for="(_, k) in options.tdData"
              class="cell dark:bg-#3b3b3b bg-#ddd"
              style="display: flex; flex-direction: row; align-items: center"
            >
              <el-checkbox
                v-if="key == checkBoxIndex"
                v-model="options.tdData[k].checked"
                style="margin: 0 4px; height: min-content"
              ></el-checkbox>
              <myInput
                :k="item.Field"
                v-model:item="options.tdData[k]"
                :change="change"
              ></myInput>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      style="
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row-reverse;
        padding: 5px 0;
      "
    >
      <el-pagination
        :hide-on-single-page="false"
        v-model:current-page="paginationOptions.currentPage"
        v-model:page-size="paginationOptions.pageSize"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
        :small="true"
        :disabled="false"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationOptions.total"
        style="padding: 0 10px"
      />
      <span class="sql" style="overflow: auto; white-space: nowrap">
        {{ sqlStr }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    database: string;
    table: string;
    headerOption?: { [key: string]: { label?: string; hide?: boolean } };
  }>(),
  {
    database: "",
    table: "",
    headerOption: () => ({}),
  }
);
import { Search } from "@element-plus/icons-vue";
import { CheckboxValueType, ElMessage, ElMessageBox } from "element-plus";
import draggable from "./draggable.vue";
import { reactive, watch, h, ref, onMounted, nextTick, computed } from "vue";
import myInput from "./input.vue";
import {
  getColumns,
  getAll,
  saveData,
  fetchList,
  fetchData,
  deleteData,
} from "~/api/index.js";
const options = reactive({
  thData: new Array<any>(),
  tdData: new Array<any>(),
});
const sqlStr = ref("");
const addRow = ref(false);
const condition = ref("");
let checkBoxIndex = computed(() => {
  for (let i = 0; i < options.thData.length; i++) {
    if (options.thData[i].checked == true) {
      return i;
    }
  }
  return 0;
});
watch(
  () => options.thData,
  (e) => {
    var doms = document.querySelectorAll(".col .th");
    doms.forEach((el: Element) => {
      let div = el as HTMLDivElement;
      div.style.height = "auto";
    });
    nextTick(() => {
      var maxHeight = 0;
      var doms = document.querySelectorAll(".col .th");
      doms.forEach((el: Element) => {
        let div = el as HTMLDivElement;
        if (div.scrollHeight > maxHeight) {
          maxHeight = div.scrollHeight;
        }
      });
      doms.forEach((el: Element) => {
        let div = el as HTMLDivElement;
        div.style.height = maxHeight + "px";
      });
    });
  },
  { deep: true }
);
watch(addRow, () => {
  var doms = document.querySelectorAll(".col .th");
  doms.forEach((el: Element) => {
    let div = el as HTMLDivElement;
    div.style.height = "auto";
  });
  nextTick(() => {
    var maxHeight = 0;
    var doms = document.querySelectorAll(".col .th");
    doms.forEach((el: Element) => {
      let div = el as HTMLDivElement;
      if (div.scrollHeight > maxHeight) {
        maxHeight = div.scrollHeight;
      }
    });
    doms.forEach((el: Element) => {
      let div = el as HTMLDivElement;
      div.style.height = maxHeight + "px";
    });
  });
});
function getData() {
  return new Promise((resolve, reject) => {
    getColumns({
      ...props,
    })
      .then((res) => {
        // console.log(res.data);
        options.thData.length = 0;
        let where: any = [];
        res.data[0].map((v: any) => {
          let item = { ...v, checked: false, placeholder: v.Type };
          if (["id", "uuid", "createtime", "updatetime"].indexOf(v.Field) > -1) {
            item.checked = false;
          } else {
            item.checked = true;
          }
          options.thData.push(item);
          if (condition.value != "" && item.checked) {
            where.push({
              relation: "OR",
              field: v.Field,
              relationship: "LIKE",
              condition: `%${condition.value}%`,
            });
          }
        });
        var doms = document.querySelectorAll(".col .th");
        doms.forEach((el: Element) => {
          let div = el as HTMLDivElement;
          div.style.height = "auto";
        });
        nextTick(() => {
          var maxHeight = 0;
          var doms = document.querySelectorAll(".col .th");
          doms.forEach((el: Element) => {
            let div = el as HTMLDivElement;
            if (div.scrollHeight > maxHeight) {
              maxHeight = div.scrollHeight;
            }
          });
          doms.forEach((el: Element) => {
            let div = el as HTMLDivElement;
            div.style.height = maxHeight + "px";
          });
        });
        let currentPage = paginationOptions.currentPage;
        let pageSize = paginationOptions.pageSize;

        fetchList({
          ...props,
          query: {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            where,
          },
        })
          .then((res) => {
            sqlStr.value = res.data.$pagingSql;
            paginationOptions.total = res.data.total;
            options.tdData.length = 0;
            res.data.results.map((v: any) => {
              options.tdData.push({ ...v, checked: false });
            });
            nextTick(()=>{
              $('.col').map((k:number,col:any)=>{
                $(col).find('.resizer').on('mousedown',function(event){
                  isResizing = true;
                  currentTh = $(col)[0]
                  startX = event.pageX;
                  startWidth = currentTh.offsetWidth;
                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
                })
              })
            })
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
      .catch((e) => {
        throw e;
        reject();
      });
  });
}
let isResizing = false;
let currentTh:any;
let startX = 0;
let startWidth = 0;
function onMouseMove(event:MouseEvent){
  if(isResizing){
    const newWidth = startWidth + (event.pageX - startX);
    if(newWidth>=6){
      currentTh.style['width'] = `${newWidth}px`;
    }else{
      currentTh.style['width'] = `6px`;
    }
  }
}
function onMouseUp(){
  isResizing = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
}
onMounted(() => {
  getData();
});
const change = (item: any, k: string, oldVal: any) => {
  if (item[k] === oldVal) {
    console.log("数据未改变");
  } else {
    let tmp: { [key: string]: any } = {}; //用来存储必要的字段，减少网络传输的数据
    options.thData.map((v: any) => {
      // 找出必要的字段
      if (v.Key === "PRI" || v.Key == "UNI" || v.Null == "NO") {
        tmp[v.Field] = item[v.Field];
      }
    });
    tmp[k] = item[k]; //改变数据
    saveData({ ...props, query: [tmp] })
      .then((res) => {
        console.log(res.data);
      })
      .catch((res) => {
        item[k] = oldVal; //还原数据
        ElMessage({
          message: res.response.data[0].reason.sqlMessage,
          type: "error",
        });
      });
  }
};
const addDataChange = () => {
  console.log("新增数据改变");
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
      ...props,
      query: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
    })
      .then((res) => {
        sqlStr.value = res.data.$pagingSql;
        paginationOptions.total = res.data.total;
        options.tdData.length = 0;
        res.data.results.map((v: any) => {
          options.tdData.push(v);
        });
      })
      .catch((e) => {
        ElMessage({
          message: e,
          type: "error",
        });
      });
  }
);

import listSvg from "~/assets/list.svg?raw";
import refreshSvg from "~/assets/refresh.svg?raw";
import tickSvg from "~/assets/tick.svg?raw";
import forkSvg from "~/assets/fork.svg?raw";
const showSortList = ref(false);
const listSvgClick = () => {
  showSortList.value = true;
};
const refreshSvgClick = () => {
  if (!addRow.value) {
    getData().then(() => {
      ElMessage({
        dangerouslyUseHTMLString: true,
        message: "数据刷新完成",
        type: "success",
        showClose: true,
        center: true,
      });
    });
  }
};

import addSvg from "~/assets/add.svg?raw";
import subtractSvg from "~/assets/subtract.svg?raw";
//显示添加组件
const addSvgClick = async () => {
  if (!addRow.value) {
    addRow.value = true;
    options.tdData.map((v, index) => {
      if (v.checked) {
        for (let k in v) {
          options.thData.map((item) => {
            if (k == item.Field) {
              item.Value = v[k];
            }
          });
        }
      }
    });
  }
};
//删除数据
const subtractSvgClick = () => {
  if (!addRow.value) {
    for (let v of options.thData) {
      if (v.Key === "PRI" || v.Key == "UNI") {
        let list = new Array<{ [key: string]: any }>();
        options.tdData.map((item) => {
          if (item.checked) {
            list.push({ [v.Field]: item[v.Field] });
          }
        });
        if (list.length > 0) {
          ElMessageBox({
            title: "Message",
            type: "warning",
            message: h("p", null, [
              h("span", null, "将永久删除"),
              h("i", { style: "color: red" }, list.length),
              h("span", null, "条记录！"),
            ]),
            closeOnClickModal: false,
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            beforeClose: (action, instance, done) => {
              if (action === "confirm") {
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "Deleting...";
                setTimeout(() => {
                  deleteData({ ...props, query: list }).then((res) => {
                    console.log(res);
                    instance.confirmButtonLoading = false;
                    done();
                    ElMessage({
                      type: "info",
                      message: `删除完成`,
                    });
                    getData();
                  });
                }, 0);
              } else {
                if (instance.confirmButtonLoading == false) {
                  done();
                }
              }
            },
          })
            .then((action) => {})
            .catch((e) => {});
        } else {
          ElMessage({
            type: "info",
            message: `请先选中要删除的数据`,
          });
        }
        break;
      }
    }
  }
};
//隐藏添加组件
const forkSvgClick = () => {
  if (addRow.value) {
    addRow.value = false;
    options.thData.map((v) => {
      v.Value = null;
    });
  }
};
//新增数据提交
const tickSvgClick = async () => {
  if (addRow.value) {
    let keys = [];
    for (let v of options.thData) {
      //判断是否已经存在
      if (v.Key === "PRI" || v.Key == "UNI") {
        keys.push(v.Field);
        let { data } = await fetchData({
          ...props,
          query: { key: v.Field, value: v.Value },
        });
        if (data.total > 0) {
          ElMessage({
            message: `add failed, ${v.Field}=${v.Value} already exist!`,
            type: "error",
          });
          return;
        }
      }
    }
    let tmp: { [key: string]: any } = {};
    for (let item of options.thData) {
      if (keys.includes(item.Field) && item.Value == "") {
        item.Value = null;
      }
      Object.assign(tmp, { [item.Field]: item.Value });
    }
    saveData({ ...props, query: [tmp] })
      .then((res) => {
        ElMessage({
          message: "添加数据完成",
          type: "success",
        });
        getData();
        addRow.value = false;
      })
      .catch((e) => {
        throw e;
      });
  }
};

let allChecked = ref(false);
const checkAll = computed({
  set: (val) => {
    if (options.tdData.length === 0) {
      allChecked.value = val;
    }
  },
  get: () => {
    if (options.tdData.length === 0) {
      return allChecked.value;
    } else {
      return options.tdData.every((item) => {
        return item.checked;
      });
    }
  },
});
const isIndeterminate = computed(() => {
  let checked = options.tdData.some((item) => {
    return item.checked;
  });
  let unchecked = options.tdData.some((item) => {
    return !item.checked;
  });
  return checked && unchecked;
});
const allChange = (val: CheckboxValueType) => {
  options.tdData.map((item) => {
    item.checked = val;
  });
};
</script>
<style scoped lang="scss">
.mainContainer {
  box-sizing: border-box;
  position: absolute;
  overflow: auto;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding:20px 40px;
  table {
    table-layout: fixed;
    border-left: 1px solid #444;
    border-collapse: collapse;
    height: fit-content;
    th {
      text-align: left;
      border-right: 1px solid #444;
    }
    td {
      padding: 0;
      border-right: 1px solid #444;
      border-bottom: 1px solid #444;
    }
  }
  .sql::-webkit-scrollbar {
    display: none;
  }
  .svg {
    padding: 4px;
    font-size: 1.5rem;
    color: ar(--el-text-color-primary);
  }
  .listContainer {
    .draggable {
      display: none;
    }
    &:focus-within .draggable {
      display: block;
    }
  }
  .col:first-child {
    // position: sticky;
    // z-index: 3;
    left: 0;
  }
  .col {
    z-index:1;
    width:160px;
    flex-shrink: 0;
    height: fit-content;
    .th {
      z-index: 2;
      position: sticky;
      top: 0;
      bottom: 0;
      border-bottom: 1px solid #fff;
      font-weight: bolder;
      line-height: 1rem;
    }
    &{
      .th {
        border-right: 1px solid #fff;
      }
      .cell {
        border-right: 1px solid #fff;
      }
    }
  }
  .cell {
    border-bottom: 1px solid #fff;
  }
}
.dark .mainContainer {
  background-color: #121212;
  .col {
    .th {
      border-bottom: 1px solid #282828;
    }
    &{
      .th {
        border-right: 1px solid #282828;
      }
      .cell {
        border-right: 1px solid #282828;
      }
    }
  }
  .cell {
    border-bottom: 1px solid #282828;
  }
}
</style>
<style>
.ep-overlay-message-box {
  z-index: 5;
}
</style>
