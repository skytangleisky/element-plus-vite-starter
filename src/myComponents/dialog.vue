<template>
  <div v-dialogDrag class="dragDialog absolute w-300px" style="left:0px;top:20px;">
    <input @mousedown.stop class="operation_filter" placeholder="请输入ID、简码或作业点名称">
    <div @mousedown.stop style="position:relative;display: flex;flex-direction: column;height: 150px;">
      <div class="flex flex-row justify-between mt-0.5rem mb-0.5rem">
        <el-button @mousedown.stop type="default">北京延庆</el-button>
        <el-button @mousedown.stop type="default">还原</el-button>
      </div>
      <div style="height: 150px;overflow: auto;border: 1px solid black;box-sizing: border-box;">
        <table>
          <thead>
            <tr class="bg-blue">
              <th>代码</th>
              <th>名称</th>
              <th>状态</th>
              <th>装备</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>291</td>
              <td>白河堡作业点</td>
              <td class="color-red">离线</td>
              <td>火箭</td>
              <td>110229041</td>
            </tr>
            <tr>
              <td>295</td>
              <td>千家店作业点</td>
              <td class="color-green">在线</td>
              <td>火箭</td>
              <td>110229042</td>
            </tr>
            <tr>
              <td>297</td>
              <td>红旗甸作业点</td>
              <td class="color-red">离线</td>
              <td>火箭</td>
              <td>110229043</td>
            </tr>
            <tr>
              <td>275</td>
              <td>275</td>
              <td class="color-red">离线</td>
              <td>火箭</td>
              <td>110229044</td>
            </tr>
            <tr>
              <td>276</td>
              <td>276</td>
              <td class="color-red">离线</td>
              <td>火箭</td>
              <td>110229045</td>
            </tr>
            <tr>
              <td>277</td>
              <td>277</td>
              <td class="color-red">离线</td>
              <td>火箭</td>
              <td>110229046</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>
<style lang="scss">
.operation_filter{
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
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
  padding:1rem 1.5rem;
  // background: linear-gradient(172.98deg,hsla(0,0%,100%,0.08) 1.49%,hsla(0,0%,100%,0.0208) 99.64%);
  background: #396196;
  box-shadow: 0 23px 20px -20px rgb(9 10 18 / 10%), 0 0 15px rgb(9 10 18 / 6%);
  table{
    border-collapse: collapse;
    overflow: auto;
    min-width: 100%;
    thead{
      top:0;
      position: sticky;
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