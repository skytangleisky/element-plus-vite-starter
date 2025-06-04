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
        <el-table-column prop="device_type" label="设备类型" width="300" />
        <el-table-column prop="device_model" label="设备型号" width="320" />
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
        size="small"
        :disabled="false"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationOptions.total"
        style="padding: 0 10px;"
      />
    </div>
  </div>
  <el-dialog class="editDialog" v-model="dialogFormVisible" width="820">
    <template #header>
      <div class="dialog-title">
        {{ editType }}
      </div>
    </template>
    <div class="dialogContent">
      <el-form inline :model="formDataInput" label-width="auto">
        <el-form-item label="省" prop="name" label-position="left">
          <el-select class="select" v-model="selectProvince" disabled placeholder="请选择省"></el-select>
        </el-form-item>
        <el-form-item label="市" prop="name" label-position="left">
          <el-select class="select" v-model="selectCity" placeholder="请选择市" @change="handleCity">
            <el-option
              v-for="(item, index) in citys"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区/县" prop="name" label-position="left">
          <el-select class="select" v-model="selectDistrict" placeholder="请选择区/县">
            <el-option
              v-for="(item, index) in districts"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="name" label-position="left">
          <el-select class="select" v-model="selectManufacturer" placeholder="请选择企业">
            <el-option
              v-for="(item, index) in manufacturers"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入雷达编号" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备名称" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入设备名称" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="设备简称" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入设备简称" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="雷达类型" prop="name" label-position="left">
          <el-select class="select" v-model="selectDeviceType" placeholder="请选择雷达类型">
            <el-option
              v-for="(item, index) in deviceTypes"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入设备型号" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入地址" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="经度" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入经度" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="纬度" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入纬度" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="海拔高度" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入海拔高度" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="气压海拔高度" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入气压海拔高度" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数据路径" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入数据路径" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="颜色" prop="name" label-position="left">
          <el-input class="input" placeholder="请输入颜色" v-model="formDataInput.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="风速" prop="number" label-position="left">
          <el-input-number
            class="input"
            v-model="formDataInput.number1"
            :min="-50"
            :max="50"
            :step="0.01"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否隐藏" prop="name" label-position="left">
          <el-select class="select" v-model="selectIsHide" placeholder="请选择">
            <el-option
              v-for="(item, index) in isHide"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="风向" prop="number" label-position="left">
          <el-input-number
            class="input"
            v-model="formDataInput.number2"
            :min="-360"
            :max="360"
            :step="0.01"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="数据超时时长(s)" prop="number" label-position="left">
          <el-input-number
            class="input"
            v-model="formDataInput.number3"
            :min="0"
            :max="6000"
            :step="1"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item/>
      </el-form>
    </div>
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
import { log } from "fabric/fabric-impl";
import { reactive, watch, h, ref, onMounted } from "vue";
import {
  saveData,
  fetchList,
  deleteData,
} from "~/api/index.js";

import { databaseRaw } from "~/api/重庆";
import cityData from "~/myComponents/设备管理/json/pca-code.json";

onMounted(() => {
  getData();
  addresslist.map((val)=>{
    if(val.name == "山西省"){
      val.children.map((val2)=>{
        citys.push({code:val2.code,name:val2.name,children:val2.children})
      })
    }
  })
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
const deviceTypes = reactive(new Array<device_type>());
const selectDeviceType = ref("");
function getDeviceType() {
  return new Promise((resolve, reject) => {
    fetchList({
      database:databaseRaw,
      table:"device_type",
      query: {
            limit: 100,
            offset: 0,
            where:[],
          },
    })
      .then((res)=>{
        // console.log(res);
        deviceTypes.length = 0;
        res.data.results.map((value: device_type) => {
          if(value.is_active == 1){
            deviceTypes.push({...value});
          }
        });
    })
    .catch((e) => {
        ElMessage({
          message: e,
          type: "error",
        });
      });
  });
}
// 企业选择
const manufacturers = [
  {
    name:"青岛华航环境科技有限责任公司",
    value:"青岛华航",
  },
  {
    name:"青岛镭测创芯科技有限公司",
    value:"青岛镭测",
  },
  {
    name:"四川西物激光技术有限公司",
    value:"四川西物",
  },
  {
    name:"山西省气象局",
    value:"山西气象局",
  },
];
const selectManufacturer = ref("");
// 是否隐藏
const isHide = [
  {
    name:"未知",
    value:"未知",
  },
  {
    name:"是",
    value:"1",
  },
  {
    name:"否",
    value:"2",
  },
];
const selectIsHide = ref("");
//地址选择
const addresslist = reactive(cityData);
const citys = reactive<city[]>([]);
const districts = reactive<city[]>([]);
const selectProvince = ref("山西省");
const selectCity = ref("");
const selectDistrict = ref("");
interface city{
  code:string
  name:string
  children:{ code: string; name: string; }[]
};
function handleCity() {  
  districts.length = 0;
  citys.map((val)=>{
    if(val.name == selectCity.value){
      val.children.map((val2)=>{
        districts.push({code:val2.code,name:val2.name,children:[]})
      });
    }
  });
}
// 编辑/新增
const dialogFormVisible = ref(false);
const formDataInput = reactive({
  name: '',
  type_id: '',
  is_active: false,
  number1: 50,
  number2: 360,
  number3: 600,
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
    getDeviceType();
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
            database:databaseRaw,
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
      database:databaseRaw,
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
        // console.log(device);
    })
    .catch((e) => {
        ElMessage({
          message: e,
          type: "error",
        });
      }
    );
  });
}
watch(
  [() => paginationOptions.currentPage, () => paginationOptions.pageSize],
  ([currentPage, pageSize]) => {
    fetchList({
      database:databaseRaw,
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
.dark .mainContainer{
  background-color: #303133;
}
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
.editDialog{
  .dialogContent{
    height: 400px;
    overflow-y: auto;
  }
}
.select{
  width: 240px;
}
.input{
  width: 240px;
}
</style>