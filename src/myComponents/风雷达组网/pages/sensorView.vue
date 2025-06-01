<template>
  <div style="position: absolute;inset:0;background-color: #000000aa;z-index: 1;" @click="hideFunc" @mousedown="mousedownFunc">
    <div class="editDevice_dialog" @mousedown.stop>
      <BorderBox style="backdrop-filter: blur(10px);box-sizing: border-box;padding:20px;">
        <div style="overflow: auto;box-sizing: border-box;display: flex;flex-direction: column;height: 100%;">
          <div style="position: flex;font-size: 18px;line-height: 40px;"><div>雷达名称:</div><strong>{{ props.device.device_short_name }}</strong></div>
          <div style="display: flex;font-size: 16px;line-height: 30px;"><div>雷达编号:</div>{{ props.device.no }}</div>
          <div style="display: flex;line-height: 30px;"><div>系统当前时间:</div>{{ formData.Date_time }}</div>
          <fieldset>
            <legend>主控板传感器数据</legend>
            <div class="item">
              <div class="whitespace-nowrap">HHMC DIO的状态前12路DI后16路DO</div>
              <div class="sensor-properties">{{ formData.MCDIO }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">控制板MCU温度，单位℃</div>
              <div class="sensor-properties">{{ format(formData.MCBoardTemp) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">雷达内部湿度（来自主控板温湿度传感器），单位%</div>
              <div class="sensor-properties">{{ format(formData.MCInnerHumidity) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">雷达内部温度1（来自主控板温湿度传感器），单位℃</div>
              <div class="sensor-properties">{{ format(formData.MCInnerTemp1) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">雷达内部温度2（来自主控板DS18B20_2），单位℃</div>
              <div class="sensor-properties">{{ format(formData.MCInnerTemp2) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">主控板测量的外部湿度，单位%</div>
              <div class="sensor-properties">{{ format(formData.MCOuterHumidity) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">主控板测量的外部温度，单位℃</div>
              <div class="sensor-properties">{{ format(formData.MCOuterTemp) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">主控板测量的外部气压，单位hPa</div>
              <div class="sensor-properties">{{ format(formData.MCOuterAirPressure) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">主控板测量的外内压差，正值表示外部压力大，单位hPa</div>
              <div class="sensor-properties">{{ format(formData.MCOuterRelPressure) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">计数10ms</div>
              <div class="sensor-properties">{{ formData.MCCount }}</div>
            </div>
          </fieldset>
          <fieldset>
            <legend>电压电流</legend>
            <div class="item">
              <div class="whitespace-nowrap">系统电压V</div>
              <div class="sensor-properties">{{ format(formData.SysVoltage) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">系统电流A</div>
              <div class="sensor-properties">{{ format(formData.SysCurrent) }}</div>
            </div>
          </fieldset>
          <fieldset>
            <legend>伺服</legend>
            <div class="item">
              <div class="whitespace-nowrap">伺服状态</div>
              <div class="sensor-properties">{{ formData.ServorStatus }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">伺服设定方位角，相对于雷达自身坐标系，单位°</div>
              <div class="sensor-properties">{{ format(formData.Azimuth) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">伺服设定俯仰角，相对于雷达自身坐标系，单位°</div>
              <div class="sensor-properties">{{ format(formData.Pitch) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">伺服方位角运行状态</div>
              <div class="sensor-properties">{{ format(formData.AzimuthStatus) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">伺服俯仰角运行状态</div>
              <div class="sensor-properties">{{ format(formData.PitchStatus) }}</div>
            </div>
          </fieldset>
          <fieldset>
            <legend>UPS</legend>
            <div class="item">
              <div class="whitespace-nowrap">UPS状态</div>
              <div class="sensor-properties">{{ formData.UPSStatus }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">UPS输入电压</div>
              <div class="sensor-properties">{{ format(formData.UPSVin) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">UPS输出电压</div>
              <div class="sensor-properties">{{ format(formData.UPSVout) }}</div>
            </div>
          </fieldset>
          <fieldset>
            <legend>GPS</legend>
            <div class="item">
              <div class="whitespace-nowrap">GPS状态</div>
              <div class="sensor-properties">{{ formData.GPSStatus }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">GPS数据有效性</div>
              <div class="sensor-properties">{{ formData.GPSDataValid }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">GPS系统状态</div>
              <div class="sensor-properties">{{ formData.GPSSystemStatus }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">偏北方向，单位°</div>
              <div class="sensor-properties">{{ format(formData.NorthOffset) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">X倾角（横滚角），单位°。雷达北为前向，右滚为正，左滚为负。</div>
              <div class="sensor-properties">{{ format(formData.Rolling) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">Y倾角(俯仰角)，单位°。雷达北为前向，抬头为正，低头为负。</div>
              <div class="sensor-properties">{{ formData.Pitch }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">经度，单位°</div>
              <div class="sensor-properties">{{ formData.Longitude }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">纬度，单位°</div>
              <div class="sensor-properties">{{ formData.Latitude }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">高度，单位m</div>
              <div class="sensor-properties">{{ format(formData.Altitude) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">雷达自身东向速度,向东为正，向西为负,单位m/s</div>
              <div class="sensor-properties">{{ format(formData.EastSpeed) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">雷达自身北向速度,向北为正，向南为负,单位m/s</div>
              <div class="sensor-properties">{{ format(formData.NorthSpeed) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">雷达自身天向速度，向上为正，向下为负,单位m/s</div>
              <div class="sensor-properties">{{ format(formData.UpSpeed) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">真实方位角，相对于大地坐标系，单位°</div>
              <div class="sensor-properties">{{ format(formData.EarthAzimuth) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">真实俯仰角，相对于大地坐标系，单位°</div>
              <div class="sensor-properties">{{ format(formData.EarthPitch) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">卫导前天线卫星数量</div>
              <div class="sensor-properties">{{ formData.FrontAntanaNum }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">卫导后天线卫星数量</div>
              <div class="sensor-properties">{{ formData.BackAntanaNum }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">卫导前后天线之间的距离,单位m</div>
              <div class="sensor-properties">{{ format(formData.BaseLine) }}</div>
            </div>
          </fieldset>
          <fieldset>
            <legend>激光器</legend>
            <div class="item">
              <div class="whitespace-nowrap">激光器种子状态</div>
              <div class="sensor-properties">{{ formData.LaserStatus }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器状态</div>
              <div class="sensor-properties">{{ formData.AmpStatus }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器外壳温度，单位℃</div>
              <div class="sensor-properties">{{ format(formData.LaserBoxTemp) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器泵浦电流，单位mA</div>
              <div class="sensor-properties">{{ format(formData.LaserCurrent) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器1级泵浦温度，单位℃</div>
              <div class="sensor-properties">{{ format(formData.LaserCH1Temp) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器PD功率，单位mW</div>
              <div class="sensor-properties">{{ format(formData.LaserPDPower) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器CH2功率，单位mW</div>
              <div class="sensor-properties">{{ format(formData.LaserCH2Power) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器CH1功率(输出功率)，单位mW</div>
              <div class="sensor-properties">{{ format(formData.LaserOutPower) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器外壳温度，单位℃</div>
              <div class="sensor-properties">{{ format(formData.AmpBoxTemp) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器泵浦温度，单位℃</div>
              <div class="sensor-properties">{{ format(formData.AmpTemp) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器泵浦电流，单位mA</div>
              <div class="sensor-properties">{{ format(formData.AmpCurrent) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器输入功率，单位mW</div>
              <div class="sensor-properties">{{ format(formData.AmpInPower) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器PD功率，单位mW</div>
              <div class="sensor-properties">{{ format(formData.AmpPDPower) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器CH2功率，单位mW</div>
              <div class="sensor-properties">{{ format(formData.AmpCH2Power) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光放大器CH1功率(输出功率)，单位mW</div>
              <div class="sensor-properties">{{ format(formData.AmpOutPower) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器输入脉冲频率，单位Hz ，仅法国激光器</div>
              <div class="sensor-properties">{{ formData.FPRF }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">激光器告警代码 ，仅法国激光器</div>
              <div class="sensor-properties">{{ formData.AlarmCode }}</div>
            </div>
          </fieldset>
          <fieldset>
            <legend>六要素</legend>
            <div class="item">
              <div class="whitespace-nowrap">环境温度，单位℃</div>
              <div class="sensor-properties">{{ format(formData.Temperature) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">湿度，单位%</div>
              <div class="sensor-properties">{{ format(formData.Humidity) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">气压，单位hPa</div>
              <div class="sensor-properties">{{ format(formData.Pressure) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">降雨强度，单位mm/min</div>
              <div class="sensor-properties">{{ format(formData.RainSpeed) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">降雨量，单位mm</div>
              <div class="sensor-properties">{{ format(formData.RainLevel) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">风速，单位m/s</div>
              <div class="sensor-properties">{{ format(formData.LandWindSpeed) }}</div>
            </div>
            <div class="item">
              <div class="whitespace-nowrap">风向，单位°</div>
              <div class="sensor-properties">{{ format(formData.LandWindDir) }}</div>
            </div>
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
<style lang="scss" scoped>
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
  .sensor-properties{
    box-sizing: border-box;
    display: flex;
    justify-content: start;
    align-items:center;
    padding:4px;
    border:1px solid gray;
    width:100%;
    height: 100%;
    border-radius:4px;
    color:white;
  }
  fieldset{
    border:1px solid gray;
    div{
      color:#bbb;
    }
  }
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
  item{
    width:100%;
    display: flex;
    height: 40px;
    align-items: center;
    padding:4px;
    box-sizing: border-box;
  }
}
</style>