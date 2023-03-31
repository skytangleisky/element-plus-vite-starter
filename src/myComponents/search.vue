<template>
  <div class="input_pane">
    <div class="logo" style="display:none;"></div>
    <div style="display:flex;flex-direction:column;width:100%;margin-top:10px;padding:10px 0;">
      <div style="display:flex;justify-content: center;">
        <div class="classificationButton"><div class="classificationPhoto" />{{ t('tl.classification') }}</div>
        <div class="input">
          <input v-model.sync="inputValue" type="text" placeholder="共35537张/昨日更新20张的内容" autocomplete="off" id="search-input">
          <div class="picker" tabindex="-1">百度</div>
          <ul class="picker-list">
            <li v-for="(item,key) in searchArr" @mousedown.native="picker_list_click(item)" :class="item.class">{{ item.value }}</li>
          </ul>
          <div @mousedown.stop class="hot-list">
            <div class="line"></div>
            <div v-for="(item,key) in list" @mousedown.native="hot_list_mousedown(item)" target="_blank">
              <div class="number" :style="'color:'+color[key]">{{ key+1 }}</div><div>{{ item }}</div>
            </div>
          </div>
        </div>
        <div class="search"></div>
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane v-for="(item,k) in options" :label="t('tl.'+item.name)" :name="item.name">{{ t('tl.'+item.name) }}.</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { useLocale } from 'element-plus'
const { t } = useLocale()
</script>
<script>
export default{
  data(){
    return{
      inputValue:'',
      color:['#ff2c00','#ff5a00','#ff8105','#fd9a15','#dfad1c','#6bc211','#3cc71e','#3cbe85','#51b2ef','#53b0ff'],
      activeName:'WebEffects',
      list:[
        '网页特效',
        'jQuery特效',
        'web前端代码',
        '图片轮播',
        '图片切换',
        '响应式布局',
        '表单美化',
        '评论',
        'QQ表情'
      ],
      searchArr:[{class:'baidu',value:'百度'},{class:'sogou',value:'搜狗'},{class:'bing',value:'必应'},{class:'google',value:'谷歌'}],
      options:[
        {
          name:'WebEffects'
        },
        {
          name:'FlushMaterial'
        },
        {
          name:'html5css3'
        },
        {
          name:'WebTemplates'
        },
        {
          name:'WebMaterial'
        },
        {
          name:'WholeSiteSourceCode'
        },
        {
          name:'AnimationCode'
        },
        {
          name:'StyleDesign'
        }
      ]
    }
  },
  mounted(){
    /*
    * 作者:helang
    * 邮箱:helang.love@qq.com
    * jQuery插件库:http://www.jq22.com/mem395541
    * CSDN博客:https://blog.csdn.net/u013350495
    * 微信公众号:web-7258
    */

    /* 搜索 */
    var helangSearch={
      /* 元素集 */
      els:{},
      /* 搜索类型序号 */
      searchIndex:0,
      /* 火热的搜索列表 */
      hot:{
        /* 颜色 */
        color:['#ff2c00','#ff5a00','#ff8105','#fd9a15','#dfad1c','#6bc211','#3cc71e','#3cbe85','#51b2ef','#53b0ff'],
        /* 列表 */
        list:[
          '网页特效',
          'jQuery特效',
          'web前端代码',
          '图片轮播',
          '图片切换',
          '响应式布局',
          '表单美化',
          '评论',
          'QQ表情'
        ]
      },
      /* 初始化 */
      init:function(){
        var _this=this;
        this.els={
          pickerBtn:$(".picker"),
          pickerList:$(".picker-list"),
          logo:$(".logo"),
          hotList:$(".hot-list"),
          input:$("#search-input"),
          button:$(".search")
        };

        /* 设置热门搜索列表 */
        this.els.hotList.html(function () {
          var str='<div class="line"></div>';
          $.each(_this.hot.list,function (index,item) {
            str+='<a href="https://www.baidu.com/s?ie=utf8&oe=utf8&tn=98010089_dg&ch=11&wd='+item+'" target="_blank">'
              +'<div class="number" style="color: '+_this.hot.color[index]+'">'+(index+1)+'</div>'
              +'<div>'+item+'</div>'
              +'</a>';
          });
          return str;
        });

        /* 搜索类别选择列表 */
        this.els.pickerList.find(">li").mousedown(function(){
          _this.els.logo.css("background-image",("url('/src/assets/"+$(this).data("logo")+"')"));
          _this.els.pickerBtn.html($(this).html())
          _this.searchIndex=$(this).index();
        });
        /* 搜索 输入框 点击*/
        this.els.input.mousedown(function () {
          if(!$(this).val()){
            // _this.els.hotList.show();
          }
        });
        /* 搜索 输入框 输入*/
        this.els.input.on("input",function () {
          if($(this).val()){
            // _this.els.hotList.hide();
          }
        });
        this.els.input.bind('input propertychange change',function(){
          var a = $(this).val()
          if(a===undefined||a===''){
            // _this.els.hotList.show();
          }
        })
        /* 搜索按钮 */
        this.els.button.click(function () {
          var searchArr=['百度','搜狗','必应','谷歌'];
          alert(searchArr[_this.searchIndex]+"搜索："+_this.els.input.val());
        });
      }
    };
    // $(function(){
    //   helangSearch.init();
    // })
  },
  watch:{
    inputValue(newVal){
      console.log(newVal)
    }
  },
  methods: {
    handleClick(){},
    hot_list_mousedown(item){
      window.open('https://www.baidu.com/s?ie=utf8&oe=utf8&tn=98010089_dg&ch=11&wd='+item,'_blank');
    },
    picker_list_click(item){
      $('.logo').css("background-image",("url('/src/assets/"+item.class+".png')"));
      $('.picker').html(item.value)
    }
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
  height:126px;
  border:1px solid red;
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
    height:40px;
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
    cursor:pointer;
    &>.classificationPhoto{
      transform: translateY(-60px);
      filter: drop-shadow(rgba(0,0,0,0.15) 0 60px);
      pointer-events:none;
      width:20px;
      height:18px;
      margin:8px;
      background:url('/src/assets/menu.svg')
    }
    &:hover{
      background:rgba(0,0,0,0.05);
    }
  }
  .input{
    margin-left:15px;
    position: relative;
    width: 500px;
    height: 42px;
    &>input{
      box-sizing:border-box;
      border: #c4c7ce solid 2px;
      border-right:none;
      outline: none;
      padding: 0 78px 0 10px;
      margin: 0;
      height: 100%;
      width: 100%;
      color: #333;
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
      line-height: 44px;
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
      color:black;
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
        background-color: transparent;
        margin:0 auto;
        width:calc(100% - 20px);
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
      top: 42px;
      margin: 0;
      line-height: 32px;
      font-size: 14px;
      border-radius: 0 0 10px 10px;
      // box-shadow: 0 1px 5px rgba(0,0,0,.2);
      background-color: #fff;
      &>div{
        display: block;
        color: #333;
        text-decoration: none;
        padding: 0 10px;
        overflow: hidden;
        &:hover{
          background-color: #f3f3f3;
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
    height: 42px;
    background-color: #17A1FF;
    background-image: url('/src/assets/search.png');
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 0 4px 4px 0;
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
}
</style>