import textureUrl from '../../../assets/aircraft.png?url'
import Quadtree, { Rect } from '@timohausmann/quadtree-js'
import { mat3, vec2, vec3 } from 'gl-matrix'
interface Plane extends Rect {
  name:string,
  vx:number,
  vy:number,
  check:boolean,
  X:number,
  Y:number,
  W:number,
  H:number,
  rad:number,
}
export default class PlaneLayer{
  isMouseOver:Boolean
  myCursor:Rect
  quadtree:Quadtree
  myObjects:Array<Plane>
  preTime:number
  planeCvs:HTMLCanvasElement
  constructor(){
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
    for(var i=0;i<200;i++) {
      let vx = this.randMinMax(-20,20)
      let vy = this.randMinMax(-80,80)
      let X=this.randMinMax(0, 640)
      let Y=this.randMinMax(0, 480)
      let W=16*2
      let H=17*2
      this.myObjects.push({
        name:i.toString(),
        x: X,
        y: Y,
        width: W,
        height: H,
        X,
        Y,
        W,
        H,
        vx,
        vy,
        rad:Math.atan2(-vx,vy)+Math.PI,
        check: false
      });
    }
    this.planeCvs = document.createElement('canvas')
    this.getImage()
    this.preTime=performance.now()
  }
  async getImage(){
    const res = await fetch(textureUrl)
    const img = await res.blob()
    let bitmap = await createImageBitmap(img)
    this.planeCvs.width = bitmap.width
    this.planeCvs.height = bitmap.height
    this.planeCvs.getContext('bitmaprenderer')?.transferFromImageBitmap(bitmap)
  }
  randMinMax(min:number, max:number, round:boolean|undefined=undefined){
    var val = min + (Math.random() * (max - min));
    if(round) val = Math.round(val);
    return val;
  }
  render(obj:any,ctx:any){
    let now = performance.now()
    let deltaTime = now-this.preTime
    this.preTime = now
    this.quadtree.clear()
    for(var i=0;i<this.myObjects.length;i=i+1) {
      let obj = this.myObjects[i]
      obj.X += obj.vx*deltaTime/1000;
      obj.Y += obj.vy*deltaTime/1000;
      obj.check = false;
      if(obj.X > this.quadtree.bounds.width) obj.X = this.quadtree.bounds.x;
      if(obj.X < this.quadtree.bounds.x) obj.X = this.quadtree.bounds.width;
      if(obj.Y > this.quadtree.bounds.height) obj.Y = this.quadtree.bounds.y;
      if(obj.Y < this.quadtree.bounds.y) obj.Y = this.quadtree.bounds.height;

      let pt1=this.processXY(obj.X          ,obj.Y           ,obj.X+obj.W/2,obj.Y+obj.H/2,obj.rad)
      let pt2=this.processXY(obj.X+obj.W,obj.Y           ,obj.X+obj.W/2,obj.Y+obj.H/2,obj.rad)
      let pt3=this.processXY(obj.X+obj.W,obj.Y+obj.H,obj.X+obj.W/2,obj.Y+obj.H/2,obj.rad)
      let pt4=this.processXY(obj.X          ,obj.Y+obj.H,obj.X+obj.W/2,obj.Y+obj.H/2,obj.rad)
      let x=Math.min(pt1.x,pt2.x,pt3.x,pt4.x)
      let y=Math.min(pt1.y,pt2.y,pt3.y,pt4.y)
      let w=Math.max(pt1.x,pt2.x,pt3.x,pt4.x)-x
      let h=Math.max(pt1.y,pt2.y,pt3.y,pt4.y)-y
      ctx.strokeStyle='yellow'
      ctx.strokeRect(x,y,w,h)
      obj.x=x
      obj.y=y
      obj.width=w
      obj.height=h
      this.quadtree.insert(obj);
    }
    if(this.isMouseOver){
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(this.myCursor.x, this.myCursor.y, this.myCursor.width, this.myCursor.height);
      let candidates:Array<Plane> = this.quadtree.retrieve(this.myCursor);
      //flag retrieved objects
      for(i=0;i<candidates.length;i++) {
        candidates[i].check = true;
      }
    }
    this.drawQuadtree(ctx,this.quadtree)
    this.drawObjects(ctx)
  }
  boundary(bounds:any){
    this.quadtree.bounds=bounds
  }
  processXY(x:number,y:number,x0:number,y0:number,rad:number){
    // rad=30/180*Math.PI
    // let m=mat3.create()
    // mat3.translate(m,m,vec2.fromValues(x,y))//平移
    // mat3.translate(m,m,vec2.fromValues(-x0,-y0))//平移
    // mat3.rotate(m,m,rad)//旋转
    // mat3.translate(m,m,vec2.fromValues(x0,y0))
    // mat3.transpose(m,m)
    const m = mat3.create()
    mat3.multiply(m,m,mat3.fromValues(1,0,x,0,1,y,0,0,1))
    mat3.multiply(m,m,mat3.fromValues(1,0,-x0,0,1,-y0,0,0,1))
    mat3.multiply(m,m,mat3.fromValues(Math.cos(-rad),Math.sin(-rad),0,-Math.sin(-rad),Math.cos(-rad),0,0,0,1))
    mat3.multiply(m,m,mat3.fromValues(1,0,0,0,1,0,0,0,1))
    mat3.multiply(m,m,mat3.fromValues(1,0,x0,0,1,y0,0,0,1))
    let a = m[2]
    let b = m[5]
    let c = m[8]
    return {
      x:a,
      y:b,
    }
  }
  drawObjects(ctx:any) {
    var obj;
    for(var i=0;i<this.myObjects.length;i++) {
      obj = this.myObjects[i]
      ctx.save()
      // ctx.beginPath()
      // ctx.moveTo(pt1.x,pt1.y)
      // ctx.lineTo(pt2.x,pt2.y)
      // ctx.lineTo(pt3.x,pt3.y)
      // ctx.lineTo(pt4.x,pt4.y)
      // ctx.closePath()
      // ctx.stroke()
      ctx.translate(obj.X+obj.W/2,obj.Y+obj.H/2)
      ctx.rotate(obj.rad)
      if(obj.check) {
        ctx.fillStyle = 'rgba(48,255,48,0.5)';
        ctx.fillRect(-obj.W/2, -obj.H/2, obj.W, obj.H);
        ctx.drawImage(this.planeCvs,0,0,this.planeCvs.width,this.planeCvs.height,-obj.W/2,-obj.H/2,obj.W,obj.H)
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.strokeRect(-obj.W/2, -obj.H/2, obj.W, obj.H);
        ctx.drawImage(this.planeCvs,0,0,this.planeCvs.width,this.planeCvs.height,-obj.W/2,-obj.H/2,obj.W,obj.H)
      }
      ctx.restore()
    }
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
}