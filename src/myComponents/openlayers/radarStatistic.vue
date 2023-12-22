<template>
  <div
    class="radarStatistic absolute left-0 top-0 w-240px box-border bg-blue-9 dark:bg-gray-8"
    style="background-color: transparent; overflow: auto; max-height: 100%"
  >
    <div class="item">
      <collapse-card
        v-for="item of setting.checks"
        :title="item.name"
        v-model:show="item.show"
        v-model:select="item.select"
        :show-select="item.showSelect"
        :show-collapse="item.showCollapse"
        :before-change="beforeChange"
        :val="item.val"
        :show-val="item.showVal"
      >
        <div v-for="v of item.children" class="subitem">
          <span>{{ v.name }}</span>
          <span>{{ v.val }}</span>
        </div>
      </collapse-card>
    </div>
    <div class="item">
      <collapse-card title="雷达设备" v-model:show="show2" :show-collapse="false">
        <template v-for="(v, k) in setting.factor">
          <div v-if="v.visible" class="subitem">
            <span>{{ v.toolTips }}</span>
            <el-switch
              v-model="v.val"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
              size="small"
            />
          </div>
        </template>
        <div class="subitem">
          <span>风杆</span>
          <el-switch
            v-model="setting.feather"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
      </collapse-card>
    </div>
    <div class="item">
      <collapse-card
        title="图层管理"
        v-model:show="showMapSetting"
        :show-collapse="false"
      >
        <div class="subitem">
          <span>地图</span>
          <el-switch
            v-model="setting.loadmap"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
        <!-- <div class="subitem">
          <span>经纬格</span>
          <el-switch
            v-model="setting.graticule"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div> -->
        <div class="subitem">
          <span>行政区划</span>
          <el-switch
            v-model="setting.district"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
        <div class="subitem">
          <span>站点</span>
          <el-switch
            v-model="setting.station"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
        <!-- <div class="subitem">
          <span>重新定位</span>
          <el-icon
            @click="resetLocation"
            style="min-width: 40px; height: 32px; cursor: pointer"
          >
            <Location></Location>
          </el-icon>
        </div> -->
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
  toRef,
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
const show2 = ref(true);
const showMapSetting = ref(true);
const resetLocation = () => {
  console.log("resetLocation");
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
      const { data } = res.data;
      let _jc, _ts, _3d;
      _jc = data.radar_count.radar_count_jc;
      _ts = data.radar_count.radar_count_ts;
      _3d = data.radar_count.radar_count_3d;
      setting.checks[0].children[0].val = _jc;
      setting.checks[0].children[1].val = _ts;
      setting.checks[0].children[2].val = _3d;
      setting.checks[0].val = _jc + _ts + _3d;

      _jc = data.online_radar_count.online_radar_count_jc;
      _ts = data.online_radar_count.online_radar_count_ts;
      _3d = data.online_radar_count.online_radar_count_3d;
      setting.checks[1].children[0].val = data.online_radar_count.online_radar_count_jc;
      setting.checks[1].children[1].val = data.online_radar_count.online_radar_count_ts;
      setting.checks[1].children[2].val = data.online_radar_count.online_radar_count_3d;
      setting.checks[1].val = _jc + _ts + _3d;

      _jc = data.offline_radar_count.offline_radar_count_jc;
      _ts = data.offline_radar_count.offline_radar_count_ts;
      _3d = data.offline_radar_count.offline_radar_count_3d;
      setting.checks[2].children[0].val = data.offline_radar_count.offline_radar_count_jc;
      setting.checks[2].children[1].val = data.offline_radar_count.offline_radar_count_ts;
      setting.checks[2].children[2].val = data.offline_radar_count.offline_radar_count_3d;
      setting.checks[2].val = _jc + _ts + _3d;

      _jc = data.new_radar_count.new_radar_count_jc;
      _ts = data.new_radar_count.new_radar_count_ts;
      _3d = data.new_radar_count.new_radar_count_3d;
      setting.checks[3].children[0].val = data.new_radar_count.new_radar_count_jc;
      setting.checks[3].children[1].val = data.new_radar_count.new_radar_count_ts;
      setting.checks[3].children[2].val = data.new_radar_count.new_radar_count_3d;
      setting.checks[3].val = _jc + _ts + _3d;
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

    & > div:not(:first-child) {
      border-top: 1px solid rgb(243, 244, 246);
    }
    .collapse-card {
      margin-left: 10px;
    }
    .subitem {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:first-of-type {
        border-top: 1px solid rgb(243, 244, 246);
      }
      &:not(:last-child) {
        border-bottom: 1px solid rgb(243, 244, 246);
      }
    }
  }
  &::-webkit-scrollbar {
    width: 0;
  }
}
.dark .radarStatistic {
  .item {
    background: #304156;
    & > div:not(:first-child) {
      border-top: 1px solid rgba(0, 0, 0, 0.27);
    }
    .subitem {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:first-of-type {
        border-top: 1px solid #00000044;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #00000044;
      }
    }
  }
}
</style>
