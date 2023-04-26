<template>
  <canvas ref="canvas" class="absolute left-0 top-0 w-full h-full" style="outline:none;box-sizing: border-box;"></canvas>
</template>
<script>
  import { MapLayer } from './layers'
  const mapLayer = new MapLayer()
  mapLayer.setSource({url:'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',maxLevel:18})
  export default{
    data(){
      return{
        cvs:undefined,
        ctx:undefined,
        obj:{ imgX: 0, imgY:0, L:11, tileWidth:256 },
        change:undefined,

      }
    },
    mounted(){
      this.cvs = this.$refs.canvas
      this.ctx = this.cvs.getContext('2d')
      let POINT={lng:113.42165142106768,lat:23.098844381632485}
      this.obj.imgX = this.cvs.width/2-this.obj.tileWidth*2**this.obj.L*(POINT.lng+180)/360
      this.obj.imgY = this.cvs.height/2-((1-Math.log(Math.tan(POINT.lat*Math.PI/180) + 1/Math.cos(POINT.lat*Math.PI/180))/Math.PI)/2 * this.obj.tileWidth*2**this.obj.L)
      this.obj.targetL=this.obj.L
      this.obj.targetX=this.obj.imgX
      this.obj.targetY=this.obj.imgY
      new ResizeObserver(()=>{
        let rect = this.cvs.getBoundingClientRect()
        this.cvs.width = rect.width
        this.cvs.height = rect.height
        this.loadMap()
      }).observe(this.cvs)
    },
    methods:{
      draw(time){
        mapLayer.render(this.obj,this.ctx)
      },
      loadMap(){
        mapLayer.loadMap(this.obj,this.change,{x:0,y:0,w:this.cvs.width,h:this.cvs.height},()=>{
          this.draw()
        })
      }
    }
  }
</script>
<style>

</style>