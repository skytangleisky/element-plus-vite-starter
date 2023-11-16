<template>
  <ol class="menu ol_list" style="overflow: hidden">
    <!--导航栏-->
    <my-map></my-map>
    <!-- <div class="nav-wrapper">人影空域申报系统</div> -->
    <box class="info-box color-cyan" right bottom>
      <span
        >Framerate(FPS)<span>{{ data.fps }}</span></span
      >
      <span
        >Level<span>{{ data.level }}</span></span
      >
      <span
        >Tiles<span>{{ data.tiles }}</span></span
      >
      <span
        >Draw call<span>{{ data.drawCall }}</span></span
      >
      <span
        >Frame time(ms)<span>{{ data.frameTime }}</span></span
      >
      <span
        >Period time(ms)<span>{{ data.periodTime }}</span></span
      >
      <span
        >Occupy(%)<span>{{ data.occupy }}</span></span
      >
      <span
        >Instance Count<span>{{ data.instanceCount }}</span></span
      >
      <span
        >Triangle <span>{{ data.triangle }}</span></span
      >
      <span
        >Game Logic(ms)<span>{{ data.gameLogic }}</span></span
      >
      <span
        >Physics(ms)<span>{{ data.physics }}</span></span
      >
      <span
        >Renderer(ms)<span>{{ data.renderer }}</span></span
      >
      <span
        >GFX Texture Mem (M)<span>{{ data.texture }}</span></span
      >
      <span
        >GFX Buffer Mem (M)<span>{{ data.buffer }}</span></span
      >
      <span
        >Thead<span>{{ data.thead }}</span></span
      >
    </box>
    <my-dialog></my-dialog>
    <dialog-plan-request v-model:show="planShow"></dialog-plan-request>
    <dialog-prev-request v-model:show="prevShow"></dialog-prev-request>
    <li
      class="li_item"
      tabindex="-1"
      v-for="(item, index) in list"
      :key="index"
      @mouseenter="mouseenter"
    >
      {{ item.name }}
      <ol
        class="ol_list"
        v-if="item.children"
        :style="'left:' + (item.left ? '-1em' : '0')"
      >
        <submenu :item.sync="item"></submenu>
      </ol>
    </li>
  </ol>
</template>
<script lang="ts" setup>
import { eventbus } from "~/eventbus";
import Box from "../../myComponents/box.vue";
import myMap from "../map/index.vue"; //用canvas绘制的地图
// import myMap from "../openlayers/index.vue"; //基于openlayers的地图
import { ref, watch, onMounted, onBeforeUnmount, reactive } from "vue";
import submenu from "./submenu.vue";
import menusData from "./menusData";
import { Item } from "./def";
import { useLocale } from "element-plus";
import myDialog from "../dialog.vue";
import DialogPlanRequest from "../dialog_plan_request.vue";
import DialogPrevRequest from "../dialog_prev_request.vue";
let { t } = useLocale();
type Props = {
  list?: Item[];
};
const props = withDefaults(defineProps<Props>(), {
  list: () => ref(menusData).value,
});
watch(props.list, (newVal) => {
  // console.log('>>>',newVal)
});
const mouseenter = (e: any) => {
  if ($(e.target.parentNode).is(":has(li:focus-within)")) {
    e.target.focus();
  }
};
const data = reactive({
  level: "X",
  fps: "X",
  drawCall: "X",
  frameTime: "X",
  periodTime: "X",
  occupy: "X",
  instanceCount: "X",
  triangle: "X",
  gameLogic: "X",
  physics: "X",
  renderer: "X",
  texture: "X",
  buffer: "X",
  tiles: "X",
  thead: "X",
});
const planShow = ref(false);
const prevShow = ref(false);
let procInfo = (info: any) => {
  Object.assign(data, info);
};
const procStationMenu = (currentStation: any, target: string) => {
  if (target == "作业申请") {
    prevShow.value = false;
    planShow.value = true;
  } else if (target == "作业预报") {
    planShow.value = false;
    prevShow.value = true;
  }
  console.log(currentStation, target);
};
onMounted(() => {
  eventbus.on("systemInfo", procInfo);
  eventbus.on("站点列表菜单点击", procStationMenu);
});
onBeforeUnmount(() => {
  eventbus.off("systemInfo");
  eventbus.off("站点列表菜单点击");
});
</script>
<style lang="scss">
.info-box {
  position: absolute;
  right: 0;
  bottom: 0;
  display: block;
}
.ol_list {
  user-select: none;
  list-style: none;
  position: relative;
  display: none;
  // background: lightgrey;
  .li_item {
    outline: none;
    position: relative;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    line-height: 100%;
    white-space: nowrap;
    padding: 1px 4px 1px 4px;
    cursor: default;
    text-shadow: 0 1px #ffffff88, 1px 0 #ffffff88, -1px 0 #ffffff88, 0 -1px #ffffff88;
  }
  .li_item:focus-within > .ol_list {
    display: flex;
  }
}
.dark .ol_list {
  .li_item {
    text-shadow: 0 1px #00000088, 1px 0 #00000088, -1px 0 #00000088, 0 -1px #00000088;
  }
}
.menu {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  position: relative;
  background-color: transparent;
  flex-direction: row;
  margin: 0;
  padding-left: 0;
  & > .li_item {
    padding: 0 8px 0 8px;
    & > .ol_list {
      position: absolute;
      flex-direction: column;
      left: 0;
      top: 100%;
      .li_item .ol_list {
        position: absolute;
        flex-direction: column;
        left: 100%;
        padding: 4px;
        top: -4px;
      }
    }
  }
  .li_item > .ol_list {
    padding: 4px;
    &::before {
      content: "";
      border: 1px solid #222;
      box-shadow: 0 0 4px #000;
      box-sizing: border-box;
      border-radius: 4px;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      position: absolute;
      background-color: rgba(128, 128, 128, 0.5);
      backdrop-filter: blur(4px);
    }
  }
  & > .li_item:focus-within {
    background-color: rgba(150, 150, 150, 0.5);
    border-radius: 4px;
    .li_item {
      align-items: center;
      justify-content: space-between;
      &:focus-within:has(ol) {
        background-color: rgba(150, 150, 150, 0.5);
      }
      &:focus-within:not(:has(ol:hover)):hover {
        background-color: rgba(62, 110, 197, 1);
        border-radius: 4px;
      }
      // &:focus-within:not(:has(ol:hover)):not(:has(ol)):active{
      //   background-color: rgba(62, 110, 197, .5);
      // }
      // &:not(:has(ol)).play{
      //   animation: identifier 1000ms;
      // }
      // @keyframes identifier {
      //   0% {opacity: 0;}
      //   100% {opacity: 0;}
      // }
    }
  }
}

.nav-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 50px;
  font-size: 1.5em;
  height: 65px;
  background: url(~/assets/nav.png) no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
}
</style>
