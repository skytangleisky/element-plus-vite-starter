<template>
  <div class="flex p-10px">
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
  <chart-fkx style="width: 100%;padding:10px;box-sizing: border-box;flex:1;"></chart-fkx>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{radar_time:string}>(),{radar_time:''})
import { useStationStore } from "~/stores/station";
const station = useStationStore()
let radar_id = station.active
import { eventbus } from "~/eventbus";
import chartFkx from "./fkxV.vue";
import { ref, reactive, onMounted, watch } from "vue";
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
import { getFkxHisData } from "~/api/重庆";
onMounted(() => {
  // fetchDataList(moment().format("YYYYMMDD"));
});
let 风廓线数据: any = [];
watch([value1, check, value2], ([v1, check, v2]) => {
  console.log(v1, check, v2);
  eventbus.emit("处理风廓线数据"+radar_id, 风廓线数据, v1, check, v2);
});
watch(()=>props.radar_time,(newVal)=>{
  getFkxHisData({ radar_id, yearmonthdate:newVal.split('/').slice(-1)[0] }).then((res) => {
    风廓线数据 = res.data.data.file.file_data;
    eventbus.emit("处理风廓线数据"+radar_id, 风廓线数据, value1.value, check.value, value2.value);
  }).catch((error)=>{
    console.log(error)
    eventbus.emit("处理风廓线数据"+radar_id, [], value1.value, check.value, value2.value);
  })
})
</script>