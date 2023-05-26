<template>
  <canvas ref="canvas" style="position:absolute;outline:none;left:0;top:0;width:100%;height:100%;"></canvas>
  <canvas ref="webgpu" style="position:absolute;outline:none;left:0;top:0;width:100%;height:100%;pointer-events: none ;"></canvas>
  <div tabindex="-1" class="tileSelect absolute right-20px top-20px" style="outline: none;">
    <div :style="'border-radius:50%;border:1px solid grey;background-position:-0px -0px;background-repeat:no-repeat;width:58px;height:58px;'+'background-image:url('+setting.tileUrl.replace('{x}','105').replace('{y}','48').replace('{z}','7')+');'" @click.native="testClick"></div>
    <div class="tileList">
      <div v-for="(v,k) in urls" :style="'border:1px solid grey;background-position:-0px -0px;background-repeat:no-repeat;width:50px;height:50px;'+'background-image:url('+v.url.replace('{x}','105').replace('{y}','48').replace('{z}','7')+');'" @click.native="tileSelect(v)"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { MapLayer, BorderLayer, PointLayer, RouteLayer } from './layers'
  import { gsap, Power3 } from 'gsap'
  import { windowToCanvas, pixel2Lng, pixel2Lat, lng2Pixel, lat2Pixel, lngLat2Pixel } from './js/core'
  import { wgs84togcj02 } from './workers/mapUtil'
  import { useSettingStore } from '~/stores/setting'
  import run,{ cancel } from '~/webgpu/imageTexture'
  import Quadtree, { Rect } from '@timohausmann/quadtree-js'
  import textureUrl from '../../assets/aircraft.png?url'
  import { mat3, vec2, vec3 } from 'gl-matrix'
  /*
  let position = {x:10,y:0}
  let rad = Math.PI/2
  let scale = {scaleX:1,scaleY:1}
  const m = mat3.create()
  mat3.multiply(m,m,mat3.fromValues(//平移
  1,0,position.x,
  0,1,position.y,
  0,0,1))
  mat3.multiply(m,m,mat3.fromValues(//平移
  1,0,-5,
  0,1,0,
  0,0,1))
  mat3.multiply(m,m,mat3.fromValues(//旋转
  Math.cos(rad),Math.sin(rad),0,
  -Math.sin(rad),Math.cos(rad),0,
  0,0,1))
  mat3.multiply(m,m,mat3.fromValues(//缩放
  scale.scaleX,0,0,
  0,scale.scaleY,0,
  0,0,1))
  mat3.multiply(m,m,mat3.fromValues(//平移
  1,0,+5,
  0,1,0,
  0,0,1))
  console.log(m)

  mat3.identity(m)
  mat3.translate(m,m,vec2.fromValues(position.x,position.y))//平移
  mat3.translate(m,m,vec2.fromValues(-5,0))//平移
  mat3.rotate(m,m,-rad)//旋转
  mat3.scale(m,m,vec2.fromValues(scale.scaleX,scale.scaleY))//缩放
  mat3.translate(m,m,vec2.fromValues(+5,0))
  mat3.transpose(m,m)
  console.log(m)
  */
  let isMouseOver=false;
  interface Plane extends Rect {
    name:string,
    vx:number,
    vy:number,
    check:boolean,
    X:number,
    Y:number,
    W:number,
    H:number,
  }
  const plane:Plane = {
    name:'飞机',
    x:100,
    y:100,
    width:100,
    height:100,
    X:100,
    Y:100,
    W:100,
    H:100,
    vx:100,
    vy:100,
    check:false,
  }
  var myCursor:Rect = {
    x:0,
    y:0,
    width:10,
    height:10,
  }
  let quadtree = new Quadtree({
    x:0,
    y:0,
    width:800,
    height:800,
  })
  let needRedraw = false
  let aid:number
  import { Engine3D, Scene3D, Object3D, Camera3D, DirectLight, HoverCameraController, Color, View3D, AtmosphericComponent } from "@orillusion/core"
  const setting = useSettingStore()
  const mapLayer = new MapLayer()
  const borderLayer = new BorderLayer()
  const pointLayer = new PointLayer()
  const routeLayer = new RouteLayer()
  let canvas = ref(null)
  let webgpu = ref(null)
  // let POINT = {lng:113.42165142106768,lat:23.098844381632485}
  let POINT = {lng:116.39139324235674,lat:39.90723893689098}
  const urls = ref([
    {url:'https://webst01.is.autonavi.com/appmaptile?style=10&x={x}&y={y}&z={z}'},
    {url:'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}'},
    {url:'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=p&gl=CN&x={x}&y={y}&z={z}'},
    {url:'https://tanglei.site:3210/maps/vt?lyrs=y&gl=CN&x={x}&y={y}&z={z}'},
    {url:'https://tanglei.site:3210/maps/vt?lyrs=s&gl=CN&x={x}&y={y}&z={z}'},
    {url:'https://tanglei.site:3210/maps/vt?lyrs=h&gl=CN&x={x}&y={y}&z={z}'},
    {url:'https://tanglei.site:3210/maps/vt?lyrs=p&gl=CN&x={x}&y={y}&z={z}'},
    {url:'https://tanglei.site:3210/maps/vt?lyrs=m&gl=CN&x={x}&y={y}&z={z}'},
    {url:'https://tanglei.site:3210/maps/vt?lyrs=t&gl=CN&x={x}&y={y}&z={z}'},
    {url:'/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'},
  ])
  if(setting.tileUrl==''){
    setting.tileUrl=urls.value[0].url
  }
  let has = false
  urls.value.forEach((v,k)=>{
    if(setting.tileUrl==v.url){
      mapLayer.setSource(v)
      has = true
    }
  })
  if(!has){
    setting.tileUrl=urls.value[0].url
    mapLayer.setSource(urls.value[0])
  }
  const tileSelect = (v:any) => {
    setting.tileUrl = v.url
    mapLayer.setSource(v)
    loadMap()
  }
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
  let isMouseDown:boolean = false
  const minLevel = 0
  const maxLevel = 22
  const 限制 = true
  let mousemove:Pos
  let pos:Pos
  let posl:Pos
  let currentLngLat:{
    lng:number
    lat:number
  }
  let newPos:{
    x:number
    y:number
    targetX:number
    targetY:number
  }
  var myObjects=Array<Plane>()
  function randMinMax(min:number, max:number, round:boolean|undefined=undefined) {
    var val = min + (Math.random() * (max - min));
    if(round) val = Math.round(val);
    return val;
  };
  for(var i=0;i<200;i++) {
    myObjects.push({
      name:i.toString(),
      x: randMinMax(0, 640),
      y: randMinMax(0, 480),
      width: 16*4,
      height: 17*4,
      X: randMinMax(0,640),
      Y: randMinMax(0,480),
      W:16*4,
      H:17*4,
      vx: randMinMax(-20,20),
      vy: randMinMax(-80,80),
      check: false
    });
  }
  let planeCvs = document.createElement('canvas')
  onMounted(async()=>{
    const res = await fetch(textureUrl)
    const img = await res.blob()
    let bitmap = await createImageBitmap(img)
    planeCvs.width = bitmap.width
    planeCvs.height = bitmap.height
    planeCvs.getContext('bitmaprenderer')?.transferFromImageBitmap(bitmap)

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


    // if(webgpu.value)
    //   run(webgpu.value)
    // demo()
    window.addEventListener('message',test,{passive:true})
    // mapLayer.setSource({url:'https://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'})
    // mapLayer.setSource({url:'https://tanglei.site:444?z={z}&y={y}&x={x}'})//nps+go
    // mapLayer.setSource({url:'http://tanglei.site:81?z={z}&y={y}&x={x}'})//nps+go
    // mapLayer.setSource({url:'http://tanglei.site:8847?z={z}&y={y}&x={x}'})//tcp
    // mapLayer.setSource({url:'http://127.0.0.1:8008/{z}/{y}/{x}.jpg'})//nginx
    // mapLayer.setSource({url:'http://127.0.0.1:8001?z={z}&y={y}&x={x}'})//nodejs
    // mapLayer.setSource({url:'https://tanglei.site?z={z}&y={y}&x={x}'})//nps->nodejs
    // mapLayer.setSource({url:'/map1?z={z}&y={y}&x={x}'})//proxy->nps->nodejs
    // mapLayer.setSource({url:'/data/google/terrain/Guangzhou/{z}/{x}/{y}.jpg'})
    init()
    loop(performance.now())
    new ResizeObserver(()=>{
      let rect = cvs.getBoundingClientRect()
      cvs.width = rect.width
      cvs.height = rect.height
      quadtree.bounds={x:0,y:0,width:cvs.width,height:cvs.height}
      localStorage.L&&(obj.targetL=obj.L=Number(localStorage.L))
      $('#level').html('Z:'+obj.L.toFixed(2))
      if(localStorage.center){
        var center = JSON.parse(localStorage.center)
        obj.imgX = cvs.width/2-(center[0]+180)/360*tileWidth*2**obj.L
        obj.imgY = cvs.height/2-(1-Math.asinh(Math.tan(center[1]*Math.PI/180))/Math.PI)/2*2**obj.L*tileWidth
      }else{
        obj.imgX = cvs.width/2-tileWidth*2**obj.L*(POINT.lng+180)/360
        obj.imgY = cvs.height/2-(1-Math.asinh(Math.tan(POINT.lat*Math.PI/180))/Math.PI)/2*2**obj.L*tileWidth
      }
      limitScale()
      limitRegion()
      loadMap()
      needRedraw=true
      draw()
    }).observe(cvs)
    cvs.addEventListener('mousemove',cvsmousemoveFunc,{passive:true})
    cvs.addEventListener('mouseout',mouseoutFunc,{passive:true})
    cvs.addEventListener('mousewheel',mousewheelFunc,{passive:true})
    cvs.addEventListener('mousedown',mousedownFunc,{passive:true})
    document.addEventListener('mouseup',mouseupFunc,{passive:true})
    document.addEventListener('mousemove',mousemoveFunc,{passive:true})
  })
  onBeforeUnmount(()=>{
    console.log('onBeforeUnmount')
    cancelAnimationFrame(aid)
    removeEventListener('message',test)
    cancel()
  })
  // const demo = async() =>{
  //   if(webgpu.value==null)
  //     throw new Error('invalid webgpu')
  //   // initializa engine
  //   await Engine3D.init({
  //     canvasConfig:{
  //       canvas: webgpu.value
  //     }
  //   });
  //   // create new scene as root node
  //   let scene3D = new Scene3D();
  //   // add an Atmospheric sky enviroment
  //   let sky = scene3D.addComponent(AtmosphericComponent);
  //   sky.enable=false
  //   sky.sunY = 0.6;
  //   // create camera
  //   let cameraObj = new Object3D();
  //   let camera = cameraObj.addComponent(Camera3D);
  //   // adjust camera view
  //   camera.perspective(60, Engine3D.aspect, 1, 5000.0);
  //   // set camera controller
  //   let controller = cameraObj.addComponent(HoverCameraController);
  //   controller.setCamera(0, -20, 15);
  //   // add camera node
  //   scene3D.addChild(cameraObj);
  //   // create light
  //   let light = new Object3D();
  //   // add direct light component
  //   let component = light.addComponent(DirectLight);
  //   // adjust lighting
  //   light.rotationX = 45;
  //   light.rotationY = 30;
  //   component.lightColor = new Color(1.0, 1.0, 1.0, 1.0);
  //   component.intensity = 1;
  //   // add light object
  //   scene3D.addChild(light);

  //   let dragon = await Engine3D.res.loadGltf('https://cdn.orillusion.com/PBR/DragonAttenuation/DragonAttenuation.gltf');
  //   scene3D.addChild(dragon);

  //   // create a view with target scene and camera
  //   let view = new View3D();
  //   view.scene = scene3D;
  //   view.camera = camera;
  //   // start render
  //   Engine3D.startRenderView(view);
  // }
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
  var interval = 0
  var then = 0
  let frame=0
  let lastTime=0
  const loop = (time:number) => {
    aid = requestAnimationFrame(loop)
    if (time - then > interval) {
      interval>0&&(then = time - (time - then) % interval)
      frame++
      if(time-lastTime>1000){
        $('#fps').html('FPS:'+(frame*1000/(time-lastTime)).toFixed(2))
        lastTime = time
        frame=0
      }
      draw()
    }
  }
  var drawQuadtree = function(node:Quadtree) {
    var bounds = node.bounds;
    //no subnodes? draw the current node
    if(node.nodes.length === 0) {
      ctx.strokeStyle = 'rgba(255,0,0,0.5)';
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    //has subnodes? drawQuadtree them!
    } else {
      for(var i=0;i<node.nodes.length;i=i+1) {
        drawQuadtree(node.nodes[i]);
      }
    }
  };
  let processXY = (x:number,y:number,x0:number,y0:number,angle:number)=>{
    let m=mat3.create()
      mat3.translate(m,m,vec2.fromValues(x,y))
      mat3.translate(m,m,vec2.fromValues(-x0,-y0))
      mat3.rotate(m,m,angle)
      mat3.translate(m,m,vec2.fromValues(x0,y0))
      mat3.transpose(m,m)
      let a = m[2]
      let b = m[5]
      let c = m[8]
    return {
      x:a,
      y:b,
    }
  }
  var drawObjects = function() {
    var obj;
    for(var i=0;i<myObjects.length;i=i+1) {
      obj = myObjects[i];
      let angle = Math.atan2(-obj.vx,obj.vy)+Math.PI
      ctx.save()
      let pt1=processXY(obj.x,obj.y,obj.x+obj.width/2,obj.y+obj.height/2,angle)
      let pt2=processXY(obj.x+obj.width,obj.y,obj.x+obj.width/2,obj.y+obj.height/2,angle)
      let pt3=processXY(obj.x+obj.width,obj.y+obj.height,obj.x+obj.width/2,obj.y+obj.height/2,angle)
      let pt4=processXY(obj.x,obj.y+obj.height,obj.x+obj.width/2,obj.y+obj.height/2,angle)
      let x=Math.min(pt1.x,pt2.x,pt3.x,pt4.x)
      let y=Math.min(pt1.y,pt2.y,pt3.y,pt4.y)
      let w=Math.max(pt1.x,pt2.x,pt3.x,pt4.x)-x
      let h=Math.max(pt1.y,pt2.y,pt3.y,pt4.y)-y
      ctx.strokeRect(x,y,w,h)
      // debugger
      ctx.translate(obj.x+obj.width/2,obj.y+obj.height/2)
      ctx.rotate(angle)
      if(obj.check) {
        ctx.fillStyle = 'rgba(48,255,48,0.5)';
        ctx.fillRect(-obj.width/2, -obj.height/2, obj.width, obj.height);
        ctx.drawImage(planeCvs,0,0,planeCvs.width,planeCvs.height,-obj.width/2,-obj.height/2,obj.width,obj.height)
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(-obj.width/2, -obj.height/2, obj.width, obj.height);
        ctx.drawImage(planeCvs,0,0,planeCvs.width,planeCvs.height,-obj.width/2,-obj.height/2,obj.width,obj.height)
      }
      ctx.restore()
    }
  }
  let preTime=performance.now()
  const draw = ()=>{
    let now = performance.now()
    let deltaTime = now-preTime
    preTime = now

    ctx.clearRect(0,0,cvs.width,cvs.height)
    if(needRedraw){
      // needRedraw=false
      ctx.save()
      mapLayer.render(obj,ctx)
      borderLayer.render(obj,ctx)
      pointLayer.render(obj,ctx)
      routeLayer.render(obj,ctx)
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.lineWidth=2
      ctx.translate(cvs.width/2,cvs.height/2)
      ctx.moveTo(0,-10)
      ctx.lineTo(0,10)
      ctx.moveTo(-10,0)
      ctx.lineTo(10,0)
      ctx.strokeStyle='red'
      ctx.stroke()
      ctx.restore()



      ctx.save()
      let convert = wgs84togcj02(POINT.lng,POINT.lat)
      let position = lngLat2Pixel(convert[0],convert[1],obj.imgX,obj.imgY,2**obj.L,tileWidth)
      ctx.beginPath()
      ctx.strokeStyle='red'
      ctx.lineWidth=2
      ctx.translate(position.x,position.y)
      ctx.arc(0,0,10,0,Math.PI*2)
      ctx.closePath()
      ctx.stroke()
      ctx.restore()
    }
    quadtree.clear()
    for(var i=0;i<myObjects.length;i=i+1) {
      let obj = myObjects[i]
      obj.x += obj.vx*deltaTime/1000;
      obj.y += obj.vy*deltaTime/1000;
      obj.check = false;
      if(obj.x > quadtree.bounds.width) obj.x = quadtree.bounds.x;
      if(obj.x < quadtree.bounds.x) obj.x = quadtree.bounds.width;
      if(obj.y > quadtree.bounds.height) obj.y = quadtree.bounds.y;
      if(obj.y < quadtree.bounds.y) obj.y = quadtree.bounds.height;
      quadtree.insert(obj);
    }
    if(isMouseOver){
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(myCursor.x, myCursor.y, myCursor.width, myCursor.height);
      let candidates:Array<Plane> = quadtree.retrieve(myCursor);
      //flag retrieved objects
      for(i=0;i<candidates.length;i++) {
        candidates[i].check = true;
      }
    }
    drawQuadtree(quadtree)
    drawObjects()
  }
  const loadMap = () => {
    mapLayer.loadMap(obj,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      needRedraw = true
    })
    borderLayer.loadMap(obj,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      needRedraw = true
    })
    pointLayer.loadMap(obj,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      needRedraw = true
    })
    routeLayer.loadMap(obj,{x:0,y:0,w:cvs.width,h:cvs.height},()=>{
      needRedraw = true
    })
    needRedraw = true
  }
  const mouseoutFunc = (event:any) => {
    isMouseOver = false
  }
  const mousedownFunc = (event:MouseEvent) => {
    obj.targetL = obj.L
    gsap.killTweensOf(newPos)
    gsap.killTweensOf(mousemove)
    gsap.killTweensOf(obj)
    isMouseDown=true
    // panel&&panel.mousedownFunc(event)
    let tmp = windowToCanvas(event.clientX, event.clientY,cvs)
    mousemove = {x:tmp.x,y:tmp.y,targetX:tmp.x,targetY:tmp.y}
    pos = mousemove
    let x = (mousemove.x-obj.imgX)/2**obj.L*1000
    let y = (mousemove.y-obj.imgY)/2**obj.L*1000
    newPos = {x, y,targetX:x,targetY:y}
  }
  const cvsmousemoveFunc = (evt:MouseEvent) => {
    isMouseOver=true
  }
  const mousemoveFunc = (evt:MouseEvent) => {
    let move = windowToCanvas(evt.clientX, evt.clientY,cvs)
    currentLngLat={
      lng: pixel2Lng(move.x,obj.imgX,2**obj.L,tileWidth),
      lat: pixel2Lat(move.y,obj.imgY,2**obj.L,tileWidth),
    }
    myCursor.x = move.x - (myCursor.width/2);
		myCursor.y = move.y - (myCursor.height/2);
    // drawScale(2**obj.L,cvs_scale,pixel2Lat(move.y,obj.imgY,2**obj.L,tileWidth))
    // this.drawCurrentLngLat()
    // panel&&divMask.addEventListener('mousemove',panel.mousemoveFunc,{passive:false})
    if(isMouseDown){
      let tmp = windowToCanvas(evt.clientX, evt.clientY,cvs)
      posl = {x:tmp.x,y:tmp.y,targetX:tmp.x,targetY:tmp.y}
      var deltaX = posl.x - pos.x, deltaY = posl.y - pos.y
      mousemove.targetX += deltaX
      mousemove.targetY += deltaY
      pos = JSON.parse(JSON.stringify(posl))
      let period=1
      // if(config.动画){
      //   period=1
      // }else{
      //   period=0
      // }

      gsap.killTweensOf(newPos)
      gsap.killTweensOf(mousemove)
      gsap.to(mousemove,{
        duration:period,
        x:mousemove.targetX,
        y:mousemove.targetY,
        onUpdate: ()=>{
          obj.imgX=mousemove.x - 2**obj.L*newPos.x/1000
          obj.imgY=mousemove.y - 2**obj.L*newPos.y/1000
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
    let x=(mousemove.x-obj.imgX)/2**obj.L*1000
    let y=(mousemove.y-obj.imgY)/2**obj.L*1000
    newPos = {x,y,targetX:x,targetY:y}
    // console.log(event.wheelDeltaY)
    let delta = event.wheelDeltaY/120
    obj.targetL+=delta

    if(boundary[1]-boundary[0]>0){
      let tmpL=0
      let minX = 0-(boundary[0]+180)/360*tileWidth*(2**tmpL)
      let maxX = cvs.width-(boundary[1]+180)/360*tileWidth*(2**tmpL)
      while(minX-maxX<0){
        tmpL++
        minX = 0-(boundary[0]+180)/360*tileWidth*(2**tmpL)
        maxX = cvs.width-(boundary[1]+180)/360*tileWidth*(2**tmpL)
      }
      obj.targetL<tmpL&&(obj.targetL=tmpL)
    }
    if(boundary[2]-boundary[3]>0){
      let tmpL=0
      let minY = 0-(1-Math.asinh(Math.tan(boundary[2]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
      let maxY = cvs.height-(1-Math.asinh(Math.tan(boundary[3]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
      while(minY-maxY<0){
        tmpL++
        minY = 0-(1-Math.asinh(Math.tan(boundary[2]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
        maxY = cvs.height-(1-Math.asinh(Math.tan(boundary[3]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
      }
      obj.targetL<tmpL&&(obj.targetL=tmpL)
    }
    limitScale()
    let period=1
    // if(config.动画){
    //   period=1
    // }else{
    //   period=0
    // }
    gsap.killTweensOf(obj)
    gsap.to(obj, {
      duration:period,
      L: obj.targetL,
      onUpdate: ()=>{
        obj.imgX=mousemove.x - 2**obj.L*newPos.x/1000
        obj.imgY=mousemove.y - 2**obj.L*newPos.y/1000
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
  const limitScale = () => {
    if(限制){
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
      localStorage.L = obj.L
      $('#level').html('Z:'+obj.L.toFixed(2))
    }
  }
  let boundary = [-180,180,Math.atan(Math.sinh(Math.PI))*180/Math.PI,-Math.atan(Math.sinh(Math.PI))*180/Math.PI]
  boundary=[110,120,41,38]
  const limitRegion = () => {
    if(限制){
      if(boundary[1]-boundary[0]>0){
        let tmpL=0
        let minX = 0-(boundary[0]+180)/360*tileWidth*(2**tmpL)
        let maxX = cvs.width-(boundary[1]+180)/360*tileWidth*(2**tmpL)
        while(minX-maxX<0){
          tmpL++
          minX = 0-(boundary[0]+180)/360*tileWidth*(2**tmpL)
          maxX = cvs.width-(boundary[1]+180)/360*tileWidth*(2**tmpL)
        }
        obj.L<tmpL&&(localStorage.L=obj.L=tmpL)
        minX = 0-(boundary[0]+180)/360*tileWidth*2**obj.L
        maxX = cvs.width-(boundary[1]+180)/360*tileWidth*2**obj.L
        if(obj.imgX<maxX){
          obj.imgX = maxX
        }else if(obj.imgX>minX){
          obj.imgX=minX
        }
      }
      if(boundary[2]-boundary[3]>0){
        let tmpL=0
        let minY = 0-(1-Math.asinh(Math.tan(boundary[2]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
        let maxY = cvs.height-(1-Math.asinh(Math.tan(boundary[3]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
        while(minY-maxY<0){
          tmpL++
          minY = 0-(1-Math.asinh(Math.tan(boundary[2]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
          maxY = cvs.height-(1-Math.asinh(Math.tan(boundary[3]*Math.PI/180))/Math.PI)/2*(2**tmpL)*tileWidth
        }
        obj.L<tmpL&&(localStorage.L=obj.L=tmpL)
        minY = 0-(1-Math.asinh(Math.tan(boundary[2]*Math.PI/180))/Math.PI)/2*2**obj.L*tileWidth
        maxY = cvs.height-(1-Math.asinh(Math.tan(boundary[3]*Math.PI/180))/Math.PI)/2*2**obj.L*tileWidth
        if(obj.imgY<maxY){
          obj.imgY = maxY
        }else if(obj.imgY>minY){
          obj.imgY=minY
        }
      }
      $('#level').html('Z:'+obj.L.toFixed(2))
    }
    // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
    // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
  }
  const flyTo = (lng:number,lat:number,targetL:number|undefined=undefined) => {
    let x = lng2Pixel(lng,obj.imgX,2**obj.L,tileWidth)
    let y = lat2Pixel(lat,obj.imgY,2**obj.L,tileWidth)
    mousemove = {x,y,targetX:lng2Pixel(lng,cvs.width/2-(lng+180)/360*tileWidth*(2**obj.targetL),2**obj.targetL,tileWidth),targetY:lat2Pixel(lat,cvs.height/2-(1-Math.asinh(Math.tan(lat*Math.PI/180))/Math.PI)/2*(2**obj.targetL)*tileWidth,2**obj.targetL,tileWidth)}
    newPos = {x:((cvs.width/2-obj.imgX)/2**obj.L) *1000, y:((cvs.height/2-obj.imgY)/2**obj.L)*1000,targetX:((mousemove.x-obj.imgX)/2**obj.L)*1000, targetY:((mousemove.y-obj.imgY)/2**obj.L)*1000}
    if(targetL!=undefined){
      obj.targetL = targetL
      gsap.killTweensOf(obj)
      gsap.to(obj, {
        duration:2,
        L: obj.targetL,
        onUpdate: ()=>{
          obj.imgX=cvs.width/2 - 2**obj.L*newPos.x/1000
          obj.imgY=cvs.height/2 - 2**obj.L*newPos.y/1000
          limitScale()
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
    gsap.killTweensOf(mousemove)
    gsap.killTweensOf(newPos)
    gsap.to(newPos, {
      duration:2,
      x: newPos.targetX,
      y: newPos.targetY,
      onUpdate:()=>{
        obj.imgX=cvs.width/2 - 2**obj.L*newPos.x/1000
        obj.imgY=cvs.height/2 - 2**obj.L*newPos.y/1000
        limitRegion()
        loadMap()
      },
      ease:Power3.easeOut
    })
  }
  const testClick = ()=>{
    let convert = wgs84togcj02(POINT.lng,POINT.lat)
    flyTo(convert[0],convert[1],13)
  }
</script>
<style lang="scss">
.tileSelect{
  display: flex;
  flex-direction: column;
  justify-content: center;
  &>.tileList{
    background-color: #2b2b2b;
    padding: 4px;
    border-radius: 4px;
    display: none;
  }
  &:focus-within>.tileList{
    display: block;
  }
}

</style>