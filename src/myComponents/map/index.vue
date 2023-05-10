<template>
  <canvas ref="canvas" style="position:absolute;outline:none;left:0;top:0;width:100%;height:100%;"></canvas>
  <canvas ref="webgpu" style="position:absolute;outline:none;left:0;top:0;width:100%;height:100%;pointer-events: none ;"></canvas>
</template>
<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { MapLayer, BorderLayer, PointLayer, RouteLayer } from './layers'
  import { gsap, Power3 } from 'gsap'
  import { windowToCanvas, pixel2Lng, pixel2Lat, lng2Pixel, lat2Pixel } from './js/core'
  import { useSettingStore } from '~/stores/setting'
  import run from '~/webgpu/imageTexture'
  import { Engine3D, Scene3D, Object3D, Camera3D, DirectLight, HoverCameraController, Color, View3D, AtmosphericComponent } from "@orillusion/core"
  const setting = useSettingStore()
  let first = true
  const mapLayer = new MapLayer()
  const borderLayer = new BorderLayer()
  const pointLayer = new PointLayer()
  const routeLayer = new RouteLayer()
  let canvas = ref(null)
  let webgpu = ref(null)
  let cvs:HTMLCanvasElement
  let ctx:CanvasRenderingContext2D
  interface Struct{
    imgX:number
    imgY:number
    L:number
    targetL:number
  }
  interface Pos{
    x:number
    y:number
    targetX:number
    targetY:number
  }
  let tileWidth = 256
  const obj:Struct = { imgX: 0, imgY:0, L:11, targetL:11 }
  let change:undefined|string = undefined
  let isMouseDown:boolean = false
  const minLevel = 0
  const maxLevel = 22
  let mousemove:Pos
  let tweenWheel:gsap.core.Tween
  let tween:gsap.core.Tween
  let pos:Pos
  let posl:Pos
  let currentLngLat:{
    lng:number
    lat:number
  }
  let newPos:{
    x:number
    y:number
  }
  onMounted(()=>{
    if(canvas.value){
      cvs = canvas.value
    }else{
      throw new Error('invalid cvs')
    }
    let tmp = cvs.getContext('2d')
    if(tmp){
      ctx = tmp
    }else{
      throw new Error('invalid ctx')
    }
    // demo()
    if(webgpu.value)
      run(webgpu.value)
    window.addEventListener('message',test)
    // this.mapLayer.setSource({url:'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'})
    // mapLayer.setSource({url:'/map1/{z}/{y}/{x}'})
    mapLayer.setSource({url:'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}'})
    // this.mapLayer.setSource({url:'/data/google/terrain/Guangzhou/{z}/{x}/{y}.jpg'},)
    init()
    new ResizeObserver(()=>{
      let rect = cvs.getBoundingClientRect()
      cvs.width = rect.width
      cvs.height = rect.height
      limitScale()
      limitRegion()
      if(first){
        first = false
        let POINT = {lng:113.42165142106768,lat:23.098844381632485}
        obj.imgX = cvs.width/2-tileWidth*2**obj.L*(POINT.lng+180)/360
        obj.imgY = cvs.height/2-(1-Math.asinh(Math.tan(POINT.lat*Math.PI/180))/Math.PI)/2*(2**obj.L)*tileWidth
        localStorage.L&&(obj.targetL=obj.L=Number(localStorage.L))
        if(localStorage.center){
          var center = JSON.parse(localStorage.center)
          obj.imgX = cvs.width/2-(center[0]+180)/360*tileWidth*(2**obj.L)
          obj.imgY = cvs.height/2-(1-Math.asinh(Math.tan(center[1]*Math.PI/180))/Math.PI)/2*(2**obj.L)*tileWidth
        }
      }
      loadMap()
    }).observe(cvs)
    cvs.addEventListener('mousewheel',mousewheelFunc,{passive:true});
    cvs.addEventListener('mousedown',mousedownFunc,{passive:true});
    document.addEventListener('mouseup',mouseupFunc,{passive:true});
    document.addEventListener('mousemove',mousemoveFunc,{passive:true});
  })
  onBeforeUnmount(()=>{
    window.removeEventListener('message',test)
  })
  const demo = async() =>{
    if(webgpu.value==null)
      throw new Error('invalid webgpu')
    // initializa engine
    await Engine3D.init({
      canvasConfig:{
        canvas: webgpu.value
      }
    });
    // create new scene as root node
    let scene3D = new Scene3D();
    // add an Atmospheric sky enviroment
    let sky = scene3D.addComponent(AtmosphericComponent);
    sky.enable=false
    sky.sunY = 0.6;
    // create camera
    let cameraObj = new Object3D();
    let camera = cameraObj.addComponent(Camera3D);
    // adjust camera view
    camera.perspective(60, Engine3D.aspect, 1, 5000.0);
    // set camera controller
    let controller = cameraObj.addComponent(HoverCameraController);
    controller.setCamera(0, -20, 15);
    // add camera node
    scene3D.addChild(cameraObj);
    // create light
    let light = new Object3D();
    // add direct light component
    let component = light.addComponent(DirectLight);
    // adjust lighting
    light.rotationX = 45;
    light.rotationY = 30;
    component.lightColor = new Color(1.0, 1.0, 1.0, 1.0);
    component.intensity = 1;
    // add light object
    scene3D.addChild(light);

    let dragon = await Engine3D.res.loadGltf('https://cdn.orillusion.com/PBR/DragonAttenuation/DragonAttenuation.gltf');
    scene3D.addChild(dragon);

    // create a view with target scene and camera
    let view = new View3D();
    view.scene = scene3D;
    view.camera = camera;
    // start render
    Engine3D.startRenderView(view);
  }
  const init = () => {
    if(setting.loadmap){
      mapLayer.show()
    }else{
      mapLayer.hide()
    }
    if(setting.district){
      borderLayer.show()
    }else{
      borderLayer.hide()
    }
    if(setting.navigation){
      pointLayer.show()
    }else{
      pointLayer.hide()
    }
    if(setting.airline){
      routeLayer.show()
    }else{
      routeLayer.hide()
    }
  }
  const test = (e:MessageEvent) => {
    if(e.data.type=='自定义'){
      if(e.data.obj.name=='瓦片地图'){
        if(e.data.obj.leftImgSrc){
          mapLayer.show()
          setting.setloadMap(true)
        }else{
          mapLayer.hide()
          setting.setloadMap(false)
        }
        loadMap()
      }else if(e.data.obj.name=='行政区划'){
        if(e.data.obj.leftImgSrc){
          borderLayer.show()
          setting.district=true
        }else{
          borderLayer.hide()
          setting.district=false
        }
        loadMap()
      }else if(e.data.obj.name=='导航台'){
        if(e.data.obj.leftImgSrc){
          pointLayer.show()
          setting.navigation=true
        }else{
          pointLayer.hide()
          setting.navigation=false
        }
        loadMap()
      }else if(e.data.obj.name=='航线'){
        if(e.data.obj.leftImgSrc){
          routeLayer.show()
          setting.airline=true
        }else{
          routeLayer.hide()
          setting.airline=false
        }
        loadMap()
      }
    }
  }
  const draw = (time:number) => {
    ctx.save()
    ctx.clearRect(0,0,cvs.width,cvs.height)
    mapLayer.render(obj,ctx)
    borderLayer.render(obj,ctx)
    pointLayer.render(obj,ctx)
    routeLayer.render(obj,ctx)
    ctx.restore()
  }
  const loadMap = () => {
    mapLayer.loadMap(obj,change,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      requestAnimationFrame(draw)
    })
    borderLayer.loadMap(obj,change,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      requestAnimationFrame(draw)
    })
    pointLayer.loadMap(obj,change,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      requestAnimationFrame(draw)
    })
    routeLayer.loadMap(obj,change,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      requestAnimationFrame(draw)
    })
  }
  const mousedownFunc = (event:MouseEvent) => {
    obj.targetL = obj.L
    tween&&tween.kill()
    isMouseDown=true
    // panel&&panel.mousedownFunc(event)
    let tmp = windowToCanvas(event.clientX, event.clientY,cvs)
    mousemove = {x:tmp.x,y:tmp.y,targetX:tmp.x,targetY:tmp.y}
    pos = mousemove
    newPos = {x:((mousemove.x-obj.imgX)/2**obj.L)/tileWidth , y:((mousemove.y-obj.imgY)/2**obj.L)/tileWidth}
  }
  const mousemoveFunc = (evt:MouseEvent) => {
    let move = windowToCanvas(evt.clientX, evt.clientY,cvs)
    currentLngLat={
      lng: pixel2Lng(move.x,obj.imgX,2**obj.L,tileWidth),
      lat: pixel2Lat(move.y,obj.imgY,2**obj.L,tileWidth),
    }
    // drawScale(2**obj.L,cvs_scale,pixel2Lat(move.y,obj.imgY,2**obj.L,tileWidth))
    // this.drawCurrentLngLat()
    // panel&&divMask.addEventListener('mousemove',panel.mousemoveFunc,{passive:false})
    if(isMouseDown){
      let tmp = windowToCanvas(evt.clientX, evt.clientY,cvs)
      posl = {x:tmp.x,y:tmp.y,targetX:tmp.x,targetY:tmp.y}
      var x = posl.x - pos.x, y = posl.y - pos.y
      mousemove.targetX += x
      mousemove.targetY += y
      pos = JSON.parse(JSON.stringify(posl))
      let period=1
      // if(config.动画){
      //   period=1
      // }else{
      //   period=0
      // }
      tween&&tween.kill()
      tween = gsap.to(mousemove,{
        duration:period,
        x:mousemove.targetX,
        y:mousemove.targetY,
        onUpdate: ()=>{
          obj.imgX=mousemove.x - (2**obj.L)*newPos.x*tileWidth
          obj.imgY=mousemove.y - (2**obj.L)*newPos.y*tileWidth
          limitRegion()
          loadMap()
          // emitter.emit('mapChange',obj)
          // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
          // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
          localStorage.L=obj.L
          localStorage.center=JSON.stringify([pixel2Lng(cvs.width/2,obj.imgX,2**obj.L,tileWidth),pixel2Lat(cvs.height/2,obj.imgY,2**obj.L,tileWidth)])
        },
        ease:Power3.easeOut
      })
    }
  }
  const mouseupFunc = (evt:MouseEvent) => {
    if(isMouseDown){
      loadMap()
      // windy&&windy.start(
      //     [[0,0],[canvas.width, canvas.height]],
      //     canvas.width,
      //     canvas.height,
      //     [[pixel2Lng(0,obj.imgX,2**obj.L,tileWidth), pixel2Lat(canvas.height,obj.imgY,2**obj.L,tileWidth)],[pixel2Lng(canvas.width,obj.imgX,2**obj.L,tileWidth), pixel2Lat(0,obj.imgY,2**obj.L,tileWidth)]]
      // )
      isMouseDown=false
      // panel&&panel.mouseupFunc(evt)
    }
  }
  const mousewheelFunc = (event:any) => {
    if(!isMouseDown||!mousemove){
      let tmp = windowToCanvas(event.clientX, event.clientY,cvs)
      mousemove = {x:tmp.x,y:tmp.y,targetX:tmp.x,targetY:tmp.y}
    }
    // drawScale(2**obj.L,cvs_scale,pixel2Lat(mousemove.y,obj.imgY,2**obj.L,tileWidth))
    newPos = {x:((mousemove.x-obj.imgX)/(2**obj.L))/tileWidth , y:((mousemove.y-obj.imgY)/(2**obj.L))/tileWidth}
    // console.log(event.wheelDeltaY)
    let delta = event.wheelDeltaY/120
    change = event.wheelDeltaY>0?'zoom in':'zoom out'
    obj.targetL+=delta
    limitScale()
    let period=1
    // if(config.动画){
    //   period=1
    // }else{
    //   period=0
    // }
    tweenWheel = gsap.to(obj, {
      duration:period,
      L: obj.targetL,
      onUpdate: ()=>{
        obj.imgX=mousemove.x - (2**obj.L)*newPos.x*tileWidth
        obj.imgY=mousemove.y - (2**obj.L)*newPos.y*tileWidth
        // 层级.setValue(this.obj.L.toFixed(2))
        localStorage.L=obj.L
        localStorage.center=JSON.stringify([pixel2Lng(cvs.width/2,obj.imgX,2**obj.L,tileWidth),pixel2Lat(cvs.height/2,obj.imgY,2**obj.L,tileWidth)])
        limitRegion()
        loadMap()
        // emitter.emit('mapChange',obj)
        // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
        // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
      },
      ease:Power3.easeOut
    })
  }
  const limitRegion = () => {
    // if(config.限制){
      // if(this.obj.imgX>0){
      //   this.obj.imgX=0
      // }else if(this.obj.imgX<canvas.width-this.tileWidth*2**this.obj.L){
      //   this.obj.imgX = (canvas.width-this.tileWidth*2**this.obj.L)
      // }
      if(obj.imgY>0){
        obj.imgY=0
      }else if(obj.imgY<cvs.height-tileWidth*2**obj.L){
        obj.imgY = (cvs.height-tileWidth*2**obj.L)
      }
    // }
    // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
    // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
  }
  const limitScale = () => {
    //下面5行代码是限制地图缩放等级
    if(obj.targetL<Math.max(0,minLevel)){
      obj.targetL=Math.max(0,minLevel)
    }else if(obj.targetL>maxLevel){
      obj.targetL=maxLevel
    }
    // 下面7行代码是让地图不能缩放得太小，并且最小时地图不能因放大而模糊。
    let tmpL = Math.ceil(Math.log(Math.max(cvs.width,cvs.height)/tileWidth)/Math.log(2))
    if(obj.targetL<tmpL){
      obj.targetL = tmpL
    }
    if(obj.L<tmpL){
      obj.L = tmpL
    }
  }
</script>
<style>

</style>