import textureUrl from '../../../assets/rocket-sharp.png?url'
import Quadtree, { Rect } from '~/tools/quadtree'
import { wgs84togcj02 } from '../workers/mapUtil'
import { lng2Pixel, lat2Pixel, pixel2Lng, pixel2Lat, pixel2LngLat, XY2Pixel, lngLat2Pixel, getDistance, pixel2XY,lngLat2XY } from '../js/core'
import Eventbus,{ eventbus } from '../../../eventbus'
import Plane from './Plane'
import { translate } from './../../../tools/gl-matrix/quat2';
export default class StationLayer{
  isMouseOver:Boolean
  myCursor:Rect
  quadtree:Quadtree
  spirits:Array<Plane>
  preTime:number
  event:Eventbus
  constructor(){
    this.event=new Eventbus()
    this.event.on('mousedown',(event:MouseEvent)=>{
      let overlap = false
      this.spirits.forEach(v=>{
        v.isMouseDown=false
        if(v.overlap){
          overlap = true
          v.event.emit('mousedown',event)
        }
      })
      if(!overlap){
        eventbus.emit('mousedown',event)
      }
    })
    this.event.on('mouseup',(event:MouseEvent)=>{
      this.spirits.forEach(v=>{
        if(v.overlap){
          v.event.emit('mouseup',event)
        }
      })
    })
    this.isMouseOver=false
    this.myCursor = {
      x:0,
      y:0,
      width:10,
      height:10,
    }
    this.quadtree = new Quadtree({
      x:0,
      y:0,
      width:800,
      height:800,
    })
    this.spirits=Array<Plane>()
    this.getImage()
    let boundary=[110,120,41,38]
    let POINT = {lng:116.39139324235674,lat:39.90723893689098}
    for(var i=0;i<10;i++) {
      let plane = new Plane()
      plane.name=i.toString()
      plane.vx = this.randMinMax(-2/100,2/100)
      plane.vy = this.randMinMax(-1/100,1/100)
      plane.vx=0
      plane.vy=0
      plane.lng=this.randMinMax(boundary[0],boundary[1])
      plane.lat=this.randMinMax(boundary[3],boundary[2])
      // let convert = wgs84togcj02(POINT.lng,POINT.lat)
      // plane.lng=convert[0]
      // plane.lat=convert[1]
      // plane.lng=0
      // plane.lat=0
      plane.cvs = document.createElement('canvas')
      plane.rad = Math.atan2(-plane.vx,plane.vy)+Math.PI
      plane.rad=Math.PI/180*(-45)
      plane.w=24
      plane.h=24
      plane.compute_width_height()
      plane.cvs.width=plane.width
      plane.cvs.height=plane.height
      plane.x=this.randMinMax(0, 640)
      plane.y=this.randMinMax(0, 480)
      // plane.x=100+i*10
      // plane.y=100+i*10
      plane.showToolTips=true
      plane.cvs_toolTips = document.createElement('canvas')
      plane.cvs_toolTips.width = 200
      plane.cvs_toolTips.height = 200
      let ctx_toolTips = plane.cvs_toolTips.getContext('2d',{willReadFrequently:true})
      if(!ctx_toolTips)throw Error('invalid ctx_toolTips')

      ctx_toolTips.save()
      ctx_toolTips.beginPath()
      ctx_toolTips.fillStyle = '#0000ff88'
      ctx_toolTips.translate(plane.cvs_toolTips.width/2,plane.cvs_toolTips.height/2)
      ctx_toolTips.arc(0,0,plane.cvs_toolTips.width/2-ctx_toolTips.lineWidth,0,Math.PI*2)
      ctx_toolTips.stroke()
      ctx_toolTips.fill()
      ctx_toolTips.restore()

      // let angle = (plane.rad/Math.PI*180).toFixed(2)
      // let speed = (Math.sqrt(plane.vx**2+plane.vy**2)*40000).toFixed(2)
      // let text = `方向角:${angle}°\n速度:${speed}km/h`
      // this.drawToolTips(plane.cvs_toolTips.width,plane.cvs_toolTips.height,text,ctx_toolTips)
      // plane.event.on('enter',(plane:Plane)=>{
      //   // plane.showToolTips=true
      //   console.log('enter',plane)
      // })
      plane.event.on('leave',(plane:Plane)=>{
        // plane.showToolTips=false
        console.log('leave',plane)
      })
      plane.event.on('mousemove',()=>{
        console.log('move',this)
      })
      plane.event.on('mousedown',(event:MouseEvent)=>{
        console.log('mousedown',event)
        this.spirits.forEach(v=>{
          if(v!==plane){
            v.showToolTips=false
          }
        })
        plane.showToolTips=!plane.showToolTips
        plane.isMouseDown = true
      })
      plane.event.on('mouseup',(event:MouseEvent)=>{
        console.log('up',plane,event)
        this.spirits.forEach((v:Plane)=>{
          if(v.isMouseDown&&v.overlap){
            plane.event.emit('click')
          }
          v.isMouseDown=false
        })
      })
      plane.event.on('click',()=>{
        console.log('click',this)
      })
      plane.event.on('move',(lng:number,lat:number)=>{
        // eventbus.emit('move',lng,lat)
      })
      this.spirits.push(plane)
    }
    this.preTime=performance.now()
  }
  async getImage(){
    const res = await fetch(textureUrl)
    const img = await res.blob()
    let bitmap = await createImageBitmap(img)
    let planeCvs = document.createElement('canvas')
    planeCvs.width = bitmap.width
    planeCvs.height = bitmap.height
    let planeCtx = planeCvs.getContext('bitmaprenderer')
    if(!planeCtx)throw Error('invalid planeCtx')
    planeCtx.transferFromImageBitmap(bitmap)
    this.spirits.forEach((plane:Plane)=>{
      let ctx = plane.cvs.getContext('2d', { willReadFrequently:true })
      if(!ctx)throw Error('invalid ctx!')
      let preCompositeOperation = ctx.globalCompositeOperation
      ctx.save()
      {
        ctx.fillStyle='red'
        ctx.fillRect(0,0,planeCvs.width,planeCvs.height)
        ctx.globalCompositeOperation='destination-in'
      }
      ctx.translate(plane.cvs.width/2,plane.cvs.height/2)
      ctx.rotate(plane.rad)
      ctx.drawImage(planeCvs,0,0,planeCvs.width,planeCvs.height,-plane.w/2,-plane.h/2,plane.w,plane.h)
      ctx.globalCompositeOperation=preCompositeOperation
      // {
      //   ctx.fillStyle='#ffffff88'
      //   ctx.strokeStyle='white'
      //   ctx.lineWidth=1
      //   ctx.fillRect(-plane.w/2,-plane.h/2,plane.w,plane.h)
      //   ctx.strokeRect(-plane.w/2+ctx.lineWidth,-plane.h/2+ctx.lineWidth,plane.w-ctx.lineWidth*2,plane.h-ctx.lineWidth*2)
      //   ctx.stroke()
      // }
      ctx.restore()
    })
    this.preTime=performance.now()
  }
  randMinMax(min:number, max:number, round:boolean|undefined=undefined):number{
    let val = min + (Math.random() * (max - min));
    if(round) val = Math.round(val);
    return val;
  }
  render(obj:any,ctx:CanvasRenderingContext2D){
    let now = performance.now()
    let deltaTime = now-this.preTime
    this.preTime = now
    this.quadtree.clear()
    for(let i=0;i<this.spirits.length;i++) {
      let item = this.spirits[i]
      if(item.showToolTips){
        item.event.emit('move',item.lng,item.lat)
      }
      item.x = lng2Pixel(item.lng,obj.imgX,2**obj.L,256)-item.width/2
      item.y = lat2Pixel(item.lat,obj.imgY,2**obj.L,256)-item.height/2
      item.lng += item.vx*deltaTime/1000;
      item.lat -= item.vy*deltaTime/1000;

      item.check = false
      item.overlap = false
      this.quadtree.insert(item);
    }
    if(this.isMouseOver){
      let candidates = this.quadtree.retrieve(this.myCursor) as Array<Plane>;
      //flag retrieved objects
      for(let i=0;i<candidates.length;i++) {
        let candidate = candidates[i]
        candidate.check = true
      }
      for(let i=candidates.length-1;i>=0;i--) {
        let candidate = candidates[i]
        let ctx = candidate.cvs.getContext('2d',{willReadFrequently:true})
        if(!ctx)throw Error('invalid ctx')
        let imgData = ctx.getImageData(0,0,candidate.width,candidate.height)
        ctx.save()
        ctx.globalCompositeOperation='destination-in'
        ctx.fillStyle='#fff'
        ctx.fillRect(this.myCursor.x-candidate.x,this.myCursor.y-candidate.y,this.myCursor.width,this.myCursor.height)
        let imgPixels = ctx.getImageData(this.myCursor.x-candidate.x,this.myCursor.y-candidate.y,this.myCursor.width,this.myCursor.height)
        out:
        for(let y = 0; y < imgPixels.height; y++){
          for(let x = 0; x < imgPixels.width; x++){
            let i = (y * 4) * imgPixels.width + x * 4
            if(imgPixels.data[i + 3]>0){
              candidate.overlap=true
              break out
            }
          }
        }
        ctx.restore()
        ctx.putImageData(imgData,0,0)
        if(candidate.overlap){
          break
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(this.myCursor.x, this.myCursor.y, this.myCursor.width, this.myCursor.height);
    }
    // this.drawQuadtree(ctx,this.quadtree)
    this.drawObjects(obj,ctx)
  }
  drawObjects(obj:any,ctx:CanvasRenderingContext2D) {
    let 矩形碰撞框 = false
    let 需要检测 = false
    let intersection = false
    for(var i=0;i<this.spirits.length;i++) {
      let item = this.spirits[i]
      ctx.save()
      ctx.translate(item.x,item.y)
      if(矩形碰撞框){
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(0, 0, item.width, item.height);
      }
      if(item.check) {
        if(item.overlap){
          if(intersection){
            ctx.save()
            ctx.translate(item.width/2,item.height/2)
            ctx.rotate(item.rad)
            ctx.fillStyle = 'rgba(48,255,48,0.5)';
            ctx.fillRect(-item.w/2,-item.h/2,item.w,item.h)
            ctx.restore()
          }
          this.drawStation(obj,ctx,item)
        }else{
          if(需要检测){
            ctx.fillStyle = 'rgba(48,255,48,0.5)';
            ctx.fillRect(0, 0, item.width, item.height);
          }
          this.drawStation(obj,ctx,item)
        }
      } else {
        this.drawStation(obj,ctx,item)
      }
      ctx.restore()





      let point0 = lngLat2Pixel(item.lng,item.lat,obj.imgX,obj.imgY,2**obj.L,256)
      let R = 5000/(2*Math.PI*6378137)*2**obj.L*256
      let point1 = {x:point0.x-R,y:point0.y-R}
      let point2 = {x:point0.x+R,y:point0.y-R}
      let point3 = {x:point0.x+R,y:point0.y+R}
      let point4 = {x:point0.x-R,y:point0.y+R}
      // let xy1 = pixel2XY(point1.x,point1.y,obj.imgX,obj.imgY,2**obj.L,256)
      // let xy2 = pixel2XY(point2.x,point2.y,obj.imgX,obj.imgY,2**obj.L,256)
      // let xy3 = pixel2XY(point3.x,point3.y,obj.imgX,obj.imgY,2**obj.L,256)
      // let xy4 = pixel2XY(point4.x,point4.y,obj.imgX,obj.imgY,2**obj.L,256)
      // let xy0 = pixel2XY(point0.x,point0.y,obj.imgX,obj.imgY,2**obj.L,256)
      // let d1 = Math.sqrt((xy1.x-xy0.x)**2+(xy1.y-xy0.y)**2)
      // let d2 = Math.sqrt((xy2.x-xy0.x)**2+(xy2.y-xy0.y)**2)
      // let d3 = Math.sqrt((xy3.x-xy0.x)**2+(xy3.y-xy0.y)**2)
      // let d4 = Math.sqrt((xy4.x-xy0.x)**2+(xy4.y-xy0.y)**2)
      // console.log(d1,d2,d3,d4)
      ctx.beginPath()
      ctx.strokeStyle='red'
      ctx.moveTo(point1.x,point1.y)
      ctx.lineTo(point2.x,point2.y)
      ctx.lineTo(point3.x,point3.y)
      ctx.lineTo(point4.x,point4.y)
      ctx.closePath()
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(point1.x,point1.y)
      ctx.lineTo(point3.x,point3.y)
      ctx.moveTo(point2.x,point2.y)
      ctx.lineTo(point4.x,point4.y)
      ctx.stroke()
      // item.cvs_toolTips&&item.showToolTips&&ctx.drawImage(
      //   item.cvs_toolTips,
      //   0,0,item.cvs_toolTips.width,item.cvs_toolTips.height,
      //   point0.x-D,point0.y-D,2*D,2*D
      // )
      ctx.beginPath()
      ctx.moveTo(point0.x,point0.y)
      ctx.arc(point0.x,point0.y,R,3/2*Math.PI,2*Math.PI)
      ctx.closePath()
      ctx.fillStyle='#0000ff88'
      ctx.stroke()
      ctx.fill()

      if(!item.lastOverlap&&item.overlap){
        this.spirits.forEach(v=>{
          if(v!==item&&v.lastOverlap&&!v.overlap){
            v.lastOverlap=false
            v.event.emit('leave',v)
          }
        })
        item.lastOverlap=true
        item.event.emit('enter',item)
      }else if(item.lastOverlap&&!item.overlap){
        item.lastOverlap=false
        item.event.emit('leave',item)
      }
    }
  }
  drawStation(obj:any,ctx:CanvasRenderingContext2D,item:Plane){
    item.cvs&&ctx.drawImage(item.cvs,0,0,item.cvs.width,item.cvs.height,0,0,item.width,item.height)
  }
  drawToolTips(width:number,height:number,text:string,ctx:CanvasRenderingContext2D){
    let radius=4
    let triangleW=10
    let triangleH=4
    ctx.save()
    ctx.fillStyle='#ffffffbb'
    ctx.beginPath()
    ctx.moveTo(radius,0)
    ctx.arc(width-radius,radius,radius,Math.PI*3/2,Math.PI*4/2)
    ctx.arc(width-radius,height-triangleH-radius,radius,Math.PI*0/2,Math.PI*1/2)
    ctx.lineTo(width/2+triangleW/2,height-triangleH)
    ctx.lineTo(width/2,height)
    ctx.lineTo(width/2-triangleW/2,height-triangleH)
    ctx.arc(radius,height-triangleH-radius,radius,Math.PI/2,Math.PI*2/2)
    ctx.arc(radius,radius,radius,Math.PI*2/2,Math.PI*3/2)
    ctx.fill()
    // ctx.translate(radius,radius)
    // ctx.fillStyle='black'
    // ctx.textBaseline='top'
    // ctx.font='20px kaiti'
    // ctx.fillText('100',0,0)


    let rect = {
      x:radius,
      y:radius,
      width:width-2*radius,
      height:height-2*radius-triangleH,
    }
    let fontSize = this.getFontSizeToFit(ctx, text, "Arial", rect.width, rect.height)
    ctx.font = fontSize + "px Arial"
    ctx.fillStyle='#000'
    this.fillTextCenter(ctx, text, rect.x, rect.y, rect.width, rect.height)

    ctx.restore()
  }
  drawQuadtree(ctx:any,node:Quadtree) {
    var bounds = node.bounds;
    //no subnodes? draw the current node
    if(node.nodes.length === 0) {
      ctx.strokeStyle = 'rgba(255,0,0,0.5)';
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    //has subnodes? drawQuadtree them!
    } else {
      for(var i=0;i<node.nodes.length;i++) {
        this.drawQuadtree(ctx,node.nodes[i]);
      }
    }
  }
  fillTextCenter(ctx:CanvasRenderingContext2D, text:string, x:number, y:number, width:number, height:number) {
    ctx.textBaseline = 'bottom';
    ctx.textAlign = "left";
    const lines = text.match(/[^\r\n]+/g);
    if(!lines)throw Error('invalid lines')
    for (let i = 0; i < lines.length; i++) {
      let xL = (width - x) / 2
      xL=0
      let yL = y + (height / (lines.length + 1)) * (i + 1)
      ctx.fillText(lines[i], x + xL, y + yL)
    }
  }
  getFontSizeToFit(ctx:CanvasRenderingContext2D, text:string, fontFace:string, width:number, height:number) {
    ctx.font = `1px ${fontFace}`;
    let fitFontWidth = Number.MAX_VALUE
    const lines = text.match(/[^\r\n]+/g);
    if(!lines)throw Error('invalid lines')
    lines.forEach((line:any) => {
        fitFontWidth = Math.min(fitFontWidth, width / ctx.measureText(line).width)
    })
    let fitFontHeight = height / (lines.length * 1.2); // if you want more spacing between line, you can increase this value
    return Math.min(fitFontHeight, fitFontWidth)
  }
}