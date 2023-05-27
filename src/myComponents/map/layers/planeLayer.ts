import textureUrl from '../../../assets/aircraft.png?url'
import Quadtree, { Rect } from '@timohausmann/quadtree-js'
import { mat3, vec2, vec3 } from '~/tools/gl-matrix'
import { wgs84togcj02 } from '../workers/mapUtil'
import { lng2Pixel, lat2Pixel } from '../js/core'
interface Plane extends Rect {
  name:string,
  vx:number,
  vy:number,
  check:boolean,
  cvs:HTMLCanvasElement,
  cvs_toolTips:HTMLCanvasElement,
  rad:number,
  lng:number,
  lat:number,
  over:boolean,
}
export default class PlaneLayer{
  isMouseOver:Boolean
  myCursor:Rect
  quadtree:Quadtree
  myObjects:Array<Plane>
  preTime:number
  constructor(){
    /*
    let position = {x:10,y:0}
    let rad = Math.PI/2
    let scale = {scaleX:2,scaleY:2}
    const m1 = mat3.create()
    mat3.multiply(m1,m1,mat3.fromValues(
    1,0,position.x,
    0,1,position.y,
    0,0,1))
    mat3.multiply(m1,m1,mat3.fromValues(
    1,0,-5,
    0,1,0,
    0,0,1))
    mat3.multiply(m1,m1,mat3.fromValues(
    Math.cos(rad),Math.sin(rad),0,
    -Math.sin(rad),Math.cos(rad),0,
    0,0,1))
    mat3.multiply(m1,m1,mat3.fromValues(
    scale.scaleX,0,0,
    0,scale.scaleY,0,
    0,0,1))
    mat3.multiply(m1,m1,mat3.fromValues(
    1,0,+5,
    0,1,0,
    0,0,1))
    console.log(m1)

    const m2=mat3.create()
    mat3.translate(m2,m2,vec2.fromValues(position.x,position.y))
    mat3.translate(m2,m2,vec2.fromValues(-5,0))
    mat3.rotate(m2,m2,rad)
    mat3.scale(m2,m2,vec2.fromValues(scale.scaleX,scale.scaleY))
    mat3.translate(m2,m2,vec2.fromValues(+5,0))
    console.log(m2)
    */
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
    this.myObjects=Array<Plane>()
    this.getImage()
    this.preTime=performance.now()
  }
  async getImage(){
    let boundary=[110,120,41,38]
    const res = await fetch(textureUrl)
    const img = await res.blob()
    let bitmap = await createImageBitmap(img)
    let planeCvs = document.createElement('canvas')
    planeCvs.width = bitmap.width
    planeCvs.height = bitmap.height
    let planeCtx = planeCvs.getContext('bitmaprenderer')
    if(!planeCtx)throw Error('invalid planeCtx')
    planeCtx.transferFromImageBitmap(bitmap)
    for(var i=0;i<500;i++) {
      let vx = this.randMinMax(-2/100,2/100)
      let vy = this.randMinMax(-1/100,1/100)
      let cvs = document.createElement('canvas')
      let rad = Math.atan2(-vx,vy)+Math.PI
      // rad=Math.PI/180*30
      let w = 16*2
      let h = 17*2
      let pt1=this.processXY(0,0,w/2,h/2,rad)
      let pt2=this.processXY(w,0,w/2,h/2,rad)
      let pt3=this.processXY(w,h,w/2,h/2,rad)
      let pt4=this.processXY(0,h,w/2,h/2,rad)
      let width=Math.max(pt1.x,pt2.x,pt3.x,pt4.x)-Math.min(pt1.x,pt2.x,pt3.x,pt4.x)
      let height=Math.max(pt1.y,pt2.y,pt3.y,pt4.y)-Math.min(pt1.y,pt2.y,pt3.y,pt4.y)
      cvs.width=width
      cvs.height=height
      let ctx = cvs.getContext('2d', { willReadFrequently:true })
      if(!ctx)throw Error('invalid ctx!')
      ctx.save()
      ctx.translate(cvs.width/2,cvs.height/2)
      ctx.rotate(rad)
      ctx.drawImage(planeCvs,0,0,planeCvs.width,planeCvs.height,-w/2,-h/2,w,h)
      {
        // ctx.strokeStyle='white'
        // ctx.strokeRect(-w/2,-h/2,w,h)
        // ctx.stroke()
      }
      ctx.restore()
      let x=this.randMinMax(0, 640)
      let y=this.randMinMax(0, 480)
      let cvs_toolTips = document.createElement('canvas')
      cvs_toolTips.width = 100
      cvs_toolTips.height = 50
      let ctx_toolTips = cvs_toolTips.getContext('2d')
      if(!ctx_toolTips) throw Error('invalid ctx_toolTips')

      let angle = (rad/Math.PI*180).toFixed(2)
      let speed = (Math.sqrt(vx**2+vy**2)*40000).toFixed(2)
      let text = `方向角:${angle}°\n速度:${speed}km/h`
      this.drawToolTips(cvs_toolTips.width,cvs_toolTips.height,text,ctx_toolTips)
      this.myObjects.push({
        name:i.toString(),
        lng:this.randMinMax(boundary[0],boundary[1]),
        lat:this.randMinMax(boundary[3],boundary[2]),
        x,
        y,
        width,
        height,
        vx,
        vy,
        check: false,
        cvs,
        cvs_toolTips,
        rad,
        over:false,
      })
    }
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
    for(var i=0;i<this.myObjects.length;i=i+1) {
      let item = this.myObjects[i]

      item.x = lng2Pixel(item.lng,obj.imgX,2**obj.L,256)
      item.y = lat2Pixel(item.lat,obj.imgY,2**obj.L,256)

      item.lng += item.vx*deltaTime/1000;
      item.lat -= item.vy*deltaTime/1000;
      item.check = false
      item.over = false
      this.quadtree.insert(item);
    }
    if(this.isMouseOver){
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(this.myCursor.x, this.myCursor.y, this.myCursor.width, this.myCursor.height);
      let candidates:Array<Plane> = this.quadtree.retrieve(this.myCursor);
      //flag retrieved objects
      for(i=0;i<candidates.length;i++) {
        let candidate = candidates[i]
        candidate.check = true
      }
      for(i=candidates.length-1;i>=0;i--) {
        let candidate = candidates[i]
        let ctx = candidate.cvs.getContext('2d')
        if(!ctx)throw Error('invalid ctx')
        let imgData = ctx.getImageData(0,0,candidate.width,candidate.height)
        ctx.save()
        ctx.globalCompositeOperation='destination-in'
        ctx.fillStyle='#fff'
        ctx.fillRect(this.myCursor.x-candidate.x,this.myCursor.y-candidate.y,this.myCursor.width,this.myCursor.height)
        let imgPixels = ctx.getImageData(this.myCursor.x-candidate.x,this.myCursor.y-candidate.y,this.myCursor.width,this.myCursor.height)
        for(let y = 0; y < imgPixels.height; y++){
          for(let x = 0; x < imgPixels.width; x++){
            let i = (y * 4) * imgPixels.width + x * 4
            if(imgPixels.data[i + 3]>0){
              candidate.over = true
              break
            }
          }
        }
        ctx.restore()
        ctx.putImageData(imgData,0,0)
        if(candidate.over)break
      }
    }
    this.drawQuadtree(ctx,this.quadtree)
    this.drawObjects(ctx)
  }
  processXY(x:number,y:number,x0:number,y0:number,rad:number){
    const m = mat3.create()
    mat3.translate(m,m,vec2.fromValues(x-x0,y-y0))
    mat3.rotate(m,m,rad)
    mat3.translate(m,m,vec2.fromValues(x0,y0))

    // const m1 = mat3.create()
    // mat3.multiply(m1,m1,mat3.fromValues(
    // 1,0,x,
    // 0,1,y,
    // 0,0,1))
    // mat3.multiply(m1,m1,mat3.fromValues(
    // 1,0,-x0,
    // 0,1,-y0,
    // 0,0,1))
    // mat3.multiply(m1,m1,mat3.fromValues(
    // Math.cos(rad),Math.sin(rad),0,
    // -Math.sin(rad),Math.cos(rad),0,
    // 0,0,1))
    // mat3.multiply(m1,m1,mat3.fromValues(
    // 1,0,x0,
    // 0,1,y0,
    // 0,0,1))
    return {
      x:m[2],
      y:m[5],
    }
  }
  drawObjects(ctx:any) {
    for(var i=0;i<this.myObjects.length;i++) {
      let item = this.myObjects[i]
      ctx.save()
      ctx.translate(item.x,item.y)
      if(item.check) {
        if(item.over){
          ctx.fillStyle = 'rgba(48,255,48)';
          ctx.fillRect(0, 0, item.width, item.height);
          ctx.drawImage(item.cvs,0,0,item.cvs.width,item.cvs.height,0,0,item.width,item.height)
          ctx.drawImage(item.cvs_toolTips,0,0,item.cvs_toolTips.width,item.cvs_toolTips.height,-item.cvs_toolTips.width/2+item.width/2,-item.cvs_toolTips.height,item.cvs_toolTips.width,item.cvs_toolTips.height)
        }else{
          ctx.fillStyle = 'rgba(48,255,48,0.5)';
          ctx.fillRect(0, 0, item.width, item.height);
          ctx.drawImage(item.cvs,0,0,item.cvs.width,item.cvs.height,0,0,item.width,item.height)
          ctx.drawImage(item.cvs_toolTips,0,0,item.cvs_toolTips.width,item.cvs_toolTips.height,-item.cvs_toolTips.width/2+item.width/2,-item.cvs_toolTips.height,item.cvs_toolTips.width,item.cvs_toolTips.height)
        }
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(0, 0, item.width, item.height);
        ctx.drawImage(item.cvs,0,0,item.cvs.width,item.cvs.height,0,0,item.width,item.height)
        ctx.drawImage(item.cvs_toolTips,0,0,item.cvs_toolTips.width,item.cvs_toolTips.height,-item.cvs_toolTips.width/2+item.width/2,-item.cvs_toolTips.height,item.cvs_toolTips.width,item.cvs_toolTips.height)
      }
      ctx.restore()
    }
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