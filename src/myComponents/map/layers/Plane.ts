import { Rect } from '@timohausmann/quadtree-js'
import Eventbus from '~/eventbus'
import { mat3, vec2 } from '~/tools/gl-matrix'
export default class Plane implements Rect {
  name:string
  x: number
  y: number
  protected w:number
  protected h:number
  vx:number
  vy:number
  width: number
  height: number
  check:boolean
  cvs:HTMLCanvasElement|undefined
  cvs_toolTips:HTMLCanvasElement|undefined
  showToolTips?:boolean
  rad:number
  lng:number
  lat:number
  overlap:boolean
  event?:Eventbus
  lastOverlap:boolean
  constructor(arg:{}|undefined=undefined){
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
    this.name=''
    this.x=0
    this.y=0
    this.w=0
    this.h=0
    this.vx=0
    this.vy=0
    this.width=0
    this.height=0
    this.check=false
    this.rad=0
    this.lng=0
    this.lat=0
    this.overlap=false
    this.lastOverlap=false
    this.event=new Eventbus()
    Object.assign(this,arg)
  }
  getW=()=>this.w
  getH=()=>this.h
  setW(w:number){
    this.w=w
    this.compute_width_height()
  }
  setH(h:number){
    this.h = h
    this.compute_width_height()
  }
  compute_width_height(){
    let pt1=this.processXY(0,0,this.w/2,this.h/2,this.rad)
    let pt2=this.processXY(this.w,0,this.w/2,this.h/2,this.rad)
    let pt3=this.processXY(this.w,this.h,this.w/2,this.h/2,this.rad)
    let pt4=this.processXY(0,this.h,this.w/2,this.h/2,this.rad)
    this.width=Math.max(pt1.x,pt2.x,pt3.x,pt4.x)-Math.min(pt1.x,pt2.x,pt3.x,pt4.x)
    this.height=Math.max(pt1.y,pt2.y,pt3.y,pt4.y)-Math.min(pt1.y,pt2.y,pt3.y,pt4.y)
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
}