<template>
  <div
    class="radarStatistic absolute left-0 top-0 w-240px box-border bg-blue-9 dark:bg-gray-8"
    style="background-color: transparent; overflow: auto; max-height: 100%"
  >
    <div class="item">
      <collapse-card title="雷达设备" v-model:show="show">
        <div
          v-for="(v, k) in setting.checks"
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
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
      <collapse-card title="机舱雷达" v-model:show="show2">
        <template v-for="(v, k) in setting.factor">
          <div
            v-if="v.visible"
            class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
          >
            <span>{{ v.toolTips }}</span>
            <el-switch
              v-model="v.val"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
            />
          </div>
        </template>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
        >
          <span>风杆</span>
          <el-switch
            v-model="setting.feather"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
      </collapse-card>
    </div>
    <div class="item">
      <collapse-card title="图层管理" v-model:show="showMapSetting">
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
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
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
        >
          <span>经纬格</span>
          <el-switch
            v-model="setting.graticule"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
          />
        </div>
        <div
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
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
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
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
          class="w-full flex justify-between items-center b-0px b-solid b-gray-1 dark:b-#00000044 b-t-1px"
        >
          <span>重新定位</span>
          <el-icon
            @click="resetLocation"
            style="min-width: 40px; height: 32px; cursor: pointer"
          >
            <Location></Location>
          </el-icon>
        </div>
      </collapse-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  watch,
  ref,
  onMounted,
  onBeforeUnmount,
  h,
  onActivated,
  onDeactivated,
} from "vue";
import { Check, Close, Location } from "@element-plus/icons-vue";
import { 雷达统计接口 } from "~/api/光恒/station";
import collapseCard from "./collapseCard.vue";
import { useSettingStore } from "~/stores/setting";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
const route = useRoute();
const setting = useSettingStore();
const show = ref(true);
const show2 = ref(true);
const showMapSetting = ref(true);
const resetLocation = () => {
  setting.$resetFields(["openlayers"]);
};
const beforeChange = () => {
  for (let k in setting.checks) {
    setting.checks[k].select = false;
  }
  return true;
};
let timer: any;
const update = () => {
  雷达统计接口({ user_id: route.query.user_id })
    .then((res) => {
      const data = res.data.data;
      setting.checks[0].val = data.radar_count;
      setting.checks[1].val = data.online_radar_count;
      setting.checks[2].val = data.offline_radar_count;
      setting.checks[3].val = data.new_radar_count;
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
onActivated(() => {
  timer = setInterval(update, 3 * 60 * 1000);
  update();
});
onDeactivated(() => {
  clearInterval(timer);
});
const options = [
  {
    value: 6,
    label: "7层",
  },
  {
    value: 5,
    label: "6层",
  },
  {
    value: 4,
    label: "5层",
  },
  {
    value: 3,
    label: "4层",
  },
  {
    value: 2,
    label: "3层",
  },
  {
    value: 1,
    label: "2层",
  },
  {
    value: 0,
    label: "1层",
  },
];
</script>
<style lang="scss">
.radarStatistic {
  .item {
    border-radius: 8px;
    margin: 8px 10px;
    padding-right: 10px;
    background: #ffffff;
    box-shadow: 0 0 10px 10px #00000011;
    border-color: #00000011;
  }
  &::-webkit-scrollbar {
    width: 0;
  }
}
.dark .radarStatistic {
  .item {
    background: #304156;
  }
}
</style>
