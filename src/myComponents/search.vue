<template>
<div class="input_pane">
  <div class="logo" style="display:none;"></div>
  <div style="display:flex;flex-direction:column;width:100%;margin-top:10px;padding:10px 0;">
    <div style="display:flex;justify-content: center;">
      <div style="position: absolute;left:10px;display: flex;align-items: center;">
        <el-select @change="languageChange" v-model="lang" class="m-2" placeholder="Select" size="small">
          <el-option
            v-for="item in languages"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <button @click="toggleDark()" class="bg-transparent border-none cursor-pointer">
          <i inline-flex i="dark:ep-moon ep-sunny" />
        </button>
      </div>
      <div class="classificationButton"><div class="classificationPhoto" />{{ t('tl.classification') }}</div>
      <div class="input">
        <input @keydown.enter.native="keydown_enter" v-model.sync="inputValue" type="text" placeholder="共35537张/昨日更新20张的内容" autocomplete="off">
        <div class="picker" tabindex="-1">百度</div>
        <ul class="picker-list">
          <li v-for="(item,key) in searchArr" @mousedown.native="picker_list_click(item)" :class="item.class">{{ item.value }}</li>
        </ul>
        <div @mousedown.stop class="hot-list">
          <div class="line"></div>
          <div class="noData">{{ t("el.table.emptyText") }}</div>
          <div class="dataItem" v-for="(item,key) in list" @mousedown.native="hot_list_mousedown(item)" target="_blank">
            <div class="number" :style="'color:'+color[key]">{{ key+1 }}</div>
            <div style="flex-grow:1;text-align:left;">{{ item }}</div>
            <Close @mousedown="hot_list_delete_item(key,$event)" class="hot_list_delete_item" style="width:20px;height:20px;color:lightgrey;"></Close>
          </div>
        </div>
      </div>
      <div @click.native="search_click" class="search" tabindex="-1"></div>
      <div style="position: absolute;right:10px;display: flex;align-items: center;">
        <div style="display: flex;align-items: center;">
          <el-dropdown trigger="click" size="small">
            <el-avatar :size="32" :src="user.avatar">
              <span class="el-dropdown-link"><User style="width:24px;height:24px;"></User></span>
            </el-avatar>
            <img :src="user.avatar" style="width:24px;height:24px;border-radius:50%;">
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="!user.logined" @click="login" :icon="Select">登陆</el-dropdown-item>
                <el-dropdown-item :icon="ColdDrink">捐赠</el-dropdown-item>
                <el-dropdown-item :icon="Setting">设置</el-dropdown-item>
                <el-dropdown-item v-if="user.logined" divided @click="logout" :icon="SwitchButton">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          {{ user.username }}
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane v-for="(item,k) in options" :label="t('tl.'+item.name)" :name="item.name">
        <div v-for="(item,key) in data.result.results">{{ item.uuid }}</div>
      </el-tab-pane>
    </el-tabs>
    <el-pagination :total="data.result.total" v-model:page-size="page_size" v-model:current-page="current_page" />
  </div>
</div>
</template>
<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { toggleDark } from '~/composables';
import { Select, Setting, Close, SwitchButton, ColdDrink, User } from '@element-plus/icons-vue'
import { useLocale } from 'element-plus'
const { t } = useLocale()
import { useSettingStore } from '../stores/setting'
import { useUserStore } from '../stores/user'
import { useDataStore } from '../stores/data'
const setting = useSettingStore()
const user = useUserStore()
const data = useDataStore()
user.info()
const page_size = ref(10)
const current_page = ref(1)
let queryChange = computed(()=>{
  return {offset:page_size.value*(current_page.value-1),limit:page_size.value}
})
watch(queryChange,newVal=>{
  data.FetchList(newVal)
},{ immediate: true, deep: true })
const list = reactive(['网页特效','jQuery特效','web前端代码','图片轮播','图片切换','响应式布局','表单美化','评论','QQ表情'])
let lang = ref('zh-cn')
if(setting.locale.name==='en'){
  lang = ref('en')
}
const languages = ref([{value: 'zh-cn',label: '中文',},{value: 'en',label: 'English'}])
const inputValue = ref('')
const color = ref(['#ff2c00','#ff5a00','#ff8105','#fd9a15','#dfad1c','#6bc211','#3cc71e','#3cbe85','#51b2ef','#53b0ff'])
const activeName = 'All'
const searchArr = [{class:'baidu',value:'百度'},{class:'sogou',value:'搜狗'},{class:'bing',value:'必应'},{class:'google',value:'谷歌'}]
const options = [{name:'All'},{name:'WebEffects'},{name:'FlushMaterial'},{name:'html5css3'},{name:'WebTemplates'},{name:'WebMaterial'},{name:'WholeSiteSourceCode'},{name:'AnimationCode'},{name:'StyleDesign'}]
watch(inputValue,newVal=>{
  console.log(newVal)
})
const languageChange = (lang) => {
  setting.changeLanguage(lang)
}
const login = ()=>{
  user.Login({username:'admin',password:'admin'})
}
const logout = ()=>{
  user.Logout()
}
const hot_list_delete_item = (key,$event) => {
  list.splice(key,1)
  $event.preventDefault();
  $event.stopPropagation();
}
const handleClick = () => {
  console.log('handleClick')
}
const keydown_enter = () => {
  $('.search').focus().click()
}
const hot_list_mousedown = item => {
  inputValue.value=item;
}
const picker_list_click = item => {
  $('.logo').css("background-image",("url('/src/assets/"+item.class+".png')"));
  $('.picker').html(item.value)
}
const search_click = () => {
  for(let i=0;i<list.length;i++){
    if(list[i]==inputValue.value){
      list.splice(i--,1)
    }
  }
  if(inputValue.value!==""){
    list.unshift(inputValue.value)
    if(list.length>10){
      list.splice(-1,1)
    }

    window.open('https://www.baidu.com/s?ie=utf8&oe=utf8&tn=98010089_dg&ch=11&wd='+inputValue.value,'_blank');
  }
}
</script>
<style lang="scss">
/*
 * 作者:helang
 * 邮箱:helang.love@qq.com
 * jQuery插件库:http://www.jq22.com/mem395541
 * CSDN博客:https://blog.csdn.net/u013350495
 * 微信公众号:web-7258
 */
.input_pane{
  display: flex;
  width: 100%;
  position: relative;
  &:after{
    content: '';
    display: block;
    clear:both;
  }
  &>div{
    float: left;
  }
  .logo{
    width: 100%;
    height: 120px;
    margin: 0 auto 10px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: auto 120px;
    background-image:url('/src/assets/baidu.png')
  }
  .classificationButton{
    position: relative;
    height:38px;
    border-radius: 4px;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:row;
    color:var(--ep-text-color-primary);
    font-size:16px;
    background:rgba(0,0,0,0.02);
    border:1px solid rgba(0,0,0,0.05);
    font-family:microsoft yahei;
    user-select:none;
    -webkit-user-drag:none;
    padding-right:8px;
    overflow: hidden;
    cursor:pointer;
    &>.classificationPhoto{
      transform: translateY(-60px);
      filter: drop-shadow(rgba(0,0,0,0.15) 0 60px);
      pointer-events:none;
      width:20px;
      height:18px;
      margin:8px;
      background:url('/src/assets/menu.svg');
    }
    &:hover{
      background:rgba(0,0,0,0.05);
    }
  }
  .input{
    margin-left:15px;
    position: relative;
    width: 400px;
    height: 40px;
    &>input{
      box-sizing:border-box;
      border: #c4c7ce solid 2px;
      border-right:none;
      outline: none;
      padding: 0 78px 0 10px;
      margin: 0;
      height: 100%;
      width: 100%;
      color: var(--ep-text-color-primary);
      font-size: 16px;
      border-radius: 10px 0 0 10px;
      &::-webkit-input-placeholder{
        color:#999;
      }
      &:focus{
        border-radius:10px 0 0 0;
        border: #17A1FF solid 2px;
        transition: border 2s;
        border-right:none;
        border-bottom:none;
        padding-bottom:2px;
      }
    }
    .picker{
      width: 40px;
      padding-right: 30px;
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      line-height: 40px;
      cursor: pointer;
      color: #999;
      font-size: 12px;
      text-align: right;
      background-image: url('/src/assets/down.png');
      background-position: 50px center;
      background-repeat: no-repeat;
      user-select: none;
    }
    .picker-list{
      z-index:999;
      list-style: none;
      padding: 5px 0;
      width: 100px;
      position: absolute;
      right: 0;
      top: 46px;
      margin: 0;
      line-height: 26px;
      font-size: 12px;
      border-radius: 2px;
      box-shadow: 0 1px 5px rgba(0,0,0,.2);
      background-color: #fff;
      display: none;
      color:var(--ep-text-color-primary);
      &>li{
        padding-left: 36px;
        background-position: 10px center;
        background-repeat: no-repeat;
        background-size: 16px auto;
        &:hover{
          background-color: #ebf1f5;
          cursor: pointer;
        }
        &.baidu{
          background-image: url('/src/assets/ico_baidu.png')
        }
        &.sogou{
          background-image: url('/src/assets/ico_sogou.png')
        }
        &.bing{
          background-image: url('/src/assets/ico_bing.png')
        }
        &.google{
          background-image: url('/src/assets/ico_google.ico')
        }
      }
    }
    &:has(.picker:focus) .picker-list{
      display:block;
    }
    &:has(input:focus) .picker-list{
      display:none;
    }
    &:has(input:focus) .hot-list{
      visibility:visible;
      border: #17A1FF solid 2px;
      border-top: none;
      transition: border 2s;
      .line{
        background-color:rgba(0,0,0,0.1);
        transition: background-color 2s;
      }
    }
    .hot-list{
      .line{
        height:1px;
        padding:0;
        background-color: transparent;
        margin:0 auto 10px auto;
        width:calc(100% - 20px);
      }
      &:has(.dataItem) .noData{
        display:none;
      }
      .noData{
        display:block;
      }
      visibility:collapse;
      box-sizing:border-box;
      border: #c4c7ce solid 2px;
      border-top: none;
      z-index:999;
      padding: 0 0 10px 0;
      width: calc(100% + 2px);
      position: absolute;
      left: 0;
      top: 40px;
      margin: 0;
      line-height: 32px;
      font-size: 14px;
      border-radius: 0 0 10px 10px;
      // box-shadow: 0 1px 5px rgba(0,0,0,.2);
      background-color: #fff;
      &>div{
        display: flex;
        flex-direction:row;
        justify-content:cneter;
        align-items:center;
        text-decoration: none;
        padding: 0 10px;
        overflow: hidden;
        &:hover{
          background-color: #f3f3f3;
          .hot_list_delete_item{
            visibility:visible;
          }
        }
        .hot_list_delete_item{
          visibility:collapse;
        }
        &>div{
          float: left;
          &.number{
            text-align: center;
            width: 40px;
          }
        }
      }
    }
  }
  .search{
    width: 89px;
    height: 40px;
    background-color: #17A1FF;
    background-image: url('/src/assets/search.png');
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 0 10px 10px 0;
    outline:none;
    cursor: pointer;
    transition:all 0.3s;
    &:hover{
      transition:all 0.3s;
      opacity: .9;
    }
  }
}

.ep-tabs__item{
	font-size: 12px;
}
</style>
<style lang="scss">
.dark .input_pane{
  .classificationButton{
    background:rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.05);
    &>.classificationPhoto{
      filter: drop-shadow(rgba(255,255,255,0.15) 0 60px);
    }
  }
  .input{
    .hot-list{
      background:#3b3b3b;
      &>div:hover{
        background:#2b2b2b;
      }
    }
    .picker-list{
      background:#3b3b3b;
      &>li{
        padding-left: 36px;
        background-position: 10px center;
        background-repeat: no-repeat;
        background-size: 16px auto;
        &:hover{
          background-color: #2b2b2b;
          cursor: pointer;
        }
        &.baidu{
          background-image: url('/src/assets/ico_baidu.png')
        }
        &.sogou{
          background-image: url('/src/assets/ico_sogou.png')
        }
        &.bing{
          background-image: url('/src/assets/ico_bing.png')
        }
        &.google{
          background-image: url('/src/assets/ico_google.ico')
        }
      }
    }
  }
}
</style>