<template>
  <div style="height: 100%;scroll-snap-align: start;scroll-snap-stop: always;position: relative;">
    <div class="absolute flex left-100px top-27px">
      <el-select v-model="value1" placeholder="" style="width: 120px">
        <el-option
          v-for="(v, k) in options1"
          :key="k"
          :label="v.label"
          :value="v.value"
        ></el-option>
      </el-select>
      <el-checkbox
        label="叠加"
        v-model="check"
      ></el-checkbox>
      <el-select v-model="value2" placeholder="" style="width: 120px">
        <el-option
          v-for="(v, k) in options2"
          :key="k"
          :label="v.label"
          :value="v.value"
        ></el-option>
      </el-select>
    </div>
    <chart-fkx class="w-full p-10px box-border" style="height: 100%;"></chart-fkx>
  </div>
</template>
<script lang="ts" setup>
import { eventbus } from "~/eventbus";
import chartFkx from "./fkxV.vue";
import { ref, reactive, onMounted, watch, onBeforeUnmount } from "vue";
const value1 = ref<"水平风" | "垂直气流">("水平风");
const options1 = reactive([
  { value: "水平风", label: "水平风" },
  { value: "垂直气流", label: "垂直气流" },
]);
const value2 = ref<"风羽" | "风矢">("风羽");
const options2 = reactive([
  { value: "风羽", label: "风羽" },
  { value: "风矢", label: "风矢" },
]);
const check = ref(false);
function process(data:{radar_id:string,风廓线数据:any}){
    风廓线数据 = data.风廓线数据;
    eventbus.emit("重庆地图界面-处理风廓线数据", 风廓线数据, value1.value, check.value, value2.value);
}
onMounted(() => {
  // fetchDataList(moment().format("YYYYMMDD"));
  eventbus.on('处理实时风廓线数据',process)
});
let 风廓线数据: any = [];
watch([value1, check, value2], ([v1, check, v2]) => {
  eventbus.emit("重庆地图界面-处理风廓线数据", 风廓线数据, v1, check, v2);
});
// watch(()=>props.radar_time,(newVal)=>{
//   getFkxHisData({ radar_id:props.radar_id, yearmonthdate:newVal.split('/').slice(-1)[0] }).then((res) => {
//     风廓线数据 = res.data.data.file.file_data;
//     eventbus.emit("处理风廓线数据"+props.radar_id, 风廓线数据, value1.value, check.value, value2.value);
//   }).catch((error)=>{
//     console.log(error)
//     eventbus.emit("处理风廓线数据"+props.radar_id, [], value1.value, check.value, value2.value);
//   })
// })
onBeforeUnmount(()=>{
  eventbus.off('处理实时风廓线数据',process)
})
</script>