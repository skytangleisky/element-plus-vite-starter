<template>
  <div
    class="radarStatistic absolute left-0 top-0 w-240px box-border bg-blue-9 dark:bg-gray-8"
    style="background-color: transparent; overflow: auto; max-height: 100%"
  >
    <!-- <div class="item">
      <collapse-card
        v-for="item of setting.风雷达组网地图相关.checks"
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
    </div> -->
    <div class="item">
      <collapse-card title="雷达设备" v-model:show="show2" :show-collapse="false">
        <template v-for="(v, k) in setting.风雷达组网地图相关.factor">
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
      </collapse-card>
    </div>
    <div class="item">
      <collapse-card title="DBS" v-model:show="showDBS" :show-collapse="false">
        <div class="subitem">
          <span class="whitespace-nowrap">相对高度</span>
          <el-select
            style="width: 100px"
            v-model="setting.风雷达组网地图相关.relativeHeight"
            placeholder=""
            size="small"
          >
            <el-option
              v-for="item in heightOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </div>
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
        <div class="subitem">
          <span>高度</span>
          <el-switch
            v-model="setting.风雷达组网地图相关.高度"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
        <div class="subitem">
          <span>风向</span>
          <el-switch
            v-model="setting.风雷达组网地图相关.风向"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
        <div class="subitem">
          <span>风速</span>
          <el-switch
            v-model="setting.风雷达组网地图相关.速度"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
        <div class="subitem">
          <span>垂直气流</span>
          <el-switch
            v-model="setting.风雷达组网地图相关.垂直气流"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            size="small"
          />
        </div>
      </collapse-card>
    </div>
    <div class="item">
      <collapse-card title="PPI" v-model:show="showPPI" :show-collapse="false">
        <div class="subitem">
          <span class="whitespace-nowrap">风场不透明度</span>
          <el-slider
            class="m-l-10px m-r-10px"
            :min="0"
            :max="1.0"
            :step="0.01"
            :show-tooltip="false"
            v-model="setting.风雷达组网地图相关.ppiOpacity"
          />
        </div>
        <div class="subitem">
          <span class="whitespace-nowrap">风场数据</span>
          <el-select
            style="width: 100px"
            v-model="setting.风雷达组网地图相关.风场数据"
            placeholder=""
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </div>
        <div class="subitem">
          <span class="whitespace-nowrap">反演风场</span>
          <el-select
            style="width: 100px"
            v-model="setting.风雷达组网地图相关.反演风场"
            placeholder=""
            size="small"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
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
          <span class="whitespace-nowrap">地图不透明度</span>
          <el-slider
            class="m-l-10px m-r-10px"
            :min="0"
            :max="1.0"
            :step="0.01"
            :show-tooltip="false"
            v-model="setting.风雷达组网地图相关.mapOpacity"
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
        <div class="subitem">
          <span>默认位置</span>
          <el-icon
            @click="resetLocation"
            style="min-width: 30px; height: 32px; cursor: pointer"
          >
            <HomeFilled></HomeFilled>
          </el-icon>
        </div>
      </collapse-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref, onMounted, onBeforeUnmount, h, reactive } from "vue";
import { Check, Close, HomeFilled } from "@element-plus/icons-vue";
import { 雷达统计接口 } from "~/api/光恒/station";
import collapseCard from "./collapseCard.vue";
import { useSettingStore } from "~/stores/setting";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { eventbus } from "~/eventbus";
const options = reactive([
  { value: "无", label: "无" },
  { value: "径向速度", label: "径向速度" },
  { value: "谱宽", label: "谱宽" },
  { value: "信噪比", label: "信噪比" },
  { value: "频谱强度", label: "频谱强度" },
]);
const options2 = reactive([
  { value: "无", label: "无" },
  { value: "风羽", label: "风羽" },
  { value: "风矢", label: "风矢" },
]);
const heightOptions = reactive<Array<any>>([]);
for (let i = 1976; i >= 52; i -= 26) {
  heightOptions.push({ value: i, label: i + "米" });
}
const route = useRoute();
const setting = useSettingStore();
const show2 = ref(true);
const showPPI = ref(true);
const showDBS = ref(true);
const showMapSetting = ref(true);
const resetLocation = () => {
  setting.$resetFields("风雷达组网地图相关.center");
  setting.$resetFields("风雷达组网地图相关.zoom");
  eventbus.emit("将站点移动到屏幕中心", {
    longitude: setting.风雷达组网地图相关.center[0],
    latitude: setting.风雷达组网地图相关.center[1],
    zoom: setting.风雷达组网地图相关.zoom,
  });
};
const beforeChange = () => {
  for (let k in setting.风雷达组网地图相关.checks) {
    setting.风雷达组网地图相关.checks[k].select = false;
  }
  return true;
};
let timer: any;
const update = () => {
  雷达统计接口({ user_id: route.query.user_id })
    .then((res) => {
      const { data } = res.data;
      let _jc, _ts, _3d, _linux_jc, _linux_ts, _linux_3d;
      _jc = data.radar_count.radar_count_jc;
      _ts = data.radar_count.radar_count_ts;
      _3d = data.radar_count.radar_count_3d;
      _linux_jc = data.radar_count.radar_count_linux_jc;
      _linux_ts = data.radar_count.radar_count_linux_ts;
      _linux_3d = data.radar_count.radar_count_linux_3d;
      setting.风雷达组网地图相关.checks[0].children[0].val = _jc;
      setting.风雷达组网地图相关.checks[0].children[1].val = _ts;
      setting.风雷达组网地图相关.checks[0].children[2].val = _3d;
      setting.风雷达组网地图相关.checks[0].children[3].val = _linux_jc;
      setting.风雷达组网地图相关.checks[0].children[4].val = _linux_ts;
      setting.风雷达组网地图相关.checks[0].children[5].val = _linux_3d;
      setting.风雷达组网地图相关.checks[0].val =
        _jc + _ts + _3d + _linux_jc + _linux_ts + _linux_3d;

      _jc = data.online_radar_count.online_radar_count_jc;
      _ts = data.online_radar_count.online_radar_count_ts;
      _3d = data.online_radar_count.online_radar_count_3d;
      _linux_jc = data.online_radar_count.online_radar_count_linux_jc;
      _linux_ts = data.online_radar_count.online_radar_count_linux_ts;
      _linux_3d = data.online_radar_count.online_radar_count_linux_3d;
      setting.风雷达组网地图相关.checks[1].children[0].val =
        data.online_radar_count.online_radar_count_jc;
      setting.风雷达组网地图相关.checks[1].children[1].val =
        data.online_radar_count.online_radar_count_ts;
      setting.风雷达组网地图相关.checks[1].children[2].val =
        data.online_radar_count.online_radar_count_3d;
      setting.风雷达组网地图相关.checks[1].children[3].val =
        data.online_radar_count.online_radar_count_linux_jc;
      setting.风雷达组网地图相关.checks[1].children[4].val =
        data.online_radar_count.online_radar_count_linux_ts;
      setting.风雷达组网地图相关.checks[1].children[5].val =
        data.online_radar_count.online_radar_count_linux_3d;
      setting.风雷达组网地图相关.checks[1].val =
        _jc + _ts + _3d + _linux_jc + _linux_ts + _linux_3d;

      _jc = data.offline_radar_count.offline_radar_count_jc;
      _ts = data.offline_radar_count.offline_radar_count_ts;
      _3d = data.offline_radar_count.offline_radar_count_3d;
      _linux_jc = data.offline_radar_count.offline_radar_count_linux_jc;
      _linux_ts = data.offline_radar_count.offline_radar_count_linux_ts;
      _linux_3d = data.offline_radar_count.offline_radar_count_linux_3d;
      setting.风雷达组网地图相关.checks[2].children[0].val =
        data.offline_radar_count.offline_radar_count_jc;
      setting.风雷达组网地图相关.checks[2].children[1].val =
        data.offline_radar_count.offline_radar_count_ts;
      setting.风雷达组网地图相关.checks[2].children[2].val =
        data.offline_radar_count.offline_radar_count_3d;
      setting.风雷达组网地图相关.checks[2].children[3].val =
        data.offline_radar_count.offline_radar_count_linux_jc;
      setting.风雷达组网地图相关.checks[2].children[4].val =
        data.offline_radar_count.offline_radar_count_linux_ts;
      setting.风雷达组网地图相关.checks[2].children[5].val =
        data.offline_radar_count.offline_radar_count_linux_3d;
      setting.风雷达组网地图相关.checks[2].val =
        _jc + _ts + _3d + _linux_jc + _linux_ts + _linux_3d;

      _jc = data.new_radar_count.new_radar_count_jc;
      _ts = data.new_radar_count.new_radar_count_ts;
      _3d = data.new_radar_count.new_radar_count_3d;
      _linux_jc = data.new_radar_count.new_radar_count_linux_jc;
      _linux_ts = data.new_radar_count.new_radar_count_linux_ts;
      _linux_3d = data.new_radar_count.new_radar_count_linux_3d;
      setting.风雷达组网地图相关.checks[3].children[0].val =
        data.new_radar_count.new_radar_count_jc;
      setting.风雷达组网地图相关.checks[3].children[1].val =
        data.new_radar_count.new_radar_count_ts;
      setting.风雷达组网地图相关.checks[3].children[2].val =
        data.new_radar_count.new_radar_count_3d;
      setting.风雷达组网地图相关.checks[3].children[3].val =
        data.new_radar_count.new_radar_count_linux_jc;
      setting.风雷达组网地图相关.checks[3].children[4].val =
        data.new_radar_count.new_radar_count_linux_ts;
      setting.风雷达组网地图相关.checks[3].children[5].val =
        data.new_radar_count.new_radar_count_linux_3d;
      setting.风雷达组网地图相关.checks[3].val =
        _jc + _ts + _3d + _linux_jc + _linux_ts + _linux_3d;
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
  timer = setInterval(update, 3 * 60 * 1000);
  update();
});
onBeforeUnmount(() => {
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
