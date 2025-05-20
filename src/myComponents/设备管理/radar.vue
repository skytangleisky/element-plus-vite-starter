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
      <el-button type="primary" @click="editRadar(-1, 0)">新增</el-button>
      <el-button type="danger" :disabled="!selectedDevice.length" @click="handleDelete">删除</el-button>
      <el-button type="success" @click="getData">刷新</el-button>
    </div>
    <div class = "selectItem">选择{{ selectedDevice.length }}项</div>
    <div class="dataTable">
      <el-table 
        :data="device" 
        stripe
        :border="true"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="city" label="市" width="80" />
        <el-table-column prop="district" label="区县" width="100" />
        <el-table-column prop="no" label="编号" width="80" />
        <el-table-column prop="device_name" label="站名" width="200" >
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="editRadar(scope.$index, 1)"
            >
              {{scope.row.device_name}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="device_type" label="设备类型" width="200" />
        <el-table-column prop="device_model" label="设备型号" width="350" />
        <el-table-column prop="manufacturer_short" label="厂商简称" width="120" />
        <el-table-column prop="status" label="设备状态">
          <template #default="scope">
            <span v-if="scope.row.status == 1">
              <el-icon style="color: green;"><CircleCheckFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.status == 2">
              <el-icon style="color: orange;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.status == 3">
              <el-icon style="color: red;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.status == 0">
              <el-icon style="color: gray;"><CircleCloseFilled /></el-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template  #default="scope">
            <el-button type="primary" size="small" @click="editRadar(scope.$index, 1)">编辑</el-button>
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
    <el-dialog v-model="dialogFormVisible" :title="editType" width="500">
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
interface device{
  id: number,
  province: string,//省
  city: string, //市
  district: string, //区县
  adcode: string, //行政区划编码
  no: string, //编号
  device_no: string, //设备编号
  device_name: string, //设备名
  device_short_name: string, //设备名简称
  device_type: string, //设备类型
  device_model: string, //设备型号
  address: string, //地址
  manufacturer: string, //厂商
  manufacturer_short: string, //厂商简称
  lng: string, //经度
  lat: string, //纬度
  altitude: string, //海拔高度
  height: string, //气压海拔高度
  data_path: string, //数据路径
  color: string, //颜色
  speed: number, //风速
  hide: string, //是否隐藏
  orientation: number, //风向
  data_overtime: number, //数据超时时长，单位秒
  status: number, //设备数据状态：0未知，1正常，2延迟，3缺失
  createtime: string, //
  updatetime: string, //
};
const device = reactive(new Array<device>());

// 编辑/新增
const dialogFormVisible = ref(false);
const formLabelWidth = '80px';
const formDataInput = reactive({
  name: '',
  type_id: '',
  is_active: false,
});
const editType = ref("编辑");
let eidtIndex = ref(-1);
//编辑保存
function submitDeviceType() {
  
}
function editRadar(index: number, type: number) {
  dialogFormVisible.value = true;
  editType.value = type == 1 ? "编辑" : "新增";
  if(type == 1){
    eidtIndex.value = index;
  } else {
    clearInput();
  }
}
function clearInput() {
  
}
//选择设备
const selectedDevice = ref<device[]>([]);
//处理选择设备
const handleSelectionChange = (val: device[]) => {
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
            table:"device",
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
const fieldList = ["id","manufacturer_short","district","device_name","device_type","device_model"];//搜索字段
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
      table:"device",
      query: {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            where,
          },
    })
      .then((res)=>{
        // console.log(res);
        device.length = 0;
        res.data.results.map((value: any) => {
          device.push({...value});
        });
        paginationOptions.total = res.data.total;
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "获取数据成功",
          type: "success",
          showClose: true,
          center: true,
        });
        console.log(device);
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
      table:"device",
      query: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
    })
      .then((res) => {
        device.length = 0;
        res.data.results.map((value: any) => {
          device.push({...value});
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