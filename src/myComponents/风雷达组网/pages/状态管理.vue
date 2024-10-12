<template>
  <div class="page color-white">
    <Header class="z-1"></Header>
    <border-box-11 ref="dvBorder11" :color="['#8aaafb','transparent']" title="重庆测风雷达组网" :title-width="400" :animate="true" style="width:100%;height:100%;">
    <div class="absolute flex w-full h-full justify-around box-border p-20px p-t-60px">
      <div class="left">
        <border-box-7 :color="['#0154be', '#03f7fc']" style="height:calc(30% - 5px);box-sizing: border-box;backdrop-filter:blur(8px);">
          <div class="w-full h-full place-items-center p-10px box-border" style="display:grid;grid-template-rows: auto 1fr;grid-template-columns: 1fr 1fr;">
            <div class="flex flex-row justify-around row-start-1 row-span-1 col-start-1 col-span-2">
              <div class="m-r-20px font-size-18px">雷达状态分布</div>
              <div class="online font-bold line-height-18px flex items-center">在线</div>
              <div class="offline font-bold line-height-18px flex items-center">离线</div>
              <div class="warning font-bold line-height-18px flex items-center">告警</div>
            </div>
            <div ref="pieChart1"  class="row-start-2 row-span-1 col-start-1 col-span-1 w-full h-full"></div>
            <div class="percents grid grid-cols-2 grid-rows-3 items-center col-start-2 col-span-1 row-start-2 row-span-1 h-100px font-size-20px">
              <div class="online">在线</div>100%
              <div class="offline">离线</div>0%
              <div class="warning">告警</div>0%
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
          <div class="w-full h-full grid cols-2 rows-4 place-items-center grid-gap-10px p-10px box-border">
            <div ref="vocational" id="vocational" class="row-start-1 row-span-1 col-start-1 col-span-1 w-full h-full"></div>
            <div ref="bl" id="bl" class="row-start-1 row-start-1 col-start-2 col-span-1 w-full h-full"></div>
            <div ref="professionalCertificate" id="professionalCertificate" class="row-start-2 row-start-1 col-start-1 col-span-1 w-full h-full"></div>
            <div ref="national" id="national" class="row-start-2 row-start-1 col-start-2 col-span-1 w-full h-full"></div>
            <div ref="employmentCounterpart" id="employmentCounterpart" class="row-start-3 row-start-1 col-start-1 col-span-1 w-full h-full"></div>
            <div ref="employmentNum" id="employmentNum" class="row-start-3 row-start-1 col-start-2 col-span-1 w-full h-full"></div>
            <div ref="practiceBase" id="practiceBase" class="row-start-4 row-start-1 col-start-1 col-span-1 w-full h-full"></div>
            <div ref="skill" id="skill" class="row-start-4 row-start-1 col-start-2 col-span-1 w-full h-full"></div>
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
import data from './data.json'
const pieChart1 = ref(null)
const dataTrend1 = ref(null)
const dataTrend2 = ref(null)
const dataTrend3 = ref(null)
const dataTrend4 = ref(null)
const dataTrend5 = ref(null)
const dataTrend6 = ref(null)
onMounted(()=>{
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
  data.teacherBuildTime = [7,5,6,6,6,6,5,6,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    chartName: dataTrend1.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "A6418当天数据获取数量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,7,6,6,6,6]
  echartsUtils.initLineOrBarChart({
    chartName: dataTrend2.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "A6419当天数据获取数量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,6,6,6,7]
  echartsUtils.initLineOrBarChart({
    chartName: dataTrend3.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "A6420当天数据获取数量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,6,6,6,5]
  echartsUtils.initLineOrBarChart({
    chartName: dataTrend4.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "A6421当天数据获取数量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,4,6,6,7]
  echartsUtils.initLineOrBarChart({
    chartName: dataTrend5.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "A6422当天数据获取数量",
    color: [
      "rgba(0, 187, 255, 1)",
      "rgba(0, 187, 255, 0.3)",
      "rgba(0, 187, 255, 0.9)",
    ],
    unit: "(次数)",
  });
  data.teacherBuildTime = [6,6,6,6,6,6,5,6,6,6,6,3]
  echartsUtils.initLineOrBarChart({
    chartName: dataTrend6.value,
    data: {
      d1: data.teacherBuildTime,
    },
    title: "A6423当天数据获取数量",
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
  echartsUtils.initRadarChart({
    chartName: "vocational",
    title: "报考高职原因分析",
    data: data.vocational,
  });
  echartsUtils.initBarAndPieChart({
    chartName: "bl",
    title: "中高贯通培养比例",
    data: data.bl,
  });
  // 职业资格证书获取情况
  echartsUtils.initDoubleLineOrBarChart({
    chartName: "professionalCertificate",
    title: "职业资格证书获取情况",
    yName1: "(万人)",
    yAxisIndex: 1,
    data: {
      d1: data.professionalQualificationCertificate,
    },
    type: "bar",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  // 国家级技能竞赛获奖情况
  echartsUtils.initBarTypeChart({
    chartName: "national",
    title: "国家级技能竞赛获奖情况",
    xAxisName: "(万人)",
    data: {
      d1: data.national,
    },
  });
  // 就业对口情况
  echartsUtils.initDoubleLineOrBarChart({
    chartName: "employmentCounterpart",
    title: "就业对口情况",
    yName1: "(%)",
    legendShow: true,
    data: {
      d1: data.employment,
      d2: data.match,
    },
    // line: 2,
    seriesName1: "就业率",
    seriesName2: "对口率",
    grid: {
      left: 40,
      right: 10,
      bottom: 30,
      top: 43,
      height: "60%",
      width: "70%",
    },
  });
  // 就业去向区域排名
  echartsUtils.initBarTypeChart({
    chartName: "employmentNum",
    title: "就业去向区域排名",
    xAxisName: "(万人)",
    xAxisName1: "总就业人数",
    xAxisName2: "本地区就业人数",
    data: {
      d1: data.totalEmployment,
      d2: data.employmentRegion,
    },
    grid: {
      left: 50,
      right: 30,
      top: 50,
      bottom: 0,
      // height: "60%",
    },
  });
  // 实践基地设置
  echartsUtils.initStackBarChart({
    chartName: "practiceBase",
    title: "实践基地设置",
    data: {
      d1: data.practiceBaseIn,
      d2: data.practiceBaseOut,
    },
    name1: "校内实践基地",
    name2: "校外实训基地",
    unit: "(万个)",
  });
  //技能鉴定机构设置
  echartsUtils.initDoubleLineOrBarChart({
    chartName: "skill",
    type: "bar",
    data: {
      d1: data.skil,
      d2: data.skilStudent,
    },
    // grid: {},
    color2: "rgba(1, 211, 142, 1)",
    yAxisNamePd: [-20, -40, 0, 0],
    yName1: "鉴定机构数量(个)",
    yName2: "鉴定学生数量(万人)",
    title: "技能鉴定机构设置",
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