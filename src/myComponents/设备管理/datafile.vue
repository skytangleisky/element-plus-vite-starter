<template>
  <div class="mainContainer">
    <div class="operation">
      <div class="searchInput">
        <el-input v-model="inputSearch" placeholder="输入搜索条件" @keyup.enter="handleSearch">
          <template #prepend><el-icon><Search /></el-icon></template>
          <!-- <template #append><el-button type="primary" :disabled = "!inputSearch">搜索</el-button></template> -->
        </el-input>
      </div>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="primary" >新增</el-button>
      <el-button type="danger" :disabled="!selectedDevice.length" @click="handleDelete">删除</el-button>
      <el-button type="success" @click="getData">刷新</el-button>
    </div>
    <div class = "selectItem">选择{{ selectedDevice.length }}项</div>
    <div class="dataTable">
      <el-table 
        :data="dataFile" 
        stripe
        :border="true"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="device" label="设备" width="100" />
        <el-table-column prop="data_type_string" label="数据类型" width="100" />
        <el-table-column prop="file_name" label="文件名" width="250" >
          <template #default="scope">
            <el-button
              link
              type="primary"
            >
              {{scope.row.file_name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="dt_start" label="数据开始时间" width="200" />
        <el-table-column prop="dt_end" label="数据结束时间" width="200" />
        <!-- <el-table-column prop="device_data_status" label="设备数据状态" width="120">
          <template #default="scope">
            <span v-if="scope.row.device_data_status == 1">
              <el-icon style="color: green;"><CircleCheckFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.device_data_status == 2">
              <el-icon style="color: orange;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.device_data_status == 3">
              <el-icon style="color: red;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.device_data_status == 0">
              <el-icon style="color: gray;"><CircleCloseFilled /></el-icon>
            </span>
          </template>
        </el-table-column> -->
        <el-table-column prop="data_path" label="文件路径" width="350" />
        <el-table-column label="操作">
          <!-- <template  #default="scope">
            <el-button type="primary" size="small" @click="scope">编辑</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
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
        style="padding: 0 10px;"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search, CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { log } from "fabric/fabric-impl";
import { reactive, watch, h, ref, onMounted } from "vue";
import {
  saveData,
  fetchList,
  deleteData,
} from "~/api/index.js";

import { databaseRaw2 } from "~/api/重庆";

onMounted(() => {
  getData();
});
//分页管理
const paginationOptions = reactive({
  currentPage: 1,
  pageSize: 100,
  total: 0,
});
//设备数据
interface data_file{
  id: number,
  device: string, //设备ID
  file_name: string, //文件名
  year: string, //年
  year_month: string, //年月
  year_month_date: string, //年月日
  hour_min_sec: string, //时分秒
  dt_start: string, //开始
  dt_end: string, //结束
  data_type: number, //数据类型 1：level1 ppi，2：level2 ppi，3：level1 dbs5，
  // 4：level2 dbs5，5：level3 ppi，6：level3 dbs5，7：sensor
  data_type_string: string,
  offset: number, //数据在文件中的偏移量
  data_path: string, //文件相对路径
};
const dataFile = reactive(new Array<data_file>());
//选择设备
const selectedDevice = ref<data_file[]>([]);
//处理选择设备
const handleSelectionChange = (val: data_file[]) => {
  selectedDevice.value = val;
}
//删除
function handleDelete() {
  ElMessageBox({
    title: "提示",
    type: "warning",
    message: h("p", null, [
      h("span", null, "确定删除已选的"),
      h("i", { style: "color: red" }, selectedDevice.value.length),
      h("span", null, "条记录吗？"),]
    ),
    closeOnClickModal: false,
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    beforeClose:(action,instance,done)=>{
      if(action == "confirm"){
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = "删除中...";
        setTimeout(() => {
          deleteData({
            database:databaseRaw2,
            table:"device_file",
            query: selectedDevice.value,
          })
          .then((res)=>{
            instance.confirmButtonLoading = false;
            done();
            ElMessage({
              type: "info",
              message: `删除完成`,
            });
            getData();
          })
          .catch((e)=>{
            ElMessage({
              type: "info",
              message: e,
            });
          })
        }, 0);
      } else {
        if (instance.confirmButtonLoading == false) {
          done();
        }
      }
    }
  })
  .then((action) => {})
  .catch((e) => {});
}
//输入搜索条件
const inputSearch = ref('');
//搜索
function handleSearch() {
  // console.log(inputSearch.value);
  getData();
}
const fieldList = ["device_no"];//搜索字段
//获取数据
function getData() {
  return new Promise((resolve, reject) => {
    let currentPage = paginationOptions.currentPage;
    let pageSize = paginationOptions.pageSize;
    let where: any = [];
    if(inputSearch.value != ''){
      fieldList.map((field:string) =>{
        where.push({
          relation: "OR",
          field,
          relationship: "LIKE",
          condition: `%${inputSearch.value}%`,
        });
      });
    }
    fetchList({
      database:databaseRaw2,
      table:"data_file",
      query: {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            where,
          },
    })
      .then((res)=>{
        // console.log(res);
        dataFile.length = 0;
        res.data.results.map((value: any) => {
          dataFile.push({...value});
        });
        dataFile.map((val:data_file)=>{
          val.data_type_string = getDataType(val.data_type)
        });
        paginationOptions.total = res.data.total;
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "获取数据成功",
          type: "success",
          showClose: true,
          center: true,
        });
        console.log(dataFile);
    })
    .catch((e) => {
        ElMessage({
          message: e,
          type: "error",
        });
      });
  });
}
function getDataType(type:number) {
  let typeString:string;
  switch(type){
    case 1:
      typeString = "level1 ppi";
      break;
    case 2:
      typeString = "level2 ppi";
      break;
    case 3:
      typeString = "level1 dbs5";
      break;
    case 4:
      typeString = "level2 dbs5";
      break;
    case 5:
      typeString = "level3 ppi";
      break;
    case 6:
      typeString = "level3 dbs5";
      break;
    case 7:
      typeString = "sensor";
      break;
    default:
      typeString = "-";
  }
  return typeString;
}
watch(
  [() => paginationOptions.currentPage, () => paginationOptions.pageSize],
  ([currentPage, pageSize]) => {
    fetchList({
      database:databaseRaw2,
      table:"data_file",
      query: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
    })
      .then((res) => {
        dataFile.length = 0;
        res.data.results.map((value: any) => {
          dataFile.push({...value});
        });
        paginationOptions.total = res.data.total;
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "获取数据成功",
          type: "success",
          showClose: true,
          center: true,
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
  .operation{
    margin: 10px;
    display: flex;
    flex-direction: row;
    .searchInput{
      margin-right: 10px;
      width: 350px;
    }
  }
  .selectItem{
    margin-left: 10px;
  }
  .dataTable{
    margin: 10px;
    flex-grow: 1;
  }
  .bottom{
    display: flex;
    flex-direction: row-reverse;
    margin: 10px 20px 20px 0px;
  }
}

</style>