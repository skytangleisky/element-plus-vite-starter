<template>
  <div v-dialogDrag class="collapse dragDialog absolute w-300px" style="left:20px;top:20px;">
    <div class="flex flex-row">
      <input @mousedown.stop class="operation_filter flex-1" placeholder="请输入过滤条件">
      <img src="/src/assets/Right.png" class="dropdown w-40px h-2.5rem" @click="toggleCollapse" @mousedown.stop>
    </div>
    <div class="contain" @mousedown.stop>
      <div class="flex flex-row justify-between mt-0.5rem mb-0.5rem">
        <el-button @mousedown.stop type="default">北京延庆</el-button>
        <el-button @mousedown.stop type="default">还原</el-button>
      </div>
      <div @scroll="scrolling" style="overflow: auto;border: 1px solid black;box-sizing: border-box;position: relative;">
        <table>
          <thead style="z-index: 1;">
            <tr class="bg-blue">
              <th>代码</th>
              <th>名称</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody style="position: relative;">
            <tr v-for="(v,k) in station.result" :key="v.radar_id" @contextmenu.prevent="event=>contextmenu(event,v)" @click="flyTo(v)">
              <td>{{ v.radar_id.substring(0,4) }}</td>
              <td>{{ v.name }}</td>
              <td :class="v.status==true?'color-green':'color-red'">{{ v.status?'在线':'离线' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul class="menuUl" tabindex="-1">
        <li @click="click"><img src="/src/assets/新增.svg" @click.native.stop>作业申请</li>
        <li @click="click"><img src="/src/assets/修改.svg" @click.native.stop>作业预报</li>
        <li @click="click"><img src="/src/assets/删除.svg" @click.native.stop>完成报请求</li>
        <li @click="click"><img src="/src/assets/详情.svg" @click.native.stop>查看详细数据</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive,onMounted } from 'vue'
import { useStationStore } from '~/stores/station';
import { eventbus } from '~/eventbus';
const station = useStationStore()
const menus = reactive([
  {code:291,name:'白河堡作业点',status:'离线',equipment:'火箭',id:'110229041'},
  {code:295,name:'千家店作业点',status:'在线',equipment:'火箭',id:'110229042'},
  {code:297,name:'红旗甸作业点',status:'离线',equipment:'火箭',id:'110229043'},
  {code:275,name:'275',status:'离线',equipment:'火箭',id:'110229044'},
  {code:276,name:'276',status:'离线',equipment:'火箭',id:'110229045'},
  {code:277,name:'277',status:'离线',equipment:'火箭',id:'110229046'},
])
onMounted(()=>{
  $('.menuUl').on('focusout',()=>{
    $('.menuUl').css({'display':'none'})
  })
})
const scrolling = () => {
  $('.menuUl').trigger('blur')
}
let currentStation:any;
const contextmenu = (event:MouseEvent,v:any) => {
  currentStation = v
  let offset = $('.menuUl').prev().offset()||{left:0,top:0}
  $('.menuUl').css({'display':'flex',left:event.clientX-offset.left+'px',top:event.clientY-offset.top+46+'px'}).trigger('focus')
}
const click = (event:MouseEvent) => {
  eventbus.emit('站点列表菜单点击',currentStation,(event.target as HTMLElement).innerText)
  $('.menuUl').trigger('blur')
}
const flyTo = (v:any)=>{
  eventbus.emit('将站点移动到屏幕中心',v)
}
const toggleCollapse = () => {
  $('.dragDialog').toggleClass('collapse')
}
</script>
<style lang="scss">
  .dropdown{
    transform:rotate(-90deg);
    user-select: none;
    -webkit-user-drag: none;
  }
  .collapse.dragDialog .dropdown{
    transform: rotate(90deg);
  }
  .contain{
    position:relative;
    display: flex;
    flex-direction: column;
    height: 180px;
    .menuUl {
      outline: none;
      position: absolute;
      display: none;
      flex-direction: column;
      margin:0;
      height: auto;
      font-size: 14px;
      text-align: left;
      border-radius: 8px;
      border: none;
      background-color: #252948;
      border:1px solid black;
      color: #fff;
      list-style: none;
      padding: 2px;
      li {
        img{
          vertical-align:
          middle;
          width:20px;
          height:20px;
          pointer-events:none;
          filter:drop-shadow(var(--ep-text-color-primary) 0 60px);
          transform: translateY(-60px);
        }
        vertical-align: middle;
        width: 140px;
        cursor: pointer;
        overflow: hidden;
        padding:2px;
        margin:2px;
        color:grey;
        &:hover {
          background-color: rgb(26, 117, 158);
          color: white;
        }
      }
      li:first-child{
        border-bottom: 1px solid rgba(0, 0, 0, 0.47);
      }
      li:last-child{
        border-top: 1px solid rgba(0, 0, 0, 0.47);
      }
    }
  }
  .collapse.dragDialog .contain{
    display: none;
  }

.operation_filter{
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgba(244,244,245,.6);
  background-color: #04062088;
  background-clip: padding-box;
  border: 0 solid #c1ccd3;
  appearance: none;
  border-radius: 0.3rem;
  &:focus{
    color: rgba(244,244,245,.6);
    background-color: #040620;
    border-color: #4d90fe;
    outline: 0;
  }

  // &::-webkit-input-placeholder{
  //   color:#999;
  // }
  // &:focus{
  //   border-radius:10px 0 0 0;
  //   border: #17A1FF solid 2px;
  //   transition: border 2s;
  //   border-right:none;
  //   border-bottom:none;
  //   padding-bottom:2px;
  // }
}
.dragDialog{
  display: flex;
  flex-direction: column;
  border-radius:10px;
  padding:0.5rem;
  // background: linear-gradient(172.98deg,hsla(0,0%,100%,0.08) 1.49%,hsla(0,0%,100%,0.0208) 99.64%);
  background: #396196;
  box-shadow: 0 23px 20px -20px rgb(9 10 18 / 10%), 0 0 15px rgb(9 10 18 / 6%);
  table{
    border-collapse: collapse;
    overflow: auto;
    min-width: 100%;
    thead{
      top:0;
      // position: sticky;
      tr{
        th{
          border-top:none;
        }
        th:first-child{
          border-left:none;
        }
        th:last-child{
          border-right:none;
        }
      }
    }
    tbody{
      td:first-child{
        border-left:none;
      }
      td:last-child{
        border-right:none;
      }
      tr:last-child td{
        border-bottom: none;
      }
    }
    th,td{
      border: 1px solid black;
    }
  }
}
.dark .dragDialog{
  background:#252948;
}
</style>