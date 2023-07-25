import textureUrl from '~/assets/aircraft.png?url'
import featherUrl from '~/assets/feather.svg'
function getFeather(v:number){
  return (
    v<=0?{i:0,j:0}:
    v<=1?{i:1,j:0}:
    v<=2?{i:2,j:0}:
    v<=4?{i:3,j:0}:
    v<=6?{i:4,j:0}:
    v<=8?{i:5,j:0}:
    v<=10?{i:6,j:0}:
    v<=12?{i:0,j:1}:
    v<=14?{i:1,j:1}:
    v<=16?{i:2,j:1}:
    v<=18?{i:3,j:1}:
    v<=20?{i:4,j:1}:
    v<=22?{i:5,j:1}:
    v<=24?{i:6,j:1}:
    v<=26?{i:0,j:2}:
    v<=28?{i:1,j:2}:
    v<=30?{i:2,j:2}:
    v<=32?{i:3,j:2}:
    v<=34?{i:4,j:2}:
    v<=36?{i:5,j:2}:
    v<=38?{i:6,j:2}:
    v<=40?{i:0,j:3}:
    v<=42?{i:1,j:3}:
    v<=44?{i:2,j:3}:
    v<=46?{i:3,j:3}:
    v<=48?{i:4,j:3}:
    v<=50?{i:5,j:3}:
    v<=52?{i:6,j:3}:
    v<=54?{i:0,j:4}:
    v<=56?{i:1,j:4}:
    v<=58?{i:2,j:4}:
    {i:3,j:4}
  )
}

let colors={0:'#0000ff',4:'#002aff',8:'#0054ff',12:'#007eff',16:'#00a8ff',20:'#00d2ff',24:'#14d474',28:'#a6dd00',32:'#ffe600',36:'#ffb300',40:'#ff8000',44:'#ff4d00',48:'#ff1a00',52:'#e60000',56:'#b30000'}
function getColor(v:number){
  return v>=56?colors[56]:
  v>=52?colors[52]:
  v>=48?colors[48]:
  v>=44?colors[44]:
  v>=40?colors[40]:
  v>=36?colors[36]:
  v>=32?colors[32]:
  v>=28?colors[28]:
  v>=24?colors[24]:
  v>=20?colors[20]:
  v>=16?colors[16]:
  v>=12?colors[12]:
  v>=8?colors[8]:
  v>=4?colors[4]:
  colors[0]
}
import Quadtree, { Rect } from '~/tools/quadtree'
import { wgs84togcj02 } from '../workers/mapUtil'
import { lng2Pixel, lat2Pixel, pixel2Lng, pixel2Lat, pixel2LngLat } from '../js/core'
import Eventbus,{ eventbus } from '~/eventbus'
import Plane from './Plane'
export default class PlaneLayer{
  isMouseOver:Boolean
  myCursor:Rect
  quadtree:Quadtree
  spirits:Array<Plane>
  preTime:number
  event:Eventbus
  constructor(){
    this.event = new Eventbus()
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
    this.isMouseOver=true
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
    let boundary=[110,120,41,38]
    let POINT = {lng:116.39139324235674,lat:39.90723893689098}
    for(var i=0;i<100;i++) {
      let plane = new Plane()
      plane.name=i.toString()
      // plane.vx = this.randMinMax(-300,300)
      // plane.vy = this.randMinMax(-300,300)
      plane.vx = this.randMinMax(-20,20)
      plane.vy = this.randMinMax(-20,20)
      plane.vx=0
      plane.vy=0
      plane.v = this.randMinMax(1,60)
      plane.lng=this.randMinMax(boundary[0],boundary[1])
      plane.lat=this.randMinMax(boundary[3],boundary[2])
      // let convert = wgs84togcj02(POINT.lng,POINT.lat)
      // plane.lng=convert[0]
      // plane.lat=convert[1]
      plane.cvs = document.createElement('canvas')
      if(plane.vx==0&&plane.vy==0){
        plane.rad = Math.random()*360/180*Math.PI
        // plane.rad = Math.PI/180*0
      }else{
        plane.rad = Math.atan2(-plane.vx,plane.vy)+Math.PI
      }
      // plane.w=16*2
      // plane.h=17*2
      plane.w=15
      plane.h=30
      // plane.anchor={x:0,y:0}
      plane.anchor={x:-0.5,y:0.5}
      plane.compute_width_height()
      plane.cvs.width=plane.width
      plane.cvs.height=plane.height
      plane.x=this.randMinMax(0, 640)
      plane.y=this.randMinMax(0, 480)
      // plane.x=100+i*10
      // plane.y=100+i*10
      plane.cvs_toolTips = document.createElement('canvas')
      plane.cvs_toolTips.width = 150
      plane.cvs_toolTips.height = 60
      let ctx_toolTips = plane.cvs_toolTips.getContext('2d',{willReadFrequently:true})
      if(!ctx_toolTips)throw Error('invalid ctx_toolTips')

      let angle = (plane.rad/Math.PI*180).toFixed(2)
      let speed = (Math.sqrt(plane.vx**2+plane.vy**2)*3.6).toFixed(2)
      let speed1 = Math.sqrt(plane.vx**2+plane.vy**2).toFixed(2)
      let speed2 = plane.v.toFixed(2)

      let text = `雷达:${plane.name}\n方向角:${angle}°\n速度:${speed2}m/s`
      this.drawToolTips(plane.cvs_toolTips.width,plane.cvs_toolTips.height,text,ctx_toolTips)
      plane.event.on('enter',(plane:Plane)=>{
        // plane.showToolTips=true
        console.log('enter',plane)
      })
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
        eventbus.emit('move',lng,lat)
      })
      this.spirits.push(plane)




    }
    this.preTime=performance.now()

    let image = new Image()
    image.width=15*7
    image.height=30*6
    image.onload = () => {
      this.preTime=performance.now()
      this.spirits.forEach(plane=>{
        let planeCvs = document.createElement('canvas')
        planeCvs.width = image.width
        planeCvs.height = image.height
        let planeCtx = planeCvs.getContext('2d')
        if(!planeCtx)throw Error('invalid planeCtx')
        planeCtx.drawImage(image,0,0)
          let ctx = plane.cvs.getContext('2d', { willReadFrequently:true })
          if(!ctx)throw Error('invalid ctx!')
          let preCompositeOperation = ctx.globalCompositeOperation
          ctx.save()
          {
            ctx.fillStyle=getColor(plane.v)
            ctx.fillRect(0,0,plane.cvs.width,plane.cvs.height)
            ctx.globalCompositeOperation='destination-in'
          }
          ctx.translate(plane.cvs.width/2,plane.cvs.height/2)
          ctx.rotate(plane.rad)
          const {i,j} = getFeather(plane.v)
          ctx.drawImage(planeCvs,15*i,30*j,14,29,-plane.w/2,-plane.h/2,plane.w,plane.h)
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
        plane.imgPixel= ctx.getImageData(0,0,plane.width,plane.height)
      })
    }
    image.src = featherUrl
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

      item.x = lng2Pixel(item.lng,obj.imgX,2**obj.L,256) - item.width/2
      item.y = lat2Pixel(item.lat,obj.imgY,2**obj.L,256) - item.height/2

      item.lng = pixel2Lng(item.x+item.vx*deltaTime/1000/(2*Math.PI*6378137)*2**obj.L*256+item.width/2,obj.imgX,2**obj.L,256)
      item.lat = pixel2Lat(item.y+item.vy*deltaTime/1000/(2*Math.PI*6378137)*2**obj.L*256+item.height/2,obj.imgY,2**obj.L,256)
      item.x -= item.pt.x
      item.y -= item.pt.y
      ctx.beginPath()
      ctx.fillStyle='blue'
      ctx.arc(item.x+item.width/2+item.pt.x,item.y+item.height/2+item.pt.y,4,0,Math.PI*2)
      ctx.fill()
      // item.lng += item.vx*deltaTime/1000;
      // item.lat -= item.vy*deltaTime/1000;

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
        let plane = candidates[i]
        if(plane.x<=this.myCursor.x+this.myCursor.width&&this.myCursor.x<=plane.x+plane.width&&plane.y<=this.myCursor.y+this.myCursor.height&&this.myCursor.y<=plane.y+plane.height){
          let imgPixels = plane.imgPixel
          exit:
          for(let y = Math.max(0,Math.round(this.myCursor.y-plane.y)); y < Math.min(imgPixels.height,Math.round(this.myCursor.y-plane.y+this.myCursor.height)); y++){
            for(let x = Math.max(0,Math.round(this.myCursor.x-plane.x)); x < Math.min(imgPixels.width,Math.round(this.myCursor.x-plane.x+this.myCursor.width)); x++){
              let i = (y * imgPixels.width + x) * 4
              if(imgPixels.data[i + 3]){
                plane.overlap=true
                break exit
              }
            }
          }
          if(plane.overlap){
            break
          }
        }
      }


      ctx.fillStyle = '#ffffff88';
      ctx.fillRect(this.myCursor.x, this.myCursor.y, this.myCursor.width, this.myCursor.height);
    }
    // this.drawQuadtree(ctx,this.quadtree)
    this.drawObjects(ctx)
  }
  drawObjects(ctx:any) {
    let 矩形碰撞框 = false
    let 需要检测 = false
    let intersection = true
    for(var i=0;i<this.spirits.length;i++) {
      let item = this.spirits[i]
      if(item.x+item.width>this.quadtree.bounds.x
        &&item.x<this.quadtree.bounds.x+this.quadtree.bounds.width
        &&item.y+item.height>this.quadtree.bounds.y
        &&item.y<this.quadtree.bounds.y+this.quadtree.bounds.height){
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
            item.cvs&&ctx.drawImage(item.cvs,0,0,item.cvs.width,item.cvs.height,0,0,item.width,item.height)
            item.showToolTips&&item.cvs_toolTips&&ctx.drawImage(
              item.cvs_toolTips,
              0,0,item.cvs_toolTips.width,item.cvs_toolTips.height,
              -item.cvs_toolTips.width/2+item.width/2+item.pt.x,-item.cvs_toolTips.height,item.cvs_toolTips.width,item.cvs_toolTips.height
            )
          }else{
            if(需要检测){
              ctx.fillStyle = 'rgba(48,255,48,0.5)';
              ctx.fillRect(0, 0, item.width, item.height);
            }
            item.cvs&&ctx.drawImage(item.cvs,0,0,item.cvs.width,item.cvs.height,0,0,item.width,item.height)
            item.showToolTips&&item.cvs_toolTips&&ctx.drawImage(
              item.cvs_toolTips,
              0,0,item.cvs_toolTips.width,item.cvs_toolTips.height,
              -item.cvs_toolTips.width/2+item.width/2+item.pt.x,-item.cvs_toolTips.height,item.cvs_toolTips.width,item.cvs_toolTips.height
            )
          }
        } else {
          item.cvs&&ctx.drawImage(item.cvs,0,0,item.cvs.width,item.cvs.height,0,0,item.width,item.height)
          item.showToolTips&&item.cvs_toolTips&&ctx.drawImage(
            item.cvs_toolTips,
            0,0,item.cvs_toolTips.width,item.cvs_toolTips.height,
            -item.cvs_toolTips.width/2+item.width/2+item.pt.x,-item.cvs_toolTips.height,item.cvs_toolTips.width,item.cvs_toolTips.height
          )
        }
        ctx.restore()
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
    let fitFontHeight = height / (lines.length * 1.4); // if you want more spacing between line, you can increase this value
    return Math.min(fitFontHeight, fitFontWidth)
  }
}