<template>
  <div class="main-container" v-if="modelValue">
    <div style="border-radius: 10px; border: 1px solid black; box-sizing: border-box;background-color: #e1e1e1; position: relative;width: 100%;height: 100%;">
      <contentDBS></contentDBS>
    </div>
    <el-icon v-html="forkSvg" class="close-button" @click="modelValue = false"></el-icon>
  </div>
</template>
<script lang="ts" setup>
const modelValue = defineModel<boolean>({
  default: true,
});
import forkSvg from '~/assets/fork.svg?raw'
// import contentDBS from "../contentDBS.vue";
import contentDBS from "../contentPPI.vue";
import type { TabsPaneContext } from "element-plus";
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>

<style lang="scss" scoped>
.main-container {
  z-index:1;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  box-sizing: border-box;
  padding: 10px;
  height: 100%;
  .close-button{
    position: absolute;
    top:30px;
    right: 30px;
    font-size:2em;
    cursor:pointer;
    &:active{
      opacity:0.5;
    }
  }
  .demo-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    .ep-tabs__header {
      position: relative;
      box-sizing: border-box;
      background: linear-gradient(90deg, #29a5fc, #2375d9);
      border-radius: 8px 8px 0 0;
      margin: 0;
      display: flex;
      .ep-tabs__nav-wrap {
        margin: 0;
        overflow: visible;
        &::after {
          background: transparent;
        }
        .ep-tabs__nav-scroll {
          overflow: visible;
          .ep-tabs__nav {
            .ep-tabs__active-bar.is-top {
              position: absolute;
              background: blue;
              bottom: -2px;
              height: 2px;
            }
            .ep-tabs__item.is-active,
            .ep-tabs__item:hover {
              color: white;
            }
            .ep-tabs__item.is-top:nth-child(2) {
              padding-left: 20px;
            }
          }
        }
      }
    }
    .ep-tabs__content {
      height: 100%;
      border-radius: 0 0 8px 8px;
      .ep-tab-pane {
        height: 100%;
        background-color: #e1eeff;
      }
    }
  }
}
.dark .main-container {
  background: #2b2b2b;
  .demo-tabs {
    .ep-tabs__header {
      .ep-tabs__nav-wrap {
        .ep-tabs__nav-scroll {
          .ep-tabs__nav {
            .ep-tabs__active-bar.is-top {
              background: white;
            }
          }
        }
      }
    }
    .ep-tabs__content {
      .ep-tab-pane {
        background-color: #000;
      }
    }
  }
}
</style>
