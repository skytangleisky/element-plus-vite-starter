<template>
  <div class="my-carousel">
    <div ref="carouselRef" class="carousel-container">
      <div ref="carouselListRef" class="carousel-list">
        <div v-for="item in options.arr" class="carousel-item" @click="click(item)">
          <slot
            name="default"
            :data="item"
            :currentIndex="currentIndex">
            {{ item.index }}
          </slot>
        </div>
      </div>
      <div class="indicator">
        <span class="active"></span>
        <span></span>
        <span></span>
      </div>
      <div class="carousel-arrow carousel-arrow-left z-1 bg-#eeeeee40 w-20px h-20px" @click="moveLeft"><</div>
      <div class="carousel-arrow carousel-arrow-right z-1 bg-#eeeeee40 w-20px h-20px" @click="moveRight">></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted,reactive,ref,watch } from 'vue';
  const carouselRef = ref()
  const carouselListRef = ref()
  const mode = ref<'infinite'|'finite'>('infinite')
  let changeType:'auto'|'click' = 'auto'// 自动触发还是点击触发
  const currentIndex = defineModel('currentIndex',{type:Number,default:0})
  const options = reactive<{arr:any[]}>({arr:[]})
  let leftGap = 0
  let percent = defineModel('percent',{type:Number,default:100})
  watch(percent,(newValue,oldValue)=>{
    position = -currentIndex.value*percent.value
    carouselListRef.value.style.transition='none'
    carouselListRef.value.style.transform=`translateX(${position}%)`
    carouselListRef.value.clientWidth
    carouselListRef.value.style.transition='transform 0.5s ease-in-out'
    marginLeft = -position
    carouselListRef.value.style.setProperty('--item-width',newValue+'%')
    leftGap = -options.arr.length*percent.value/2 + 50
    carouselListRef.value.style.marginLeft = marginLeft+leftGap+'%'
  })
  const keepNumber = defineModel('keepNumber',{type:Number,default:4})
  watch(keepNumber,(newValue,oldValue)=>{
    options.arr = []
    options.arr.push({index: currentIndex.value})
    for(let i=1;i<=newValue;i++){
      options.arr.unshift({index: currentIndex.value - i})
      options.arr.push({index: currentIndex.value + i})
    }
    carouselListRef.value.style.setProperty('--item-width',percent.value+'%')
    marginLeft = -position
    leftGap = -options.arr.length*percent.value/2 + 50
    carouselListRef.value.style.marginLeft = marginLeft+leftGap+'%'
  })
  let position = 0//控制滑动动画
  let marginLeft = 0//控制位置
  onMounted(()=>{
    options.arr.push({index: currentIndex.value})
    for(let i=1;i<=keepNumber.value;i++){
      options.arr.unshift({index: currentIndex.value-i})
      options.arr.push({index: currentIndex.value+i})
    }
    position = -currentIndex.value*percent.value
    marginLeft = -position

    carouselListRef.value.style.transition='none'
    carouselListRef.value.style.transform=`translateX(${position}%)`
    carouselListRef.value.clientWidth
    carouselListRef.value.style.transition='transform 0.5s ease-in-out'

    carouselListRef.value.style.setProperty('--item-width',percent.value+'%')
    leftGap = -options.arr.length*percent.value/2 + 50
    carouselListRef.value.style.marginLeft = marginLeft+leftGap+'%'
    carouselListRef.value.addEventListener('transitionend',onTransitionendEnd)
  })
  onBeforeUnmount(()=>{
    carouselListRef.value.removeEventListener('transitionend',onTransitionendEnd)
  })
  function moveLeft(){
    if(mode.value=='infinite'){
      position += percent.value
      carouselListRef.value.style.transform=`translateX(${position}%)`
      marginLeft -= percent.value
      carouselListRef.value.style.marginLeft = marginLeft+leftGap+'%'
      options.arr.unshift({index:-Math.round(position/percent.value)-keepNumber.value})
    }else if(mode.value=='finite'){
      console.log('finite')
    }
  }
  function moveRight(){
    if(mode.value == 'infinite'){
      position-=percent.value
      carouselListRef.value.style.transform=`translateX(${position}%)`
      options.arr.push({index:-Math.round(position/percent.value)+keepNumber.value})
    }else if(mode.value == 'finite'){
      console.log('finite')
    }
  }
  function onTransitionendEnd(event:TransitionEvent){
    for(let i=0;i<options.arr.length;i++){
      if(options.arr[i].index>currentIndex.value+keepNumber.value){
        options.arr.splice(i--,1)
      }
    }
    for(let i=options.arr.length-1;i>=0;i--){
      if(options.arr[i].index<currentIndex.value-keepNumber.value){
        marginLeft += percent.value
        carouselListRef.value.style.marginLeft = marginLeft + leftGap+'%'
        options.arr.splice(i++,1)
      }
    }
  }
  function click(item:any){
    changeType = 'click'
    currentIndex.value = item.index
    nextTick(()=>{
      changeType = 'auto'
    })
  }
  const emit = defineEmits(['change'])
  watch(currentIndex,(newValue,oldValue)=>{
    let N = (newValue - oldValue)
    if(N>0){
      for(let i=0;i<N;i++){
        moveRight()
      }
    }else{
      for(let i=0;i<-N;i++){
        moveLeft()
      }
    }
    emit('change',newValue,oldValue,changeType)
  })
</script>
<style lang="scss">
.dark .my-carousel{
  background:#80808080;
}
.my-carousel{
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  background:#ffffff80;
  border:1px solid black;
  padding:0 0px;;
  border-radius:10px;
  position: relative;
  line-height: 30px;
  // &::before{
  //   content:'';
  //   position: absolute;
  //   width: 4px;
  //   height: 10px;
  //   left:50%;
  //   transform: translateX(-50%);
  //   background:#f00;
  //   height: 30px;
  //   z-index: 1;
  // }
  .carousel-container{
    width: 100%;
    height: fit-content;
    overflow: hidden;
    .carousel-list{
      --item-width:100%;
      display: flex;
      width: 100%;
      transition: transform 1s ease-in-out;
      .carousel-item{
        flex-shrink: 0;
        width: var(--item-width);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .carousel-arrow{
      position: absolute;
      display: none;
      align-items: center;
      justify-content: center;
      border-radius:50%;
      top:50%;
      transform: translateY(-50%);
      &.carousel-arrow-left{
        left:0;
      }
      &.carousel-arrow-right{
        right:0;
      }
    }
  }
}
</style>