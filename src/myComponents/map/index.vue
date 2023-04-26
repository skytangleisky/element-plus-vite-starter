<template>
  <canvas ref="canvas" class="absolute left-0 top-0" style="outline:none;box-sizing: border-box;width:100%;height:100%;"></canvas>
</template>
<script>
  import { MapLayer } from './layers'
  import { gsap, Power3 } from 'gsap'
  import { windowToCanvas, pixel2Lng, pixel2Lat } from './js/core'
  export default{
    data(){
      return{
        mapLayer:new MapLayer(),
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
      }
    },
    mounted(){
      // this.mapLayer.setSource({url:'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',maxLevel:18})
      this.mapLayer.setSource({url:'http://map1.tanglei.top/{z}/{y}/{x}',maxLevel:18})
      this.cvs = this.$refs.canvas
      this.ctx = this.cvs.getContext('2d')
      let POINT={lng:113.42165142106768,lat:23.098844381632485}
      this.obj.imgX = this.cvs.width/2-this.obj.tileWidth*2**this.obj.L*(POINT.lng+180)/360
      this.obj.imgY = this.cvs.height/2-((1-Math.log(Math.tan(POINT.lat*Math.PI/180) + 1/Math.cos(POINT.lat*Math.PI/180))/Math.PI)/2 * this.obj.tileWidth*2**this.obj.L)
      this.obj.targetL=this.obj.L
      new ResizeObserver(()=>{
        let rect = this.cvs.getBoundingClientRect()
        this.cvs.width = rect.width
        this.cvs.height = rect.height
        this.loadMap()
      }).observe(this.cvs)
      this.cvs.addEventListener('mousewheel',this.mousewheelFunc);
      this.cvs.addEventListener('mousedown',this.mousedownFunc);
      document.addEventListener('mouseup',this.mouseupFunc);
      document.addEventListener('mousemove',this.mousemoveFunc);
    },
    methods:{
      draw(time){
        this.ctx.save()
        this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height)
        this.mapLayer.render(this.obj,this.ctx)
        this.ctx.restore()
      },
      loadMap(){
        this.mapLayer.loadMap(this.obj,this.change,{x:0,y:0,w:this.cvs.width,h:this.cvs.height},()=>{
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
              // localStorage.L=obj.L
              // localStorage.center=JSON.stringify([pixel2Lng(canvas.width/2,obj.imgX,2**obj.L,obj.tileWidth),pixel2Lat(canvas.height/2,obj.imgY,2**obj.L,obj.tileWidth)])
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
        let isMac = false
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          isMac = true;
        }
        // drawScale(2**obj.L,cvs_scale,pixel2Lat(mousemove.y,obj.imgY,2**obj.L,obj.tileWidth))
        this.newPos = {x:((this.mousemove.x-this.obj.imgX)/(2**this.obj.L))/256 , y:((this.mousemove.y-this.obj.imgY)/(2**this.obj.L))/256}
        let delta = 1
        if (event.wheelDelta > 0) {
          if(isMac){
            this.obj.targetL+=delta/30
          }else{
            this.obj.targetL+=delta
          }
          this.obj.targetL=Math.ceil(this.obj.targetL/delta)*delta
          this.change = 'zoom in'
        } else {
          if(isMac){
            this.obj.targetL-=delta/30
          }else{
            this.obj.targetL-=delta
          }
          this.obj.targetL=Math.floor(this.obj.targetL/delta)*delta
          this.change = 'zoom out'
        }
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
            // 层级.setValue(obj.L.toFixed(2))
            // localStorage.L=obj.L
            // localStorage.center=JSON.stringify([pixel2Lng(canvas.width/2,obj.imgX,2**obj.L,obj.tileWidth),pixel2Lat(canvas.height/2,obj.imgY,2**obj.L,obj.tileWidth)])
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
          if(this.obj.targetL<Math.max(0,this.mapLayer.urlTemplate.minLevel)){
            this.obj.targetL=Math.max(0,this.mapLayer.urlTemplate.minLevel)
          }else if(this.obj.targetL>(this.mapLayer.urlTemplate.maxLevel||21)){
            this.obj.targetL=this.mapLayer.urlTemplate.maxLevel||21
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
  }
</script>
<style>

</style>