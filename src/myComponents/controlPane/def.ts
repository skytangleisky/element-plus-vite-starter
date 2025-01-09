interface Color{
  r:number//0~255
  g:number//0~255
  b:number//0~255
  a:number//0~1
}
export interface interfaceCheckbox{
  type:'checkbox'
  label:string
  value:boolean
}
export interface interfaceColor{
  type:'color'
  label:string
  value:Color
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
export type Item = (interfaceCheckbox|interfaceColor|interfaceRange|interfaceFolder) & {
  children?:Item[]
}