export interface interfaceButton{
  type:'button'
  label:string
  value:string
  click:Function
}
export interface interfaceCurve{
  type:'curve'
  label:string
  value:
  {
    [key: string]: {
      value?: number;
      max?: number;
      min?: number;
      strokeStyle?: string;
    }
  }
}
export interface interfaceText{
  type:'text'
  label:string
  value:string
}
export interface interfaceSelect{
  type:'select'
  label:string
  value:boolean
  placeholder:string
  options:Array<{
    key:any
    label:string
    value:any
  }>
}
export interface interfaceCheckbox{
  type:'checkbox'
  label:string
  value:boolean
}
export interface interfaceColor{
  type:'color'
  label:string
  value:{
    r:number//0~255
    g:number//0~255
    b:number//0~255
    a:number//0~1
  }
}
export interface interfaceRange{
  type:'range'
  label:string
  value:number
  min:number
  max:number
  arr:number[]
}
export interface interfaceFolder{
  type:'folder'
  opened:boolean
  label:string
}
export type Item = (interfaceCheckbox|interfaceColor|interfaceRange|interfaceFolder|interfaceSelect|interfaceText|interfaceCurve|interfaceButton) & {
  children?:Item[]
}