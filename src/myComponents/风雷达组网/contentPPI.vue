<template>
  <div class="h-full flex flex-col">
    <div class="w-full box-border relative flex" style="height: 100%">
      <div class="p-10px h-full box-border flex flex-col">
        <div class="title dark:bg-#252948 bg-white">{{ station.currentStation.device_name }}({{ station.active }})</div>
        <el-tabs type="border-card" class="myTabs dark:bg-#252948" v-model="tabsData" style="border-radius:10px;overflow: hidden;">
          <el-tab-pane label="DBS" name="DBS">
            <DataList v-model:radar_time="radar_time_DBS" type="DBS" @handleNodeClick="handleNodeClick_DBS"></DataList>
          </el-tab-pane>
          <el-tab-pane label="PPI" name="PPI">
            <DataList v-model:radar_time="radar_time" type="PPI" @handleNodeClick="handleNodeClick_PPI"></DataList>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="w-full p-10px">
        <div
          v-show="tabsData=='PPI'"
          class="bg-white dark:bg-#252948 box-border h-full w-full b-1px b-solid b-gray relative overflow-clip"
          style="border-radius: 10px"
        >
          <radar
            :radar_time="radar_time"
            :device="station.active"
            type="ppi"
            :PPIval="value1"
            :isDark="isDark"
          />
          <div class="flex w-full flex-row items-center justify-left p-10px box-border absolute left-0 top-0">
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
          class="bg-white dark:bg-#252948 box-border h-full w-full b-1px b-solid b-gray relative overflow-clip flex flex-col"
          style="border-radius: 10px"
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
  border:1px solid var(--ep-border-color);
  margin-bottom:10px;
}
.myTabs{
  display: flex;
  flex-direction: column;
  flex:1;
  ::v-deep(.ep-tabs__content){
    width: 240px;
    padding:0;
    overflow: auto;
    flex:1;
    box-sizing: border-box;
    ::v-deep(.ep-tab-pane){
      height: 100%;
    }
  }
}

.dark .myTabs.ep-tabs--border-card > .ep-tabs__header .ep-tabs__item.is-active{
  background:#252948;
}
</style>