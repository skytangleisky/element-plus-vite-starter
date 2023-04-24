<template>
  <ol class="menus w-full flex items-center content-center flex-row">
    <li tabindex="-1" class="relative">系统
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li><el-icon><Select></Select></el-icon>系统日志查询</li>
        <li>作业声音设置<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>语音简报</li>
            <li>声音提示</li>
            <li>静音</li>
          </ol>
        </li>
        <li>风格切换<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>蓝色</li>
            <li>白色</li>
            <li>亮蓝</li>
          </ol>
        </li>
        <li>关于</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">飞行作业
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>飞行器注册信息</li>
        <li>适应性参数设置</li>
        <li>空域数据维护</li>
        <li>电台通信<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>电台文本</li>
            <li>电台语音</li>
          </ol>
        </li>
        <li>航迹过滤设置</li>
        <li>航迹颜色设置</li>
        <li>数据回放<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>打开回放进程</li>
            <li>人影历史航迹查看</li>
          </ol>
        </li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">飞行计划
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>飞行任务规划</li>
        <li>机场管理</li>
        <li>人影飞机管理</li>
        <li>机型管理</li>
        <li>航路点管理</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">辅助管理
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>图层管理<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>图层显示管理</li>
            <li>临时图层显示管理</li>
            <li>临时图层编辑</li>
            <li>常用点管理</li>
          </ol>
        </li>
        <li>绘图工具</li>
        <li>综合空情显示设置</li>
        <li>人影态势展示窗口</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">地面作业
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>人影本地设置</li>
        <li>人影单位设置</li>
        <li>人影作业点设置</li>
        <li>人影网络状态查看</li>
        <li>人影完成信息查询</li>
        <li>人影作业查询<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>人影作业历史查询</li>
            <li>人影文本记录查询</li>
            <li>人影操作历史记录</li>
            <li>人影操作历史统计</li>
          </ol>
        </li>
        <li>作业通报自动移除</li>
        <li>通报自动移除时间<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>60秒</li>
            <li>120秒</li>
            <li>300秒</li>
          </ol>
        </li>
        <li>作业点显示设置</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">弹药管理
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>入口历史</li>
        <li>出库历史</li>
        <li>装备概况</li>
        <li>弹药设置<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>装备管理</li>
            <li>弹药注册</li>
            <li>厂商设置</li>
            <li>仓库查看</li>
            <li>型号设置<el-icon><ArrowRight /></el-icon>
              <ol class="absolute flex-col hidden p-0 left-100% top-0">
                <li>装备型号设置</li>
                <li>弹药型号设置</li>
              </ol>
            </li>
            <li>车辆管理</li>
            <li>年度采购计划</li>
            <li>人工校准</li>
            <li>国家局<el-icon><ArrowRight /></el-icon>
              <ol class="absolute flex-col hidden p-0 left-100% top-0">
                <li>国家局模拟</li>
                <li>国家局历史数据</li>
              </ol>
            </li>
          </ol>
        </li>
        <li>弹药详情</li>
        <li>弹药查询统计<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>弹药批次查询</li>
            <li>弹药日志记录</li>
            <li>单个弹药索引</li>
            <li>弹药统计</li>
            <li>清点历史</li>
            <li>日志校正</li>
          </ol>
        </li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">人员管理
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>用户管理</li>
        <li>人员登记</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">烟炉管理
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>烟炉总览</li>
        <li>烟炉控制平台</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">地面闪电
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>地闪数据目录<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>E:/2019</li>
            <li>切换目录</li>
          </ol>
        </li>
        <li>图层可见</li>
        <li>保留时间<el-icon><ArrowRight /></el-icon>
          <ol class="absolute flex-col hidden p-0 left-100% top-0">
            <li>5分钟</li>
            <li>10分钟</li>
          </ol>
        </li>
        <li>历史查询</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">聊天
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>单位协商</li>
        <li>用户聊天室</li>
      </ol>
    </li>
    <li tabindex="-1" class="relative">天气雷达组网
      <ol class="absolute flex-col hidden p-0 left-0 top-100%">
        <li>天气雷达组网路径设置</li>
      </ol>
    </li>
  </ol>
</template>
<script lang="ts" setup>
  import { Select, Setting, Close, SwitchButton, ColdDrink, User, ArrowRight } from '@element-plus/icons-vue'
</script>
<style lang="scss">
  ol{
    user-select: none;
    list-style: none;
    position: relative;
    display: none;
    background-color: rgb(47, 47, 45);
    li{
      position: relative;
      display: inline-flex;
      white-space: nowrap;
      padding: 0 4px 0 4px;
      cursor:default;
    }
    &:focus-within li:hover>ol{
      display: flex;
    }
  }
  .menus{
    background-color: transparent;
    &>li:hover{
      background-color: rgb(53, 54, 51);
      border-radius: 4px;
      li:hover{
        background-color: rgb(62, 110, 197);
        border-radius: 4px;
      }
      li{
        align-items: center;
        justify-content: space-between;
      }
    }
    li>ol{
      border:1px solid #fff;
      border-style:inset;
      border-radius: 4px;
      padding: 4px;
    }
    &>li{
      padding:0 8px 0 8px;
    }
  }
</style>