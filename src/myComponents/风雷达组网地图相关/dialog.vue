<template>
  <div class="!collapse dragDialog">
    <div class="dragDialog-top">
      <el-input
        @mousedown.stop
        name="过滤条件"
        class="operation_filter"
        placeholder="请输入过滤条件"
        size="small"
        v-model="options.value"
      />
      <el-cascader
        v-model="selected"
        collapse-tags
        :props="cascaderProps"
        :options="cascaderOptions"
        :max-collapse-tags="0"
        :clearable="false"
        size="small"
        class="m-r-10px"
        style="min-width:180px"
      >
      </el-cascader>
      <el-select v-model="manufacturer" style="width:60px" size="small">
        <el-option v-for="item in manfacturerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-icon
        class="dropdown"
        style="
          width: 30px;
          line-height: 1rem;
          font-size: 20px;
          display: flex;
          align-items: center;
        "
        @click="toggleCollapse"
        @mousedown.stop>
        <svg
          t="1692335429583"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="9958">
          <path
            d="M64 320l64-64 384 384L896 256l64 64-448 448z"
            p-id="9959"
            data-spm-anchor-id="a313x.search_index.0.i4.4d423a814g60B1"
            >
          </path>
        </svg>
      </el-icon>
    </div>
    <div class="contain" @mousedown.stop>
      <div
        @scroll="scrolling"
        class="contain-table"
      >
        <table>
          <thead>
            <tr
              class="bg-blue z-1"
              style="box-sizing: border-box; top: 0px; position: sticky"
            >
              <th>序号</th>
              <th>编号</th>
              <th>名称</th>
              <th>海高</th>
              <!-- <th>相对高</th> -->
              <!-- <th>时间</th> -->
              <th>状态</th>
            </tr>
          </thead>
          <tbody style="position: relative">
            <template v-for="(v, k) in options.list">
              <tr
                :id="v.no"
                :class="`${station.active == v.no ? 'selected' : ''}`"
                @contextmenu.prevent="contextmenu($event, v)"
                @click="flyTo($event, v)"
              >
                <td>{{ k + 1 }}</td>
                <td>{{ v.no }}</td>
                <td>{{ v.device_name }}</td>
                <td>{{ v.altitude }}</td>
                <!-- <td>{{ (setting.风雷达组网地图相关.altitudeHeight-v.altitude).toFixed(1) }}</td> -->
                <!-- <td>{{ v.time }}</td> -->
                <td :class="v.status==0 ? '未知' : v.status == 1 ? 'color-#50aa23' : v.status == 2 ? 'color-#f80' : v.status == 3 ? 'color-#f00' : 'color-inherit'">
                  {{ v.status==0 ? '未知' : v.status==1 ? '正常' : v.status==2 ? '延迟' : v.status==3 ? '缺失' : v.status }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <ul class="menuUl" tabindex="-1">
        <li @click="click">
          <img src="/src/assets/新增.svg" @click.native.stop />作业申请
        </li>
        <li @click="click">
          <img src="/src/assets/修改.svg" @click.native.stop />作业预报
        </li>
        <li @click="click">
          <img src="/src/assets/删除.svg" @click.native.stop />完成报请求
        </li>
        <li @click="click">
          <img src="/src/assets/详情.svg" @click.native.stop />查看详细数据
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
const cascaderProps = { /*multiple: true,*/ checkStrictly:true, value: 'value', label: 'label', children: 'children' }
const cascaderOptions = reactive([])
  import { useSettingStore } from "~/stores/setting";
  const setting = useSettingStore()
import { reactive, ref, onMounted, watch } from "vue";
const manufacturer = ref(0)
const manfacturerOptions = reactive([
  { value: 0, label: "全部" },
  { value: 1, label: "华航" },
  { value: 2, label: "西物" },
  { value: 3, label: "镭测" },
])
const selected = ref(['140000'])
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
import {通过code获取子级,通过code获取雷达,databaseRaw2} from "~/api/重庆";
import { exec } from "~/api/index.js";
const bus = useBus();
const menus = reactive([
  { code: 291, name: "白河堡作业点", status: "离线", equipment: "火箭", id: "110229041" },
  { code: 295, name: "千家店作业点", status: "在线", equipment: "火箭", id: "110229042" },
  { code: 297, name: "红旗甸作业点", status: "离线", equipment: "火箭", id: "110229043" },
  { code: 275, name: "275", status: "离线", equipment: "火箭", id: "110229044" },
  { code: 276, name: "276", status: "离线", equipment: "火箭", id: "110229045" },
  { code: 277, name: "277", status: "离线", equipment: "火箭", id: "110229046" },
]);
onMounted(async() => {
  $(".menuUl").on("focusout", () => {
    $(".menuUl").css({ display: "none" });
  });

  let manufacturerCondition = ""
  if(manufacturer.value == 1){
    manufacturerCondition = "and manufacturer like '%华航%'"
  }else if(manufacturer.value == 2){
    manufacturerCondition = "and manufacturer like '%西物%'"
  }else if(manufacturer.value == 3){
    manufacturerCondition = "and manufacturer like '%镭测%'"
  }
  exec({
    database: databaseRaw2,
    query: {
      sqls: [
        `select distinct a.parent_adcode as adcode, b.name
from map_border_info a, map_border_info b
where a.adcode in (
  select distinct adcode from device where (hide!= 'true' or hide is NULL) and (device_name is not NULL) and (device_name like '%${options.value}%' or no like '%${options.value}%') ${manufacturerCondition}
)
and a.level = 'district'
and a.parent_adcode = b.adcode
order by a.parent_adcode`
      ],
    },
  }).then(res=>{
    res.data[0].forEach((city:any,index:number)=>{
      const item = {
        value: city.adcode,
        label: city.name,
        children:reactive([]),
      }
      cascaderOptions.push(item as never)
      console.log(item)
      if(index==0){
        exec({
          database: databaseRaw2,
          query: {
            sqls: [
`select distinct a.adcode, b.name as parent_name
from map_border_info a, map_border_info b
where a.adcode in (
  select distinct adcode from device where (hide!= 'true' or hide is NULL) and (device_name is not NULL) and (device_name like '%${options.value}%' or no like '%${options.value}%') ${manufacturerCondition}
)
and a.level = 'district'
and a.parent_adcode = b.adcode
order by a.parent_adcode`
            ]
          }
        }).then(res=>{
          res.data[0].forEach((region:any)=>{
            console.log(region)
          })
        })
      }
    })
  })


  return;
  通过code获取子级(140000).then((res)=>{
    res.data.results.forEach(async(city:any)=>{
      const item = {
        value: city.adcode,
        label: city.name,
        children:reactive([]),
      }
      cascaderOptions.push(item as never)
      /*通过code获取子级(city.adcode).then(res=>{
        res.data.results.forEach(async(county:any)=>{
          const subItem = {
            value: county.adcode,
            label: county.name,
            children:reactive([]),
          }
          item.children.push(subItem as never)
          //将雷达挂载到级连菜单下边
          // 通过code获取雷达(county.adcode).then(res=>{
          //   res.data.results.forEach((station:any)=>{
          //     const stationItem = {
          //       value: station.no,
          //       label: station.device_name,
          //     }
          //     subItem.children.push(stationItem as never)
          //     selected.value = getAllLeafPaths(cascaderOptions[0].children, [140000]) as never[]
          //   })
          // })
        })
      })*/
    })
  })
});
const getAllLeafPaths = (nodes:any,parentPath:any[]=[]) =>{
  let paths:any[] = [];
  nodes.forEach((node:any)=>{
    const currentPath = [...parentPath, node.value]
    if(node.children&&node.children.length>0){
      paths.push(...getAllLeafPaths(node.children, currentPath))
    }else{
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
  [() => options.value,manufacturer, selected],
  async([value]) => {
    let manufacturerCondition = ""
    if(manufacturer.value == 1){
      manufacturerCondition = " and manufacturer like '%华航%'"
    }else if(manufacturer.value == 2){
      manufacturerCondition = " and manufacturer like '%西物%'"
    }else if(manufacturer.value == 3){
      manufacturerCondition = " and manufacturer like '%镭测%'"
    }
    let code = ''
    if(selected.value.length == 1){
      code = selected.value[selected.value.length-1].substring(0,2)
    }else if(selected.value.length == 2){
      code = selected.value[selected.value.length-1].substring(0,4)
    }else if(selected.value.length == 3){
      code = selected.value[selected.value.length-1].substring(0,6)
    }
    const result = await exec({
      database: databaseRaw2,
      query: {
        sqls: ["select * from `device` where (hide != 'true' or hide is NULL) and (device_name is not NULL and adcode like '"+code+"%') and (device_name like '%"+value+"%' or no like '%"+value+"%')"+manufacturerCondition],
      },
    })
    options.list = result.data[0]
    eventbus.emit("风雷达组网-设备数据", result);
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
.collapse.dragDialog .contain {
  display: none;
}

.operation_filter {
  width:120px;
  margin-right: 8px;
}
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
  width: 420px;
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: url("~/assets/theme-img/map-module-bg.png") no-repeat;
  background-size: 100% 100%;
  .contain-table{
    overflow: auto;
    box-sizing: border-box;
    position: relative;
    margin-top: 8px;
    scroll-padding-top: 1rem;
    max-height: 230px;
  }
  table {
    border-collapse: collapse;

    min-width: 100%;
    thead {
      tr {
        th {
          border-top: none;
          color: #fff;
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
    th,td {
      text-align: left;
      //border: 1px solid #ccc;
    }
  }
}
.dark .dragDialog {
  background: var(--ep-bg-color-overlay);
  table {
    tbody{
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
    th,td {
      text-align: left;
      border: 1px solid var(--ep-border-color);
    }
    td {
      border-top: 0;
    }
  }
}
.dragDialog-top{
  display: flex;
  align-items: center;
  .ep-icon{
    color: var(--ep-text-color-regular);
  }
}
</style>
