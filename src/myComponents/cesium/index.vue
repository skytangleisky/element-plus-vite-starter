<script setup lang="ts">
  import * as Cesium from 'cesium';
  import 'cesium/Build/Cesium/Widgets/widgets.css';
  import ControlPane from '~/myComponents/ControlPane/index.vue';
  import { onMounted,ref,reactive, onBeforeUnmount,watch,toRefs } from 'vue';
  import { FPSTool } from '../zrender/tool';
  import { useCesiumStore } from '~/stores/cesium';
  import { isDark } from '~/composables';
  const cesiumStore = useCesiumStore();
  const fpsTool = new FPSTool();
  const fps = ref('0.00');
  const cesiumContainerRef = ref();
  let viewer:any;
  const gaodeImageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://tile.tanglei.site/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}',
  })
  onMounted(()=>{
    const viewer = new Cesium.Viewer(cesiumContainerRef.value,{
      navigationInstructionsInitiallyVisible:false,
      imageryProviderViewModels:[
        new Cesium.ProviderViewModel({
          name: '谷歌地图',
          iconUrl: 'https://tile.tanglei.site/maps/vt?lyrs=s&gl=CN&x=0&y=0&z=0', // 可以自定义图标
          tooltip: '谷歌地图',
          creationFunction: () => gaodeImageryProvider,  // 设置高德地图的提供者
        }),
      ],
      selectedImageryProviderViewModel:new Cesium.ProviderViewModel({
        name: '谷歌地图',
        iconUrl: 'https://tile.tanglei.site/maps/vt?lyrs=s&gl=CN&x=0&y=0&z=0',
        tooltip: '谷歌地图',
        creationFunction: () => gaodeImageryProvider,
      }),
      // navigationHelpButton:cesiumStore.navigationHelpButton,
      creditContainer:document.createElement("div"),
    })
    // viewer.imageryLayers.addImageryProvider(gaodeImageryProvider)
    viewer.scene.postRender.addEventListener(()=>{
      fpsTool.measure(performance.now(),(frameRate:number)=>{
        fps.value = frameRate.toFixed(2)
      })
    })
    watch(()=>cesiumStore.timeline,(val)=>{
      (viewer.timeline.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
      (viewer.animation.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
      (viewer.fullscreenButton.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
    },{immediate:true})
    watch(()=>cesiumStore.geocoder,(val)=>(viewer.geocoder.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse',{immediate:true})
    watch(()=>cesiumStore.homeButton,(val)=>((viewer.homeButton.container as HTMLDivElement).querySelector('.cesium-home-button') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse',{immediate:true})
    watch(()=>cesiumStore.homeButton,(val)=>((viewer.homeButton.container as HTMLDivElement).querySelector('.cesium-home-button') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse',{immediate:true})
    watch(()=>cesiumStore.sceneModePicker,(val)=>((viewer.sceneModePicker.container as HTMLDivElement).querySelector('.cesium-sceneModePicker-button3D') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse',{immediate:true})
    watch(()=>cesiumStore.baseLayerPicker,(val)=>(viewer.baseLayerPicker.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse',{immediate:true})
    watch(()=>cesiumStore.navigationHelpButton,(val)=>((viewer.navigationHelpButton.container as HTMLDivElement).querySelector('.cesium-navigationHelpButton-wrapper') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse',{immediate:true})
  })
  onBeforeUnmount(()=>{
    viewer && viewer.destroy()
  })
  const list = reactive([{label:'devtools',type:'folder',opened:true,children:[
    {
      label:'FPS',type:'curve',value:{
        fps:{
          value:fps,
          min:0,
          max:200,
          strokeStyle:'#fff'
        }
      }
    },
    {label:'timeline',value:toRefs(cesiumStore).timeline,type:'checkbox'},
    {label:'geocoder',value:toRefs(cesiumStore).geocoder,type:'checkbox'},
    {label:'homeButton',value:toRefs(cesiumStore).homeButton,type:'checkbox'},
    {label:'sceneModePicker',value:toRefs(cesiumStore).sceneModePicker,type:'checkbox'},
    {label:'baseLayerPicker',value:toRefs(cesiumStore).baseLayerPicker,type:'checkbox'},
    {label:'navigationHelpButton',value:toRefs(cesiumStore).navigationHelpButton,type:'checkbox'},
  ]}])
</script>
<template>
<div ref="cesiumContainerRef" class="cesiumContainer"></div>
<ControlPane class="absolute left-20px top-20px" :list="list" :theme="isDark?'default':'retro'"></ControlPane>
</template>
<style scoped lang="scss">
.cesiumContainer{
  position: absolute;
  inset: 0;
}
</style>