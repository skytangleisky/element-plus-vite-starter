interface Item{
  name:String;
  children?:Array<Item>;
  left?:Boolean;
  right?:Boolean;
  leftImgSrc?:boolean;
  onClick?:Function;
}
const checkClick = (e:Event,item:Item,k:number) => {
  if(item.children&&item.children[k]){
    let v = item.children[k]
    v.leftImgSrc=!v.leftImgSrc
  }
}
const radioClick = (e:Event,item:Item,k:number) => {
  if(item.children){
    let v = item.children[k]
    item.children.forEach((V:Item,K:number)=>{
      if(K!=k&&V.leftImgSrc==true){
        V.leftImgSrc=false
      }
    })
    v.leftImgSrc = true
  }
}
export {
  Item,
  checkClick,
  radioClick,
}