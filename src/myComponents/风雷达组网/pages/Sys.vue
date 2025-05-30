<template>
  <div class="group">
    <el-progress type="dashboard" :percentage="sys.cpu_percent" class="cpu-usage" :stroke-width="20" :width="150" :color="colors">
      <template #default="{ percentage }">
        <div class="flex flex-col">
          <span class="value">{{ percentage }}%</span>
          <span class="label">处理器</span>
        </div>
      </template>
    </el-progress>
    <el-progress type="dashboard" :percentage="sys.memory.percent" class="mem-usage" :stroke-width="20" :width="200" :color="colors">
      <template #default="{ percentage }">
        <div class="flex flex-col">
          <span class="value">{{ percentage }}%</span>
          <span class="label">{{ sys.memory.used }}G/{{ sys.memory.total }}G</span>
        </div>
      </template>
    </el-progress>
    <el-progress type="dashboard" :percentage="sys.disk.percent" class="disk-usage" :stroke-width="20" :width="150" :color="colors">
      <template #default="{ percentage }">
        <div class="flex flex-col">
          <span class="value">{{ percentage }}%</span>
          <span class="label">{{ sys.disk.used }}G/{{ sys.disk.total }}G</span>
        </div>
      </template>
    </el-progress>
  </div>
</template>
<script lang="ts" setup>
import {getCPU,getMEM,getDisk} from '~/api/重庆'
import {reactive,onMounted} from 'vue'
const colors = [
  { color: '#f56c6c', percentage: 100 },
  { color: '#e6a23c', percentage: 80 },
  { color: '#6f7ad3', percentage: 60 },
  { color: '#1989fa', percentage: 40 },
  { color: '#5cb87a', percentage: 20 },
]
const sys = reactive({
  cpu_percent:0,
  memory:{
    total:0,
    used:0,
    percent:0
  },
  disk:{
    total:0,
    used:0,
    percent:0
  }
})
onMounted(()=>{
  getCPU().then((res)=>{
    sys.cpu_percent = res.data.data.cpu_percent
  })
  getMEM().then((res)=>{
    sys.memory = {
      total:res.data.data.memory_total,
      used:res.data.data.memory_used,
      percent:res.data.data.memory_percent
    }
  })
  getDisk().then((res)=>{
    sys.disk = {
      total:res.data.data.disk_total,
      used:res.data.data.disk_used,
      percent:res.data.data.disk_percent
    }
  })  
})
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.group{
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: end;
  .cpu-usage,.mem-usage,.disk-usage {
    --el-fill-color-light:#ddd;
    color:white;
  }
  .cpu-usage{
    .value{
      padding:4px;
      font-size: 1.5rem;
    }
    .label{
      font-size: 20px;
      padding:4px;
    }
  }
  .mem-usage{
    .value{
      padding:4px;
      font-size: 40px;
    }
    .label{
      font-size: 25px;
      padding:4px;
    }
  }
  .disk-usage{
    .value{
      padding:4px;
      font-size: 1.5rem;
    }
    .label{
      font-size: 12px;
      padding:4px;
    }
  }
}
</style>