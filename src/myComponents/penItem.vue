<template>
  <!-- <img class="w-full h-full" :src="'/tanglei/'+item.product_root+item.product_image"> -->
  <article class="pen-item">
    <div class="iframe-wrap">
      <img
        class="w-full h-full"
        :src="'/tanglei/' + item.product_root + item.product_image"
      />
      <!-- <iframe
        src="http://dev.tanglei.top/tanglei/demos/project/html5/%E6%BC%A9%E6%B6%A1/index.html"
        frameborder="0"
        title="threejs 实现烟雾特效2.0"
        class="loaded"
      ></iframe> -->
      <a href="/pen/Go1cF4" class="cover" id="penid_Go1cF4">threejs 实现烟雾特效2.0</a>
    </div>
    <header class="pen-header">
      <img
        class="author-avatar ant-avatar ant-avatar-circle ant-avatar-image"
        src="/src/assets/g.jpg"
        alt="头像"
      />
      <div class="title-author">
        <a href="/pen/Go1cF4" class="">
          <h2 class="title">threejs 实现烟雾特效2.0</h2>
        </a>
        <address class="author">
          <span class="name">Ray</span>
          <span class="timestr">2022-12-06 11:48:46</span>
        </address>
      </div>
      <div class="action-menu" style="display: none">
        <i class="amicon amiconMoreVertical"></i>
      </div>
    </header>
    <footer class="stats">
      <div class="stats-item">
        <div class="amicon amiconheart"></div>
        0
      </div>
      <div class="stats-item">
        <div class="amicon amiconpinglun"></div>
        0
      </div>
      <div class="stats-item">
        <div class="amicon amiconeye"></div>
        204
      </div>
    </footer>
    <div title="查看预览详情" class="show-detail">
      <div class="amicon amiconquanping"></div>
    </div>
  </article>
</template>
<script lang="ts" setup>
interface Item {
  product_root: string;
  product_image: string;
}
const { item } = defineProps<{
  item: Item;
}>();
</script>
<style lang="scss">
.pen-item {
  position: relative;
  width: 100%;
  height: 100%;
  flex-direction: column;
  .show-detail {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 20px;
    right: 20px;
    z-index: 12;
    padding: 8px;
    background: #5a5f73;
    border-radius: 6px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
    transform: translate(0.25rem);
    transition: 0.25s cubic-bezier(0.5, 0, 0.5, 1);
    transition-property: transform, background-color, opacity;
    cursor: pointer;
    line-height: 1;
    color: #fff;
    overflow: hidden;
    .amicon {
      font-size: 18px;
      &.amiconquanping {
        background: url("/src/assets/放大.svg") no-repeat;
        background-size: 100% 100%;
        width: 18px;
        height: 18px;
        transform: translateY(-60px);
        filter: drop-shadow(rgba(255, 255, 255, 1) 0 60px);
      }
    }
  }
  .pick {
    position: absolute;
    top: -30px;
    left: 1rem;
    right: 0;
    display: flex;
    align-items: center;
    .am-logo {
      background: #222;
      padding: 2px;
      border-radius: 4px;
      width: 28px;
      height: 28px;
      display: flex;
      box-shadow: 0 0 10px rgb(0 0 0);
      text-align: center;
      .amicon {
        color: #fff;
        line-height: 1;
        font-size: 1.2rem;
        margin: auto;
      }
    }
    .picked-txt {
      color: #d5d7de;
      margin: 0 5px;
      font-size: 12px;
      font-weight: lighter;
      letter-spacing: 1px;
    }
    .picked-line {
      height: 2px;
      flex: 1;
      background: linear-gradient(90deg, #47cf73, #ffdd40, #ae63e4, #0ebeff, #47cf73);
      border-radius: 4px;
      margin-left: 6px;
    }
  }
  .stats {
    position: absolute;
    bottom: -44px;
    left: -7px;
    padding: 0 0 0 7px;
    height: 45px;
    z-index: 1;
    display: flex;
    align-items: center;
    font-size: 12px;
    .stats-item {
      padding: 2px 5px;
      background-color: #111;
      color: #fff;
      border-radius: 4px;
      margin-right: 10px;
      transform: translate3d(0, -50%, 0);
      opacity: 0;
      transition: all 0.2s ease;
      transition-property: transform, opacity;
      transition-timing-function: cubic-bezier(1, 0, 0.65, 0.75), linear;
      display: flex;
      overflow: hidden;
      .amicon {
        font-size: 13px;
        margin-right: 5px;
        &.amiconheart {
          background: url("/src/assets/心.svg") no-repeat;
          background-size: 100% 100%;
          width: 13px;
          height: 13px;
          transform: translateY(-60px);
          filter: drop-shadow(rgba(255, 255, 255, 1) 0 60px);
        }
        &.amiconpinglun {
          background: url("/src/assets/对话框.svg") no-repeat;
          background-size: 100% 100%;
          width: 13px;
          height: 13px;
          transform: translateY(-60px);
          filter: drop-shadow(rgba(255, 255, 255, 1) 0 60px);
        }
        &.amiconeye {
          background: url("/src/assets/看.svg") no-repeat;
          background-size: 100% 100%;
          width: 13px;
          height: 13px;
          transform: translateY(-60px);
          filter: drop-shadow(rgba(255, 255, 255, 1) 0 60px);
        }
      }
    }
  }
  &:hover .show-detail {
    opacity: 1;
    pointer-events: auto;
  }
  &:hover {
    &:before {
      -webkit-clip-path: inset(0 0 0.5rem 0 round 10px);
      clip-path: inset(0 0 0.5rem 0 round 10px);
    }
    .stats .stats-item {
      transform: translateY(0);
      opacity: 1;
      transition-timing-function: cubic-bezier(0.2, 0.15, 0.1, 1), ease;
      transition-delay: 0.2s;
    }
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: -2rem;
    left: 0;
    margin: -1rem;
    border-radius: 10px;
    background: #1f2229;
    -webkit-clip-path: inset(2rem 0 2rem 2rem round 10px);
    clip-path: inset(2rem 0 2rem 2rem round 10px);
    contain: strict;
    transition: -webkit-clip-path 0.3s ease 0.1s;
    transition: clip-path 0.3s ease 0.1s;
    transition: clip-path 0.3s ease 0.1s, -webkit-clip-path 0.3s ease 0.1s;
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
  }
  .iframe-wrap,
  &:before {
    overflow: hidden;
    transform: translateZ(0);
  }
  .iframe-wrap {
    opacity: 0.99;
    position: relative;
    height: 0;
    padding-top: 56.25%;
    background: #444857;
    background-size: cover;
    border-radius: 4px;
    .cover {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      width: 100%;
      opacity: 0;
      font-size: 0;
      height: 100%;
      z-index: 10;
      background-color: transparent;
      cursor: pointer;
    }
    & > iframe {
      width: calc(200% + 5px);
      height: calc(200% + 5px);
      border: 0;
      position: absolute;
      top: -2px;
      left: -2px;
      transform: scale(0.5);
      transform-origin: top left;
      transition: opacity 0.4s linear 0.1s;
    }
  }
  .pen-header {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 1rem;
    .action-menu {
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      border-radius: 3px;
      flex-shrink: 0;
      color: #fff;
      cursor: pointer;
      .amicon {
        font-size: 28px;
      }
      &:hover {
        background-color: #444857;
      }
    }
    .ant-avatar {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5;
      list-style: none;
      font-feature-settings: "tnum";
      position: relative;
      display: inline-block;
      overflow: hidden;
      color: #fff;
      white-space: nowrap;
      text-align: center;
      vertical-align: middle;
      background: #ccc;
      width: 32px;
      height: 32px;
      line-height: 32px;
      border-radius: 50%;
    }
  }
  .title-author {
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .author {
      color: #c0c3d0;
      font-size: 14px;
      line-height: 1.2;
      display: flex;
      align-items: center;
      margin-bottom: 0;
      justify-content: space-between;
      .name {
        display: block;
        width: 50%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .timestr {
        color: #5b5c5f;
        font-size: 13px;
      }
    }
    .title {
      color: #fff;
      width: 95%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 15px;
      margin-bottom: 5px;
      cursor: pointer;
    }
  }
  .author-avatar {
    margin-right: 0.75rem;
    width: 40px;
    height: 40px;
    background: #444857;
    overflow: hidden;
    flex-shrink: 0;
  }
}
</style>
