<template>
  <div class="!collapse dragDialog absolute w-700px">
    <div class="flex flex-row" style="align-items: center">
      <input
        @mousedown.stop
        name="过滤条件"
        class="operation_filter flex-1"
        placeholder="请输入过滤条件"
        v-model="options.value"
      />
      <!-- <el-icon
        class="dropdown"
        style="
          width: 30px;
          line-height: 1rem;
          font-size: 20px;
          display: flex;
          align-items: center;
        "
        @click="toggleCollapse"
        @mousedown.stop
        >
        <svg
          t="1692335429583"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M64 320l64-64 384 384L896 256l64 64-448 448z"
            p-id="9959"
            data-spm-anchor-id="a313x.search_index.0.i4.4d423a814g60B1"
          >
          </path>
        </svg>
      </el-icon> -->
    </div>
    <div class="contain" @mousedown.stop>
      <div
        @scroll="scrolling"
        class="b-solid dark:b-#444 b-#ccc b-1px"
        style="
          overflow: auto;
          box-sizing: border-box;
          position: relative;
          margin-top: 7px;
          scroll-padding-top: 1rem;
        "
      >
        <table>
          <thead>
            <tr
              class="bg-blue z-1"
              style="box-sizing: border-box; top: 0px; position: sticky"
            >
              <th>序号</th>
              <th>名称</th>
              <th>设备类型</th>
              <th>经纬度</th>
              <th>海拔</th>
            </tr>
          </thead>
          <tbody style="position: relative">
            <tr
              :id="'人影-' + v.strID"
              :class="`${station.人影界面被选中的设备 == v.strID ? 'selected' : ''}`"
              v-for="(v, k) in options.list"
              :key="v.strID"
              @contextmenu.prevent="contextmenu($event, v)"
              @click="flyTo($event, v)"
            >
              <td>{{ k + 1 }}</td>
              <td>{{ v.strName }}</td>
              <td>{{ formatWeapon(v.strWeapon) }}</td>
              <td>{{ v.strPos }}</td>
              <td>{{ v.iAltitude }}</td>
            </tr>
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
import { reactive, onMounted, watch, computed } from "vue";
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
const formatWeapon = (weapon: number) =>
  ["火箭", "高炮", "火箭+高炮", "烟炉", "火箭+烟炉", "高炮+烟炉", "火箭+高炮+烟炉"][
    weapon
  ];
const props = withDefaults(defineProps<{ menus?: Array<any> }>(), {
  menus: () => [
    {
      id: 1,
      name: "便携11",
      deviceType: "便携式激光测风雷达",
      lng: 102.023,
      lat: 36.5353,
      altitude: 2157,
    },
  ],
});
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
const bus = useBus();
// const menus = reactive([
//   { code: 291, name: "白河堡作业点", status: "离线", equipment: "火箭", id: "110229041" },
//   { code: 295, name: "千家店作业点", status: "在线", equipment: "火箭", id: "110229042" },
//   { code: 297, name: "红旗甸作业点", status: "离线", equipment: "火箭", id: "110229043" },
//   { code: 275, name: "275", status: "离线", equipment: "火箭", id: "110229044" },
//   { code: 276, name: "276", status: "离线", equipment: "火箭", id: "110229045" },
//   { code: 277, name: "277", status: "离线", equipment: "火箭", id: "110229046" },
// ]);
onMounted(() => {
  $(".menuUl").on("focusout", () => {
    $(".menuUl").css({ display: "none" });
  });
});
const scrolling = () => {
  $(".menuUl").trigger("blur");
};
const options = reactive({
  list: new Array<any>(),
  value: "",
});
watch(
  [() => props.menus, () => options.value],
  ([result, value]) => {
    options.list = result.filter((item) => item.strName.indexOf(value) > -1);
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
  station.人影界面被选中的设备 = v.strID;
  eventbus.emit("人影-将站点移动到屏幕中心", v);
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
  height: 180px;
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
      img {
        vertical-align: middle;
        width: 20px;
        height: 20px;
        pointer-events: none;
        filter: drop-shadow(var(--el-text-color-primary) 0 60px);
        transform: translateY(-60px);
      }
      vertical-align: middle;
      width: 140px;
      cursor: pointer;
      overflow: hidden;
      padding: 2px;
      margin: 2px;
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
  opacity: 0.9;
  box-sizing: border-box;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 7px;
  // background: linear-gradient(172.98deg,hsla(0,0%,100%,0.08) 1.49%,hsla(0,0%,100%,0.0208) 99.64%);
  background: white;
  // box-shadow: 0 23px 20px -20px rgb(9 10 18 / 10%), 0 0 15px rgb(9 10 18 / 6%);
  table {
    border-collapse: collapse;
    overflow: auto;
    min-width: 100%;
    tr {
      line-height: 1rem;
    }
    thead {
      tr {
        th {
          border-top: none;
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
          background: #00000022;
        }
        cursor: pointer;
      }
      tr.selected {
        background: #00000066;
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
    th,
    td {
      text-align: left;
      border: 1px solid #ccc;
    }
  }
}
.dark .dragDialog {
  background: var(--el-bg-color-overlay);
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
      border: 1px solid #2b2b2b;
    }
    td {
      border-top: 0;
    }
  }
}
</style>
