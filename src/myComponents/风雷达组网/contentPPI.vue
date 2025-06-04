<template>
  <div style="height: 100%;display: flex;flex-direction: column;">
    <div style="height: 100%;width: 100%;box-sizing: border-box; position: relative;display: flex;">
      <div style="padding:10px;height: 100%;box-sizing: border-box;display: flex;flex-direction: column;">
        <div class="title" style="background: white;">{{ station.currentStation.device_name }}({{ station.active }})</div>
        <el-tabs type="border-card" class="myTabs" v-model="tabsData" style="border-radius:10px;overflow: hidden;background: #252948;">
          <el-tab-pane label="DBS" name="DBS">
            <DataList v-model:radar_time="radar_time_DBS" type="DBS" @handleNodeClick="handleNodeClick_DBS"></DataList>
          </el-tab-pane>
          <el-tab-pane label="PPI" name="PPI">
            <DataList v-model:radar_time="radar_time" type="PPI" @handleNodeClick="handleNodeClick_PPI"></DataList>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div style="width: 100%;padding:10px">
        <div
          v-show="tabsData=='PPI'"
          style="border-radius: 10px;background: white;box-sizing: border-box;height: 100%;width: 100%;border: 1px solid gray;position: relative;overflow: clip;"
        >
          <radar
            :radar_time="radar_time"
            :device="station.active"
            type="ppi"
            :PPIval="value1"
            :isDark="isDark"
          />
          <div style="display: flex;width: 100%;flex-direction: row;align-items: center;justify-content: left;padding:10px;box-sizing: border-box;position: absolute;left:0;top:0;;">
            主显示区:
            <el-select v-model="value1" placeholder="" style="width: 120px">
              <el-option
                v-for="(v, k) in options1"
                :key="k"
                :label="v.label"
                :value="v.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div
          v-show="tabsData=='DBS'"
          style="border-radius: 10px;background-color: white;box-sizing: border-box;width: 100%;height: 100%;border:1px solid gray;position: relative;overflow: clip;display: flex;flex-direction: column;"
        >
        <FKX :radar_time="radar_time_DBS"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import radar from "./雷达.vue";
import { ref, reactive } from "vue";
import DataList from "./dataList.vue";
import FKX from './风廓线.vue'
import { isDark } from "~/theme"
import { useStationStore } from "~/stores/station";
const station = useStationStore()
// let radar_id = location.href.substring(location.href.lastIndexOf('/')+1,location.href.length)
const radar_time = ref('')
const radar_time_DBS = ref('')
const tabsData = ref<'DBS'|'PPI'>('DBS')
const value1 = ref<3 | 4 | 5 | 6>(3);
const options1 = reactive([
  { value: 3, label: "径向速度" },
  { value: 4, label: "谱宽" },
  { value: 5, label: "信噪比" },
  { value: 6, label: "频谱强度" },
]);
function handleNodeClick_PPI(arg:string){
  console.log(arg)
}
function handleNodeClick_DBS(arg:string){
  console.log(arg)
}

</script>
<style lang="scss" scoped>
.title{
  position: relative;
  padding:10px;
  border-radius:10px;
  border:1px solid var(--el-border-color);
  margin-bottom:10px;
}
.myTabs{
  display: flex;
  flex-direction: column;
  flex:1;
  ::v-deep(.el-tabs__content){
    width: 240px;
    padding:0;
    overflow: auto;
    flex:1;
    box-sizing: border-box;
    ::v-deep(.el-tab-pane){
      height: 100%;
    }
  }
}

.dark .myTabs.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active{
  background:#252948;
}
</style>