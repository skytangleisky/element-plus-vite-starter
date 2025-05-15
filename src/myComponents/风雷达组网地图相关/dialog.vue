<template>
  <div class="!collapse dragDialog collapse">
    <div class="dragDialog-top">
      <div class="top-left">
        <div class="top-left-top">
          <div class="item-box">
            <div class="item-label">区划:</div>
            <div class="item-content">
              <el-cascader
                  v-model="selected"
                  collapse-tags
                  :props="cascaderProps"
                  :options="cascaderOptions"
                  :max-collapse-tags="0"
                  :clearable="true"
                  size="small"

                  placeholder="请选择区划"
              >
              </el-cascader>
            </div>
          </div>
          <div class="item-box">
            <div class="item-label">厂商:</div>
            <div class="item-content">
              <el-select v-model="manufacturer" style="width:60px" size="small" class="m-r-5px">
                <el-option v-for="item in manfacturerOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </div>
          </div>

        </div>
        <div class="top-left-bottom">
          <div class="item-box">
            <div class="item-label">条件:</div>
            <div class="item-content">
              <el-input
                  @mousedown.stop
                  name="过滤条件"
                  class="operation_filter"
                  placeholder="请输入过滤条件"
                  size="small"
                  v-model="options.value"
              />
            </div>
          </div>
          <div class="item-box">
            <div class="item-label">状态:</div>
            <div class="item-content">
              <el-select v-model="radar_status" style="width:60px" size="small" class="m-r-5px">
                <el-option v-for="item in radar_statusOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <div class="top-right" @click="showBottom = !showBottom">
        <el-icon v-show="showBottom">
          <ArrowUpBold/>
        </el-icon>
        <el-icon v-show="!showBottom">
          <ArrowDownBold/>
        </el-icon>
      </div>
    </div>
    <div class="contain" @mousedown.stop v-show="showBottom">
      <div
          @scroll="scrolling"
          class="contain-table"
      >
        <table>
          <thead>
          <tr
              class="bg-#409eff"
          >
            <th style="width:20px">序号</th>
            <th>编号</th>
            <th style="width:60px">名称</th>
            <th>海高</th>
            <!-- <th>相对高</th> -->
            <!-- <th>时间</th> -->
            <th>状态</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(v, k) in options.list">
            <tr
                :id="v.no"
                :class="`${station.active == v.no ? 'selected' : ''}`"
                @contextmenu.prevent="contextmenu($event, v)"
                @click="flyTo($event, v)"
            >
              <td>{{ k + 1 }}</td>
              <td>{{ v.no }}</td>
              <td>{{
                  v.device_name.replace('国家基本气象站', '').replace('国家气象观测站', '').replace('国家基准气候站', '')
                }}
              </td>
              <td>{{ v.altitude }}</td>
              <!-- <td>{{ (setting.风雷达组网地图相关.altitudeHeight-v.altitude).toFixed(1) }}</td> -->
              <!-- <td>{{ v.time }}</td> -->
              <td :class="v.status==0 ? '未知' : v.status == 1 ? 'color-#3AC8A5' : v.status == 2 ? 'color-#e8cb1a' : v.status == 3 ? 'color-#F56c6c' : 'color-inherit'">
                {{
                  v.status == 0 ? '未知' : v.status == 1 ? '正常' : v.status == 2 ? '延迟' : v.status == 3 ? '缺失' : v.status
                }}
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
      <ul class="menuUl" tabindex="-1">
        <li @click="click">
          <img src="/src/assets/新增.svg" @click.native.stop/>作业申请
        </li>
        <li @click="click">
          <img src="/src/assets/修改.svg" @click.native.stop/>作业预报
        </li>
        <li @click="click">
          <img src="/src/assets/删除.svg" @click.native.stop/>完成报请求
        </li>
        <li @click="click">
          <img src="/src/assets/详情.svg" @click.native.stop/>查看详细数据
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ArrowDownBold, ArrowUpBold} from "@element-plus/icons-vue";

let showBottom = ref(false);

function getLabelsByValue(values: string[], options: any) {
  const labels = new Array<any>();
  let currentOptions = options;

  values.forEach(value => {
    const option = currentOptions.find((opt: any) => opt.value === value);
    if (option) {
      labels.push(option.label);
      currentOptions = option.children || [];
    }
  });

  return labels;
}

const cascaderProps = { /*multiple: true,*/ checkStrictly: true, value: 'value', label: 'label', children: 'children'}
const cascaderOptions = reactive([])
import {useSettingStore} from "~/stores/setting";

const setting = useSettingStore()
import {reactive, ref, onMounted, watch} from "vue";

const manufacturer = ref(0)
const manfacturerOptions = reactive([
  {value: 0, label: "全部"},
  {value: 1, label: "华航"},
  {value: 2, label: "西物"},
  {value: 3, label: "镭测"},
])
const radar_status = ref(-1)
const radar_statusOptions = reactive([
  {value: -1, label: "全部"},
  {value: 0, label: "未知"},
  {value: 1, label: "正常"},
  {value: 2, label: "延迟"},
  {value: 3, label: "缺失"},
])
const selected = ref(['140000'])
import {useStationStore} from "~/stores/station";
import {eventbus} from "~/eventbus";

const station = useStationStore();
import {useBus} from "~/myComponents/bus";
import {通过code获取子级, 通过code获取雷达, databaseRaw2} from "~/api/重庆";
import {exec} from "~/api/index.js";

const bus = useBus();
const menus = reactive([
  {code: 291, name: "白河堡作业点", status: "离线", equipment: "火箭", id: "110229041"},
  {code: 295, name: "千家店作业点", status: "在线", equipment: "火箭", id: "110229042"},
  {code: 297, name: "红旗甸作业点", status: "离线", equipment: "火箭", id: "110229043"},
  {code: 275, name: "275", status: "离线", equipment: "火箭", id: "110229044"},
  {code: 276, name: "276", status: "离线", equipment: "火箭", id: "110229045"},
  {code: 277, name: "277", status: "离线", equipment: "火箭", id: "110229046"},
]);
onMounted(async () => {
  $(".menuUl").on("focusout", () => {
    $(".menuUl").css({display: "none"});
  });
  exec({
    database: databaseRaw2,
    query: {
      sqls: [
        `select distinct a.parent_adcode as adcode, b.name
         from map_border_info a,
              map_border_info b
         where a.adcode in (select distinct adcode
                            from device
                            where (hide!= 'true' or hide is NULL)
                              and (device_name is not NULL)
                              and (device_name like '%${options.value}%' or no like '%${options.value}%'))
           and a.level = 'district'
           and a.parent_adcode = b.adcode
         order by a.parent_adcode`
      ],
    },
  }).then(res => {
    res.data[0].forEach((city: any) => {
      const item = {
        value: city.adcode,
        label: city.name,
        children: reactive([]),
      }
      cascaderOptions.push(item as never)
      exec({
        database: databaseRaw2,
        query: {
          sqls: [
            `select distinct a.adcode, b.name
             from device a,
                  map_border_info b
             where a.adcode = b.adcode
               and b.level = 'district'
               and (a.hide!= 'true' or a.hide is NULL)
               and (a.device_name is not NULL)
               and (a.device_name like '%${options.value}%' or a.no like '%${options.value}%')
               and b.parent_adcode = '${city.adcode}'
             order by a.adcode`
          ]
        }
      }).then(res => {
        res.data[0].forEach((region: any) => {
          const subItem = {
            value: region.adcode,
            label: region.name,
            children: reactive([]),
          }
          item.children.push(subItem as never)
        })
      })
    })
  })
});
const getAllLeafPaths = (nodes: any, parentPath: any[] = []) => {
  let paths: any[] = [];
  nodes.forEach((node: any) => {
    const currentPath = [...parentPath, node.value]
    if (node.children && node.children.length > 0) {
      paths.push(...getAllLeafPaths(node.children, currentPath))
    } else {
      paths.push(currentPath)
    }
  })
  return paths;
}
const scrolling = () => {
  $(".menuUl").trigger("blur");
};
const options = reactive({
  list: new Array<any>(),
  value: "",
});
watch(
    [() => options.value, manufacturer, selected, radar_status],
    async ([value]) => {
      let manufacturerCondition = ""
      setting.风雷达组网地图相关.manufacturer = '全部'
      if (manufacturer.value == 1) {
        setting.风雷达组网地图相关.manufacturer = '华航'
        manufacturerCondition = " and manufacturer like '%华航%'"
      } else if (manufacturer.value == 2) {
        setting.风雷达组网地图相关.manufacturer = '西物'
        manufacturerCondition = " and manufacturer like '%西物%'"
      } else if (manufacturer.value == 3) {
        setting.风雷达组网地图相关.manufacturer = '镭测'
        manufacturerCondition = " and manufacturer like '%镭测%'"
      }
      let code = ''
      if (selected.value == undefined || JSON.stringify(selected.value) == JSON.stringify(['140000'])) {
        code = '14'
      } else if (selected.value.length == 1) {
        code = selected.value[selected.value.length - 1].substring(0, 4)
      } else if (selected.value.length == 2) {
        code = selected.value[selected.value.length - 1].substring(0, 6)
      }
      let status = ''
      if (radar_status.value == -1) {
        status = ''
      } else {
        status = ` and status = ${radar_status.value}`
      }
      const result = await exec({
        database: databaseRaw2,
        query: {
          sqls: ["select * from `device` where (hide != 'true' or hide is NULL) and (device_name is not NULL and adcode like '" + code + "%') and (device_name like '%" + value + "%' or no like '%" + value + "%')" + manufacturerCondition + status],
        },
      })
      options.list = result.data[0]
      eventbus.emit("风雷达组网-设备数据", result);
      if (selected.value == undefined || JSON.stringify(selected.value) == JSON.stringify(['140000'])) {
        setting.风雷达组网地图相关.地区 = {address: ['山西省'], adcodes: ['140000']}
      } else {
        let address = getLabelsByValue(selected.value, cascaderOptions)
        setting.风雷达组网地图相关.地区 = {address, adcodes: selected.value}
      }
    },
    {
      immediate: true,
    }
);
let currentStation: any;
const contextmenu = (event: MouseEvent, v: any) => {
  currentStation = v;
  // let offset = $(".menuUl").prev().offset() || { left: 0, top: 0 };
  // $(".menuUl")
  //   .css({
  //     display: "flex",
  //     left: event.clientX - offset.left + "px",
  //     top: event.clientY - offset.top + "px",
  //   })
  //   .trigger("focus");
};
const click = (event: MouseEvent) => {
  eventbus.emit(
      "站点列表菜单点击",
      currentStation,
      (event.target as HTMLElement).innerText
  );
  $(".menuUl").trigger("blur");
};
const flyTo = (event: any, v: any) => {
  station.active = v.no;
  eventbus.emit("风雷达组网-将站点移动到屏幕中心", v);
};
const toggleCollapse = () => {
  $(".dragDialog").toggleClass("collapse");
};
</script>

<style scoped lang="scss">
.dropdown {
  transform: rotate(180deg);
  user-select: none;
  -webkit-user-drag: none;
  color: #ccc;
}

.dark .dropdown {
  color: grey;
}

.collapse.dragDialog .dropdown {
  transform: rotate(0deg);
}

.contain {
  position: relative;
  display: flex;
  flex-direction: column;

  .menuUl {
    outline: none;
    position: absolute;
    display: none;
    flex-direction: column;
    margin: 0;
    height: auto;
    font-size: 14px;
    text-align: left;
    border-radius: 8px;
    border: none;
    background-color: #252948;
    border: 1px solid grey;
    color: #fff;
    list-style: none;
    padding: 2px;

    li {
      height: 20px;

      img {
        vertical-align: middle;
        width: 20px;
        height: 20px;
        pointer-events: none;
        filter: drop-shadow(var(--ep-text-color-primary) 0 60px);
        transform: translateY(-60px);
      }

      vertical-align: middle;
      width: 140px;
      cursor: pointer;
      overflow: hidden;
      color: grey;

      &:hover {
        background-color: rgb(26, 117, 158);
        color: white;
      }
    }

    li:first-child {
      border-bottom: 1px solid grey;
    }

    li:last-child {
      border-top: 1px solid grey;
    }
  }
}

//.collapse.dragDialog .contain {
//  display: none;
//}


.dark .operation_filter {
  &::-webkit-input-placeholder {
    color: #999;
  }

  background-color: #2b2b2b;
  border: 0 solid #c1ccd3;

  &:focus {
    color: #fff;
    background-color: #4b4b4b;
    border-color: #4d90fe;
  }
}

.dragDialog {
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  //background: url("~/assets/theme-img/map-module-bg.png") no-repeat;
  //background-size: 100% 100%;
  background: var(--bg-color-overlay-opacity-8);
  border: 1px solid #B5D5E5;

  .dragDialog-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .ep-icon {
      color: var(--module-title-text-color);
    }

    .top-left {
      .top-left-top,
      .top-left-bottom {
        display: flex;

        :deep(.ep-input) {
          width: 120px
        }
      }

      .top-left-top {
        margin-bottom: 4px;
      }

      .item-box {
        display: flex;

        &:not(:last-child) {
          margin-right:16px;
        }
        .item-label{
          margin-right:4px;
          color:var(--module-title-text-color-secondary);
        }
      }
    }
  }

  .contain-table {
    overflow: auto;
    box-sizing: border-box;
    position: relative;
    margin-top: 8px;
    scroll-padding-top: 1rem;
    max-height: 125px;
  }

  table {
    border-collapse: collapse;

    min-width: 100%;

    thead {
      tr {
        th {
          border-top: none;
          color: #fff;
          width: 40px;
        }

        th:first-child {
          border-left: none;
        }

        th:last-child {
          border-right: none;
        }
      }
    }

    tbody {
      tr {
        &:hover {
          background: var(--ep-color-primary-light-7);
        }

        cursor: pointer;
      }

      tr.selected {
        background: var(--ep-color-primary-light-5);
      }

      td:first-child {
        border-left: none;
      }

      td:last-child {
        border-right: none;
      }

      tr:last-child td {
        border-bottom: none;
      }
    }

    th, td {
      text-align: left;
      //border: 1px solid #ccc;
    }
  }
}

.dark .dragDialog {
  background: var(--ep-bg-color-overlay);

  table {
    tbody {
      tr {
        &:hover {
          background: #ffffff22;
        }

        cursor: pointer;
      }

      tr.selected {
        background: #ffffff66;
      }
    }

    th, td {
      text-align: left;
      border: 1px solid var(--ep-border-color);
    }

    td {
      border-top: 0;
    }
  }
}

</style>
