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
      <el-button type="danger" :disabled="!selectedDevice.length" @click="handleDelete">删除</el-button>
      <el-button type="success" @click="getData">刷新</el-button>
    </div>
    <div class = "selectItem">选择{{ selectedDevice.length }}项</div>
    <div class="dataTable">
      <el-table 
        :data="deviceStatus" 
        stripe
        :border="true"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="device_no" label="设备编号" width="180" >
          <template #default="scope">
            <el-button
              link
              type="primary"
            >
              {{scope.row.device_no}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="status_time" label="状态时间" width="200" />
        <el-table-column prop="device_data_status" label="设备数据状态" width="120">
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
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" />
        <el-table-column label="操作">
          <template  #default="scope">
            <el-button type="primary" size="small" @click="scope">查看</el-button>
          </template>
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
interface device_status{
  id: number,
  device_no: string, //设备编号
  device_name: string, //设备名
  creator: string, //创建人
  device_data_status: number, //设备数据状态：1正常，2延迟，3缺失
  status_time: string, //状态时间
  create_time: string, //创建时间
};
const deviceStatus = reactive(new Array<device_status>());
//选择设备
const selectedDevice = ref<device_status[]>([]);
//处理选择设备
const handleSelectionChange = (val: device_status[]) => {
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
            table:"device_status",
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
      table:"device_status",
      query: {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            where,
          },
    })
      .then((res)=>{
        // console.log(res);
        deviceStatus.length = 0;
        res.data.results.map((value: any) => {
          deviceStatus.push({...value});
        });
        paginationOptions.total = res.data.total;
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "获取数据成功",
          type: "success",
          showClose: true,
          center: true,
        });
        console.log(deviceStatus);
    })
    .catch((e) => {
        ElMessage({
          message: e,
          type: "error",
        });
      });
  });
}
watch(
  [() => paginationOptions.currentPage, () => paginationOptions.pageSize],
  ([currentPage, pageSize]) => {
    fetchList({
      database:databaseRaw2,
      table:"device_status",
      query: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
    })
      .then((res) => {
        deviceStatus.length = 0;
        res.data.results.map((value: any) => {
          deviceStatus.push({...value});
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