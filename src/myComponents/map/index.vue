<template>
  <canvas ref="canvas" style="position:absolute;outline:none;left:0;top:0;width:100%;height:100%;"></canvas>
  <canvas ref="webgpu" style="position:absolute;outline:none;left:0;top:0;width:100%;height:100%;pointer-events: none;"></canvas>
</template>
<script>
  import { defineComponent } from 'vue'
  import { MapLayer, BorderLayer, PointLayer, RouteLayer } from './layers'
  import { gsap, Power3 } from 'gsap'
  import { windowToCanvas, pixel2Lng, pixel2Lat, lng2Pixel, lat2Pixel } from './js/core'
  import { useSettingStore } from '~/stores/setting'
  import run from '~/webgpu/basicTriangle'
  export default defineComponent({
    data(){
      return{
        first: true,
        mapLayer:new MapLayer(),
        // borderLayer:new BorderLayer(),
        // pointLayer:new PointLayer(),
        // routeLayer:new RouteLayer(),
        cvs:undefined,
        ctx:undefined,
        obj:{ imgX: 0, imgY:0, L:11, tileWidth:256 },
        change:undefined,
        isMouseDown:false,
        mousemove:undefined,
        tweenWheel:undefined,
        tween:undefined,
        pos:undefined,
        posl:undefined,
        currentLngLat:undefined,
        newPos:undefined,
        test:undefined,
      }
    },
    beforeUnmount(){
      window.removeEventListener('message',this.test)
    },
    mounted(){
      run(this.$refs.webgpu)
      const setting = useSettingStore()
      console.log(navigator.gpu)
      this.test = e=>{
        if(e.data.type=='自定义'&&e.data.obj.name=='瓦片地图'){
          if(e.data.obj.leftImgSrc){
            this.mapLayer.show()
            setting.setloadMap(true)
          }else{
            this.mapLayer.hide()
            setting.setloadMap(false)
          }
          this.loadMap()
        }
      }
      window.addEventListener('message',this.test)
      // this.mapLayer?.setSource({url:'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',maxLevel:18})
      this.mapLayer?.setSource({url:'http://map1.tanglei.top/{z}/{y}/{x}',maxLevel:22})
      // this.mapLayer?.setSource({url:'http://tanglei.top:5050/google/terrain/Guangzhou/{z}/{x}/{y}.jpg',maxLevel:15},)
      if(setting.loadmap){
        this.mapLayer?.show()
      }else{
        this.mapLayer?.hide()
      }
      this.cvs = this.$refs.canvas
      let cvs = this.cvs
      this.ctx = this.cvs.getContext('2d')
      this.obj.targetL = this.obj.L
      new ResizeObserver(()=>{
        let rect = cvs.getBoundingClientRect()
        cvs.width = rect.width
        cvs.height = rect.height
        this.limitScale()
        this.limitRegion()
        if(this.first){
          this.first = false
          let POINT={lng:113.42165142106768,lat:23.098844381632485}
          this.obj.imgX = cvs.width/2-this.obj.tileWidth*2**this.obj.L*(POINT.lng+180)/360
          this.obj.imgY=cvs.height/2-(1-Math.asinh(Math.tan(POINT.lat*Math.PI/180))/Math.PI)/2*(2**this.obj.L)*this.obj.tileWidth
          localStorage.L&&(this.obj.targetL=this.obj.L=Number(localStorage.L))
          if(localStorage.center){
            var center = JSON.parse(localStorage.center)
            this.obj.imgX=cvs.width/2-(center[0]+180)/360*this.obj.tileWidth*(2**this.obj.L)
            this.obj.imgY=cvs.height/2-(1-Math.asinh(Math.tan(center[1]*Math.PI/180))/Math.PI)/2*(2**this.obj.L)*this.obj.tileWidth
          }
        }
        this.loadMap()
      }).observe(cvs)
      cvs.addEventListener('mousewheel',this.mousewheelFunc,{passive:true});
      cvs.addEventListener('mousedown',this.mousedownFunc,{passive:true});
      document.addEventListener('mouseup',this.mouseupFunc,{passive:true});
      document.addEventListener('mousemove',this.mousemoveFunc,{passive:true});
    },
    methods:{
      draw(time){
        this.ctx.save()
        this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height)
        this.mapLayer?.render(this.obj,this.ctx)
        this.borderLayer?.render(this.obj,this.ctx)
        this.pointLayer?.render(this.obj,this.ctx)
        this.routeLayer?.render(this.obj,this.ctx)
        this.ctx.restore()
      },
      loadMap(){
        this.mapLayer?.loadMap(this.obj,this.change,{x:0,y:0,w:this.cvs.width,h:this.cvs.height},()=>{
          this.draw()
        })
        this.borderLayer?.loadMap(this.obj,this.change,{x:0,y:0,w:this.cvs.width,h:this.cvs.height},()=>{
          this.draw()
        })
        this.pointLayer?.loadMap(this.obj,this.change,{x:0,y:0,w:this.cvs.width,h:this.cvs.height},()=>{
          this.draw()
        })
        this.routeLayer?.loadMap(this.obj,this.change,{x:0,y:0,w:this.cvs.width,h:this.cvs.height},()=>{
          this.draw()
        })
      },
      mousedownFunc(event){
        this.obj.targetL = this.obj.L
        this.tween&&this.tween.kill()
        this.isMouseDown=true
        // panel&&panel.mousedownFunc(event)
        this.mousemove = windowToCanvas(event.clientX, event.clientY,this.cvs)
        this.mousemove.targetX = this.mousemove.x
        this.mousemove.targetY = this.mousemove.y
        this.pos = this.mousemove
        this.newPos = {x:((this.mousemove.x-this.obj.imgX)/2**this.obj.L)/256 , y:((this.mousemove.y-this.obj.imgY)/2**this.obj.L)/256}
      },
      mousemoveFunc(evt){
        let move = windowToCanvas(evt.clientX, evt.clientY,this.cvs)
        this.currentLngLat={
          lng: pixel2Lng(move.x,this.obj.imgX,2**this.obj.L,this.obj.tileWidth),
          lat: pixel2Lat(move.y,this.obj.imgY,2**this.obj.L,this.obj.tileWidth),
        }
        // drawScale(2**obj.L,cvs_scale,pixel2Lat(move.y,obj.imgY,2**obj.L,obj.tileWidth))
        // this.drawCurrentLngLat()
        // panel&&divMask.addEventListener('mousemove',panel.mousemoveFunc,{passive:false})
        if(this.isMouseDown){
          this.posl = windowToCanvas(evt.clientX, evt.clientY,this.cvs)
          var x = this.posl.x - this.pos.x, y = this.posl.y - this.pos.y
          this.mousemove.targetX += x
          this.mousemove.targetY += y
          this.pos = JSON.parse(JSON.stringify(this.posl))
          let period=1
          // if(config.动画){
          //   period=1
          // }else{
          //   period=0
          // }
          this.tween&&this.tween.kill()
          this.tween = gsap.to(this.mousemove,{
            duration:period,
            x:this.mousemove.targetX,
            y:this.mousemove.targetY,
            onUpdate: ()=>{
              this.obj.imgX=this.mousemove.x - (2**this.obj.L)*this.newPos.x*256
              this.obj.imgY=this.mousemove.y - (2**this.obj.L)*this.newPos.y*256
              this.limitRegion()
              this.loadMap()
              // emitter.emit('mapChange',obj)
              // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
              // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
              localStorage.L=this.obj.L
              localStorage.center=JSON.stringify([pixel2Lng(this.cvs.width/2,this.obj.imgX,2**this.obj.L,this.obj.tileWidth),pixel2Lat(this.cvs.height/2,this.obj.imgY,2**this.obj.L,this.obj.tileWidth)])
            },
            ease:Power3.easeOut
          })
          // windy&&windy.stop()
          // scaleTimer&&clearTimeout(scaleTimer)
          // scaleTimer = setTimeout(()=>{
          //   windy&&windy.start(
          //       [[0,0],[canvas.width, canvas.height]],
          //       canvas.width,
          //       canvas.height,
          //       [[pixel2Lng(0,obj.imgX,2**obj.L,obj.tileWidth), pixel2Lat(canvas.height,obj.imgY,2**obj.L,obj.tileWidth)],[pixel2Lng(canvas.width,obj.imgX,2**obj.L,obj.tileWidth), pixel2Lat(0,obj.imgY,2**obj.L,obj.tileWidth)]]
          //   )
          // },1000)
        }
      },
      mouseupFunc(evt){
        if(this.isMouseDown){
          this.loadMap()
          // windy&&windy.start(
          //     [[0,0],[canvas.width, canvas.height]],
          //     canvas.width,
          //     canvas.height,
          //     [[pixel2Lng(0,obj.imgX,2**obj.L,obj.tileWidth), pixel2Lat(canvas.height,obj.imgY,2**obj.L,obj.tileWidth)],[pixel2Lng(canvas.width,obj.imgX,2**obj.L,obj.tileWidth), pixel2Lat(0,obj.imgY,2**obj.L,obj.tileWidth)]]
          // )
          this.isMouseDown=false
          // panel&&panel.mouseupFunc(evt)
        }
      },
      mousewheelFunc(event){
        if(!this.isMouseDown){
          this.mousemove = windowToCanvas(event.clientX, event.clientY,this.cvs)
          this.mousemove.targetX=this.mousemove.x
          this.mousemove.targetY=this.mousemove.y
        }else if(!this.mousemove){
          this.mousemove = windowToCanvas(event.clientX, event.clientY,this.cvs)
          this.mousemove.targetX=this.mousemove.x
          this.mousemove.targetY=this.mousemove.y
        }
        // drawScale(2**obj.L,cvs_scale,pixel2Lat(mousemove.y,obj.imgY,2**obj.L,obj.tileWidth))
        this.newPos = {x:((this.mousemove.x-this.obj.imgX)/(2**this.obj.L))/256 , y:((this.mousemove.y-this.obj.imgY)/(2**this.obj.L))/256}
        let delta = event.wheelDelta/120
        this.change = event.wheelDelta>0?'zoom in':'zoom out'
        this.obj.targetL+=delta
        this.limitScale()
        let period=1
        // if(config.动画){
        //   period=1
        // }else{
        //   period=0
        // }
        this.tweenWheel = gsap.to(this.obj, {
          duration:period,
          L: this.obj.targetL,
          onUpdate: ()=>{
            this.obj.imgX=this.mousemove.x - (2**this.obj.L)*this.newPos.x*256
            this.obj.imgY=this.mousemove.y - (2**this.obj.L)*this.newPos.y*256
            // 层级.setValue(this.obj.L.toFixed(2))
            localStorage.L=this.obj.L
            localStorage.center=JSON.stringify([pixel2Lng(this.cvs.width/2,this.obj.imgX,2**this.obj.L,this.obj.tileWidth),pixel2Lat(this.cvs.height/2,this.obj.imgY,2**this.obj.L,this.obj.tileWidth)])
            this.limitRegion()
            this.loadMap()
            // emitter.emit('mapChange',obj)
            // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
            // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
          },
          ease:Power3.easeOut
        })
      },
      limitRegion(){
        // if(config.限制){
          // if(this.obj.imgX>0){
          //   this.obj.imgX=0
          // }else if(this.obj.imgX<canvas.width-this.obj.tileWidth*2**this.obj.L){
          //   this.obj.imgX = (canvas.width-this.obj.tileWidth*2**this.obj.L)
          // }
          if(this.obj.imgY>0){
            this.obj.imgY=0
          }else if(this.obj.imgY<this.cvs.height-this.obj.tileWidth*2**this.obj.L){
            this.obj.imgY = (this.cvs.height-this.obj.tileWidth*2**this.obj.L)
          }
        // }
        // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
        // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
      },
      limitScale(){
        // if(config.限制){
          //下面5行代码是限制地图缩放等级
          if(this.obj.targetL<Math.max(0,this.mapLayer?.urlTemplate.minLevel)){
            this.obj.targetL=Math.max(0,this.mapLayer?.urlTemplate.minLevel)
          }else if(this.obj.targetL>(this.mapLayer?.urlTemplate.maxLevel||21)){
            this.obj.targetL=this.mapLayer?.urlTemplate.maxLevel||21
          }
          // 下面7行代码是让地图不能缩放得太小，并且最小时地图不能因放大而模糊。
          let tmpL = Math.ceil(Math.log(Math.max(this.cvs.width,this.cvs.height)/this.obj.tileWidth)/Math.log(2))
          if(this.obj.targetL<tmpL){
            this.obj.targetL = tmpL
          }
          if(this.obj.L<tmpL){
            this.obj.L = tmpL
          }
        // }


        // windy&&windy.stop()
        // scaleTimer&&clearTimeout(scaleTimer)
        // scaleTimer = setTimeout(()=>{
        //   windy&&windy.start(
        //       [[0,0],[canvas.width, canvas.height]],
        //       canvas.width,
        //       canvas.height,
        //       [[pixel2Lng(0,obj.imgX,2**obj.L,obj.tileWidth), pixel2Lat(canvas.height,obj.imgY,2**obj.L,obj.tileWidth)],[pixel2Lng(canvas.width,obj.imgX,2**obj.L,obj.tileWidth), pixel2Lat(0,obj.imgY,2**obj.L,obj.tileWidth)]]
        //   )
        // },1000)
        // plane&&plane.setPos(obj.imgX,obj.imgY,2**obj.L)
        // panel&&panel.setPos(obj.imgX,obj.imgY,2**obj.L)
      }
    }
  })
</script>
<style>

</style>