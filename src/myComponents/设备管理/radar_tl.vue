<template>
  <div class="main-container">
    <el-table :data="radars" style="width: 100%" stripe>
      <el-table-column prop="city" label="市" width="180" />
      <el-table-column prop="district" label="区县" width="180" />
      <el-table-column prop="no" label="编号" />
      <el-table-column prop="device_name" label="设备名称">
        <template #default="{row}">
          <div class="color-cyan-7 dark:color-cyan-3">
            {{row.device_name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="device_type" label="设备类型" />
      <el-table-column prop="device_model" label="设备型号" />
      <el-table-column prop="manufacturer_short" label="厂商简称" />
      <el-table-column prop="status" label="设备状态">
        <template #default="{row}">
          <el-tag :type="row.status==1?'success':'danger'">{{row.status==1?'在线':'离线'}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next,jumper"
      :total="paginationOption.total"
      :page-size="paginationOption.pageSize"
      v-model:current-page="paginationOption.currentPage"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref,reactive,watch } from "vue";
import { exec } from "~/api/index.js";
import { databaseRaw2 } from "~/api/重庆";
const paginationOption = reactive({
  pageSize:100,
  currentPage:1,
  total:0,
})
const radars = ref<Radar[]>([])
type Radar = {
  "id": number,
  "uuid": string|null,
  "province": string,
  "city": string,
  "district": string,
  "adcode": string,
  "no": string,
  "device_no": null|string,
  "device_name": string,
  "device_short_name": string,
  "device_type": string,
  "device_model": string,
  "address": string,
  "manufacturer": string,
  "manufacturer_short": string,
  "lng": string,
  "lat": string,
  "altitude": string,
  "height": null|string,
  "data_path": null|string,
  "color": null|string,
  "speed": null|string,
  "hide": null|string,
  "orientation": null|string,
  "data_overtime": number,
  "status": number,
  "createtime": string,
  "updatetime": string
}
watch(paginationOption,()=>{
  exec({
    database:databaseRaw2,
    query:{
      sqls:[
        `select count(*) count from (select * from \`device\`) tmp`,
        `select * from \`device\` limit ${(paginationOption.currentPage-1)*paginationOption.pageSize},${paginationOption.pageSize}`
      ]
    }
  }).then((res)=>{
    paginationOption.total = res.data[0][0].count
    radars.value = res.data[1]
  })
},{immediate:true})
</script>
<style lang="scss" scoped>
  .main-container {
    position: absolute;
    inset: 0;
    overflow: auto;
  }
</style>