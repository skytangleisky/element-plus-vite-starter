import Eventbus from '~/eventbus'
import { mat3, vec2 } from 'gl-matrix'
let m = mat3.create();
mat3.translate(m,m,vec2.fromValues(+5,0))
mat3.rotate(m,m,Math.PI)
console.log(m)
export default class Plane {
  name:string
  x: number
  y: number
  w:number
  h:number
  vx:number
  vy:number
  v:number
  mousedown: Function
  mouseenter: Function
  width: number
  height: number
  check:boolean
  cvs:HTMLCanvasElement
  showToolTips:boolean
  rad:number
  lng:number
  lat:number
  overlap:boolean
  event:Eventbus
  lastOverlap:boolean
  isMouseDown:boolean
  anchor:{x:number,y:number}
  pt:{x:number,y:number}
  imgPixel:ImageData
  constructor(arg:{}|undefined=undefined){
    this.name=''
    this.x=0
    this.y=0
    this.w=32
    this.h=32
    this.vx=0
    this.vy=0
    this.v=0
    this.mousedown=(e:PointerEvent)=>{
      console.log(e,this)
    }
    this.mouseenter=(e:MouseEvent)=>{
      console.log(e,this)
    }
    this.width=32
    this.height=32
    this.check=false
    this.cvs=document.createElement('canvas')
    this.rad=0
    this.lng=0
    this.lat=0
    this.overlap=false
    this.lastOverlap=false
    this.isMouseDown=false
    this.showToolTips=false
    this.event=new Eventbus()
    this.anchor={x:0,y:0}
    this.pt = {x:0,y:0}
    this.imgPixel = new ImageData(this.width,this.height)
    Object.assign(this,arg)
  }
  compute_width_height(){
    let x0 = this.w/2
    let y0 = this.h/2
    let rad = this.rad
    let pt1=this.processXY(0,0,x0,y0,rad)
    let pt2=this.processXY(this.w,0,x0,y0,rad)
    let pt3=this.processXY(this.w,this.h,x0,y0,rad)
    let pt4=this.processXY(0,this.h,x0,y0,rad)
    this.width=Math.max(pt1.x,pt2.x,pt3.x,pt4.x)-Math.min(pt1.x,pt2.x,pt3.x,pt4.x)
    this.height=Math.max(pt1.y,pt2.y,pt3.y,pt4.y)-Math.min(pt1.y,pt2.y,pt3.y,pt4.y)

    let m = mat3.create()
    mat3.translate(m,m,vec2.fromValues(this.anchor.x*this.w,this.anchor.y*this.h))
    mat3.transpose(m,m)
    mat3.rotate(m,m,-rad)
    this.pt={x:m[2],y:m[5]}
  }
  processXY(x:number,y:number,x0:number,y0:number,rad:number){
    const m = mat3.create()
    mat3.translate(m,m,vec2.fromValues(x-x0,y-y0))
    mat3.transpose(m,m)
    mat3.rotate(m,m,rad)
    mat3.translate(m,m,vec2.fromValues(x0,y0))
    return {
      x:m[2],
      y:m[5],
    }
  }
}