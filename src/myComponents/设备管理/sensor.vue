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
        :data="sensorStatus" 
        stripe
        :border="true"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="Device" label="设备编号" width="100" >
          <template #default="scope">
            <el-button
              link
              type="primary"
            >
              {{scope.row.Device}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Date_time" label="系统当前时间" width="200" />
        <el-table-column prop="MCDIO" label="HHMCDIO的状态" width="300" />
        <el-table-column prop="ServorStatus" label="伺服状态" width="100" />
        <el-table-column prop="UPSStatus" label="UPS状态" width="100" />
        <el-table-column prop="GPSStatus" label="GPS状态" width="100" />
        <el-table-column prop="GPSDataValid" label="GPS数据有效性" width="150">
          <template #default="scope">
            <span v-if="scope.row.GPSDataValid == 1">
              <el-icon style="color: green;"><CircleCheckFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.GPSDataValid == 2">
              <el-icon style="color: orange;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.GPSDataValid == 3">
              <el-icon style="color: red;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.GPSDataValid == 0">
              <el-icon style="color: gray;"><CircleCloseFilled /></el-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="GPSSystemStatus" label="GPS系统状态" width="120">
          <template #default="scope">
            <span v-if="scope.row.GPSSystemStatus == 1">
              <el-icon style="color: green;"><CircleCheckFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.GPSSystemStatus == 2">
              <el-icon style="color: orange;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.GPSSystemStatus == 3">
              <el-icon style="color: red;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.GPSSystemStatus == 0">
              <el-icon style="color: gray;"><CircleCloseFilled /></el-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="LaserStatus" label="激光器种子状态" width="140" />
        <el-table-column prop="AmpStatus" label="激光放大器状态" width="140">
          <template #default="scope">
            <span v-if="scope.row.AmpStatus == 1">
              <el-icon style="color: green;"><CircleCheckFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.AmpStatus == 2">
              <el-icon style="color: orange;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.AmpStatus == 3">
              <el-icon style="color: red;"><CircleCloseFilled /></el-icon>
            </span>
            <span v-else-if="scope.row.AmpStatus == 0">
              <el-icon style="color: gray;"><CircleCloseFilled /></el-icon>
            </span>
          </template>
        </el-table-column>
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
interface sensor{
  Device: string,//设备ID
  Date_time: string,//系统当前时间
  MCDIO: string,//[主控板传感器数据]HHMC DIO的状态前12路DI后16路DO
  MCBoardTemp: number,//[主控板传感器数据]控制板MCU温度，单位℃
  MCInnerHumidity: number,//[主控板传感器数据]雷达内部湿度（来自主控板温湿度传感器），单位%
  MCInnerTemp1: number,//[主控板传感器数据]雷达内部温度1（来自主控板温湿度传感器），单位℃
  MCInnerTemp2: number,//[主控板传感器数据]雷达内部温度2（来自主控板DS18B20_2），单位℃
  MCOuterHumidity: number,//[主控板传感器数据]主控板测量的外部湿度，单位%
  MCOuterTemp: number,//[主控板传感器数据]主控板测量的外部温度，单位℃
  MCOuterAirPressure: number,//[主控板传感器数据]主控板测量的外部气压，单位hPa
  MCOuterRelPressure: number,//[主控板传感器数据]主控板测量的外内压差，正值表示外部压力大，单位hPa
  MCCount: number,//[主控板传感器数据]计数
  SysVoltage: number,//[电压电流]系统电压
  SysCurrent: number,//[电压电流]系统电流
  Temperature: number,//[六要素]环境温度，单位℃
  Humidity: number,//[六要素]湿度，单位%
  Pressure: number,//[六要素]气压，单位hPa
  RainSpeed: number,//[六要素]降雨强度，单位mm / min
  RainLevel: number,//[六要素]降雨量，单位mm
  LandWindSpeed: number,//[六要素]风速，单位m / s
  LandWindDir: number,//[六要素]风向，单位°
  ServorStatus: string,//[伺服]伺服状态
  Azimuth: number,//[伺服]伺服设定方位角，相对于雷达自身坐标系，单位°
  Pitch: number,//[伺服]伺服设定俯仰角，相对于雷达自身坐标系，单位°
  AzimuthStatus: string,//[伺服]伺服方位角运行状态
  PitchStatus: string,//[伺服]伺服俯仰角运行状态
  UPSStatus: string,//[UPS]UPS状态
  UPSVin: number,//[UPS]UPS输入电压
  UPSVout: number,//[UPS]UPS输出电压
  GPSStatus: string,//[GPS]GPS状态
  GPSDataValid: number,//[GPS]GPS数据有效性
  GPSSystemStatus: number,//[GPS]GPS系统状态
  NorthOffset: number,//[GPS]偏北方向，单位°
  Rolling: number,//[GPS]X倾角（横滚角），单位°。雷达北为前向，右滚为正，左滚为负。
  GPSPitch: number,//[GPS]Y倾角(俯仰角)，单位°。雷达北为前向，抬头为正，低头为负。
  Longitude: number,//[GPS]经度，单位°
  Latitude: number,//[GPS]纬度，单位°
  Altitude: number,//[GPS]高度，单位m
  EastSpeed: number,//[GPS]雷达自身东向速度, 向东为正，向西为负, 单位m / s
  NorthSpeed: number,//[GPS]雷达自身北向速度, 向北为正，向南为负, 单位m / s
  UpSpeed: number,//[GPS]雷达自身天向速度，向上为正，向下为负, 单位m / s
  EarthAzimuth: number,//[GPS]真实方位角，相对于大地坐标系，单位°
  EarthPitch: number,//[GPS]真实俯仰角，相对于大地坐标系，单位°
  FrontAntanaNum: number,//[GPS]卫导前天线卫星数量
  BackAntanaNum: number,//[GPS]卫导后天线卫星数量
  BaseLine: number,//[GPS]卫导前后天线之间的距离, 单位m
  LaserStatus: number,//[激光器]激光器种子状态
  AmpStatus: number,//[激光器]激光放大器状态
  LaserBoxTemp: number,//[激光器]激光器外壳温度，单位℃
  LaserCurrent: number,//[激光器]激光器泵浦电流，单位mA
  LaserCH1Temp: number,//[激光器]激光器1级泵浦温度，单位℃
  LaserPDPower: number,//[激光器]激光器PD功率，单位mW
  LaserCH2Power: number,//[激光器]激光器CH2功率，单位mW
  LaserOutPower: number,//[激光器]激光器CH1功率(输出功率)，单位mW
  AmpBoxTemp: number,//[激光器]激光放大器外壳温度，单位℃
  AmpTemp: number,//[激光器]激光放大器泵浦温度，单位℃
  AmpCurrent: number,//[激光器]激光放大器泵浦电流，单位mA 
  AmpInPower: number,//[激光器]激光放大器输入功率，单位mW
  AmpPDPower: number,//[激光器]激光放大器PD功率，单位mW
  AmpCH2Power: number,//[激光器]激光放大器CH2功率，单位mW
  AmpOutPower: number,//[激光器]激光放大器CH1功率(输出功率)，单位mW
  FPRF: number,//[激光器]激光器输入脉冲频率，单位Hz ，仅法国激光器
  AlarmCode: number,//[激光器]激光器告警代码 ，仅法国激光器
  SystemCounter: number,//系统计数
  device_data_status: number,//设备数据状态
};
const sensorStatus = reactive(new Array<sensor>());
let sensorKey = reactive(new Array<string>());
const labelString = [
  "设备ID",
  "系统当前时间",
  "DIO的状态",
  "控制板MCU温度(℃)",
  "雷达内部湿度(%)",
  "雷达内部温度1(℃)",
  "雷达内部温度2(℃)",
  "外部湿度(%)",
  "外部温度(℃)",
  "外部气压(hPa)",
  "外内压差(hPa)",
  "计数",
  "系统电压",
  "系统电流",
  "环境温度(℃)",
  "湿度(%)",
  "气压(hPa)",
  "降雨强度(mm/min)",
  "降雨量(mm)",
  "风速(m/s)",
  "风向(°)",
  "伺服状态",
  "设定方位角(°)",
  "设定俯仰角(°)",
  "方位角运行状态",
  "俯仰角运行状态",
  "UPS状态",
  "UPS输入电压",
  "UPS输出电压",
  "GPS状态",
  "GPS数据有效性",
  "GPS系统状态",
  "X倾角(横滚角,°)",
  "Y倾角(俯仰角,°)",
  "经度(°)",
  "纬度(°)",
  "高度(m)",
  "东向速度(m/s)",
  "北向速度(m/s)",
  "天向速度(m/s)",
  "真实方位角(°)",
  "真实俯仰角(°)",
  "卫导前天线卫星数量",
  "卫导后天线卫星数量",
  "天线之间的距离(m)",
  "激光器种子状态",
  "激光放大器状态",
  "激光器外壳温度(℃)",
  "激光器泵浦电流(mA)",
  "激光器1级泵浦温度(℃)",
  "激光器PD功率(mW)",
  "激光器CH2功率(mW)",
  "激光器CH1功率(mW)",
  "激光放大器外壳温度(℃)",
  "激光放大器泵浦温度(℃)",
  "激光放大器泵浦电流(mA)",
  "激光放大器输入功率(mW)",
  "激光放大器PD功率(mW)",
  "激光放大器CH2功率(mW)",
  "激光放大器CH1功率(mW)",
  "激光器输入脉冲频率(Hz)",
  "激光器告警代码",
  "系统计数",
  "设备数据状态",
];
//选择设备
const selectedDevice = ref<sensor[]>([]);
//处理选择设备
const handleSelectionChange = (val: sensor[]) => {
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
            table:"sensor",
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
const fieldList = ["Device"];//搜索字段
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
      table:"sensor",
      query: {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
            where,
          },
    })
      .then((res)=>{
        // console.log(res);
        sensorStatus.length = 0;
        res.data.results.map((value: any) => {
          sensorStatus.push({...value});
        });
        paginationOptions.total = res.data.total;
        ElMessage({
          dangerouslyUseHTMLString: true,
          message: "获取数据成功",
          type: "success",
          showClose: true,
          center: true,
        });
        console.log(sensorStatus);
        sensorKey = Object.keys(sensorStatus[0]);
        
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
      table:"sensor",
      query: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      },
    })
      .then((res) => {
        sensorStatus.length = 0;
        res.data.results.map((value: any) => {
          sensorStatus.push({...value});
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