<template>
  <div class="absolute flex justify-center w-full top-100px">
    <div ref="carouselRef" class="carousel-container">
      <div ref="carouselListRef" class="carousel-list">
        <div v-for="item in options.arr" class="carousel-item">{{ item.text }}</div>
      </div>
      <div class="indicator">
        <span class="active"></span>
        <span></span>
        <span></span>
      </div>
      <div class="carousel-arrow carousel-arrow-left z-1 bg-#eeeeee40 w-20px h-20px" @click="moveLeft"><</div>
      <div class="carousel-arrow carousel-arrow-right z-1 bg-#eeeeee40 w-20px h-20px" @click="moveRight">></div>
    </div>
    <div class="pointer"></div>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeUnmount, onMounted,reactive,ref,watch } from 'vue';
  const carouselRef = ref()
  const carouselListRef = ref()
  const currentIndex = ref(0)
  const options = reactive<{arr:any[]}>({arr:[]})
  let position = 0//控制滑动动画
  let marginLeft = 0//控制位置
  let leftGap = 0
  let percent = 10//item的宽度百分比
  options.arr.push({text:-3})
  options.arr.push({text:-2})
  options.arr.push({text:-1})
  options.arr.push({text: 0})
  options.arr.push({text:+1})
  options.arr.push({text:+2})
  options.arr.push({text:+3})
  let keepNumber = Math.floor(options.arr.length/2)
  onMounted(()=>{
    carouselListRef.value.style.setProperty('--item-width',percent+'%')
    marginLeft = -percent*Math.floor(options.arr.length/2)
    leftGap = (100-percent)/2
    carouselListRef.value.style.marginLeft = marginLeft+leftGap+'%'
    carouselListRef.value.addEventListener('transitionend',onTransitionendEnd)
  })
  onBeforeUnmount(()=>{
    carouselListRef.value.removeEventListener('transitionend',onTransitionendEnd)
  })
  function moveLeft(){
    position += percent
    carouselListRef.value.style.transform=`translateX(${position}%)`
    if(position+marginLeft+percent*keepNumber>=0){
      marginLeft -= percent
      carouselListRef.value.style.marginLeft = marginLeft+leftGap+'%'
      options.arr.unshift({text:marginLeft/percent})
    }
    currentIndex.value = -position/percent
  }
  function moveRight(){
    position-=percent
    carouselListRef.value.style.transform=`translateX(${position}%)`
    if(-position>=marginLeft+(options.arr.length-keepNumber)*percent){
      options.arr.push({text:((keepNumber*percent-position)/percent)})
    }
    currentIndex.value = -position/percent
  }
  function onTransitionendEnd(event:TransitionEvent){
    for(let i=0;i<options.arr.length;i++){
      if(options.arr[i].text>currentIndex.value+keepNumber){
        options.arr.splice(i--,1)
      }
    }
    for(let i=options.arr.length-1;i>=0;i--){
      if(options.arr[i].text<currentIndex.value-keepNumber){
        marginLeft += percent
        carouselListRef.value.style.marginLeft = marginLeft + leftGap+'%'
        options.arr.splice(i++,1)
      }
    }
  }
  watch(currentIndex,()=>{
    console.log(currentIndex.value)
  })
</script>
<style lang="scss">
.carousel-container{
  outline:1px solid red;
  width: 100%;
  height: 60px;
  position: absolute;
  overflow: hidden;
  .carousel-list{
    --item-width:100%;
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 2s ease-in-out;
    .carousel-item{
      box-sizing: border-box;
      border:1px solid #0f0;
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
    display: flex;
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
.pointer{
  position: absolute;
  left:50%;
  transform: translateX(-50%);
  top:100%;
  width: 20px;
  height: 20px;
  background:white;
}
</style>