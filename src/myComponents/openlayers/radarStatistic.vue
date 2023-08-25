<template>
  <div class="absolute left-0 top-0 h-full w-300px z-1 box-border bg-blue-9 dark:bg-gray-8" style="background-color: overflow: auto;">
    <div class="p-r-10px bg-white dark:bg-black" style="border-radius:8px;margin: 8px 10px;">
      <collapse-card title="雷达" v-model:show="show">
        <div v-for="(v,k) in checks" class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>{{ v.name }}</span>
          <span>{{ v.val }}</span>
          <el-switch :before-change="beforeChange" v-model="v.select" inline-prompt :active-icon="Check" :inactive-icon="Close"/>
        </div>
      </collapse-card>
    </div>
    <div class="p-r-10px bg-white dark:bg-black" style="border-radius:8px;margin: 8px 10px;">
      <collapse-card title="雷达" v-model:show="show3">
        <div v-for="(v,k) in checks" class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>{{ v.name }}</span>
          <span>{{ v.val }}</span>
          <el-switch :before-change="beforeChange" v-model="v.select" inline-prompt :active-icon="Check" :inactive-icon="Close"/>
        </div>
      </collapse-card>
    </div>
    <div class="p-r-10px bg-white dark:bg-black" style="border-radius:8px;margin: 8px 10px;">
      <collapse-card title="风" v-model:show="show2">
        <div class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>地面观测</span>
          <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close"/>
        </div>
        <div class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>组合风场</span>
          <div>
            <el-select v-model="value" placeholder="Select" size="small" style="width:100px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close"/>
          </div>
        </div>
        <div class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>天气雷达反演风场</span>
          <div>
            <el-select v-model="value" placeholder="Select" size="small" style="width:100px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close"/>
          </div>
        </div>
        <div class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>融合风场</span>
          <div>
            <el-select v-model="value" placeholder="Select" size="small" style="width:100px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close"/>
          </div>
        </div>
        <div class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>风流场</span>
          <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close"/>
        </div>
        <div class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px">
          <span>高空风流场</span>
          <div>
            <el-select v-model="value" placeholder="Select" size="small" style="width:100px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close"/>
          </div>
        </div>
      </collapse-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {ref,onMounted,onBeforeUnmount} from 'vue'
  import { Check, Close } from '@element-plus/icons-vue'
  import {雷达统计接口} from '~/api/光恒/station'
  import collapseCard from './collapseCard.vue'
  const show=ref(true)
  const show2=ref(true)
  const show3=ref(true)
  const beforeChange=()=>{
    for(let k in checks.value){
      checks.value[k].select=false;
    }
    return true
  }
  const checks=ref([
    {name:'雷达总数',val:'',select:true},
    {name:'在线雷达',val:'',select:false},
    {name:'离线雷达',val:'',select:false},
    {name:'新增雷达',val:'',select:false},
  ])
  let timer:any
  const update = () => {
    雷达统计接口().then(res=>{
      const data = res.data.data
      checks.value[0].val = data.radar_count
      checks.value[1].val = data.online_radar_count
      checks.value[2].val = data.offline_radar_count
      checks.value[3].val = data.new_radar_count
    })
  }
  onMounted(()=>{
    timer = setInterval(update,5000)
    update()
  })
  onBeforeUnmount(()=>{
    clearInterval(timer)
  })


  const value = ref('900hPa')
  const options = [
    {
      value: '900hPa',
      label: '900hPa',
    },
    {
      value: '1000hPa',
      label: '1000hPa',
    },
  ]
</script>
<style lang="scss">
  .radar_item{
    box-shadow: 0 0 10px 10px #00000011;
    border-color: #00000011;
    &:active{
      box-shadow: 0 0 10px 10px #00ff0022;
      border-color: #00ff0022;
    }
  }
</style>