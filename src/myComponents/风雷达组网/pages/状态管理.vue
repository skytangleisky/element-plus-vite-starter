<template>
  <div class="page color-white">
    <Header @alarm="settingShow = true" @edit-user="editUserShow = true" v-model:menuIndex="menuIndex" style="z-index:1"></Header>
    <Alarm v-if="settingShow" v-model:show="settingShow"></Alarm>
    <ChangePassword v-if="editUserShow" v-model:show="editUserShow"></ChangePassword>
    <SensorView v-if="sensorViewShow" v-model:show="sensorViewShow" :device="device"></SensorView>
    <div ref="mapChart" style="position:absolute;width:100%;height:100%;"></div>
    <border-box-11 ref="dvBorder11" :color="['#8aaafb','transparent']" title="山西测风雷达组网" :title-width="400" :animate="true" style="width:100%;height:100%;pointer-events: none;">
      <div v-show="menuIndex==2" style="position: absolute;display: flex;width: 100%;height: 100%;justify-content: space-around;box-sizing: border-box;padding:20px;padding-top:60px;">
        <div class="left">
          <border-box-7 :color="['#0154be', '#03f7fc']" style="height:calc(30% - 5px);box-sizing: border-box;backdrop-filter:blur(20px);">
            <div style="display:grid;grid-template-rows: auto 1fr;grid-template-columns: 1fr 1fr;width: 100%;height: 100%;place-items: center;padding:10px;box-sizing: border-box;">
              <div style="display: flex;flex-direction: row;justify-content: space-around;grid-row-start: 1;grid-row:span 1 / span 1;grid-column-start: 1;grid-column: span 2 / span 2;">
                <div style="margin-right: 20px;font-size: 18px;">雷达状态分布</div>
                <div class="online" style="font-weight: bold;line-height: 18px;display: flex;align-items: center;">正常</div>
                <div class="offline" style="font-weight: bold;line-height: 18px;display: flex;align-items: center;">异常</div>
              </div>
              <div ref="pieChart1" style="grid-row-start: 2;grid-row:span 1 / span 1;grid-column-start: 1;grid-column: span 1 / span 1;width: 100%;height: 100%;"></div>
              <div class="percents"
              style="display: grid;grid-template-rows: 3;grid-template-columns: 2;align-items: center;grid-column-start: 2;grid-column: span 1 / span 1;grid-row-start: 2;grid-row:span 1 / span 1;height: 80px;font-size: 20px;display: flex;flex-direction: column;justify-content: space-between;">
                <div style="display: flex;width:100%;"><div class="online">正常</div>{{(radars.filter((item:any)=>item.status==1).length/radars.length*100).toFixed()}}%</div>
                <div style="display: flex;width:100%;"><div class="offline">异常</div>{{(radars.filter((item:any)=>item.status!=1).length/radars.length*100).toFixed()}}%</div>
              </div>
            </div>
          </border-box-7>
          <border-box-7 :color="['#0154be', '#03f7fc']" style="height: calc(70% - 5px);box-sizing: border-box;backdrop-filter:blur(20px);">
            <!-- <District></District> -->
            <div style="display: flex;justify-content: center;"><strong style="line-height: 40px;font-size: 20px;">雷达当天每小时传感器数据获取量</strong></div>
            <div style="height:calc(100% - 40px);width:100%;display: grid;grid-template-rows: 3;grid-template-columns: 2;place-items: center;gap:10px;padding:10px;box-sizing: border-box;">
              <div ref="th1" style="grid-row-start: 1;grid-row:span 1 / span 1;grid-column-start: 1;grid-column: span 1 / span 1;width: 100%;height: 100%;"></div>
              <div ref="th2" style="grid-row-start: 1;grid-row:span 1 / span 1;grid-column-start: 2;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
              <div ref="th3" style="grid-row-start: 1;grid-row: span 1 / span 1;width: 100%;height: 100%;"></div>
              <div ref="th4" style="grid-row-start: 1;grid-row:span 1 / span 1;grid-column-start: 2;grid-column: span 1 / span 1;width: 100%;height: 100%;"></div>
              <div ref="th5" style="grid-row-start: 3;grid-row: span 1 / span 1;grid-column-start: 1;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
              <div ref="th6" style="grid-row-start: 3;grid-row: span 1 / span 1; grid-column-start: 2;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
            </div>
          </border-box-7>
        </div>
        <div class="center">
            <div style="width:100%;height: 100%;box-sizing: border-box;display: flex;color-white;">
              <border-box-1 :color="['#0154be', '#03f7fc']" style="height: 200px; box-sizing: border-box;backdrop-filter:blur(20px);pointer-events: auto;">
                <div style="display: grid;grid-template-columns: repeat(3,minmax(0,1fr)); grid-template-rows: 1fr auto;width: 100%;height: 100%;box-sizing: border-box;display: flex;color:white;">
                    <decoration-9 style="width: 100%;height: 100%;grid-column-start: 1;grid-column: span 1 / span 1;grid-row-start: 1;grid-row:span 1 / span 1;">
                      <div color-white font-600 style="font-size:20px;text-shadow: 0 0 3px #7acaec;text-decoration:underline;">
                        {{ radars.length }}台
                      </div>
                    </decoration-9>
                    <div style="width: 100%;height: 100%;grid-column-start: 1;grid-column: span 1 / span 1;grid-row-start: 2;grid-row:span 1 / span 1;">雷达总数</div>
                    <decoration-9 style="width: 100%;height: 100%;grid-column-start: 1;grid-column: span 1 / span 1;grid-row-start: 1;grid-row:span 1 / span 1;">
                      <div color-green font-600 style="font-size:20px;text-shadow: 0 0 3px #7acaec;">
                        {{ radars.filter((item:any)=>item.status==1).length }}台
                      </div>
                    </decoration-9>
                    <div style="width: 100%;height: 100%;grid-column-start: 2;grid-column: span 1 / span 1;grid-row-start: 2;grid-row:span 1 / span 1">正常雷达</div>
                    <decoration-9 style="width: 100%;height: 100%;grid-column-start: 3;grid-column: span 1 / span 1;grid-row-start: 1;grid-row:span 1 / span 1;">
                      <div :style="`font-size:20px;text-shadow: 0 0 3px #7acaec;font-weight: 600;color:${radars.filter((item:any)=>item.status!=1).length>0?'#f00':'gray'}`">
                        {{ radars.filter((item:any)=>item.status!=1).length }}台
                      </div>
                    </decoration-9>
                    <div style="width: 100%;height: 100%;grid-column-start: 3;grid-column: span 1 / span 1;grid-row-start: 2;grid-row: span 1 / span 1;">异常雷达</div>
                </div>
              </border-box-1>
            </div>
        </div>
        <div class="right">
          <border-box-7 :color="['#0154be', '#03f7fc']" style="box-sizing: border-box;backdrop-filter:blur(20px);pointer-events: auto;height: calc(70% - 5px);">
            <div style="display: flex;justify-content: center;"><strong style="line-height: 40px;font-size: 20px;">雷达当天每小时10分钟平均风廓线数据获取量</strong></div>
            <div style="height: calc(100% - 40px);width:100%;display: grid;grid-template-rows: 3;grid-template-columns: 2;place-items: center;gap:10px;padding:10px;box-sizing: border-box;">
              <div ref="dataTrend1" style="grid-row-start: 1;grid-row: span 1 / span 1;grid-column-start: 1;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
              <div ref="dataTrend2" style="grid-row-start: 1;grid-row:span 1 / span 1;grid-column-start: 2;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
              <div ref="dataTrend3" style="grid-row-start: 2;grid-row:span 1 / span 1;grid-column-start: 1;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
              <div ref="dataTrend4" style="grid-row-start: 2;grid-row:span 1 / span 1;grid-column-start: 2;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
              <div ref="dataTrend5" style="grid-row-start: 3;grid-row:span 1 / span 1;grid-column-start: 1;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
              <div ref="dataTrend6" style="grid-row-start: 3;grid-row:span 1 / span 1;grid-column-start: 2;grid-column: span 1 / span 1;width:100%;height: 100%;"></div>
            </div>
          </border-box-7>
          <border-box-7 :color="['#0154be', '#03f7fc']" style="box-sizing: border-box;backdrop-filter:blur(20px);pointer-events: auto;height: calc(30% - 5px);">
            <Sys></Sys>
          </border-box-7>
        </div>
      </div>
    </border-box-11>
  </div>
</template>
<script lang="ts" setup>
import Sys from './Sys.vue'
import { exec } from "~/api/index.js";
import {databaseRaw,getDbsData,getSensorData} from '~/api/重庆';
import {ref} from 'vue'
import District from './区划/district.vue'
import Header from './header.vue'
import { BorderBox7,Decoration9,BorderBox1,BorderBox11 } from '~/../packages/dataV';
import echartsUtils from './echartsUtils'
import { onBeforeUnmount, onMounted } from 'vue';
import { eventbus } from '~/eventbus';
import data from './data.json'

const settingShow = ref(false)
const editUserShow = ref(false)
const sensorViewShow = ref(false)
const device = ref()
import Alarm from './alarm.vue';
import ChangePassword from './changePassword.vue';
import SensorView from './sensorView.vue';
import moment from "moment";
const menuIndex = ref(2)
const mapChart = ref(null)
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
function radarClick(data:Object){
  device.value = data
  sensorViewShow.value = true
}
let radars = ref([])
let timer:number
onMounted(()=>{
  timer = setInterval(()=>{
    work()
  },5e3)
  work()
})
async function work(){
  const dbsData = (await getDbsData({radar_id:'',dataTime:moment().format('YYYYMMDD')})).data.data
  eventbus.on('山西测风雷达组网-设备编辑',radarClick)
  radars.value = (await exec({
    database: databaseRaw,
    query: {
      sqls: ["select * from `device`"],
    },
  })).data[0].filter((item:any)=>item.hide!=='true')
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
  data.teacherBuildTime = new Array(24).fill(0)
  dbsData.map((item:any)=>{
    if(item.radar_id=='A6418'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          data.teacherBuildTime[i] = item.data[i].count
        }else{
          data.teacherBuildTime[i] = 0
        }
      }
    }
  })
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend1.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "渝北",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = new Array(24).fill(0)
  dbsData.map((item:any)=>{
    if(item.radar_id=='A6419'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          data.teacherBuildTime[i] = item.data[i].count
        }else{
          data.teacherBuildTime[i] = 0
        }
      }
    }
  })
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend2.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "北碚",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = new Array(24).fill(0)
  dbsData.map((item:any)=>{
    if(item.radar_id=='A6420'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          data.teacherBuildTime[i] = item.data[i].count
        }else{
          data.teacherBuildTime[i] = 0
        }
      }
    }
  })
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend3.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "巴南",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = new Array(24).fill(0)
  dbsData.map((item:any)=>{
    if(item.radar_id=='A6421'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          data.teacherBuildTime[i] = item.data[i].count
        }else{
          data.teacherBuildTime[i] = 0
        }
      }
    }
  })
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend4.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "綦江",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = new Array(24).fill(0)
  dbsData.map((item:any)=>{
    if(item.radar_id=='A6422'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          data.teacherBuildTime[i] = item.data[i].count
        }else{
          data.teacherBuildTime[i] = 0
        }
      }
    }
  })
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend5.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "万州",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = new Array(24).fill(0)
  dbsData.map((item:any)=>{
    if(item.radar_id=='A6423'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          data.teacherBuildTime[i] = item.data[i].count
        }else{
          data.teacherBuildTime[i] = 0
        }
      }
    }
  })
  echartsUtils.initLineOrBarChart({
    type:'bar',
    chartName: dataTrend6.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "城口",
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
  const sensorData = (await getSensorData({radar_id:'',dataTime:moment().format('YYYYMMDD')})).data.data
  const th1Data = new Array(24).fill(0)
  sensorData&&sensorData.map((item:any)=>{
    if(item.radar_id=='A6418'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          th1Data[i] = item.data[i].count
        }else{
          th1Data[i] = 0
        }
      }
    }
  })
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th1.value,
    title: "渝北",
    yName1: "(次)",
    legendShow: true,
    data: {
      d1: th1Data,
      // d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "（次）",
    // seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  const th2Data = new Array(24).fill(0)
  sensorData&&sensorData.map((item:any)=>{
    if(item.radar_id=='A6419'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          th2Data[i] = item.data[i].count
        }else{
          th2Data[i] = 0
        }
      }
    }
  })
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th2.value,
    title: "北碚",
    yName1: "(次)",
    legendShow: true,
    data: {
      d1: th2Data,
      // d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "（次）",
    // seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  const th3Data = new Array(24).fill(0)
  sensorData&&sensorData.map((item:any)=>{
    if(item.radar_id=='A6420'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          th3Data[i] = item.data[i].count
        }else{
          th3Data[i] = 0
        }
      }
    }
  })
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th3.value,
    title: "巴南",
    yName1: "(次)",
    legendShow: true,
    data: {
      d1: th3Data,
      // d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "（次）",
    // seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  const th4Data = new Array(24).fill(0)
  sensorData&&sensorData.map((item:any)=>{
    if(item.radar_id=='A6421'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          th4Data[i] = item.data[i].count
        }else{
          th4Data[i] = 0
        }
      }
    }
  })
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th4.value,
    title: "綦江",
    yName1: "(次)",
    legendShow: true,
    data: {
      d1: th4Data,
      // d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "（次）",
    // seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  const th5Data = new Array(24).fill(0)
  sensorData&&sensorData.map((item:any)=>{
    if(item.radar_id=='A6422'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          th5Data[i] = item.data[i].count
        }else{
          th5Data[i] = 0
        }
      }
    }
  })
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th5.value,
    title: "万州",
    yName1: "(次)",
    legendShow: true,
    data: {
      d1: th5Data,
      // d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "（次）",
    // seriesName2: "湿度（%）",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  const th6Data = new Array(24).fill(0)
  sensorData&&sensorData.map((item:any)=>{
    if(item.radar_id=='A6423'){
      for(let i=0;i<24;i++){
        if(item.data[i]){
          th6Data[i] = item.data[i].count
        }else{
          th6Data[i] = 0
        }
      }
    }
  })
  echartsUtils.initDoubleLineOrBarChart({
    chartName: th6.value,
    title: "城口",
    yName1: "(次)",
    legendShow: true,
    data: {
      d1: th6Data,
      // d2: [10,20,40,50,80,90,70,60,50,30,40,50,15,20,22,23,24,25,26,19,18,20,25,26],
    },
    // line: 2,
    seriesName1: "（次）",
    // seriesName2: "湿度（%）",
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
    chartName: mapChart.value,
    data:radars.value
  })
  echartsUtils.initPieChart1({
    chartName: pieChart1.value,
    data:{
      正常:radars.value.filter((item:any)=>item.status==1).length,
      异常:radars.value.filter((item:any)=>item.status!=1).length,
    }
  })
}
onBeforeUnmount(()=>{
  clearInterval(timer)
  echartsUtils.destroy()
  eventbus.off('山西测风雷达组网-设备编辑',radarClick)
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
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>