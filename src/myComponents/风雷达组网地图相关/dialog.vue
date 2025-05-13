<template>
  <div class="!collapse dragDialog" >
    <div class="dragDialog-top">
      <input
        @mousedown.stop
        name="过滤条件"
        class="operation_filter flex-1 m-r-10px"
        placeholder="请输入过滤条件"
        v-model="options.value"
      />
      <el-cascader
        v-model="selected"
        collapse-tags
        :props="cascaderProps"
        v-model:options="cascaderOptions"
        :max-collapse-tags="0"
        clearable
        size="small"
        class="m-r-10px"
      >
      </el-cascader>
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
const cascaderProps = { multiple: true, value: 'value', label: 'label', children: 'children' }
const cascaderOptions = reactive([
  {
    value: 140000,
    label: '山西省',
    children: [
      // {
      //   value: 2,
      //   label: '太原市',
      //   children: [
      //     { value: 3, label: '阳曲县' },
      //     { value: 4, label: '娄烦县' },
      //     { value: 5, label: '古交市' },
      //     { value: 5, label: '万柏林区' },
      //     { value: 5, label: '尖草坪区' },
      //     { value: 5, label: '杏花岭区' },
      //     { value: 5, label: '迎泽区' },
      //     { value: 5, label: '清徐县' },
      //     { value: 5, label: '晋源区' },
      //     { value: 5, label: '小店区' },
      //   ],
      // },
      // {
      //   value: 6,
      //   label: '大同市',
      //   children: [
      //     { value: 7, label: '平城区' },
      //     { value: 8, label: '左云县' },
      //     { value: 9, label: '新荣区' },
      //     { value: 9, label: '阳高县' },
      //     { value: 9, label: '天镇县' },
      //     { value: 9, label: '云冈区' },
      //     { value: 9, label: '云州区' },
      //     { value: 9, label: '浑源县' },
      //     { value: 9, label: '广灵县' },
      //     { value: 9, label: '灵丘县' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '朔州市',
      //   children: [
      //     { value: 11, label: '右玉县' },
      //     { value: 12, label: '平鲁区' },
      //     { value: 13, label: '朔城区' },
      //     { value: 13, label: '山阴县' },
      //     { value: 13, label: '怀仁市' },
      //     { value: 13, label: '应县' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '忻州市',
      //   children: [
      //     { value: 11, label: '偏关县' },
      //     { value: 12, label: '河曲县' },
      //     { value: 13, label: '保德县' },
      //     { value: 13, label: '神池县' },
      //     { value: 13, label: '五寨县' },
      //     { value: 13, label: '岢岚县' },
      //     { value: 13, label: '宁武县' },
      //     { value: 13, label: '静乐县' },
      //     { value: 13, label: '原平市' },
      //     { value: 13, label: '忻府区' },
      //     { value: 13, label: '定襄县' },
      //     { value: 13, label: '代县' },
      //     { value: 13, label: '五台县' },
      //     { value: 13, label: '繁峙县' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '吕梁市',
      //   children: [
      //     { value: 11, label: '兴县' },
      //     { value: 12, label: '岚县' },
      //     { value: 13, label: '临县' },
      //     { value: 13, label: '方山县' },
      //     { value: 13, label: '柳林县' },
      //     { value: 13, label: '离石区' },
      //     { value: 13, label: '交城县' },
      //     { value: 13, label: '中阳县' },
      //     { value: 13, label: '石楼县' },
      //     { value: 13, label: '交口县' },
      //     { value: 13, label: '孝义市' },
      //     { value: 13, label: '汾阳市' },
      //     { value: 13, label: '文水县' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '阳泉市',
      //   children: [
      //     { value: 11, label: '盂县' },
      //     { value: 12, label: '郊区' },
      //     { value: 13, label: '平定县' },
      //     { value: 13, label: '矿区' },
      //     { value: 13, label: '城区' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '晋中市',
      //   children: [
      //     { value: 11, label: '灵石县' },
      //     { value: 12, label: '介休市' },
      //     { value: 13, label: '平遥县' },
      //     { value: 13, label: '祁县' },
      //     { value: 13, label: '太谷区' },
      //     { value: 13, label: '榆次区' },
      //     { value: 13, label: '寿阳县' },
      //     { value: 13, label: '榆社县' },
      //     { value: 13, label: '左权县' },
      //     { value: 13, label: '和顺县' },
      //     { value: 13, label: '昔阳县' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '临汾市',
      //   children: [
      //     { value: 11, label: '永和县' },
      //     { value: 12, label: '大宁县' },
      //     { value: 13, label: '吉县' },
      //     { value: 13, label: '乡宁县' },
      //     { value: 13, label: '襄汾县' },
      //     { value: 13, label: '侯马市' },
      //     { value: 13, label: '曲沃县' },
      //     { value: 13, label: '冀城县' },
      //     { value: 13, label: '浮山县' },
      //     { value: 13, label: '安泽县' },
      //     { value: 13, label: '古县' },
      //     { value: 13, label: '霍州市' },
      //     { value: 13, label: '汾西县' },
      //     { value: 13, label: '隰县' },
      //     { value: 13, label: '蒲县' },
      //     { value: 13, label: '尧都县' },
      //     { value: 13, label: '洪洞县' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '长治市',
      //   children: [
      //     { value: 11, label: '沁源县' },
      //     { value: 12, label: '屯留区' },
      //     { value: 13, label: '长子县' },
      //     { value: 13, label: '上党区' },
      //     { value: 13, label: '壶关县' },
      //     { value: 13, label: '平顺县' },
      //     { value: 13, label: '黎城县' },
      //     { value: 13, label: '武乡县' },
      //     { value: 13, label: '沁县' },
      //     { value: 13, label: '襄垣县' },
      //     { value: 13, label: '潞城区' },
      //     { value: 13, label: '潞州区' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '运城市',
      //   children: [
      //     { value: 11, label: '新绛县' },
      //     { value: 12, label: '稷山县' },
      //     { value: 13, label: '河津市' },
      //     { value: 13, label: '万荣县' },
      //     { value: 13, label: '临猗县' },
      //     { value: 13, label: '永济市' },
      //     { value: 13, label: '芮城县' },
      //     { value: 13, label: '平陆县' },
      //     { value: 13, label: '夏县' },
      //     { value: 13, label: '垣曲县' },
      //     { value: 13, label: '绛县' },
      //     { value: 13, label: '闻喜县' },
      //     { value: 13, label: '盐湖区' },
      //   ],
      // },
      // {
      //   value: 10,
      //   label: '晋城市',
      //   children: [
      //     { value: 11, label: '沁水县' },
      //     { value: 12, label: '阳城县' },
      //     { value: 13, label: '泽州县' },
      //     { value: 13, label: '临川县' },
      //     { value: 13, label: '高平县' },
      //     { value: 13, label: '城区' },
      //   ],
      // },
    ],
  }
])
  import { useSettingStore } from "~/stores/setting";
  const setting = useSettingStore()
import { reactive, ref, onMounted, watch } from "vue";
const selected = ref([])
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
import {通过code获取子级,通过code获取雷达} from "~/api/重庆";
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
  通过code获取子级(140000).then((res)=>{
    res.data.results.forEach(async(city:any)=>{
      const item = {
        value: city.adcode,
        label: city.name,
        children:reactive([]),
      }
      cascaderOptions[0].children.push(item as never)
      通过code获取子级(city.adcode).then(res=>{
        res.data.results.forEach(async(county:any)=>{
          const subItem = {
            value: county.adcode,
            label: county.name,
            children:reactive([]),
          }
          item.children.push(subItem as never)
          通过code获取雷达(county.adcode).then(res=>{
            res.data.results.forEach((station:any)=>{
              const stationItem = {
                value: station.no,
                label: station.device_name,
              }
              subItem.children.push(stationItem as never)
              selected.value = getAllLeafPaths(cascaderOptions[0].children, [140000]) as never[]
            })
          })
        })
      })
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
  [() => bus.风雷达组网地图相关雷达站点信息, () => options.value, selected],
  ([result, value]) => {
    let tmp = result.filter((item:any)=>{
      for(let i=0;i<selected.value.length;i++){
        if(item.no == selected.value[i][3]){
          return true
        }
      }
      return false
    })
    options.list = tmp.filter(
      (item) => {
        return item.device_name.indexOf(value) > -1 || item.no.indexOf(value) > -1
      }
    );
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
  display: block;
  padding: 0.1rem 0.2rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: grey;
  background-color: #eee;
  background-clip: padding-box;
  border: 0 solid #c1ccd3;
  appearance: none;
  border-radius: 0.3rem;
  &:focus {
    color: #000;
    background-color: #ddd;
    border-color: #4d90fe;
    outline: 0;
  }

  &::-webkit-input-placeholder {
    color: grey;
  }
  // &:focus{
  //   border-radius:10px 0 0 0;
  //   border: #17A1FF solid 2px;
  //   transition: border 2s;
  //   border-right:none;
  //   border-bottom:none;
  //   padding-bottom:2px;
  // }
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
