<template>
  <div class="absolute inset-0 bg-#000000aa z-1" @click="hideFunc" @mousedown="mousedownFunc">
    <div class="editDevice_dialog" @mousedown.stop>
      <BorderBox class="box-border p-20px" style="backdrop-filter: blur(10px);">
        <div class="flex flex-col h-full" style="overflow: auto;box-sizing: border-box">
          <div class="flex font-size-18px line-height-40px"><div>雷达名称:</div><strong>{{ props.device.device_short_name }}</strong></div>
          <div class="flex font-size-16px line-height-30px"><div>雷达编号:</div>{{ props.device.no }}</div>
          <div class="flex line-height-30px"><div>系统当前时间:</div>{{ formData.Date_time }}</div>
          <fieldset>
            <legend>主控板传感器数据</legend>
            <el-form-item
              label="HHMC DIO的状态前12路DI后16路DO">
              <el-input :value="formData.MCDIO"/>
            </el-form-item>
            <el-form-item
              label="控制板MCU温度，单位℃">
              <el-input :value="format(formData.MCBoardTemp)"/>
            </el-form-item>
            <el-form-item
              label="雷达内部湿度（来自主控板温湿度传感器），单位%">
              <el-input :value="format(formData.MCInnerHumidity)"/>
            </el-form-item>
            <el-form-item
              label="雷达内部温度1（来自主控板温湿度传感器），单位℃">
              <el-input :value="format(formData.MCInnerTemp1)"/>
            </el-form-item>
            <el-form-item
              label="雷达内部温度2（来自主控板DS18B20_2），单位℃">
              <el-input :value="format(formData.MCInnerTemp2)"/>
            </el-form-item>
            <el-form-item
              label="主控板测量的外部湿度，单位%">
              <el-input :value="format(formData.MCOuterHumidity)"/>
            </el-form-item>
            <el-form-item
              label="主控板测量的外部温度，单位℃">
              <el-input :value="format(formData.MCOuterTemp)"/>
            </el-form-item>
            <el-form-item
              label="主控板测量的外部气压，单位hPa">
              <el-input :value="format(formData.MCOuterAirPressure)"/>
            </el-form-item>
            <el-form-item
              label="主控板测量的外内压差，正值表示外部压力大，单位hPa">
              <el-input :value="format(formData.MCOuterRelPressure)"/>
            </el-form-item>
            <el-form-item
              label="计数10ms">
              <el-input :value="formData.MCCount"/>
            </el-form-item>
          </fieldset>
          <fieldset>
            <legend>电压电流</legend>
            <el-form-item
              label="系统电压V">
              <el-input :value="format(formData.SysVoltage)"/>
            </el-form-item>
            <el-form-item
              label="系统电流A">
              <el-input :value="format(formData.SysCurrent)"/>
            </el-form-item>
          </fieldset>
          <fieldset>
            <legend>六要素</legend>
            <el-form-item
                label="环境温度，单位℃">
                <el-input :value="format(formData.Temperature)"/>
              </el-form-item>
              <el-form-item
                label="湿度，单位%">
                <el-input :value="format(formData.Humidity)"/>
              </el-form-item>
              <el-form-item
                label="气压，单位hPa">
                <el-input :value="format(formData.Pressure)"/>
              </el-form-item>
              <el-form-item
                label="降雨强度，单位mm/min">
                <el-input :value="format(formData.RainSpeed)"/>
              </el-form-item>
              <el-form-item
                label="降雨量，单位mm">
                <el-input :value="format(formData.RainLevel)"/>
              </el-form-item>
              <el-form-item
                label="风速，单位m/s">
                <el-input :value="format(formData.LandWindSpeed)"/>
              </el-form-item>
              <el-form-item
                label="风向，单位°">
                <el-input :value="format(formData.LandWindDir)"/>
              </el-form-item>
          </fieldset>
          <fieldset>
            <legend>伺服</legend>
            <el-form-item
              label="伺服状态">
              <el-input :value="formData.ServorStatus"/>
            </el-form-item>
            <el-form-item
              label="伺服设定方位角，相对于雷达自身坐标系，单位°">
              <el-input :value="format(formData.Azimuth)"/>
            </el-form-item>
            <el-form-item
              label="伺服设定俯仰角，相对于雷达自身坐标系，单位°">
              <el-input :value="format(formData.Pitch)"/>
            </el-form-item>
            <el-form-item
              label="伺服方位角运行状态">
              <el-input :value="format(formData.AzimuthStatus)"/>
            </el-form-item>
            <el-form-item
              label="伺服俯仰角运行状态">
              <el-input :value="format(formData.PitchStatus)"/>
            </el-form-item>
          </fieldset>
          <fieldset>
            <legend>UPS</legend>
            <el-form-item
              label="UPS状态">
              <el-input :value="formData.UPSStatus"/>
            </el-form-item>
            <el-form-item
              label="UPS输入电压">
              <el-input :value="format(formData.UPSVin)"/>
            </el-form-item>
            <el-form-item
              label="UPS输出电压">
              <el-input :value="format(formData.UPSVout)"/>
            </el-form-item>
          </fieldset>
          <fieldset>
            <legend>GPS</legend>
            <el-form-item
              label="GPS状态">
              <el-input :value="formData.GPSStatus"/>
            </el-form-item>
            <el-form-item
              label="GPS数据有效性">
              <el-input :value="format(formData.GPSDataValid)"/>
            </el-form-item>
            <el-form-item
              label="GPS系统状态">
              <el-input :value="format(formData.GPSSystemStatus)"/>
            </el-form-item>
            <el-form-item
              label="偏北方向，单位°">
              <el-input :value="format(formData.NorthOffset)"/>
            </el-form-item>
            <el-form-item
              label="X倾角（横滚角），单位°。雷达北为前向，右滚为正，左滚为负。">
              <el-input :value="format(formData.Rolling)"/>
            </el-form-item>
            <el-form-item
              label="Y倾角(俯仰角)，单位°。雷达北为前向，抬头为正，低头为负。">
              <el-input :value="format(formData.Pitch)"/>
            </el-form-item>
            <el-form-item
              label="经度，单位°">
              <el-input :value="formData.Longitude"/>
            </el-form-item>
            <el-form-item
              label="纬度，单位°">
              <el-input :value="formData.Latitude"/>
            </el-form-item>
            <el-form-item
              label="高度，单位m">
              <el-input :value="format(formData.Altitude)"/>
            </el-form-item>
            <el-form-item
              label="雷达自身东向速度,向东为正，向西为负,单位m/s">
              <el-input :value="format(formData.EastSpeed)"/>
            </el-form-item>
            <el-form-item
              label="雷达自身北向速度,向北为正，向南为负,单位m/s">
              <el-input :value="format(formData.NorthSpeed)"/>
            </el-form-item>
            <el-form-item
              label="雷达自身天向速度，向上为正，向下为负,单位m/s">
              <el-input :value="format(formData.UpSpeed)"/>
            </el-form-item>
            <el-form-item
              label="真实方位角，相对于大地坐标系，单位°">
              <el-input :value="format(formData.EarthAzimuth)"/>
            </el-form-item>
            <el-form-item
              label="真实俯仰角，相对于大地坐标系，单位°">
              <el-input :value="format(formData.EarthPitch)"/>
            </el-form-item>
            <el-form-item
              label="卫导前天线卫星数量">
              <el-input :value="format(formData.FrontAntanaNum)"/>
            </el-form-item>
            <el-form-item
              label="卫导后天线卫星数量">
              <el-input :value="format(formData.BackAntanaNum)"/>
            </el-form-item>
            <el-form-item
              label="卫导前后天线之间的距离,单位m">
              <el-input :value="format(formData.BaseLine)"/>
            </el-form-item>
          </fieldset>
          <fieldset>
            <legend>激光器</legend>
            <el-form-item
              label="激光器种子状态">
              <el-input :value="formData.LaserStatus"/>
            </el-form-item>
            <el-form-item
              label="激光放大器状态">
              <el-input :value="formData.AmpStatus"/>
            </el-form-item>
            <el-form-item
              label="激光器外壳温度，单位℃">
              <el-input :value="format(formData.LaserBoxTemp)"/>
            </el-form-item>
            <el-form-item
              label="激光器泵浦电流，单位mA">
              <el-input :value="format(formData.LaserCurrent)"/>
            </el-form-item>
            <el-form-item
              label="激光器1级泵浦温度，单位℃">
              <el-input :value="format(formData.LaserCH1Temp)"/>
            </el-form-item>
            <el-form-item
              label="激光器PD功率，单位mW">
              <el-input :value="format(formData.LaserPDPower)"/>
            </el-form-item>
            <el-form-item
              label="激光器CH2功率，单位mW">
              <el-input :value="format(formData.LaserCH2Power)"/>
            </el-form-item>
            <el-form-item
              label="激光器CH1功率(输出功率)，单位mW">
              <el-input :value="format(formData.LaserOutPower)"/>
            </el-form-item>
            <el-form-item
              label="激光放大器外壳温度，单位℃">
              <el-input :value="format(formData.AmpBoxTemp)"/>
            </el-form-item>
            <el-form-item
              label="激光放大器泵浦温度，单位℃">
              <el-input :value="format(formData.AmpTemp)"/>
            </el-form-item>
            <el-form-item
              label="激光放大器泵浦电流，单位mA">
              <el-input :value="format(formData.AmpCurrent)"/>
            </el-form-item>
            <el-form-item
              label="激光放大器输入功率，单位mW">
              <el-input :value="format(formData.AmpInPower)"/>
            </el-form-item>
            <el-form-item
              label="激光放大器PD功率，单位mW">
              <el-input :value="format(formData.AmpPDPower)"/>
            </el-form-item>
            <el-form-item
              label="激光放大器CH2功率，单位mW">
              <el-input :value="format(formData.AmpCH2Power)"/>
            </el-form-item>
            <el-form-item
              label="激光放大器CH1功率(输出功率)，单位mW">
              <el-input :value="format(formData.AmpOutPower)"/>
            </el-form-item>
            <el-form-item
              label="激光器输入脉冲频率，单位Hz ，仅法国激光器">
              <el-input :value="format(formData.FPRF)"/>
            </el-form-item>
            <el-form-item
              label="激光器告警代码 ，仅法国激光器">
              <el-input :value="format(formData.AlarmCode)"/>
            </el-form-item>
          </fieldset>
        </div>
      </BorderBox>
    </div>
  </div>
</template>
<script lang="ts" setup name="loginPage">
const props = withDefaults(defineProps<{device:any}>(),{device:{}})
let mousedown = false
function mousedownFunc(){
  mousedown = true
}
const emits = defineEmits(['update:show'])
function hideFunc(){
  if(mousedown){
    mousedown=false
    emits('update:show',false)
  }
}
import { BorderBox12 as BorderBox } from "~/../packages/dataV";
import { reactive, ref, h, watch,onMounted } from "vue";
function format(val:any){
  if(typeof val == 'number'){
    const decimalIndex = val.toString().indexOf('.');
    if(decimalIndex===-1){
      return val
    }else if(val.toString().length-decimalIndex>2){
      return Number(val).toFixed(2)
    }else{
      return val
    }
  }else{
    return val
  }
}
import type { FormInstance } from "element-plus";
import { useUserStore } from "~/stores/user";
import { useSettingStore } from "~/stores/setting";
import { array2components } from "~/tools";
const setting = useSettingStore();
const user = useUserStore();
import {exec} from '~/api'
import {databaseRaw} from '~/api/重庆'
onMounted(()=>{
  exec({
    database: databaseRaw,
    query: {
      sqls: [`select * from \`sensor_${moment().format('YYYYMMDD')}\` where \`Device\`='${props.device.no}' and \`Date_time\` <= '${moment().format('YYYY-MM-DD HH:mm:ss')}' order by \`Date_time\` desc LIMIT 1`],
      vals:[[props.device]]
    },
  }).then((res:any) => {
    if(res.data[0].length==0){
      openVn('无今天sensor数据')
    }else if(res.data[0].length==1){
      Object.assign(formData,res.data[0][0])
      console.log(res.data[0][0])
    }else{
      throw Error('This should never happen!!!')
    }
  })
})
import { ElMessage } from "element-plus";
import moment from "moment";
const formData = reactive({
  "Device": null,
  "Date_time": null,
  "MCDIO": null,
  "MCBoardTemp": null,
  "MCInnerHumidity": null,
  "MCInnerTemp1": null,
  "MCInnerTemp2": null,
  "MCOuterHumidity": null,
  "MCOuterTemp": null,
  "MCOuterAirPressure": null,
  "MCOuterRelPressure": null,
  "MCCount": null,
  "Temperature": null,
  "Humidity": null,
  "Pressure": null,
  "RainSpeed": null,
  "RainLevel": null,
  "LandWindSpeed": null,
  "LandWindDir": null,
  "ServorStatus": null,
  "Azimuth": null,
  "Pitch": null,
  "AzimuthStatus": null,
  "PitchStatus": null,
  "UPSStatus": null,
  "UPSVin": null,
  "UPSVout": null,
  "GPSStatus": null,
  "GPSDataValid": null,
  "GPSSystemStatus": null,
  "NorthOffset": null,
  "Rolling": null,
  "GPSPitch": null,
  "Longitude": null,
  "Latitude": null,
  "Altitude": null,
  "EastSpeed": null,
  "NorthSpeed": null,
  "UpSpeed": null,
  "EarthAzimuth": null,
  "EarthPitch": null,
  "FrontAntanaNum": null,
  "BackAntanaNum": null,
  "BaseLine": null,
  "LaserStatus": null,
  "AmpStatus": null,
  "LaserBoxTemp": null,
  "LaserCurrent": null,
  "LaserCH1Temp": null,
  "LaserPDPower": null,
  "LaserCH2Power": null,
  "LaserOutPower": null,
  "AmpBoxTemp": null,
  "AmpTemp": null,
  "AmpCurrent": null,
  "AmpInPower": null,
  "AmpPDPower": null,
  "AmpCH2Power": null,
  "AmpOutPower": null,
  "FPRF": null,
  "AlarmCode": null,
  "SysVoltage": null,
  "SysCurrent": null
});
const openVn = (message: string) => {
  ElMessage({
    message: h("p", null, [
      // h('span', null, 'Message can be '),
      h("i", { style: "color: teal" }, message),
    ]),
    type: "error",
  });
};
</script>
<style lang="scss">
.editDevice_dialog {
  --width:800px;
  --height:800px;
  width:var(--width);
  height: var(--height);
  left: calc(50% - var(--width)/2);
  top: calc(50% - var(--height)/2);
  position: absolute;
  // background-color: #f00;
  display: flex;
  align-items: center;
  flex-direction: column;
  .title {
    background-size: cover;
    font-family: "SourceHanSansSC-Bold";
    font-weight: 600;
    text-align: left;
    font-size: 35px;
    color: #40b9ff;
    text-shadow: 5px 4px 5px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    display: inline-block;
    white-space: nowrap;
  }
  fieldset{
    border-radius:10px;
  }
}
</style>