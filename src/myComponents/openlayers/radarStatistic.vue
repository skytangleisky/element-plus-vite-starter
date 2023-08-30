<template>
  <div
    class="absolute left-0 top-0 h-full w-300px z-1 box-border bg-blue-9 dark:bg-gray-8"
    style="background-color: transparent; overflow: auto"
  >
    <div class="item">
      <collapse-card title="雷达" v-model:show="show">
        <div
          v-for="(v, k) in checks"
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>{{ v.name }}</span>
          <span>{{ v.val }}</span>
          <el-switch
            :before-change="beforeChange"
            v-model="v.select"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
      </collapse-card>
    </div>
    <div class="item">
      <collapse-card title="风" v-model:show="show2">
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>地面观测</span>
          <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close" />
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>组合风场</span>
          <div>
            <el-select
              v-model="value"
              placeholder="Select"
              size="small"
              style="width: 100px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close" />
          </div>
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>天气雷达反演风场</span>
          <div>
            <el-select
              v-model="value"
              placeholder="Select"
              size="small"
              style="width: 100px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close" />
          </div>
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>融合风场</span>
          <div>
            <el-select
              v-model="value"
              placeholder="Select"
              size="small"
              style="width: 100px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close" />
          </div>
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>风流场</span>
          <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close" />
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>高空风流场</span>
          <div>
            <el-select
              v-model="value"
              placeholder="Select"
              size="small"
              style="width: 100px"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-switch inline-prompt :active-icon="Check" :inactive-icon="Close" />
          </div>
        </div>
      </collapse-card>
    </div>
    <div class="item">
      <collapse-card title="地图" v-model:show="showMapSetting">
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>地图</span>
          <el-switch
            v-model="setting.loadmap"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>行政区划</span>
          <el-switch
            v-model="setting.district"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>站点</span>
          <el-switch
            v-model="setting.station"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>风羽</span>
          <el-switch
            v-model="setting.feather"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-gray-9 b-t-1px"
        >
          <span>要素</span>
          <el-switch
            v-model="setting.factor"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
      </collapse-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref, onMounted, onBeforeUnmount, h } from "vue";
import { Check, Close } from "@element-plus/icons-vue";
import { 雷达统计接口 } from "~/api/光恒/station";
import collapseCard from "./collapseCard.vue";
import { useSettingStore } from "~/stores/setting";
import { ElMessage } from "element-plus";
const setting = useSettingStore();
const show = ref(true);
const show2 = ref(true);
const showMapSetting = ref(true);
const beforeChange = () => {
  for (let k in checks.value) {
    checks.value[k].select = false;
  }
  return true;
};
const checks = ref([
  { name: "雷达总数", val: "", select: true },
  { name: "在线雷达", val: "", select: false },
  { name: "离线雷达", val: "", select: false },
  { name: "新增雷达", val: "", select: false },
]);
let timer: any;
const update = () => {
  雷达统计接口()
    .then((res) => {
      const data = res.data.data;
      checks.value[0].val = data.radar_count;
      checks.value[1].val = data.online_radar_count;
      checks.value[2].val = data.offline_radar_count;
      checks.value[3].val = data.new_radar_count;
    })
    .catch((e) => {
      ElMessage({
        message: h("p", null, [
          // h('span', null, 'Message can be '),
          h("i", { style: "color: red" }, e.message),
        ]),
        type: "error",
      });
    });
};
onMounted(() => {
  timer = setInterval(update, 5000);
  update();
});
onBeforeUnmount(() => {
  clearInterval(timer);
});

const value = ref("900hPa");
const options = [
  {
    value: "900hPa",
    label: "900hPa",
  },
  {
    value: "1000hPa",
    label: "1000hPa",
  },
];
</script>
<style lang="scss">
.item {
  border-radius: 8px;
  margin: 8px 10px;
  padding-right: 10px;
  background: #ffffff;
  box-shadow: 0 0 10px 10px #00000011;
  border-color: #00000011;
}
.dark .item {
  background: #000000;
}
</style>
