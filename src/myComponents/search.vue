<template>
  <div class="input_pane">
    <div class="logo" style="display:none;"></div>
    <div style="display:flex;flex-direction:column;width:100%;">
      <div style="display:flex;justify-content: center;">
        <div class="classificationButton"><div class="classificationPhoto" />{{ t('tl.classification') }}</div>
        <div class="input">
          <input @click.stop type="text" placeholder="共35537张/昨日更新20张的内容" autocomplete="off" id="search-input">
          <div @click.stop class="picker">百度</div>
          <ul class="picker-list">
            <li class="baidu" data-logo="baidu.png">百度</li>
            <li class="sogou" data-logo="sogou.png">搜狗</li>
            <li class="bing" data-logo="bing.png">必应</li>
            <li class="google" data-logo="google.png">谷歌</li>
          </ul>
          <div class="hot-list"></div>
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
      activeName:'WebEffects',
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
          var str='';
          $.each(_this.hot.list,function (index,item) {
            str+='<a href="https://www.baidu.com/s?ie=utf8&oe=utf8&tn=98010089_dg&ch=11&wd='+item+'" target="_blank">'
              +'<div class="number" style="color: '+_this.hot.color[index]+'">'+(index+1)+'</div>'
              +'<div>'+item+'</div>'
              +'</a>';
          });
          return str;
        });

        /* 注册事件 */
        /* 搜索类别选择按钮 */
        this.els.pickerBtn.click(function () {
          _this.els.hotList.hide();
          _this.els.pickerList.show();
        });
        /* 搜索类别选择列表 */
        this.els.pickerList.on("click",">li",function () {
          _this.els.logo.css("background-image",("url('/src/assets/"+$(this).data("logo")+"')"));
          _this.els.pickerBtn.html($(this).html())
          _this.searchIndex=$(this).index();
        });
        /* 搜索 输入框 点击*/
        this.els.input.click(function () {
          if(!$(this).val()){
            _this.els.hotList.show();
          }
        });
        /* 搜索 输入框 输入*/
        this.els.input.on("input",function () {
          if($(this).val()){
            _this.els.hotList.hide();
          }
        });
        this.els.input.bind('input propertychange change',function(){
          var a = $(this).val()
          if(a===undefined||a===''){
            _this.els.hotList.show();
          }
        })
        /* 搜索按钮 */
        this.els.button.click(function () {
          var searchArr=['百度','搜狗','必应','谷歌'];
          alert(searchArr[_this.searchIndex]+"搜索："+_this.els.input.val());
        });
        /* 文档 */
        $(document).click(function () {
          _this.els.pickerList.hide();
          _this.els.hotList.hide();
        });
        /* 搜索按钮 */
      }
    };
    $(function(){
      helangSearch.init();
    })
  },
  methods: {
    handleClick(){}
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
    height: 40px;
    border-top: #17A1FF solid 1px;
    border-right: none;
    border-bottom: #17A1FF solid 1px;
    border-left: #17A1FF solid 1px;
    border-radius: 4px 0 0 4px;
    &>input{
      outline: none;
      border: none;
      padding: 0 80px 0 10px;
      margin: 0;
      height: 100%;
      width: 410px;
      color: #333;
      font-size: 16px;
      border-radius: 4px 0 0 4px;
      &::-webkit-input-placeholder{
        color:#999;
      }
    }
    .hot-list{
      z-index:999;
      padding: 10px 0;
      width: 100%;
      position: absolute;
      left: 0;
      top: 46px;
      margin: 0;
      line-height: 32px;
      font-size: 14px;
      border-radius: 2px;
      box-shadow: 0 1px 5px rgba(0,0,0,.2);
      background-color: #fff;
      display: none;
      &>a{
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
.dark .container{
  .classificationButton{
    background:rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.05);
    &>.classificationPhoto{
      filter: drop-shadow(rgba(255,255,255,0.15) 0 60px);
    }
  }
}
</style>