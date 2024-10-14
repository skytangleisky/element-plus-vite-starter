<template>
  <div class="page color-white">
    <Header class="z-1" @alarm="settingShow = true" @edit-user="editUserShow = true"></Header>
    <Alarm v-if="settingShow" v-model:show="settingShow"></Alarm>
    <ChangePassword v-if="editUserShow" v-model:show="editUserShow"></ChangePassword>
    <EditDevice v-if="editDeviceShow" v-model:show="editDeviceShow" :device="device"></EditDevice>
    <border-box-11 ref="dvBorder11" :color="['#8aaafb','transparent']" title="重庆测风雷达组网" :title-width="400" :animate="true" style="width:100%;height:100%;">
    <div class="absolute flex w-full h-full justify-around box-border p-20px p-t-60px">
      <div class="left">
        <border-box-7 :color="['#0154be', '#03f7fc']" style="height:calc(30% - 5px);box-sizing: border-box;backdrop-filter:blur(8px);">
          <div class="w-full h-full place-items-center p-10px box-border" style="display:grid;grid-template-rows: auto 1fr;grid-template-columns: 1fr 1fr;">
            <div class="flex flex-row justify-around row-start-1 row-span-1 col-start-1 col-span-2">
              <div class="m-r-20px font-size-18px">雷达状态分布</div>
              <div class="online font-bold line-height-18px flex items-center">正常</div>
              <div class="offline font-bold line-height-18px flex items-center">故障</div>
            </div>
            <div ref="pieChart1"  class="row-start-2 row-span-1 col-start-1 col-span-1 w-full h-full"></div>
            <div class="percents grid grid-cols-2 grid-rows-3 items-center col-start-2 col-span-1 row-start-2 row-span-1 h-80px font-size-20px flex flex-col justify-between">
              <div class="flex w-full"><div class="online">正常</div>100%</div>
              <div class="flex" w-full><div class="offline">故障</div>0%</div>
            </div>
          </div>
        </border-box-7>
        <border-box-7 :color="['#0154be', '#03f7fc']" style="height: calc(70% - 5px);box-sizing: border-box;backdrop-filter:blur(8px);">
          <div class="w-full h-full grid grid-rows-3 grid-cols-2 place-items-center grid-gap-10px p-10px box-border">
            <div ref="dataTrend1" class="row-start-1 row-span-1 col-start-1 col-span-1 w-full h-full"/>
            <div ref="dataTrend2" class="row-start-1 row-span-1 col-start-2 col-span-1 w-full h-full"/>
            <div ref="dataTrend3" class="row-start-2 row-span-1 col-start-1 col-span-1 w-full h-full"/>
            <div ref="dataTrend4" class="row-start-2 row-span-1 col-start-2 col-span-1 w-full h-full"/>
            <div ref="dataTrend5" class="row-start-3 row-span-1 col-start-1 col-span-1 w-full h-full"/>
            <div ref="dataTrend6" class="row-start-3 row-span-1 col-start-2 col-span-1 w-full h-full"/>
            <!-- <div ref="timeTrend" id="timeTrend" class="row-start-1 row-span-1 col-start-1 col-span-1 w-full h-full"/> -->
            <!-- <div ref="partTimePeriods" id="partTimePeriods" class="row-start-1 row-span-1 col-start-2 col-span-1 w-full h-full"/> -->
            <!-- <div ref="liquidfill" id="liquidfill" class="row-start-2 row-span-1 col-start-1 col-span-2 h-100px w-full"/> -->
          </div>
        </border-box-7>
      </div>
      <div class="center">
          <div class="w-full h-full box-border flex flex-col color-white">
            <border-box-1 :color="['#0154be', '#03f7fc']" style="height: 200px; box-sizing: border-box;backdrop-filter:blur(8px);pointer-events: auto;">
              <div class="w-full h-full p-20px box-border grid-gap-10px" style="display: grid;grid-template-columns: repeat(4,minmax(0,1fr)); grid-template-rows: 1fr auto;">
                  <decoration-9 class="w-full h-full col-start-1 col-span-1 row-start-1 row-span-1">
                    <div color-green font-600 style="font-size:20px;text-shadow: 0 0 3px #7acaec;text-decoration:underline;">
                      6台
                    </div>
                  </decoration-9>
                  <div class="w-full h-full col-start-1 col-span-1 row-start-2 row-span-1">全部雷达</div>
                  <decoration-9 class="w-full h-full col-start-2 col-span-1 row-start-1 row-span-1">
                    <div color-green font-600 style="font-size:20px;text-shadow: 0 0 3px #7acaec;">
                      6台
                    </div>
                  </decoration-9>
                  <div class="w-full h-full col-start-2 col-span-1 row-start-2 row-span-1">在线雷达</div>
                  <decoration-9 class="w-full h-full col-start-3 col-span-1 row-start-1 row-span-1">
                    <div color-gray font-600 style="font-size:20px;text-shadow: 0 0 3px #7acaec;">
                      0台
                    </div>
                  </decoration-9>
                  <div class="w-full h-full col-start-3 col-span-1 row-start-2 row-span-1">离线雷达</div>
                  <decoration-9 class="w-full h-full col-start-4 col-span-1 row-start-1 row-span-1">
                    <div color-yellow font-600 style="font-size:20px;text-shadow: 0 0 3px #7acaec;">
                      0台
                    </div>
                  </decoration-9>
                  <div class="w-full col-start-4 col-span-1 row-start-2 row-span-1">告警雷达</div>
              </div>
            </border-box-1>
            <border-box-7 :color="['#0154be', '#03f7fc']" style="box-sizing: border-box;backdrop-filter:blur(8px);height: 100%;">
              <div ref="mapChart" id="mapChart" class="row-start-2 row-span-1 col-start-1 col-span-2 h-full w-full"/>
            </border-box-7>
          </div>
      </div>
      <div class="right">
        <border-box-7 :color="['#0154be', '#03f7fc']" style="box-sizing: border-box;backdrop-filter:blur(8px);">
          <div class="w-full h-full grid cols-2 rows-3 place-items-center grid-gap-10px p-10px box-border">
            <div ref="th1" class="row-start-1 row-start-1 col-start-1 col-span-1 w-full h-full"></div>
            <div ref="th2" class="row-start-1 row-start-1 col-start-2 col-span-1 w-full h-full"></div>
            <div ref="th3" class="row-start-2 row-start-1 col-start-1 col-span-1 w-full h-full"></div>
            <div ref="th4" class="row-start-2 row-start-1 col-start-2 col-span-1 w-full h-full"></div>
            <div ref="th5" class="row-start-3 row-start-1 col-start-1 col-span-1 w-full h-full"></div>
            <div ref="th6" class="row-start-3 row-start-1 col-start-2 col-span-1 w-full h-full"></div>
          </div>
        </border-box-7>
      </div>
    </div>
    </border-box-11>
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import Header from './header.vue'
import { BorderBox7,Decoration9,BorderBox1,BorderBox11 } from '~/../packages/dataV';
import echartsUtils from './echartsUtils'
import { onBeforeUnmount, onMounted } from 'vue';
import { eventbus } from '~/eventbus';
import data from './data.json'
const settingShow = ref(false)
const editUserShow = ref(false)
const editDeviceShow = ref(false)
const device = ref("")
import Alarm from './alarm.vue';
import ChangePassword from './changePassword.vue';
import EditDevice from './editDevice.vue';
const pieChart1 = ref(null)
const dataTrend1 = ref(null)
const dataTrend2 = ref(null)
const dataTrend3 = ref(null)
const dataTrend4 = ref(null)
const dataTrend5 = ref(null)
const dataTrend6 = ref(null)
const th1 = ref(null)
const th2 = ref(null)
const th3 = ref(null)
const th4 = ref(null)
const th5 = ref(null)
const th6 = ref(null)
function editDevice(deviceName:string){
  console.log(deviceName)
  device.value = deviceName
  editDeviceShow.value = true
}
onMounted(()=>{
  eventbus.on('重庆测风雷达组网-设备编辑',editDevice)
  /*echartsUtils.initBarAndLineChart({
    chartName: "professionConstruct",
    data: {
      majorNew: data.majorNew,
      majorRevoke: data.majorRevoke,
      majorNum: data.majorNum,
    },
  });
  echartsUtils.initCompositeBarChart({
    chartName: "bigCategory",
    title: "专业大类调整排行",
    data: data.majorBigNew,
    border: true,
  });
  echartsUtils.initStackBarChart({
    chartName: "income",
    title: "经费收入分布情况",
    data: {
      d1: data.fundsIncomeRegular,
      d2: data.fundsIncomeSpecial,
    },
    name1: "财政经常性投入",
    name2: "财政专项投入",
    unit: "(万元)",
  });
  echartsUtils.initLineOrBarChart({
    chartName: "facultyFunding",
    title: "师资经费投入情况",
    unit: "(万元)",
    type: "bar",
    data: { d1: data.teacherFundsBuild },
  });*/
  data.teacherBuildTime = [7,5,6,6,6,6,5,6,6,6,6,6,7,5,6,6,6,6,5,6,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend1.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "渝北当天每小时数据获取量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,7,6,6,6,6,6,6,6,6,6,6,5,7,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend2.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "北碚当天每小时数据获取量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,6,6,6,7,6,6,6,6,6,6,5,7,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend3.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "巴南当天每小时数据获取量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,6,6,6,5,6,6,6,6,6,6,5,7,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend4.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "綦江当天每小时数据获取量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,4,6,6,7,6,6,6,6,6,6,5,7,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend5.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "万州当天每小时数据获取量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,6,6,6,3,6,6,6,6,6,6,5,7,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend6.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "城口当天每小时数据获取量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  /*echartsUtils.initLineOrBarChart({
    chartName: "timeTrend",
    data: {
      d1: data.teacherBuildTime,
    },
    title: "教师人均企业实践时间走势",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(天)",
  });
  echartsUtils.initLineOrBarChart({
    chartName: "partTimePeriods",
    title: "企业兼职教师课时占比",
    data: {
      d1: data.teacherBuildClazz,
    },
    color: [
      "rgba(27, 198, 97, 1)",
      "rgba(27, 198, 97, 0.3)",
      "rgba(27, 198, 97, 0.9)",
    ],
    unit: "(%)",
  });
  echartsUtils.initLiquidfill({
    chartName: "liquidfill",
    data: {
      d1: [
        data.positionProportion.gthen,
        data.positionProportion.bthen,
        data.positionProportion.sthen,
        data.positionProportion.qthen,
        data.positionProportion.jthen,
      ],
      subtitle: [
        data.positionProportion.gman,
        data.positionProportion.bman,
        data.positionProportion.sman,
        data.positionProportion.qman,
        data.positionProportion.jman,
      ],
    },
    title: [
      "高级职称教师",
      "博士学历教师",
      "双师型教师",
      "企业兼职教师",
      "教学名师",
    ],
    position: [["6%"], ["23%"], ["center"], ["63%"], ["85%"]],
    center: [
      ["13%", "30%"],
      ["30%", "30%"],
      ["50%", "30%"],
      ["70%", "30%"],
      ["90%", "30%"],
    ],
  });*/
  
  // 温湿度曲线
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th1.value,
    title: "渝北温湿度曲线图",
    yName1: "(%)",
    legendShow: true,
    data: {
      d1: [20,25,30,27,26,20,18,17,16,15,16,20,10,15,18,20,22,19,20,26,30,31,25,20],
      d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "温度（℃）",
    seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th2.value,
    title: "北碚温湿度曲线图",
    yName1: "(%)",
    legendShow: true,
    data: {
      d1: [20,25,30,27,26,20,18,17,16,15,16,20,10,15,18,20,22,19,20,26,30,31,25,20],
      d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "温度（℃）",
    seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th3.value,
    title: "巴南温湿度曲线图",
    yName1: "(%)",
    legendShow: true,
    data: {
      d1: [20,25,30,27,26,20,18,17,16,15,16,20,10,15,18,20,22,19,20,26,30,31,25,20],
      d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "温度（℃）",
    seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th4.value,
    title: "綦江温湿度曲线图",
    yName1: "(%)",
    legendShow: true,
    data: {
      d1: [20,25,30,27,26,20,18,17,16,15,16,20,10,15,18,20,22,19,20,26,30,31,25,20],
      d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "温度（℃）",
    seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th5.value,
    title: "万州温湿度曲线图",
    yName1: "(%)",
    legendShow: true,
    data: {
      d1: [20,25,30,27,26,20,18,17,16,15,16,20,10,15,18,20,22,19,20,26,30,31,25,20],
      d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "温度（℃）",
    seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th6.value,
    title: "城口温湿度曲线图",
    yName1: "(%)",
    legendShow: true,
    data: {
      d1: [20,25,30,27,26,20,18,17,16,15,16,20,10,15,18,20,22,19,20,26,30,31,25,20],
      d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "温度（℃）",
    seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  echartsUtils.initMapChart({
    chartName: "mapChart",
    data:[]
  })
  echartsUtils.initPieChart1({
    chartName: pieChart1.value,
    data:6
  })
})
onBeforeUnmount(()=>{
  echartsUtils.destroy()
  eventbus.off('重庆测风雷达组网-设备编辑',editDevice)
})
</script>
<style lang="scss">
.page{
  position: absolute;
  inset:0;
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .left{
    pointer-events: auto;
    width: calc(33% - 5px);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .online{
      position:relative;
      margin: 0 20px;
      &::before{
        content:'';
        position:absolute;
        width:0.5rem;
        height: 0.5rem;
        background: #91CC75;
        border-radius:50%;
        left:-1rem;
        top:50%;
        transform: translateY(-50%);
      }
    }
    .offline{
      position:relative;
      margin: 0 20px;
      &::before{
        content:'';
        position:absolute;
        width:0.5rem;
        height: 0.5rem;
        background: #EE6666;
        border-radius:50%;
        left:-1rem;
        top:50%;
        transform: translateY(-50%);
      }
    }
    .warning{
      position:relative;
      margin: 0 20px;
      &::before{
        content:'';
        position:absolute;
        width:0.5rem;
        height: 0.5rem;
        background: #FAC858;
        border-radius:50%;
        left:-1rem;
        top:50%;
        transform: translateY(-50%);
      }
    }
    .percents{
      .online{
        position:relative;
        margin: 0 20px;
        &::before{
          content:'';
          position:absolute;
          width: 1rem;
          height: 1rem;
          background: #91CC75;
          border-radius:50%;
          left:-2rem;
          top:50%;
          transform: translateY(-50%);
        }
      }
      .offline{
        position:relative;
        margin: 0 20px;
        &::before{
          content:'';
          position:absolute;
          width:1rem;
          height: 1rem;
          background: #EE6666;
          border-radius:50%;
          left:-2rem;
          top:50%;
          transform: translateY(-50%);
        }
      }
      .warning{
        position:relative;
        margin: 0 20px;
        &::before{
          content:'';
          position:absolute;
          width:1rem;
          height: 1rem;
          background: #FAC858;
          border-radius:50%;
          left:-2rem;
          top:50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .center{
    width: calc(33% - 5px);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .right{
    width: calc(33% - 5px);
    height: 100%;
  }
}
</style>