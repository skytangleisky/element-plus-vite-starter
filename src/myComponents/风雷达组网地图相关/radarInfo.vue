<template>
  <div class="radarInfo map-module-box">
    <div class="map-module-top">
      <span>雷达基础信息 <span v-show="deviceInfo.device_name"  >
          - {{ deviceInfo.device_name }}
        </span></span>
      <span @click="showTags = !showTags" class="map-module-top-icon">
                <el-icon v-show="showTags"><ArrowUp/></el-icon>
                <el-icon v-show="!showTags"><ArrowDown/></el-icon>
            </span>
    </div>
    <div class="map-module-bottom" v-show="showTags">
      <el-empty description="暂无数据" v-if="!deviceInfo.radar_id" :image-size="64"/>
<!--      <el-scrollbar max-height="480px" >-->
      <div class="content" v-else>
        <el-collapse v-model="collapseActNames" accordion @change="collapseChange">
          <el-collapse-item title="主控板传感器数据" name="1">
            <div class="item-box">
              <div class="item-label">HHMC DIO的状态前12路DI后16路DO</div>
              <div class="item-value">{{ sensorData.MCDIO }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">控制板MCU温度</div>
              <div class="item-value">{{ format(sensorData.MCBoardTemp) }} <span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">雷达内部湿度</div>
              <div class="item-value">{{ format(sensorData.MCInnerHumidity) }}<span class="item-unit">%</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">雷达内部温度1</div>
              <div class="item-value">{{ format(sensorData.MCInnerTemp1) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">雷达内部温度2</div>
              <div class="item-value">{{ format(sensorData.MCInnerTemp2) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">主控板测量的外部湿度</div>
              <div class="item-value">{{ format(sensorData.MCOuterHumidity) }}<span class="item-unit">%</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">主控板测量的外部温度</div>
              <div class="item-value">{{ format(sensorData.MCOuterTemp) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">主控板测量的外部气压</div>
              <div class="item-value">{{ format(sensorData.MCOuterAirPressure) }}<span class="item-unit">hPa</span></div>
            </div>
            <div class="item-box">
<!--              正值表示外部压力大-->
              <div class="item-label">主控板测量的外内压差</div>
              <div class="item-value">{{ format(sensorData.MCOuterRelPressure) }}<span class="item-unit">hPa</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">计数10ms</div>
              <div class="item-value">{{ sensorData.MCCount }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="电压电流" name="2">
            <div class="item-box">
              <div class="item-label">系统电压</div>
              <div class="item-value">{{ format(sensorData.SysVoltage) }}<span class="item-unit">V</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">系统电流</div>
              <div class="item-value">{{ format(sensorData.SysCurrent) }}<span class="item-unit">A</span></div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="六要素" name="3">
            <div class="item-box">
              <div class="item-label">环境温度</div>
              <div class="item-value">{{ format(sensorData.Temperature) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">湿度</div>
              <div class="item-value">{{ format(sensorData.Humidity) }}<span class="item-unit">%</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">气压</div>
              <div class="item-value">{{ format(sensorData.Pressure) }}<span class="item-unit">hPa</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">降雨强度</div>
              <div class="item-value">{{ format(sensorData.RainSpeed) }}<span class="item-unit">mm/min</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">降雨量</div>
              <div class="item-value">{{ format(sensorData.RainLevel) }}<span class="item-unit">mm</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">风速</div>
              <div class="item-value">{{ format(sensorData.LandWindSpeed) }}<span class="item-unit">m/s</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">风向</div>
              <div class="item-value">{{ format(sensorData.LandWindDir) }}<span class="item-unit">°</span></div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="伺服" name="4">
            <div class="item-box">
              <div class="item-label">伺服状态</div>
              <div class="item-value">{{ sensorData.ServorStatus }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">伺服设定方位角，相对于雷达自身坐标系</div>
              <div class="item-value">{{ format(sensorData.Azimuth) }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">伺服设定俯仰角，相对于雷达自身坐标系</div>
              <div class="item-value">{{ format(sensorData.Pitch) }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">伺服方位角运行状态</div>
              <div class="item-value">{{ format(sensorData.AzimuthStatus) }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">伺服俯仰角运行状态</div>
              <div class="item-value">{{ format(sensorData.PitchStatus) }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="UPS" name="5">
            <div class="item-box">
              <div class="item-label">UPS状态</div>
              <div class="item-value">{{ sensorData.UPSStatus }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">UPS输入电压</div>
              <div class="item-value">{{ format(sensorData.UPSVin) }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">UPS输出电压</div>
              <div class="item-value">{{ format(sensorData.UPSVout) }}</div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="GPS" name="6">
            <div class="item-box">
              <div class="item-label">GPS状态</div>
              <div class="item-value">{{ sensorData.GPSStatus }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">GPS数据有效性</div>
              <div class="item-value">{{ sensorData.GPSDataValid }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">GPS系统状态</div>
              <div class="item-value">{{ sensorData.GPSSystemStatus }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">偏北方向</div>
              <div class="item-value">{{ format(sensorData.NorthOffset) }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">X倾角（横滚角）雷达北为前向，右滚为正，左滚为负。</div>
              <div class="item-value">{{ format(sensorData.Rolling) }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">Y倾角(俯仰角)雷达北为前向，抬头为正，低头为负。</div>
              <div class="item-value">{{ sensorData.Pitch }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">经度</div>
              <div class="item-value">{{ sensorData.Longitude }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">纬度</div>
              <div class="item-value">{{ sensorData.Latitude }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">高度</div>
              <div class="item-value">{{ format(sensorData.Altitude) }}<span class="item-unit">m</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">雷达自身东向速度,向东为正，向西为负</div>
              <div class="item-value">{{ format(sensorData.EastSpeed) }}<span class="item-unit">m/s</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">雷达自身北向速度,向北为正，向南为负</div>
              <div class="item-value">{{ format(sensorData.NorthSpeed) }}<span class="item-unit">m/s</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">雷达自身天向速度，向上为正，向下为负</div>
              <div class="item-value">{{ format(sensorData.UpSpeed) }}<span class="item-unit">m/s</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">真实方位角，相对于大地坐标系</div>
              <div class="item-value">{{ format(sensorData.EarthAzimuth) }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">真实俯仰角，相对于大地坐标系</div>
              <div class="item-value">{{ format(sensorData.EarthPitch) }}<span class="item-unit">°</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">卫导前天线卫星数量</div>
              <div class="item-value">{{ sensorData.FrontAntanaNum }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">卫导后天线卫星数量</div>
              <div class="item-value">{{ sensorData.BackAntanaNum }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">卫导前后天线之间的距离</div>
              <div class="item-value">{{ format(sensorData.BaseLine) }}<span class="item-unit">m</span></div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="激光器" name="7">
            <div class="item-box">
              <div class="item-label">激光器种子状态</div>
              <div class="item-value">{{ sensorData.LaserStatus }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器状态</div>
              <div class="item-value">{{ sensorData.AmpStatus }}</div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器外壳温度</div>
              <div class="item-value">{{ format(sensorData.LaserBoxTemp) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器泵浦电流</div>
              <div class="item-value">{{ format(sensorData.LaserCurrent) }}<span class="item-unit">mA</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器1级泵浦温度</div>
              <div class="item-value">{{ format(sensorData.LaserCH1Temp) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器PD功率</div>
              <div class="item-value">{{ format(sensorData.LaserPDPower) }}<span class="item-unit">mW</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器CH2功率</div>
              <div class="item-value">{{ format(sensorData.LaserCH2Power) }}<span class="item-unit">mW</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器CH1功率(输出功率)</div>
              <div class="item-value">{{ format(sensorData.LaserOutPower) }}<span class="item-unit">mW</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器外壳温度</div>
              <div class="item-value">{{ format(sensorData.AmpBoxTemp) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器泵浦温度</div>
              <div class="item-value">{{ format(sensorData.AmpTemp) }}<span class="item-unit">℃</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器泵浦电流</div>
              <div class="item-value">{{ format(sensorData.AmpCurrent) }}<span class="item-unit">mA</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器输入功率</div>
              <div class="item-value">{{ format(sensorData.AmpInPower) }}<span class="item-unit">mW</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器PD功率</div>
              <div class="item-value">{{ format(sensorData.AmpPDPower) }}<span class="item-unit">mW</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器CH2功率</div>
              <div class="item-value">{{ format(sensorData.AmpCH2Power) }}<span class="item-unit">mW</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光放大器CH1功率(输出功率)</div>
              <div class="item-value">{{ format(sensorData.AmpOutPower) }}<span class="item-unit">mW</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器输入脉冲频率，仅法国激光器</div>
              <div class="item-value">{{ sensorData.FPRF }}<span class="item-unit">Hz</span></div>
            </div>
            <div class="item-box">
              <div class="item-label">激光器告警代码 ，仅法国激光器</div>
              <div class="item-value">{{ sensorData.AlarmCode }}</div>
            </div>
          </el-collapse-item>


        </el-collapse>
      </div>
<!--      </el-scrollbar>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
import {ArrowDown, ArrowUp} from "@element-plus/icons-vue";
import type {CollapseModelValue} from 'element-plus'
import {querySensorData} from "~/api/重庆"
import {useBus} from "~/myComponents/bus";
import {useStationStore} from "~/stores/station";
import {useSettingStore} from "~/stores/setting";

const setting = useSettingStore();
const station = useStationStore();
// 折叠面板展示的数据
let collapseActNames = ref([])
// 控制整个模块折叠显示效果
let showTags = ref(true)
showTags.value = setting.风雷达组网.监控.isFoldSingle
let sensorData = reactive({})
const bus = useBus();
// 雷达信息
const deviceInfo = reactive({
  radar_id: '',
  device_name: '',
  data_time: '',
});

watch(()=>setting.风雷达组网.监控.isFoldSingle,newVal=>{
  // showTags.value =newVal
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
            getSensorData(v.no)
          }

        })
      }
    })
  }
});

/**
 * @author yhl 2025-05-13 13:45:36
 * @description 通过雷达ID获取传感器数据
 * @param radarId-雷达ID
 */

const getSensorData = (radarId: string) => {
  querySensorData(radarId).then(res => {
    sensorData = res.data.results[0]
    // collapseActNames.value=["1"]
  })
}

// 折叠面板选择变化
const collapseChange = (val: CollapseModelValue) => {
  // console.log("collapseChange", val)
}

function format(val: any) {
  if (typeof val == 'number') {
    const decimalIndex = val.toString().indexOf('.');
    if (decimalIndex === -1) {
      return val
    } else if (val.toString().length - decimalIndex > 2) {
      return Number(val).toFixed(2)
    } else {
      return val
    }
  } else {
    return val
  }
}
</script>

<style scoped lang="scss">
.radarInfo {

  .map-module-bottom{
    background: var(--bg-color-overlay-opacity-8);
    border:1px solid #B5D5E5;
    //max-height:256px;
    //overflow-y: auto;
  }
  .content {
    .device-info {
      font-size: 16px;
      border-left: 3px solid var(--ep-color-primary);
      padding-left: 8px;
      margin-bottom: 10px;
      color:var(--ep-color-primary);
    }

    .ep-collapse {
      //border-color: var(--border-color);
      :deep(.ep-collapse-item__header) {
        background-color: var(--ep-color-primary-light-9);
        border-color: var(--border-color);
        height: 32px;
        padding-left: 8px;
      }

      :deep(.ep-collapse-item__wrap) {
        background-color: var(--ep-color-primary-light-9);
        padding:8px 16px;
        border-color: var(--border-color);

      }
      :deep(.ep-collapse-item__content){
        padding-bottom:0;
      }
    }
    .item-box{
      display: flex;
      .item-label{
        margin-right: 8px;
        color:var(--module-title-text-color-secondary);
      }
      .item-value{
        display: flex;
        color: var(--module-title-text-color);
        word-wrap: anywhere;
        max-width: 50%;
      }
    }
  }
}
</style>