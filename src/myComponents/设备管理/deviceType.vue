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
      <el-button type="primary" @click="editDeviceType(-1, 0)">新增</el-button>
      <el-button type="danger" :disabled="!selectedDevice.length" @click="handleDelete">删除</el-button>
      <el-button type="success" @click="refresh" >刷新</el-button>
    </div>
    <div class = "selectItem">选择{{ selectedDevice.length }}项</div>
    <div class="dataTable">
      <el-table 
        :data="deviceType" 
        stripe
        :border="true"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="站名">
          <template #default="scope">
        <el-button
          link
          type="primary"
          @click="editDeviceType(scope.$index, 1)"
        >
          {{scope.row.name}}
        </el-button>
      </template>
        </el-table-column>
        <el-table-column prop="is_active" label="有效">
          <template #default="scope">
            <span v-if="scope.row.is_active">
              <el-icon style="color: green;"><CircleCheckFilled /></el-icon>
            </span>
            <span v-else>
              <el-icon style="color: red;"><CircleCloseFilled /></el-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="editDeviceType(scope.$index, 1)">编辑</el-button>
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
  <el-dialog v-model="dialogFormVisible" :title="editType" :width="DialogWidth">
    <el-form :model="formDataInput">
      <el-form-item label="类型代号" :label-width="formLabelWidth">
        <el-input v-model="formDataInput.type_id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型名称" :label-width="formLabelWidth">
        <el-input v-model="formDataInput.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否有效" :label-width="formLabelWidth">
        <el-checkbox v-model="formDataInput.is_active" :border="true"></el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDeviceType">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Search, CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
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
interface device_type{
  created_time:string, 
  modified_time:string,
  creator:any,
  id:number,
  is_active:number,
  name:string,
  type_id:string,
};
const deviceType = reactive(new Array<device_type>());
//选择设备
const selectedDevice = ref<device_type[]>([]);
//输入搜索条件
const inputSearch = ref('');
//搜索
function handleSearch() {
  // console.log(inputSearch.value);
  getData();
}
const fieldList = ["id","name"];//搜索字段

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
            table:"device_type",
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
//刷新
function refresh() {
  // console.log(inputSearch.value);
  getData()
}
//编辑/新增设备类型
const dialogFormVisible = ref(false);
const DialogWidth = '600';
const formLabelWidth = '80px';
const formDataInput = reactive({
  name: '',
  type_id: '',
  is_active: false,
});
//新增、编辑
const editType = ref("编辑");
let eidtIndex = ref(-1);
function editDeviceType(index: number, type: number) {
  dialogFormVisible.value = true;
  editType.value = type == 1 ? "编辑" : "新增";
  if(type == 1){
    eidtIndex.value = index;
    formDataInput.name = deviceType[index].name;
    formDataInput.type_id = deviceType[index].type_id;
    formDataInput.is_active = deviceType[index].is_active == 1 ? true : false;
  } else {
    clearInput();
  }
}
//编辑保存
async function submitDeviceType() {
  dialogFormVisible.value = false;
  if(editType.value =="编辑"){
    let edit = deviceType[eidtIndex.value];
    edit.name = formDataInput.name;
    edit.type_id = formDataInput.type_id;
    edit.is_active = formDataInput.is_active ? 1 : 0;
    edit.modified_time = getNow();
    saveData({ 
      database:databaseRaw2,
      table:"device_type",
      query: [edit] })
      .then((res) => {
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "修改成功",
          type: "success",
          showClose: true,
          center: true,
        });
        getData();
        clearInput();
      })
      .catch((res) => {
        ElMessage({
          message: res.response.data[0].reason.sqlMessage,
          type: "error",
        });
      });
  } else {
    let edit = <device_type>({});
    edit.name = formDataInput.name;
    // edit.id = deviceType[0].id + 1;
    edit.type_id = formDataInput.type_id;
    edit.is_active = formDataInput.is_active ? 1 : 0;
    edit.created_time = getNow();
    edit.modified_time = getNow();
    saveData({ 
      database:databaseRaw2,
      table:"device_type",
      query: [edit] })
      .then((res) => {
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "新增成功",
          type: "success",
          showClose: true,
          center: true,
        });
        getData();
        clearInput();
      })
      .catch((res) => {
        ElMessage({
          message: res.response.data[0].reason.sqlMessage,
          type: "error",
        });
      }
    );
  }
}

// 清除输入
function clearInput() {
  eidtIndex.value = -1;
  formDataInput.name = "";
  formDataInput.type_id = "";
  formDataInput.is_active = false;
}
// 获取当前时间
function getNow(){
  let time;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(6, '0');
  time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  return time;
}

//处理选择设备
const handleSelectionChange = (val: device_type[]) => {
  selectedDevice.value = val;
}
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
      table:"device_type",
      query: {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            where,
          },
    })
      .then((res)=>{
        // console.log(res);
        deviceType.length = 0;
        res.data.results.map((value: any) => {
          deviceType.push({...value});
        });
        paginationOptions.total = res.data.total;
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "获取数据成功",
          type: "success",
          showClose: true,
          center: true,
        });
        console.log(deviceType);
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
      table:"device_type",
      query: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
    })
      .then((res) => {
        deviceType.length = 0;
        res.data.results.map((value: any) => {
          deviceType.push({...value});
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