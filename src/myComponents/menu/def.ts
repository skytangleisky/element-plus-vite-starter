interface Item{
  name:String;
  children?:Array<Item>;
  left?:Boolean;
  right?:Boolean;
  leftImgSrc?:string;
  onClick?:Function;
}
const checkClick = (e:Event,item:Item,k:number) => {
  if(item.children){
    let v = item.children[k]
    if(v.leftImgSrc == '/src/assets/checked.svg')
      v.leftImgSrc = '/src/assets/unchecked.svg'
    else
      v.leftImgSrc = '/src/assets/checked.svg'
  }
}
const radioClick = (e:Event,item:Item,k:number) => {
  if(item.children){
    let v = item.children[k]
    item.children.forEach((V:Item,K:number)=>{
      if(K!=k&&V.leftImgSrc)delete V.leftImgSrc
    })
    if(v.leftImgSrc!='/src/assets/checked.svg')
      v.leftImgSrc = '/src/assets/checked.svg'
  }
}
export {
  Item,
  checkClick,
  radioClick,
}