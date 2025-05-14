<template>
  <div class="fkx-info">
    <div class="fkx-top">
      <div class="top-left"><span>风廓线</span><span v-show="deviceInfo.device_name">-{{ deviceInfo.device_name }}</span>
      </div>
      <div class="top-right" @click="showFkxHandle">
        <el-icon v-if="isShowBottom">
          <ArrowUpBold/>
        </el-icon>
        <el-icon v-else>
          <ArrowDownBold/>
        </el-icon>
      </div>
    </div>
    <div class="fkx-bottom" v-show="isShowBottom">
      <div class="bottom-top">
        <el-form :model="searchForm" inline size="small">
          <el-form-item label="显示区">
            <el-select
                v-model="searchForm.key1"
                placeholder="请选择显示区"

            >
              <el-option
                  v-for="item in key1Dict"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="叠加">
            <el-select
                v-model="searchForm.key2"
                placeholder="请选择叠加"
                clearable
            >
              <el-option
                  v-for="item in key2Dict"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom-bottom">

        <chart-fkx></chart-fkx>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import chartFkx from "./fkxV.vue";
import {ArrowUpBold, ArrowDownBold} from '@element-plus/icons-vue'
import {ref, watch, reactive, onMounted, onBeforeUnmount} from 'vue'
import {useStationStore} from "~/stores/station";
import {useBus} from "~/myComponents/bus";
import { eventbus } from "~/eventbus";
import {useRouter} from "vue-router";
import { useSettingStore } from "~/stores/setting";

const setting = useSettingStore();
const router = useRouter()
const station = useStationStore();

let isShowBottom = ref(true)
const showFkxHandle = () => {
  isShowBottom.value = !isShowBottom.value;
  setting.disappear = isShowBottom.value;
};


const bus = useBus();
// 雷达信息
const deviceInfo = reactive({
  radar_id: '',
  device_name: '',
  data_time: '',
});

const deviceClick = () => {
  // window.top?.open(
  //   `https://main.emgo-tech.com/admin/device/radar/${item.value.radar.id}/change/`,
  //   "_self"
  // );
  router.replace('/cq/device/' + deviceInfo.radar_id)
};
watch(()=>setting.风雷达组网.监控.isFoldSingle,newVal=>{
  isShowBottom.value =!newVal
})
watch([() => bus.avgWindData_重庆, () => station.active], ([avgWindData, active]) => {
  if (avgWindData.data) {
    avgWindData.data.map((radial: any, k: number) => {
      if (k == 0) {
        bus.风雷达组网地图相关雷达站点信息.map(v => {
          if (v.no == active) {
            deviceInfo.radar_id = v.no
            deviceInfo.device_name = v.device_name
            // item.data_time = moment(radial.Date_time,'YYYYMMDD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
          }
        })
      }
    })
  }
});


const searchForm = reactive({
  key1:"水平风",
  key2:"无",
});
let key1Dict = [
  {
    value: "水平风",
    label: "水平风",
  },
  {
    value: "垂直气流",
    label: "垂直气流",
  },
];
let key2Dict = [
  {
    value: "无",
    label: "无",
  },{
    value: "风羽",
    label: "风羽",
  },
  {
    value: "风矢",
    label: "风矢",
  },
];

let check = ref(false);

let 风廓线数据: any = [];
function process(data:{radar_id:string,风廓线数据:any}){
  风廓线数据 = data.风廓线数据;
  eventbus.emit("重庆地图界面-处理风廓线数据", 风廓线数据, searchForm.key1, check.value, searchForm.key2);
}
onMounted(() => {
  // fetchDataList(moment().format("YYYYMMDD"));
  eventbus.on('处理实时风廓线数据',process)
});
watch([()=>searchForm.key1,  ()=>searchForm.key2], ([v1, v2]) => {
  let newCheck
  if(v2 == "无"){
    check.value = false;
  }else{
    check.value = true;
  }
  console.log('watch',check.value,v1, searchForm.key2)
  eventbus.emit("重庆地图界面-处理风廓线数据", 风廓线数据, v1, check.value, v2);
});
onBeforeUnmount(()=>{
  eventbus.off('处理实时风廓线数据',process)
})
</script>

<style scoped lang="scss">
.fkx-info {

  .fkx-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    //background-color: var(--bg-color-overlay-opacity-8);
    height: 40px;
    line-height: 40px;
    background: url("~/assets/theme-img/map-module-title.png") no-repeat;
    background-size: 100% 100%;
    margin-bottom: 6px;
    color: var(--module-title-text-color);
    padding: 0 24px 0 36px;

    .top-left {
      font-size: 14px;
    }

    .top-right {
      //font-size: 20px;
      display: flex;
      align-items: center;
    }
  }

  .fkx-bottom {
    //background: url("~/assets/theme-img/map-module-bg.png") no-repeat;
    //background-size: 100% 100%;
    background: var(--bg-color-overlay-opacity-8);
    border:1px solid #B5D5E5;
    padding:20px 12px;

    .ep-form{
      .ep-select{
        width: 90px;
      }
      .ep-form-item--small,
      .ep-form--inline .ep-form-item{
        margin-bottom: 0;
        &:last-child{
          margin-right: 0;
        }
      }

    }
    .bottom-bottom{
      width: 100%;
      height: 400px;
    }

  }
}
</style>